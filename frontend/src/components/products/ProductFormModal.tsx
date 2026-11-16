
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

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

export function ProductFormModal({
  open,
  onClose,
  onSubmit,
  categories,
  product,
}: ProductFormModalProps) {

  const [form, setForm] = useState<ProductInput>({
    ...EMPTY_FORM,
  });

  // Los campos numéricos se manejan como texto
  // para permitir que permanezcan vacíos.
  const [unitPrice, setUnitPrice] = useState('');
  const [minStock, setMinStock] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // =====================================
  // CARGAR O LIMPIAR FORMULARIO
  // =====================================

  useEffect(() => {
    if (!open) return;

    if (product) {
      // EDITAR PRODUCTO
      setForm({
        sku: product.sku,
        name: product.name,
        description: product.description ?? '',
        unitPrice: Number(product.unitPrice),
        minStock: product.minStock,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl ?? '',
      });

      // Mostrar valores existentes al editar
      setUnitPrice(String(product.unitPrice));
      setMinStock(String(product.minStock));

    } else {
      // NUEVO PRODUCTO
      setForm({
        ...EMPTY_FORM,
        categoryId: categories[0]?.id ?? '',
      });

      // Comenzar con ambos campos vacíos
      setUnitPrice('');
      setMinStock('');
    }

    setError(null);

  }, [product, categories, open]);

  // =====================================
  // SELECCIONAR FOTO
  // =====================================

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    e.target.value = '';

    if (!file) return;

    if (
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png'
    ) {
      setError('La imagen debe ser JPG o PNG.');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError(
        'La imagen no puede pesar más de 1 MB.',
      );
      return;
    }

    setError(null);

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        imageUrl: String(reader.result),
      }));
    };

    reader.readAsDataURL(file);
  }

  // =====================================
  // GUARDAR PRODUCTO
  // =====================================

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (saving) return;

    setError(null);

    // Verificar campos vacíos
    if (
      unitPrice.trim() === '' ||
      minStock.trim() === ''
    ) {
      setError(
        'Debes ingresar el precio y el stock mínimo.',
      );
      return;
    }

    // Convertir a números al guardar
    const price = Number(unitPrice);
    const stock = Number(minStock);

    // Validar precio
    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError(
        'El precio debe ser un número válido mayor o igual a 0.',
      );
      return;
    }

    // Validar stock mínimo
    if (
      !Number.isSafeInteger(stock) ||
      stock < 0
    ) {
      setError(
        'El stock mínimo debe ser un número entero mayor o igual a 0.',
      );
      return;
    }

    // Validar categoría
    if (!form.categoryId) {
      setError('Selecciona una categoría.');
      return;
    }

    setSaving(true);

    try {
      // Enviar los números correctamente al backend
      await onSubmit({
        ...form,
        unitPrice: price,
        minStock: stock,
      });

      onClose();

    } catch (err) {
      setError(getErrorMessage(err));

    } finally {
      setSaving(false);
    }
  }

  // =====================================
  // INTERFAZ DEL FORMULARIO
  // =====================================

  return (
    <Modal
      open={open}
      title={product ? 'Editar producto' : 'Nuevo producto'}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        {error && <Alert>{error}</Alert>}

        {/* FOTO DEL PRODUCTO */}

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-muted">
            Foto del producto
          </span>

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
                {form.imageUrl
                  ? 'Cambiar foto'
                  : 'Subir foto'}

                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      imageUrl: '',
                    }))
                  }
                  className="flex items-center gap-1 text-xs text-ink-muted hover:text-critical"
                >
                  <X className="h-3 w-3" />
                  Quitar
                </button>
              )}

              <span className="text-xs text-ink-muted">
                JPG o PNG, máximo 1 MB
              </span>

            </div>
          </div>
        </div>

        {/* SKU */}

        <Input
          label="SKU"
          value={form.sku}
          onChange={(e) =>
            setForm({
              ...form,
              sku: e.target.value,
            })
          }
          disabled={!!product}
          required
        />

        {/* NOMBRE */}

        <Input
          label="Nombre"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          required
        />

        {/* DESCRIPCIÓN */}

        <Input
          label="Descripción"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        {/* CATEGORÍA */}

        <Select
          label="Categoría"
          value={form.categoryId}
          onChange={(e) =>
            setForm({
              ...form,
              categoryId: e.target.value,
            })
          }
          required
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </Select>

        {/* PRECIO UNITARIO */}

        <Input
          label="Precio unitario"
          type="number"
          min={0}
          step="0.01"
          placeholder="Ingresa el precio"
          value={unitPrice}
          onChange={(e) =>
            setUnitPrice(e.target.value)
          }
          required
        />

        {/* STOCK MÍNIMO */}

        <Input
          label="Stock mínimo"
          type="number"
          min={0}
          step="1"
          placeholder="Ingresa el stock mínimo"
          value={minStock}
          onChange={(e) =>
            setMinStock(e.target.value)
          }
          required
        />

        {/* BOTÓN GUARDAR */}

        <Button
          type="submit"
          loading={saving}
          className="mt-2 w-full"
        >
          {product
            ? 'Guardar cambios'
            : 'Crear producto'}
        </Button>

      </form>
    </Modal>
  );
}
