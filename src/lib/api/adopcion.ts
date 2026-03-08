import { request, getUser } from './http'

export interface Mascota {
  id_mascota?: number
  id?: number
  nombre?: string
  especie?: string
}

export interface SolicitudAdopcionPayload {
  id_cliente: number
  id_mascota: number
  motivo: string
  direccion?: string
  tiene_mascotas?: boolean
  experiencia?: string
  fecha_solicitud?: string
  estado?: string
}

export async function listarMascotas(): Promise<Mascota[]> {
  try {
    return await request<Mascota[]>('GET', '/mascotas')
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request<Mascota[]>('GET', '/pets')
    }
    throw err
  }
}

export async function crearSolicitudAdopcion(payload: Partial<SolicitudAdopcionPayload>) {
  const u = getUser()
  const id_cliente = (u?.id ?? u?.id_usuario)
  const body: SolicitudAdopcionPayload = {
    id_cliente,
    id_mascota: Number(payload.id_mascota),
    motivo: String(payload.motivo ?? ''),
    direccion: payload.direccion,
    tiene_mascotas: payload.tiene_mascotas ?? false,
    experiencia: payload.experiencia,
    fecha_solicitud: payload.fecha_solicitud,
    estado: payload.estado ?? 'pendiente',
  }
  try {
    return await request('POST', '/solicitudes-adopcion', body)
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('POST', '/adoption-requests', body)
    }
    throw err
  }
}

export async function crearMascota(payload: Partial<Mascota & { descripcion?: string; raza?: string; edad?: string }>) {
  try {
    return await request('POST', '/mascotas', payload, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('POST', '/pets', payload, { auth: true })
    }
    throw err
  }
}

export async function actualizarMascota(id: number, payload: Partial<Mascota & { descripcion?: string; raza?: string; edad?: string }>) {
  try {
    return await request('PUT', `/mascotas/${id}`, payload, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('PUT', `/pets/${id}`, payload, { auth: true })
    }
    throw err
  }
}

export async function eliminarMascota(id: number) {
  try {
    return await request('DELETE', `/mascotas/${id}`, undefined, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('DELETE', `/pets/${id}`, undefined, { auth: true })
    }
    throw err
  }
}
