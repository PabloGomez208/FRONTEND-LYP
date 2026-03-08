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
  try {
    return await request<Cita>('POST', '/citas', body)
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request<Cita>('POST', '/appointments', body)
    }
    throw err
  }
}

export async function listarCitas(): Promise<Cita[]> {
  try {
    return await request<Cita[]>('GET', '/citas')
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request<Cita[]>('GET', '/appointments')
    }
    throw err
  }
}

export async function listarCitasAdmin(): Promise<any[]> {
  try {
    return await request<any[]>('GET', '/admin/citas', undefined, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request<any[]>('GET', '/admin/appointments', undefined, { auth: true })
    }
    throw err
  }
}

export async function listarCitasActivasAdmin(): Promise<any[]> {
  try {
    return await request<any[]>('GET', '/admin/citas-activas', undefined, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request<any[]>('GET', '/admin/active-appointments', undefined, { auth: true })
    }
    throw err
  }
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
  try {
    return await request<Disponibilidad[]>('GET', path)
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      const alt = estado ? `/availability?estado=${encodeURIComponent(estado)}` : '/availability'
      return await request<Disponibilidad[]>('GET', alt)
    }
    throw err
  }
}

export async function crearDisponibilidad(payload: Partial<Disponibilidad>) {
  try {
    return await request('POST', '/disponibilidad-citas', payload, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('POST', '/availability', payload, { auth: true })
    }
    throw err
  }
}

export async function actualizarDisponibilidad(id: number, payload: Partial<Disponibilidad>) {
  try {
    return await request('PUT', `/disponibilidad-citas/${id}`, payload, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('PUT', `/availability/${id}`, payload, { auth: true })
    }
    throw err
  }
}

export async function eliminarDisponibilidad(id: number) {
  try {
    return await request('DELETE', `/disponibilidad-citas/${id}`, undefined, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('DELETE', `/availability/${id}`, undefined, { auth: true })
    }
    throw err
  }
}

export async function actualizarCita(id: number, payload: Partial<CitaPayload>) {
  try {
    return await request('PUT', `/citas/${id}`, payload, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('PUT', `/appointments/${id}`, payload, { auth: true })
    }
    throw err
  }
}

export async function eliminarCita(id: number) {
  try {
    return await request('DELETE', `/citas/${id}`, undefined, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('DELETE', `/appointments/${id}`, undefined, { auth: true })
    }
    throw err
  }
}

export async function cambiarEstadoCita(id: number, estado: string) {
  try {
    return await request('PATCH', `/citas/${id}/estado`, { estado }, { auth: true })
  } catch {
    try {
      return await request('PATCH', `/citas/${id}`, { estado }, { auth: true })
    } catch (err: any) {
      const status = err?.status
      const msg = String(err?.message || '').toLowerCase()
      if (status === 404 || status === 405 || msg.includes('not found')) {
        try {
          return await request('PATCH', `/appointments/${id}/status`, { estado }, { auth: true })
        } catch {
          return await request('PATCH', `/appointments/${id}`, { estado }, { auth: true })
        }
      }
      throw err
    }
  }
}
