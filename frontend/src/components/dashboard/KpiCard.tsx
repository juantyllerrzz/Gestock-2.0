import type { ReactNode } from 'react';
import { Card } from '../ui/Card';

interface KpiCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone?: 'default' | 'critical';
}

const TONE_STYLES: Record<string, string> = {
  default: 'text-signal bg-signal/10',
  critical: 'text-critical bg-critical/10',
};

export function KpiCard({ label, value, icon, tone = 'default' }: KpiCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONE_STYLES[tone]}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs text-ink-muted">{label}</p>
        <p className="font-mono text-2xl font-semibold text-ink">{value}</p>
      </div>
    </Card>
  );
}