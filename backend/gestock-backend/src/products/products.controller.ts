import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Productos')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado (Token ausente o inválido).' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Obtener productos con bajo stock' })
  @ApiResponse({ status: 200, description: 'Lista de productos con stock bajo devuelta con éxito.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findLowStock() {
    return this.productsService.findLowStock();
  }

  // Criterio 6: listado mediante Vista SQL
  @Get('view')
  @ApiOperation({ summary: 'Obtener listado de productos mediante Vista SQL' })
  @ApiResponse({ status: 200, description: 'Datos de la vista SQL retornados con éxito.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findAllFromView() {
    return this.productsService.findAllFromView();
  }

  // Criterio 7: listado mediante Procedimiento almacenado
  @Get('procedure')
  @ApiOperation({ summary: 'Obtener listado de productos mediante Procedimiento Almacenado' })
  @ApiResponse({ status: 200, description: 'Datos del procedimiento almacenado retornados con éxito.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findAllFromProcedure() {
    return this.productsService.findAllFromProcedure();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  @ApiParam({ name: 'id', description: 'ID del producto a consultar' })
  @ApiResponse({ status: 200, description: 'Producto encontrado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiParam({ name: 'id', description: 'ID del producto a actualizar' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de actualización no válidos.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto a eliminar' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}