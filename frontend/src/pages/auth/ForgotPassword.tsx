import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { api, getErrorMessage } from '../../lib/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      // El backend siempre responde igual, exista o no el correo,
      // asi que el mensaje de exito es genuino en ambos casos.
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Recuperar clave"
      subtitle="Te enviamos un enlace para crear una nueva"
    >
      {sent ? (
        <Alert variant="success">
          Si el correo está registrado, te llegó un enlace para restablecer tu clave.
          Revisa tu bandeja de entrada (o Mailtrap si estás en modo de pruebas).
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <Alert>{error}</Alert>}
          <Input
            label="Correo"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} className="mt-2 w-full">
            Enviar enlace
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-ink-muted">
        <Link to="/login" className="text-signal hover:underline">
          Volver al login
        </Link>
      </p>
    </AuthLayout>
  );
}
