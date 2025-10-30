import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle, Share2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BadgeEstadoReservacion from '../../components/BadgeEstadoReservacion';
import BackButton from '../../components/BackButton';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import ReservacionesRepository from '../../network/ReservacionesRepository';
import Loading from '../../components/Loading';
import { getLocalUser } from '../../utils/utils';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.locale('es')

const DetalleReserva = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation()
  const reservaLocation = location.state || {}
  const navigate = useNavigate();
  const [user, setUser] = useState(getLocalUser())

  const reservaId = reservaLocation?.id || searchParams.get('id')
  
  const { data: reservaData, isFetching, refetch } = useQuery({
    queryKey: ['reserva', reservaId],
    queryFn: () => ReservacionesRepository.getReservacion(reservaId),
  })

  const reserva = reservaData?.reservacion || reservaLocation || {}

  const maxJugadores = 4
  
  const isOwner = reserva?.usuarios?.some(u => u.id == user?.id && u.owner)
  const userHasReservacion = reserva?.usuarios?.some(u => u.id == user?.id)

  const unirseReservacionMutation = useMutation({
    mutationFn: async (id) => {
      return await ReservacionesRepository.unirseReservacion(id)
    },
    onSuccess: (data) => {
      if (!data || !data.success) {
        toast.error(data.message || "Ocurrió un error al unirte a la reservación");
        return
      }

      toast.success("¡Te has unido a la reservación!")
      refetch()
    },
    onError: () => toast.error("Ocurrió un error al unirte a la reservación"),
  })

  const handleUnirseReservacion = () => {
    unirseReservacionMutation.mutate(reserva.id)
  }

  const handleInvitar = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(`${url}?id=${reserva.id}`);
    toast.success("¡Invitación copiada al portapapeles!");
  };

  const isLoading = () => {
    return (!reserva.id && isFetching) || unirseReservacionMutation.isPending
  }


  return (
    <div className="min-h-screen bg-white flex flex-col p-6 text-gray-800">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}  className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight m-0">Tu Reserva</h2>
          <BadgeEstadoReservacion estado={reserva?.estado} />
        </motion.div>
      </div>

      {/* Detalles de reserva */}
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-3 mb-6 mt-6">
        <p className="">
          Club: &nbsp;<span className="font-semibold">{reserva?.club?.nombre}</span>
          <br/>
          {reserva?.club?.direccion}
        </p>
        <p className="flex items-center">
          <Calendar className="mr-2" /> {dayjs.tz(reserva.fecha_reserva).format('DD/MM/YYYY')}
        </p>
        <p className="flex items-center">
          <Clock className="mr-2" /> {reserva.hora_inicio_reserva} - {reserva.hora_fin_reserva}
        </p>
        <p className="flex items-center">
          <User className="mr-2" /> {reserva?.cancha?.nombre}
        </p>
      </motion.div>

      {/* Jugadores */}
      <h3 className="text-lg font-semibold mb-3 mt-4">Jugadores</h3>
      <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-3">
        {reserva?.usuarios?.map(jugador => (
          <motion.div
            key={jugador.id}
            whileHover={{ scale: jugador.nombre ? 1.02 : 1.05 }}
            className={`flex items-center justify-between p-3 rounded-xl bg-gray-50`}
          >
            {(
              <div className="flex items-center">
                <img src={jugador.foto} alt={jugador.nombre} className="w-12 h-12 rounded-full mr-4 border border-gray-200" />
                <div>
                  <span className="font-medium me-2">{jugador.nombre}</span>
                  {jugador.owner && (
                    <motion.span
                      className="mt-1 inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-green-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      Dueño
                    </motion.span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {isOwner && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl flex items-center justify-center font-semibold shadow-sm"
          onClick={() => handleInvitar()}
        >
          <Share2 className="mr-2" /> Compartir Reservación
        </motion.button>
      )}

      {!isOwner && !userHasReservacion && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl flex items-center justify-center font-semibold shadow-sm"
          onClick={() => handleUnirseReservacion()}
        >
          <Share2 className="mr-2" /> Unirme a la Reservación
        </motion.button>
      )}

      {isLoading() && <Loading />}
    </div>
  );
};

export default DetalleReserva;
