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
  mapData: {
    formattedAddress: string,
    googleLocationID: string,
    markerData: {
      lat: number,
      lng: number,
    },
  },
  noteData: {
    noteName: string,
    priority: string,
    customNote?: string,
    openHours?: string,
    closeHours?: string,
  },
  scheduleData?:{
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

export interface MapPayloadData {
  lat: number,
  lng: number,
  locationID: string,
}

export interface NotePayloadData {
  locationID: string,
  noteName: string,
  priority: string,
  customNote?: string,
  openHours?: string,
  closeHours?: string,
}

export interface SchedulePayloadData {
  locationID: string,
  scheduleDate: Date,
  scheduleStart: Date,
  scheduleEnd: Date,
}
