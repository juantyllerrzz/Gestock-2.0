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
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      setRegisteredEmail(email);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (registeredEmail) {
    return (
      <AuthLayout title="Confirma tu correo" subtitle="Ya casi terminas">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 text-signal">
            <MailCheck className="h-6 w-6" />
          </span>
          <Alert variant="success">
            Te enviamos un enlace de confirmación a <strong>{registeredEmail}</strong>. Ábrelo
            para activar tu cuenta antes de iniciar sesión.
          </Alert>
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
        <Input label="Clave" type="password" autoComplete="new-password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" loading={loading} className="mt-2 w-full">Crear cuenta</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-muted">
        ¿Ya tienes cuenta? <Link to="/login" className="text-signal hover:underline">Ingresa</Link>
      </p>
    </AuthLayout>
  );
}