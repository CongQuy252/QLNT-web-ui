import * as React from 'react';

import { cn } from '@/lib/utils';
import { formatNumber } from '@/utils/utils';

type BaseProps = React.ComponentProps<'input'>;

type NumericInputProps = BaseProps & {
  numericOnly: true;
  formatComma?: boolean;
  value?: string | number;
};

type NormalInputProps = BaseProps & {
  numericOnly?: false;
  formatComma?: false;
};

type InputProps = NumericInputProps | NormalInputProps;

function Input({
  className,
  type,
  numericOnly,
  formatComma = false,
  onChange,
  value,
  ...props
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;

    if (numericOnly) {
      rawValue = rawValue.replace(/,/g, '').replace(/[^0-9]/g, '');
    }

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: rawValue,
      },
    };

    onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  const displayValue =
    formatComma && numericOnly && value !== undefined
      ? formatNumber(String(value).replace(/,/g, ''))
      : (value ?? '');

  return (
    <input
      type={type ?? 'text'}
      inputMode={numericOnly ? 'numeric' : undefined}
      pattern={numericOnly && !formatComma ? '[0-9]*' : undefined}
      value={displayValue ?? ''}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      onChange={handleChange}
      {...props}
    />
  );
}

export { Input };
