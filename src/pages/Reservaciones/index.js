import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Trash2, Repeat } from 'lucide-react'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'

const BadgeEstado = ({ estado }) => {
  const estados = {
    Confirmada: { color: 'bg-green-100 text-green-700', icon: '✅' },
    Reservada: { color: 'bg-blue-100 text-blue-700', icon: '⏳' },
    Cancelada: { color: 'bg-red-100 text-red-700', icon: '❌' },
    EnCurso: { color: 'bg-yellow-100 text-yellow-700', icon: '🏃‍♂️' },
    Terminada: { color: 'bg-gray-100 text-gray-700', icon: '✔️' },
  }

  const e = estados[estado] || estados.Terminada

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.15 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${e.color}`}
    >
      <span>{e.icon}</span>
      {estado}
    </motion.span>
  )
}

const ItemReserva = ({ reserva, onClick, onCancel, onRepeat }) => (
  <motion.div
    onClick={onClick}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    className="relative flex justify-between items-center p-4 bg-white/70 backdrop-blur-xl rounded-3xl mb-3 cursor-pointer border border-white/20 hover:border-blue-300"
  >
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-gray-800 text-lg">{reserva.club}</span>
      <span className="text-gray-500 text-sm">{reserva.cancha}</span>
      <div className="flex items-center gap-3 text-gray-500 text-xs mt-1">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {dayjs(reserva.fecha).format('DD MMM')}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {reserva.hora} - {reserva.horaFin}
        </div>
        <span className="ml-2 text-gray-700 font-medium">${reserva.total}</span>
      </div>
    </div>
    <div className="flex gap-2 items-center">
      <BadgeEstado estado={reserva.estado} />
      <button
        onClick={(e) => { e.stopPropagation(); onCancel(reserva.id) }}
        className="p-2 rounded-full bg-red-50 hover:bg-red-100"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRepeat(reserva.id) }}
        className="p-2 rounded-full bg-blue-50 hover:bg-blue-100"
      >
        <Repeat className="w-4 h-4 text-blue-600" />
      </button>
    </div>
  </motion.div>
)

export default function ReservasMovil() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('Todos')

  const reservas = [
    { id: 1, club: 'La Pista', cancha: 'Cancha 2', fecha: '2025-10-18', hora: '18:00', horaFin: '19:30', estado: 'Confirmada', total: 375 },
    { id: 2, club: 'Padel Nainari', cancha: 'Cancha 1', fecha: '2025-10-19', hora: '20:00', horaFin: '21:00', estado: 'Reservada', total: 250 },
    { id: 3, club: 'Duo Padel Park', cancha: 'Cancha 3', fecha: '2025-10-17', hora: '19:00', horaFin: '20:00', estado: 'Terminada', total: 250 },
    { id: 4, club: 'Sunset Padel', cancha: 'Cancha 1', fecha: '2025-10-18', hora: '09:00', horaFin: '10:00', estado: 'Cancelada', total: 250 },
    { id: 5, club: 'La Pista', cancha: 'Cancha 1', fecha: '2025-10-16', hora: '17:00', horaFin: '18:00', estado: 'Terminada', total: 250 },
    { id: 6, club: 'Padel Nainari', cancha: 'Cancha 2', fecha: '2025-10-20', hora: '18:00', horaFin: '19:00', estado: 'Reservada', total: 250 },
  ]

  const filtradas = reservas
    .filter(r => filtro === 'Todos' || r.estado === filtro)
    .sort((a, b) => dayjs(b.fecha + ' ' + b.hora).diff(dayjs(a.fecha + ' ' + a.hora)))

  const handleCancel = (id) => alert(`Cancelar reserva ${id}`)
  const handleRepeat = (id) => alert(`Repetir reserva ${id}`)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 py-4">
      <header className="flex flex-col gap-2 mb-4 px-4">
        <h2 className="text-2xl font-bold text-gray-900">Tus Reservas</h2>
        <div className="flex gap-2 bg-white/50 backdrop-blur-md rounded-full p-1 shadow-inner overflow-x-auto">
          {['Todos', 'Reservada', 'EnCurso', 'Terminada', 'Cancelada'].map(opcion => (
            <motion.button
              key={opcion}
              onClick={() => setFiltro(opcion)}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                filtro === opcion
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {opcion}
            </motion.button>
          ))}
        </div>
      </header>

      {/* Contenedor de lista */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="flex-1 overflow-y-auto px-4 py-2"
      >
        <AnimatePresence>
          {filtradas.map(r => (
            <ItemReserva
              key={r.id}
              reserva={r}
              onClick={() => navigate(`/reservas/${r.id}`)}
              onCancel={handleCancel}
              onRepeat={handleRepeat}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
