export interface DecodedJWT {
  exp: number,
  iat: number,
  user: {
    email: string,
    _id: string
  }
}