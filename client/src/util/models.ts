import { STATUS_CODES, ERROR_CAUSE, ERROR_DATA, LABEL_COLOR, SCHEDULE_SEGMENTS, NOTE_PRIORITY } from "./constants";

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

export interface ScheduleData {
  config: {
    rangeStart: number,
    rangeEnd: number,
    page: number,
    projectID: number,
  },
  headerData: ScheduleHeaderData[],
  scheduleData: {
    [key: string]: EachScheduleData[];
  };
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

export interface ScheduleConfig {
  startingTime: string,
  endingTime: string,
  segments: SCHEDULE_SEGMENTS,
}

export interface CalendarData {
  enabled: boolean,
  date: string,
  startUnix: number,
  endUnix: number,
  dayOfWeek: string,
}

export interface ScheduleColumnData {
  [date: string]: EachScheduleColumnData
}

export interface EachScheduleColumnData {
  columnData: CalendarData;
  [time: string]: undefined | CalendarData;
}

export interface DroppedParsedData {
  noteMessage: string;
  noteName: string;
  notePriority: NOTE_PRIORITY;
}