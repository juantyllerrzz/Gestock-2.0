import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, className = '', children, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={selectId} className="text-sm font-medium text-ink-muted">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-signal focus:ring-1 focus:ring-signal ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  },
);
Select.displayName = 'Select';