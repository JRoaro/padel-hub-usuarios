import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Share2, ArrowLeft, Gift } from 'lucide-react';
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
            className="
                flex items-center gap-2 
                text-gray-700 
                bg-white/60 backdrop-blur-md
                px-3 py-2 
                rounded-xl shadow-sm 
                border border-white/40
            "
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.35 }}
            >

                {/* Fecha */}
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">
                    {dayjs.tz(torneo.fecha_inicio).format('DD/MM/YYYY')}
                    </span>
                </div>

                {/* Separador minimal */}
                <div className="w-[1px] h-4 bg-gray-300/50 mx-1" />

                {/* Ubicación clickable estilo iOS */}
                <motion.div
                className="
                    flex items-center gap-1.5
                    cursor-pointer
                    text-gray-700
                    active:scale-[0.97]
                    transition-all
                    select-none
                "
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                    const encoded = encodeURIComponent(torneo.club?.direccion);
                    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

                    const url = isIOS
                    ? `maps://maps.apple.com/?q=${encoded}`
                    : `https://www.google.com/maps/search/?api=1&query=${encoded}`;

                    window.open(url, "_blank");
                }}
                >
                <MapPin className="h-4 w-4 text-blue-500" />

                <span
                    className="
                    text-sm font-medium
                    underline decoration-[1px] underline-offset-[3px]
                    decoration-transparent hover:decoration-blue-400
                    transition
                    max-w-[180px] truncate
                    "
                >
                    {torneo.club?.direccion}
                </span>
                </motion.div>
            </motion.div>



            <hr className="border-gray-200"/>

            {/* Chips de info rápida */}
            <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            >
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{torneo.modalidad?.nombre}</span>
            {torneo.premios?.length > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Premios disponibles</span>
            )}
            </motion.div>

            {/* Descripción */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            >
            <h3 className="font-semibold text-gray-800 mb-1">Descripción</h3>
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
                        <motion.div
                        key={index}
                        whileTap={{ scale: 0.97 }}
                        className="
                            min-w-[110px] px-3 py-3 rounded-3xl
                            bg-white/60 backdrop-blur-md
                            shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                            border border-white/40
                            flex flex-col items-center text-center
                        "
                        >
                        <div className="text-2xl mb-1">
                            {index === 0 && "🥇"}
                            {index === 1 && "🥈"}
                            {index === 2 && "🥉"}
                            {index > 2 && "🏅"}
                        </div>

                        <p className="text-gray-800 font-medium text-xs">
                            {index + 1}° Lugar
                        </p>

                        <p className="text-gray-600 text-[11px] mt-1 line-clamp-4">
                            {p.descripcion}
                        </p>


                        </motion.div>
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
                {(torneo.equipos_inscritos || []).map((equipo, index) => {
                    let imagen = ""
                    if (equipo.usuarios.length > 0) {
                        imagen = equipo.usuarios[0].foto
                    }
                    return (
                        <motion.img
                            key={index}
                            src={imagen}
                            alt={equipo.nombre}
                            className="w-12 h-12 rounded-full border-2 border-white object-cover"
                        />
                    )
                })}
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
            className="space-y-2 text-sm text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            >
            <div className="flex justify-between">
                <span>Precio de inscripción:</span>
                <span>{torneo.costo_inscripcion} MXN</span>
            </div>
            <div className="flex justify-between">
                <span>Límite de equipos:</span>
                <span>{torneo.limite_equipos}</span>
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
            <motion.div
            className="flex gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            >
                <motion.button
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl transition font-semibold flex items-center justify-center"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCompartir}
                >
                    <Share2 className="mr-2 h-5 w-5"/> Compartir
                </motion.button>
                {!isInscrito && (
                    <motion.button
                        className="flex-1 bg-blue-500 text-white py-3 rounded-2xl transition font-semibold flex items-center justify-center"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/confirmarEquipoTorneo', { state: { id: torneo.id } })}
                    >
                        <Trophy className="mr-2 h-5 w-5"/> Unirse

                    </motion.button>
                )}
            </motion.div>

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
