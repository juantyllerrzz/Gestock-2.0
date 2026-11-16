
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import logoFull from '../../assets/logo-full.png';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* PANEL IZQUIERDO */}
      <div className="relative hidden min-h-screen flex-col overflow-hidden bg-gradient-to-br from-surface to-base px-10 py-10 lg:flex">

        {/* Brillo decorativo del fondo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full bg-signal/10 blur-3xl"
        />

        {/* LOGO CENTRADO Y MÁS GRANDE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 flex w-full justify-center pt-6"
        >
          <motion.img
            src={logoFull}
            alt="Gestock"
            className="h-44 w-auto max-w-full object-contain drop-shadow-[0_0_25px_rgba(33,150,243,0.35)] sm:h-48 xl:h-56"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* RADAR ANIMADO */}
        <div className="relative flex flex-1 items-center justify-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-40 w-40 rounded-full border border-signal/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-28 w-28 rounded-full border border-signal/15"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-16 w-16 rounded-full border border-signal/20"
          />

          <div
            aria-hidden="true"
            className="radar-pulse relative z-10 h-3 w-3 rounded-full bg-signal text-signal shadow-signal"
          />
        </div>

        {/* TEXTO INFERIOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 mx-auto w-full max-w-md pb-4 text-center"
        >
          <p className="font-display text-2xl font-semibold leading-snug text-ink xl:text-3xl">
            No solo dice cuánto hay.
            <span className="block text-signal">
              Dice cuándo se va a acabar.
            </span>
          </p>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
            Inventario con analítica predictiva: consumo,
            riesgo de agotamiento y sugerencias de
            reabastecimiento en tiempo real.
          </p>
        </motion.div>
      </div>

      {/* PANEL DERECHO: FORMULARIO */}
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-12">

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold text-ink">
              {title}
            </h1>

            <p className="mt-1.5 text-sm text-ink-muted">
              {subtitle}
            </p>
          </div>

          {children}
        </motion.div>
      </div>

    </div>
  );
}
