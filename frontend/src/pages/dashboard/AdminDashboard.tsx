
import { motion, useReducedMotion } from 'framer-motion';

import {
  Boxes,
  PackageSearch,
  RefreshCw,
  Wallet,
  Package,
  Activity,
  Sparkles,
  ShieldCheck,
  Bot,
  AlertTriangle,
  TrendingUp,
  Zap,
} from 'lucide-react';

import { DashboardShell } from '../../components/layout/DashboardShell';
import { Button } from '../../components/ui/Button';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { RiskTable } from '../../components/dashboard/RiskTable';
import { ConsumptionChart } from '../../components/dashboard/ConsumptionChart';
import { StockAlerts } from '../../components/dashboard/StockAlerts';
import { InventoryBell } from '../../components/dashboard/InventoryBell';

import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../context/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();

  const {
    summary,
    forecasts,
    products,
    loading,
    refreshing,
    error,
    regenerateForecasts,
  } = useDashboardData();

  const reduceMotion = useReducedMotion();

  // =========================================
  // CÁLCULOS REALES DEL INVENTARIO
  // =========================================

  const totalProducts =
    summary?.totalProducts ?? products.length;

  const lowStockCount =
    summary?.lowStockCount ??
    products.filter(
      (product) =>
        product.currentStock <= product.minStock,
    ).length;

  const totalUnits = products.reduce(
    (sum, product) =>
      sum + Number(product.currentStock),
    0,
  );

  const totalValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.unitPrice) *
        Number(product.currentStock),
    0,
  );

  const outOfStock = products.filter(
    (product) => Number(product.currentStock) === 0,
  ).length;

  const healthyProducts = Math.max(
    0,
    totalProducts - lowStockCount,
  );

  const healthyPercentage =
    totalProducts > 0
      ? Math.round(
          (healthyProducts / totalProducts) * 100,
        )
      : 0;

  const riskItems = summary?.productsAtRisk ?? [];

  const formatNumber = (value: number) =>
    value.toLocaleString('es-CO');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);

  const entrance = reduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 20 };

  // =========================================
  // INTERFAZ
  // =========================================

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-7xl space-y-6 pb-10">
        {/* CAMPANITA DE NOTIFICACIONES */}
<div className="flex justify-end">
  <InventoryBell products={products} />
