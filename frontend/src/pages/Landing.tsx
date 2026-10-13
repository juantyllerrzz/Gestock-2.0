import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, ShieldCheck, TrendingUp, ChevronDown } from 'lucide-react';
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

const PREVIEW_BARS = [54, 70, 47, 84, 65, 58, 72];
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

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
              className="inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 transition-colors hover:bg-signal-dim"
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
          className="relative mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-surface/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-display text-sm font-semibold text-ink">Consumo diario promedio</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-base/60 px-3 py-1 text-xs font-medium text-ink-muted">
                Últimos 7 días
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-critical/10 px-3 py-1 text-xs font-medium text-critical border border-critical/20">
                <span className="radar-pulse h-1.5 w-1.5 rounded-full bg-critical text-critical" />
                3 productos en riesgo
              </span>
            </div>
          </div>

          <div className="relative mt-8 h-48 sm:h-52">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-ink-muted/40 pr-2">
              <div className="flex items-center gap-2 border-b border-border/40 pb-1"><span>100</span><div className="w-full border-t border-dashed border-border/20" /></div>
              <div className="flex items-center gap-2 border-b border-border/40 pb-1"><span>70</span><div className="w-full border-t border-dashed border-border/20" /></div>
              <div className="flex items-center gap-2 border-b border-border/40 pb-1"><span>50</span><div className="w-full border-t border-dashed border-border/20" /></div>
              <div className="flex items-center gap-2 pb-1"><span>0</span><div className="w-full border-t border-border/40" /></div>
            </div>

            <div className="absolute left-[51%] top-6 -translate-x-1/2 z-20 flex flex-col items-center">
              <div className="rounded-md border border-border bg-surfaceHover px-2.5 py-1 text-xs font-medium text-ink shadow-lg shadow-black/60">
                84 unidades
              </div>
              <div className="h-1.5 w-1.5 rotate-45 border-r border-b border-border bg-surfaceHover -mt-1" />
            </div>

            <div className="absolute inset-0 pl-7 pr-2 flex items-end gap-3 sm:gap-4 pb-6">
              {PREVIEW_BARS.map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.6, delay: 0.6 + i * 0.06, ease: 'easeOut' }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-signal/40 via-signal/80 to-signal relative shadow-[0_0_20px_rgba(30,136,214,0.3)] border-t border-white/40"
                  />
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-7 right-2 flex justify-between text-xs text-ink-muted font-medium pt-2">
              {DAYS.map((day, i) => (
                <span key={i} className="flex-1 text-center">{day}</span>
              ))}
            </div>
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
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative rounded-2xl border border-border bg-surface/90 p-6 text-left shadow-xl shadow-black/20 backdrop-blur-xl transition-all hover:border-signal/50 hover:shadow-signal/10"
            >
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-signal/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
              <div className="relative z-10">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-signal/20 to-signal/5 text-signal border border-signal/30 shadow-[0_0_15px_rgba(30,136,214,0.2)]">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{feature.description}</p>
              </div>
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
                className="text-center sm:text-left rounded-2xl border border-border/60 bg-surface/40 p-6"
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
          className="mx-auto mt-24 max-w-2xl rounded-2xl border border-border bg-gradient-to-br from-surface to-base p-10 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-signal/5 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Deja de improvisar tu inventario
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Crea tu cuenta y empieza a ver predicciones desde el primer producto que registres.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-signal px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 transition-colors hover:bg-signal-dim"
            >
              Crear cuenta gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-ink-muted sm:px-10">
        © {new Date().getFullYear()} Gestock—SENA.
      </footer>
    </div>
  );
}