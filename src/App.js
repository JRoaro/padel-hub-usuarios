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
import ReservarCancha from './pages/ReservarCancha'
import DetalleReserva from './pages/DetalleReserva'
import Torneos from './pages/Torneos'
import DetalleTorneo from './pages/DetalleTorneo'

//Rutas privadas 
import PrivateRoutes from './utils/utils'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router>
        <Routes>
          {/* Login fuera del layout */}
          <Route path="/" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />

          {/* Vistas que requieren autenticación */}
          <Route element={<PrivateRoutes />}>
            {/* Vistas con layout móvil y privadas */}
            <Route element={<LayoutMovil />}>
              <Route path="/home" element={<Home />} />
              <Route path="/reservaciones" element={<Reservaciones />} />
              <Route path="/perfil" element={<PerfilUsuario />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="/reservarCancha" element={<ReservarCancha />} />
              <Route path="/detalleReserva" element={<DetalleReserva />} />
              <Route path="/torneos" element={<Torneos />} />
              <Route path="/detalleTorneo" element={<DetalleTorneo />} />
            </Route>
          </Route>
          
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
