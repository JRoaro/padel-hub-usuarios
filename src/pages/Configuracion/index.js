import React, { useState, useEffect } from 'react'
import { User, Camera, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UsuariosRepository from '../../network/UsuariosRepository'
import { useMutation } from '@tanstack/react-query'
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast';
import { getLocalUser } from '../../utils/utils'

export default function ConfiguracionPerfilPremium() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => { 
    setUser(getLocalUser())
  }, [])

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
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Nombre</label>
          <input
            type="text"
            {...register("nombre", { required: "Por favor, ingrese su nombre" })}
            defaultValue={user?.nombre}
            className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Apellido</label>
          <input
            type="text"
            {...register("apellido", { required: "Por favor, ingrese su apellido" })}
            defaultValue={user?.apellido}
            className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: "Por favor, ingrese su email" })}
            defaultValue={user?.email}
            className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            {...register("fecha_nacimiento", { required: "Por favor, ingrese su fecha de nacimiento" })}
            defaultValue={user?.fecha_nacimiento}
            className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Teléfono</label>
          <input
            type="tel"
            {...register("telefono", { required: "Por favor, ingrese su teléfono" })}
            defaultValue={user?.telefono}
            className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
          />
        </div>

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


        <Select label="Categoría" value={user?.categoria}  options={[
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
        <Select label="Mano dominante" value={user?.manoDominante}  options={['Derecha','Izquierda']} />
        <Select label="Posición" value={user?.posicion}  options={['Drive','Revés']} />
        <Select label="Golpe favorito" value={user?.golpeFavorito}  options={['Smash','Volea','Drive','Revés']} />
        <Select label="Frecuencia" value={user?.frecuencia}  options={['1 vez/semana','2 veces/semana','3 veces/semana','Diario']} />
        <Select label="Estilo de juego" value={user?.estiloJuego} options={['Agresivo','Defensivo','Táctico','Mixto']} />
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
