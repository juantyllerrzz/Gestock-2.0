import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-8 shadow-xl shadow-black/20 ${className}`}
      {...props}
    />
  );
}
