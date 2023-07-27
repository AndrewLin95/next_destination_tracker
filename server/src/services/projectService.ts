import axios from 'axios';
import { s3Client } from '../utils/s3';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { 
  CreateProjectQuery, 
  SearchQuery, 
  LocationMongoResponse, 
  ProjectSetupResponse, 
  NotePayloadData, 
  StatusPayload, 
  MapPayloadData,
  ScheduleConfigMongoResponse,
  SetSchedulePayload,
  EachScheduleData,
  ScheduleKeys,
  ScheduleDataMongoResponse,
  DeleteScheduleResponse,
  UpdateProjectPayload,
} from "../utils/models/ProjectModels";
import { GoogleGeocodeResponse } from '../utils/googleGeocodingTypes';
import { ERROR_CAUSE, STATUS_CODES, ERROR_DATA, URL_REGEX, SCHEDULE_SEGMENTS, MS_IN_WEEK, MS_IN_DAY, DEFAULT_SCHEDULE_COLORS, DELETE_RESPONSE, MS_IN_MINUTE } from '../utils/constants';
import { getUnixTime, isSaturday, isSunday, nextSaturday, previousSunday } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz'
import { generateFinalScheduleData, handleScheduleSequenceAdd, findDataSegments, handleDeleteSchedule, identifyNumOfConflicts, clearScheduleData, getTimeInMinutes } from '../utils/scheduleUtils';
const ProjectSetupSchema = require('../models/projectSetupSchema');
const ProjectLocationDataSchema = require('../models/projectLocationDataSchema');
const ScheduleDataSchema = require('../models/scheduleDataSchema');
const ScheduleConfigSchema = require('../models/scheduleConfigSchema');

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
        scheduleColors: {
          Monday: DEFAULT_SCHEDULE_COLORS.Monday,
          Tuesday: DEFAULT_SCHEDULE_COLORS.Tuesday,
          Wednesday: DEFAULT_SCHEDULE_COLORS.Wednesday,
          Thursday: DEFAULT_SCHEDULE_COLORS.Thursday,
          Friday: DEFAULT_SCHEDULE_COLORS.Friday,
          Saturday: DEFAULT_SCHEDULE_COLORS.Saturday,
          Sunday: DEFAULT_SCHEDULE_COLORS.Sunday,
        },
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
          minPerSegment: 30,
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
            date: formatInTimeZone(j, 'GMT', "PPP"),
            dateUnix: j,
            dayOfWeek: formatInTimeZone(j, 'GMT', "EEEE"),
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

        const scheduleSetupData = new ScheduleConfigSchema({
          config: {
            rangeStart: thisRangeStart,
            rangeEnd: thisRangeEnd,
            page: i + 1,
            totalPages: numOfWeeks,
            projectID: newProjectID
          },
          headerData: headerData,
          timeData: timeArray,
          timeValueData: timeValueArray,
          scheduleKeys: new Map(),
          scheduleData: new Map(),
        })

        await scheduleSetupData.save();
        rangeStartInUnix = rangeStartInUnix + MS_IN_WEEK
        i++;
      }

      const scheduleData = new ScheduleDataSchema({
        projectID: newProjectID,
        scheduleKeys: new Map(),
        scheduleData: new Map(),
      })
      await scheduleData.save();
      
      return result;
    }
  } catch (err) {
    console.log(err);
  }
}

