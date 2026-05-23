import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
}

export function Input({
  label,
  icon,
  rightIcon,
  error,
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className={cn('relative', error ? 'focus-within:ring-2 focus-within:ring-danger-500' : '')}>
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            'w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500',
            icon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-danger-500',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-danger-500">{error}</p>}
    </div>
  );
}
