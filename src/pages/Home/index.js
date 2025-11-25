import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CalendarDays, PlusCircle, Trophy, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { getLocalUser } from '../../utils/utils'
import ReservacionesRepository from '../../network/ReservacionesRepository'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../components/Loading'
import BadgeEstadoReservacion from '../../components/BadgeEstadoReservacion'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.locale('es')

const SkeletonRow = ({ height = 56, className = '' }) => (
  <div className={`animate-pulse bg-white/20 rounded-2xl ${className}`} style={{ height }} />
)

const SkeletonCarousel = ({ count = 4, w = 140, h = 120 }) => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex-none snap-start">
        <div className="rounded-2xl bg-white/20 backdrop-blur h-24 w-36" style={{ width: w, height: h }} />
      </div>
    ))}
  </div>
)

const IOSCard = ({ children, className = '', ...props }) => (
  <motion.div
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    className={`rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/20 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
)

const IOSButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    className={`rounded-2xl px-4 py-2 font-medium bg-blue-500/85 text-white backdrop-blur-sm ${className}`}
    {...props}
  >
    {children}
  </motion.button>
)

export default function HomeUsuarioPadel() {
  const navigate = useNavigate()
  const [diasSemana, setDiasSemana] = useState([])
  const [user, setUser] = useState(null)
  const [headerSmall, setHeaderSmall] = useState(false)

  useEffect(() => {
    const hoy = dayjs.tz()
    const dias = Array.from({ length: 7 }, (_, i) => hoy.add(i, 'day'))
    setDiasSemana(dias)

    // Obtener usuario
    setUser(getLocalUser())

    const onScroll = () => setHeaderSmall(window.scrollY > 28)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data: homeData, isFetching, isError, refetch } = useQuery({
    queryKey: ['home'],
    queryFn: () => ReservacionesRepository.getHomeData(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  const reservas = useMemo(() => homeData?.reservaciones ?? [], [homeData])
  const clubs = useMemo(() => homeData?.clubs ?? [], [homeData])
  const jugadoresRecientes = useMemo(() => homeData?.jugadores_recientes ?? [], [homeData])
  const torneos = useMemo(() => homeData?.torneos ?? [], [homeData])

  const handleNavigateDetalleReserva = useCallback((reservacion) => {
    navigate('/detalleReserva', { state: reservacion })
  }, [navigate])

  const Img = ({ src, alt, className = '', style = {} }) => (
    <img src={src ?? '/img-placeholder.png'} alt={alt ?? ''} className={className} loading="lazy" decoding="async" style={style} />
  )

  return (
    <div className="flex flex-col min-h-screen bg-gray-100/30 relative overflow-x-hidden">

      {/* HEADER */}
      <motion.header
        initial={{ paddingTop: 28, paddingBottom: 16 }}
        animate={{ paddingTop: headerSmall ? 8 : 28, paddingBottom: headerSmall ? 8 : 16 }}
        className="sticky top-0 z-50 px-4 backdrop-blur-2xl bg-white/50 border-b"
      >
        <div className="flex items-center gap-4 py-2">
          <div className="w-14 h-14 rounded-full overflow-hidden border">
            <Img src={user?.foto ?? '/avatar-placeholder.png'} alt={user?.nombre ?? 'Perfil'} className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] text-gray-600">{dayjs().format('dddd D MMM')}</p>
            <motion.h2 animate={{ fontSize: headerSmall ? 16 : 22 }} className="font-semibold text-gray-900 tracking-tight mt-0">Hola {user?.nombre ?? ''}</motion.h2>
          </div>
        </div>
      </motion.header>

      {/* CONTENIDO */}
      <div className="px-4">
        {/* NUEVA RESERVA */}
        <div className="mt-3">
          <IOSButton className="w-full flex items-center justify-center gap-2 text-[15px] py-3" onClick={() => navigate('/reservarCancha')} aria-label="Nueva reserva">
            <PlusCircle className="h-5 w-5" /> Nueva reserva
          </IOSButton>
        </div>

        {/* CALENDARIO HORIZONTAL */}
        <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {isFetching ? (
            <div className="flex gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="snap-start flex flex-col items-center px-3 py-2 rounded-2xl bg-white/20 w-14 h-14" />
              ))}
            </div>
          ) : (
            diasSemana.map((dia, idx) => {
              const hasReservacion = reservas.some(r => dayjs.tz(r.fecha_reserva).isSame(dia, 'day'))
              return (
                <div
                  key={idx}
                  className={`snap-start flex flex-col items-center px-3 py-2 rounded-2xl ${hasReservacion ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-900 border'}`}
                >
                  <span className="text-xs font-medium">{dia.format('ddd')}</span>
                  <span className="text-sm font-bold">{dia.format('D')}</span>
                </div>
              )
            })
          )}
        </div>

        {/* PRÓXIMAS RESERVAS */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-800 font-semibold mb-2 flex items-center gap-1 text-[15px]"><CalendarDays className="h-4 w-4" /> Próximas reservas</h3>
            {isError && (
              <button onClick={() => refetch()} className="text-xs text-gray-600 px-3 py-1 bg-white/60 rounded-full">Reintentar</button>
            )}
          </div>

          <AnimatePresence>
            {isFetching ? (
              <div className="space-y-3">{[1,2,3].map(i => <SkeletonRow key={i} height={72} />)}</div>
            ) : reservas.length > 0 ? reservas.map((reservacion, idx) => (
              <motion.div
                key={reservacion.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ delay: idx * 0.06, type: 'spring', stiffness: 300 }}
                className="mb-3"
              >
                <IOSCard className="p-4 flex items-center justify-between cursor-pointer" onClick={() => handleNavigateDetalleReserva(reservacion)} role="button" aria-label={`Ver reservación en ${reservacion.club?.nombre}`}>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 text-sm">{reservacion.club?.nombre} - {reservacion.cancha?.nombre}</span>
                    <span className="text-xs text-gray-500">{dayjs.tz(reservacion.fecha_reserva).format('DD MMM')} · {reservacion.hora_inicio_reserva}</span>
                  </div>
                  <div className="ml-4"><BadgeEstadoReservacion estado={reservacion.estado} /></div>
                </IOSCard>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-500 text-sm py-6">
                <span>No tienes reservaciones</span>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* TORNEOS */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 font-semibold text-[15px] flex items-center gap-2"><Trophy className="w-5 h-5 text-gray-700" /> Torneos y eventos</h3>
            <Link to="/torneos"><button className="text-xs text-gray-600 px-3 py-1 bg-white/60 rounded-full border">Ver todos</button></Link>
          </div>

          {isFetching ? (
            <SkeletonCarousel count={3} />
          ) : torneos.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3">
              {torneos.map((t) => (
                <motion.div key={t.id} className="snap-start w-60 flex-none" whileTap={{ scale: 0.97 }}>
                  <IOSCard onClick={() => navigate('/detalleTorneo', { state: t })} className="p-0 overflow-hidden rounded-3xl">
                    <div className="h-28 w-full overflow-hidden"><Img src={t.imagen} alt={t.nombre} className="w-full h-full object-cover" /></div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{t.nombre}</h4>
                      <p className="text-xs text-gray-600 line-clamp-1">{t.club?.nombre}</p>
                      <p className="text-[11px] text-gray-500">{dayjs.tz(t.fecha_inicio).format('DD MMM')} - {dayjs.tz(t.fecha_fin).format('DD MMM')}</p>
                      <div className="flex items-center gap-1 mt-1"><Users className="w-3 h-3 text-gray-400" /><p className="text-[11px] text-gray-500">{t.equipos_inscritos?.length ?? 0} inscritos</p></div>
                    </div>
                  </IOSCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-gray-500 text-sm">No hay torneos por ahora</div>
          )}
        </section>

        {/* JUGASTE RECIENTEMENTE */}
        <section className="mt-10">
          <h3 className="text-gray-900 font-semibold mb-4 text-[16px]">🎾 Jugaste recientemente con</h3>
          {isFetching ? (
            <SkeletonCarousel count={4} w={80} h={80} />
          ) : jugadoresRecientes.length === 0 ? (
            <p className="text-gray-500 text-sm">No has jugado con nadie recientemente</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
              {jugadoresRecientes.map((jugador, idx) => (
                <motion.div key={jugador.id} className="flex-none snap-start flex flex-col items-center" whileTap={{ scale: 0.95 }} transition={{ delay: idx * 0.04 }} onClick={() => navigate(`/perfil?id=${jugador.id}`)}>
                  <div className="w-20 h-20 rounded-full overflow-hidden border"><Img src={jugador.foto} alt={jugador.nombre} className="w-full h-full object-cover" /></div>
                  <p className="text-center text-sm font-medium text-gray-900 mt-2">{jugador.nombre}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CANCHAS CERCA DE TI */}
        <section className="mt-6 mb-8">
          <h3 className="text-gray-900 font-semibold mb-3 text-lg">🏟️ Canchas cerca de ti</h3>
          {isFetching ? (
            <SkeletonCarousel count={4} />
          ) : clubs.length === 0 ? (
            <p className="text-gray-500 text-sm">No se encontraron canchas cercanas</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3">
              {clubs.map((club, idx) => (
                <motion.div key={club.id} className="flex-none snap-start w-36" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05, type: 'spring', stiffness: 260 }} whileTap={{ scale: 0.97 }}>
                  <IOSCard className="p-2 rounded-2xl flex flex-col justify-between h-full" onClick={() => navigate(`/club/${club.id}`)}>
                    <div className="w-full h-24 rounded-xl overflow-hidden"><Img src={club.imagen} alt={club.nombre} className="w-full h-full object-cover" /></div>
                    <div className="mt-2"><h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{club.nombre}</h4><p className="text-xs text-gray-500">A {club.distancia ?? '—'} km</p></div>
                    <IOSButton className="mt-2 w-full text-xs py-2" onClick={(e) => { e.stopPropagation(); navigate(`/reservarCancha?club=${club.id}`); }}>Reservar</IOSButton>
                  </IOSCard>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* footer loading indicator */}
        {isFetching && <div className="px-4 py-4"><Loading /></div>}

      </div>

    </div>
  )
}
