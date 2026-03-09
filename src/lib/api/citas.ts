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
  estado?: string
  id_veterinario?: number
  veterinario?: string
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
    return await request<Cita>('POST', '/citas', body, { auth: true })
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
    return await request<Cita[]>('GET', '/citas', undefined, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request<Cita[]>('GET', '/appointments')
    }
    throw err
  }
}

export async function listarCitasPorVeterinario(vetId: number, estado?: string): Promise<Cita[]> {
  // prefer dedicated veterinarian endpoint (with optional estado filter)
  const qs = estado ? `?estado=${encodeURIComponent(estado)}` : ''
  try {
    return await request<Cita[]>('GET', `/veterinarios/${vetId}/citas${qs}`, undefined, { auth: true })
  } catch (err: any) {
    // if the endpoint isn't available fall back to general `/citas` and client filtering
    const all = await listarCitas()
    let list = Array.isArray(all) ? all : []
    if (estado) {
      list = list.filter((c) => (c && (c.estado ?? '').toLowerCase()) === estado.toLowerCase())
    }
    return list.filter((c) => c && c.id_veterinario === vetId)
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

export async function listarEspeciesMascotas(): Promise<string[]> {
  try {
    return await request<string[]>('GET', '/citas/mascotas-especies')
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request<string[]>('GET', '/appointments/pet-species')
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

export async function cambiarEstadoDisponibilidad(id: number, estado: string) {
  try {
    return await request('PATCH', `/disponibilidad-citas/${id}/estado`, { estado }, { auth: true })
  } catch (err: any) {
    try {
      return await request('PATCH', `/disponibilidad-citas/${id}`, { estado }, { auth: true })
    } catch (err2: any) {
      const status = err2?.status
      const msg = String(err2?.message || '').toLowerCase()
      if (status === 404 || status === 405 || msg.includes('not found')) {
        return await request('PATCH', `/availability/${id}/status`, { estado }, { auth: true })
      }
      throw err2
    }
  }
}

export async function confirmarCita(vetId: number, citaId: number) {
  try {
    return await request('POST', `/veterinarios/${vetId}/citas/${citaId}/confirmar`, undefined, { auth: true })
  } catch {
    // fallback to generic state change
    return cambiarEstadoCita(citaId, 'confirmada')
  }
}

export async function cancelarCita(vetId: number, citaId: number) {
  try {
    return await request('POST', `/veterinarios/${vetId}/citas/${citaId}/cancelar`, undefined, { auth: true })
  } catch {
    return cambiarEstadoCita(citaId, 'cancelada')
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
