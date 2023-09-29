export const NUM_RESULTS_PER_PAGE = 10;
export const MS_IN_DAY = 86400000;
export const BASE_SCHEDULE_HEIGHT = 3; //rem
export const MAX_NUM_OF_IMAGES = 1;

export enum VERIFY_TOKEN_RESPONSE {
  NoToken = "No Token",
  TokenFound = "Token Found",
}

export enum NOTE_PRIORITY {
  Low = "Low",
  Med = "Medium",
  High = "High"
}

export const SIMPLE_BUTTON_STYLE = "font-bold border-r-0 text-md p-0 bg-inherit hover:border-transparent focus:outline-none"
export const FORM_SUBMIT_BUTTON = "font-bold border-r-0 text-md p-0 bg-PrimaryButton hover:border-transparent focus:outline-none"
export const FORM_CANCEL_BUTTON = "font-bold border-r-0 text-md p-0 bg-SecondaryButton hover:border-transparent focus:outline-none"

// Styling for editNoteDialog
export enum PRIORITY_STYLE {
  Low = "pr-2 text-green-500",
  Med = "pr-2 text-yellow-500",
  High = "pr-2 text-red-500",
  Default = "pr-2",
}

export const REMOVE_IMG_BTN_STYLE = "h-10 text-sm font-bold border-r-0 text-md p-0 bg-transparent hover:border-transparent focus:outline-none"
export const UPLOAD_IMG_BTN_STYLE = "h-10 text-sm font-bold border-r-0 text-md p-0 hover:border-transparent focus:outline-none"

export enum LABEL_COLOR {
  Mon = "Monday",
  Tues = "Tuesday",
  Wed = "Wednesday",
  Thurs = "Thursday",
  Fri = "Friday",
  Sat = "Saturday",
  Sun = "Sunday",
}

export type DAYS_OF_WEEK = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

export enum HEX_TRANSPARENCY {
  NinetyPercent = "E6",
  EighttyPercent = "CC",
  SeventyPercent = "B3",
  SixtyPercent = "99",
  FiftyPercent = "80",
  FourtyPercent = "66",
  ThirtyPercent = "4D",
  TwentyPercent = "33",
  TenPercent = "1A",
  ZeroPercent = "00",
}

// Server Responses
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
  ScheduleOutOfBounds = "You scheduled this out of bounds. Please try a different schedule time.",
  ScheduleDisabled = "This time slot has been disabled. If you intend to add data here, please enable it in the configuration."
}

export enum VIEW_TYPES {
  Map = "Map",
  Schedule = "Schedule"
}

export enum SCHEDULE_SEGMENTS {
  ThreeHours = 3,
  OneHour = 1,
  HalfHour = 0.5,
  QuarterHour = 0.25,
}
