import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../ui/Card';
import type { Forecast } from '../../lib/types';

export function ConsumptionChart({ forecasts }: { forecasts: Forecast[] }) {
  const data = [...forecasts]
    .sort((a, b) => b.avgDailyConsumption - a.avgDailyConsumption)
    .slice(0, 8)
    .map((f) => ({
      name: f.product.name.length > 14 ? `${f.product.name.slice(0, 14)}…` : f.product.name,
      consumo: Number(f.avgDailyConsumption.toFixed(2)),
    }));

  if (data.length === 0) {
    return (
      <Card>
        <h2 className="mb-1 font-display text-base font-semibold text-ink">
          Consumo diario promedio por producto
        </h2>
        <p className="text-sm text-ink-muted">
          Aún no hay datos de consumo. Genera las predicciones para ver la gráfica.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-4 font-display text-base font-semibold text-ink">
        Consumo diario promedio por producto
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#233047" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#8B93A7', fontSize: 12 }}
              axisLine={{ stroke: '#233047' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#8B93A7', fontSize: 12 }}
              axisLine={{ stroke: '#233047' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#131B2E',
                border: '1px solid #233047',
                borderRadius: 8,
                fontSize: 12,
                color: '#E7ECF5',
              }}
              cursor={{ fill: 'rgba(30,136,214,0.08)' }}
            />
            <Bar dataKey="consumo" fill="#1E88D6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}