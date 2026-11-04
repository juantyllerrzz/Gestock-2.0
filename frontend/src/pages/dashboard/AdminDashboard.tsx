import { Boxes, PackageSearch, RefreshCw, Wallet } from 'lucide-react';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { Button } from '../../components/ui/Button';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { RiskTable } from '../../components/dashboard/RiskTable';
import { ConsumptionChart } from '../../components/dashboard/ConsumptionChart';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../context/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();
  const { summary, forecasts, products, loading, refreshing, error, regenerateForecasts } =
    useDashboardData();

  const totalValue = products.reduce((sum, p) => sum + Number(p.unitPrice) * p.currentStock, 0);

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Panel de administrador</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Bienvenido, {user?.name}. Esto es lo que está pasando con tu inventario.
          </p>
        </div>
        <Button variant="primary" loading={refreshing} onClick={regenerateForecasts}>
          <RefreshCw className="h-4 w-4" />
          Actualizar predicciones
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-critical">{error}</p>}

      {loading ? (
        <p className="mt-8 text-sm text-ink-muted">Cargando...</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              label="Productos totales"
              value={summary?.totalProducts ?? 0}
              icon={<Boxes className="h-5 w-5" />}
            />
            <KpiCard
              label="Bajo stock mínimo"
              value={summary?.lowStockCount ?? 0}
              icon={<PackageSearch className="h-5 w-5" />}
              tone="warn"
            />
            <KpiCard
              label="Valor total en inventario"
              value={`$${totalValue.toLocaleString('es-CO')}`}
              icon={<Wallet className="h-5 w-5" />}
            />
          </div>

          <div className="mt-6">
            <ConsumptionChart forecasts={forecasts} />
          </div>

          <div className="mt-6">
            <h2 className="mb-3 font-display text-base font-semibold text-ink">
              Productos en riesgo de agotarse
            </h2>
            <RiskTable items={summary?.productsAtRisk ?? []} />
          </div>
        </>
      )}
    </DashboardShell>
  );
}