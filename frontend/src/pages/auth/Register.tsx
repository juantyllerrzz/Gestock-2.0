import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { api, getErrorMessage } from '../../lib/api';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [activateError, setActivateError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await register(name, email, password);
      setVerificationCode(res.verificationCode);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleActivateNow() {
    if (!verificationCode) return;
    setActivateError(null);
    setActivating(true);
    try {
      await api.post('/auth/verify-email', { token: verificationCode });
      navigate('/login');
    } catch (err) {
      setActivateError(getErrorMessage(err));
    } finally {
      setActivating(false);
    }
  }

  if (verificationCode) {
    return (
      <AuthLayout title="Confirma tu cuenta" subtitle="Ya casi terminas">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 text-signal">
            <MailCheck className="h-6 w-6" />
          </span>
          <Alert variant="success">
            Te enviamos un correo de confirmación a <strong>{email}</strong>.
          </Alert>

          <div className="w-full rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-ink-muted">
              ¿No te llegó el correo? Activa tu cuenta ya mismo con este código de respaldo:
            </p>
            <p className="mt-3 font-mono text-3xl font-semibold tracking-widest text-signal">
              {verificationCode}
            </p>
            {activateError && (
              <div className="mt-3">
                <Alert>{activateError}</Alert>
              </div>
            )}
            <Button
              variant="primary"
              className="mt-4 w-full"
              loading={activating}
              onClick={handleActivateNow}
            >
              Activar cuenta ahora
            </Button>
          </div>

          <Link to="/login" className="text-sm text-signal hover:underline">
            Volver al login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Empieza a controlar tu inventario">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert>{error}</Alert>}
        <Input label="Nombre completo" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Correo" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
            Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo (ej: @, #, !).
          </p>
        </div>
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Crear cuenta
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-signal hover:underline">
          Ingresa
        </Link>
      </p>
    </AuthLayout>
  );
}