import { apiRequest } from './core'

export interface ChatMessagePayload {
  type: 'text' | 'image'
  body?: string
  images?: File[]
}

export function getChats(page = 1, per_page = 15) {
  return apiRequest<any>(`/chats?page=${page}&per_page=${per_page}`, {
    method: 'GET',
    auth: true,
  })
}

export function getChatMessages(orderId: string, before?: string, page = 1, per_page = 15) {
  const params = new URLSearchParams({ page: String(page), per_page: String(per_page) })
  if (before) params.append('before', before)
  return apiRequest<any>(`/chats/${orderId}?${params.toString()}`, {
    method: 'GET',
    auth: true,
  })
}

export function postChatMessage(orderId: string, payload: ChatMessagePayload) {
  if (payload.type === 'image' && payload.images?.length) {
    const formData = new FormData()
    formData.append('type', 'image')
    payload.images.forEach((file, index) => formData.append(`images[${index}]`, file))
    if (payload.body) {
      formData.append('body', payload.body)
    }
    return apiRequest<any>(`/chats/${orderId}/messages`, {
      method: 'POST',
      auth: true,
      formData: true,
      body: formData,
    })
  }

  return apiRequest<any>(`/chats/${orderId}/messages`, {
    method: 'POST',
    auth: true,
    body: { type: payload.type, body: payload.body },
  })
}
