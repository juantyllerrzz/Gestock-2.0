import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { DashboardSummary, Forecast, Product } from '../lib/types';

export function useDashboardData() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const [summaryRes, forecastsRes, productsRes] = await Promise.all([
        api.get<DashboardSummary>('/forecasting/dashboard'),
        api.get<Forecast[]>('/forecasting'),
        api.get<Product[]>('/products'),
      ]);
      setSummary(summaryRes.data);
      setForecasts(forecastsRes.data);
      setProducts(productsRes.data);
    } catch {
      setError('No se pudo cargar la información del dashboard.');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  async function regenerateForecasts() {
    setRefreshing(true);
    try {
      await api.post('/forecasting/all');
      await fetchData();
    } catch {
      setError('No se pudieron regenerar las predicciones.');
    } finally {
      setRefreshing(false);
    }
  }

  return { summary, forecasts, products, loading, refreshing, error, regenerateForecasts };
}