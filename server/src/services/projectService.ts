import axios from 'axios';
import { s3Client } from '../utils/s3';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { 
  CreateProjectQuery, 
  SearchQuery, 
  LocationMongoResponse, 
  ProjectPayload, 
  NotePayloadData, 
  StatusPayload, 
  MapPayloadData,
  NoteDataResponse,
  ScheduleMongoResponse,
} from "../utils/types";
import { GoogleGeocodeResponse } from '../utils/googleGeocodingTypes';
import { ERROR_CAUSE, STATUS_CODES, ERROR_DATA, URL_REGEX, SCHEDULE_SEGMENTS, MS_IN_WEEK, MS_IN_DAY } from '../utils/constants';
import { format, getUnixTime, isSaturday, isSunday, nextSaturday, previousSunday } from 'date-fns';
const ProjectSetupSchema = require('../models/projectSetupSchema');
const ProjectLocationDataSchema = require('../models/projectLocationDataSchema');
const ScheduleDataSchema = require('../models/scheduleDataSchema');

const createNewProject = async (payload: CreateProjectQuery) => {
  const startDate = Date.parse(payload.projectStartDate);
  const endDate = Date.parse(payload.projectEndDate) + MS_IN_DAY - 1;
  const newProjectID = uuidv4();

  try {
    const addressQuery = payload.projectDestination.split(' ').join('+').trim();
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressQuery}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const queryResponse: GoogleGeocodeResponse = await axios.get(url);

    if (queryResponse.statusText === "OK") {
      // Upload Image to S3
      const imageBase64 = payload.projectImage
      var imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""),'base64')
      const imageType = imageBase64.split(';')[0].split('/')[1];

      const input = {
        Body: imageBuffer,
        Bucket: process.env.AWS_S3_BUCKETNAME as string,
        Key: newProjectID,
        ContentEncoding: 'base64',
        ContentType: `image/${imageType}`
      }

      const command = new PutObjectCommand(input)
      await s3Client.send(command);

      // Save to MongoDB
      const projectSetupData = new ProjectSetupSchema({
        userID: payload.userID,
        projectID: newProjectID,
        project: {
          projectName: payload.projectName,
          projectDescription: payload.projectDescription,
          projectStartDate: startDate,
          projectEndDate: endDate,
          projectImage: `https://${process.env.AWS_S3_BUCKETNAME}.s3.amazonaws.com/${newProjectID}`,
          projectCoords: {
            destination: queryResponse.data.results[0].formatted_address,
            lat: queryResponse.data.results[0].geometry.location.lat,
            lng: queryResponse.data.results[0].geometry.location.lng,
          }
        },
        scheduleConfig: {
          startingTime: "8:00",
          endingTime: "20:00",
          segments: SCHEDULE_SEGMENTS.OneHour,
        },
      })

      const result = await projectSetupData.save();

      // Generate skeleton schedule data
      let scheduleUnixStart;
      let scheduleUnixEnd;
      if (isSunday(startDate)) {
        scheduleUnixStart = startDate;
      } else {
        scheduleUnixStart = (getUnixTime(previousSunday(startDate)) * 1000);  // date-fns default is in s. we use ms
      }

      if (isSaturday(endDate)) {
        scheduleUnixEnd = endDate
      } else {
        scheduleUnixEnd = (getUnixTime(nextSaturday(endDate)) * 1000);
      }

      const numOfWeeks = (Math.ceil((scheduleUnixEnd - scheduleUnixStart) / MS_IN_WEEK))
    
      let i = 0;
      let rangeStartInUnix = scheduleUnixStart;
      while (i < numOfWeeks) {
        const thisRangeStart = rangeStartInUnix;
        const thisRangeEnd = rangeStartInUnix + MS_IN_WEEK - 1

        const headerData = [];
        let j = thisRangeStart;
        while (j <= thisRangeEnd) {
          let enabledStatus;
          if (j > startDate && j <= (endDate + MS_IN_DAY)) {
            enabledStatus = true;
          } else {
            enabledStatus = false;
          }

          const eachHeaderData = {
            enabled: enabledStatus,
            date: format(new Date(j), "PPP"),
            dateUnix: j,
            dayOfWeek: format(new Date(j), "EEEE"),
          }

          headerData.push(eachHeaderData)
          j = j + MS_IN_DAY;
        }

        const timeArray = new Map();
        const timeValueArray = new Map();
        let t = 0;
        while (t < ((24 * 2) / SCHEDULE_SEGMENTS.OneHour)) {
          let time;
          if (t === 0) {
            time = "0:00";
            timeValueArray.set(time, time);
          } else if (t % 2 === 1) {
            time = `${Math.floor(t / 2)}:30`;
          } else {
            time = `${Math.floor(t / 2)}:00`;
            timeValueArray.set(time, time);
          }
  
          timeArray.set(time, time);
          t++;
        }

        const scheduleSetupData = new ScheduleDataSchema({
          config: {
            rangeStart: thisRangeStart,
            rangeEnd: thisRangeEnd,
            page: i + 1,
            projectID: newProjectID
          },
          headerData: headerData,
          timeData: timeArray,
          timeValueData: timeValueArray,
        })

        await scheduleSetupData.save();
        rangeStartInUnix = rangeStartInUnix + MS_IN_WEEK
        i++;
      }

      return result;
    }
  } catch (err) {
    console.log(err);
  }
}

