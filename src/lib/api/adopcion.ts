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
  return await request<Mascota[]>('GET', '/mascotas')
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
  return await request('POST', '/solicitudes-adopcion', body)
}
