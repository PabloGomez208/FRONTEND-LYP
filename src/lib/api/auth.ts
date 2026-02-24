import { request, setToken, clearToken } from './http'
import type { AuthLoginPayload, AuthRegisterPayload, AuthResponse, User } from './types'

function extractToken(data: AuthResponse) {
  return data.token || data.access_token || ''
}

export async function login(payload: AuthLoginPayload): Promise<User | null> {
  const data = await request<AuthResponse>('POST', '/login', payload)
  const token = extractToken(data)
  if (token) setToken(token)
  return data.user ?? null
}

export async function register(payload: AuthRegisterPayload): Promise<User | null> {
  const { name, email, password, password_confirmation } = payload
  const DEFAULT_ROLE_ID = Number(import.meta.env.VITE_DEFAULT_ROLE_ID ?? 3)
  const mapped: Record<string, unknown> = {
    nombre: name,
    email,
    password,
    id_rol: DEFAULT_ROLE_ID,
  }
  if (password_confirmation) mapped.password_confirmation = password_confirmation
  const data = await request<AuthResponse>('POST', '/usuarios', mapped)
  const token = extractToken(data)
  if (token) setToken(token)
  return data.user ?? null
}

export function logout() {
  clearToken()
}
