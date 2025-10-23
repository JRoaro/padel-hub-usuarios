import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, Share2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const DetalleReserva = () => {
  const [showToast, setShowToast] = useState(false);

  const reserva = {
    fecha: '2025-10-23',
    hora: '18:00',
    cancha: { nombre: 'Cancha Central', tipo: 'Indoor', color: '#10B981' },
    estado: 'Confirmada',
    jugadores: [
      { id: 1, nombre: 'Juan Roaro', avatar: 'https://i.pravatar.cc/150?img=1', estado: 'Confirmado' },
      { id: 2, nombre: 'Luis Pérez', avatar: 'https://i.pravatar.cc/150?img=2', estado: 'Confirmado' },
      { id: 3, nombre: 'Ana Gómez', avatar: 'https://i.pravatar.cc/150?img=3', estado: 'Confirmado' },
      { id: 4, nombre: '', avatar: '', estado: '' }, // espacio vacío
    ],
  };

  const handleInvitar = () => {
    navigator.clipboard.writeText('https://padel-hub.com/invitacion/12345');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 text-gray-800">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tu Reserva</h2>
        <div className="flex items-center space-x-1 font-semibold text-green-500">
          <CheckCircle />
          <span>{reserva.estado}</span>
        </div>
      </motion.div>

      {/* Detalles de reserva */}
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-3 mb-6">
        <p className="flex items-center">
          <Calendar className="mr-2" /> {dayjs(reserva.fecha).format('DD/MM/YYYY')}
        </p>
        <p className="flex items-center">
          <Clock className="mr-2" /> {reserva.hora}
        </p>
        <p className="flex items-center">
          <User className="mr-2" /> {reserva.cancha.nombre} ({reserva.cancha.tipo})
        </p>
      </motion.div>

      {/* Jugadores */}
      <h3 className="text-lg font-semibold mb-3">Jugadores</h3>
      <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-3">
        {reserva.jugadores.map(jugador => (
          <motion.div
            key={jugador.id}
            whileHover={{ scale: jugador.nombre ? 1.02 : 1.05 }}
            className={`flex items-center justify-between p-3 rounded-xl ${
              jugador.nombre ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200 border-dashed'
            }`}
            onClick={() => { if (!jugador.nombre) handleInvitar(); }}
          >
            {jugador.nombre ? (
              <div className="flex items-center">
                <img src={jugador.avatar} alt={jugador.nombre} className="w-12 h-12 rounded-full mr-4 border border-gray-200" />
                <div>
                  <span className="font-medium">{jugador.nombre}</span>
                  <motion.span
                    className="mt-1 inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-green-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {jugador.estado}
                  </motion.span>
                </div>
              </div>
            ) : (
              <motion.div
                className="flex items-center justify-center w-full text-blue-700 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="mr-2" /> Invitar jugador
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Botón compartir */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl flex items-center justify-center font-semibold shadow-sm"
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
