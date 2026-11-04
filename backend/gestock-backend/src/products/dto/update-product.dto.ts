import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Todos los campos de creacion, pero opcionales: permite actualizar
// solo el precio, o solo el stock minimo, sin reenviar todo el producto.
export class UpdateProductDto extends PartialType(CreateProductDto) {}
