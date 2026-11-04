import { Injectable, NotFoundException } from '@nestjs/common';
import { Movement, MovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const LOOKBACK_DAYS = 30;

@Injectable()
export class ForecastingService {
  constructor(private prisma: PrismaService) {}

  // Calcula el consumo promedio diario de un producto a partir de sus
  // salidas (OUT) en los ultimos LOOKBACK_DAYS dias, y con eso proyecta
  // en cuantos dias se queda sin stock y cuanto conviene reabastecer.
  async generateForProduct(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const since = new Date();
    since.setDate(since.getDate() - LOOKBACK_DAYS);

    const outMovements = await this.prisma.movement.findMany({
      where: { productId, type: MovementType.OUT, createdAt: { gte: since } },
    });

    const totalConsumed = outMovements.reduce(
      (sum: number, m: Movement) => sum + m.quantity,
      0,
    );
    const avgDailyConsumption = totalConsumed / LOOKBACK_DAYS;

    const daysUntilStockout =
      avgDailyConsumption > 0 ? Math.floor(product.currentStock / avgDailyConsumption) : null;

    // Reabastecer para cubrir el punto de reorden + un colchon de 15 dias.
    const suggestedReorderQty = Math.max(
      0,
      Math.ceil(avgDailyConsumption * 15 + product.minStock - product.currentStock),
    );

    return this.prisma.forecast.create({
      data: {
        productId,
        avgDailyConsumption,
        daysUntilStockout,
        suggestedReorderQty,
      },
    });
  }

  // Genera el forecast de todos los productos de una vez, util para
  // poblar el dashboard principal del frontend.
  async generateForAll() {
    const products = await this.prisma.product.findMany({ select: { id: true } });
    const forecasts = [];
    for (const p of products) {
      forecasts.push(await this.generateForProduct(p.id));
    }
    return forecasts;
  }

  // El forecast mas reciente por producto (uno solo, no el historial completo).
  // Se usa para pintar la tabla/gráfica principal del dashboard.
  async getLatestForecasts() {
    const forecasts = await this.prisma.forecast.findMany({
      orderBy: { generatedAt: 'desc' },
      include: { product: true },
    });

    const seen = new Set<string>();
    const latest = [];
    for (const forecast of forecasts) {
      if (!seen.has(forecast.productId)) {
        seen.add(forecast.productId);
        latest.push(forecast);
      }
    }
    return latest;
  }

  // Resumen para las tarjetas superiores del dashboard: total de productos,
  // cuantos estan por debajo de su stock minimo, y los 5 mas criticos
  // segun dias estimados hasta agotarse.
  async getDashboardSummary() {
    const [totalProducts, latestForecasts] = await Promise.all([
      this.prisma.product.count(),
      this.getLatestForecasts(),
    ]);

    const lowStockCount = latestForecasts.filter(
      (f) => f.product.currentStock <= f.product.minStock,
    ).length;

    const productsAtRisk = latestForecasts
      .filter((f) => f.daysUntilStockout !== null)
      .sort((a, b) => (a.daysUntilStockout ?? 0) - (b.daysUntilStockout ?? 0))
      .slice(0, 5)
      .map((f) => ({
        productId: f.productId,
        productName: f.product.name,
        currentStock: f.product.currentStock,
        daysUntilStockout: f.daysUntilStockout,
        suggestedReorderQty: f.suggestedReorderQty,
      }));

    return { totalProducts, lowStockCount, productsAtRisk };
  }
}
