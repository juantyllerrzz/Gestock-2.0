
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

import { DashboardShell } from '../../components/layout/DashboardShell';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';

import {
  useMovements,
  type MovementType,
} from '../../hooks/useMovements';

import { api, getErrorMessage } from '../../lib/api';
import type { Product } from '../../lib/types';

export function MovementsPage() {
  const {
    movements,
    loading,
    error,
    createMovement,
  } = useMovements();

  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState('');
  const [type, setType] = useState<MovementType>('IN');

  // Guardar como texto para permitir campos vacíos
  const [quantity, setQuantity] = useState('');

  const [note, setNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedProduct = products.find(
    (product) => product.id === productId,
  );

  // =====================================
  // CARGAR PRODUCTOS
  // =====================================

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await api.get<Product[]>('/products');

        if (!active) return;

        setProducts(response.data);

        if (response.data[0]) {
          setProductId(response.data[0].id);
        }
      } catch (err) {
        if (!active) return;
        setFormError(getErrorMessage(err));
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  // =====================================
  // REGISTRAR MOVIMIENTO
  // =====================================

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (saving) return;

    setFormError(null);

    // Validar que se haya seleccionado un producto
    if (!productId) {
      setFormError('Selecciona un producto.');
      return;
    }

    // Validar que la cantidad no esté vacía
    if (quantity.trim() === '') {
      setFormError('Debes ingresar una cantidad.');
      return;
    }

    // Convertir a número únicamente al guardar
    const amount = Number(quantity);

    // Validar que sea entero y mayor que cero
    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0
    ) {
      setFormError(
        'La cantidad debe ser un número entero mayor que cero.',
      );
      return;
    }

    // Validar existencias en las salidas
    if (
      type === 'OUT' &&
      selectedProduct &&
      amount > selectedProduct.currentStock
    ) {
      setFormError(
        `Stock insuficiente. Solo hay ${selectedProduct.currentStock} unidades disponibles.`,
      );
      return;
    }

    setSaving(true);

    try {
      await createMovement({
        type,
        quantity: amount,
        productId,
        note: note.trim() || undefined,
      });

      // Dejar el campo vacío después de guardar
      setQuantity('');
      setNote('');

      // Actualizar los productos para mostrar el stock nuevo
      const response = await api.get<Product[]>('/products');
      setProducts(response.data);

    } catch (err) {
      setFormError(getErrorMessage(err));

    } finally {
      setSaving(false);
    }
  }

  // =====================================
  // INTERFAZ
  // =====================================

  return (
    <DashboardShell>

      <h1 className="font-display text-2xl font-semibold text-ink">
        Movimientos
      </h1>

      <p className="mt-1 text-sm text-ink-muted">
        Registra entradas y salidas de stock, y consulta el historial reciente.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">

        {/* FORMULARIO DE MOVIMIENTOS */}

        <Card>
          <h2 className="mb-4 font-display text-base font-semibold text-ink">
            Registrar movimiento
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >

            {formError && <Alert>{formError}</Alert>}

            {/* PRODUCTO */}

            <Select
              label="Producto"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              {products.length === 0 && (
                <option value="">
                  No hay productos disponibles
                </option>
              )}

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} (stock: {product.currentStock})
                </option>
              ))}
            </Select>

            {/* IMAGEN DEL PRODUCTO */}

            {selectedProduct?.imageUrl && (
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="h-24 w-24 rounded-lg border border-border object-cover"
              />
            )}

            {/* TIPO DE MOVIMIENTO */}

            <div className="grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() => {
                  setType('IN');
                  setFormError(null);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  type === 'IN'
                    ? 'border-signal bg-signal/10 text-signal'
                    : 'border-border text-ink-muted hover:text-ink'
                }`}
              >
                <ArrowDownCircle className="h-4 w-4" />
                Entrada
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('OUT');
                  setFormError(null);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  type === 'OUT'
                    ? 'border-warn bg-warn/10 text-warn'
                    : 'border-border text-ink-muted hover:text-ink'
                }`}
              >
                <ArrowUpCircle className="h-4 w-4" />
                Salida
              </button>

            </div>

            {/* CANTIDAD */}

            <Input
              label="Cantidad"
              type="number"
              min={1}
              step={1}
              placeholder="Ingresa la cantidad"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            {/* NOTA */}

            <Input
              label="Nota (opcional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Compra a proveedor"
            />

            {/* BOTÓN GUARDAR */}

            <Button
              type="submit"
              loading={saving}
              className="mt-2 w-full"
              disabled={!productId || saving}
            >
              Registrar {type === 'IN' ? 'entrada' : 'salida'}
            </Button>

          </form>
        </Card>

        {/* HISTORIAL DE MOVIMIENTOS */}

        <div>
          <h2 className="mb-3 font-display text-base font-semibold text-ink">
            Historial reciente
          </h2>

          {error && (
            <p className="mb-3 text-sm text-critical">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-ink-muted">
              Cargando...
            </p>
          ) : movements.length === 0 ? (
            <Card>
              <p className="text-sm text-ink-muted">
                Todavía no hay movimientos registrados.
              </p>
            </Card>
          ) : (
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">

                <table className="w-full text-left text-sm">

                  <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                    <tr>
                      <th className="px-5 py-3 font-medium">Fecha</th>
                      <th className="px-5 py-3 font-medium">Producto</th>
                      <th className="px-5 py-3 font-medium">Tipo</th>
                      <th className="px-5 py-3 font-medium">Cantidad</th>
                      <th className="px-5 py-3 font-medium">Usuario</th>
                    </tr>
                  </thead>

                  <tbody>
                    {movements.map((movement) => (
                      <tr
                        key={movement.id}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="px-5 py-3.5 font-mono text-ink-muted">
                          {new Date(movement.createdAt).toLocaleDateString('es-CO')}
                        </td>

                        <td className="px-5 py-3.5 font-medium text-ink">
                          {movement.product.name}
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 font-medium ${
                              movement.type === 'IN'
                                ? 'text-signal'
                                : 'text-warn'
                            }`}
                          >
                            {movement.type === 'IN' ? (
                              <ArrowDownCircle className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUpCircle className="h-3.5 w-3.5" />
                            )}

                            {movement.type === 'IN'
                              ? 'Entrada'
                              : 'Salida'}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 font-mono text-ink-muted">
                          {movement.quantity}
                        </td>

                        <td className="px-5 py-3.5 text-ink-muted">
                          {movement.user.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </Card>
          )}
        </div>

      </div>
    </DashboardShell>
  );
}
