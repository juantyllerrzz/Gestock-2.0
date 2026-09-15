import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = '', ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink-muted">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 outline-none transition-colors focus:border-signal focus:ring-1 focus:ring-signal ${className}`}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = 'Input';
