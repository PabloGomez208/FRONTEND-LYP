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
  const [idEspecie, setIdEspecie] = useState('')
  const [idSexo, setIdSexo] = useState('')
  const [raza, setRaza] = useState('')
  const [edad, setEdad] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagenFile, setImagenFile] = useState(null)

  const [especies, setEspecies] = useState([])
  const [sexos, setSexos] = useState([])

  const [editId, setEditId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editIdEspecie, setEditIdEspecie] = useState('')
  const [editIdSexo, setEditIdSexo] = useState('')
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

  async function loadOpciones() {
    try {

      const resEspecies = await fetch("http://localhost:8000/api/especies")
      const especiesData = await resEspecies.json()

      const resSexos = await fetch("http://localhost:8000/api/sexos")
      const sexosData = await resSexos.json()

      setEspecies(especiesData)
      setSexos(sexosData)

    } catch (err) {
      console.error("Error cargando selects", err)
    }
  }

  useEffect(() => {
    load()
    loadOpciones()
  }, [])

  async function onCreate(e) {

    e.preventDefault()
    setLoading(true)
    setError('')

    try {

      const edadNum = edad !== '' ? Number(edad) : undefined

      const payload = {
        nombre,
        id_especie: idEspecie,
        id_sexo: idSexo,
        raza,
        edad: edadNum,
        descripcion
      }

      if (imagenFile) payload.imagen = imagenFile

      await crearMascota(payload)

      setNombre('')
      setIdEspecie('')
      setIdSexo('')
      setRaza('')
      setEdad('')
      setDescripcion('')
      setImagenFile(null)

      await load()

    } catch {
      setError('No se pudo crear la mascota')
    }

    finally {
      setLoading(false)
    }

  }

  async function onSaveEdit(id) {

    setLoading(true)
    setError('')

    try {

      const edadNum = editEdad !== '' ? Number(editEdad) : undefined

      const payload = {
        nombre: editNombre,
        id_especie: editIdEspecie,
        id_sexo: editIdSexo,
        raza: editRaza,
        edad: edadNum,
        descripcion: editDescripcion
      }

      if (editImagenFile) payload.imagen = editImagenFile

      await actualizarMascota(Number(id), payload)

      setEditId(null)

      await load()

    } catch {
      setError('No se pudo actualizar la mascota')
    }

    finally {
      setLoading(false)
    }

  }

  async function onDelete(id) {

    setLoading(true)
    setError('')

    try {

      await eliminarMascota(Number(id))
      await load()

    } catch {
      setError('No se pudo eliminar la mascota')
    }

    finally {
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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Mascotas</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>Administra mascotas en adopción</p>
          </div>
        </div>
      </Hero>

      <section style={{ padding: '24px 16px' }}>

        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16
        }}>

          {/* CREAR MASCOTA */}

          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 18,
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
          }}>

            <h3>Agregar mascota</h3>

            <form onSubmit={onCreate}>

              <TextInput
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              {/* ESPECIE */}

              <label>Especie</label>

              <select
                value={idEspecie}
                onChange={(e) => setIdEspecie(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', marginBottom: 12 }}
              >

                <option value="">Seleccione especie</option>

                {especies.map((e) => (
                  <option key={e.id_especie} value={e.id_especie}>
                    {e.nombre}
                  </option>
                ))}

              </select>

              {/* SEXO */}

              <label>Sexo</label>

              <select
                value={idSexo}
                onChange={(e) => setIdSexo(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', marginBottom: 12 }}
              >

                <option value="">Seleccione sexo</option>

                {sexos.map((s) => (
                  <option key={s.id_sexo} value={s.id_sexo}>
                    {s.nombre}
                  </option>
                ))}

              </select>

              <TextInput label="Raza" value={raza} onChange={(e) => setRaza(e.target.value)} />

              <TextInput
                label="Edad"
                type="number"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
              />

              <label>Descripción</label>

              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  marginBottom: 12
                }}
              />

              <label>Imagen</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagenFile(e.target.files[0])}
              />

              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Agregar'}
              </Button>

            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

          </div>

          {/* LISTADO */}

          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 18,
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
          }}>

            <h3>Listado</h3>

            {items.map((m) => {

              const id = m.id_mascota

              return (

                <div key={id} style={{
                  background: '#f5f5f5',
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 10
                }}>

                  <strong>{m.nombre}</strong> ({m.especie}) [{m.sexo}]

                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>

                    <Button onClick={() => {

                      setEditId(id)
                      setEditNombre(m.nombre || '')
                      setEditRaza(m.raza || '')
                      setEditEdad(m.edad || '')
                      setEditDescripcion(m.descripcion || '')
                      setEditIdEspecie(m.id_especie || '')
                      setEditIdSexo(m.id_sexo || '')

                    }}>
                      Editar
                    </Button>

                    <Button onClick={() => onDelete(id)}>
                      Eliminar
                    </Button>

                  </div>

                </div>

              )

            })}

          </div>

        </div>

      </section>

    </div>
  )
}
