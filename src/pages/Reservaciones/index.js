import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Trash2, Repeat } from 'lucide-react'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation } from '@tanstack/react-query'
import ReservacionesRepository from '../../network/ReservacionesRepository'
import Loading from '../../components/Loading'
import BadgeEstadoReservacion from '../../components/BadgeEstadoReservacion'
import toast from 'react-hot-toast'
import { getLocalUser } from '../../utils/utils'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)

const ItemReserva = ({ reserva, onClick, onCancel = null, onRepeat }) => (
  <motion.div
    onClick={onClick}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    className="relative flex justify-between items-start p-3 bg-white/70 backdrop-blur-xl rounded-3xl mb-3 cursor-pointer border border-white/20 hover:border-blue-300"
  >
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-start gap-1 justify-between w-full">
        <div>
          <span className="font-semibold text-gray-800 text-lg">{reserva.club.nombre}</span><br/>
          <span className="text-gray-500 text-sm">{reserva.cancha.nombre}</span>
        </div>
        <div className="flex gap-2 items-center">
          <BadgeEstadoReservacion estado={reserva.estado} />
          {onCancel != null ? (
            <button
              onClick={(e) => { e.stopPropagation(); onCancel(reserva.hash) }}
              className="p-2 rounded-full bg-red-50 hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-3 text-gray-500 text-xs mt-1 justify-between w-full">
        <div className="flex gap-1 mt-1">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {dayjs.tz(reserva.fecha_reserva).format('DD MMM')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {reserva.hora_inicio_reserva} - {reserva.hora_fin_reserva}
          </div>
        </div>
        <span className="ml-2 text-gray-700 text-sm font-bold">{reserva.precio_total}</span>
      </div>
    </div>
    
  </motion.div>
)

export default function ReservasMovil() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('Todos')
  const [user, setUser] = useState(getLocalUser())
  
  const { data: reservaciones, isFetching, refetch: refetchReservaciones } = useQuery({
    queryKey: ['reservas'],
    queryFn: () => ReservacionesRepository.getReservaciones(),
  })

  const cancelarReservacionMutation = useMutation({
    mutationFn: async (hash) => {
      return ReservacionesRepository.cancelarReservacion(hash)
    },
    onSuccess: (data) => {
      if (data && data.success) {
        toast.success("Reservación cancelada")
        refetchReservaciones()
        return
      }
      toast.error(data.message || "Ocurrió un error al cancelar la reservación");
    },
    onError: () => toast.error("Ocurrió un error al cancelar la reservación"),
  })
  
  const filterReservaciones = () => {
    if (!reservaciones || !reservaciones.reservaciones) return []
    return reservaciones.reservaciones
      .filter(r => filtro === 'Todos' || r.estado === filtro)
      .sort((a, b) => dayjs(b.fecha + ' ' + b.hora).diff(dayjs(a.fecha + ' ' + a.hora)))
  }

  const filtradas = filterReservaciones()
  const filtros = ['Todos', 'Reservado', 'En curso', 'Finalizado', 'Cancelado']

  const handleCancel = (hash) => {
    cancelarReservacionMutation.mutate(hash)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 py-4">
      <header className="flex flex-col gap-2 mb-4 px-4">
        <h2 className="text-2xl font-bold text-gray-900">Tus reservas</h2>
        <div className="flex gap-2 bg-white/50 backdrop-blur-md rounded-full p-1 shadow-inner overflow-x-auto">
          {filtros.map(opcion => (
            <motion.button
              key={opcion}
              onClick={() => setFiltro(opcion)}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                filtro === opcion
                  ? 'bg-blue-600 text-white shadow-md'
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
          {filtradas.length > 0 ? filtradas.map(r => (
            <ItemReserva
              key={r.id}
              reserva={r}
              onClick={() => navigate(`/detalleReserva`, { state: r })}
              onCancel={
                ( (r.estado !== 'Cancelado' && r.estado !== 'Finalizado') && r.usuarios.find(u => u.id == user?.id && u.owner) ) ? handleCancel : null
              }
            />
          )) : (
            <div className="flex flex-col items-center justify-center gap-2 text-gray-500 text-sm">
              <span>No hay reservaciones para mostrar</span>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {(isFetching || cancelarReservacionMutation.isPending) && <Loading />}
    </div>
  )
}
