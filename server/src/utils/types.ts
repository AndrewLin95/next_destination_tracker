export interface jwtToken {
  exp: number,
  iat: number,
  user: {
    _id: string,
    email: string,
  }
}

export interface SearchQuery {
  data: {
    query: string,
    projectID: string,
    projectName: string,
  }
}