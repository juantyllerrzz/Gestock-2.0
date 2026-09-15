import { IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsString() token!: string;

  @IsStrongPassword(
    { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    {
      message:
        'La clave debe tener minimo 8 caracteres, con al menos una mayuscula, una minuscula, un numero y un simbolo',
    },
  )
  newPassword!: string;
}