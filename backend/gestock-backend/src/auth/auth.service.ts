
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { Role } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { RegisterDto } from './dto/register.dto';

// Tiempo de duración de los enlaces
const RESET_TOKEN_TTL_MINUTES = 30;
const VERIFICATION_TOKEN_TTL_HOURS = 24;

// Generar tokens criptográficamente seguros
function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}


  private buildFrontendLink(
    path: string,
    token: string,
  ): string {
    const baseUrl =
      process.env.APP_URL || 'http://localhost:5173';

    const url = new URL(path, baseUrl);
    url.searchParams.set('token', token);

    return url.toString();
  }

  

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Debes confirmar tu correo antes de iniciar sesión',
      );
    }

    return this.buildAuthResponse(user);
  }


  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException(
        'Ya existe una cuenta con este correo',
      );
    }


    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: Role.EMPLOYEE,
        emailVerified: false,
      },
    });


    const token = await this.createVerificationToken(
      user.id,
    );

  
    const verificationLink = this.buildFrontendLink(
      '/verify-email',
      token,
    );


    await this.mailerService.sendVerificationEmail(
      user.email,
      verificationLink,
    );

    return {
      message:
        'Cuenta creada correctamente. Revisa tu correo electrónico para activar tu cuenta.',
    };
  }


  private async createVerificationToken(
    userId: string,
  ): Promise<string> {
    const token = generateSecureToken();

    const expiresAt = new Date(
      Date.now() +
        VERIFICATION_TOKEN_TTL_HOURS *
          60 *
          60 *
          1000,
    );

    await this.prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  

  async verifyEmail(token: string) {
    const verificationToken =
      await this.prisma.emailVerificationToken.findUnique({
        where: { token },
      });

    if (
      !verificationToken ||
      verificationToken.used ||
      verificationToken.expiresAt <= new Date()
    ) {
      throw new BadRequestException(
        'El enlace de confirmación es inválido o expiró',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      const consumed =
        await tx.emailVerificationToken.updateMany({
          where: {
            id: verificationToken.id,
            used: false,
            expiresAt: {
              gt: new Date(),
            },
          },
          data: {
            used: true,
          },
        });

      if (consumed.count !== 1) {
        throw new BadRequestException(
          'El enlace ya fue utilizado o expiró',
        );
      }

      await tx.user.update({
        where: {
          id: verificationToken.userId,
        },
        data: {
          emailVerified: true,
        },
      });
    });

    return {
      message:
        'Correo confirmado correctamente. Ya puedes iniciar sesión en Gestock.',
    };
  }



  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && !user.emailVerified) {
      const token = await this.createVerificationToken(
        user.id,
      );

      const verificationLink =
        this.buildFrontendLink(
          '/verify-email',
          token,
        );

      await this.mailerService.sendVerificationEmail(
        user.email,
        verificationLink,
      );
    }

    return {
      message:
        'Si existe una cuenta pendiente de confirmación, recibirás un correo con las instrucciones.',
    };
  }



  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

  
    const message =
      'Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.';

    if (!user) {
      return { message };
    }


    const token = generateSecureToken();

    const expiresAt = new Date(
      Date.now() +
        RESET_TOKEN_TTL_MINUTES * 60 * 1000,
    );

    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const resetLink = this.buildFrontendLink(
      '/reset-password',
      token,
    );

    await this.mailerService.sendPasswordResetEmail(
      user.email,
      resetLink,
    );

    return { message };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ) {
    const resetToken =
      await this.prisma.passwordResetToken.findUnique({
        where: { token },
      });

    if (
      !resetToken ||
      resetToken.used ||
      resetToken.expiresAt <= new Date()
    ) {
      throw new BadRequestException(
        'El enlace de recuperación es inválido o expiró',
      );
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10,
    );

    // Actualizar contraseña e invalidar token
    await this.prisma.$transaction(async (tx) => {
      const consumed =
        await tx.passwordResetToken.updateMany({
          where: {
            id: resetToken.id,
            used: false,
            expiresAt: {
              gt: new Date(),
            },
          },
          data: {
            used: true,
          },
        });

      if (consumed.count !== 1) {
        throw new BadRequestException(
          'El enlace ya fue utilizado o expiró',
        );
      }

      await tx.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          password: hashedPassword,
        },
      });
    });

    return {
      message:
        'Contraseña actualizada correctamente. Ya puedes iniciar sesión.',
    };
  }


  private buildAuthResponse(user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
