import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, CreditCard, Trophy, Droplets, ShieldCheck, Wallet, Banknote, CreditCard as CardIcon } from 'lucide-react';
import BackButton from '../../components/BackButton'
import TorneosRepository from '../../network/TorneosRepository'
import Loading from '../../components/Loading'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const ConfirmarEquipoTorneo = () => {
  const [equipo, setEquipo] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const costoInscripcion = 1000;
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = location.state || {};

  const unirseTorneoMutation = useMutation({
    mutationFn: async (data) => {
      return await TorneosRepository.unirseTorneo(id, data)
    },
    onSuccess: (data) => {
      if (!data || !data.success) {
        toast.error(data.message || "Ocurrió un error al unirte a al torneo");
        return
      }

      toast.success("¡Te has unido al torneo!")
      navigate('/EstatusEquipoTorneo', { state: { equipo, metodoPago } });
    },
    onError: () => toast.error("Ocurrió un error al unirte al torneo"),
  })

  const handleConfirmar = async () => {
    if (!equipo.trim() || !metodoPago) {
      return;
    }

    //Que rollo con esto?
    if (metodoPago === 'tarjeta') {
      try {
        const response = await fetch('http://localhost:4000/crear-preferencia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cantidad: costoInscripcion, equipo }),
        });
        const data = await response.json();
        window.location.href = data.init_point; // Abrir Mercado Pago
        return;
      } catch (error) {
        console.error('Error creando preferencia:', error);
        alert('No se pudo iniciar el pago. Intenta de nuevo.');
        return;
      }
    }

    unirseTorneoMutation.mutate({ nombre: equipo })
  };


  const metodos = [
    { id: 'efectivo', nombre: 'Efectivo', icono: Banknote, color: 'text-green-600' },
    { id: 'tarjeta', nombre: 'Tarjeta', icono: CardIcon, color: 'text-blue-600' },
    { id: 'transferencia', nombre: 'Transferencia', icono: Wallet, color: 'text-purple-600' },
  ];

  const isBotonActivo = equipo.trim() && metodoPago;

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-6 text-gray-800 relative">
      {/* Botón Volver */}
      <div className="w-full flex justify-between items-center">
        <BackButton />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center pb-10"
      >
        <h2 className="text-2xl font-bold">Confirmar Inscripción</h2>
        <p className="text-gray-500 text-sm">Registra tu equipo y elige tu método de pago</p>
      </motion.div>

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 rounded-2xl shadow-inner space-y-5 p-3"
      >
        {/* Nombre del equipo */}
        <div>
          <label className="text-sm text-gray-600 font-semibold">Nombre del equipo</label>
          <input
            type="text"
            placeholder="Ej. Los Smash Bros"
            value={equipo}
            onChange={(e) => setEquipo(e.target.value)}
            className="mt-2 w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>

        {/* Costo */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-2">
            <CreditCard className="text-blue-500" />
            <span className="font-medium">Costo de inscripción</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">${costoInscripcion} MXN</span>
        </div>

        {/* Métodos de pago */}
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-2">Método de pago</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {metodos.map((m) => (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setMetodoPago(m.id)}
                className={`flex flex-col items-center justify-center px-6 py-4 rounded-2xl shadow-md border transition-all duration-300 font-medium min-w-[110px] ${
                  metodoPago === m.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-800 border-gray-200 hover:shadow-md'
                }`}
              >
                <m.icono className={`mb-2 ${metodoPago === m.id ? 'text-white' : m.color}`} size={22} />
                <span className="text-sm font-medium">{m.nombre}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Beneficios */}
        <div className="mt-2">
          <p className="text-sm text-gray-600 font-semibold mb-2">Incluye</p>
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            className="space-y-2"
          >
            {[
              { icon: Trophy, text: 'Premios para los 3 primeros lugares' },
              { icon: Droplets, text: 'Hidratación incluida durante los partidos' },
              { icon: ShieldCheck, text: 'Seguro deportivo para los jugadores' },
            ].map((item, i) => (
              <motion.li
                key={i}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="flex items-center space-x-2 text-gray-700"
              >
                <item.icon className="text-green-500" size={18} />
                <span className="text-sm">{item.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* Botón Confirmar */}
      <motion.button
        whileHover={isBotonActivo ? { scale: 1.03 } : { scale: 1 }}
        whileTap={isBotonActivo ? { scale: 0.97 } : { scale: 1 }}
        onClick={handleConfirmar}
        disabled={!isBotonActivo || confirmado}
        className={`mt-6 w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center transition-all
          ${
            confirmado
              ? 'bg-gradient-to-r from-green-500 to-green-600'
              : isBotonActivo
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
              : 'bg-gray-300 cursor-not-allowed'
          }
        `}
      >
        {confirmado ? (
          <>
            <Users className="mr-2 animate-pulse" /> Confirmando...
          </>
        ) : (
          <>
            <Users className="mr-2" /> Confirmar registro
          </>
        )}
      </motion.button>
    </div>
  );
};


export default ConfirmarEquipoTorneo;
