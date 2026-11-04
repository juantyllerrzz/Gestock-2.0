import type { ReactNode } from 'react';

interface AlertProps {
  variant?: 'error' | 'success';
  children: ReactNode;
}

export function Alert({ variant = 'error', children }: AlertProps) {
  const styles =
    variant === 'error'
      ? 'border-critical/30 bg-critical/10 text-critical'
      : 'border-signal/30 bg-signal/10 text-signal';
  return (
    <div className={`rounded-lg border px-3.5 py-2.5 text-sm ${styles}`} role="status">
      {children}
    </div>
  );
}
