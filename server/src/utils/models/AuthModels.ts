
export interface AuthUserResponse {
  userEmail: string,
  userPassword: string,
  joinDate: Date, 
  firstName: string,
  lastName: string,
}

export interface jwtToken {
  exp: number,
  iat: number,
  user: {
    _id: string,
    email: string,
  }
}
