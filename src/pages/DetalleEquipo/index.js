import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Plus,
  Users,
  ChevronRight,
  Share,
  ExternalLink,
  Trash2,
  CheckCircle,
  Info,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import TorneosRepository from '../../network/TorneosRepository';
import BackButton from '../../components/BackButton';

export default function DetalleEquipo() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('team') || 'T-1245';

  const localEquipo = location.state
  const hash = localEquipo?.hash ?? searchParams.get('codigo');
  const { data: equipoData, refetch } = useQuery({
    queryKey: ['equipo'],
    queryFn: () => TorneosRepository.getDetalleEquipoTorneo(hash),
  })

  const equipo = equipoData?.equipo ?? localEquipo 
  const limiteParticipantesEquipo = equipo?.limite_participantes_equipo ?? 1

  const abandonarEquipoMutation = useMutation({
    mutationFn: async () => TorneosRepository.abandonarEquipoTorneo(equipo?.hash),
    onSuccess: (data) => {
      if (!data || !data.success) {
        toast.error(data.message || "Ocurrió un error al abandonar el equipo");
        return
      }

      toast('Has salido del equipo', { icon: '🚪' });
      navigate('/torneos');
    },
    onError: () => toast.error("Ocurrió un error al abandonar el equipo"),
  })

  const [team, setTeam] = useState({
    id: teamId,
    nombre: 'Mi Equipo Perrón',
    logo: null,
    torneo: {
      id: 'TOR-2025-09',
      nombre: 'Rivals Cup 2025',
      modalidad: 'Eliminación directa',
      formato: 'Bo3',
      plataforma: 'Presencial',
      fecha_inicio: '2025-12-01',
    },
    estado: 'Inscrito', // Inscrito | En espera | Eliminado | Activo
    seed: 12,
    grupo: 'B',
    codigo_invitacion: 'ABX92K',
    creado_por: 'Juan Jose',
    verificado: true,
    miembros: [
      { id: 1, nombre: 'Juan', role: 'Capitán', estado: 'Confirmado', pais: 'MX' },
      { id: 2, nombre: 'Carlos', role: 'Jugador', estado: 'Confirmado', pais: 'MX' },
      { id: 3, nombre: 'Pedro', role: 'Suplente', estado: 'Pendiente', pais: 'AR' },
    ],
    historial: [
      { id: 1, vs: 'Team Rayo', resultado: 'G', fecha: '2025-11-01' },
      { id: 2, vs: 'Los Mac', resultado: 'P', fecha: '2025-10-28' },
    ],
    siguiente_partido: {
      rival: 'Team Rayo',
      fecha: '2025-12-03',
      hora: '18:00',
      cancha: 'Cancha 3',
      confirmado: false,
    },
    avisos: [
      'Check-in obligatorio 30 min antes de tu primer partido.',
      'Sube identificación para validar tu equipo.',
    ],
  });

  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleBack = () => navigate(-1);

  const onPickLogo = () => fileRef.current?.click();
  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      // simula upload
      await new Promise((r) => setTimeout(r, 900));
      const url = URL.createObjectURL(f);
      setTeam((t) => ({ ...t, logo: url }));
      toast.success('Logo actualizado');
    } catch (err) {
      toast.error('Error subiendo logo');
    } finally {
      setUploading(false);
    }
  };

  const copyTeamCode = async () => {
    try {
      await navigator.clipboard.writeText(equipo?.hash);
      toast.success('Código copiado');
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const handleInvite = () => {
    // abrir modal de invitar o generar link
    const url = window.location.origin;
    navigator.clipboard.writeText(`${url}/invitacion?codigo=${equipo?.hash}`);
    toast.success("¡Invitación copiada al portapapeles!");
  };

  const handleLeave = () => setShowLeaveConfirm(true);
  const confirmLeave = () => {
    setShowLeaveConfirm(false);
    abandonarEquipoMutation.mutate()
  };

  const getCreadorEquipo = () => equipo ? equipo.usuarios[0] : null;

  const sectionClass = 'bg-white/60 backdrop-blur-[18px] rounded-2xl p-3 border border-white/20';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-safe pt-4 px-4 sm:px-6">
      <div className="pt-safe" />

      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <BackButton />

        <div className="flex-1 text-center">
          <div className="text-xs text-gray-500">Torneo</div>
          <div className="text-sm font-semibold text-gray-900 truncate">{team.torneo.nombre}</div>
        </div>

        <div className="w-10" />
      </div>

      {/* TEAM CARD  */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="bg-white/50 backdrop-blur-[22px] rounded-3xl border border-white/15 p-4 shadow-[0_8px_30px_rgba(2,6,23,0.06)] mb-4"
      >
        <div className="flex items-start gap-4">
          {/* logo */}
          <div className="relative flex-shrink-0">
            <div className={`w-20 h-20 rounded-full overflow-hidden border ${true ? 'ring-2 ring-green-300' : 'ring-0'}`}>
              {<img src={equipo?.imagen} alt="logo equipo" className="w-full h-full object-cover" />}
            </div>

            <button
              onClick={onPickLogo}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-white/85 backdrop-blur border border-white/20 shadow-sm"
              aria-label="Editar logo"
            >
              {uploading ? <div className="w-4 h-4 rounded-full animate-pulse bg-gray-300" /> : <Camera className="h-4 w-4 text-gray-700" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 truncate">{equipo?.nombre}</h2>
              {team.verificado && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>

            <p className="text-xs text-gray-500 mt-1 truncate">Creado por {getCreadorEquipo()?.nombre}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {/* TODO: faltan estos datos */}
              <span className="px-2 py-1 text-xs rounded-full bg-white/30 border border-white/10">Estado: Inscrito</span>
              <span className="px-2 py-1 text-xs rounded-full bg-white/30 border border-white/10">Grupo: B</span>
              <span className="px-2 py-1 text-xs rounded-full bg-white/30 border border-white/10">Seed: #2</span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button onClick={handleInvite} className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-500 text-white text-sm shadow-sm">
                <Plus className="h-4 w-4" /> Invitar
              </button>

              <div className="flex items-center gap-2 bg-white/30 p-2 rounded-xl border border-white/10">
                <div className="font-mono text-sm">{equipo?.hash}</div>
                <button onClick={copyTeamCode} className="p-2 rounded-full bg-white/70" aria-label="Copiar código">
                  <Share className="h-4 w-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* miembros - roles y estado */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }} className={`${sectionClass} rounded-3xl p-4 mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-gray-900">Integrantes ({equipo?.usuarios.length})</div>
          <div className="text-xs text-gray-500">Roles y estado</div>
        </div>

        <div className="space-y-2">
          {equipo?.usuarios.map((usuario, index) => (
            <div key={usuario.id} className="flex items-center justify-between p-2 rounded-xl bg-white/30 border border-white/8">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center text-gray-800 font-semibold">{usuario.nombre[0]}</div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{usuario.nombre} {usuario.apellido}</div>
                  <div className="text-xs text-gray-500 truncate">{index === 0 ? "Capitán" : "Jugador"}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* TODO: de momento todos los usuarios son confirmados */}
                <div className={`text-xs px-2 py-1 rounded-full ${true ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>Confirmado</div>
                <button className="p-2 rounded-full bg-white/60" onClick={() => navigate(`/perfil?id=${usuario.id}`)} aria-label={`Ver perfil ${usuario.nombre}`}>
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {equipo?.usuarios.length < limiteParticipantesEquipo && (
          <div className="mt-3 text-xs text-gray-600">
            Equipo incompleto: faltan {limiteParticipantesEquipo - equipo?.usuarios.length} jugadores para completar.
          </div>
        )}
      </motion.div>

      <div className="space-y-3 mb-4">

        {/* siguiente partidow preview */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`${sectionClass} flex items-center justify-between`}>
          <div>
            <div className="text-xs text-gray-500">Siguiente partido</div>
            <div className="text-sm font-semibold text-gray-900 truncate">vs {team.siguiente_partido.rival}</div>
            <div className="text-xs text-gray-500 mt-1">{team.siguiente_partido.fecha} · {team.siguiente_partido.hora}</div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className={`text-xs font-medium ${team.siguiente_partido.confirmado ? 'text-green-600' : 'text-yellow-600'}`}>
              {team.siguiente_partido.confirmado ? 'Confirmado' : 'Pendiente'}
            </div>
            <button onClick={() => navigate('/detallePartido', { state: { partido: team.siguiente_partido } })} className="p-2 rounded-full bg-white/60">
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </motion.div>

        {/* historial corto */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className={`${sectionClass}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-900">Historial reciente</div>
            <button className="text-xs text-gray-500" onClick={() => navigate('/historial', { state: { teamId: team.id } })}>Ver todo</button>
          </div>

          <div className="space-y-2">
            {team.historial.slice(0, 3).map(h => (
              <div key={h.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${h.resultado === 'G' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className="text-sm font-bold">{h.resultado}</span>
                  </div>
                  <div className="text-gray-800 truncate">{h.vs}</div>
                </div>
                <div className="text-xs text-gray-500">{h.fecha}</div>
              </div>
            ))}
          </div>
        </motion.div>

        
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => navigate('/detalleTorneo?id=' + equipo?.torneo.id)} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/60 border border-white/10">
            <ExternalLink className="h-5 w-5 text-gray-700" />
            <div className="text-xs text-gray-700">Torneo</div>
          </button>

          <button onClick={() => navigate('/detallePartido', { state: { partido: team.siguiente_partido } })} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/60 border border-white/10">
            <ChevronRight className="h-5 w-5 text-gray-700" />
            <div className="text-xs text-gray-700">Partido</div>
          </button>

          <button onClick={() => navigate('/brackets', { state: { torneoId: team.torneo.id } })} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/60 border border-white/10">
            <Users className="h-5 w-5 text-gray-700" />
            <div className="text-xs text-gray-700">Brackets</div>
          </button>
        </div>
      </div>

      {/* reglas rapidas y avisos */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.26 }} className="space-y-3 mb-6">
        <div className={`${sectionClass}`}>
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-gray-700" />
            <div className="text-sm font-semibold text-gray-900">Reglas rápidas</div>
          </div>
          <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
            <li>Formato: {team.torneo.formato}</li>
            <li>Check-in: 30 minutos antes</li>
            <li>Modalidad: {team.torneo.modalidad}</li>
          </ul>
        </div>

        <div className={`${sectionClass.replace('p-3', 'p-3')} bg-white/50`}>
          <div className="text-sm font-semibold text-gray-900 mb-2">Avisos del organizador</div>
          <div className="text-xs text-gray-600 space-y-1">
            {team.avisos.map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="text-yellow-500">•</div>
                <div className="truncate">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* acciones criticas */}
      <div className="space-y-3">
        <button onClick={() => navigate('/editarEquipo', { state: { team } })} className="w-full py-3 rounded-xl bg-white/80 border border-white/15 shadow-sm">
          Editar equipo
        </button>

        <button onClick={() => navigate('/reportar', { state: { teamId: team.id } })} className="w-full py-3 rounded-xl bg-white/80 border border-white/15 text-sm">
          Reportar incidencia
        </button>

        <button onClick={handleLeave} className="w-full py-3 rounded-xl bg-red-50 border border-red-200 text-red-600">Salir del equipo</button>
      </div>

      {/* leave confirm modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} className="bg-white rounded-t-3xl p-4 w-full max-w-md">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">¿Salir del equipo?</div>
              <div className="text-sm text-gray-500 mb-4">Si sales, dejarás de estar inscrito con este equipo para el torneo.</div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setShowLeaveConfirm(false)} className="px-4 py-2 rounded-2xl bg-white/60">Cancelar</button>
                <button onClick={confirmLeave} className="px-4 py-2 rounded-2xl bg-red-500 text-white">Salir</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
