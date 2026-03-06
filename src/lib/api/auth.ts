import { request, setToken, clearToken, setUser, getUser } from './http'
import type { AuthLoginPayload, AuthRegisterPayload, AuthResponse, User } from './types'

function extractToken(data: AuthResponse) {
  return data.token || data.access_token || ''
}

function normalizeUser(raw: any): User | null {
  if (!raw) return null
  const id = raw.id ?? raw.id_usuario ?? raw.user_id ?? null
  const name = raw.name ?? raw.nombre ?? ''
  const email = raw.email ?? ''
  let role: string | undefined = raw.role ?? raw.rol ?? raw.nombre_rol
  const idRol = raw.id_rol ?? raw.rol_id ?? null
  if (!role && idRol != null) {
    const n = Number(idRol)
    role = n === 1 ? 'admin' : n === 2 ? 'veterinario' : 'cliente'
  }
  return id ? { id, name, email, role } : null
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
  let data: AuthResponse
  try {
    data = await request<AuthResponse>('POST', '/usuarios', mapped)
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 401 || status === 403 || status === 404 || status === 405 || msg.includes('unauthorized') || msg.includes('not found')) {
      const candidates = ['/register', '/auth/register']
      let ok: AuthResponse | null = null
      for (const p of candidates) {
        try {
          ok = await request<AuthResponse>('POST', p, {
            name,
            email,
            password,
            password_confirmation,
            telefono,
          })
          if (ok) break
        } catch {}
      }
      if (!ok) throw err
      data = ok
    } else {
      throw err
    }
  }
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

export async function updateProfile(payload: Partial<User & { telefono?: string; password?: string }>): Promise<User | null> {
  const current = getUser()
  const id = (current as any)?.id ?? (current as any)?.id_usuario
  if (!id) return null
  const body: Record<string, unknown> = {}
  if (payload.name) body['nombre'] = payload.name
  if (payload.email) body['email'] = payload.email
  if (payload.telefono) body['telefono'] = payload.telefono
  if ((payload as any).password) body['password'] = (payload as any).password
  try {
    const data = await request<AuthResponse>('PUT', `/usuarios/${id}`, body, { auth: true })
    const user = (data.user as any) ?? { id, name: payload.name ?? current?.name, email: payload.email ?? current?.email }
    if (user) setUser(user)
    return user as User
  } catch {
    const merged: any = { ...(current || {}), ...payload }
    if (merged) setUser(merged)
    return merged
  }
}
