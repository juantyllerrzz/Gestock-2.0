
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Remitente autenticado de Gestock
  private getSender(): string {
    const email = process.env.SMTP_USER;

    if (!email) {
      throw new Error('Falta configurar SMTP_USER');
    }

    return `"Gestock" <${email}>`;
  }

  // Evita insertar caracteres HTML dentro de los enlaces
  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Plantilla visual reutilizable para los correos
  private emailTemplate(
    title: string,
    description: string,
    buttonText: string,
    link: string,
    expiration: string,
  ): string {
    const safeLink = this.escapeHtml(link);

    return `
      <div style="background:#f3f6fb;padding:35px 15px;
                  font-family:Arial,sans-serif;">
        <div style="max-width:520px;margin:auto;
                    background:#ffffff;border-radius:14px;
                    padding:35px 28px;">

          <h1 style="color:#1683d8;text-align:center;
                     margin-bottom:8px;">
            GESTOCK
          </h1>

          <p style="text-align:center;color:#64748b;
                    font-size:13px;">
            Gestión inteligente de inventarios
          </p>

          <hr style="border:0;border-top:1px solid #e2e8f0;
                     margin:25px 0;" />

          <h2 style="color:#172033;">${title}</h2>

          <p style="color:#475569;line-height:1.7;">
            ${description}
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a href="${safeLink}"
               style="display:inline-block;
                      background:#1683d8;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 27px;
                      border-radius:8px;
                      font-weight:bold;">
              ${buttonText}
            </a>
          </div>

          <p style="color:#64748b;font-size:13px;">
            Este enlace expira en ${expiration}.
          </p>

          <p style="color:#64748b;font-size:13px;">
            Si no realizaste esta solicitud, puedes ignorar
            este mensaje.
          </p>

          <hr style="border:0;border-top:1px solid #e2e8f0;
                     margin-top:30px;" />

          <p style="text-align:center;color:#94a3b8;
                    font-size:12px;">
            Gestock - Sistema de gestión de inventarios
          </p>
        </div>
      </div>
    `;
  }

  // Recuperar contraseña
  async sendPasswordResetEmail(
    to: string,
    resetLink: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.getSender(),
        to,
        subject: 'Gestock | Restablece tu contraseña',
        text:
          `Recibimos una solicitud para restablecer tu contraseña.\n\n` +
          `Abre este enlace: ${resetLink}\n\n` +
          `El enlace expira en 30 minutos.`,
        html: this.emailTemplate(
          'Recupera tu contraseña',
          'Recibimos una solicitud para restablecer la contraseña de tu cuenta Gestock.',
          'Restablecer contraseña',
          resetLink,
          '30 minutos',
        ),
      });

      this.logger.log('Correo de recuperación enviado');
    } catch (error) {
      this.logger.error(
        'No se pudo enviar el correo de recuperación',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  // Verificación de cuenta
  async sendVerificationEmail(
    to: string,
    verifyLink: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.getSender(),
        to,
        subject: 'Gestock | Confirma tu cuenta',
        text:
          `Gracias por registrarte en Gestock.\n\n` +
          `Confirma tu cuenta desde: ${verifyLink}\n\n` +
          `El enlace expira en 24 horas.`,
        html: this.emailTemplate(
          '¡Bienvenido a Gestock!',
          'Gracias por registrarte. Confirma tu correo electrónico para activar tu cuenta y comenzar a utilizar nuestra plataforma.',
          'Confirmar mi cuenta',
          verifyLink,
          '24 horas',
        ),
      });

      this.logger.log('Correo de verificación enviado');
    } catch (error) {
      this.logger.error(
        'No se pudo enviar el correo de verificación',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
