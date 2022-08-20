export interface LoginUser {
  email: string,
  password: string
}

export interface User extends LoginUser {
  name: string
}

export interface UserTokenResponse {
  message: string,
  token: string,
  refreshToken: string,
  userId: string,
  name: string
}
