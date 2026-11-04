import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MovementType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovementDto } from './dto/create-movement.dto';

@Injectable()
export class MovementsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMovementDto, userId: string) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.findUnique({ where: { id: dto.productId } });
      if (!product) throw new NotFoundException('Producto no encontrado');

      const newStock =
        dto.type === MovementType.IN
          ? product.currentStock + dto.quantity
          : product.currentStock - dto.quantity;

      if (newStock < 0) {
        throw new BadRequestException('No hay suficiente stock para esta salida');
      }

      await tx.product.update({ where: { id: dto.productId }, data: { currentStock: newStock } });
      return tx.movement.create({ data: { ...dto, userId } });
    });
  }

  findByProduct(productId: string) {
    return this.prisma.movement.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
  }

  // Historial general (mas recientes primero) con el nombre del producto
  // y del usuario ya incluidos, para pintar directo en la tabla del frontend.
  findAll() {
    return this.prisma.movement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        product: { select: { id: true, name: true, sku: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }
}