const updateProject = async (projectPayload: UpdateProjectPayload) => {
  const startDate = Date.parse(projectPayload.dateStart);
  const endDate = Date.parse(projectPayload.dateEnd) + MS_IN_DAY - 1;

  const filter = {"projectID": projectPayload.projectID}
  const data = {
    project: {
      projectName: projectPayload.projectName,
      projectDescription: projectPayload.projectDescription,
      projectStartDate: startDate,
      projectEndDate: endDate,
      projectImage: projectPayload.projectImage,
      projectCoords: projectPayload.projectCoords,
    }
  }

  try {
    const response: ProjectSetupResponse = await ProjectSetupSchema.findOneAndUpdate(filter, data, {returnOriginal: false})

    return response;
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
      const searchFilter = {"mapData.googleLocationID": `${queryResponse.data.results[0].place_id}`, "deleteFlag": false}
      const findItem = await ProjectLocationDataSchema.findOne({searchFilter, "projectID": `${payload.projectID}`})
      
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

      const locationID = uuidv4();

      const projectLocationDataSchema = new ProjectLocationDataSchema({
        userID: payload.userID,
        projectID: payload.projectID,
        locationID: locationID,
        deleteFlag: false,
        mapData: {
          formattedAddress: queryResponse.data.results[0].formatted_address,
          googleLocationID: queryResponse.data.results[0].place_id,
          noteName: payload.query.split('+').join(' '),
          locationID: locationID,
          position: {
            lat: queryResponse.data.results[0].geometry.location.lat,
            lng: queryResponse.data.results[0].geometry.location.lng,
          },
        },
        noteData: {
          noteName: payload.query.split('+').join(' '),
          priority: "Medium", 
          formattedAddress: queryResponse.data.results[0].formatted_address,
          locationID: locationID,
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
    const userProject: ProjectSetupResponse = await ProjectSetupSchema.findOne({projectID: projectID});
    const projectDataPoints: LocationMongoResponse[] = await ProjectLocationDataSchema.find({projectID: projectID, deleteFlag: false});
    const scheduleConfig: ScheduleConfigMongoResponse = await ScheduleConfigSchema.findOne({'config.projectID': projectID, 'config.page': 1});
    const scheduleData: ScheduleDataMongoResponse = await ScheduleDataSchema.findOne({'projectID': projectID});

    const responseData = {
      projectData: userProject,
      locationData: projectDataPoints,
      scheduleConfig: scheduleConfig,
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
    const locationMongoResponse: LocationMongoResponse = await ProjectLocationDataSchema.findOneAndUpdate(filter, data, {returnOriginal: false});

    locationMongoResponse.mapData.locationID = locationMongoResponse.locationID
    locationMongoResponse.noteData.locationID = locationMongoResponse.locationID

    const responseNoteData = { 
      data: locationMongoResponse,
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

const deleteLocation = async (locationID: string, projectID: string) => {
  try {
    const filter = {"locationID": locationID};
    const data = { deleteFlag: true }
    const projectLocationData: LocationMongoResponse = await ProjectLocationDataSchema.findOneAndUpdate(filter, data, {returnOriginal: false});

    const scheduleFilter = {"projectID": projectID};
    const scheduleData: ScheduleDataMongoResponse = await ScheduleDataSchema.findOne(scheduleFilter);

    if (projectLocationData.noteData?.scheduleDate !== undefined) {
      const deleteResponse: DeleteScheduleResponse = await handleDeleteSchedule(scheduleData, locationID, projectLocationData.noteData.scheduleDate);

      if (deleteResponse.status === DELETE_RESPONSE.Success) {
        if (deleteResponse.finalScheduleData !== undefined && deleteResponse.targetData !== undefined) {

          const updateData = {
            $set: {scheduleData: deleteResponse.finalScheduleData.scheduleData},
            $unset: {[`scheduleKeys.${deleteResponse.targetData.locationID}`]: ""},
          }

          const newScheduleData: ScheduleDataMongoResponse = await ScheduleDataSchema.findOneAndUpdate(scheduleFilter, updateData, {returnOriginal: false});

          const response = {
            status: {
              statusCode: STATUS_CODES.SUCCESS,
            },
            scheduleData: newScheduleData,
          }
          return response;
        } else {
          const response = {
            status: {
              statusCode: STATUS_CODES.SUCCESS,
            }
          }
          return response;
        }
      }
    }

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

const setScheduleData = async (schedulePayload: SetSchedulePayload) => {
  // https://mongoosejs.com/docs/transactions.html
  try {
    let returnScheduleObj: ScheduleDataMongoResponse = {} as ScheduleDataMongoResponse;
    const filter = {
      'projectID': schedulePayload.projectID,
    };
    const scheduleData: ScheduleDataMongoResponse = await ScheduleDataSchema.findOne(filter);
    let currTimeInMinutes = getTimeInMinutes(schedulePayload.time);

    if (scheduleData.scheduleKeys.has(schedulePayload.locationID)) {
      const statusPayload: {status: StatusPayload} = {
        status: {
          statusCode: STATUS_CODES.BadRequest,
          errorCause: ERROR_CAUSE.Schedule,
          errorData: ERROR_DATA.ScheduleDuplicate,
        }
      }
      return statusPayload;
    } else if ((currTimeInMinutes + schedulePayload.duration) > 1440) {
      const statusPayload: {status: StatusPayload} = {
        status: {
          statusCode: STATUS_CODES.BadRequest,
          errorCause: ERROR_CAUSE.Schedule,
          errorData: ERROR_DATA.ScheduleOutOfBounds,
        }
      }
      return statusPayload;
    } else {
      const formattedDate = `${schedulePayload.date} ${Math.floor(currTimeInMinutes / 60)}:${(currTimeInMinutes % 60 === 0 ? "00" : currTimeInMinutes % 60)}`
      const scheduleKeyObj: ScheduleKeys = {
        key: formattedDate,
        duration: schedulePayload.duration,
      }
      
      scheduleData.scheduleKeys.set(schedulePayload.locationID, scheduleKeyObj)
    }

    const scheduleID = uuidv4();

    const startingTimeInMinutes = getTimeInMinutes(schedulePayload.time);
    const endTimeInMinutes = startingTimeInMinutes + schedulePayload.duration;
    const formattedEndTime = `${Math.floor(endTimeInMinutes / 60)}:${endTimeInMinutes % 60 === 0 ? "00" : endTimeInMinutes % 60}`
    const formattedDate = formatInTimeZone(schedulePayload.dateUnix, 'GMT', "PPP");
    const scheduledDateTime = schedulePayload.dateUnix + (startingTimeInMinutes * MS_IN_MINUTE);

    const newScheduleData = {
      scheduleID: scheduleID,
      locationID: schedulePayload.locationID,
      dataSegment: true,
      noteName: schedulePayload.noteName,
      timeFrom: schedulePayload.time,
      timeTo: formattedEndTime,
      duration: schedulePayload.duration,
      noteMessage: schedulePayload.noteMessage,
      notePriority: schedulePayload.notePriority,
      scheduledTimeUnix: scheduledDateTime,
      position: 0,
      numColumns: 1,
    }

    // indentify conflicts
    const {conflictingLocationIDs, conflictingDataSegments} = identifyNumOfConflicts(schedulePayload.locationID, currTimeInMinutes, schedulePayload.date, scheduleData, schedulePayload.duration);

    // too many conflicts
    if (conflictingLocationIDs.size > 3) {
      const statusPayload: {status: StatusPayload} = {
        status: {
          statusCode: STATUS_CODES.BadRequest,
          errorCause: ERROR_CAUSE.Schedule,
          errorData: ERROR_DATA.ScheduleConflict,
        }
      }

      return statusPayload;
    } 

    // no conflicts
    if (conflictingLocationIDs.size === 0) {
      const finalScheduleData = await generateFinalScheduleData([newScheduleData], scheduleData, formattedDate)

      returnScheduleObj = await ScheduleDataSchema.findOneAndUpdate(filter, finalScheduleData, {returnOriginal: false});
    }
    
    // everything else
    if (conflictingLocationIDs.size >= 1) { 
      const sequencedData = handleScheduleSequenceAdd(newScheduleData, conflictingDataSegments, scheduleData);
      if (sequencedData === undefined) {
        const statusPayload: {status: StatusPayload} = {
          status: {
            statusCode: STATUS_CODES.BadRequest,
            errorCause: ERROR_CAUSE.Schedule,
            errorData: ERROR_DATA.ScheduleConflict,
          }
        }
  
        return statusPayload;
      } else {
        const filteredScheduleData = await clearScheduleData(sequencedData, formattedDate, schedulePayload.projectID);
        const finalScheduleData = await generateFinalScheduleData(sequencedData, filteredScheduleData, formattedDate);
  
        const scheduleKeyObj: ScheduleKeys = {
          key: `${formattedDate} ${Math.floor(currTimeInMinutes / 60)}:${(currTimeInMinutes % 60 === 0 ? "00" : currTimeInMinutes % 60)}`,
          duration: schedulePayload.duration,
        }
        
        finalScheduleData.scheduleKeys.set(schedulePayload.locationID, scheduleKeyObj)
        
        returnScheduleObj = await ScheduleDataSchema.findOneAndUpdate(filter, finalScheduleData, {returnOriginal: false});
      }
    }
    
    const locationFilter = {'locationID': schedulePayload.locationID};
    const scheduleLocationNote: LocationMongoResponse = await ProjectLocationDataSchema.findOne(locationFilter)
    scheduleLocationNote.noteData.scheduleDate = scheduledDateTime;
    scheduleLocationNote.mapData.scheduleDate = scheduledDateTime;

    const returnLocationData: LocationMongoResponse = await ProjectLocationDataSchema.findOneAndUpdate(locationFilter, scheduleLocationNote, {returnOriginal: false});

    const scheduleResponseObject = {
      scheduleData: returnScheduleObj, 
      locationData: returnLocationData,
      status: {
        statusCode: STATUS_CODES.SUCCESS
      }  
    }

    return scheduleResponseObject;
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

const deleteSchedule = async (locationID: string, projectID: string) => {
  const filter = {"locationID": locationID};
  const update = { $unset: { "mapData.scheduleDate": "", "noteData.scheduleDate": "" } };
  const projectLocationData: LocationMongoResponse = await ProjectLocationDataSchema.findOneAndUpdate(filter, update, {returnOriginal: false});

  const scheduleFilter = {"projectID": projectID};
  const scheduleData: ScheduleDataMongoResponse = await ScheduleDataSchema.findOne(scheduleFilter);

  const targetKey = scheduleData.scheduleKeys.get(locationID) ?? null;
  if (targetKey !== null) {
    const targetData = scheduleData.scheduleData.get(targetKey.key) ?? null;
    if (targetData !== null) {
      let scheduleDateUnix = 1;
      targetData.forEach(eachData => {
        if (eachData.locationID === locationID) {
          scheduleDateUnix = eachData.scheduledTimeUnix as number;
        }
      });

      const deleteResponse: DeleteScheduleResponse = await handleDeleteSchedule(scheduleData, locationID, scheduleDateUnix);

      if (deleteResponse.status === DELETE_RESPONSE.Success) {
        if (deleteResponse.finalScheduleData !== undefined && deleteResponse.targetData !== undefined) {
    
          const updateData = {
            $set: {scheduleData: deleteResponse.finalScheduleData.scheduleData},
            $unset: {[`scheduleKeys.${deleteResponse.targetData.locationID}`]: ""},
          }
    
          const newScheduleData: ScheduleDataMongoResponse = await ScheduleDataSchema.findOneAndUpdate(scheduleFilter, updateData, {returnOriginal: false});
    
          const response = {
            status: {
              statusCode: STATUS_CODES.SUCCESS,
            },
            scheduleData: newScheduleData,
            locationData: projectLocationData,
          }
          return response;
        } else {
          const response = {
            status: {
              statusCode: STATUS_CODES.SUCCESS,
            }
          }
          return response;
        }
      }
    }
  }
  const response: {status: StatusPayload} = {
    status: {
      statusCode: STATUS_CODES.ServerError,
      errorCause: ERROR_CAUSE.Server,
      errorData: ERROR_DATA.Server
    }
  }

  return response;

}

const projectService = {
  createNewProject,
  updateProject,
  searchLocation,
  getProject,
  getEachProject,
  updateNote,
  deleteLocation,
  setScheduleData,
  deleteSchedule,
}

export default projectService;