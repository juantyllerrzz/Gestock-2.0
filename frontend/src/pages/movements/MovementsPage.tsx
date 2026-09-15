import { useEffect, useState, type FormEvent } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useMovements, type MovementType } from '../../hooks/useMovements';
import { api, getErrorMessage } from '../../lib/api';
import type { Product } from '../../lib/types';

export function MovementsPage() {
  const { movements, loading, error, createMovement } = useMovements();
  const [products, setProducts] = useState<Product[]>([]);

  const [productId, setProductId] = useState('');
  const [type, setType] = useState<MovementType>('IN');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<Product[]>('/products').then((res) => {
      setProducts(res.data);
      if (res.data[0]) setProductId(res.data[0].id);
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await createMovement({ type, quantity, productId, note: note || undefined });
      setQuantity(1);
      setNote('');
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell>
      <h1 className="font-display text-2xl font-semibold text-ink">Movimientos</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Registra entradas y salidas de stock, y consulta el historial reciente.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <h2 className="mb-4 font-display text-base font-semibold text-ink">Registrar movimiento</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && <Alert>{formError}</Alert>}
            <Select label="Producto" value={productId} onChange={(e) => setProductId(e.target.value)} required>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (stock: {p.currentStock})
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('IN')}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  type === 'IN' ? 'border-signal bg-signal/10 text-signal' : 'border-border text-ink-muted hover:text-ink'
                }`}
              >
                <ArrowDownCircle className="h-4 w-4" />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setType('OUT')}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  type === 'OUT' ? 'border-warn bg-warn/10 text-warn' : 'border-border text-ink-muted hover:text-ink'
                }`}
              >
                <ArrowUpCircle className="h-4 w-4" />
                Salida
              </button>
            </div>

            <Input
              label="Cantidad"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
            <Input label="Nota (opcional)" value={note} onChange={(e) => setNote(e.target.value)} />

            <Button type="submit" loading={saving} className="mt-2 w-full" disabled={!productId}>
              Registrar {type === 'IN' ? 'entrada' : 'salida'}
            </Button>
          </form>
        </Card>

        <div>
          <h2 className="mb-3 font-display text-base font-semibold text-ink">Historial reciente</h2>
          {error && <p className="mb-3 text-sm text-critical">{error}</p>}
          {loading ? (
            <p className="text-sm text-ink-muted">Cargando...</p>
          ) : movements.length === 0 ? (
            <Card>
              <p className="text-sm text-ink-muted">Todavía no hay movimientos registrados.</p>
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
                    {movements.map((m) => (
                      <tr key={m.id} className="border-b border-border/60 last:border-0">
                        <td className="px-5 py-3.5 font-mono text-ink-muted">
                          {new Date(m.createdAt).toLocaleDateString('es-CO')}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-ink">{m.product.name}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 font-medium ${
                              m.type === 'IN' ? 'text-signal' : 'text-warn'
                            }`}
                          >
                            {m.type === 'IN' ? (
                              <ArrowDownCircle className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUpCircle className="h-3.5 w-3.5" />
                            )}
                            {m.type === 'IN' ? 'Entrada' : 'Salida'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-ink-muted">{m.quantity}</td>
                        <td className="px-5 py-3.5 text-ink-muted">{m.user.name}</td>
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