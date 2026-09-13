import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { RegisterDto } from './dto/register.dto';

const RESET_TOKEN_TTL_MINUTES = 30;
const VERIFICATION_TOKEN_TTL_HOURS = 24;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales invalidas');

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Credenciales invalidas');

    if (!user.emailVerified) {
      throw new UnauthorizedException('Debes confirmar tu correo antes de iniciar sesion');
    }

    return this.buildAuthResponse(user);
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Ya existe una cuenta con este correo');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, password: hashed, role: Role.EMPLOYEE },
    });

    const code = await this.createVerificationToken(user.id);
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    await this.mailerService.sendVerificationEmail(user.email, `${baseUrl}/verify-email?token=${code}`);

    return {
      message: 'Cuenta creada. Revisa tu correo, o usa el codigo de respaldo para activarla ya mismo.',
      verificationCode: code,
    };
  }

  private async createVerificationToken(userId: string) {
    const token = generateCode();
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000);
    await this.prisma.emailVerificationToken.create({ data: { token, userId, expiresAt } });
    return token;
  }

  async verifyEmail(token: string) {
    const verificationToken = await this.prisma.emailVerificationToken.findUnique({ where: { token } });

    if (!verificationToken || verificationToken.used || verificationToken.expiresAt < new Date()) {
      throw new BadRequestException('El codigo de confirmacion es invalido o expiro');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: verificationToken.userId }, data: { emailVerified: true } }),
      this.prisma.emailVerificationToken.update({ where: { id: verificationToken.id }, data: { used: true } }),
    ]);

    return { message: 'Correo confirmado. Ya puedes iniciar sesion.' };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && !user.emailVerified) {
      const code = await this.createVerificationToken(user.id);
      const baseUrl = process.env.APP_URL || 'http://localhost:3000';
      await this.mailerService.sendVerificationEmail(user.email, `${baseUrl}/verify-email?token=${code}`);
      return { message: 'Enviamos un nuevo codigo.', verificationCode: code };
    }
    return { message: 'Si el correo existe y no ha sido confirmado, se envio un nuevo codigo.' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: 'Si el correo existe, se envio un codigo de recuperacion' };
    }

    const token = generateCode();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    await this.mailerService.sendPasswordResetEmail(user.email, `${baseUrl}/reset-password?token=${token}`);

    return {
      message: 'Te enviamos un codigo de recuperacion. Tambien puedes usar el de respaldo aqui mismo.',
      resetCode: token,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({ where: { token } });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('El codigo de recuperacion es invalido o expiro');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashed } }),
      this.prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { used: true } }),
    ]);

    return { message: 'Clave actualizada correctamente' };
  }

  private buildAuthResponse(user: { id: string; name: string; email: string; role: Role }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}