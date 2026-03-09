import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import TextInput from '../Components/TextInput.jsx'
import Button from '../Components/Button.jsx'
import { listarMascotas, crearMascota, actualizarMascota, eliminarMascota } from '../lib/api/adopcion'

export default function AdminMascotas() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState('Perro')
  const [raza, setRaza] = useState('')
  const [edad, setEdad] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagenFile, setImagenFile] = useState(null)

  const [editId, setEditId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editEspecie, setEditEspecie] = useState('Perro')
  const [editRaza, setEditRaza] = useState('')
  const [editEdad, setEditEdad] = useState('')
  const [editDescripcion, setEditDescripcion] = useState('')
  const [editImagenFile, setEditImagenFile] = useState(null)

  async function load() {
    setError('')
    try {
      const data = await listarMascotas()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudieron cargar mascotas')
    }
  }

  // reload when other components notify that mascotas changed
  useEffect(() => {
    function onUpdate() {
      load()
    }
    window.addEventListener('mascotas:updated', onUpdate)
    return () => window.removeEventListener('mascotas:updated', onUpdate)
  }, [])
  useEffect(() => { load() }, [])

  async function onCreate(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const edadNum = edad !== '' ? Number(edad) : undefined
      const payload = { nombre, especie, raza, edad: edadNum, descripcion }
      if (imagenFile) payload.imagen = imagenFile
      await crearMascota(payload)
      setNombre(''); setEspecie('Perro'); setRaza(''); setEdad(''); setDescripcion(''); setImagenFile(null)
      await load()
    } catch {
      setError('No se pudo crear la mascota')
    } finally { setLoading(false) }
  }

  async function onSaveEdit(id) {
    setLoading(true)
    setError('')
    try {
      const edadNum = editEdad !== '' ? Number(editEdad) : undefined
      const payload = { nombre: editNombre, especie: editEspecie, raza: editRaza, edad: edadNum, descripcion: editDescripcion }
      if (editImagenFile) payload.imagen = editImagenFile
      await actualizarMascota(Number(id), payload)
      setEditId(null)
      await load()
    } catch {
      setError('No se pudo actualizar la mascota')
    } finally { setLoading(false) }
  }

  async function onDelete(id) {
    setLoading(true)
    setError('')
    try {
      await eliminarMascota(Number(id))
      await load()
    } catch {
      setError('No se pudo eliminar la mascota')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <Header />
      <Hero full>
        <div style={{ width: '100%', maxWidth: 900 }}>
          <div style={{
            background: 'rgba(17,17,17,0.75)',
            color: '#fff',
            borderRadius: 16,
            padding: 24,
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Mascotas</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>Administra mascotas en adopción</p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 12px' }}>Agregar mascota</h3>
            <form onSubmit={onCreate}>
              <TextInput label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <label style={{ fontSize: 14 }}>Especie</label>
                <select value={especie} onChange={(e) => setEspecie(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
                  <option>Perro</option>
                  <option>Gato</option>
                  <option>Otro</option>
                </select>
              </div>
              <TextInput label="Raza" value={raza} onChange={(e) => setRaza(e.target.value)} />
              <TextInput label="Edad" type="number" value={edad} onChange={(e) => setEdad(e.target.value)} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <label style={{ fontSize: 14 }}>Descripción</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <label style={{ fontSize: 14 }}>Imagen (archivo)</label>
                <input type="file" accept="image/*" onChange={(e) => setImagenFile(e.target.files ? e.target.files[0] : null)} />
              </div>
              <div className="auth-actions">
                <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Agregar'}</Button>
              </div>
            </form>
            {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 12px' }}>Listado</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {items.map((m) => {
                const id = m.id ?? m.id_mascota
                const isEdit = editId === id
                return (
                  <div key={id} style={{ background: '#f5f5f5', borderRadius: 12, padding: 12 }}>
                    {!isEdit ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                      <strong>{m.nombre ?? 'Mascota'}</strong> <span style={{ color: '#6b7280' }}>{m.especie}</span>
                      {m.estado ? <span style={{ marginLeft: 8, fontSize: 12 }}>[{m.estado}]</span> : null}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                      <Button onClick={() => {
                            setEditId(id);
                            setEditNombre(m.nombre ?? '');
                            setEditEspecie(m.especie ?? 'Perro');
                            setEditRaza(m.raza ?? '');
                            setEditEdad(m.edad ?? '');
                            setEditDescripcion(m.descripcion ?? '');
                            setEditImagenFile(null);
                          }}>Editar</Button>
                          <Button onClick={() => onDelete(id)}>Eliminar</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <TextInput label="Nombre" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                          <label style={{ fontSize: 14 }}>Especie</label>
                          <select value={editEspecie} onChange={(e) => setEditEspecie(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
                            <option>Perro</option>
                            <option>Gato</option>
                            <option>Otro</option>
                          </select>
                        </div>
                        <TextInput label="Raza" value={editRaza} onChange={(e) => setEditRaza(e.target.value)} />
                     <TextInput label="Edad" type="number" value={editEdad} onChange={(e) => setEditEdad(e.target.value)} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                          <label style={{ fontSize: 14 }}>Descripción</label>
                          <textarea value={editDescripcion} onChange={(e) => setEditDescripcion(e.target.value)} rows={4} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', resize: 'vertical' }} />
                        </div>
                        {/* show current image if available */}
                        {m.imagen && (
                          <div style={{ marginBottom: 12 }}>
                            <img src={m.imagen} alt="mascota" style={{ maxWidth: 120, borderRadius: 8 }} />
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                          <label style={{ fontSize: 14 }}>Imagen (archivo)</label>
                          <input type="file" accept="image/*" onChange={(e) => setEditImagenFile(e.target.files ? e.target.files[0] : null)} />
                        </div>
                        <div className="auth-actions">
                          <Button onClick={() => onSaveEdit(id)} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
                          <Button onClick={() => setEditId(null)} variant="secondary">Cancelar</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
