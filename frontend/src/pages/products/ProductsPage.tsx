import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { Button } from '../../components/ui/Button';
import { ProductsTable } from '../../components/products/ProductsTable';
import { RawListingTable } from '../../components/products/RawListingTable';
import { ProductFormModal } from '../../components/products/ProductFormModal';
import { useProducts, type ProductInput } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useAuth } from '../../context/AuthContext';
import type { Product } from '../../lib/types';

type Tab = 'productos' | 'vista' | 'procedimiento';
const TABS: { id: Tab; label: string }[] = [
  { id: 'productos', label: 'Productos' },
  { id: 'vista', label: 'Vista SQL' },
  { id: 'procedimiento', label: 'Procedimiento' },
];

export function ProductsPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const { products, viewRows, procedureRows, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();

  const [tab, setTab] = useState<Tab>('productos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  function openCreate() { setEditingProduct(null); setModalOpen(true); }
  function openEdit(product: Product) { setEditingProduct(product); setModalOpen(true); }

  async function handleSubmit(input: ProductInput) {
    if (editingProduct) await updateProduct(editingProduct.id, input);
    else await createProduct(input);
  }

  async function handleDelete(product: Product) {
    if (confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      await deleteProduct(product.id);
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Productos</h1>
          <p className="mt-1 text-sm text-ink-muted">Catálogo completo, más los listados por Vista SQL y Procedimiento almacenado.</p>
        </div>
        {canManage && (
          <Button variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        )}
      </div>

      <div className="mt-6 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 text-sm font-medium transition-colors ${tab === t.id ? 'border-b-2 border-signal text-ink' : 'text-ink-muted hover:text-ink'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-critical">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-ink-muted">Cargando...</p>
        ) : (
          <>
            {tab === 'productos' && <ProductsTable products={products} canManage={canManage} onEdit={openEdit} onDelete={handleDelete} />}
            {tab === 'vista' && <RawListingTable rows={viewRows} emptyMessage="La vista vista_listado_productos no devolvió filas." />}
            {tab === 'procedimiento' && <RawListingTable rows={procedureRows} emptyMessage="El procedimiento obtener_listado_productos no devolvió filas." />}
          </>
        )}
      </div>

      <ProductFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} categories={categories} product={editingProduct} />
    </DashboardShell>
  );
}