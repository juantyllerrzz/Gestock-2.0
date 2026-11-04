import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
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

const MAX_IMAGE_BYTES = 1024 * 1024;

const EMPTY_FORM: ProductInput = {
  sku: '',
  name: '',
  description: '',
  unitPrice: 0,
  minStock: 0,
  categoryId: '',
  imageUrl: '',
};

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
        imageUrl: product.imageUrl ?? '',
      });
    } else {
      setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '' });
    }
    setError(null);
  }, [product, categories, open]);

  // Convierte la foto elegida a texto (data URI) para guardarla en la base
  // de datos junto con el resto de los datos del producto.
  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('La imagen no puede pesar más de 1 MB.');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, imageUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  }

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

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-muted">Foto del producto</span>
          <div className="flex items-center gap-3">
            {form.imageUrl ? (
              <img
                src={form.imageUrl}
                alt="Vista previa"
                className="h-16 w-16 rounded-lg border border-border object-cover"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border text-ink-muted">
                <ImagePlus className="h-5 w-5" />
              </span>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="cursor-pointer text-sm text-signal hover:underline">
                {form.imageUrl ? 'Cambiar foto' : 'Subir foto'}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imageUrl: '' })}
                  className="flex items-center gap-1 text-xs text-ink-muted hover:text-critical"
                >
                  <X className="h-3 w-3" />
                  Quitar
                </button>
              )}
              <span className="text-xs text-ink-muted">JPG o PNG, máximo 1 MB</span>
            </div>
          </div>
        </div>

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