const searchLocation = async (payload: SearchQuery) => {
  try {
    // https://developers.google.com/maps/documentation/geocoding/requests-geocoding
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${payload.query.trim()}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const queryResponse: GoogleGeocodeResponse = await axios.get(url)
    
    // TODO: error handling
    if (queryResponse.statusText === "OK") {
      const findItem = await ProjectLocationDataSchema.findOne({"mapData.googleLocationID": `${queryResponse.data.results[0].place_id}`, "projectID": `${payload.projectID}`})
      
      if (findItem) {
        const statusPayload: {status: StatusPayload} = {
          status: {
            statusCode: STATUS_CODES.Duplicate,
            errorCause: ERROR_CAUSE.Search,
            errorData: ERROR_DATA.SearchDuplicate
          }
        }
        return statusPayload;
      }

      const projectLocationDataSchema = new ProjectLocationDataSchema({
        userID: payload.userID,
        projectID: payload.projectID,
        locationID: uuidv4(),
        deleteFlag: false,
        mapData: {
          formattedAddress: queryResponse.data.results[0].formatted_address,
          googleLocationID: queryResponse.data.results[0].place_id,
          position: {
            lat: queryResponse.data.results[0].geometry.location.lat,
            lng: queryResponse.data.results[0].geometry.location.lng,
          },
        },
        noteData: {
          noteName: payload.query.split('+').join(' '),
          priority: "Medium", 
          formattedAddress: queryResponse.data.results[0].formatted_address,
        }
      })

      const mongoResponse: LocationMongoResponse = await projectLocationDataSchema.save();
      mongoResponse.status = {
        statusCode: STATUS_CODES.SUCCESS
      }

      return mongoResponse;
    } 
  } catch (err) {
    console.log(err);
  }
  const statusPayload: {status: StatusPayload} = {
    status: {
      statusCode: STATUS_CODES.ServerError,
      errorCause: ERROR_CAUSE.Server,
      errorData: ERROR_DATA.Server
    }
  }
  return statusPayload;
}

const getProject = async (currUserID: string) => {
  try {
    const userProjects = await ProjectSetupSchema.find({userID: currUserID});
    return userProjects;
  } catch (err) {
    console.log(err);
  }
}

const getEachProject = async (projectID: string) => {
  // return the projectsetup and all mappoints data
  try {
    const userProject: ProjectPayload = await ProjectSetupSchema.findOne({projectID: projectID});
    const projectDataPoints: LocationMongoResponse[] = await ProjectLocationDataSchema.find({projectID: projectID, deleteFlag: false});
    const scheduleData: ScheduleMongoResponse = await ScheduleDataSchema.findOne({'config.projectID': projectID, 'config.page': 1});

    const responseData = {
      projectData: userProject,
      locationData: projectDataPoints,
      scheduleData: scheduleData,
    }

    return responseData;

  } catch (err) {
    console.log(err);
  }
}

const updateNote = async (payload: {noteData: NotePayloadData, mapData: MapPayloadData} ) => {
  const filter = {"locationID": payload.noteData.locationID as string};
  const data = { 
    noteData: payload.noteData, 
    mapData: { 
      ...payload.mapData,
      picture: payload.noteData.picture === undefined ? "" : payload.noteData.picture,
      noteName: payload.noteData.noteName === undefined ? "" : payload.noteData.noteName,
    }
  };
  delete data.noteData.locationID;
  delete data.mapData.locationID;

  if (payload.noteData.picture === "" || payload.noteData.picture === undefined) {
    data.noteData.picture = "";
    data.mapData.picture = "";
  } else if (URL_REGEX.test(payload.noteData.picture)) {
    data.noteData.picture = payload.noteData.picture;
    data.mapData.picture = payload.noteData.picture;
  } else {
    const imageBase64 = payload.noteData.picture as string;
    const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""),'base64')
    const imageType = imageBase64.split(';')[0].split('/')[1];

    const input = {
      Body: imageBuffer,
      Bucket: process.env.AWS_S3_BUCKETNAME as string,
      Key: filter.locationID,
      ContentEncoding: 'base64',
      ContentType: `image/${imageType}`
    }
  
    const command = new PutObjectCommand(input)
    await s3Client.send(command);
    data.noteData.picture = `https://${process.env.AWS_S3_BUCKETNAME}.s3.amazonaws.com/${filter.locationID}`
  }

  try {
    const update: LocationMongoResponse = await ProjectLocationDataSchema.findOneAndUpdate(filter, data, {returnOriginal: false});

    const responseNoteData: NoteDataResponse = { 
      noteData: {...update.noteData, locationID: update.locationID}, 
      mapData:{...update.mapData, locationID: update.locationID},
      status: {
        statusCode: STATUS_CODES.SUCCESS
      }
    }
    return responseNoteData;
  } catch (err) {
    console.log(err)
  }

  const statusPayload: {status: StatusPayload} = {
    status: {
      statusCode: STATUS_CODES.ServerError,
      errorCause: ERROR_CAUSE.Server,
      errorData: ERROR_DATA.Server
    }
  }
  return statusPayload;
}

const deleteLocation = async (locationIDPayload: string) => {
  try {
    const filter = {"locationID": locationIDPayload};
    const data = { deleteFlag: true }

    await ProjectLocationDataSchema.findOneAndUpdate(filter, data, {returnOriginal: false});

    const response: {status: StatusPayload} = {
      status: {
        statusCode: STATUS_CODES.SUCCESS,
      }
    }

    return response;
  } catch (err) {
    console.log(err);
  }

  const statusPayload: {status: StatusPayload} = {
    status: {
      statusCode: STATUS_CODES.ServerError,
      errorCause: ERROR_CAUSE.Server,
      errorData: ERROR_DATA.Server
    }
  }
  return statusPayload;
}


const projectService = {
  createNewProject,
  searchLocation,
  getProject,
  getEachProject,
  updateNote,
  deleteLocation,
}

export default projectService;