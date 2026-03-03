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
