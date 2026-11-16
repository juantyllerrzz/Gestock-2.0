
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Bell,
  BellRing,
  PackageX,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';

type Product = {
  name: string;
  sku?: string | null;
  currentStock: number;
  minStock: number;
};

type InventoryBellProps = {
  products: readonly Product[];
};

export function InventoryBell({ products }: InventoryBellProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const alerts = useMemo(
    () =>
      products
        .filter(
          (product) =>
            Number(product.currentStock) <=
            Number(product.minStock),
        )
        .sort(
          (a, b) =>
            Number(a.currentStock) - Number(b.currentStock),
        ),
    [products],
  );

  const count = alerts.length;

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative z-40">
      {/* BOTÓN DE NOTIFICACIONES */}
      <motion.button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        whileHover={reducedMotion ? {} : { scale: 1.07 }}
        whileTap={reducedMotion ? {} : { scale: 0.94 }}
        aria-label={`Notificaciones de inventario: ${count} alertas`}
        aria-expanded={open}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-signal/30 bg-surface text-signal shadow-lg transition-colors hover:bg-signal/10"
      >
        {count > 0 ? (
          <BellRing className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}

        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-critical px-1 text-[10px] font-bold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </motion.button>

      {/* PANEL DESPLEGABLE */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -15, scale: 0.94 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -10, scale: 0.95 }
            }
            transition={{ duration: reducedMotion ? 0.1 : 0.25 }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 top-full z-50 mt-3 w-[min(350px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-signal/30 bg-surface shadow-[0_15px_60px_rgba(0,0,0,0.45)]"
          >
            {/* ENCABEZADO */}
            <div className="flex items-center justify-between border-b border-border bg-base p-4">
              <div>
                <h3 className="font-display font-bold text-ink">
                  Centro de notificaciones
                </h3>
                <p className="mt-1 text-xs text-ink-muted">
                  Monitoreo de stock de Gestock
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar notificaciones"
                className="rounded-lg p-2 text-ink-muted hover:bg-signal/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-signal to-transparent" />

            {/* CONTENIDO */}
            <div className="max-h-80 overflow-y-auto p-4">
              {count === 0 ? (
                <div className="space-y-3 py-7 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />

                  <h4 className="font-semibold text-ink">
                    ¡Todo bajo control!
                  </h4>

                  <p className="text-sm text-ink-muted">
                    No tienes productos agotados ni con stock bajo.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-critical">
                    {count} productos requieren atención
                  </p>

                  {alerts.slice(0, 20).map((product, index) => {
                    const exhausted =
                      Number(product.currentStock) <= 0;

                    return (
                      <div
                        key={`${product.sku ?? product.name}-${index}`}
                        className="flex items-start gap-3 rounded-xl border border-border bg-base/50 p-3"
                      >
                        {exhausted ? (
                          <PackageX className="mt-1 h-5 w-5 shrink-0 text-critical" />
                        ) : (
                          <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-warn" />
                        )}

                        <div className="min-w-0">
                          <p className="break-words text-sm font-semibold text-ink">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-ink-muted">
                            Actual: {product.currentStock}
                            {' · '}
                            Mínimo: {product.minStock}
                          </p>

                          <p
                            className={`mt-1 text-xs font-medium ${
                              exhausted
                                ? 'text-critical'
                                : 'text-warn'
                            }`}
                          >
                            {exhausted
                              ? 'Producto agotado'
                              : 'Reabastecimiento recomendado'}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {count > 20 && (
                    <p className="text-center text-xs text-ink-muted">
                      Hay {count - 20} alertas adicionales.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-border bg-base p-3 text-center">
              <p className="text-[11px] text-ink-muted">
                GESTOCK 3.0 · ALERTAS DE INVENTARIO
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
