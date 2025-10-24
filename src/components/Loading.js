import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';


const Loading = () => {
    return (
        <AnimatePresence>
        
          <motion.div
            key="loading"
            className="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
            <p className="mt-2 text-gray-800 font-semibold text-lg">Cargando...</p>
          </motion.div>
        
        </AnimatePresence>
    )
}

export default Loading;