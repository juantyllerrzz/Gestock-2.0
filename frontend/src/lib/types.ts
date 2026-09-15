export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  unitPrice: string; // Prisma Decimal viaja como string en el JSON
  currentStock: number;
  minStock: number;
  categoryId: string;
  category?: Category;
}

export interface ProductAtRisk {
  productId: string;
  productName: string;
  currentStock: number;
  daysUntilStockout: number | null;
  suggestedReorderQty: number;
}

export interface DashboardSummary {
  totalProducts: number;
  lowStockCount: number;
  productsAtRisk: ProductAtRisk[];
}

export interface Forecast {
  id: string;
  productId: string;
  avgDailyConsumption: number;
  daysUntilStockout: number | null;
  suggestedReorderQty: number;
  generatedAt: string;
  product: Product;
}