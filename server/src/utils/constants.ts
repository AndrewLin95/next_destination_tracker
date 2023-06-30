export const msInDay = 86400000
export const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
export enum ERROR_CODES {
  Duplicate = "409 Error: Duplicate Record",
  ServerError = "500 Error: Server Error"
}