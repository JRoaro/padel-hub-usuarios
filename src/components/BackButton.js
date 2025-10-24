
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const BackButton = ({ text = 'Atrás' }) => {
  const navigate = useNavigate()

  return (
    <motion.button
        onClick={() => navigate(-1)}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-xl bg-white shadow-lg hover:shadow-xl transition"
    >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
    </motion.button>
  )
}

export default BackButton