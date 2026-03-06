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
  return await request<UserRecord[]>('GET', '/usuarios', undefined, { auth: true })
}

export async function crearUsuario(payload: Partial<UserRecord & { password?: string }>) {
  const body: Record<string, unknown> = {}
  if (payload.name || payload.nombre) body['nombre'] = payload.name ?? payload.nombre
  if (payload.email) body['email'] = payload.email
  if (payload.id_rol != null) body['id_rol'] = payload.id_rol
  if ((payload as any).password) body['password'] = (payload as any).password
  return await request('POST', '/usuarios', body, { auth: true })
}

export async function actualizarUsuario(id: number, payload: Partial<UserRecord>) {
  const body: Record<string, unknown> = {}
  if (payload.name || payload.nombre) body['nombre'] = payload.name ?? payload.nombre
  if (payload.email) body['email'] = payload.email
  if (payload.id_rol != null) body['id_rol'] = payload.id_rol
  return await request('PUT', `/usuarios/${id}`, body, { auth: true })
}

export async function eliminarUsuario(id: number) {
  return await request('DELETE', `/usuarios/${id}`, undefined, { auth: true })
}
