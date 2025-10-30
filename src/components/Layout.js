import React from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { Home, Calendar, User, Trophy } from 'lucide-react' // cambiamos Settings por Trophy

export default function LayoutMovil() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Contenido de la página */}
      <div className="flex-1 pb-16">
        <Outlet />
      </div>

      {/* Tab bar */}
      <nav className="fixed bottom-0 w-full bg-white shadow-inner p-2 flex justify-around border-t">
        <button
          className={`flex flex-col items-center text-gray-500 rounded-md p-1 border-transparent focus:border-transparent focus:ring-0 ${window.location.pathname === '/home' ? '!text-blue-600' : ''}`}
          onClick={() => navigate('/home')}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px]">Inicio</span>
        </button>
        <button
          className={`flex flex-col items-center text-gray-500 rounded-md p-1 border-transparent focus:border-transparent focus:ring-0 ${window.location.pathname === '/reservaciones' ? '!text-blue-600' : ''}`}
          onClick={() => navigate('/reservaciones')}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px]">Reservas</span>
        </button>
        <button
          className={`flex flex-col items-center text-gray-500 rounded-md p-1 border-transparent focus:border-transparent focus:ring-0 ${window.location.pathname === '/perfil' ? '!text-blue-600' : ''}`}
          onClick={() => navigate('/perfil', { replace: true })}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px]">Perfil</span>
        </button>
        <button
          className={`flex flex-col items-center text-gray-500 rounded-md p-1 border-transparent focus:border-transparent focus:ring-0 ${window.location.pathname === '/torneos' ? '!text-blue-600' : ''}`}
          onClick={() => navigate('/torneos')}
        >
          <Trophy className="h-5 w-5" />
          <span className="text-[10px]">Torneos</span>
        </button>
      </nav>
    </div>
  )
}
