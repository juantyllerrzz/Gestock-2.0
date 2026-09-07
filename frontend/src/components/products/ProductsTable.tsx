import { Pencil, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Product } from '../../lib/types';

interface ProductsTableProps {
  products: Product[];
  canManage: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({ products, canManage, onEdit, onDelete }: ProductsTableProps) {
  if (products.length === 0) {
    return <Card><p className="text-sm text-ink-muted">Todavía no hay productos registrados.</p></Card>;
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Categoría</th>
              <th className="px-5 py-3 font-medium">Precio</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Mínimo</th>
              {canManage && <th className="px-5 py-3 font-medium">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0">
                <td className="px-5 py-3.5 font-mono text-ink-muted">{p.sku}</td>
                <td className="px-5 py-3.5 font-medium text-ink">{p.name}</td>
                <td className="px-5 py-3.5 text-ink-muted">{p.category?.name ?? '—'}</td>
                <td className="px-5 py-3.5 font-mono text-ink-muted">${Number(p.unitPrice).toLocaleString('es-CO')}</td>
                <td className="px-5 py-3.5 font-mono">
                  <span className={p.currentStock <= p.minStock ? 'text-warn' : 'text-ink-muted'}>{p.currentStock}</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-ink-muted">{p.minStock}</td>
                {canManage && (
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(p)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:text-signal" aria-label="Editar">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => onDelete(p)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:text-critical" aria-label="Eliminar">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}