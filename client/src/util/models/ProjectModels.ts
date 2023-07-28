import { STATUS_CODES, ERROR_CAUSE, ERROR_DATA, SCHEDULE_SEGMENTS, NOTE_PRIORITY } from "../constants";

export interface ProjectData {
  userID: string,
  projectID: string,
  deleteFlag: boolean,
  scheduleColors: ScheduleColors,
  project: {
    projectName: string,
    projectDescription: string,
    projectStartDate: number,
    projectEndDate: number,
    projectImage: string,
    projectCoords: {
      destination: string,
      lat: string,
      lng: string,
    },
  },
  scheduleConfig: {
    startingTime: string,
    endingTime: string,
    segments: SCHEDULE_SEGMENTS,
    minPerSegment: number,
  },
}

export interface ScheduleColors {
  Monday: string,
  Tuesday: string,
  Wednesday: string,
  Thursday: string,
  Friday: string,
  Saturday: string,
  Sunday: string,
}

export interface LocationData {
  userID: string,
  projectID: string,
  locationID: string,
  deleteFlag: boolean,
  mapData: MapData,
  noteData: NoteData,
  status: StatusPayload,
}

export interface MapData {
  formattedAddress: string,
  googleLocationID: string,
  locationID: string,
  noteName: string,
  picture?: string,
  position: {
    lat: number,
    lng: number,
  },
  scheduleDate?: number,
}

export interface NoteData {
  noteName: string,
  locationID: string,
  formattedAddress: string,
  customNote?: string,
  openHours?: string,
  closeHours?: string,
  picture?: string,
  scheduleDate?: number,
  priority: string,
}

export interface ScheduleConfigData {
  config: {
    rangeStart: number,
    rangeEnd: number,
    page: number,
    projectID: number,
  },
  headerData: ScheduleHeaderData[],
  timeData: Map<string, string>,
  timeValueData: Map<string, string>,
}

export interface ScheduleHeaderData {
  date: string,
  dateUnix: number,
  dayOfWeek: string,
  enabled: boolean,
}

export interface ScheduleData {
  projectID: string,
  scheduleData: {
    [key: string]: EachScheduleData[];
  },
  scheduleKeys: {
    [key: string]: ScheduleKeys,
  },
}

export interface ScheduleKeys {
  key: string,
  duration: number,
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
  scheduledTimeUnix?: number,
  duration?: number,
  noteMessage?: string,
  notePriority: NOTE_PRIORITY,
}

export interface StatusPayload { 
  statusCode: STATUS_CODES,
  errorCause?: ERROR_CAUSE,
  errorData?: ERROR_DATA,
}

export interface NoteDataResponse {
  data: LocationData,
  status: StatusPayload 
}

export interface DeleteNoteResponse {
  status: StatusPayload,
  scheduleData?: ScheduleData
}

export interface ScheduleDataResponse {
  scheduleData: ScheduleData,
  locationData: LocationData,
  status: StatusPayload,
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

export interface DeleteScheduleResponse {
  scheduleData:  ScheduleData;
  locationData: LocationData;
  status: {
    statusCode: StatusPayload
  }
}

export interface UpdateProjectResponse {
  projectData?: ProjectData,
  status: StatusPayload
}