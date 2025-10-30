
import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'

const BackButton = ({ text = 'Atrás' }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => {
    if (location.key === 'default') {
      navigate("/home", { replace: true })
    } else {
      navigate(-1)
    }
  }

  return (
    <motion.button
        onClick={() => goBack()}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-xl bg-white shadow-lg hover:shadow-xl transition"
    >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
    </motion.button>
  )
}

export default BackButton