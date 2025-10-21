import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './components/Login'
import Home from './pages/Home'
import Reservaciones from './pages/Reservaciones'
import LayoutMovil from './components/Layout'
import PerfilUsuario from './pages/Perfil'
import Configuracion from './pages/Configuracion'
import Registrar from './components/RegistrarUsuario'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router>
        <Routes>
          {/* Login fuera del layout */}
          <Route path="/" element={<Login />} />

          {/* Vistas con layout móvil */}
          <Route element={<LayoutMovil />}>
            <Route path="/home" element={<Home />} />
            <Route path="/reservaciones" element={<Reservaciones />} />
            <Route path="/perfil" element={<PerfilUsuario />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Route>
          
          <Route path="/registrar" element={<Registrar />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
