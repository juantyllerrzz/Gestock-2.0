import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Gestock" <no-reply@gestock.com>',
        to,
        subject: 'Recuperacion de clave - Gestock',
        html: `
          <p>Recibimos una solicitud para restablecer tu clave.</p>
          <p><a href="${resetLink}">Haz click aqui para crear una nueva clave</a></p>
          <p>Este enlace expira en 30 minutos. Si tu no solicitaste esto, ignora este correo.</p>
        `,
      });
    } catch (error) {
      this.logger.error('No se pudo enviar el correo de recuperacion', error);
    }
  }

  async sendVerificationEmail(to: string, verifyLink: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Gestock" <no-reply@gestock.com>',
        to,
        subject: 'Confirma tu correo - Gestock',
        html: `
          <p>Gracias por registrarte en Gestock.</p>
          <p><a href="${verifyLink}">Haz click aqui para confirmar tu correo</a></p>
          <p>Este enlace expira en 24 horas. Hasta que confirmes, no podras iniciar sesion.</p>
        `,
      });
    } catch (error) {
      this.logger.error('No se pudo enviar el correo de verificacion', error);
    }
  }
}