import React, { useState } from 'react'
import { User, Camera, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ConfiguracionPerfilPremium() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState({
    nombre: 'Juan Jose Roaro',
    direccion: 'Ciudad Obregón, Sonora',
    categoria: '5ta fuerza',
    manoDominante: 'Derecha',
    posicion: 'Drive',
    golpeFavorito: 'Smash',
    frecuencia: '3 veces por semana',
    estiloJuego: 'Agresivo',
    logros: [
      { nombre: "Torneo local ganador", color: "gold" },
      { nombre: "Ranking club: #3", color: "silver" },
      { nombre: "Desafío completado: 50 partidos", color: "blue" }
    ]
  })

  const handleChange = (field, value) => setUsuario(prev => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col space-y-4 relative overflow-x-hidden">
      
      {/* Fondo blur */}
      <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/20 backdrop-blur-xl -z-10"></div>

      {/* Header */}
      <header className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="font-semibold text-lg text-gray-900">Configuración de Perfil</h2>
        <div className="w-6" /> {/* espacio para simetría */}
      </header>

      {/* Foto de perfil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center space-y-2 bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-md border border-white/20"
      >
        <div className="relative w-28 h-28 rounded-full overflow-hidden border border-white/30 shadow-md hover:scale-105 transition-transform duration-300">
          <User className="h-full w-full text-gray-400" />
          <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
            <Camera className="h-4 w-4 text-white" />
          </button>
        </div>
        <p className="text-gray-500 text-sm text-center">Haz clic en la cámara para cambiar tu foto</p>
      </motion.div>

      {/* Inputs principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-3"
      >
        <Input label="Nombre completo" value={usuario.nombre} onChange={e => handleChange('nombre', e.target.value)} />
        <Input label="Dirección" value={usuario.direccion} onChange={e => handleChange('direccion', e.target.value)} />
        <Select label="Categoría" value={usuario.categoria} onChange={e => handleChange('categoria', e.target.value)} options={[
          '1ra fuerza','2da fuerza','3ra fuerza','4ta fuerza','5ta fuerza','6ta fuerza','7ma fuerza'
        ]} />
      </motion.div>

      {/* Preferencias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-3 bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-md border border-white/20"
      >
        <h3 className="font-semibold text-gray-800 mb-2">Preferencias</h3>
        <Select label="Mano dominante" value={usuario.manoDominante} onChange={e => handleChange('manoDominante', e.target.value)} options={['Derecha','Izquierda']} />
        <Select label="Posición" value={usuario.posicion} onChange={e => handleChange('posicion', e.target.value)} options={['Drive','Revés']} />
        <Select label="Golpe favorito" value={usuario.golpeFavorito} onChange={e => handleChange('golpeFavorito', e.target.value)} options={['Smash','Volea','Drive','Revés']} />
        <Select label="Frecuencia" value={usuario.frecuencia} onChange={e => handleChange('frecuencia', e.target.value)} options={['1 vez/semana','2 veces/semana','3 veces/semana','Diario']} />
        <Select label="Estilo de juego" value={usuario.estiloJuego} onChange={e => handleChange('estiloJuego', e.target.value)} options={['Agresivo','Defensivo','Táctico','Mixto']} />
      </motion.div>

      {/* Logros solo lectura */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-md border border-white/20"
      >
        <h3 className="font-semibold text-gray-800 mb-2">Logros</h3>
        <div className="flex flex-wrap gap-2">
          {usuario.logros.map((l,i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md cursor-default"
              style={{ backgroundColor: l.color }}
            >
              {l.nombre}
            </motion.span>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

// Componentes Input y Select
const Input = ({ label, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
    />
  </div>
)

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
)
