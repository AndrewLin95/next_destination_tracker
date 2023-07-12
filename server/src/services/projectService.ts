import axios, { all } from 'axios';
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
  ScheduleConfigMongoResponse,
  SetSchedulePayload,
  EachScheduleData,
  ScheduleKeys,
  ScheduleDataMongoResponse,
} from "../utils/types";
import { GoogleGeocodeResponse } from '../utils/googleGeocodingTypes';
import { ERROR_CAUSE, STATUS_CODES, ERROR_DATA, URL_REGEX, SCHEDULE_SEGMENTS, MS_IN_WEEK, MS_IN_DAY, DEFAULT_SCHEDULE_COLORS } from '../utils/constants';
import { format, getUnixTime, isSaturday, isSunday, nextSaturday, previousSunday } from 'date-fns';
import { clearFromAndTo, handleScheduleSequence, identifyNumOfConflicts } from '../utils/scheduleUtils';
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
          noteName: payload.query.split('+').join(' '),
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

const deleteLocation = async (locationIDPayload: string) => {
  // TODO, delete schedule
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

// TODO: documentation
const setScheduleData = async (schedulePayload: SetSchedulePayload) => {
  try {
    let returnScheduleObj: ScheduleDataMongoResponse;
    const filter = {
      'projectID': schedulePayload.projectID,
    };
    const scheduleData: ScheduleDataMongoResponse = await ScheduleDataSchema.findOne(filter);
    let currTimeInMinutes = (parseInt(schedulePayload.time.split(':')[0]) * 60) + parseInt(schedulePayload.time.split(':')[1])

    if (scheduleData.scheduleKeys.has(schedulePayload.locationID)) {
      const statusPayload: {status: StatusPayload} = {
        status: {
          statusCode: STATUS_CODES.BadRequest,
          errorCause: ERROR_CAUSE.Schedule,
          errorData: ERROR_DATA.ScheduleDuplicate,
        }
      }

      return statusPayload;
    } else {
      const formattedTime = `${schedulePayload.date} ${Math.floor(currTimeInMinutes / 60)}:${(currTimeInMinutes % 60 === 0 ? "00" : currTimeInMinutes % 60)}`
      const scheduleKeyObj: ScheduleKeys = {
        key: formattedTime,
        duration: schedulePayload.duration,
      }
      
      scheduleData.scheduleKeys.set(schedulePayload.locationID, scheduleKeyObj)
    }

    const scheduleID = uuidv4();

    const startingTimeInMinutes = (parseInt(schedulePayload.time.split(':')[0]) * 60) + parseInt(schedulePayload.time.split(':')[1])
    const endTimeInMinutes = startingTimeInMinutes + schedulePayload.duration;
    const formattedEndTime = `${Math.floor(endTimeInMinutes / 60)}:${endTimeInMinutes % 60 === 0 ? "00" : endTimeInMinutes % 60}`

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
      position: 0,
      numColumns: 1,
    }

    // indentify conflicts
    const conflictingScheduleIDs = identifyNumOfConflicts(currTimeInMinutes, schedulePayload.date, scheduleData.scheduleData, schedulePayload.duration);

    if (conflictingScheduleIDs.size > 4) {
      const statusPayload: {status: StatusPayload} = {
        status: {
          statusCode: STATUS_CODES.BadRequest,
          errorCause: ERROR_CAUSE.Schedule,
          errorData: ERROR_DATA.ScheduleConflict,
        }
      }

      return statusPayload;
    } else if (conflictingScheduleIDs.size === 0) {
      let alreadySetData = false;
      currTimeInMinutes = (parseInt(schedulePayload.time.split(':')[0]) * 60) + parseInt(schedulePayload.time.split(':')[1]);
      const startTime = JSON.parse(JSON.stringify(currTimeInMinutes));

      const nonDataScheduleSegment = {
        scheduleID: scheduleID,
        locationID: schedulePayload.locationID,
        dataSegment: false,
        position: newScheduleData.position
      }

      while (currTimeInMinutes < (startTime + schedulePayload.duration)) {
        const currFormattedTime = `${Math.floor(currTimeInMinutes / 60)}:${(currTimeInMinutes % 60 === 0 ? "00" : currTimeInMinutes % 60)}`
        const key = `${schedulePayload.date} ${currFormattedTime}`;

        if (alreadySetData) {
          scheduleData.scheduleData.set(key, [nonDataScheduleSegment])
        } else {
          scheduleData.scheduleData.set(key, [newScheduleData]);
          alreadySetData = true;
        }
        currTimeInMinutes = currTimeInMinutes + 30;
      }

      returnScheduleObj = await ScheduleDataSchema.findOneAndUpdate(filter, scheduleData, {returnOriginal: false});
    } else {
      const { allScheduleDatas, skipClear } = handleScheduleSequence(conflictingScheduleIDs, newScheduleData, schedulePayload.date, scheduleData.scheduleData, currTimeInMinutes);
      // scheduling conflict
      if (allScheduleDatas === undefined) {
        const statusPayload: {status: StatusPayload} = {
          status: {
            statusCode: STATUS_CODES.BadRequest,
            errorCause: ERROR_CAUSE.Schedule,
            errorData: ERROR_DATA.ScheduleConflict,
          }
        }
  
        return statusPayload;
      } 

      if (!skipClear) {
        // clear existing data if any
        const { fromInMins, toInMins } = clearFromAndTo(allScheduleDatas);
        let clearFrom = fromInMins;
        const clearTo = toInMins

        const keysToUnset = [];

        while (clearFrom < clearTo) {
          const currFormattedTime = `${Math.floor(clearFrom / 60)}:${((clearFrom % 60 === 0) ? "00" : clearFrom % 60)}`
          const key = `${schedulePayload.date} ${currFormattedTime}`;

          keysToUnset.push(key);
          clearFrom = clearFrom + 30;
        }

        const unsetObj = keysToUnset.reduce((acc, key) => ({ ...acc, [`scheduleData.${key}`]: '' }), {});
        const filteredScheduleData: ScheduleDataMongoResponse = await ScheduleDataSchema.findOneAndUpdate(filter, {$unset: unsetObj}, {returnOriginal: false});
        
        let timeToGenKey = (parseInt(schedulePayload.time.split(':')[0]) * 60) + parseInt(schedulePayload.time.split(':')[1])
        const keysFormattedtime = `${schedulePayload.date} ${Math.floor(timeToGenKey / 60)}:${(timeToGenKey % 60 === 0 ? "00" : timeToGenKey % 60)}`
        const scheduleKeyObj: ScheduleKeys = {
          key: keysFormattedtime,
          duration: schedulePayload.duration,
        }
        filteredScheduleData.scheduleKeys.set(schedulePayload.locationID, scheduleKeyObj)

        // add new data
        allScheduleDatas.forEach(eachScheduleData => {
          let alreadySetData = false;
          currTimeInMinutes = (parseInt((eachScheduleData.timeFrom as String).split(':')[0]) * 60) + parseInt((eachScheduleData.timeFrom as String).split(':')[1]);
          const startTime = JSON.parse(JSON.stringify(currTimeInMinutes));

          const nonDataScheduleSegment = {
            scheduleID: eachScheduleData.scheduleID,
            locationID: schedulePayload.locationID,
            dataSegment: false,
            position: eachScheduleData.position,
          }
          
          while (currTimeInMinutes < (startTime + (eachScheduleData.duration as number))) {
            const currFormattedTime = `${Math.floor(currTimeInMinutes / 60)}:${(currTimeInMinutes % 60 === 0 ? "00" : currTimeInMinutes % 60)}`
            const key = `${schedulePayload.date} ${currFormattedTime}`;
  
            const hasKey = filteredScheduleData.scheduleData.has(key);
  
            if (hasKey) {
              const originalData = filteredScheduleData.scheduleData.get(key) as EachScheduleData[];
              if (alreadySetData) {
                filteredScheduleData.scheduleData.set(key, [...originalData, nonDataScheduleSegment])
              } else {
                filteredScheduleData.scheduleData.set(key, [...originalData, eachScheduleData]);
                alreadySetData = true;
              }
            } else {
              if (alreadySetData) {
                filteredScheduleData.scheduleData.set(key, [nonDataScheduleSegment])
              } else {
                filteredScheduleData.scheduleData.set(key, [eachScheduleData]);
                alreadySetData = true;
              }
            }
            currTimeInMinutes = currTimeInMinutes + 30;
          }
        });
        returnScheduleObj = await ScheduleDataSchema.findOneAndUpdate(filter, filteredScheduleData, {returnOriginal: false});
      } else {
        let alreadySetData = false;
        currTimeInMinutes = (parseInt(schedulePayload.time.split(':')[0]) * 60) + parseInt(schedulePayload.time.split(':')[1]);
        const startTime = JSON.parse(JSON.stringify(currTimeInMinutes));

        const nonDataScheduleSegment = {
          scheduleID: scheduleID,
          locationID: schedulePayload.locationID,
          dataSegment: false,
          position: newScheduleData.position
        }

        while (currTimeInMinutes < (startTime + schedulePayload.duration)) {
          const currFormattedTime = `${Math.floor(currTimeInMinutes / 60)}:${(currTimeInMinutes % 60 === 0 ? "00" : currTimeInMinutes % 60)}`
          const key = `${schedulePayload.date} ${currFormattedTime}`;

          const hasKey = scheduleData.scheduleData.has(key);

          if (hasKey) {
            const originalData = scheduleData.scheduleData.get(key) as EachScheduleData[];
            if (alreadySetData) {
              scheduleData.scheduleData.set(key, [...originalData, nonDataScheduleSegment])
            } else {
              scheduleData.scheduleData.set(key, [...originalData, newScheduleData]);
              alreadySetData = true;
            }
          } else {
            if (alreadySetData) {
              scheduleData.scheduleData.set(key, [nonDataScheduleSegment])
            } else {
              scheduleData.scheduleData.set(key, [newScheduleData]);
              alreadySetData = true;
            }
          }
          currTimeInMinutes = currTimeInMinutes + 30;
        }

        returnScheduleObj = await ScheduleDataSchema.findOneAndUpdate(filter, scheduleData, {returnOriginal: false});
      }
    }

    const locationFilter = {'locationID': schedulePayload.locationID};
    const scheduleLocationNote: LocationMongoResponse = await ProjectLocationDataSchema.findOne(locationFilter)
    scheduleLocationNote.noteData.scheduleDate = schedulePayload.dateUnix;
    scheduleLocationNote.mapData.scheduleDate = schedulePayload.dateUnix;

    await ProjectLocationDataSchema.findOneAndUpdate(locationFilter, scheduleLocationNote);

    const scheduleResponseObject = {
      scheduleData: returnScheduleObj, 
      locationData: scheduleLocationNote,
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
  const scheduleFilter = {"config.projectID": projectID}
  
  const scheduleData = await ScheduleDataSchema.findOne(scheduleFilter);

}

const projectService = {
  createNewProject,
  searchLocation,
  getProject,
  getEachProject,
  updateNote,
  deleteLocation,
  setScheduleData,
  deleteSchedule,
}

export default projectService;