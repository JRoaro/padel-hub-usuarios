import React from "react";
import {
  ArrowLeft,
  Users,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TorneosRepository from '../../network/TorneosRepository';
import Loading from "../../components/Loading";
import BackButton from "../../components/BackButton";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.locale('es')

export default function InvitacionEquipo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codigoEquipo = searchParams.get('codigo');

  const { data: equipoData, isFetching } = useQuery({
    queryKey: ['equipo', codigoEquipo],
    queryFn: () => TorneosRepository.getDetalleEquipoTorneo(codigoEquipo),
  })

  const equipo = equipoData?.equipo

  const unirseEquipoMutation = useMutation({
    mutationFn: async () => TorneosRepository.unirseEquipoTorneo(codigoEquipo),
    onSuccess: (data) => {
      if (!data || !data.success) {
        toast.error(data.message || "Ocurrió un error al unirte al equipo");
        return
      }

      toast.success("¡Te has unido al equipo!")
      navigate("/detalleEquipo?codigo=" + equipo.hash)
    },
    onError: () => toast.error("Ocurrió un error al unirte al equipo"),
  })

  const isLoading = () => isFetching || unirseEquipoMutation.isLoading

  const invitacion = {
    equipo: {
      nombre: "Team Obregón Elite",
      logo: "https://via.placeholder.com/200",
      integrantes: [
        { id: 1, nombre: "Carlos", rol: "Capitán" },
        { id: 2, nombre: "Juan", rol: "Jugador" },
        { id: 3, nombre: "Luis", rol: "Jugador" },
      ],
      cupos: "3/5",
      descripcion: "Equipo competitivo enfocado en torneos y scrims semanales.",
    },
    torneo: {
      nombre: "Rocket League Winter Cup",
      fecha: "12 Dic 2025",
    },
    invitadoPor: "Carlos",
    expiraEn: "24 horas",
  };

  const handleAceptar = () => {
    unirseEquipoMutation.mutate()
  };
  const handleRechazar = () => {
    navigate("/home")
  };

  return (
    <div className="min-h-screen relative pb-14 bg-gradient-to-b from-gray-100/40 to-gray-100/80">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-2xl"></div>

      <div className="relative z-10 p-4 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <BackButton />
          <p className="text-lg font-semibold text-gray-900">Invitación al equipo</p>
        </div>

        {/* Equipo Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 space-y-4 relative"
        >
          {/* Badge “Nuevo” */}
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Nuevo
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-2 relative">
            <motion.img
              src={equipo?.imagen}
              className="w-28 h-28 rounded-full border border-white object-cover"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </div>

          {/* Nombre e info */}
          <div className="text-center space-y-1">
            <p className="text-xl font-bold text-gray-900">{equipo?.nombre}</p>
            <p className="text-gray-600 text-sm">Fuiste invitado a unirte</p>
          </div>

          {/* Cupos */}
          <div className="flex justify-center">
            <span className="text-xs text-gray-700 bg-white/30 backdrop-blur px-3 py-1 rounded-full border border-white/20">
              Cupos: {equipo?.usuarios.length}/{equipo?.limite_participantes_equipo}
            </span>
          </div>
        </motion.div>

        {/* Información del torneo */}
        <div className="bg-white/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 space-y-2">
          <p className="text-gray-700 text-sm font-semibold">Torneo</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 text-sm font-medium">{equipo?.torneo.nombre}</p>
              <p className="text-gray-500 text-xs">Fecha: {dayjs.tz(equipo?.torneo.fecha_inicio).format('DD/MM/YYYY')}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* Integrantes */}
        <motion.div
        className="bg-white/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        >
        <p className="text-gray-700 text-sm font-semibold mb-3">Integrantes</p>

        <div className="flex space-x-4 overflow-x-auto py-1">
            {equipo?.usuarios.map((usuario, index) => (
            <motion.div
                key={usuario.id}
                className="flex flex-col items-center min-w-[60px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                delay: 0.1 * index, // efecto escalonado
                type: "spring",
                stiffness: 300,
                damping: 20,
                }}
            >
                {/* Avatar circular */}
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur flex items-center justify-center border border-white/20 text-gray-900 font-medium text-sm">
                {usuario.nombre[0]}
                </div>
                {/* Nombre y rol */}
                <p className="text-gray-900 text-xs mt-1 text-center truncate">{usuario.nombre}</p>
                <p className="text-gray-500 text-[10px] text-center">{index === 0 ? "Capitán" : "Jugador"}</p>
            </motion.div>
            ))}
        </div>
        </motion.div>

        {/* Botones */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleAceptar}
            className="w-full py-3 bg-blue-500 text-white rounded-full text-sm font-medium active:scale-95 transition"
          >
            Aceptar invitación
          </button>

          <button
            onClick={handleRechazar}
            className="w-full py-3 text-red-600 text-sm font-medium active:scale-95"
          >
            Rechazar
          </button>
        </div>
      </div>

      {isLoading() && <Loading />}
    </div>
  );
}
