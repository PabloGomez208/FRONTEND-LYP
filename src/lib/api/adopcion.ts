import { request, getUser } from './http'

export interface Mascota {
  id_mascota?: number
  id?: number
  nombre?: string
  especie?: string
  id_especie?: number
  sexo?: string
  id_sexo?: number
  imagen?: string
  raza?: string
  edad?: number | string
  descripcion?: string
  estado?: string
}

export interface Especie {
  id_especie: number
  nombre: string
  activo?: boolean
}

export interface Sexo {
  id_sexo: number
  nombre: string
  activo?: boolean
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

export async function listarEspecies(): Promise<Especie[]> {
  try {
    const raw = await request<any>('GET', '/mascotas/especies', undefined, { auth: true })
    let list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.items)
          ? raw.items
          : Array.isArray(raw?.especies)
            ? raw.especies
            : []
    if (!Array.isArray(list) || list.length === 0) {
      // try alias route if available
      try {
        const raw2 = await request<any>('GET', '/especies', undefined, { auth: true })
        list = Array.isArray(raw2)
          ? raw2
          : Array.isArray(raw2?.data)
            ? raw2.data
            : Array.isArray(raw2?.items)
              ? raw2.items
              : Array.isArray(raw2?.especies)
                ? raw2.especies
                : list
      } catch {}
    }
    if (!Array.isArray(list) || list.length === 0) {
      try {
        const mascotas = await listarMascotas()
        const names = Array.from(new Set((Array.isArray(mascotas) ? mascotas : []).map((m) => m?.especie).filter(Boolean)))
        list = names
      } catch {}
    }
    return (list as any[]).map((e: any) => {
      if (typeof e === 'string') return { id_especie: undefined as any, nombre: e }
      return {
        id_especie: e?.id_especie ?? e?.id ?? e?.value,
        nombre: e?.nombre ?? e?.label ?? String(e ?? ''),
        activo: e?.activo,
      } as Especie
    })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 401 || status === 403) {
      const raw = await request<any>('GET', '/mascotas/especies')
      let list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.items)
            ? raw.items
            : Array.isArray(raw?.especies)
              ? raw.especies
              : []
      if (!Array.isArray(list) || list.length === 0) {
        try {
          const raw2 = await request<any>('GET', '/especies')
          list = Array.isArray(raw2)
            ? raw2
            : Array.isArray(raw2?.data)
              ? raw2.data
              : Array.isArray(raw2?.items)
                ? raw2.items
                : Array.isArray(raw2?.especies)
                  ? raw2.especies
                  : list
        } catch {}
      }
      if (!Array.isArray(list) || list.length === 0) {
        try {
          const mascotas = await listarMascotas()
          const names = Array.from(new Set((Array.isArray(mascotas) ? mascotas : []).map((m) => m?.especie).filter(Boolean)))
          list = names
        } catch {}
      }
      return (list as any[]).map((e: any) => {
        if (typeof e === 'string') return { id_especie: undefined as any, nombre: e }
        return {
          id_especie: e?.id_especie ?? e?.id ?? e?.value,
          nombre: e?.nombre ?? e?.label ?? String(e ?? ''),
          activo: e?.activo,
        } as Especie
      })
    }
    if (status === 404 || status === 405 || msg.includes('not found')) {
      const raw = await request<any>('GET', '/pets/species', undefined, { auth: true })
      let list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.items)
            ? raw.items
            : []
      // extra alias on english route space
      if (!Array.isArray(list) || list.length === 0) {
        try {
          const raw2 = await request<any>('GET', '/species', undefined, { auth: true })
          list = Array.isArray(raw2)
            ? raw2
            : Array.isArray(raw2?.data)
              ? raw2.data
              : Array.isArray(raw2?.items)
                ? raw2.items
                : list
        } catch {}
      }
      if (!Array.isArray(list) || list.length === 0) {
        try {
          const mascotas = await listarMascotas()
          const names = Array.from(new Set((Array.isArray(mascotas) ? mascotas : []).map((m) => m?.especie).filter(Boolean)))
          list = names
        } catch {}
      }
      return (list as any[]).map((e: any) => {
        if (typeof e === 'string') return { id_especie: undefined as any, nombre: e }
        return {
          id_especie: e?.id_especie ?? e?.id ?? e?.value,
          nombre: e?.nombre ?? e?.label ?? String(e ?? ''),
          activo: e?.activo,
        } as Especie
      })
    }
    throw err
  }
}

