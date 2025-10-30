import React, { useState } from 'react';
import { Search, Calendar, MapPin, Trophy, X, Plus, Users, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import laPista from "../../assets/img/LaPista.jpg";
import Sunset from "../../assets/img/sunset.jpg";
import Nainari from "../../assets/img/PadelNainari.jpg";

export default function Torneos() {
  const [busqueda, setBusqueda] = useState('');
  const [modalTorneo, setModalTorneo] = useState(null);

  const navigate = useNavigate();
  const usuario = "Juan";

  const torneos = [
    {
      id: 1,
      nombre: 'Torneo Invierno 2025',
      club: 'La Pista',
      fecha: '2025-12-15',
      participantes: 12,
      maxParticipantes: 16,
      ubicacion: 'Ciudad Obregón',
      estado: 'Abierto',
      destacados: true,
      imgClub: laPista,
      descripcion: 'Torneo de invierno para jugadores de nivel intermedio y avanzado. Premios especiales y snacks incluidos.',
      costo: '$200',
      jugadores: [
        { nombre: 'Juan', avatar: 'https://i.pravatar.cc/150?img=1' },
        { nombre: 'Luis', avatar: 'https://i.pravatar.cc/150?img=2' },
        { nombre: 'Ana', avatar: 'https://i.pravatar.cc/150?img=3' },
        { nombre: 'Carlos', avatar: 'https://i.pravatar.cc/150?img=4' }
      ]
    },
    {
      id: 2,
      nombre: 'Torneo Local Novatos',
      club: 'Padel Nainari',
      fecha: '2025-11-20',
      participantes: 8,
      maxParticipantes: 16,
      ubicacion: 'Ciudad Obregón',
      estado: 'Abierto',
      destacados: false,
      imgClub: Nainari,
      descripcion: 'Torneo para novatos que quieren iniciarse en la competencia. Ambiente amigable y premios simbólicos.',
      costo: '$100',
      jugadores: [
        { nombre: 'Pedro', avatar: 'https://i.pravatar.cc/150?img=5' },
        { nombre: 'Lucia', avatar: 'https://i.pravatar.cc/150?img=6' },
        { nombre: 'Mario', avatar: 'https://i.pravatar.cc/150?img=7' }
      ]
    },
    {
      id: 3,
      nombre: 'Torneo Anual 2025 Open Series',
      club: 'Sunset Padel',
      fecha: '2025-12-05',
      participantes: 16,
      maxParticipantes: 16,
      ubicacion: 'Ciudad Obregón',
      estado: 'Cerrado',
      destacados: true,
      imgClub: Sunset,
      descripcion: 'Torneo anual Open Series con jugadores de todo el país. Gran premiación y cobertura especial.',
      costo: '$300',
      jugadores: [
        { nombre: 'Ana/Luis', avatar: 'https://i.pravatar.cc/150?img=8' },
        { nombre: 'Juan/Jose', avatar: 'https://i.pravatar.cc/150?img=9' },
        { nombre: 'Francisco/Alonso', avatar: 'https://i.pravatar.cc/150?img=10' },
        { nombre: 'Ricardo/Julian', avatar: 'https://i.pravatar.cc/150?img=11' }
      ]
    }
  ];

  const torneosFiltrados = torneos.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const misTorneos = torneos.filter(t => t.jugadores.some(j => j.nombre.includes(usuario)));

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } })
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">

      {/* Buscador */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center bg-white/90 backdrop-blur-md rounded-3xl p-3 shadow-md mb-6"
      >
        <Search className="h-5 w-5 text-gray-400 mr-2"/>
        <input
          type="text"
          placeholder="Buscar torneos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
        />
      </motion.div>

      {/* Mis torneos */}
      <div className="mb-6">
        <h3 className="text-gray-700 font-semibold flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5 text-yellow-500" /> Mis torneos
        </h3>
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {misTorneos.map((t, idx) => (
              <motion.div
                key={t.id}
                custom={idx}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } })
                }}
                className="flex items-center justify-between bg-white rounded-3xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/detalleTorneo`, { state: { torneo: t } })}
              >
                {/* Imagen del club */}
                <img src={t.imgClub} alt={t.club} className="w-16 h-16 rounded-2xl object-cover mr-4" />

                {/* Info torneo */}
                <div className="flex-1 flex flex-col">
                  <span className="font-semibold text-gray-800">{t.nombre}</span>
                  <span className="text-xs text-gray-500">{t.club}</span>
                  <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {dayjs(t.fecha).format('DD/MM/YYYY')}
                  </span>
                </div>

                {/* Estado */}
                <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">
                  <Check className="h-3 w-3" /> Inscrito
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>



      {/* Torneos destacados */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Destacados</h3>
        <div className="flex overflow-x-auto gap-4 scroll-smooth pb-2">
          {torneos.filter(t => t.destacados).map((torneo, i) => (
            <motion.div
              key={torneo.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              whileHover={{ scale: 1.04 }}
              className="relative flex-shrink-0 w-64 h-44 rounded-3xl shadow-lg cursor-pointer overflow-hidden"
              onClick={() => setModalTorneo(torneo)}
            >
              <img src={torneo.imgClub} alt={torneo.club} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex flex-col justify-end p-4">
                <h4 className="font-bold text-white text-lg">{torneo.nombre}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-white text-sm">{torneo.club}</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${torneo.estado === 'Abierto' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {torneo.estado}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Todos los torneos */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Todos los torneos</h3>
        <div className="space-y-4">
          {torneosFiltrados.map((torneo, i) => (
            <motion.div
              key={torneo.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-3xl shadow-md p-4 border border-gray-200 cursor-pointer flex flex-col hover:shadow-lg transition"
              onClick={() => setModalTorneo(torneo)}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">{torneo.nombre}</h4>
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${torneo.jugadores.some(j => j.nombre.includes(usuario)) ? 'bg-green-100 text-green-800' : (torneo.estado === 'Abierto' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}`}>
                  {torneo.jugadores.some(j => j.nombre.includes(usuario)) ? "Inscrito" : torneo.estado}
                </span>
              </div>
              <div className="flex items-center text-gray-500 text-sm mt-2 space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{dayjs(torneo.fecha).format('DD/MM/YYYY')}</span>
                <MapPin className="h-4 w-4 ml-4"/>
                <span>{torneo.ubicacion}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-700 font-medium">{torneo.club}</span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Users className="h-4 w-4"/> {torneo.participantes}/{torneo.maxParticipantes} jugadores
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
              className="bg-white rounded-t-3xl p-6 w-full max-w-md shadow-xl relative overflow-hidden"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setModalTorneo(null)}
              >
                <X className="h-5 w-5"/>
              </button>

              <img src={modalTorneo.imgClub} alt={modalTorneo.club} className="w-full h-36 object-cover rounded-2xl mb-4"/>

              <h2 className="text-xl font-bold text-gray-900 mb-1">{modalTorneo.nombre}</h2>
              <div className="flex items-center text-gray-500 text-sm space-x-2 mb-3">
                <Calendar className="h-4 w-4" />
                <span>{dayjs(modalTorneo.fecha).format('DD/MM/YYYY')}</span>
                <MapPin className="h-4 w-4 ml-4"/>
                <span>{modalTorneo.ubicacion}</span>
              </div>

              <div className="mb-4 max-h-32 overflow-y-auto">
                <h3 className="font-semibold text-gray-800 mb-2">Participantes ({modalTorneo.participantes}/{modalTorneo.maxParticipantes})</h3>
                <div className="flex -space-x-3 items-center">
                  {modalTorneo.jugadores.map((j,i) => (
                    <motion.img
                      key={i}
                      src={j.avatar}
                      alt={j.nombre}
                      title={j.nombre}
                      className="w-10 h-10 rounded-full border-2 border-white shadow"
                      whileHover={{ scale: 1.1 }}
                    />
                  ))}
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
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl shadow hover:bg-gray-200 transition font-semibold"
                  onClick={() => {
                    navigate("/detalleTorneo", { state: { torneo: modalTorneo }});
                    setModalTorneo(null);
                  }}
                >
                  Detalles
                </button>
                {modalTorneo.jugadores.some(j => j.nombre.includes(usuario)) ? (
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-2xl shadow font-semibold cursor-not-allowed flex items-center justify-center gap-1">
                    <Check className="h-4 w-4"/> Inscrito
                  </button>
                ) : (
                  <button
                    className="flex-1 bg-blue-500 text-white py-3 rounded-2xl shadow hover:bg-blue-600 transition font-semibold"
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
