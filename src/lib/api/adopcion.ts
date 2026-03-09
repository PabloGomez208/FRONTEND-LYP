import { request, getUser } from './http'

export interface Mascota {
  id_mascota?: number
  id?: number
  nombre?: string
  especie?: string
  imagen?: string
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
    return await request('POST', '/solicitudes-adopcion', body, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      return await request('POST', '/adoption-requests', body)
    }
    throw err
  }
}

export async function adoptarMascota(id: number, payload: Partial<SolicitudAdopcionPayload> = {}) {
  // new endpoint which posts to /mascotas/{id}/adoptar;
  // if it does not exist fall back to the legacy solicitudes route
  try {
    return await request('POST', `/mascotas/${id}/adoptar`, payload, { auth: true })
  } catch (err: any) {
    // ignore and fallback
    return crearSolicitudAdopcion({ id_mascota: id, ...payload })
  }
}

// admin helpers -----------------------------------------------------------

export async function listarSolicitudesPendientes() {
  try {
    return await request<SolicitudAdopcionPayload[]>('GET', '/admin/solicitudes-adopcion/pendientes', undefined, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      // fall back to filtering the general collection
      // if the admin-specific endpoint isn't available, filter the generic
      // collection by estado using a query string. (request helper doesn't
      // support a `query` option so we append it manually.)
      return await request<SolicitudAdopcionPayload[]>('GET', '/solicitudes-adopcion?estado=pendiente', undefined, { auth: true })
    }
    throw err
  }
}

export async function cambiarEstadoSolicitud(id: number, estado: string) {
  try {
    return await request('PATCH', `/admin/solicitudes-adopcion/${id}`, { estado }, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      // try generic update route
      try {
        return await request('PATCH', `/solicitudes-adopcion/${id}`, { estado }, { auth: true })
      } catch {
        // maybe english
        return await request('PATCH', `/adoption-requests/${id}`, { status: estado }, { auth: true })
      }
    }
    throw err
  }
}

export async function crearMascota(payload: Partial<Mascota & { descripcion?: string; raza?: string; edad?: string; imagen?: File | string }>) {
  // the API now accepts multipart/form-data for the image; fall back to URL
  try {
    // if the caller passed a File object, build a FormData instance
    if ((payload.imagen as any) instanceof File) {
      const form = new FormData()
      for (const [k, v] of Object.entries(payload)) {
        if (v === undefined || v === null) continue
        if (k === 'imagen') {
          form.append('imagen', v as File)
        } else {
          form.append(k, String(v))
        }
      }
      return await request('POST', '/mascotas', form, { auth: true })
    }

    const body: any = { ...payload }
    if (body.edad !== undefined && body.edad !== null) {
      const n = Number(body.edad)
      body.edad = Number.isFinite(n) ? Math.trunc(n) : undefined
    }
    return await request('POST', '/mascotas', body, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      // fallback to english endpoint
      if ((payload.imagen as any) instanceof File) {
        const form = new FormData()
        for (const [k, v] of Object.entries(payload)) {
          if (v === undefined || v === null) continue
          if (k === 'imagen') {
            form.append('imagen', v as File)
          } else {
            form.append(k, String(v))
          }
        }
        return await request('POST', '/pets', form, { auth: true })
      }
      const body: any = { ...payload }
      if (body.edad !== undefined && body.edad !== null) {
        const n = Number(body.edad)
        body.edad = Number.isFinite(n) ? Math.trunc(n) : undefined
      }
      return await request('POST', '/pets', body, { auth: true })
    }
    throw err
  }
}

export async function actualizarMascota(id: number, payload: Partial<Mascota & { descripcion?: string; raza?: string; edad?: string; imagen?: File | string }>) {
  try {
    // support file upload when editing
    if ((payload.imagen as any) instanceof File) {
      const form = new FormData()
      for (const [k, v] of Object.entries(payload)) {
        if (v === undefined || v === null) continue
        if (k === 'imagen') form.append('imagen', v as File)
        else form.append(k, String(v))
      }
      return await request('PUT', `/mascotas/${id}`, form, { auth: true })
    }

    const body: any = { ...payload }
    if (body.edad !== undefined && body.edad !== null) {
      const n = Number(body.edad)
      body.edad = Number.isFinite(n) ? Math.trunc(n) : undefined
    }
    return await request('PUT', `/mascotas/${id}`, body, { auth: true })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 404 || status === 405 || msg.includes('not found')) {
      // fallback english endpoint
      if ((payload.imagen as any) instanceof File) {
        const form = new FormData()
        for (const [k, v] of Object.entries(payload)) {
          if (v === undefined || v === null) continue
          if (k === 'imagen') form.append('imagen', v as File)
          else form.append(k, String(v))
        }
        return await request('PUT', `/pets/${id}`, form, { auth: true })
      }
      const body: any = { ...payload }
      if (body.edad !== undefined && body.edad !== null) {
        const n = Number(body.edad)
        body.edad = Number.isFinite(n) ? Math.trunc(n) : undefined
      }
      return await request('PUT', `/pets/${id}`, body, { auth: true })
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
