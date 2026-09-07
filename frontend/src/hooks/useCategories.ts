import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Category } from '../lib/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    const res = await api.get<Category[]>('/categories');
    setCategories(res.data);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCategories().finally(() => setLoading(false));
  }, [fetchCategories]);

  return { categories, loading, refetch: fetchCategories };
}