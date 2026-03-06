import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import Inicio from './pages/inicio.jsx'
import Adopcion from './pages/Adopcion.jsx'
import Citas from './pages/Citas.jsx'
import SolicitudAdopcion from './pages/SolicitudAdopcion.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Contacto from './pages/Contacto.jsx'
import MisMascotas from './pages/MisMascotas.jsx'
import MisCitas from './pages/MisCitas.jsx'
import EditarPerfil from './pages/EditarPerfil.jsx'
import AdminUsuarios from './pages/AdminUsuarios.jsx'
import AdminCitas from './pages/AdminCitas.jsx'
import AdminMascotas from './pages/AdminMascotas.jsx'
import VetDisponibilidad from './pages/VetDisponibilidad.jsx'
import VetSolicitudes from './pages/VetSolicitudes.jsx'

function App() {
  const initial = typeof window !== 'undefined' && window.location.hash
    ? window.location.hash.slice(1)
    : 'inicio'
  const [view, setView] = useState(initial.split('?')[0])

  useEffect(() => {
    function onHashChange() {
      const next = window.location.hash.slice(1) || 'inicio'
      const path = next.split('?')[0]
      setView(path)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <div>
      {view === 'inicio' && <Inicio />}
      {view === 'adopcion' && <Adopcion />}
      {view === 'citas' && <Citas />}
      {view === 'login' && <Login />}
      {view === 'registro' && <Registro />}
      {view === 'solicitud-adopcion' && <SolicitudAdopcion />}
      {view === 'nosotros' && <Nosotros />}
      {view === 'contacto' && <Contacto />}
      {view === 'mis-mascotas' && <MisMascotas />}
      {view === 'mis-citas' && <MisCitas />}
      {view === 'editar-perfil' && <EditarPerfil />}
      {view === 'admin-usuarios' && <AdminUsuarios />}
      {view === 'admin-citas' && <AdminCitas />}
      {view === 'admin-mascotas' && <AdminMascotas />}
      {view === 'vet-disponibilidad' && <VetDisponibilidad />}
      {view === 'vet-solicitudes' && <VetSolicitudes />}
    </div>
  )
}

export default App
