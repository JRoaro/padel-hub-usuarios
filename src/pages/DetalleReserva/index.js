import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Plus, CloudSun } from 'lucide-react';
import { motion } from 'framer-motion';
import BadgeEstadoReservacion from '../../components/BadgeEstadoReservacion';
import BackButton from '../../components/BackButton';
import { useQuery, useMutation } from '@tanstack/react-query';
import ReservacionesRepository from '../../network/ReservacionesRepository';
import Loading from '../../components/Loading';
import { getLocalUser } from '../../utils/utils';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const Progress = ({ value }) => (
  <div className="w-[85%] mt-6">
    <p className="text-sm text-gray-600 mb-2">Progreso de ocupación</p>
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6 }}
        className="h-3 bg-[#007aff] rounded-full"
      />
    </div>
    <p className="text-xs text-gray-500 mt-1">{value}% ocupado</p>
  </div>
);

const ClimaActual = ({ ciudad }) => {
  const [clima, setClima] = useState(null);
  useEffect(() => {
    if (!ciudad) return;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=27.48&longitude=-109.93&current_weather=true`)
      .then(res => res.json())
      .then(data => setClima(data.current_weather))
      .catch(() => {});
  }, [ciudad]);

  if (!clima) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="flex items-center gap-2 mt-4 text-gray-700">
      <CloudSun className="w-5 h-5 text-yellow-500" />
      <span className="text-sm font-medium">{clima.temperature}°C en {ciudad}</span>
    </motion.div>
  );
};

const AvatarStack = ({ usuarios = [], max = 4, ownerId }) => {
  const placeholders = Array.from({ length: Math.max(0, max - usuarios.length) });
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center mt-4">
      <div className="flex -space-x-3 items-center">
        {usuarios.slice(0, max).map((u, index) => {
          const isOwner = u.owner || u.id === ownerId;
          return (
            <motion.div key={u.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }} className="relative">
              <img
                src={u.foto || `/api/avatar/${u.id}`}
                alt={u.nombre}
                onError={(e) => (e.target.src = '/images/default-avatar.png')}
                className={`w-14 h-14 rounded-full object-cover shadow-sm ${
                  isOwner ? 'ring-4 ring-yellow-400 animate-pulse' : 'ring-2 ring-white'
                }`}
              />
              {isOwner && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-yellow-400 text-lg">👑</span>
              )}
            </motion.div>
          );
        })}

        {placeholders.map((_, i) => (
          <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }} className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm shadow-sm">
            <Plus className="w-4 h-4" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ActionBar = ({ isOwner, userHasReservacion, handleInvite, handleJoin, handleCompartirWhatsApp, openMaps }) => (
  <div className="w-full mt-6 pb-6 flex flex-col items-center bg-transparent">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="w-[90%] flex flex-col gap-3 sm:flex-row sm:gap-4">
      {isOwner ? (
        <motion.button onClick={handleInvite} whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-full bg-[#007aff] text-white text-sm font-medium shadow-sm hover:shadow-md transition">
          Invitar jugadores
        </motion.button>
      ) : !userHasReservacion ? (
        <motion.button onClick={handleJoin} whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-full bg-[#007aff] text-white text-sm font-medium shadow-sm hover:shadow-md transition">
          Unirme a la reservación
        </motion.button>
      ) : (
        <div className="flex-1 py-3 rounded-full bg-gray-100 text-gray-600 text-sm font-medium flex items-center justify-center">
          Ya estás en la reservación
        </div>
      )}

      <motion.button onClick={handleCompartirWhatsApp} whileTap={{ scale: 0.97 }}
        className="flex-1 py-3 rounded-full bg-green-500 text-white text-sm font-medium shadow-sm hover:shadow-md transition">
        Compartir por WhatsApp
      </motion.button>

      <motion.button onClick={openMaps} whileTap={{ scale: 0.97 }}
        className="flex-1 py-3 rounded-full bg-gray-800 text-white text-sm font-medium shadow-sm hover:shadow-md transition">
        Ver en mapas
      </motion.button>
    </motion.div>
  </div>
);

const DetalleReserva = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const reservaLocation = location.state || {};
  const navigate = useNavigate();
  const [user] = useState(getLocalUser());
  const reservaId = reservaLocation?.id || searchParams.get('id');

  const { data: reservaData, isFetching, refetch } = useQuery({
    queryKey: ['reserva', reservaId],
    queryFn: () => ReservacionesRepository.getReservacion(reservaId),
    enabled: !!reservaId,
  });

  const reserva = reservaData?.reservacion || reservaLocation || {};
  const maxJugadores = reserva?.max_jugadores || 4;

  const isOwner = reserva?.usuarios?.some(u => u.id == user?.id && u.owner);
  const userHasReservacion = reserva?.usuarios?.some(u => u.id == user?.id);

  const porcentajeOcupacion = Math.round(((reserva.usuarios?.length || 0) / maxJugadores) * 100);

  const handleCompartirWhatsApp = () => {
    const texto = `Voy a jugar en ${reserva.club?.nombre} el ${dayjs(reserva.fecha_reserva).format('DD/MM/YYYY')} a las ${reserva.hora_inicio_reserva}. ¿Te unes? 😎`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const openMaps = () => {
    const q = encodeURIComponent(reserva.club?.direccion || reserva.club?.nombre || '');
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
  };

  if (isFetching) return <Loading />;

  return (
    <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }} className="w-full min-h-screen flex flex-col justify-between bg-white text-gray-900">
      
      <div className="w-full flex justify-between items-center px-6 pt-6">
        <BackButton />
        <BadgeEstadoReservacion estado={reserva.estado} />
      </div>

      <div className="flex-1 overflow-y-auto px-8 mt-4 text-center">
        <motion.img src={reserva.club?.imagen || '/images/club-placeholder.png'} onError={(e) => (e.target.style.display = 'none')}
          alt="Club" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="w-full h-48 rounded-2xl object-cover mb-6 shadow-sm" />

        <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-gray-900">{reserva.club?.nombre || 'Club desconocido'}</h1>
        <p className="text-sm text-gray-500 mt-1">{reserva.club?.direccion || 'Dirección no disponible'}</p>

        <ClimaActual ciudad={reserva.club?.nombre || 'Ciudad Obregón'} />

        <div className="w-full flex justify-center items-center gap-10 mt-6">
          <div className="flex flex-col items-center">
            <Calendar className="text-[#007aff] mb-1" />
            <p className="text-xs text-gray-500">Fecha</p>
            <p className="font-medium">{reserva.fecha_reserva && dayjs(reserva.fecha_reserva).isValid() ? dayjs(reserva.fecha_reserva).format('DD/MM/YYYY') : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="text-[#007aff] mb-1" />
            <p className="text-xs text-gray-500">Hora</p>
            <p className="font-medium">{reserva.hora_inicio_reserva || '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <MapPin className="text-[#007aff] mb-1" />
            <p className="text-xs text-gray-500">Cancha</p>
            <p className="font-medium">{reserva.cancha?.nombre || '-'}</p>
          </div>
        </div>

        <AvatarStack usuarios={reserva.usuarios || []} max={maxJugadores} ownerId={reserva?.usuarios?.find(u => u.owner)?.id} />
        <Progress value={porcentajeOcupacion} />

        <ActionBar isOwner={isOwner} userHasReservacion={userHasReservacion} handleInvite={() => toast('Invitar')} handleJoin={() => toast('Unirse')} handleCompartirWhatsApp={handleCompartirWhatsApp} openMaps={openMaps} />
      </div>
    </motion.div>
  );
};

export default DetalleReserva;
