import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import Inicio from './pages/inicio.jsx'
import Adopcion from './pages/Adopcion.jsx'
import Citas from './pages/Citas.jsx'
import SolicitudAdopcion from './pages/SolicitudAdopcion.jsx'

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
    </div>
  )
}

export default App
