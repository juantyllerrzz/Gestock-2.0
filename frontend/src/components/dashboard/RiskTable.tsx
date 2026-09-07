import { Card } from '../ui/Card';
import type { ProductAtRisk } from '../../lib/types';

function riskToneClass(days: number | null) {
  if (days === null) return 'text-ink-muted';
  if (days <= 3) return 'text-critical';
  if (days <= 7) return 'text-warn';
  return 'text-signal';
}

export function RiskTable({ items }: { items: ProductAtRisk[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <p className="text-sm text-ink-muted">
          Todavía no hay predicciones generadas, o ningún producto está en riesgo
          en este momento. Usa "Actualizar predicciones" para generarlas.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Producto</th>
              <th className="px-5 py-3 font-medium">Stock actual</th>
              <th className="px-5 py-3 font-medium">Días hasta agotarse</th>
              <th className="px-5 py-3 font-medium">Reabastecer sugerido</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const toneClass = riskToneClass(item.daysUntilStockout);
              const isCritical = item.daysUntilStockout !== null && item.daysUntilStockout <= 3;
              return (
                <tr key={item.productId} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3.5 font-medium text-ink">{item.productName}</td>
                  <td className="px-5 py-3.5 font-mono text-ink-muted">{item.currentStock}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-2 font-mono ${toneClass}`}>
                      {isCritical && (
                        <span className="radar-pulse h-1.5 w-1.5 rounded-full bg-critical text-critical" />
                      )}
                      {item.daysUntilStockout ?? '—'} días
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-ink-muted">
                    {item.suggestedReorderQty > 0 ? `+${item.suggestedReorderQty}` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}