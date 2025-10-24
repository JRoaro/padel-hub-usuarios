import React from 'react'
import { motion } from 'framer-motion'

const BadgeEstadoReservacion = ({ estado }) => {
  const estados = {
    Confirmada: { color: 'bg-green-100 text-green-700', icon: '✅' },
    Reservado: { color: 'bg-blue-100 text-blue-700', icon: '⏳' },
    Cancelado: { color: 'bg-red-100 text-red-700', icon: '❌' },
    "En curso": { color: 'bg-yellow-100 text-yellow-700', icon: '🏃‍♂️' },
    Finalizado: { color: 'bg-gray-100 text-gray-700', icon: '✔️' },
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

export default BadgeEstadoReservacion