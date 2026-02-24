export interface User {
  id: number
  name: string
  email: string
  role?: string
}

export interface AuthLoginPayload {
  email: string
  password: string
}

export interface AuthRegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  token?: string
  access_token?: string
  user?: User
}
