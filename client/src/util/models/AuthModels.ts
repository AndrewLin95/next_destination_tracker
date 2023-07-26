
export interface DecodedJWT {
  exp: number,
  iat: number,
  user: {
    email: string,
    _id: string
  }
}

export interface AuthState {
  userID: string;
  userEmail: string;
  token: string;
}
