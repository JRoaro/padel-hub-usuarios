import React, { useState } from 'react';
import { Search, Calendar, MapPin, Trophy, X, Plus, Users, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import TorneosRepository from '../../network/TorneosRepository'
import Loading from '../../components/Loading'
import { getLocalUser } from '../../utils/utils'
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.locale('es')

export default function Torneos() {
  
  const [busqueda, setBusqueda] = useState('');
  const [modalTorneo, setModalTorneo] = useState(null);

  const navigate = useNavigate();

  const [user] = useState(getLocalUser());

  const { data: torneosData, isFetching } = useQuery({
    queryKey: ['torneos'],
    queryFn: () => TorneosRepository.getTorneos(),
  })

  const torneos = torneosData?.torneos ?? [];
  const torneosDestacados = torneosData?.torneos_destacados ?? [];
  const misTorneos = torneosData?.mis_torneos ?? [];

  const torneosFiltrados = torneos.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } })
  };

  const isInscrito = (torneo) => {
    return torneo?.equipos_inscritos?.some(e => e.usuarios.some(u => u.id == user?.id))
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">

      {/* Buscador */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm mb-6"
      >
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">Torneos</h1>
        <p className="text-gray-500 text-sm mb-4">Encuentra y únete a tus torneos favoritos</p>
        
        <div className="flex items-center bg-gray-100 rounded-3xl p-3 shadow-sm">
          <Search className="h-5 w-5 text-gray-400 mr-3"/>
          <input
            type="text"
            placeholder="Buscar torneos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 bg-transparent outline-none border-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </motion.div>


      {/* Mis torneos */}
      <div className="mb-6">
        <h3 className="text-gray-800 font-semibold flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5 text-yellow-500" /> Mis torneos
        </h3>
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {misTorneos.map((t, idx) => (
              <motion.div
                key={t.id}
                custom={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05, duration: 0.3 } }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.01, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
                className="flex items-center justify-between bg-white rounded-3xl p-4 cursor-pointer transition"
                onClick={() => navigate(`/detalleTorneo`, { state: t })}
              >
                {/* Imagen circular del club */}
                <img src={t.imagen} alt={t.nombre} className="w-14 h-14 rounded-full object-cover mr-4 border border-gray-100 shadow-sm"/>

                {/* Info torneo */}
                <div className="flex-1 flex flex-col">
                  <span className="font-semibold text-gray-900">{t.nombre}</span>
                  <span className="text-gray-500 text-sm">{t.club.nombre}</span>
                  <span className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {dayjs.tz(t.fecha_inicio).format('DD/MM/YYYY')}
                  </span>
                </div>

                {/* Badge minimal */}
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                  <Check className="h-3 w-3"/> Inscrito
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>




      {/* Torneos destacados */}
      <div className="mb-6">
        <h3 className="text-gray-900 font-semibold mb-4 text-lg">Destacados</h3>
        <div className="flex gap-4 overflow-x-auto pb-3 scroll-smooth">
          {torneosDestacados.map((torneo, i) => (
            <motion.div
              key={torneo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }}
              whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
              className="relative flex-shrink-0 w-48 h-36 rounded-3xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm bg-white backdrop-blur-sm"
              onClick={() => setModalTorneo(torneo)}
            >
              {/* Imagen de fondo con blur sutil */}
              <img src={torneo.imagen} alt={torneo.nombre} className="w-full h-full object-cover brightness-95 transition-all duration-300"/>
              
              {/* Overlay elegante */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent p-3 flex flex-col justify-end">
                <h4 className="text-white text-sm font-semibold truncate">{torneo.nombre}</h4>
                <span className="text-white text-xs opacity-80 truncate">{torneo.club.nombre}</span>
              </div>

              {/* Badge de estado mini */}
              <span className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium rounded-full ${
                torneo.estado === 'Próximo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {torneo.estado}
              </span>
            </motion.div>
          ))}
        </div>
      </div>




      {/* Todos los torneos */}
      <div>
        <h3 className="text-gray-900 font-semibold mb-3 text-base">Todos los torneos</h3>
        <div className="divide-y divide-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
          {torneosFiltrados.map((torneo, i) => (
            <motion.div
              key={torneo.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
              whileHover={{ backgroundColor: "rgba(243,244,246,0.7)" }}
              className="flex justify-between items-center py-3 px-4 cursor-pointer transition-colors duration-150"
              onClick={() => setModalTorneo(torneo)}
            >
              {/* Info principal */}
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="font-medium text-gray-900 truncate">{torneo.nombre}</span>
                <div className="text-gray-500 text-xs mt-0.5 truncate">
                  {torneo.club.nombre} • {dayjs.tz(torneo.fecha_inicio).format('DD/MM/YYYY')}
                </div>
              </div>

              {/* Estado e inscritos */}
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                {/* Inscripción */}
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  isInscrito(torneo) 
                    ? "bg-green-100 text-green-800" 
                    : torneo.estado === "Próximo"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                }`}>
                  {isInscrito(torneo) ? "Inscrito" : torneo.estado}
                </span>

                {/* Jugadores/equipos */}
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <Users className="h-4 w-4"/> {torneo.equipos_inscritos.length}/{torneo.limite_equipos}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>





      {/* Modal torneo */}
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
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setModalTorneo(null)}
              >
                <X className="h-5 w-5"/>
              </button>

              <img src={modalTorneo.imagen} alt={modalTorneo.club.nombre} className="w-full h-36 object-cover rounded-2xl mb-4"/>

              <h2 className="text-xl font-bold text-gray-900 mb-1">{modalTorneo.nombre}</h2>
              <div className="flex items-center text-gray-500 text-sm space-x-2 mb-3">
                <Calendar className="h-4 w-4" />
                <span>{dayjs.tz(modalTorneo.fecha_incio).format('DD/MM/YYYY')}</span>
                <MapPin className="h-4 w-4 ml-4"/>
                <span>{modalTorneo.club.direccion}</span>
              </div>

              <div className="mb-4 max-h-32 overflow-y-auto">
                <h3 className="font-semibold text-gray-800 mb-2">Participantes ({modalTorneo.equipos_inscritos.length}/{modalTorneo.limite_equipos})</h3>
                <div className="flex -space-x-3 items-center">
                  {modalTorneo.equipos_inscritos.map((equipo, i) => {
                    let imagen = ""
                    if (equipo.usuarios.length > 0) {
                        imagen = equipo.usuarios[0].foto
                    }
                    return (
                      <motion.img
                        key={i}
                        src={imagen}
                        alt={equipo.nombre}
                        title={equipo.nombre}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        whileHover={{ scale: 1.1 }}
                      />
                    )
                  })}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 text-gray-500 font-bold cursor-pointer"
                    onClick={() => alert('Link de invitación copiado!')}
                  >
                    <Plus className="h-5 w-5"/>
                  </motion.div>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl shadow-md hover:bg-gray-200 transition font-semibold"
                  onClick={() => {
                    navigate("/detalleTorneo", { state: modalTorneo });
                    setModalTorneo(null);
                  }}
                >
                  Detalles
                </button>
                {isInscrito(modalTorneo) ? (
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-2xl shadow-md font-semibold cursor-not-allowed flex items-center justify-center gap-1">
                    <Check className="h-4 w-4"/> Inscrito
                  </button>
                ) : (
                  <button
                    className="flex-1 bg-blue-500 text-white py-3 rounded-2xl shadow-md hover:bg-blue-600 transition font-semibold"
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
