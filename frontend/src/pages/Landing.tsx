import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, ShieldCheck, TrendingUp } from 'lucide-react';
import logoIcon from '../assets/logo-icon.png';

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Analítica predictiva',
    description:
      'Consumo diario promedio, días hasta agotarse y cantidad sugerida de reabastecimiento, calculados automáticamente por producto.',
  },
  {
    icon: ShieldCheck,
    title: 'Roles y permisos',
    description:
      'Paneles distintos para administradores, managers y empleados, con acceso controlado a cada acción del sistema.',
  },
  {
    icon: BarChart3,
    title: 'Reportes en tiempo real',
    description:
      'Vista SQL, procedimiento almacenado y gráficas de consumo, todo conectado directo a tu base de datos.',
  },
];

const STEPS = [
  { number: '01', title: 'Registra tu catálogo', description: 'Productos, categorías y stock mínimo por artículo.' },
  { number: '02', title: 'Registra movimientos', description: 'Entradas y salidas, con ajuste automático de inventario.' },
  { number: '03', title: 'Recibe predicciones', description: 'Gestock calcula solo cuándo y cuánto reabastecer.' },
];

const PREVIEW_BARS = [40, 65, 30, 80, 55, 45, 70];

export function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-base">
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
          <img src={logoIcon} alt="Gestock" className="h-9 w-9" />
          Gestock
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-signal-dim"
          >
            Crear cuenta
          </Link>
        </div>
      </header>

      <main className="relative px-6 pb-24 pt-10 sm:px-10 sm:pt-16">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-signal/10 blur-3xl" />

        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-muted"
          >
            <span className="radar-pulse h-1.5 w-1.5 rounded-full bg-signal text-signal" />
            Inventario con analítica predictiva
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl"
          >
            No solo dice cuánto hay.
            <br />
            Dice cuándo se va a acabar.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-ink-muted sm:text-lg"
          >
            Gestock calcula el consumo de cada producto, anticipa cuándo se agota y sugiere cuánto
            reabastecer, sin que tengas que revisar hoja por hoja.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-sm font-medium text-white shadow-signal transition-colors hover:bg-signal-dim"
            >
              Crear cuenta gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
            >
              Ya tengo cuenta
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/30 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-semibold text-ink">Consumo diario promedio</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-critical/10 px-2.5 py-1 text-xs font-medium text-critical">
              <span className="radar-pulse h-1.5 w-1.5 rounded-full bg-critical text-critical" />
              3 productos en riesgo
            </span>
          </div>
          <div className="mt-6 flex h-32 items-end gap-2.5 sm:gap-3">
            {PREVIEW_BARS.map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.06, ease: 'easeOut' }}
                className="flex-1 rounded-t-md bg-signal/80"
              />
            ))}
          </div>
        </motion.div>

        <div className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-surface p-6 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-signal/10 text-signal">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-display text-2xl font-semibold text-ink"
          >
            Cómo funciona
          </motion.h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="text-center sm:text-left"
              >
                <p className="font-mono text-sm font-semibold text-signal">{step.number}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-2xl rounded-2xl border border-border bg-gradient-to-br from-surface to-base p-10 text-center"
        >
          <h2 className="font-display text-2xl font-semibold text-ink">
            Deja de improvisar tu inventario
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Crea tu cuenta y empieza a ver predicciones desde el primer producto que registres.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-sm font-medium text-white shadow-signal transition-colors hover:bg-signal-dim"
          >
            Crear cuenta gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-ink-muted sm:px-10">
        © {new Date().getFullYear()} Gestock — Proyecto académico ADSO, SENA.
      </footer>
    </div>
  );
}