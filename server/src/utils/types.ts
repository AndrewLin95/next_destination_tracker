import { ERROR_CAUSE, STATUS_CODES, ERROR_DATA, LABEL_COLOR, SCHEDULE_SEGMENTS } from "./constants"

export interface jwtToken {
  exp: number,
  iat: number,
  user: {
    _id: string,
    email: string,
  }
}

export interface CreateProjectQuery {
  userID: string,
  projectName: string,
  projectDescription: string,
  projectStartDate: string,
  projectEndDate: string,
  projectDestination: string,
}

export interface SearchQuery {
  userID: string,
  projectID: string,
  query: string,
}

export interface LocationMongoResponse {
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
  status: StatusPayload
}

export interface ProjectPayload {
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
  scheduleConfig: {
    startingTime: string,
    endingTime: string,
    segments: SCHEDULE_SEGMENTS,
  },
  userID: string,
  projectID: string,
  _id: string,
}

export interface LocationPayload {
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
    scheduledDate?: Date,
    customNote?: string,
    openHours?: string,
    closeHours?: string,
    picture?: string,
  },
  scheduleData?:{
    scheduled: boolean,
    noteName: string,
    scheduleDate: Date,
    scheduleStart: Date,
    scheduleEnd: Date,
  }
}

export interface MapPayloadData {
  formattedAddress: string,
  googleLocationID: string,
  locationID?: string,
  picture?: string,
  noteName?: string,
  position: {
    lat: number,
    lng: number,
  },
  label?: {
    color: LABEL_COLOR,
  }
}

export interface NotePayloadData {
  locationID?: string,
  noteName: string,
  priority: string,
  formattedAddress: string,
  scheduledDate?: Date,
  customNote?: string,
  openHours?: string,
  closeHours?: string,
  picture?: string,
  color?: LABEL_COLOR,
}

export interface SchedulePayloadData {
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
  noteData: NotePayloadData, 
  mapData: MapPayloadData, 
  status: StatusPayload 
}