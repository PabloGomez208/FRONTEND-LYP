import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import TextInput from '../Components/TextInput.jsx'
import Button from '../Components/Button.jsx'
import { listarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../lib/api/users'

export default function AdminUsuarios() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [idRol, setIdRol] = useState(3)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editIdRol, setEditIdRol] = useState(3)

  async function load() {
    setError('')
    try {
      const data = await listarUsuarios()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudo cargar usuarios')
    }
  }
  useEffect(() => { load() }, [])

  async function onCreate(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await crearUsuario({ name, email, password, id_rol: Number(idRol) })
      setName(''); setEmail(''); setPassword(''); setIdRol(3)
      await load()
    } catch {
      setError('No se pudo crear el usuario')
    } finally {
      setLoading(false)
    }
  }

  async function onSaveEdit(id) {
    setLoading(true)
    setError('')
    try {
      await actualizarUsuario(Number(id), { nombre: editName, email: editEmail, id_rol: Number(editIdRol) })
      setEditId(null)
      await load()
    } catch {
      setError('No se pudo actualizar el usuario')
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id) {
    setLoading(true)
    setError('')
    try {
      await eliminarUsuario(Number(id))
      await load()
    } catch {
      setError('No se pudo eliminar el usuario')
    } finally {
      setLoading(false)
    }
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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Usuarios</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>Administra usuarios del sistema</p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 12px' }}>Crear usuario</h3>
            <form onSubmit={onCreate}>
              <TextInput label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
              <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <TextInput label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <label style={{ fontSize: 14 }}>Rol</label>
                <select value={idRol} onChange={(e) => setIdRol(Number(e.target.value))} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
                  <option value={1}>Admin</option>
                  <option value={2}>Veterinario</option>
                  <option value={3}>Cliente</option>
                </select>
              </div>
              <div className="auth-actions">
                <Button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear'}</Button>
              </div>
            </form>
            {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 12px' }}>Listado</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {items.map((u) => {
                const id = u.id ?? u.id_usuario
                const isEdit = editId === id
                return (
                  <div key={id} style={{ background: '#f5f5f5', borderRadius: 12, padding: 12 }}>
                    {!isEdit ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{u.nombre ?? u.name}</strong>
                          <div style={{ color: '#374151' }}>{u.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button onClick={() => { setEditId(id); setEditName(u.nombre ?? u.name ?? ''); setEditEmail(u.email ?? ''); setEditIdRol(u.id_rol ?? 3) }}>Editar</Button>
                          <Button variant="danger" onClick={() => onDelete(id)}>Eliminar</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <TextInput label="Nombre" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        <TextInput label="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                          <label style={{ fontSize: 14 }}>Rol</label>
                          <select value={editIdRol} onChange={(e) => setEditIdRol(Number(e.target.value))} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
                            <option value={1}>Admin</option>
                            <option value={2}>Veterinario</option>
                            <option value={3}>Cliente</option>
                          </select>
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
