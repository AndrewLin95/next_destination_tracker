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

export interface ProjectMapData {
  userID: string,
  projectID: string,
  mapData: {
    formattedAddress: string,
    lat: number,
    lng: number,
    googleLocationID: string,
  },
  notedata: {
    customName: string,
    customNote: string,
    openHours: string,
    closeHours: string,
    priority: string
  },
  scheduleData: {
    scheduleDate: Date,
    scheduleStart: Date,
    scheduleEnd: Date,
  }
}