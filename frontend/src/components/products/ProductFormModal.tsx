import { useEffect, useState, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import type { Category, Product } from '../../lib/types';
import type { ProductInput } from '../../hooks/useProducts';
import { getErrorMessage } from '../../lib/api';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: ProductInput) => Promise<void>;
  categories: Category[];
  product?: Product | null;
}

const EMPTY_FORM: ProductInput = { sku: '', name: '', description: '', unitPrice: 0, minStock: 0, categoryId: '' };

export function ProductFormModal({ open, onClose, onSubmit, categories, product }: ProductFormModalProps) {
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        sku: product.sku,
        name: product.name,
        description: product.description ?? '',
        unitPrice: Number(product.unitPrice),
        minStock: product.minStock,
        categoryId: product.categoryId,
      });
    } else {
      setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '' });
    }
    setError(null);
  }, [product, categories, open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} title={product ? 'Editar producto' : 'Nuevo producto'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert>{error}</Alert>}
        <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} disabled={!!product} required />
        <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Select label="Categoría" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
          <option value="" disabled>Selecciona una categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <Input label="Precio unitario" type="number" min={0} step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })} required />
        <Input label="Stock mínimo" type="number" min={0} value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} required />
        <Button type="submit" loading={saving} className="mt-2 w-full">
          {product ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </form>
    </Modal>
  );
}