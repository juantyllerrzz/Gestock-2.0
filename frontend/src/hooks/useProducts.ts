import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Product } from '../lib/types';

export interface ProductInput {
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  minStock: number;
  categoryId: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewRows, setViewRows] = useState<Record<string, unknown>[]>([]);
  const [procedureRows, setProcedureRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setError(null);
    try {
      const [productsRes, viewRes, procedureRes] = await Promise.all([
        api.get<Product[]>('/products'),
        api.get<Record<string, unknown>[]>('/products/view'),
        api.get<Record<string, unknown>[]>('/products/procedure'),
      ]);
      setProducts(productsRes.data);
      setViewRows(viewRes.data);
      setProcedureRows(procedureRes.data);
    } catch {
      setError('No se pudieron cargar los productos.');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAll().finally(() => setLoading(false));
  }, [fetchAll]);

  async function createProduct(input: ProductInput) {
    await api.post('/products', input);
    await fetchAll();
  }

  async function updateProduct(id: string, input: Partial<ProductInput>) {
    await api.patch(`/products/${id}`, input);
    await fetchAll();
  }

  async function deleteProduct(id: string) {
    await api.delete(`/products/${id}`);
    await fetchAll();
  }

  return { products, viewRows, procedureRows, loading, error, createProduct, updateProduct, deleteProduct };
}