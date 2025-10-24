import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Share2, ArrowLeft, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

import laPista from "../../assets/img/LaPista.jpg"
import Patro1 from "../../assets/img/patro1.png"
import Patro2 from "../../assets/img/patro2.png"
import Patro3 from "../../assets/img/patro3.png"
import Patro4 from "../../assets/img/patro4.png"
import Patro5 from "../../assets/img/patro5.png"

export default function DetalleTorneo() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para el toast
  const [showToast, setShowToast] = useState(false);

  // Función para compartir
  const handleCompartir = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const torneo = {
    nombre: 'Torneo de Equipos 6ta 5ta',
    club: 'La Pista',
    fecha: '2025-10-22',
    ubicacion: 'Ciudad Obregón',
    estado: 'Abierto',
    descripcion: 'Torneo de pádel conformado por 4 jugadores: 2 de categoría 6ta y 2 de categoría 5ta. El formato de competición será al mejor de tres partidos. Sistema de puntuación por partidos Primer partido: SUMA 12 Segundo partido: SUMA 10 Tercer partido: SUMA 11',
    jugadores: [
        { nombre: 'Juan', avatar: 'https://i.pravatar.cc/50?img=1' },
        { nombre: 'Ana', avatar: 'https://i.pravatar.cc/50?img=2' },
        { nombre: 'Luis', avatar: 'https://i.pravatar.cc/50?img=3' },
        { nombre: 'María', avatar: 'https://i.pravatar.cc/50?img=4' },
        { nombre: 'Carlos', avatar: 'https://i.pravatar.cc/50?img=5' },
        { nombre: 'Lucía', avatar: 'https://i.pravatar.cc/50?img=6' },
    ],
    maxParticipantes: 12,
    precio: 1000,
    imgClub: laPista,
    premios: ['1er lugar: Jersey c/u, 1hr de cancha c/u, $500 en efectivo c/u, Overgrip c/u y Sampler de la costilleria para equipo',
        '2do lugar: Bebida de la barra para cada participante'
    ],
    modalidad: 'Round Robin',
    tipo: 'Por equipo',
  };

  const cupoPorcentaje = (torneo.jugadores?.length || 0) / torneo.maxParticipantes * 100;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">

      {/* Header con parallax */}
      <div className="relative w-full h-64 overflow-hidden">
        <motion.img
          src={torneo.imgClub}
          alt={torneo.club}
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
          <span className="text-white text-sm">{torneo.club}</span>

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
            className="flex items-center space-x-4 text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            >
            <Calendar className="h-5 w-5"/>
            <span>{dayjs(torneo.fecha).format('DD/MM/YYYY')}</span>
            <MapPin className="h-5 w-5 ml-4"/>
            <span>{torneo.ubicacion}</span>
            </motion.div>

            <hr className="border-gray-200"/>

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

            {/* Participantes */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            >
            <h3 className="font-semibold text-gray-800 mb-2">
                Equipos  ({torneo.jugadores?.length || 0}/{torneo.maxParticipantes})
            </h3>
            <div className="flex -space-x-3 mb-2">
                {(torneo.jugadores || []).map((j,i) => (
                <motion.img
                    key={i}
                    src={j.avatar}
                    alt={j.nombre}
                    className="w-12 h-12 rounded-full border-2 border-white"
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

            {/* Chips de info rápida */}
            <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            >
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{torneo.modalidad}</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{torneo.tipo}</span>
            {torneo.premios?.length > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Premios disponibles</span>
            )}
            </motion.div>

            {/* Información adicional */}
            <motion.div
            className="space-y-2 text-sm text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            >
            <div className="flex justify-between">
                <span>Precio de inscripción:</span>
                <span>${torneo.precio} MXN</span>
            </div>
            <div className="flex justify-between">
                <span>Límite de equipos:</span>
                <span>{torneo.maxParticipantes}</span>
            </div>
            </motion.div>

            {/* Premios destacados */}
            {torneo.premios?.length > 0 && (
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
                <motion.button
                    className="flex-1 bg-blue-500 text-white py-3 rounded-2xl transition font-semibold flex items-center justify-center"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert('Te has unido al torneo!')}
                >
                    <Trophy className="mr-2 h-5 w-5"/> Unirse
                </motion.button>
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
                {[
                    Patro1,
                    Patro2,
                    Patro3,
                    Patro4,
                    Patro5,
                ].map((src, i) => (
                    <img
                    key={i}
                    src={src}
                    alt={`Patrocinador ${i+1}`}
                    className="h-20 w-auto rounded-xl shadow-md"
                    />
                ))}
                {/* Repetimos las mismas imágenes para el loop infinito */}
                {[
                    Patro1,
                    Patro2,
                    Patro3,
                    Patro4,
                    Patro5,
                ].map((src, i) => (
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
    </div>
  );
}
