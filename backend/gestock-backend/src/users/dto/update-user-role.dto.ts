import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  @IsEnum(Role, { message: 'El rol especificado no es válido' })
  role!: Role;
}