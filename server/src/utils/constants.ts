export const msInDay = 86400000
export const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

export enum STATUS_CODES {
  SUCCESS = "200 Sucess",
  Duplicate = "409 Error: Duplicate Record",
  ServerError = "500 Error: Server Error"
}

export enum ERROR_CAUSE {
  Search = "Your search query could not be completed.",
  Server = "Our servers are experiencing technical issues."
}

export enum ERROR_DATA {
  SearchDuplicate = "Your query was not completed since it was a duplicate entry. Please try another location.",
  Server = "We could not complete your request due to a technical issue on our end. Please try again later."
}