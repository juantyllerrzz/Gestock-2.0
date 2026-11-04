import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

export type MovementType = 'IN' | 'OUT';

export interface Movement {
  id: string;
  type: MovementType;
  quantity: number;
  note: string | null;
  productId: string;
  userId: string;
  createdAt: string;
  product: { id: string; name: string; sku: string };
  user: { id: string; name: string };
}

export interface MovementInput {
  type: MovementType;
  quantity: number;
  productId: string;
  note?: string;
}

export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(async () => {
    setError(null);
    try {
      const res = await api.get<Movement[]>('/movements');
      setMovements(res.data);
    } catch {
      setError('No se pudieron cargar los movimientos.');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMovements().finally(() => setLoading(false));
  }, [fetchMovements]);

  async function createMovement(input: MovementInput) {
    await api.post('/movements', input);
    await fetchMovements();
  }

  return { movements, loading, error, createMovement };
}