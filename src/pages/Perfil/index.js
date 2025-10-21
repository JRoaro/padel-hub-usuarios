import React, { useState } from "react";
import { User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";

import Perfil from "/Users/juanj/padel-hub-usuarios/src/assets/img/pala_1.png";

export default function PerfilUsuario() {

  const [usuario] = useState({
    nombre: 'Juan Jose Roaro',
    direccion: 'Ciudad Obregón, Sonora',
    categoria: '5ta fuerza',
    foto: Perfil,
    nivel: "Intermedio",
    victorias: 42,
    partidosJugados: 60,
    porcentajeVictorias: 70,
    manoDominante: "Derecha",
    posicion: "Drive",
    golpeFavorito: "Smash",
    frecuencia: "3 veces por semana",
    estiloJuego: "Agresivo",
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
    { icon: "✋", title: "Mano dominante", value: usuario.manoDominante, color: "text-yellow-500" },
    { icon: "🎾", title: "Posición", value: usuario.posicion, color: "text-blue-500" },
    { icon: "💥", title: "Golpe favorito", value: usuario.golpeFavorito, color: "text-red-500" },
    { icon: "📅", title: "Frecuencia", value: usuario.frecuencia, color: "text-green-500" },
    { icon: "⚡", title: "Estilo de juego", value: usuario.estiloJuego, color: "text-purple-500" },
  ];

  const dataPie = [
    { name: "Victorias", value: usuario.porcentajeVictorias },
    { name: "Derrotas", value: 100 - usuario.porcentajeVictorias }
  ];
  const COLORS = ["#FACC15", "#E5E7EB"];

  return (
    <div className="relative bg-white min-h-screen p-5 flex flex-col items-center space-y-6 overflow-x-hidden">

      {/* FOTO DE PERFIL */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-28 h-28 rounded-full bg-white backdrop-blur-lg flex items-center justify-center overflow-hidden shadow-2xl border border-white/30"
      >
        {usuario.foto ? (
          <img src={usuario.foto} alt="Foto perfil" className="w-full h-full object-cover rounded-full" />
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
        <h2 className="text-2xl font-bold text-gray-900">{usuario.nombre}</h2>
        <p className="text-gray-500 text-sm">Categoría: {usuario.categoria}</p>
        <p className="text-gray-500 text-sm">{usuario.nivel}</p>
      </motion.div>

      {/* ESTADÍSTICAS PIE + BARRAS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full p-5 bg-white rounded-3xl shadow-xl space-y-4 border border-white/20"
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

      {/* PREFERENCIAS CARRUSEL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Preferencias</h3>
        <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory px-4 -mx-4">
          {preferencias.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-shrink-0 w-36 p-5 bg-white backdrop-blur-lg rounded-3xl shadow-xl flex flex-col items-center justify-center snap-center border border-white/20"
            >
              <span className={`text-3xl mb-2 ${p.color}`}>{p.icon}</span>
              <span className="text-sm text-gray-500">{p.title}</span>
              <span className="font-semibold text-gray-900 mt-1 text-center">{p.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* LOGROS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full p-5 bg-white rounded-3xl shadow-xl space-y-2 border border-white/20"
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
  )
}
