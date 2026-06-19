export interface AuthUser {
  id: string
  name: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  avatar?: string
  region?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}
