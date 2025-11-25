import React, { useState, useEffect, useMemo } from "react";
import { User, Settings, LogOut, Trophy, BarChart3, Share } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { motion, useReducedMotion } from "framer-motion";
import { getLocalUser, setLocalUser } from "../../utils/utils";
import UsuariosRepository from '../../network/UsuariosRepository';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import deleteLocalUser from '../../utils/utils';
import Loading from '../../components/Loading';
import BackButton from "../../components/BackButton";

// Small UI helpers: Img, Skeletons and glass card/button
const Img = ({ src, alt = '', className = '', style = {} }) => (
  <img src={src ?? '/avatar-placeholder.png'} alt={alt} className={className} style={style} loading="lazy" decoding="async" />
);

const Skeleton = ({ h = 12, w = '100%', className = '' }) => (
  <div style={{ height: h }} className={`bg-white/20 rounded-2xl animate-pulse ${className}`} />
);

const GlassCard = ({ children, className = '', ...props }) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    className={`rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/20 shadow-[0_10px_30px_rgba(2,6,23,0.06)] p-4 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const GlassButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    className={`rounded-2xl px-3 py-2 font-medium bg-blue-500/85 text-white backdrop-blur-sm shadow-sm ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export default function PerfilUsuario() {
  const navigate = useNavigate();
  const location = useLocation();     // <<<<<< FIX ESLINT
  const [searchParams] = useSearchParams();

  const paramId = searchParams.get('id');
  const prefersReduced = useReducedMotion();

  const localUser = useMemo(() => getLocalUser(), []);
  const [user, setUser] = useState(localUser ?? null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const isMyProfile = !paramId || paramId === String(localUser?.id);

  const [headerSmall, setHeaderSmall] = useState(false);
  useEffect(() => {
    if (prefersReduced) return;
    const onScroll = () => setHeaderSmall(window.scrollY > 34);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [prefersReduced]);

  const { status, data, isFetching, dataUpdatedAt, isError, refetch } = useQuery({
    queryKey: ['user', paramId ?? localUser?.id],
    queryFn: () => UsuariosRepository.getPerfil(paramId ?? localUser?.id),
    enabled: Boolean(paramId ?? localUser?.id),
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    if (status === 'success' && data) {
      if (dataUpdatedAt && lastUpdatedAt !== dataUpdatedAt) setLastUpdatedAt(dataUpdatedAt);
      if (data.usuario) {
        setUser(data.usuario);
        if (isMyProfile) setLocalUser(data.usuario);
      }
    }
  }, [status, data, dataUpdatedAt, lastUpdatedAt, isMyProfile]);

  const logoutMutation = useMutation({
    mutationFn: async () => UsuariosRepository.logout(),
    onSuccess: (res) => {
      if (res?.success) {
        try { deleteLocalUser(); } catch {}
        navigate('/');
        toast.success('Sesión cerrada');
        return;
      }
      toast.error(res?.message || 'Error al cerrar sesión');
    },
    onError: () => toast.error('Error al cerrar sesión'),
  });

  const logout = () => {
    const ok = window.confirm('¿Seguro que quieres cerrar sesión?');
    if (!ok) return;
    logoutMutation.mutate();
  };

  const isLoading = isFetching || logoutMutation.isLoading;

  // sample data for charts (could come from API)
  const rendimientoMensual = useMemo(() => [
    { mes: 'Ene', ganados: 3 }, { mes: 'Feb', ganados: 5 }, { mes: 'Mar', ganados: 4 },
    { mes: 'Abr', ganados: 6 }, { mes: 'May', ganados: 5 }, { mes: 'Jun', ganados: 4 },
  ], []);

  const estadisticasTorneos = useMemo(() => [
    { label: 'Torneos Jugados', value: user?.estadisticas?.jugados ?? 12, icon: <BarChart3 className="h-5 w-5 text-blue-500" /> },
    { label: 'Torneos Ganados', value: user?.estadisticas?.ganados ?? 4, icon: <Trophy className="h-5 w-5 text-yellow-500" /> },
    { label: 'Mejor Posición', value: user?.estadisticas?.mejor_posicion ?? '1er Lugar', icon: <Trophy className="h-5 w-5 text-green-500" /> },
  ], [user]);

  const preferencias = useMemo(() => [
    { icon: '✋', title: 'Mano dominante', value: user?.mano_dominante ?? '—', color: 'text-yellow-500' },
    { icon: '🎾', title: 'Posición', value: user?.posicion ?? '—', color: 'text-blue-500' },
    { icon: '💥', title: 'Golpe favorito', value: user?.golpe_favorito ?? '—', color: 'text-red-500' },
    { icon: '📅', title: 'Frecuencia', value: user?.frecuencia_padel ?? '—', color: 'text-green-500' },
    { icon: '⚡', title: 'Estilo de juego', value: user?.estilo_juego ?? '—', color: 'text-purple-500' },
  ], [user]);

  const dataPie = useMemo(() => [
    { name: 'Victorias', value: user?.victorias ?? 68 },
    { name: 'Derrotas', value: user?.derrotas ?? 32 },
  ], [user]);

  const COLORS = ['#FACC15', '#E5E7EB'];

  const handleEdit = () => navigate('/configuracion');
  const handleBack = () => navigate(-1);

  const copyProfileLink = async () => {
    const id = user?.id;
    if (!id) {
      toast.error('Perfil no disponible');
      return;
    }

    const url = `${window.location.origin}/perfil?id=${id}`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success('Enlace de perfil copiado');
    } catch {
      toast.error('No se pudo copiar el enlace');
    }
  };

  const motionProps = (normal = {}, reduced = {}) =>
    prefersReduced ? reduced : normal;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-6">
        <GlassCard className="max-w-md w-full text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se pudo cargar el perfil</h3>
          <p className="text-sm text-gray-500 mb-4">Parece que hubo un problema al obtener los datos. Reintenta o revisa tu conexión.</p>
          <div className="flex gap-3 justify-center">
            <GlassButton onClick={() => refetch()}>Reintentar</GlassButton>
            <GlassButton onClick={() => navigate('/')}>Ir al inicio</GlassButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 px-4">

      {/* top controls */}
      <motion.div {...motionProps({ className: "flex items-center justify-between mb-4" })}>
        {isMyProfile ? (
          <>
            {/* IZQUIERDA: Logout */}
            <button
              onClick={logout}
              aria-label="Cerrar sesión"
              className="p-2 rounded-full bg-white/60 backdrop-blur border border-white/10"
              disabled={logoutMutation.isLoading}
            >
              <LogOut className="h-5 w-5 text-gray-700" />
            </button>

            {/* DERECHA: Share + Settings */}
            <div className="flex items-center gap-2">
              <button
                onClick={copyProfileLink}
                aria-label="Compartir perfil"
                className="p-2 rounded-full bg-white/60 backdrop-blur border border-white/10"
              >
                <Share className="h-5 w-5 text-gray-700" />
              </button>

              <button
                onClick={handleEdit}
                aria-label="Configuración"
                className="p-2 rounded-full bg-white/60 backdrop-blur border border-white/10"
              >
                <Settings className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleBack}
            aria-label="Volver"
            className="p-2 rounded-full bg-white/60 backdrop-blur border border-white/10"
          >
            <BackButton />
          </button>
        )}
      </motion.div>


      <div 
        className="text-xs text-gray-500 text-center mb-3" 
        aria-live="polite"
      >
        {isLoading ? 'Cargando...' : `Última actualización: ${lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString() : '-'}`}
      </div>


      {/* header */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
        animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center mb-4"
      >
        <div className={`w-28 h-28 rounded-full overflow-hidden border ${isMyProfile ? 'border-white/30' : 'border-white/20'} shadow-md`}>
          {isLoading ? (
            <div className="w-full h-full bg-white/20 animate-pulse" />
          ) : user?.foto ? (
            <Img src={user.foto} alt={`${user.nombre} ${user.apellido}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/20">
              <User className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="text-center mt-3">
          <motion.h2 animate={prefersReduced ? {} : { fontSize: headerSmall ? 18 : 22 }} className="text-2xl font-bold text-gray-900">
            {user?.nombre ?? '—'} {user?.apellido ?? ''}
          </motion.h2>
          <p className="text-gray-500 text-sm">Categoría: {user?.categoria ?? '—'}</p>

          {user?.logro_preferido && (
            <div className="mt-2">
              <span className="px-4 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: user.logro_preferido.color || '#E5E7EB' }}>
                {user.logro_preferido.icono} {user.logro_preferido.nombre}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* stats */}
      <GlassCard className="max-w-md mx-auto mb-4">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm">Victorias</span>
            <span className="font-semibold text-gray-900 text-lg">{user?.victorias ?? 0}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm">Partidos</span>
            <span className="font-semibold text-gray-900 text-lg">{user?.partidos ?? 0}</span>
          </div>

          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataPie} innerRadius={28} outerRadius={36} startAngle={90} endAngle={-270} dataKey="value">
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <span className="text-xs text-gray-500 text-center mt-1 block">
              {Math.round((dataPie[0].value / (dataPie[0].value + dataPie[1].value)) * 100) ?? 0}% victorias
            </span>
          </div>
        </div>

        <div className="mt-4">
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={rendimientoMensual} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="mes" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="ganados" fill="#34D399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* torneos */}
      <section className="max-w-md mx-auto mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5 text-yellow-500" /> Torneos
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

      {/* preferencias */}
      <section className="max-w-md mx-auto mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 px-1">Preferencias</h3>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {preferencias.map((p, i) => (
            <motion.div key={i} whileTap={{ scale: 0.97 }} className="flex-shrink-0 w-36 p-4 flex flex-col items-center justify-center rounded-2xl bg-white/60 backdrop-blur border border-white/20">
              <span className={`text-3xl mb-1 ${p.color}`}>{p.icon}</span>
              <span className="text-sm text-gray-500">{p.title}</span>
              <span className="font-semibold text-gray-900 text-center">{p.value}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {isLoading && (
        <div className="max-w-md mx-auto">
          <Loading />
        </div>
      )}

    </div>
  );
}
