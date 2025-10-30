import React, { useState, useEffect, useRef } from 'react'
import { User, Camera, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UsuariosRepository from '../../network/UsuariosRepository'
import { useMutation } from '@tanstack/react-query'
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast';
import { getLocalUser, setLocalUser } from '../../utils/utils'
import Loading from '../../components/Loading'
import InputError from '../../components/InputError'


export default function ConfiguracionPerfil() {
  const navigate = useNavigate()

  const [user, setUser] = useState(getLocalUser())  
  const [fotoSrc, setFotoSrc] = useState(user?.foto)
    
  const fotoInputRef = useRef(null); 
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.nombre,
      last_name: user?.apellido,
      email: user?.email,
      fecha_nacimiento: user?.fecha_nacimiento,
      telefono: user?.telefono,
      categoria: user?.categoria,
      mano_dominante: user?.mano_dominante,
      posicion: user?.posicion,
      golpe_favorito: user?.golpe_favorito,
      frecuencia_padel: user?.frecuencia_padel,
      estilo_juego: user?.estilo_juego,
      logro: user?.logro_preferido?.id
    }
  })

  const updatePerfilMutation = useMutation({
    mutationFn: async (user) => {
      return UsuariosRepository.updatePerfil(user)
    },
    onSuccess: (data) => {
      if (data && data.success) {
        setLocalUser(data.usuario)
        toast.success("Perfil actualizado")
        navigate('/perfil')
        return 
      } 

      const message = data.message || "Ocurrió un error al actualizar el perfil";
      toast.error(message);
    },
    onError: () => {
      toast.error("Ocurrió un error al actualizar el perfil");
    }
  })

  const optionsManoDominante = [ 'Derecha','Izquierda' ]
  const optionsPosicion = [ 'Drive','Revés' ]
  const optionsGolpeFavorito = [ 'Smash','Volea','Víbora','x4','x3' ]
  const optionsFrecuencia = [ '1 vez/semana','2-3 veces/semana','4+ veces/semana' ]
  const optionsEstiloJuego = [ 'Defensivo','Ofensivo','Mixto' ]
  const optionsCategoria = [ '1ra Fuerza','2da Fuerza','3ra Fuerza','4ta Fuerza','5ta Fuerza','6ta Fuerza','7ma Fuerza' ]
  const optionsLogros = user?.logros?.map(l => {
    return {id: l.id, nombre: l.nombre}
  })

  const onSubmit = (data) => {
    const foto = fotoInputRef.current.files[0]

    updatePerfilMutation.mutate({
      name: data.name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      fecha_nacimiento: data.fecha_nacimiento,
      telefono: data.telefono,
      mano_dominante: data.mano_dominante,
      posicion: data.posicion,
      golpe_favorito: data.golpe_favorito,
      frecuencia_padel: data.frecuencia_padel,
      estilo_juego: data.estilo_juego,
      categoria: data.categoria,
      foto: foto,
      logro_id: data.logro
    })

    //scroll to top
    window.scrollTo(0, 0)
  }

  const handleChangeFoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFotoSrc(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="min-h-screen bg-gray-50 p-4 flex flex-col space-y-4 relative overflow-x-hidden">
        
        {/* Fondo blur */}
        <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/20 backdrop-blur-xl -z-10"></div>

        {/* Header */}
        <header className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md">
          <button onClick={() => navigate(-1)} type="button" className="text-gray-700">
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
          <div className="relative">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border border-white/30 shadow-md hover:scale-105 transition-transform duration-300">
              <img src={fotoSrc} className="h-full w-full" />
            </div>
            <button 
              type="button" 
              className="absolute -bottom-1 -right-1 bg-blue-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              onClick={() => { fotoInputRef.current.click() }}
            >
              <Camera className="h-4 w-4 text-white" />
            </button>
          </div>
          {errors.foto && <InputError error={errors.foto} />}
          <input type="file" {...register("foto")} className="opacity-0" ref={fotoInputRef} onChange={handleChangeFoto} accept="image/*" />
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
              {...register("name", { required: "Por favor, ingrese su nombre" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            />
          </div>
          {errors.name && <InputError error={errors.name} />}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Apellido</label>
            <input
              type="text"
              {...register("last_name", { required: "Por favor, ingrese su apellido" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            />
          </div>
          {errors.last_name && <InputError error={errors.last_name} />}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Por favor, ingrese su email" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            />
          </div>
          {errors.email && <InputError error={errors.email} />}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              {...register("fecha_nacimiento", { required: "Por favor, ingrese su fecha de nacimiento" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            />
          </div>
          {errors.fecha_nacimiento && <InputError error={errors.fecha_nacimiento} />}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Teléfono</label>
            <input
              type="tel"
              {...register("telefono", { required: "Por favor, ingrese su teléfono" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            />
          </div>
          {errors.telefono && <InputError error={errors.telefono} />}

          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Categoría</label>
            <select
              {...register("categoria", { required: "Por favor, seleccione su categoría" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            >
              {optionsCategoria.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          {errors.categoria && <InputError error={errors.categoria} />}
  

        </motion.div>

        {/* Preferencias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-3 bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-md border border-white/20"
        >
          <h3 className="font-semibold text-gray-800 mb-2">Preferencias</h3>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Mano dominante</label>
            <select
              {...register("mano_dominante", { required: "Por favor, seleccione su mano dominante" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            >
              {optionsManoDominante.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select> 
          </div>
          {errors.mano_dominante && <InputError error={errors.mano_dominante} />}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Posición</label>
            <select
              {...register("posicion", { required: "Por favor, seleccione su posición" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            >
              {optionsPosicion.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select> 
          </div>
          {errors.posicion && <InputError error={errors.posicion} />}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Golpe favorito</label>
            <select
              {...register("golpe_favorito", { required: "Por favor, seleccione su golpe favorito" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            >
              {optionsGolpeFavorito.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select> 
          </div>
          {errors.golpe_favorito && <InputError error={errors.golpe_favorito} />}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Frecuencia</label>
            <select
              {...register("frecuencia_padel", { required: "Por favor, seleccione su frecuencia de pádel" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            >
              {optionsFrecuencia.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select> 
          </div>
          {errors.frecuencia_padel && <InputError error={errors.frecuencia_padel} />}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Estilo de juego</label>
            <select
              {...register("estilo_juego", { required: "Por favor, seleccione su estilo de juego" })}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            >
              {optionsEstiloJuego.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select> 
          </div>
          {errors.estilo_juego && <InputError error={errors.estilo_juego} />}
        </motion.div>

        {optionsLogros.length > 0 && (
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Logro preferido</label>
            <select
              {...register("logro")}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-shadow shadow-sm hover:shadow-md"
            >
              {optionsLogros.map(opt => <option key={opt.id} value={opt.id}>{opt.nombre}</option>)}
            </select> 
          </div>
        )}
        {errors.logro && <InputError error={errors.logro} />}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl flex items-center justify-center font-semibold shadow-sm">
          Guardar
        </button>
      </div>

      {updatePerfilMutation.isPending && (
        <Loading />
      )}
    </form>
  )
}
