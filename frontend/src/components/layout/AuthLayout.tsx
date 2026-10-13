import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import logoFull from '../../assets/logo-full.png';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}


export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-surface to-base p-12 lg:flex">
        
        <div className="relative flex flex-1 items-center justify-center">
          <motion.img
            src={logoFull}
            alt="Gestock"
            className="h-44 w-auto cursor-grab active:cursor-grabbing"
            drag
            dragSnapToOrigin={true}
            whileDrag={{ scale: 1.15, cursor: "grabbing" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: 1, 
              y: [0, -15, 0],
              filter: [
                "drop-shadow(0px 0px 5px rgba(59,130,246,0.2))",
                "drop-shadow(0px 0px 30px rgba(59,130,246,0.8))",
                "drop-shadow(0px 0px 5px rgba(59,130,246,0.2))"
              ]
            }}
            transition={{ 
              opacity: { duration: 0.8 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              filter: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-sm"
        >
          <p className="font-display text-2xl font-semibold leading-snug text-ink">
            No solo dice cuánto hay. Dice cuándo se va a acabar.
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            Inventario con analítica predictiva: consumo, riesgo de agotamiento
            y sugerencias de reabastecimiento en tiempo real.
          </p>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
            <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}