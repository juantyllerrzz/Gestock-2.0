import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  update(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  findAll() {
    return this.prisma.product.findMany({ include: { category: true } });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, movements: true },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  // Productos por debajo de su stock minimo: base para las alertas del dashboard.
  findLowStock() {
    return this.prisma.$queryRaw`
      SELECT * FROM "Product" WHERE "currentStock" <= "minStock"
    `;
  }

  // Criterio 6 del rubric: listado a traves de la vista SQL
  // definida en sql/01_vista_listado_productos.sql
  findAllFromView() {
    return this.prisma.$queryRaw`SELECT * FROM vista_listado_productos`;
  }

  // Criterio 7 del rubric: listado a traves del procedimiento almacenado
  // definido en sql/02_procedimiento_listado_productos.sql
  findAllFromProcedure() {
    return this.prisma.$queryRaw`SELECT * FROM obtener_listado_productos()`;
  }
}
