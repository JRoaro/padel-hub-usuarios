import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, PlusCircle, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { getLocalUser } from '../../utils/utils'

const Card = ({ children, className, ...props }) => (
  <motion.div
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    className={`rounded-2xl bg-white/95 backdrop-blur-md ${className}`}
    {...props}
  >
    {children}
  </motion.div>
)

const Button = ({ children, className, ...props }) => (
  <motion.button
    whileTap={{ scale: 0.94 }}
    className={`px-4 py-2 rounded-2xl bg-blue-600 text-white font-medium shadow-md transition ${className}`}
    {...props}
  >
    {children}
  </motion.button>
)

export default function HomeUsuarioPadel() {
  const navigate = useNavigate()
  const [diasSemana, setDiasSemana] = useState([])
  const [user, setUser] = useState(null)

  const reservas = [
    { id: 1, cancha: 'Cancha 2', fecha: 'Sábado 19 Oct', hora: '6:00 PM', estado: 'Confirmada' },
  ]

  const recomendaciones = ['La Pista', 'Padel Nainari', 'Sunset Padel', 'DUO Padel']
  const torneos = [
    { nombre: 'Torneo Semanal', fecha: '25 Oct', inscritos: 12 },
    { nombre: 'Duelo de Amigos', fecha: '28 Oct', inscritos: 8 },
  ]

  const ultimosCompañeros = [
    { id: 1, nombre: 'Carlos', avatar: 'https://i.pravatar.cc/100?img=11', partidos: 3 },
    { id: 2, nombre: 'Ana', avatar: 'https://i.pravatar.cc/100?img=12', partidos: 2 },
    { id: 3, nombre: 'Luis', avatar: 'https://i.pravatar.cc/100?img=14', partidos: 5 },
    { id: 4, nombre: 'María', avatar: 'https://i.pravatar.cc/100?img=15', partidos: 1 },
  ]

  useEffect(() => {
    const hoy = dayjs()
    const dias = Array.from({ length: 7 }, (_, i) => hoy.add(i, 'day'))
    setDiasSemana(dias)

    // Obtener usuario
    setUser(getLocalUser())
  }, [])



  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-x-hidden">

      {/* Header */}
      <header className="backdrop-blur-lg bg-white/80 border-b border-gray-200 sticky top-0 z-50 p-4 flex items-center justify-start shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/70 shadow">
            <img src={user?.foto} alt="Perfil" className="w-full h-full object-cover"/>
          </div>
          <div className="flex flex-col leading-tight">
            <h2 className="text-lg font-semibold text-gray-900">
              Hola, <span className="font-bold">{user?.nombre}</span> 👋
            </h2>
            <p className="text-sm text-gray-500">{dayjs().format('dddd D [de] MMMM')}</p>
          </div>
        </div>
      </header>

      {/* Botón nueva reserva */}
      <div className="px-4 py-3">
        <Button className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/reservarCancha')}>
          <PlusCircle className="h-5 w-5" /> Nueva reserva
        </Button>
      </div>

      {/* Calendario horizontal */}
      <div className="p-4 overflow-x-auto flex gap-3">
        {diasSemana.map((dia, idx) => {
          const reservasDia = reservas.filter(r => dayjs(r.fecha, 'dddd D MMM').isSame(dia, 'day'))
          return (
            <div
              key={idx}
              className={`flex flex-col items-center px-3 py-2 rounded-2xl transition ${reservasDia.length ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} shadow-md`}
            >
              <span className="text-xs font-semibold">{dia.format('ddd')}</span>
              <span className="text-sm font-bold">{dia.format('D')}</span>
            </div>
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
                onClick={() => navigate(`/detalleReserva`)}
                className="flex items-center justify-between p-3 cursor-pointer"
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

      {/* Torneos */}
      <div className="py-4">
        <h3 className="text-gray-700 font-semibold mb-2 flex items-center gap-1 px-4">
          <Trophy className="w-4 h-4" /> Torneos y eventos
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 px-4">
          {torneos.map((t, idx) => (
            <Card key={t.nombre} className="flex-none w-48 rounded-2xl p-3 bg-white/95 backdrop-blur-md cursor-pointer">
              <h4 className="font-semibold text-gray-800 text-sm">{t.nombre}</h4>
              <p className="text-xs text-gray-500">{t.fecha}</p>
              <p className="text-xs text-gray-500">{t.inscritos} inscritos</p>
              <Button className="mt-2 w-full text-xs py-1" onClick={() => navigate(`/torneos/${encodeURIComponent(t.nombre)}`)}>Inscribirse</Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Jugaste recientemente con */}
      <div className="py-6 px-4">
        <h3 className="text-gray-900 font-semibold mb-4 text-lg">🎾 Jugaste recientemente con</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 px-2 snap-x snap-mandatory">
          {ultimosCompañeros.map((c, idx) => (
            <motion.div 
              key={c.id} 
              className="flex-none snap-center flex flex-col items-center cursor-pointer"
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: idx * 0.05 }}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                <img 
                  src={c.avatar} 
                  alt={c.nombre} 
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                />
              </div>
              <p className="text-center text-sm font-medium text-gray-900 mt-2">{c.nombre}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Canchas cerca de ti - estilo compacto cuadrado */}
      <div className="py-4 px-4">
        <h3 className="text-gray-900 font-semibold mb-3 text-lg">🏟️ Canchas cerca de ti</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 px-2 snap-x snap-mandatory">
          {recomendaciones.map((club, idx) => (
            <motion.div
              key={club}
              className="flex-none snap-center w-36 rounded-2xl bg-white/95 backdrop-blur-md cursor-pointer p-2 shadow-md flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-full h-24 bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src={`https://picsum.photos/200?random=${idx}`}
                  alt={club}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <h4 className="text-sm font-semibold text-gray-900">{club}</h4>
                <p className="text-xs text-gray-500">A 2 km de ti</p>
              </div>
              <Button className="mt-2 w-full text-xs py-1">Reservar</Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
