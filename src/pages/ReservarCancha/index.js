import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, CreditCard, DollarSign } from 'lucide-react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import ClubsRepository from '../../network/ClubsRepository'
import ReservacionesRepository from '../../network/ReservacionesRepository'
import toast from 'react-hot-toast'
import Loading from '../../components/Loading'
import { getLocalUser } from '../../utils/utils'

export default function ReservarCancha() {
  const navigate = useNavigate()

  const { data: clubs, isFetching: isFetchingClubs } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => ClubsRepository.getClubs(),
  })
  const clubsData = clubs?.clubs || []

  const datosReservacionMutation = useMutation({
    mutationFn: async (data) => {
      return await ReservacionesRepository.getDatosCrearReservacion(data)
    },
    onSuccess: (data) => {
      if (!data || !data.success) {
        toast.error(data.message || "Ocurrió un error al obtener los datos");
        return
      }
    },
    onError: () => toast.error("Ocurrió un error al obtener los datos"),
  })

  const canchas = datosReservacionMutation.data?.canchas || []
  const precioHora = datosReservacionMutation.data?.precio_hora || 0
  const precioHoraTarde = datosReservacionMutation.data?.precio_hora_tarde || 0

  const confirmarReservacionMutation = useMutation({
    mutationFn: async (data) => {
      return await ReservacionesRepository.createReservacion(data)
    },
    onSuccess: (data) => {
      if (!data || !data.success) {
        toast.error(data.message || "Ocurrió un error al confirmar la reservación");
        return
      }

      toast.success("Reservación confirmada")
      //setPaso(4)
      navigate('/home')
    },
    onError: () => toast.error("Ocurrió un error al confirmar la reservación"),
  })

  const generarHorarios = () => {
    const arr = []
    for (let h = 7; h <= 22; h++) {
      const format = String(h).padStart(2, '0'); 
      arr.push(`${format}:00`)
      arr.push(`${format}:30`)
    }
    arr.push('23:00')
    return arr
  }

  const horarios = generarHorarios()

  const [paso, setPaso] = useState(1)
  const [clubSeleccionado, setClubSeleccionado] = useState(null)
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(null)
  const [horaInicio, setHoraInicio] = useState(null)
  const [horaFin, setHoraFin] = useState(null)
  const [fecha, setFecha] = useState(dayjs().format('YYYY-MM-DD'))
  const [total, setTotal] = useState(0)
  const [metodoPago, setMetodoPago] = useState(null)
  const [user, setUser] = useState(getLocalUser())

  useEffect(() => {
    if (horaInicio && horaFin) {
      const indexInicio = horarios.indexOf(horaInicio)
      const indexFin = horarios.indexOf(horaFin)
      const horasReservadas = (indexFin - indexInicio) * 0.5
      setTotal(horasReservadas * precioHora)
    }
  }, [horaInicio, horaFin, precioHora])

  const handleConfirmar = () => {
    confirmarReservacionMutation.mutate({
      club_id: clubSeleccionado.id,
      numero_cancha: canchaSeleccionada.numero,
      metodo_pago: metodoPago,
      nombre_reserva: user?.nombre,
      fecha_reserva: fecha,
      hora_inicio_reserva: horaInicio,
      hora_fin_reserva: horaFin,
    })
  }

  const backButton = () => {
    if (paso == 1) {
      navigate(-1)
    }
    setPaso(paso > 1 ? paso - 1 : 1)
  }

  const handleClickClub = (club) => {
    setClubSeleccionado(club)
    setPaso(2)
    setHoraInicio(null)
    setHoraFin(null)
    setFecha(dayjs().format('YYYY-MM-DD'))
    setCanchaSeleccionada(null)
    datosReservacionMutation.mutate({ club_id: club.id })
  }

  const isLoading = () => {
    return isFetchingClubs || datosReservacionMutation.isPending || confirmarReservacionMutation.isPending
  }

  const handleChangeFecha = (fecha) => {
    setFecha(fecha)
    setHoraInicio(null)
    setHoraFin(null)
    setCanchaSeleccionada(null)
    datosReservacionMutation.mutate({ club_id: clubSeleccionado.id, fecha_reserva: fecha })
  }

  const handleChangeHoraInicio = (hora) => {
    setHoraInicio(hora)
    setHoraFin(null)
    setCanchaSeleccionada(null)
  }

  const handleChangeHoraFin = (hora) => {
    setHoraFin(hora)
    datosReservacionMutation.mutate({ 
      club_id: clubSeleccionado.id, 
      fecha_reserva: fecha,
      hora_inicio_reserva: horaInicio,
      hora_fin_reserva: hora
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          onClick={() => backButton()}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl bg-white shadow-lg hover:shadow-xl transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </motion.button>
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Nueva reserva</h2>
      </div>

      <AnimatePresence mode="wait">

        {/* PASO 1: Selección de Club */}
        {paso === 1 && (
          <motion.div
            key="paso1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-gray-700 mb-2 font-medium text-lg">Selecciona un club</h3>
            <div className="grid grid-cols-1 gap-4">
              {clubsData.map((club, idx) => (
                <motion.div
                  key={club.nombre}
                  whileHover={{ scale: 1.05, y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.1, type: 'spring', stiffness: 120, damping: 20 }}
                  onClick={() => { handleClickClub(club) }}
                  className="relative rounded-3xl overflow-hidden h-44 shadow-lg cursor-pointer"
                >
                  <img
                    src={club.imagen}
                    alt={club.nombre}
                    className="w-full h-full object-cover rounded-3xl transform transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/25 backdrop-blur-md flex items-center justify-center rounded-3xl">
                    <p className="text-white font-bold text-xl tracking-wide drop-shadow-md">{club.nombre}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PASO 2: Selección Cancha, Fecha y Hora */}
        {paso === 2 && (
          <motion.div
            key="paso2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-gray-700 font-medium mb-4 text-lg">{clubSeleccionado.nombre} — elige cancha, fecha y hora</h3>

            {/* Fecha */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Fecha</p>
              <input
                type="date"
                value={fecha}
                onChange={(e) => handleChangeFecha(e.target.value)}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Hora inicio */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Hora inicio</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {horarios.map((h) => (
                  <motion.button
                    key={h}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-3 rounded-2xl shadow-lg border transition-all duration-300 font-medium ${
                      horaInicio === h
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl'
                        : 'bg-white text-gray-800 border-gray-200 hover:shadow-md'
                    }`}
                    onClick={() => { handleChangeHoraInicio(h) }}
                  >
                    {h}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Hora fin */}
            {horaInicio && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Hora fin</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {horarios
                    .filter((h, i) => i > horarios.indexOf(horaInicio) && (i - horarios.indexOf(horaInicio)) >= 2)
                    .map((h) => (
                      <motion.button
                        key={h}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-3 rounded-2xl shadow-lg border transition-all duration-300 font-medium ${
                          horaFin === h
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xl'
                            : 'bg-white text-gray-800 border-gray-200 hover:shadow-md'
                        }`}
                        onClick={() => handleChangeHoraFin(h)}
                      >
                        {h}
                      </motion.button>
                    ))}
                </div>
              </div>
            )}

            {/* Canchas */}
            {horaFin && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Cancha</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {canchas.map((c) => (
                    <motion.button
                      key={c.nombre}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-3 rounded-2xl shadow-lg border transition-all duration-300 font-medium ${
                        canchaSeleccionada?.id === c.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xl'
                          : 'bg-white text-gray-800 border-gray-200 hover:shadow-md'
                      }`}
                      onClick={() => setCanchaSeleccionada(c)}
                    >
                      {c.nombre}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

              {canchaSeleccionada && horaInicio && horaFin && (
                <motion.button
                  onClick={() => setPaso(3)}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-2xl mt-4 text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  Siguiente: Resumen
                </motion.button>
              )}
            </motion.div>
        )}

        {/* PASO 3: Checkout / Resumen + Método de pago estilo iOS integrado */}
{paso === 3 && (
  <motion.div
    key="paso3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="space-y-6 pb-24"
  >
    {/* Resumen */}
    <div className="p-5 rounded-xl bg-white/90 backdrop-blur-sm space-y-2">
      <p className="text-gray-800 font-semibold text-lg">Resumen de tu reserva</p>
      <div className="text-gray-700 space-y-1">
        <p><span className="font-medium">Club:</span> {clubSeleccionado.nombre}</p>
        <p><span className="font-medium">Cancha:</span> {canchaSeleccionada.nombre}</p>
        <p><span className="font-medium">Fecha:</span> {dayjs(fecha).format('DD/MM/YYYY')}</p>
        <p><span className="font-medium">Horario:</span> {horaInicio} - {horaFin}</p>
        <p><span className="font-medium">Total:</span> ${total}</p>
      </div>
    </div>

    {/* Método de pago estilo iOS animado */}
    <div className="p-5 rounded-xl bg-white/90 backdrop-blur-sm space-y-3">
    <p className="text-gray-800 font-bold text-lg">Elige tu método de pago</p>
    <p className="text-gray-500 text-sm">Selecciona cómo deseas pagar tu reserva</p>

    <div className="flex flex-col gap-3 mt-2">
        {['Efectivo', 'Tarjeta', 'Transferencia'].map((metodo) => (
        <motion.button
            key={metodo}
            onClick={() => setMetodoPago(metodo)}
            whileTap={{ scale: 0.97 }}
            animate={{
            backgroundColor: metodoPago === metodo ? "#2563EB" : "#F3F4F6",
            color: metodoPago === metodo ? "#ffffff" : "#1F2937",
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex items-center justify-between px-4 py-4 rounded-xl font-medium"
        >
            <div className="flex items-center gap-3">
            {metodo === 'Efectivo' && <DollarSign className="w-5 h-5" />}
            {metodo === 'Tarjeta' && <CreditCard className="w-5 h-5" />}
            {metodo === 'Transferencia' && <DollarSign className="w-5 h-5" />}
            <span>{metodo}</span>
            </div>

            <AnimatePresence>
            {metodoPago === metodo && (
                <motion.svg
                key="check"
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </motion.svg>
            )}
            </AnimatePresence>
        </motion.button>
        ))}
    </div>
    </div>


    {/* Botón fijo abajo */}
    {metodoPago && (
      <motion.div
        className="fixed bottom-4 left-0 w-full px-4 md:px-0 flex justify-center z-50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button
          onClick={handleConfirmar}
          whileTap={{ scale: 0.97 }}
          className="w-full max-w-md py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
        >
          Confirmar reserva
        </motion.button>
      </motion.div>
    )}
  </motion.div>
)}



        {/* PASO 4: Confirmación final */}
        {paso === 4 && (
          <motion.div
            key="paso4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4"
          >
            <CheckCircle2 className="w-28 h-28 text-green-500 mb-2 animate-pulse" />
            <h3 className="text-3xl font-semibold text-gray-800">¡Reserva confirmada!</h3>
            <p className="text-gray-500 text-lg">
              {clubSeleccionado.nombre}, {canchaSeleccionada.nombre}, {horaInicio} - {horaFin}
            </p>
            <p className="text-gray-700 font-medium text-lg">Método de pago: {metodoPago}</p>
            <a onClick={() => navigate('/home')} className="text-blue-600 underline mt-2 cursor-pointer">Ir al home</a>
          </motion.div>
        )}

      </AnimatePresence>

      {isLoading() && <Loading />}
    </div>
  )
}
