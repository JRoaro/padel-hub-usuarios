import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle, Share2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BadgeEstadoReservacion from '../../components/BadgeEstadoReservacion';
import BackButton from '../../components/BackButton';
import dayjs from 'dayjs';


const DetalleReserva = () => {
  const location = useLocation()
  const reserva = location.state || {}
  const navigate = useNavigate();
  

  const [showToast, setShowToast] = useState(false);

  const maxJugadores = 4

  const handleInvitar = () => {
    navigator.clipboard.writeText('https://padel-hub.com/invitacion/12345');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 text-gray-800">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}  className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight m-0">Tu Reserva</h2>
          <BadgeEstadoReservacion estado={reserva.estado} />
        </motion.div>
      </div>

      {/* Detalles de reserva */}
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-3 mb-6 mt-6">
        <p className="flex items-center">
          <Calendar className="mr-2" /> {dayjs(reserva.fecha_reserva).format('DD/MM/YYYY')}
        </p>
        <p className="flex items-center">
          <Clock className="mr-2" /> {reserva.hora_inicio_reserva} - {reserva.hora_fin_reserva}
        </p>
        <p className="flex items-center">
          <User className="mr-2" /> {reserva.cancha.nombre}
        </p>
      </motion.div>

      {/* Jugadores */}
      <h3 className="text-lg font-semibold mb-3 mt-4">Jugadores</h3>
      <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-3">
        {reserva.usuarios.map(jugador => (
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
        {reserva.usuarios.length < maxJugadores && (
          <motion.div
            className="flex items-center justify-center w-full text-blue-700 font-semibold cursor-pointer mt-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { handleInvitar(); }}
          >
            <Plus className="mr-2" /> Invitar jugador
          </motion.div>
        )}
      </motion.div>

      {/* Botón compartir */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl flex items-center justify-center font-semibold shadow-sm"
      >
        <Share2 className="mr-2" /> Compartir Reserva
      </motion.button>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -900, opacity: 0 }}
            animate={{ y: -800, opacity: 1 }}
            exit={{ y: -900, opacity: 0 }}
            className="fixed bottom-10 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg"
          >
            Link de invitación copiado al portapapeles!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DetalleReserva;
