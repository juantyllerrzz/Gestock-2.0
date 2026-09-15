import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { api, getErrorMessage } from '../../lib/api';

type Status = 'loading' | 'success' | 'error';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Este enlace no incluye un token válido.');
      return;
    }
    api
      .post('/auth/verify-email', { token })
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(getErrorMessage(err));
      });
  }, [token]);

  return (
    <AuthLayout title="Confirmación de correo" subtitle="">
      <div className="flex flex-col items-center gap-4 text-center">
        {status === 'loading' && <p className="text-sm text-ink-muted">Confirmando tu correo...</p>}

        {status === 'success' && (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 text-signal">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <p className="text-sm text-ink">{message}</p>
            <Button variant="primary" className="w-full" onClick={() => navigate('/login')}>
              Ir a iniciar sesión
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-critical/10 text-critical">
              <XCircle className="h-6 w-6" />
            </span>
            <p className="text-sm text-critical">{message}</p>
            <Link to="/login" className="text-sm text-signal hover:underline">
              Volver al login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}