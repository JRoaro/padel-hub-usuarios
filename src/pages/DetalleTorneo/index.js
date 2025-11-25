import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Share2, ArrowLeft, Gift, Users, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function DetalleTorneo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [user] = useState(getLocalUser());

  const torneoLocation = location.state
  const torneoId = torneoLocation?.id || searchParams.get('id');

  const { data: torneoData, isFetching } = useQuery({
    queryKey: ['torneo'],
    queryFn: () => TorneosRepository.getTorneo(torneoId),
  })

  // Función para compartir
  const handleCompartir = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(`${url}?id=${torneo.id}`);
    toast.success("¡Invitación copiada al portapapeles!");
  };

  const abrirEnMaps = () => {
    const direccion = torneo?.club?.direccion || "";
    if (!direccion) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, "_blank");
};


  const torneo = torneoData?.torneo ?? torneoLocation ?? {}

  const cupoPorcentaje = (torneo?.equipos_inscritos?.length || 0) / torneo?.limite_equipos * 100;

  const isInscrito = torneo?.equipos_inscritos?.some(e => e.usuarios.some(u => u.id == user?.id)); 


  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">

      {/* Header con parallax */}
      <div className="relative w-full h-64 overflow-hidden">
        <motion.img
          src={torneo.imagen}
          alt={torneo.nombre}
          className="w-full h-full object-cover"
          style={{ y: 0 }}
          whileInView={{ y: [-20, 0] }}
          transition={{ duration: 1 }}
        />
        <div className="absolute inset-0 bg-black/25 flex flex-col align-items-start justify-end p-6">
          <button
            className="absolute top-4 left-4 text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6"/>
          </button>
          <h1 className="text-white text-2xl font-bold">{torneo.nombre}</h1>
          <span className="text-white text-sm">{torneo.club?.nombre}</span>

          {/* Estado pequeño */}
          <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold text-green-800 bg-green-100">
            {torneo.estado}
          </span>
        </div>
      </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

            {/* Fecha y ubicación */}
            <motion.div
            className="flex items-center justify-between text-gray-800 bg-white/50 px-4 py-3 rounded-2xl border border-white/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            >
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500"/>
                    <span className="text-sm font-medium">{dayjs.tz(torneo.fecha_inicio).format('DD/MM/YYYY')}</span>
                </div>

                <motion.div
                    className="flex items-center gap-1 cursor-pointer select-none"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => abrirEnMaps()}
                >
                    <MapPin className="h-5 w-5 text-red-500"/>
                    <span className="text-sm font-medium truncate max-w-[160px] underline decoration-blue-400 underline-offset-2">
                    {torneo.club?.direccion}
                    </span>
                </motion.div>
            </motion.div>


            <hr className="border-gray-200"/>

            {/* Chips de info rápida */}
            <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                    {torneo.modalidad?.nombre}
                </span>
                {torneo.premios?.length > 0 && (
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-semibold">
                    Premios disponibles
                    </span>
                )}
            </div>


            {/* Descripción */}
            <motion.div
            className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl p-4 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            >
            <h3 className="text-gray-900 font-semibold text-base">Descripción</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{torneo.descripcion}</p>
            </motion.div>


            <hr className="border-gray-200"/>

            {/* Premios del torneo */}
            {torneo.premios?.length > 0 && (
                <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h3 className="font-semibold text-gray-800 mb-2">Premios</h3>

                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {torneo.premios.map((p, index) => (
                            <div key={index} className="min-w-[120px] px-3 py-3 bg-white/50 rounded-2xl border border-white/30 flex flex-col items-center text-center">
                            <div className="text-2xl mb-1">
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅"}
                            </div>
                            <p className="text-gray-900 font-medium text-xs">{index + 1}° Lugar</p>
                            <p className="text-gray-600 text-[11px] mt-1 line-clamp-3">{p.descripcion}</p>
                            </div>
                        ))}
                    </div>

                </motion.div>
            )} 

            <hr className="border-gray-200"/>

            {/* Participantes */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            >
            <h3 className="font-semibold text-gray-800 mb-2">
                Equipos  ({torneo.equipos_inscritos?.length || 0}/{torneo.limite_equipos})
            </h3>
            <div className="flex -space-x-3 mb-2">
                {torneo.equipos_inscritos?.map((equipo, i) => (
                    <img
                    key={i}
                    src={equipo.usuarios[0]?.foto || "/default-avatar.png"}
                    alt={equipo.nombre}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                ))}
                </div>
            

            {/* Barra de cupo */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div 
                className="bg-green-500 h-2"
                initial={{ width: 0 }}
                animate={{ width: `${cupoPorcentaje}%` }}
                transition={{ duration: 0.8 }}
                />
            </div>
            </motion.div>

            <hr className="border-gray-200"/>

            {/* Información adicional */}
            <motion.div
                className="grid grid-cols-2 gap-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                >
                {/* Precio de inscripción */}
                <div className="flex flex-col items-center bg-white/40 border border-white/30 backdrop-blur-md rounded-3xl py-4 px-3">
                    <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span className="text-xs text-gray-500">Inscripción</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 mt-1">
                    {torneo.costo_inscripcion} MXN
                    </span>
                </div>

                {/* Límite de equipos */}
                <div className="flex flex-col items-center bg-white/40 border border-white/30 backdrop-blur-md rounded-3xl py-4 px-3">
                    <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-xs text-gray-500">Límite de equipos</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 mt-1">
                    {torneo.limite_equipos}
                    </span>
                </div>
            </motion.div>



            {/* Premios destacados */}
            {false && (
                <motion.div
                    className="space-y-4 mt-6"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    <h3 className="font-bold text-gray-800 text-lg">Premios del Torneo</h3>
                    
                    {torneo.premios.map((premio, i) => (
                    <motion.div
                        key={i}
                        className={`p-4 rounded-2xl shadow-lg border ${
                        i === 0 ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-100 border-gray-200'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                        <h4 className={`font-semibold text-sm ${i === 0 ? 'text-yellow-700 text-base' : 'text-gray-700'}`}>
                        {i === 0 ? '🥇 1er Lugar' : i === 1 ? '🥈 2do Lugar' : `🥉 ${i+1}er Lugar`}
                        </h4>
                        {Array.isArray(premio) ? (
                        <ul className="list-disc list-inside mt-2 text-sm text-gray-700 space-y-1">
                            {premio.map((p, idx) => (
                            <li key={idx}>{p}</li>
                            ))}
                        </ul>
                        ) : (
                        <p className="mt-2 text-sm text-gray-700">{premio}</p>
                        )}
                    </motion.div>
                    ))}
                </motion.div>
            )}


            {/* Botones integrados */}
            <div className="flex gap-4 mt-6">
                <motion.button
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold flex items-center justify-center"
                    whileTap={{ scale: 0.96 }}
                    onClick={handleCompartir}
                >
                    <Share2 className="mr-2 h-5 w-5"/> Compartir
                </motion.button>

                {!isInscrito && (
                    <motion.button
                    className="flex-1 py-3 bg-blue-500 text-white rounded-2xl font-semibold flex items-center justify-center"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/confirmarEquipoTorneo', { state: { id: torneo.id } })}
                    >
                    <Trophy className="mr-2 h-5 w-5"/> Unirse
                    </motion.button>
                )}
            </div>


            {/* Carousel de patrocinadores */}
            <motion.div 
            className="mt-8 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            >
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Patrocinadores</h3>
            <div className="relative w-full h-24">
                <motion.div
                className="flex gap-6 absolute"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                >
                {torneo.imagenes_patrocinadores?.map((src, i) => (
                    <img
                    key={i}
                    src={src}
                    alt={`Patrocinador ${i+1}`}
                    className="h-20 w-auto rounded-xl shadow-md"
                    />
                ))}
                {/* Repetimos las mismas imágenes para el loop infinito */}
                {torneo.imagenes_patrocinadores?.map((src, i) => (
                    <img
                    key={"loop" + i}
                    src={src}
                    alt={`Patrocinador ${i+1}`}
                    className="h-20 w-auto rounded-xl shadow-md"
                    />
                ))}
                </motion.div>
            </div>
            </motion.div>
        </div>
    </div>
  );
}
