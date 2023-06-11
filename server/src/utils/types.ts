export interface jwtToken {
  exp: number,
  iat: number,
  user: {
    _id: string,
    email: string,
  }
}