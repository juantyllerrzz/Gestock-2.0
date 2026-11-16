
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  PackageX,
  ShieldCheck,
} from 'lucide-react';

type StockProduct = {
  name: string;
  sku?: string | null;
  currentStock: number;
  minStock: number;
};

type StockAlertsProps = {
  products: readonly StockProduct[];
};

export function StockAlerts({ products }: StockAlertsProps) {
  const [expanded, setExpanded] = useState(true);
  const reduceMotion = useReducedMotion();

  // Detectar alertas con los datos reales
  const alerts = useMemo(() => {
    return products
      .map((product) => ({
        ...product,
        current: Number(product.currentStock),
        minimum: Number(product.minStock),
      }))
      .filter(
        (product) =>
          product.current <= product.minimum ||
          product.current <= 0,
      )
      .sort((a, b) => a.current - b.current);
  }, [products]);

  const outOfStock = alerts.filter(
    (product) => product.current <= 0,
  ).length;

  const lowStock = alerts.length - outOfStock;
  const hasAlerts = alerts.length > 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">

      {/* ENCABEZADO */}
      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-signal/5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal">
            <BellRing className="h-6 w-6" />

            {hasAlerts && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-critical px-1 text-[10px] font-bold text-white">
                {alerts.length}
              </span>
            )}
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">
              Centro de alertas inteligentes
            </h2>

            <p className="mt-1 text-xs text-ink-muted">
              Detección automática según el stock registrado
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              hasAlerts
                ? 'border-critical/30 bg-critical/10 text-critical'
                : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
            }`}
          >
            {hasAlerts
              ? `${alerts.length} alertas`
              : 'Todo en orden'}
          </span>

          <ChevronDown
            className={`h-5 w-5 text-ink-muted transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* BARRA LUMINOSA */}
      <div className="h-px bg-gradient-to-r from-transparent via-signal/60 to-transparent" />

      {/* CONTENIDO DESPLEGABLE */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="alert-content"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }
            }
            animate={{ height: 'auto', opacity: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }
            }
            transition={{
              duration: reduceMotion ? 0.1 : 0.35,
              ease: 'easeInOut',
            }}
            className="overflow-hidden"
          >
            <div className="p-5">

              {/* INVENTARIO SALUDABLE */}
              {!hasAlerts ? (
                <div className="flex flex-col items-center justify-center gap-3 py-7 text-center">
                  <motion.div
                    animate={
                      reduceMotion
                        ? {}
                        : {
                            scale: [1, 1.08, 1],
                          }
                    }
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10"
                  >
                    <ShieldCheck className="h-8 w-8 text-emerald-400" />
                  </motion.div>

                  <h3 className="text-lg font-semibold text-ink">
                    ¡Inventario bajo control!
                  </h3>

                  <p className="max-w-md text-sm text-ink-muted">
                    No se encontraron productos agotados
                    ni con existencias iguales o inferiores
                    a su stock mínimo.
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Sin alertas de stock registradas
                  </div>
                </div>
              ) : (
                <div className="space-y-4">

                  {/* RESUMEN */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-critical/20 bg-critical/5 p-4">
                      <div className="flex items-center gap-2 text-critical">
                        <PackageX className="h-5 w-5" />
                        <span className="text-xs">
                          Agotados
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-bold text-ink">
                        {outOfStock}
                      </p>
                    </div>

                    <div className="rounded-xl border border-warn/20 bg-warn/5 p-4">
                      <div className="flex items-center gap-2 text-warn">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="text-xs">
                          Stock bajo
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-bold text-ink">
                        {lowStock}
                      </p>
                    </div>
                  </div>

                  {/* ALERTAS DE PRODUCTOS */}
                  <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                    {alerts.map((product, index) => {
                      const exhausted =
                        product.current <= 0;

                      return (
                        <motion.div
                          key={`${product.sku ?? product.name}-${index}`}
                          initial={
                            reduceMotion
                              ? { opacity: 1 }
                              : { opacity: 0, x: -16 }
                          }
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.25,
                            delay: reduceMotion
                              ? 0
                              : Math.min(index * 0.04, 0.4),
                          }}
                          className={`rounded-xl border p-4 ${
                            exhausted
                              ? 'border-critical/30 bg-critical/5'
                              : 'border-warn/30 bg-warn/5'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold text-ink">
                              {product.name}
                            </p>

                            <span
                              className={`text-xs font-semibold ${
                                exhausted
                                  ? 'text-critical'
                                  : 'text-warn'
                              }`}
                            >
                              {exhausted
                                ? 'SIN EXISTENCIAS'
                                : 'STOCK BAJO'}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-ink-muted">
                            Disponible:{' '}
                            <strong className="text-ink">
                              {product.current}
                            </strong>
                            {' · '}
                            Mínimo:{' '}
                            <strong className="text-ink">
                              {product.minimum}
                            </strong>
                          </p>

                          <p className="mt-2 text-xs text-ink-muted">
                            Sugerencia: revisar el reabastecimiento.
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
