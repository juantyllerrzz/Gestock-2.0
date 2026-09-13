import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { api, getErrorMessage } from '../../lib/api';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Enlace inválido" subtitle="Falta el token de recuperación">
        <Alert>
          Este enlace no incluye un token válido. Solicita uno nuevo desde{' '}
          <Link to="/forgot-password" className="underline">recuperar clave</Link>.
        </Alert>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Crea una nueva clave" subtitle="Mínimo 8 caracteres">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert>{error}</Alert>}
        <div>
          <Input
            label="Nueva clave"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <p className="mt-1.5 text-xs text-ink-muted">
            Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo (ej: @, #, !).
          </p>
        </div>
        <Button type="submit" loading={loading} className="mt-2 w-full">Actualizar clave</Button>
      </form>
    </AuthLayout>
  );
}