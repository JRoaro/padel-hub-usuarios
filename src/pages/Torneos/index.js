import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Trophy, X, Plus, Users, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TorneosRepository from '../../network/TorneosRepository';
import { getLocalUser } from '../../utils/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.locale('es');

export default function Torneos() {
  const [busqueda, setBusqueda] = useState('');
  const [modalTorneo, setModalTorneo] = useState(null);
  const [user] = useState(getLocalUser());
  const navigate = useNavigate();

  // Header dinámico 
  const [headerSmall, setHeaderSmall] = useState(false);
  useEffect(() => {
    const onScroll = () => setHeaderSmall(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { data: torneosData } = useQuery({
    queryKey: ['torneos'],
    queryFn: () => TorneosRepository.getTorneos(),
  });

  const torneos = torneosData?.torneos ?? [];
  const torneosDestacados = torneosData?.torneos_destacados ?? [];
  const misTorneos = torneosData?.mis_torneos ?? [];

  const torneosFiltrados = torneos.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const isInscrito = (torneo) =>
    torneo?.equipos_inscritos?.some(e => e.usuarios.some(u => u.id == user?.id));

  const cardFade = {
    hidden: { opacity: 0, y: 8 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04 }
    })
  };

  return (
    <div className="min-h-screen bg-neutral-100 relative pb-10">
      
      {/* HEADER */}
      <motion.div
        className="sticky top-0 z-30 backdrop-blur-xl bg-white/10 border-b border-white/20 px-4 py-4"
        animate={{
          paddingTop: headerSmall ? 8 : 22,
          paddingBottom: headerSmall ? 8 : 20
        }}
      >
        <motion.h1
          className="font-semibold text-gray-900"
          animate={{ fontSize: headerSmall ? "20px" : "30px" }}
        >
          Torneos
        </motion.h1>

        <motion.div
          className="flex items-center mt-4 bg-white/25 backdrop-blur-xl border border-white/30 shadow-sm rounded-2xl px-3 py-2"
          whileTap={{ scale: 0.98 }}
        >
          <Search className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 bg-transparent ml-2 outline-none text-gray-700 placeholder-gray-500"
          />
        </motion.div>
      </motion.div>

      <div className="p-4">

        {/* MIS TORNEOS */}
        {misTorneos.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gray-700 font-semibold flex items-center gap-2 mb-3 text-base">
              <Trophy className="h-5 w-5 text-yellow-500" /> Mis torneos
            </h3>

            <div className="flex flex-col gap-3">
              {misTorneos.map((t, i) => (
                <motion.div
                  key={t.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardFade}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 bg-white/20 backdrop-blur-xl border border-white/30 p-4 rounded-3xl shadow-sm"
                  onClick={() => navigate('/detalleTorneo', { state: t })}
                >
                  <img
                    src={t.imagen}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-gray-900 truncate">{t.nombre}</span>
                    <span className="text-gray-500 text-sm truncate">{t.club.nombre}</span>
                    <span className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {dayjs.tz(t.fecha_inicio).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" /> Inscrito
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* DESTACADOS */}
        <div className="mb-6">
          <h3 className="text-gray-700 font-semibold mb-3 text-base">Destacados</h3>

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {torneosDestacados.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setModalTorneo(t)}
                className="snap-start w-52 h-40 rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-sm relative"
              >
                <img src={t.imagen} className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-white text-sm font-semibold truncate">{t.nombre}</span>
                  <span className="text-white/70 text-xs truncate">{t.club.nombre}</span>
                </div>

                <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-full ${
                  t.estado === "Próximo"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {t.estado}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* TODOS LOS TORNEOS */}
        <div>
          <h3 className="text-gray-700 font-semibold mb-3 text-base">Todos los torneos</h3>

          <div className="bg-white/20 backdrop-blur-xl border border-white/30 divide-y divide-white/10 rounded-2xl shadow-sm overflow-hidden">
            {torneosFiltrados.map((t, i) => (
              <motion.div
                key={t.id}
                initial="hidden"
                animate="visible"
                variants={cardFade}
                whileTap={{ scale: 0.97 }}
                className="flex justify-between items-center px-4 py-3"
                onClick={() => setModalTorneo(t)}
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-gray-900 truncate">{t.nombre}</span>
                  <span className="text-gray-500 text-xs truncate">
                    {t.club.nombre} • {dayjs.tz(t.fecha_inicio).format("DD/MM/YYYY")}
                  </span>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    isInscrito(t)
                      ? "bg-green-100 text-green-700"
                      : t.estado === "Próximo"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {isInscrito(t) ? "Inscrito" : t.estado}
                  </span>

                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {t.equipos_inscritos.length}/{t.limite_equipos}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* TU MISMO MODAL */}
      <AnimatePresence>
        {modalTorneo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50"
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-md shadow-md relative overflow-hidden"
            >
              <button
                className="absolute top-4 right-4 text-gray-400"
                onClick={() => setModalTorneo(null)}
              >
                <X className="h-5 w-5" />
              </button>

              <img
                src={modalTorneo.imagen}
                alt={modalTorneo.club.nombre}
                className="w-full h-36 object-cover rounded-2xl mb-4"
              />

              <h2 className="text-xl font-bold text-gray-900 mb-1">{modalTorneo.nombre}</h2>

              <div className="flex items-center text-gray-500 text-sm space-x-2 mb-3">
                <Calendar className="h-4 w-4" />
                <span>{dayjs.tz(modalTorneo.fecha_inicio).format('DD/MM/YYYY')}</span>

                <MapPin className="h-4 w-4 ml-4" />
                <span>{modalTorneo.club.direccion}</span>
              </div>

              <div className="mb-4 max-h-32 overflow-y-auto">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Participantes ({modalTorneo.equipos_inscritos.length}/{modalTorneo.limite_equipos})
                </h3>

                <div className="flex -space-x-3 items-center">
                  {modalTorneo.equipos_inscritos.map((equipo, i) => (
                    <motion.img
                      key={i}
                      src={equipo.usuarios[0]?.foto ?? ''}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      whileTap={{ scale: 1.1 }}
                    />
                  ))}

                  <motion.div
                    whileTap={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 text-gray-500 font-bold cursor-pointer"
                    onClick={() => alert('Link de invitación copiado')}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.div>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl shadow-md font-semibold"
                  onClick={() => {
                    navigate('/detalleTorneo', { state: modalTorneo });
                    setModalTorneo(null);
                  }}
                >
                  Detalles
                </button>

                {isInscrito(modalTorneo) ? (
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-2xl shadow-md font-semibold flex items-center justify-center gap-1">
                    <Check className="h-4 w-4" /> Inscrito
                  </button>
                ) : (
                  <button
                    className="flex-1 bg-blue-500 text-white py-3 rounded-2xl shadow-md font-semibold"
                    onClick={() => navigate('/confirmarEquipoTorneo')}
                  >
                    Unirse
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
