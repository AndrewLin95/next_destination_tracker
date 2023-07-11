import { ERROR_CAUSE, STATUS_CODES, ERROR_DATA, LABEL_COLOR, SCHEDULE_SEGMENTS, NOTE_PRIORITY } from "./constants"

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
  projectImage: string,
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
  },
  noteData: {
    noteName: string,
    priority: string,
    formattedAddress: string,
    color?: LABEL_COLOR,
    locationID?: string,
    scheduleDate?: number,
    customNote?: string,
    openHours?: string,
    closeHours?: string,
  },
  status: StatusPayload
}

export interface ScheduleMongoResponse {
  config: {
    rangeStart: number,
    rangeEnd: number,
    page: number,
    projectID: number,
  },
  headerData: ScheduleHeaderData[],
  scheduleKeys: Map<string, ScheduleKeys>,
  scheduleData: Map<string, EachScheduleData[]>,
  timeData: Map<string, string>,
  timeValueData: Map<string, string>,
}

export interface ScheduleHeaderData {
  date: string,
  dateUnix: number,
  dayOfWeek: string,
  enabled: boolean,
}

export interface EachScheduleData {
  scheduleID: string,
  locationID: string,
  dataSegment: boolean,
  position: number,
  numColumns?: number,
  noteName?: string,
  timeFrom?: string,
  timeTo?: string,
  duration?: number,
  noteMessage?: string,
  notePriority?: NOTE_PRIORITY,
}

export interface ScheduleKeys {
  key: string,
  duration: number,
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
    minPerSegment: number,
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


export interface StatusPayload { 
  statusCode: STATUS_CODES,
  errorCause?: ERROR_CAUSE,
  errorData?: ERROR_DATA,
}

export interface NoteDataResponse {
  data: LocationMongoResponse,
  status: StatusPayload 
}

export interface SetSchedulePayload {
  time: string,
  date: string,
  dateUnix: number,
  projectID: string,
  locationID: string,
  noteMessage: string,
  noteName: string,
  notePriority: NOTE_PRIORITY,
  duration: number,
}