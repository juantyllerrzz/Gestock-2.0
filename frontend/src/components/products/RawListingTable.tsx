import { Card } from '../ui/Card';

interface RawListingTableProps {
  rows: Record<string, unknown>[];
  emptyMessage: string;
}

export function RawListingTable({ rows, emptyMessage }: RawListingTableProps) {
  if (rows.length === 0) {
    return <Card><p className="text-sm text-ink-muted">{emptyMessage}</p></Card>;
  }

  const columns = Object.keys(rows[0]);

  function formatValue(value: unknown) {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      return new Date(value).toLocaleDateString('es-CO');
    }
    return String(value);
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
            <tr>{columns.map((col) => <th key={col} className="whitespace-nowrap px-5 py-3 font-medium">{col}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/60 last:border-0">
                {columns.map((col) => (
                  <td key={col} className="whitespace-nowrap px-5 py-3.5 font-mono text-ink-muted">{formatValue(row[col])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}