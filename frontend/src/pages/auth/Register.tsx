
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../lib/api';

export function Register() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Indica si el registro terminó correctamente
  const [registrationComplete, setRegistrationComplete] =
    useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      // Registramos al usuario mediante el backend
      await register(name, email, password);

      // Mostramos la confirmación sin exponer códigos
      setRegistrationComplete(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // Pantalla después de registrar al usuario
  if (registrationComplete) {
    return (
      <AuthLayout
        title="Confirma tu cuenta"
        subtitle="Ya casi terminas"
      >
        <div className="flex flex-col items-center gap-5 text-center">

          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-signal/10 text-signal">
            <MailCheck className="h-8 w-8" />
          </span>

          <div>
            <h2 className="text-lg font-semibold text-ink">
              ¡Registro completado!
            </h2>

            <p className="mt-2 text-sm text-ink-muted">
              Hemos recibido tu solicitud de registro.
            </p>
          </div>

          <Alert variant="success">
            Revisa tu correo electrónico:
            <br />
            <strong>{email}</strong>
          </Alert>

          <div className="w-full rounded-xl border border-border bg-surface p-5">
            <h3 className="font-semibold text-ink">
              Verifica tu correo electrónico
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Te hemos enviado un enlace de confirmación.
              Abre el mensaje de Gestock y presiona
              el botón de verificar tu cuenta.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Por seguridad, debes confirmar tu correo
              electrónico antes de iniciar sesión.
            </p>
          </div>

          <p className="text-xs text-ink-muted">
            ¿No encuentras el mensaje?
            Revisa tu carpeta de spam o correo no deseado.
          </p>

          <Link
            to="/login"
            className="text-sm font-medium text-signal hover:underline"
          >
            Volver al inicio de sesión
          </Link>

        </div>
      </AuthLayout>
    );
  }

  // Formulario de registro
  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a controlar tu inventario"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {error && <Alert>{error}</Alert>}

        <Input
          label="Nombre completo"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Correo"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <Input
            label="Clave"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="mt-1.5 text-xs text-ink-muted">
            Mínimo 8 caracteres, con mayúscula,
            minúscula, número y símbolo (ej: @, #, !).
          </p>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="mt-2 w-full"
        >
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="text-signal hover:underline"
        >
          Ingresa
        </Link>
      </p>
    </AuthLayout>
  );
}
