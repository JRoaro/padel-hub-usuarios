import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, PlusCircle, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { getLocalUser } from '../../utils/utils'
import ReservacionesRepository from '../../network/ReservacionesRepository'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../components/Loading'
import BadgeEstadoReservacion from '../../components/BadgeEstadoReservacion'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.locale('es')

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

  const torneos = [
    { nombre: 'Torneo Semanal', fecha: '25 Oct', inscritos: 12 },
    { nombre: 'Duelo de Amigos', fecha: '28 Oct', inscritos: 8 },
  ]

  useEffect(() => {
    const hoy = dayjs()
    const dias = Array.from({ length: 7 }, (_, i) => hoy.add(i, 'day'))
    setDiasSemana(dias)

    // Obtener usuario
    setUser(getLocalUser())
  }, [])

  const { data: homeData, isFetching } = useQuery({
    queryKey: ['home'],
    queryFn: () => ReservacionesRepository.getHomeData(),
  })

  const reservas = homeData?.reservaciones ?? []
  const clubs = homeData?.clubs ?? []
  const jugadoresRecientes = homeData?.jugadores_recientes ?? []

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-x-hidden">

      {/* Header */}
      <header className="backdrop-blur-lg bg-white/80 border-b border-gray-200 sticky top-0 z-50 p-4 flex items-center justify-start">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/70">
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
          {reservas.length > 0 ? reservas.map((reservacion, idx) => (
            <motion.div
              key={`reservacion-${reservacion.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300 }}
            >
              <Card
                onClick={() => navigate(`/detalleReserva`, { state: reservacion })}
                className="flex items-center justify-between p-3 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 text-sm">{reservacion.club.nombre} - {reservacion.cancha.nombre}</span>
                  <span className="text-xs text-gray-500">{dayjs.tz(reservacion.fecha_reserva).format('DD MMM')} - {reservacion.hora_inicio_reserva}</span>
                </div>
                <BadgeEstadoReservacion estado={reservacion.estado} />
              </Card>
            </motion.div>
          )) :
            <div className="flex flex-col items-center justify-center gap-2 text-gray-500 text-sm">
              <span>No hay reservaciones disponibles</span>
              <span>¡Reserva tu primera!</span>
            </div>
          }
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
          {jugadoresRecientes.length === 0 && <p className="text-gray-500 text-sm">No has jugado con nadie recientemente</p>}
          {jugadoresRecientes.map((jugador, idx) => (
            <motion.div 
              key={`jugador-${jugador.id}`}
              className="flex-none snap-center flex flex-col items-center cursor-pointer"
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: idx * 0.05 }}
              onClick={() => navigate("/perfil?id=" + jugador.id)}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                <img 
                  src={jugador.foto} 
                  alt={jugador.nombre} 
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                />
              </div>
              <p className="text-center text-sm font-medium text-gray-900 mt-2">{jugador.nombre}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Canchas cerca de ti - estilo compacto cuadrado */}
      <div className="py-4 px-4">
        <h3 className="text-gray-900 font-semibold mb-3 text-lg">🏟️ Canchas cerca de ti</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 px-2 snap-x snap-mandatory">
          {clubs.map((club, idx) => (
            <motion.div
              key={`club-${club.id}`}
              className="flex-none snap-center w-36 rounded-2xl bg-white/95 backdrop-blur-md cursor-pointer p-2 shadow-md flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-full h-24 bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src={club.imagen}
                  alt={club.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <h4 className="text-sm font-semibold text-gray-900">{club.nombre}</h4>
                <p className="text-xs text-gray-500">A 2 km de ti</p>
              </div>
              <Button className="mt-2 w-full text-xs py-1">Reservar</Button>
            </motion.div>
          ))}
        </div>
      </div>

      {isFetching && <Loading />}
    </div>
  )
}
