import { useState } from 'react';
import { FileSpreadsheet, FileText, Plus } from 'lucide-react';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { ProductsTable } from '../../components/products/ProductsTable';
import { RawListingTable } from '../../components/products/RawListingTable';
import { ProductFormModal } from '../../components/products/ProductFormModal';
import { useProducts, type ProductInput } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useAuth } from '../../context/AuthContext';
import { downloadFile, getErrorMessage } from '../../lib/api';
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
  const { products, viewRows, procedureRows, loading, error, createProduct, updateProduct, deleteProduct } =
    useProducts();
  const { categories } = useCategories();

  const [tab, setTab] = useState<Tab>('productos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportingFormat, setExportingFormat] = useState<'pdf' | 'excel' | null>(null);

  function openCreate() { setEditingProduct(null); setModalOpen(true); }
  function openEdit(product: Product) { setEditingProduct(product); setModalOpen(true); }

  function showSuccess(message: string) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 4000);
  }

  async function handleSubmit(input: ProductInput) {
    if (editingProduct) {
      await updateProduct(editingProduct.id, input);
      showSuccess(`Producto "${input.name}" actualizado correctamente.`);
    } else {
      await createProduct(input);
      showSuccess(`Producto "${input.name}" creado correctamente.`);
    }
  }

  async function handleDelete(product: Product) {
    if (confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      await deleteProduct(product.id);
      showSuccess(`Producto "${product.name}" eliminado.`);
    }
  }

  async function handleExport(format: 'pdf' | 'excel') {
    setExportError(null);
    setExportingFormat(format);
    try {
      if (format === 'pdf') {
        await downloadFile('/export/products/pdf', 'inventario-gestock.pdf');
      } else {
        await downloadFile('/export/products/excel', 'inventario-gestock.xlsx');
      }
    } catch (err) {
      setExportError(getErrorMessage(err));
    } finally {
      setExportingFormat(null);
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Productos</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Catálogo completo, más los listados por Vista SQL y Procedimiento almacenado.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            className="border border-border"
            loading={exportingFormat === 'pdf'}
            onClick={() => handleExport('pdf')}
          >
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="ghost"
            className="border border-border"
            loading={exportingFormat === 'excel'}
            onClick={() => handleExport('excel')}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          {canManage && (
            <Button variant="primary" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Nuevo producto
            </Button>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="mt-4">
          <Alert variant="success">{successMessage}</Alert>
        </div>
      )}
      {exportError && (
        <div className="mt-4">
          <Alert>{exportError}</Alert>
        </div>
      )}

      <div className="mt-6 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id ? 'border-b-2 border-signal text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
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
            {tab === 'productos' && (
              <ProductsTable products={products} canManage={canManage} onEdit={openEdit} onDelete={handleDelete} />
            )}
            {tab === 'vista' && (
              <RawListingTable rows={viewRows} emptyMessage="La vista vista_listado_productos no devolvió filas." />
            )}
            {tab === 'procedimiento' && (
              <RawListingTable
                rows={procedureRows}
                emptyMessage="El procedimiento obtener_listado_productos no devolvió filas."
              />
            )}
          </>
        )}
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        product={editingProduct}
      />
    </DashboardShell>
  );
}