import { request, getUser } from './http'

export interface CitaPayload {
  id_cliente: number
  motivo: string
  id_disponibilidad?: number
  estado?: string
}

export interface Cita {
  id?: number
  fecha: string
  hora: string
  motivo?: string
  telefono?: string
}

export async function crearCita(payload: Partial<CitaPayload>): Promise<Cita> {
  const u = getUser()
  const id_cliente = (u?.id ?? u?.id_usuario)
  const body: CitaPayload = {
    id_cliente,
    motivo: payload.motivo || '',
    id_disponibilidad: payload.id_disponibilidad,
    estado: payload.estado,
  }
  return await request<Cita>('POST', '/citas', body)
}

export async function listarCitas(): Promise<Cita[]> {
  return await request<Cita[]>('GET', '/citas')
}

export async function listarCitasAdmin(): Promise<any[]> {
  return await request<any[]>('GET', '/admin/citas', undefined, { auth: true })
}

export async function listarCitasActivasAdmin(): Promise<any[]> {
  return await request<any[]>('GET', '/admin/citas-activas', undefined, { auth: true })
}

export interface Disponibilidad {
  id_disponibilidad: number
  id_veterinario?: number
  fecha: string
  hora_inicio: string
  hora_fin: string
  estado?: string
}

export async function listarDisponibilidad(estado?: string): Promise<Disponibilidad[]> {
  const path = estado ? `/disponibilidad-citas?estado=${encodeURIComponent(estado)}` : '/disponibilidad-citas'
  return await request<Disponibilidad[]>('GET', path)
}

export async function crearDisponibilidad(payload: Partial<Disponibilidad>) {
  return await request('POST', '/disponibilidad-citas', payload, { auth: true })
}

export async function actualizarDisponibilidad(id: number, payload: Partial<Disponibilidad>) {
  return await request('PUT', `/disponibilidad-citas/${id}`, payload, { auth: true })
}

export async function eliminarDisponibilidad(id: number) {
  return await request('DELETE', `/disponibilidad-citas/${id}`, undefined, { auth: true })
}

export async function actualizarCita(id: number, payload: Partial<CitaPayload>) {
  return await request('PUT', `/citas/${id}`, payload, { auth: true })
}

export async function eliminarCita(id: number) {
  return await request('DELETE', `/citas/${id}`, undefined, { auth: true })
}

export async function cambiarEstadoCita(id: number, estado: string) {
  try {
    return await request('PATCH', `/citas/${id}/estado`, { estado }, { auth: true })
  } catch {
    return await request('PATCH', `/citas/${id}`, { estado }, { auth: true })
  }
}
