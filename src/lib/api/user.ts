import { apiRequest } from './core'

export interface UpdateProfilePayload {
  first_name?: string
  last_name?: string
  region?: string
  identifier?: string
  bio?: string
}

export function updateProfile(payload: UpdateProfilePayload | FormData) {
  return apiRequest('/user/profile', {
    method: 'PATCH',
    auth: true,
    formData: payload instanceof FormData,
    body: payload,
  })
}

export function changePassword(identifier: string, code: string, password: string, password_confirmation: string) {
  return apiRequest('/user/change-password', {
    method: 'PUT',
    auth: true,
    body: { identifier, code, password, password_confirmation },
  })
}
