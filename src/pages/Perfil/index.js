import React, { useState, useEffect } from "react";
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalUser, setLocalUser } from "../../utils/utils";
import UsuariosRepository from '../../network/UsuariosRepository';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import deleteLocalUser from '../../utils/utils';

import Perfil from "../../assets/img/pala_1.png";
import Loading from '../../components/Loading';

export default function PerfilUsuario() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  useEffect(() => {
    setUser(getLocalUser())
  }, [])

  // Variable vieja con info por definir
  const [usuario] = useState({
    logros: [
      { nombre: "Torneo local ganador", color: "#FFD700" },
      { nombre: "Ranking club: #C0C0C0" },
      { nombre: "Desafío completado: 50 partidos", color: "#CD7F32" }
    ],
    rendimientoMensual: [
      { mes: "Ene", ganados: 3 },
      { mes: "Feb", ganados: 5 },
      { mes: "Mar", ganados: 4 },
      { mes: "Abr", ganados: 6 },
      { mes: "May", ganados: 5 },
      { mes: "Jun", ganados: 4 },
    ]
  });

  const preferencias = [
    { icon: "✋", title: "Mano dominante", value: user?.mano_dominante, color: "text-yellow-500" },
    { icon: "🎾", title: "Posición", value: user?.posicion, color: "text-blue-500" },
    { icon: "💥", title: "Golpe favorito", value: user?.golpe_favorito, color: "text-red-500" },
    { icon: "📅", title: "Frecuencia", value: user?.frecuencia_padel, color: "text-green-500" },
    { icon: "⚡", title: "Estilo de juego", value: user?.estilo_juego, color: "text-purple-500" },
  ];

  const dataPie = [
    { name: "Victorias", value: usuario.porcentajeVictorias },
    { name: "Derrotas", value: 100 - usuario.porcentajeVictorias }
  ];
  const COLORS = ["#FACC15", "#E5E7EB"];

  const { status, data, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      return UsuariosRepository.getPerfil()
    },
  })

  if (status === "success" && lastUpdatedAt !== dataUpdatedAt) {
    setLastUpdatedAt(dataUpdatedAt);
    setUser(data.usuario)
    setLocalUser(data.usuario)
  }

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return UsuariosRepository.logout()
    },
    onSuccess: (data) => {
      if (data && data.success) {
        deleteLocalUser()
        navigate('/')
        return 
      } 

      const message = data.message || "Ocurrió un error al intentar el logout";
      toast.error(message);
    },
    onError: () => {
      toast.error("Ocurrió un error al intentar el logout");
    }
  })

  const logout = () => {
    logoutMutation.mutate()
  }

  return (
    <div className="relative bg-white min-h-screen flex flex-col items-center space-y-6 overflow-x-hidden py-5">

      {/* ICONO CONFIGURACION ARRIBA DERECHA */}
      <button
        onClick={() => navigate('/configuracion')}
        className="absolute top-5 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md hover:bg-white transition"
      >
        <Settings className="h-6 w-6 text-gray-700" />
      </button>

      {/* Boton logout arriba izquierda */}
      <button
        onClick={() => { logout() }}
        className="absolute top-5 left-4 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md hover:bg-white transition mt-0"
      >
        <LogOut className="h-6 w-6 text-gray-700" />
      </button>

      {/* FOTO DE PERFIL */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-28 h-28 rounded-full bg-white backdrop-blur-lg flex items-center justify-center overflow-hidden shadow-lg border border-white/30"
      >
        {user?.foto ? (
          <img src={user?.foto} alt="Foto perfil" className="w-full h-full object-cover rounded-full" />
        ) : (
          <User className="h-12 w-12 text-gray-400" />
        )}
      </motion.div>

      {/* NOMBRE, CATEGORÍA, NIVEL */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-bold text-gray-900">{user?.nombre} {user?.apellido}</h2>
        <p className="text-gray-500 text-sm">Categoría: {user?.categoria}</p>
      </motion.div>

      <div className="w-full px-4">
        {/* ESTADÍSTICAS PIE + BARRAS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full p-5 bg-white rounded-3xl shadow-md space-y-4 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Estadísticas</h3>
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-sm">Victorias</span>
              <span className="font-semibold text-gray-900 text-lg">{usuario.victorias}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-sm">Partidos</span>
              <span className="font-semibold text-gray-900 text-lg">{usuario.partidosJugados}</span>
            </div>
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPie}
                    innerRadius={28}
                    outerRadius={36}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <span className="text-xs text-gray-500 text-center mt-1">{usuario.porcentajeVictorias}% victorias</span>
            </div>
          </div>

          {/* BARRAS MENSUALES */}
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={usuario.rendimientoMensual}>
                <XAxis dataKey="mes" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="ganados" fill="#34D399" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* PREFERENCIAS CARRUSEL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full "
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3 px-4">Preferencias</h3>
        <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory px-4 py-2 -my-2">
          {preferencias.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-shrink-0 w-36 p-5 bg-white backdrop-blur-lg rounded-3xl shadow-md flex flex-col items-center justify-center snap-center border border-white/20"
            >
              <span className={`text-3xl mb-2 ${p.color}`}>{p.icon}</span>
              <span className="text-sm text-gray-500">{p.title}</span>
              <span className="font-semibold text-gray-900 mt-1 text-center">{p.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="w-full px-4">
        {/* LOGROS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full p-5 bg-white rounded-3xl shadow-md space-y-2 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Logros</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {usuario.logros.map((l, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-semibold text-gray-900"
                style={{ backgroundColor: l.color || "#E5E7EB" }}
              >
                {l.nombre}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Animación Loading → Success */}
      {isFetching && (
        <Loading />
      )}

    </div>
  )
}
