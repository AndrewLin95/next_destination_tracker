export const msInDay = 86400000
export const MS_IN_DAY = 86400000
export const MS_IN_WEEK = 604800000
export const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

export enum STATUS_CODES {
  SUCCESS = "200 Sucess",
  Duplicate = "409 Error: Duplicate Record",
  BadRequest = "400 Bad Request: Invalid Request",
  ServerError = "500 Error: Server Error"
}

export enum ERROR_CAUSE {
  Search = "Your search query could not be completed.",
  Server = "Our servers are experiencing technical issues.",
  Schedule = "Your schedule could not be completed.",
}

export enum ERROR_DATA {
  SearchDuplicate = "Your query was not completed since it was a duplicate entry. Please try another location.",
  Server = "We could not complete your request due to a technical issue on our end. Please try again later.",
  ScheduleConflict = "There are too many scheduling conflicts. Please try another time slot.",
  ScheduleDuplicate = "You have already scheduled this item.",
  ScheduleDisabled = "This time slot has been disabled. If you intend to add data here, please enable it in the configuration."
}

export enum LABEL_COLOR {
  Mon = "Monday",
  Tues = "Tuesday",
  Wed = "Wednesday",
  Thurs = "Thursday",
  Fri = "Friday",
  Sat = "Saturday",
  Sun = "Sunday",
}

export type DAYS_OF_WEEK = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export enum DEFAULT_SCHEDULE_COLORS {
  Monday = "#ffadad",
  Tuesday = "#ffd6a5",
  Wednesday = "#fdffb6",
  Thursday = "#caffbf",
  Friday = "#9bf6ff",
  Saturday = "#a0c4ff",
  Sunday = "#bdb2ff",
}

export enum SCHEDULE_SEGMENTS {
  ThreeHours = 3,
  OneHour = 1,
  HalfHour = 0.5,
  QuarterHour = 0.25,
}

export enum NOTE_PRIORITY {
  Low = "Low",
  Med = "Medium",
  High = "High"
}