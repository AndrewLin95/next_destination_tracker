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
    position: {
      lat: number,
      lng: number,
    },
  },
  noteData: {
    noteName: string,
    priority: string,
    formattedAddress: string,
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
  }
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
    position: {
      lat: number,
      lng: number,
    },
  },
  noteData: {
    noteName: string,
    priority: string,
    formattedAddress: string,
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
  }
}

export interface MapPayloadData {
  lat: number,
  lng: number,
  locationID: string,
}

export interface NotePayloadData {
  locationID: string,
  noteName: string,
  priority: string,
  formattedAddress: string,
  customNote?: string,
  openHours?: string,
  closeHours?: string,
}

export interface SchedulePayloadData {
  scheduled: boolean,
  noteName: string,
  locationID: string,
  scheduleDate: Date,
  scheduleStart: Date,
  scheduleEnd: Date,
}
