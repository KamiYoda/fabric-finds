const ACCESS_TOKEN_KEY = 'i-sew.access-token'
const REFRESH_TOKEN_KEY = 'i-sew.refresh-token'

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setAuthToken(accessToken: string, refreshToken?: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getTokenExpiry(): number | null {
  const token = getAuthToken()
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = JSON.parse(decodeURIComponent(escape(window.atob(parts[1]))))
    if (payload && typeof payload.exp === 'number') return payload.exp * 1000
  } catch (e) {
    return null
  }
  return null
}
