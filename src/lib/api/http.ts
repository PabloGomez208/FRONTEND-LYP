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

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
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
    let err: ApiError = { status: res.status, message: res.statusText }
    try {
      const data = isJson ? await res.json() : await res.text()
      err = {
        status: res.status,
        message: typeof data === 'string' ? data : data?.message ?? res.statusText,
        details: typeof data === 'string' ? undefined : data,
      }
    } catch {}
    throw err
  }
  if (!isJson) {
    const text = await res.text()
    return text as unknown as T
  }
  return (await res.json()) as T
}
