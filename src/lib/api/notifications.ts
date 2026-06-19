import { apiRequest } from './core'

export function getNotifications(params?: { page?: number; per_page?: number }) {
  const query = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, value]) => value != null).map(([k, v]) => [k, String(v)])).toString()
    : ''
  return apiRequest<any>(`/notifications${query}`, { method: 'GET', auth: true }).then((res) => (res && res.data != null ? res.data : res))
}

export function markNotificationRead(id: string) {
  return apiRequest<any>(`/notifications/${id}/read`, { method: 'POST', auth: true })
}
