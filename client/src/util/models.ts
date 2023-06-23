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

export interface MapData {
  position: {
    lat: number,
    lng: number,
  }
  locationID: string;
  formattedAddress: string;
  googleLocationID: string;
}

export interface NoteData {
  locationID: string,
  noteName: string,
  priority: string,
  formattedAddress: string,
  customNote?: string,
  openHours?: string,
  closeHours?: string,
}

export interface ScheduleData {
  scheduled: boolean,
  noteName: string,
  locationID: string,
  scheduleDate: Date,
  scheduleStart: Date,
  scheduleEnd: Date,
}