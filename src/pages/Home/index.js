import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Clock, User, PlusCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'

const Card = ({ children, className, ...props }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -2, boxShadow: '0 15px 25px rgba(0,0,0,0.1)' }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className={`rounded-2xl shadow-md bg-white ${className}`}
    {...props}
  >
    {children}
  </motion.div>
)

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)

const Button = ({ children, className, ...props }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    className={`px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
    {...props}
  >
    {children}
  </motion.button>
)

export default function HomeUsuarioPadel() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  const reservas = [
    { id: 1, cancha: 'Cancha 2', fecha: 'Sábado 19 Oct', hora: '6:00 PM', estado: 'Confirmada' },
    { id: 2, cancha: 'Cancha 1', fecha: 'Martes 22 Oct', hora: '8:00 PM', estado: 'Pendiente' },
  ]

  const [diasSemana, setDiasSemana] = useState([])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const hoy = dayjs()
    const dias = Array.from({ length: 7 }, (_, i) => hoy.add(i, 'day'))
    setDiasSemana(dias)
  }, [])

  // Mini dashboard
  const totalReservas = reservas.length
  const confirmadas = reservas.filter(r => r.estado === 'Confirmada').length
  const pendientes = reservas.filter(r => r.estado === 'Pendiente').length

  const recomendaciones = ['La Pista', 'Padel Nainari', 'Sunset Padel', 'DUO Padel']

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-x-hidden pb-32">
      
      <header className="backdrop-blur-md bg-white/70 border-b border-gray-200 sticky top-0 z-50 p-4 flex items-center justify-start">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          {/* Imagen de perfil */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/70 shadow-sm"
          >
            <img
              src="https://i.pravatar.cc/100?img=13"
              alt="Perfil"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Texto de saludo */}
          <div className="flex flex-col leading-tight">
            <h2 className="text-lg font-semibold text-gray-900">
              Hola, <span className="font-bold">Juan</span> 👋
            </h2>
            <p className="text-sm text-gray-500">{dayjs().format('dddd D [de] MMMM')}</p>
          </div>
        </motion.div>
      </header>

      {/* Botón de nueva reserva fijo arriba */}
      <div className="px-4 py-2">
        <Button className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/reservarCancha')}>
          <PlusCircle className="h-5 w-5" /> Nueva reserva
        </Button>
      </div>

      {/* Mini dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 flex justify-between gap-3 overflow-x-auto"
      >
        <Card className="flex-1 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md pt-2">
          <p className="text-xs text-gray-400">Total reservas</p>
          <p className="text-xl font-bold text-gray-900">{totalReservas}</p>
        </Card>
        <Card className="flex-1 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md pt-2">
          <p className="text-xs text-green-500">Confirmadas</p>
          <p className="text-xl font-bold text-gray-900">{confirmadas}</p>
        </Card>
        <Card className="flex-1 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md pt-2">
          <p className="text-xs text-yellow-500">Pendientes</p>
          <p className="text-xl font-bold text-gray-900">{pendientes}</p>
        </Card>
      </motion.div>

      {/* Calendario horizontal */}
      <div className="p-4 overflow-x-auto flex gap-3">
        {diasSemana.map((dia, idx) => {
          const reservasDia = reservas.filter(r => dayjs(r.fecha, 'dddd D MMM').isSame(dia, 'day'))
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
              className={`flex flex-col items-center px-3 py-2 rounded-2xl ${reservasDia.length ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} shadow-md transition`}
            >
              <span className="text-xs">{dia.format('ddd')}</span>
              <span className="text-sm font-semibold">{dia.format('D')}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Próximas reservas */}
      <div className="p-4 space-y-2">
        <h3 className="text-gray-700 font-semibold flex items-center gap-1 mb-2">
          <CalendarDays className="h-4 w-4" /> Próximas reservas
        </h3>
        <AnimatePresence>
          {reservas.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300 }}
            >
              <Card
                onClick={() => navigate(`/reservas/${r.id}`)}
                className="flex items-center justify-between p-3 cursor-pointer bg-white/90 backdrop-blur-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 text-sm">{r.cancha}</span>
                  <span className="text-xs text-gray-500">{r.fecha} - {r.hora}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.estado === 'Confirmada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {r.estado}
                </span>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sección recomendaciones */}
      <div className="py-4">
        <h3 className="text-gray-700 font-semibold mb-2 flex items-center gap-1 px-4">
          🏟️ Canchas cerca de ti
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 p-1 -m-1 px-4">
          {recomendaciones.map((club, idx) => (
            <motion.div
              key={club}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
              className="flex-none w-48 rounded-2xl bg-white/90 backdrop-blur-sm p-3 shadow-md cursor-pointer"
              onClick={() => navigate(`/reservas/nueva?club=${encodeURIComponent(club)}`)}
            >
              <div className="flex flex-col justify-between h-full">
                <h4 className="font-semibold text-gray-800 text-sm">{club}</h4>
                <p className="text-xs text-gray-500">A 2 km de ti</p>
                <Button className="mt-2 w-full text-xs py-1">Reservar ahora</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
