
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { api, getErrorMessage } from '../../lib/api';

type Status = 'loading' | 'success' | 'error';

// Compartimos las solicitudes entre montajes del componente.
// Así evitamos consumir dos veces el mismo token.
const verificationRequests = new Map<string, Promise<string>>();

function verifyToken(token: string): Promise<string> {
  const existingRequest = verificationRequests.get(token);

  if (existingRequest) {
    return existingRequest;
  }

  const request = api
    .post<{ message?: string }>('/auth/verify-email', { token })
    .then((res) => {
      return res.data.message || 'Tu cuenta fue verificada correctamente.';
    })
    .catch((error: unknown) => {
      verificationRequests.delete(token);
      throw error;
    });

  verificationRequests.set(token, request);

  return request;
}

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    if (!token) {
      setStatus('error');
      setMessage('Este enlace no incluye un token válido.');
      return;
    }

    setStatus('loading');
    setMessage('');

    verifyToken(token)
      .then((responseMessage) => {
        if (!active) return;

        setStatus('success');
        setMessage(responseMessage);
      })
      .catch((error: unknown) => {
        if (!active) return;

        setStatus('error');
        setMessage(getErrorMessage(error));
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AuthLayout title="Confirmación de correo" subtitle="">
      <div className="flex flex-col items-center gap-4 text-center">

        {status === 'loading' && (
          <p className="text-sm text-ink-muted">
            Confirmando tu correo...
          </p>
        )}

        {status === 'success' && (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 text-signal">
              <CheckCircle2 className="h-6 w-6" />
            </span>

            <h2 className="text-lg font-semibold text-ink">
              ¡Cuenta verificada!
            </h2>

            <p className="text-sm text-ink">
              {message}
            </p>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Ir a iniciar sesión
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-critical/10 text-critical">
              <XCircle className="h-6 w-6" />
            </span>

            <p className="text-sm text-critical">
              {message}
            </p>

            <Link
              to="/login"
              className="text-sm text-signal hover:underline"
            >
              Volver al login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