export async function listarSexos(): Promise<Sexo[]> {
  try {
    const raw = await request<any>('GET', '/sexos', undefined, { auth: true })
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.items)
          ? raw.items
          : Array.isArray(raw?.sexos)
            ? raw.sexos
            : []
    return list.map((s: any) => {
      if (typeof s === 'string') return { id_sexo: undefined as any, nombre: s }
      return {
        id_sexo: s?.id_sexo ?? s?.id ?? s?.value,
        nombre: s?.nombre ?? s?.label ?? String(s ?? ''),
        activo: s?.activo,
      } as Sexo
    })
  } catch (err: any) {
    const status = err?.status
    const msg = String(err?.message || '').toLowerCase()
    if (status === 401 || status === 403) {
      const raw = await request<any>('GET', '/sexos')
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.items)
            ? raw.items
            : Array.isArray(raw?.sexos)
              ? raw.sexos
              : []
      return list.map((s: any) => {
        if (typeof s === 'string') return { id_sexo: undefined as any, nombre: s }
        return {
          id_sexo: s?.id_sexo ?? s?.id ?? s?.value,
          nombre: s?.nombre ?? s?.label ?? String(s ?? ''),
          activo: s?.activo,
        } as Sexo
      })
    }
    if (status === 404 || status === 405 || msg.includes('not found')) {
      const raw = await request<any>('GET', '/genders', undefined, { auth: true })
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.items)
            ? raw.items
            : []
      return list.map((s: any) => {
        if (typeof s === 'string') return { id_sexo: undefined as any, nombre: s }
        return {
          id_sexo: s?.id_sexo ?? s?.id ?? s?.value,
          nombre: s?.nombre ?? s?.label ?? String(s ?? ''),
          activo: s?.activo,
        } as Sexo
      })
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
  const e = String(estado || '').toLowerCase()
  const isApprove = e.includes('aproba') || e.includes('acept')
  const isReject = e.includes('rechaz') || e.includes('deneg') || e.includes('cancel')
  const normalized = isApprove ? 'aprobada' : isReject ? 'rechazada' : estado
  // Prefer explicit PATCH route first if available
  try {
    return await request('PATCH', `/solicitudes-adopcion/${id}/estado`, { estado: normalized }, { auth: true })
  } catch (err1: any) {
    // Try admin route (older)
    try {
      return await request('PATCH', `/admin/solicitudes-adopcion/${id}`, { estado: normalized }, { auth: true })
    } catch (err2: any) {
      // If admin/generic PATCH not available, try dedicated approve/reject endpoints
      try {
        if (isApprove) {
          return await request('POST', `/solicitudes-adopcion/${id}/aprobar`, undefined, { auth: true })
        } else if (isReject) {
          return await request('POST', `/solicitudes-adopcion/${id}/rechazar`, undefined, { auth: true })
        } else {
          // fallback to generic patch without /estado
          return await request('PATCH', `/solicitudes-adopcion/${id}`, { estado: normalized }, { auth: true })
        }
      } catch (err3: any) {
        // final english fallback
        const body = isApprove ? { status: 'approved' } : isReject ? { status: 'rejected' } : { status: normalized }
        return await request('PATCH', `/adoption-requests/${id}`, body, { auth: true })
      }
    }
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
          try { form.append('foto', v as File) } catch {}
          try { form.append('image', v as File) } catch {}
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
            try { form.append('foto', v as File) } catch {}
            try { form.append('image', v as File) } catch {}
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
        if (k === 'imagen') {
          form.append('imagen', v as File)
          try { form.append('foto', v as File) } catch {}
          try { form.append('image', v as File) } catch {}
        }
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
          if (k === 'imagen') {
            form.append('imagen', v as File)
            try { form.append('foto', v as File) } catch {}
            try { form.append('image', v as File) } catch {}
          }
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
