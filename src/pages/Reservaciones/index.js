import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock } from 'lucide-react'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'

const BadgeEstado = ({ estado }) => {
  const colors = {
    Confirmada: 'bg-green-100 text-green-700 hover:bg-green-200',
    Reservada: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    Cancelada: 'bg-red-100 text-red-700 hover:bg-red-200',
    EnCurso: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    Terminada: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  }

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[estado] || 'bg-gray-100 text-gray-700'}`}
    >
      {estado}
    </motion.span>
  )
}

const ItemReserva = ({ reserva, onClick }) => (
  <motion.div
    onClick={onClick}
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.03, boxShadow: '0 15px 25px rgba(0,0,0,0.15)' }}
    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    className="flex justify-between items-center p-4 bg-white/70 backdrop-blur-xl rounded-2xl mb-3 cursor-pointer border border-white/20 hover:border-blue-300"
  >
    <div className="flex flex-col gap-1">
      <motion.span whileHover={{ scale: 1.05 }} className="font-semibold text-gray-800">{reserva.club}</motion.span>
      <motion.span whileHover={{ scale: 1.03 }} className="text-gray-500 text-sm">{reserva.cancha}</motion.span>
      <div className="flex items-center gap-3 text-gray-500 text-xs mt-1">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {dayjs(reserva.fecha).format('DD MMM')}
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {reserva.hora}
        </motion.div>
      </div>
    </div>
    <BadgeEstado estado={reserva.estado} />
  </motion.div>
)

export default function ReservasMovil() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('Todos')

  const reservas = [
    { id: 1, club: 'La Pista', cancha: 'Cancha 2', fecha: '2025-10-18', hora: '18:00', estado: 'Confirmada' },
    { id: 2, club: 'Padel Nainari', cancha: 'Cancha 1', fecha: '2025-10-19', hora: '20:00', estado: 'Reservada' },
    { id: 3, club: 'Duo Padel Park', cancha: 'Cancha 3', fecha: '2025-10-17', hora: '19:00', estado: 'Terminada' },
    { id: 4, club: 'Sunset Padel', cancha: 'Cancha 1', fecha: '2025-10-18', hora: '09:00', estado: 'Cancelada' },
    { id: 5, club: 'La Pista', cancha: 'Cancha 1', fecha: '2025-10-16', hora: '17:00', estado: 'Terminada' },
    { id: 6, club: 'Padel Nainari', cancha: 'Cancha 2', fecha: '2025-10-20', hora: '18:00', estado: 'Reservada' },
  ]

  const filtradas = reservas
    .filter(r => filtro === 'Todos' || r.estado === filtro)
    .sort((a, b) => dayjs(b.fecha + ' ' + b.hora).diff(dayjs(a.fecha + ' ' + a.hora)))
    .slice(0, 5)

  return (
    <div className="flex flex-col min-h-screen bg-white py-4">

      {/* Header con filtros */}
      <header className="flex flex-col gap-1 mb-4">
        <h2 className="text-xl font-bold text-gray-900 px-4">Tus Reservas</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 px-4 py-2">
          {['Todos', 'Reservada', 'EnCurso', 'Terminada', 'Cancelada'].map(opcion => (
            <motion.button
              key={opcion}
              whileHover={{ scale: 1.05 }}
              animate={{ boxShadow: filtro === opcion ? '0 0 8px rgba(59, 130, 246, 0.5)' : '0 0 0 rgba(0,0,0,0)' }}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                filtro === opcion
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setFiltro(opcion)}
              style={{ transition: 'box-shadow 0.3s ease' }}
            >
              {opcion}
            </motion.button>
          ))}
        </div>
      </header>

      {/* Lista de reservas */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="flex-1 overflow-y-auto px-4 py-2"
      >
        {filtradas.map(r => (
          <ItemReserva
            key={r.id}
            reserva={r}
            onClick={() => navigate(`/reservas/${r.id}`)}
          />
        ))}
      </motion.div>
    </div>
  )
}
