import { request, setToken, clearToken, setUser } from './http'
import type { AuthLoginPayload, AuthRegisterPayload, AuthResponse, User } from './types'

function extractToken(data: AuthResponse) {
  return data.token || data.access_token || ''
}

function normalizeUser(raw: any): User | null {
  if (!raw) return null
  const id = raw.id ?? raw.id_usuario ?? raw.user_id ?? null
  const name = raw.name ?? raw.nombre ?? ''
  const email = raw.email ?? ''
  return id ? { id, name, email } : null
}

export async function login(payload: AuthLoginPayload): Promise<User | null> {
  try {
    const data = await request<AuthResponse>('POST', '/login', payload)
    const token = extractToken(data)
    const user = normalizeUser(data.user)
    if (token) setToken(token)
    if (user) setUser(user)
    return user
  } catch (err: any) {
    const msg = String(err?.message || '').toLowerCase()
    if (err?.status === 404 || err?.status === 405 || msg.includes('not found')) {
      const list = await request<any[]>('GET', '/usuarios')
      const found = Array.isArray(list)
        ? list.find((u) => (u.email ?? '').toLowerCase() === payload.email.toLowerCase() && (u.password ?? '') === payload.password)
        : null
      const user = normalizeUser(found)
      if (user) {
        setToken(`local:${user.id}`)
        setUser(user)
        return user
      }
    }
    throw err
  }
}

export async function register(payload: AuthRegisterPayload): Promise<User | null> {
  const { name, email, password, password_confirmation, telefono } = payload
  const DEFAULT_ROLE_ID = Number(import.meta.env.VITE_DEFAULT_ROLE_ID ?? 1)
  const mapped: Record<string, unknown> = {
    nombre: name,
    email,
    password,
    id_rol: DEFAULT_ROLE_ID,
  }
  if (password_confirmation) mapped.password_confirmation = password_confirmation
  if (telefono) mapped.telefono = telefono
  const data = await request<AuthResponse>('POST', '/usuarios', mapped)
  const token = extractToken(data)
  let user = normalizeUser(data.user)
  if (!user) {
    const list = await request<any[]>('GET', '/usuarios')
    const found = Array.isArray(list) ? list.find((u) => (u.email ?? '').toLowerCase() === email.toLowerCase()) : null
    user = normalizeUser(found)
  }
  if (!token && user) {
    setToken(`local:${user.id}`)
  } else if (token) {
    setToken(token)
  }
  if (user) setUser(user)
  return user
}

export function logout() {
  clearToken()
}
