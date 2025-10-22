import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Calendar, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from "react-hook-form"

const CardSelector = ({ title, options, selected, onSelect }) => (
  <div>
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <motion.div
          key={opt}
          onClick={() => onSelect(opt)}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`
            px-4 py-2 rounded-2xl cursor-pointer border transition-all
            ${selected === opt
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white/10 text-gray-700 hover:bg-white/20'}
          `}
        >
          {opt}
        </motion.div>
      ))}
    </div>
  </div>
)


// Botón principal animado
const Button = ({ children, ...props }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
    {...props}
  >
    {children}
  </motion.button>
)

export default function RegistroUsuario() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  

  const InputError = ({ error }) => {
    if (error.message) {
      return <p role="alert" className="text-red-500">
        {error.message}
      </p>
    }
    if (error.type === 'pattern') {
      return <p role="alert" className="text-red-500">
        Formato inválido
      </p>
    }

    return null
  }

  const onSubmit = (data) => console.log(data)

  const navigate = useNavigate()
  const [registered, setRegistered] = useState(false)

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    telefono: '',
    manoDominante: '',
    posicion: '',
    golpeFavorito: '',
    frecuenciaPadel: '',
    estiloJuego: '',
    categoria: '',
  })

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const handleSelect = (field) => (value) => setForm({ ...form, [field]: value })

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   setRegistered(true)
  //   setTimeout(() => navigate('/home'), 1800)
  // }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-5 py-8 overflow-hidden">
      {/* Fondo dinámico */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Header animado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 z-10"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Crear cuenta</h2>
        <p className="text-gray-500 text-sm mt-1">Configura tu perfil de jugador</p>
      </motion.div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 z-10"
      >

        {/* Input Nombre */}
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative w-full rounded-2xl transition-all"
        >
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Nombre"
            {...register("nombre", { required: "Por favor, ingrese su nombre" })}
            className="
              w-full px-10 py-3 rounded-2xl bg-white/10 focus:bg-white/30 
              text-gray-800 placeholder-gray-400 focus:outline-none 
              focus:ring-2 focus:ring-blue-400 focus:ring-opacity-40 
              transition-all
            "
          />
        </motion.div>
        {errors.nombre && <InputError error={errors.nombre} />}

        {/* Input Apellido */}
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative w-full rounded-2xl transition-all"
        >
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Apellido"
            {...register("apellido", { required: "Por favor, ingrese su apellido" })}
            className="
              w-full px-10 py-3 rounded-2xl bg-white/10 focus:bg-white/30 
              text-gray-800 placeholder-gray-400 focus:outline-none 
              focus:ring-2 focus:ring-blue-400 focus:ring-opacity-40 
              transition-all
            "
          />
        </motion.div>
        {errors.apellido && <InputError error={errors.apellido} />}

        {/* Input Email */}
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative w-full rounded-2xl transition-all"
        > 
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="Correo electrónico"
            {...register("email", { required: "Por favor, ingrese su correo electrónico", pattern: /^\S+@\S+$/i })}
            className="
              w-full px-10 py-3 rounded-2xl bg-white/10 focus:bg-white/30 
              text-gray-800 placeholder-gray-400 focus:outline-none 
              focus:ring-2 focus:ring-blue-400 focus:ring-opacity-40 
              transition-all
            "
          />
        </motion.div>
        {errors.email && <InputError error={errors.email} />}

        {/* Input Password */}
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative w-full rounded-2xl transition-all"
        >
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="password"
            placeholder="Contraseña"
            {...register("password", { required: "Por favor, ingrese su contraseña" })}
            className="
              w-full px-10 py-3 rounded-2xl bg-white/10 focus:bg-white/30 
              text-gray-800 placeholder-gray-400 focus:outline-none 
              focus:ring-2 focus:ring-blue-400 focus:ring-opacity-40 
              transition-all
            "
          />
        </motion.div>
        {errors.password && <InputError error={errors.password} />}

        {/* Input Fecha de nacimiento */}
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative w-full rounded-2xl transition-all"
        >
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="date"
            placeholder="Fecha de nacimiento"
            {...register("fecha_nacimiento", { required: "Por favor, ingrese su fecha de nacimiento" })}
            className="
              w-full px-10 py-3 rounded-2xl bg-white/10 focus:bg-white/30 
              text-gray-800 placeholder-gray-400 focus:outline-none 
              focus:ring-2 focus:ring-blue-400 focus:ring-opacity-40 
              transition-all
            "
          />
        </motion.div>
        {errors.fecha_nacimiento && <InputError error={errors.fecha_nacimiento} />}

        {/* Input Teléfono */}
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative w-full rounded-2xl transition-all"
        >
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            placeholder="Teléfono"
            {...register("telefono", { required: "Por favor, ingrese su teléfono" })}
            className="
              w-full px-10 py-3 rounded-2xl bg-white/10 focus:bg-white/30 
              text-gray-800 placeholder-gray-400 focus:outline-none 
              focus:ring-2 focus:ring-blue-400 focus:ring-opacity-40 
              transition-all
            "            
          />
        </motion.div>
        {errors.telefono && <InputError error={errors.telefono} />}

        <CardSelector title="Mano dominante" options={['Izquierda', 'Derecha']} selected={form.manoDominante} onSelect={handleSelect('manoDominante')} />
        <CardSelector title="Posición" options={['Drive', 'Revés']} selected={form.posicion} onSelect={handleSelect('posicion')} />
        <CardSelector title="Golpe favorito" options={['Smash', 'Volea', 'Vibora', 'x4', 'x3']} selected={form.golpeFavorito} onSelect={handleSelect('golpeFavorito')} />
        <CardSelector title="Frecuencia de pádel" options={['1 vez/semana', '2-3 veces/semana', '4+ veces/semana']} selected={form.frecuenciaPadel} onSelect={handleSelect('frecuenciaPadel')} />
        <CardSelector title="Estilo de juego" options={['Defensivo', 'Ofensivo', 'Mixto']} selected={form.estiloJuego} onSelect={handleSelect('estiloJuego')} />
        <CardSelector title="Categoría" options={['Open', '1ra Fuerza', '2da Fuerza', '3ra Fuerza', '4ta Fuerza', '5ta Fuerza', '6ta Fuerza', '7ma Fuerza']} selected={form.categoria} onSelect={handleSelect('categoria')} />

        <Button type="submit">Registrar usuario</Button>
      </form>

      {/* Pantalla de éxito animada */}
      <AnimatePresence>
        {registered && (
          <motion.div
            className="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-green-500 text-white rounded-full p-5 shadow-lg"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <p className="mt-4 text-gray-800 font-semibold text-lg">Cuenta creada</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



