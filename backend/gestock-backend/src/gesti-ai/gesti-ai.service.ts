
import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GestiAiService {
  private readonly logger = new Logger(GestiAiService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}


  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[¿?¡!.,;:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }



  private reply(message: string) {
    return {
      message,
      mode: 'local',
    };
  }


  private help() {
    return this.reply(
      `¡Hola! Soy Gesti, tu asistente de inventarios 

Puedes preguntarme:

• ¿Cuántos productos tengo registrados?
• ¿Qué productos tienen stock bajo?
• Dame un resumen del inventario.
• ¿Cuántas entradas y salidas tengo?
• Muéstrame los últimos movimientos.
• ¿Cuál es el stock de Teclado mecánico?
• Muéstrame los productos registrados.

Estoy conectado a tu base de datos de Gestock.`
    );
  }


  async ask(question: string) {
    if (
      typeof question !== 'string' ||
      !question.trim() ||
      question.length > 400
    ) {
      throw new BadRequestException(
        'Escribe una pregunta válida de máximo 400 caracteres.',
      );
    }

    const query = this.normalize(question);

    this.logger.log('Procesando consulta local de Gesti AI');

    // Saludos y ayuda
    if (
      /^(hola|hola gesti|buenas|ayuda|que puedes hacer|comandos)$/.test(
        query,
      )
    ) {
      return this.help();
    }


    if (
      /movimient|entrad|salid|historial/.test(query)
    ) {
      return this.getMovementsInfo(query);
    }

   
    const productSearch = query.match(
      /(?:stock|existencias|unidades)\s+de\s+(.+)/,
    );

    if (productSearch) {
      const searchTerm = productSearch[1]
        .replace(/^(el|la|un|una)\s+/, '')
        .trim();

      return this.searchProduct(searchTerm);
    }

    
    if (
      /product|inventario|stock|agot|reabastec|reposic|resumen|catalogo|existenc/.test(
        query,
      )
    ) {
      return this.getInventoryInfo(query);
    }

    
    return this.reply(
      `Todavía no sé responder esa pregunta.

Puedo ayudarte con productos, existencias, stock bajo, entradas y salidas.

Escribe "ayuda" para conocer mis funciones.`
    );
  }



  private async getInventoryInfo(query: string) {
    const products = await this.prisma.product.findMany({
      select: {
        name: true,
        sku: true,
        currentStock: true,
        minStock: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const total = products.length;

    if (total === 0) {
      return this.reply(
        'Todavía no tienes productos registrados en Gestock.',
      );
    }


    const lowStock = products.filter(
      (p) => p.currentStock <= p.minStock,
    );

    
    const outOfStock = products.filter(
      (p) => p.currentStock === 0,
    );

    
    const totalUnits = products.reduce(
      (sum, p) => sum + p.currentStock,
      0,
    );

    const wantsLowStock =
      /baj|agot|critic|minim|reabastec|reposic|escas/.test(
        query,
      );

    const wantsList =
      /list|muestr|catalogo|todos los productos/.test(query);

 

    if (wantsLowStock) {
      if (lowStock.length === 0) {
        return this.reply(
          `¡Buenas noticias! 

Actualmente tienes ${total} productos registrados.

Ninguno tiene existencias iguales o inferiores a su stock mínimo.`
        );
      }

      const details = lowStock
        .slice(0, 10)
        .map(
          (p) =>
            `• ${p.name}
  SKU: ${p.sku}
  Disponible: ${p.currentStock}
  Mínimo: ${p.minStock}
  Faltante para superar el mínimo: ${
    Math.max(0, p.minStock + 1 - p.currentStock)
  }`,
        )
        .join('\n\n');

      const remaining = lowStock.length - 10;

      return this.reply(
        ` ALERTA DE INVENTARIO

Tienes ${total} productos registrados y ${lowStock.length} necesitan atención.

${details}

${remaining > 0
  ? `Hay ${remaining} productos adicionales con stock bajo.`
  : ''}

 Recomendación:
Revisa las existencias y programa el reabastecimiento de los productos críticos.`
      );
    }



    if (wantsList) {
      const list = products
        .slice(0, 12)
        .map(
          (p) =>
            `• ${p.name} (${p.sku}): ${p.currentStock} unidades`,
        )
        .join('\n');

      return this.reply(
        ` PRODUCTOS DE GESTOCK

Total registrados: ${total}

${list}

${total > 12
  ? `Mostrando los primeros 12 de ${total} productos.`
  : ''}`
      );
    }



    return this.reply(
      ` RESUMEN DE GESTOCK

 Productos registrados: ${total}

 Unidades disponibles: ${totalUnits}

 Productos con stock bajo: ${lowStock.length}

 Productos agotados: ${outOfStock.length}

 Productos por encima del mínimo: ${
  total - lowStock.length
}

 Recomendación:
${lowStock.length > 0
  ? 'Revisa los productos con stock bajo para evitar faltantes.'
  : 'Tus productos están por encima de sus mínimos. Continúa supervisando las existencias.'}`
    );
  }



  private async searchProduct(searchTerm: string) {
    if (!searchTerm) {
      return this.reply(
        'Indícame el nombre o SKU del producto que quieres consultar.',
      );
    }

    const products = await this.prisma.product.findMany({
      select: {
        name: true,
        sku: true,
        currentStock: true,
        minStock: true,
      },
    });

    const matches = products.filter(
      (p) =>
        this.normalize(p.name).includes(searchTerm) ||
        this.normalize(p.sku).includes(searchTerm),
    );

    if (matches.length === 0) {
      return this.reply(
        `No encontré productos que coincidan con "${searchTerm}".`,
      );
    }

    const details = matches
      .slice(0, 10)
      .map((p) => {
        const status =
          p.currentStock === 0
            ? 'Agotado'
            : p.currentStock <= p.minStock
              ? 'Stock bajo'
              : 'Stock suficiente';

        return ` ${p.name}
SKU: ${p.sku}
Existencias: ${p.currentStock}
Stock mínimo: ${p.minStock}
Estado: ${status}`;
      })
      .join('\n\n');

    return this.reply(
      `${details}

${matches.length > 10
  ? `Se encontraron ${matches.length} coincidencias. Mostrando 10.`
  : ''}`
    );
  }

  

  private async getMovementsInfo(query: string) {
    const [groups, recent] = await Promise.all([
      this.prisma.movement.groupBy({
        by: ['type'],
        _count: {
          _all: true,
        },
        _sum: {
          quantity: true,
        },
      }),

      this.prisma.movement.findMany({
        take: 8,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          type: true,
          quantity: true,
          createdAt: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    const entries = groups.find((g) => g.type === 'IN');
    const exits = groups.find((g) => g.type === 'OUT');

    const entryCount = entries?._count._all ?? 0;
    const exitCount = exits?._count._all ?? 0;

    const entryUnits = entries?._sum.quantity ?? 0;
    const exitUnits = exits?._sum.quantity ?? 0;

    const wantsRecent =
      /ultim|recient|historial|detalle/.test(query);

  

    if (wantsRecent) {
      if (recent.length === 0) {
        return this.reply(
          'Todavía no hay movimientos registrados.',
        );
      }

      const list = recent
        .map((m) => {
          const type =
            m.type === 'IN' ? 'Entrada' : 'Salida';

          const date = m.createdAt.toLocaleDateString(
            'es-CO',
            { timeZone: 'America/Bogota' },
          );

          return `• ${date} | ${type}
Producto: ${m.product.name}
Cantidad: ${m.quantity}`;
        })
        .join('\n\n');

      return this.reply(
        ` ÚLTIMOS MOVIMIENTOS

${list}

Mostrando hasta 8 movimientos recientes.`
      );
    }

  

    return this.reply(
      ` MOVIMIENTOS DE INVENTARIO

ENTRADAS
Movimientos registrados: ${entryCount}
Unidades ingresadas: ${entryUnits}

SALIDAS
Movimientos registrados: ${exitCount}
Unidades retiradas: ${exitUnits}

Total de movimientos: ${
  entryCount + exitCount
}

Puedes preguntarme:
"Muéstrame los últimos movimientos".`
    );
  }
}
