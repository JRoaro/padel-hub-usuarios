import React, { useState, useEffect } from "react";
import { User, Settings, LogOut, Trophy, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { getLocalUser, setLocalUser } from "../../utils/utils";
import UsuariosRepository from '../../network/UsuariosRepository';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import deleteLocalUser from '../../utils/utils';
import Loading from '../../components/Loading';

export default function PerfilUsuario() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  useEffect(() => {
    setUser(getLocalUser());
  }, []);

  const { status, data, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['user'],
    queryFn: () => UsuariosRepository.getPerfil(),
  });

  if (status === "success" && lastUpdatedAt !== dataUpdatedAt) {
    setLastUpdatedAt(dataUpdatedAt);
    setUser(data.usuario);
    setLocalUser(data.usuario);
  }

  const logoutMutation = useMutation({
    mutationFn: async () => UsuariosRepository.logout(),
    onSuccess: (data) => {
      if (data && data.success) {
        deleteLocalUser();
        navigate('/');
        return;
      }
      toast.error(data.message || "Ocurrió un error al cerrar sesión");
    },
    onError: () => toast.error("Ocurrió un error al cerrar sesión"),
  });

  const logout = () => logoutMutation.mutate();

  const preferencias = [
    { icon: "✋", title: "Mano dominante", value: user?.mano_dominante, color: "text-yellow-500" },
    { icon: "🎾", title: "Posición", value: user?.posicion, color: "text-blue-500" },
    { icon: "💥", title: "Golpe favorito", value: user?.golpe_favorito, color: "text-red-500" },
    { icon: "📅", title: "Frecuencia", value: user?.frecuencia_padel, color: "text-green-500" },
    { icon: "⚡", title: "Estilo de juego", value: user?.estilo_juego, color: "text-purple-500" },
  ];

  const rendimientoMensual = [
    { mes: "Ene", ganados: 3 },
    { mes: "Feb", ganados: 5 },
    { mes: "Mar", ganados: 4 },
    { mes: "Abr", ganados: 6 },
    { mes: "May", ganados: 5 },
    { mes: "Jun", ganados: 4 },
  ];

  const estadisticasTorneos = [
    { label: "Torneos Jugados", value: 12, icon: <BarChart3 className="h-5 w-5 text-blue-500" /> },
    { label: "Torneos Ganados", value: 4, icon: <Trophy className="h-5 w-5 text-yellow-500" /> },
    { label: "Mejor Posición", value: "1er Lugar", icon: <Trophy className="h-5 w-5 text-green-500" /> },
  ];

  const dataPie = [
    { name: "Victorias", value: 68 },
    { name: "Derrotas", value: 32 },
  ];
  const COLORS = ["#FACC15", "#E5E7EB"];

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white min-h-screen flex flex-col items-center space-y-8 overflow-x-hidden py-5">

      {/* Botones superiores */}
      <button
        onClick={() => navigate('/configuracion')}
        className="absolute top-5 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <Settings className="h-6 w-6 text-gray-700" />
      </button>

      <button
        onClick={logout}
        className="absolute top-5 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <LogOut className="h-6 w-6 text-gray-700" />
      </button>

      {/* Foto */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200"
      >
        {user?.foto ? (
          <img src={user?.foto} alt="Foto perfil" className="w-full h-full object-cover rounded-full" />
        ) : (
          <User className="h-12 w-12 text-gray-400" />
        )}
      </motion.div>

      {/* Nombre */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-bold text-gray-900">{user?.nombre} {user?.apellido}</h2>
        <p className="text-gray-500 text-sm">Categoría: {user?.categoria}</p>
        {user?.logro_preferido && (
          <div className="flex justify-center mt-2">
            <span
              className="px-4 py-1 rounded-full text-sm font-semibold"
              style={{ backgroundColor: user.logro_preferido.color || "#E5E7EB" }}
            >
              {user.logro_preferido.icono} {user.logro_preferido.nombre}
            </span>
          </div>
        )}
      </motion.div>

      {/* Estadísticas generales */}
      <section className="w-[90%] max-w-md space-y-6">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm">Victorias</span>
            <span className="font-semibold text-gray-900 text-lg">68</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm">Partidos</span>
            <span className="font-semibold text-gray-900 text-lg">100</span>
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
            <span className="text-xs text-gray-500 text-center mt-1 block">68% victorias</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={rendimientoMensual}>
            <XAxis dataKey="mes" tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="ganados" fill="#34D399" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Torneos */}
      <section className="w-[90%] max-w-md space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Torneos
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          {estadisticasTorneos.map((t, i) => (
            <div key={i} className="flex flex-col items-center justify-center">
              {t.icon}
              <span className="text-sm text-gray-500">{t.label}</span>
              <span className="font-bold text-gray-900 text-lg">{t.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Preferencias */}
      <section className="w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 px-4">Preferencias</h3>
        <div className="flex overflow-x-auto gap-4 px-4">
          {preferencias.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 w-36 p-4 flex flex-col items-center justify-center snap-center"
            >
              <span className={`text-3xl mb-1 ${p.color}`}>{p.icon}</span>
              <span className="text-sm text-gray-500">{p.title}</span>
              <span className="font-semibold text-gray-900 text-center">{p.value}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {isFetching && <Loading />}
    </div>
  );
}
