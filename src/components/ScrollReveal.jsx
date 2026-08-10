import { motion } from 'framer-motion'

export default function ScrollReveal({ children, delay = 0, yOffset = 40 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.7, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      {children}
    </motion.div>
  )
}
