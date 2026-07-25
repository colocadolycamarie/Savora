import { useId } from 'react';
import { cn } from '@/lib/utils';

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
};

type InputFieldProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & { as?: 'input' };

type TextareaFieldProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' };

type SelectFieldProps = BaseProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    as: 'select';
    children: React.ReactNode;
  };

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

const fieldClasses = (hasError: boolean) =>
  cn(
    'w-full bg-transparent border-b pb-2 text-lg font-serif transition-colors placeholder:text-foreground/25 focus-visible:outline-none',
    hasError
      ? 'border-destructive text-foreground'
      : 'border-white/20 text-foreground focus:border-primary',
  );

/**
 * Shared label + control + error/hint wrapper. Keeps every form field in the
 * app visually consistent and correctly wired for screen readers (label
 * `for`, `aria-invalid`, `aria-describedby`) without repeating that
 * boilerplate on every page.
 */
export function FormField(props: FormFieldProps) {
  const autoId = useId();
  const { label, error, hint, optional, className, id, ...rest } = props;
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={fieldId}
        className="text-xs uppercase tracking-widest text-foreground/60 flex justify-between gap-2"
      >
        <span>
          {label}
          {optional && (
            <span className="normal-case text-foreground/35 tracking-normal">
              {' '}
              (optional)
            </span>
          )}
        </span>
      </label>

      {props.as === 'textarea' ? (
        <textarea
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(fieldClasses(!!error), 'resize-none h-28')}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : props.as === 'select' ? (
        <select
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(fieldClasses(!!error), 'appearance-none')}
          {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {(props as SelectFieldProps).children}
        </select>
      ) : (
        <input
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={fieldClasses(!!error)}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive font-sans">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-foreground/40 font-sans">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
