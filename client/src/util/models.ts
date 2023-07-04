import { AnyARecord } from "dns";
import { STATUS_CODES, ERROR_CAUSE, ERROR_DATA, LABEL_COLOR } from "./constants";

export interface DecodedJWT {
  exp: number,
  iat: number,
  user: {
    email: string,
    _id: string
  }
}

export interface UserProfileState {
  userID: string;
  userEmail: string;
  token: string;
}

export interface ProjectData {
  project: {
    projectCoords: {
      destination: string,
      lat: string,
      lng: string,
    },
    projectName: string,
    projectDescription: string,
    projectStartDate: number,
    projectEndDate: number,
    projectImage: string,
  },
  userID: string,
  projectID: string,
  _id: string,
}

export interface LocationData {
  userID: string,
  projectID: string,
  locationID: string,
  deleteFlag: boolean,
  mapData: {
    formattedAddress: string,
    googleLocationID: string,
    picture?: string,
    noteName?: string,
    position: {
      lat: number,
      lng: number,
    },
    label?: {
      color: LABEL_COLOR,
    }
  },
  noteData: {
    noteName: string,
    priority: string,
    formattedAddress: string,
    color?: LABEL_COLOR,
    scheduleDate?: Date,
    customNote?: string,
    openHours?: string,
    closeHours?: string,
  },
  scheduleData?:{
    scheduled: boolean,
    noteName: string,
    scheduleDate: Date,
    scheduleStart: Date,
    scheduleEnd: Date,
  },
  status: StatusPayload,
}

export interface MapData {
  position: {
    lat: number,
    lng: number,
  },
  label?: {
    color: LABEL_COLOR,
  }
  locationID: string;
  formattedAddress: string;
  googleLocationID: string;
  picture?: string,
  noteName?: string,
}

export interface NoteData {
  locationID: string,
  noteName: string,
  priority: string,
  formattedAddress: string,
  scheduleDate?: Date,
  customNote?: string,
  openHours?: string,
  closeHours?: string,
  picture?: string,
  color?: LABEL_COLOR,
}

export interface ScheduleData {
  scheduled: boolean,
  noteName: string,
  locationID: string,
  scheduleDate: Date,
  scheduleStart: Date,
  scheduleEnd: Date,
}

export interface StatusPayload { 
  statusCode: STATUS_CODES,
  errorCause?: ERROR_CAUSE,
  errorData?: ERROR_DATA,
}

export interface NoteDataResponse {
  noteData: NoteData, 
  mapData: MapData, 
  status: StatusPayload 
}

export interface ScheduleInitData {
  start: string,
  startUnix: number,
  end: string,
  endUnix: number,
}