</div>

        {/* =====================================
            ENCABEZADO FUTURISTA
        ===================================== */}

        <motion.section
          initial={entrance}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="
            relative overflow-hidden
            rounded-3xl
            border border-signal/20
            bg-gradient-to-br
            from-surface via-base to-surface
            p-6 sm:p-8
            shadow-[0_0_45px_rgba(0,150,255,0.08)]
          "
        >
          {/* Resplandor decorativo */}
          <motion.div
            aria-hidden="true"
            animate={
              reduceMotion
                ? {}
                : {
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.2, 1],
                  }
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              pointer-events-none
              absolute -right-20 -top-24
              h-80 w-80 rounded-full
              bg-signal/15 blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute
              bottom-0 left-0 h-48 w-48
              rounded-full bg-signal/5 blur-3xl
            "
          />

          {/* Línea luminosa */}
          <div
            aria-hidden="true"
            className="
              absolute inset-x-0 top-0 h-px
              bg-gradient-to-r
              from-transparent via-signal to-transparent
            "
          />

          <div className="relative z-10">

            {/* Barra de estado */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-signal" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">
                  Gestock Command Center
                </span>
              </div>

              <div
                className="
                  flex items-center gap-2
                  rounded-full border border-signal/20
                  bg-signal/5 px-3 py-1.5
                "
              >
                <span className="relative flex h-2 w-2">
                  {!reduceMotion && (
                    <span
                      className="
                        absolute inline-flex h-full w-full
                        animate-ping rounded-full
                        bg-emerald-400 opacity-40
                      "
                    />
                  )}

                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-xs text-ink-muted">
                  Panel de inventario
                </span>
              </div>

            </div>

            {/* Título y acción */}
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

              <div className="max-w-2xl">
                <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Panel de administrador
                  <span className="ml-2 text-signal">
                    3.0
                  </span>
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                  Bienvenido,{' '}
                  <span className="font-semibold text-ink">
                    {user?.name ?? 'Administrador'}
                  </span>
                  . Supervisa tus productos, analiza
                  tendencias y mantén el control
                  inteligente de tu inventario.
                </p>
              </div>

              <div className="shrink-0">
                <Button
                  variant="primary"
                  loading={refreshing}
                  onClick={regenerateForecasts}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      refreshing ? 'animate-spin' : ''
                    }`}
                  />

                  Actualizar predicciones
                </Button>
              </div>
            </div>

            {/* Información complementaria */}
            <div className="mt-7 flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-base/60 px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />

                <span className="text-xs font-medium text-ink-muted">
                  Control de inventario
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-base/60 px-4 py-3">
                <Bot className="h-4 w-4 text-signal" />

                <span className="text-xs font-medium text-ink-muted">
                  Gesti AI · Modo local
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-base/60 px-4 py-3">
                <Sparkles className="h-4 w-4 text-signal" />

                <span className="text-xs font-medium text-ink-muted">
                  Analítica de inventarios
                </span>
              </div>

            </div>
          </div>
        </motion.section>

        {/* =====================================
            ERRORES DEL DASHBOARD
        ===================================== */}

        {error && (
          <div
            role="alert"
            className="
              flex items-start gap-3
              rounded-xl border border-critical/30
              bg-critical/10 p-4 text-sm text-critical
            "
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* =====================================
            ESTADO DE CARGA
        ===================================== */}

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className={`
                    h-36 rounded-2xl border border-border
                    bg-surface
                    ${reduceMotion ? '' : 'animate-pulse'}
                  `}
                />
              ))}
            </div>

            <div
              className={`
                h-80 rounded-2xl border border-border
                bg-surface
                ${reduceMotion ? '' : 'animate-pulse'}
              `}
            />
          </div>
        ) : (
          <>
            {/* =====================================
                INDICADORES PRINCIPALES
            ===================================== */}

            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal/10 text-signal">
                  <Activity className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Indicadores clave
                  </h2>

                  <p className="text-xs text-ink-muted">
                    Información actual de tu inventario
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <motion.div
                  initial={entrance}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  whileHover={
                    reduceMotion
                      ? {}
                      : { y: -5, scale: 1.01 }
                  }
                >
                  <KpiCard
                    label="Productos totales"
                    value={totalProducts}
                    icon={<Boxes className="h-5 w-5" />}
                  />
                </motion.div>

                <motion.div
                  initial={entrance}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                  whileHover={
                    reduceMotion
                      ? {}
                      : { y: -5, scale: 1.01 }
                  }
                >
                  <KpiCard
                    label="Bajo stock mínimo"
                    value={lowStockCount}
                    icon={
                      <PackageSearch className="h-5 w-5" />
                    }
                    tone="critical"
                  />
                </motion.div>

                <motion.div
                  initial={entrance}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.16 }}
                  whileHover={
                    reduceMotion
                      ? {}
                      : { y: -5, scale: 1.01 }
                  }
                >
                  <KpiCard
                    label="Valor total en inventario"
                    value={formatCurrency(totalValue)}
                    icon={<Wallet className="h-5 w-5" />}
                  />
                </motion.div>

                <motion.div
                  initial={entrance}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.24 }}
                  whileHover={
                    reduceMotion
                      ? {}
                      : { y: -5, scale: 1.01 }
                  }
                >
                  <KpiCard
                    label="Unidades disponibles"
                    value={formatNumber(totalUnits)}
                    icon={<Package className="h-5 w-5" />}
                  />
                </motion.div>

              </div>
            </section>

            {/* =====================================
                CONSUMO Y PREDICCIONES
            ===================================== */}

            <motion.section
              initial={entrance}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div
                className="
                  relative overflow-hidden
                  rounded-2xl border border-border
                  bg-surface/50 p-4 sm:p-5
                "
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-signal/5 blur-3xl"
                />

                <div className="relative mb-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-signal" />

                      <h2 className="font-display text-lg font-semibold text-ink">
                        Análisis de consumo
                      </h2>
                    </div>

                    <p className="mt-1 text-xs text-ink-muted">
                      Historial y proyecciones disponibles
                    </p>
                  </div>

                  <span className="rounded-full border border-signal/20 bg-signal/10 px-3 py-1 text-xs text-signal">
                    Analítica
                  </span>
                </div>

                {/* Tu gráfico original */}
                <ConsumptionChart forecasts={forecasts} />
              </div>
            </motion.section>
            <StockAlerts products={products} />

            {/* =====================================
                CENTRO DE ALERTAS
            ===================================== */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">

              {/* PRODUCTOS EN RIESGO */}

              <motion.section
                initial={entrance}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="min-w-0"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warn/10 text-warn">
                      <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-display text-lg font-semibold text-ink">
                        Productos en riesgo
                      </h2>

                      <p className="text-xs text-ink-muted">
                        Proyección de agotamiento del inventario
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-warn/20 bg-warn/10 px-3 py-1 text-xs font-medium text-warn">
                    {riskItems.length} en seguimiento
                  </span>

                </div>

                <div className="overflow-x-auto">
                  <RiskTable items={riskItems} />
                </div>
              </motion.section>

              {/* SALUD DEL INVENTARIO */}

              <motion.section
                initial={entrance}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="
                  relative overflow-hidden rounded-2xl
                  border border-signal/20
                  bg-gradient-to-b from-surface to-base
                  p-5
                "
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-signal/10 blur-3xl"
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-signal" />

                    <h2 className="font-display text-lg font-semibold text-ink">
                      Salud del inventario
                    </h2>
                  </div>

                  <p className="mt-2 text-xs text-ink-muted">
                    Productos por encima de su stock mínimo
                  </p>

                  <div className="mt-7 flex items-end gap-2">
                    <span className="font-display text-5xl font-bold tracking-tight text-signal">
                      {healthyPercentage}%
                    </span>

                    <span className="mb-1 text-xs text-ink-muted">
                      de productos
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  <div
                    role="progressbar"
                    aria-label="Porcentaje de productos por encima del stock mínimo"
                    aria-valuenow={healthyPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-5 h-2.5 overflow-hidden rounded-full bg-signal/10"
                  >
                    <motion.div
                      initial={{
                        width: reduceMotion
                          ? `${healthyPercentage}%`
                          : '0%',
                      }}
                      animate={{
                        width: `${healthyPercentage}%`,
                      }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-signal to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                    />
                  </div>

                  <div className="mt-6 space-y-4">

                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <span className="text-sm text-ink-muted">
                        Stock saludable
                      </span>

                      <span className="font-semibold text-emerald-400">
                        {healthyProducts}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <span className="text-sm text-ink-muted">
                        Stock bajo
                      </span>

                      <span className="font-semibold text-warn">
                        {lowStockCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-muted">
                        Sin existencias
                      </span>

                      <span className="font-semibold text-critical">
                        {outOfStock}
                      </span>
                    </div>

                  </div>

                  {/* Recomendación */}
                  <div className="mt-7 rounded-xl border border-signal/20 bg-signal/5 p-4">

                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-signal" />

                      <span className="text-sm font-semibold text-ink">
                        Recomendación de Gestock
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                      {lowStockCount > 0
                        ? `Tienes ${lowStockCount} productos en el nivel mínimo o por debajo. Revisa sus existencias y considera reabastecerlos.`
                        : 'Todos los productos se encuentran por encima de su nivel mínimo. Continúa supervisando las existencias.'}
                    </p>
                  </div>

                </div>
              </motion.section>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
