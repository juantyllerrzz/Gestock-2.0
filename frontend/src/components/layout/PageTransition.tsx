import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';


export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}