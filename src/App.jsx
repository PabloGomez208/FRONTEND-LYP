import { useState } from 'react'
import './App.css'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'

function App() {
  const [view, setView] = useState('login')

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
        <button onClick={() => setView('login')}>Login</button>
        <button onClick={() => setView('registro')}>Registro</button>
      </div>
      {view === 'login' ? <Login /> : <Registro />}
    </div>
  )
}

export default App
