import { IsEmail, IsString, MinLength } from 'class-validator';

// Registro publico: siempre entra como EMPLOYEE.
// Subir a MANAGER/ADMIN se hace despues desde /users (protegido).
export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
