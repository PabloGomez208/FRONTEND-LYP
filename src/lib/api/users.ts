import { request } from './http'

export interface UserRecord {
  id?: number
  id_usuario?: number
  nombre?: string
  name?: string
  email?: string
  id_rol?: number
  rol?: string
}

export async function listarUsuarios(): Promise<UserRecord[]> {
  try {
    return await request<UserRecord[]>('GET', '/usuarios', undefined, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request<UserRecord[]>('GET', '/users', undefined, { auth: true })
    }
    throw err
  }
}

export async function crearUsuario(payload: Partial<UserRecord & { password?: string }>) {
  const body: Record<string, unknown> = {}
  if (payload.name || payload.nombre) body['nombre'] = payload.name ?? payload.nombre
  if (payload.email) body['email'] = payload.email
  if (payload.id_rol != null) body['id_rol'] = payload.id_rol
  if ((payload as any).password) body['password'] = (payload as any).password
  try {
    return await request('POST', '/usuarios', body, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('POST', '/users', body, { auth: true })
    }
    throw err
  }
}

export async function actualizarUsuario(id: number, payload: Partial<UserRecord>) {
  const body: Record<string, unknown> = {}
  if (payload.name || payload.nombre) body['nombre'] = payload.name ?? payload.nombre
  if (payload.email) body['email'] = payload.email
  if (payload.id_rol != null) body['id_rol'] = payload.id_rol
  try {
    return await request('PUT', `/usuarios/${id}`, body, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('PUT', `/users/${id}`, body, { auth: true })
    }
    throw err
  }
}

export async function eliminarUsuario(id: number) {
  try {
    return await request('DELETE', `/usuarios/${id}`, undefined, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('DELETE', `/users/${id}`, undefined, { auth: true })
    }
    throw err
  }
}
