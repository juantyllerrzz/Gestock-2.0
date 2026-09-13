import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { api, getErrorMessage } from '../../lib/api';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetCode, setResetCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSent(true);
      setResetCode(res.data.resetCode ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleContinueWithCode() {
    if (!resetCode) return;
    navigate(`/reset-password?token=${resetCode}`);
  }

  return (
    <AuthLayout title="Recuperar clave" subtitle="Te enviamos un código para crear una nueva">
      {sent ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Alert variant="success">
            Si el correo está registrado, te llegó un código de recuperación.
          </Alert>

          {resetCode && (
            <div className="w-full rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-ink-muted">
                ¿No te llegó el correo? Continúa ya mismo con este código de respaldo:
              </p>
              <p className="mt-3 font-mono text-3xl font-semibold tracking-widest text-signal">
                {resetCode}
              </p>
              <Button variant="primary" className="mt-4 w-full" onClick={handleContinueWithCode}>
                Continuar con este código
              </Button>
            </div>
          )}
        </div>
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
            Enviar código
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