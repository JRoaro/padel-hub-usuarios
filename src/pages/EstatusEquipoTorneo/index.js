import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus } from 'lucide-react';

const fases = [
  { nombre: 'Ronda 1', icono: '🏅' },
  { nombre: 'Ronda 2', icono: '🥇' },
  { nombre: 'Semifinal', icono: '🥈' },
  { nombre: 'Final', icono: '🏆' },
];

const EstatusTorneo = () => {
    const Equipo1 = [
        { nombre: 'Ana', avatar: 'https://i.pravatar.cc/150?img=3', stats: { sets: 2, puntos: 15, juegos: 40 } },
        { nombre: 'Carlos', avatar: 'https://i.pravatar.cc/150?img=4', stats: { sets: 1, puntos: 12, juegos: 40 } }
    ];

    const Equipo2 = [
        { nombre: 'Juan', avatar: 'https://i.pravatar.cc/150?img=1', stats: { sets: 1, puntos: 10, juegos: 20 } },
        { nombre: 'Luis', avatar: 'https://i.pravatar.cc/150?img=2', stats: { sets: 2, puntos: 14, juegos: 20 } }
    ];

    const [equipo, setEquipo] = useState({
        nombre: 'Los Smash Bros',
        fase: 'Ronda 1',
        faseActual: 0,
        compañeros: [
        { nombre: 'Juan', avatar: 'https://i.pravatar.cc/150?img=1' }
        ],
        proximoPartido: 'Chavaravis',
        marcadorIngresado: false,
        sets: [
        ['', '', ''],
        ['', '', '']
        ],
        confetti: false
    });

    const handleSetChange = (jugadorIdx, setIdx, value) => {
        if (value.length > 2) return;
        const newSets = [...equipo.sets];
        newSets[jugadorIdx][setIdx] = value;
        setEquipo(prev => ({ ...prev, sets: newSets }));
    };

    const handleIngresarResultado = () => {
        const setsCompletos = equipo.sets.flat().filter(s => s !== '');
        if (setsCompletos.length < 4) return;
        setEquipo(prev => ({
        ...prev,
        marcadorIngresado: true,
        faseActual: Math.min(prev.faseActual + 1, fases.length - 1),
        confetti: true
        }));
        setTimeout(() => setEquipo(prev => ({ ...prev, confetti: false })), 4000);
    };

    const calcularSetsGanados = () => {
        let local = 0, visitante = 0;
        for (let i = 0; i < 3; i++) {
        const l = parseInt(equipo.sets[0][i]) || 0;
        const v = parseInt(equipo.sets[1][i]) || 0;
        if (l > v) local++;
        else if (v > l) visitante++;
        }
        return { local, visitante };
    };

    const setsGanados = calcularSetsGanados();

    // Sumar juegos ganados por equipo
    const juegosEquipo1 = Equipo1.reduce((sum, j) => sum + j.stats.juegos, 0);
    const juegosEquipo2 = Equipo2.reduce((sum, j) => sum + j.stats.juegos, 0);
    const totalJuegos = juegosEquipo1 + juegosEquipo2;
    const probabilidadEquipo1 = Math.round((juegosEquipo1 / totalJuegos) * 100);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 overflow-hidden font-sans text-gray-800 px-4 sm:px-8 pt-8 sm:pt-12 pb-8">
        <AnimatePresence>
            <motion.div
            key="main-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full max-w-2xl mx-auto gap-8"
            >
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">{equipo.nombre}</h1>
                <p className="text-gray-500 text-sm mt-1">Estado actual en el torneo</p>
            </div>

            {/* Compañeros */}
            <div className="flex flex-wrap items-center gap-6 justify-center">
                {equipo.compañeros.map((comp, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <img src={comp.avatar} alt={comp.nombre} className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 border-white" />
                    <p className="text-xs sm:text-sm mt-1 text-gray-800 font-medium">{comp.nombre}</p>
                </div>
                ))}
                <div className="flex flex-col items-center cursor-pointer">
                <button onClick={() => alert('Invitar compañero')} className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-2xl font-bold">
                    <Plus />
                </button>
                <p className="text-xs sm:text-sm mt-1 text-gray-500 font-medium">Invitar</p>
                </div>
            </div>

            {/* Fase actual */}
            <div className="flex justify-between items-center w-full max-w-md">
                <div>
                <p className="text-sm text-gray-500">{fases[equipo.faseActual].nombre}</p>
                <p className="text-lg font-semibold text-blue-600">{equipo.fase}</p>
                </div>
                <Trophy className="text-yellow-500" size={28} />
            </div>

            {/* Rivalidad / Próximo partido */}
            <div className="flex flex-col items-center w-full gap-1">
                <p className="text-gray-500 text-sm font-medium mb-1">Próximo Partido</p>

                <div className="flex items-center justify-between w-full max-w-md gap-2">
                    {/* Equipo 1 */}
                    <div className="flex flex-col items-center gap-0">
                        <div className="flex -space-x-2">
                            {Equipo1.map((j, i) => (
                                <img key={i} src={j.avatar} alt={j.nombre} className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-white" />
                            ))}
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-1">{juegosEquipo1} juegos ganados</p>
                        <p className="text-xs sm:text-sm text-blue-600 font-bold">{probabilidadEquipo1}% de ganar</p>
                    </div>

                    {/* VS */}
                    <motion.div
                        className="text-lg sm:text-xl font-bold text-red-500 mx-1"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    >
                        VS
                    </motion.div>

                    {/* Equipo 2 */}
                    <div className="flex flex-col items-center gap-0">
                        <div className="flex -space-x-2">
                            {Equipo2.map((j, i) => (
                                <img key={i} src={j.avatar} alt={j.nombre} className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-white" />
                            ))}
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-1">{juegosEquipo2} juegos ganados</p>
                        <p className="text-xs sm:text-sm text-blue-600 font-bold">{100 - probabilidadEquipo1}% de ganar</p>
                    </div>
                </div>

                {/* Barra de probabilidad */}
                <div className="w-full max-w-md h-5 bg-gray-200 rounded-full mt-2 relative overflow-hidden">
                    {/* Equipo 1 */}
                    <motion.div
                        className="h-full bg-green-400 absolute left-0 top-0 flex items-center justify-end pr-1 rounded-l-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${probabilidadEquipo1}%` }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                    >
                        {probabilidadEquipo1 > 10 && <span className="text-white text-xs font-bold">{probabilidadEquipo1}%</span>}
                    </motion.div>

                    {/* Equipo 2 */}
                    <motion.div
                        className="h-full bg-red-400 absolute top-0 right-0 flex items-center justify-start pl-1 rounded-r-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - probabilidadEquipo1}%` }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                    >
                        {100 - probabilidadEquipo1 > 10 && <span className="text-white text-xs font-bold">{100 - probabilidadEquipo1}%</span>}
                    </motion.div>

                    {/* Marcador central */}
                    <motion.div
                        className="absolute top-0 h-full w-1 bg-white shadow-md rounded-full"
                        initial={{ left: 0 }}
                        animate={{ left: `calc(${probabilidadEquipo1}% - 0.5%)` }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                    />
                </div>
            </div>



            {/* Próximo partido sets - Inputs */}
            <div className="w-full max-w-md flex flex-col gap-4">
                {[0, 1].map((jugadorIdx) => (
                <div key={jugadorIdx} className="flex items-center gap-4">
                    {/* Avatares */}
                    <div className="flex -space-x-3">
                    {(jugadorIdx === 0 ? Equipo1 : Equipo2).map((j, i) => (
                        <img
                        key={i}
                        src={j.avatar}
                        alt={j.nombre}
                        className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 border-white shadow-md"
                        />
                    ))}
                    </div>

                    {/* Sets */}
                    <div className="flex gap-2 flex-1">
                    {equipo.sets[jugadorIdx].map((set, sIdx) => (
                        <input
                        key={sIdx}
                        type="number"
                        min="0"
                        max="6"
                        value={set}
                        disabled={equipo.marcadorIngresado}
                        onChange={(e) => handleSetChange(jugadorIdx, sIdx, e.target.value)}
                        className="w-12 sm:w-14 h-12 sm:h-14 text-center rounded-xl border border-gray-300 bg-gray-50 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    ))}
                    </div>
                </div>
                ))}

                {!equipo.marcadorIngresado && (
                <motion.button
                    onClick={handleIngresarResultado}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-xl"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Registrar resultado
                </motion.button>
                )}
            </div>
            </motion.div>
        </AnimatePresence>
    </div>
  );
};

export default EstatusTorneo;
