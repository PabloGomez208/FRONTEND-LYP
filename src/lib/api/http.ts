export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiError {
  status: number
  message: string
  details?: unknown
}

export interface RequestOptions {
  headers?: Record<string, string>
  auth?: boolean
  signal?: AbortSignal
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setUser(user: unknown) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...options.headers,
  }
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  if (options.auth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
    signal: options.signal,
    credentials: 'include',
  })
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  if (!res.ok) {
    // automatic handling of unauthorized responses
    if (res.status === 401 || res.status === 403) {
      try { clearToken() } catch {};
      // redirect to login screen to force re‑auth
      if (typeof window !== 'undefined') window.location.hash = 'login'
    }
    let err: ApiError = { status: res.status, message: res.statusText }
    try {
      const data = isJson ? await res.json() : await res.text()
      if (typeof data === 'string') {
        err = { status: res.status, message: data }
      } else {
        let msg = data?.message ?? res.statusText
        const errors = data?.errors
        if (errors) {
          if (Array.isArray(errors)) {
            msg = errors.join('; ')
          } else if (typeof errors === 'object') {
            const parts: string[] = []
            for (const k of Object.keys(errors)) {
              const v = (errors as any)[k]
              if (Array.isArray(v)) parts.push(`${k}: ${v.join(', ')}`)
              else if (v) parts.push(`${k}: ${String(v)}`)
            }
            if (parts.length > 0) msg = parts.join(' | ')
          }
        } else if (data?.error) {
          msg = data.error
        } else if (data?.detail) {
          msg = data.detail
        }
        err = { status: res.status, message: String(msg), details: data }
      }
      try {
        // Surface server payload for debugging 4xx/5xx
        console.error('API error', { path, status: res.status, data })
      } catch {}
    } catch {}
    throw err
  }
  if (!isJson) {
    const text = await res.text()
    return text as unknown as T
  }
  return (await res.json()) as T
}
