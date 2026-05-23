import { cn } from '@/lib/utils';
import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export function Select({ label, icon, error, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <select
          className={cn(
            'w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer',
            icon && 'pl-10',
            error && 'border-danger-500',
            className
          )}
          {...props}
        />
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      {error && <p className="text-sm text-danger-500">{error}</p>}
    </div>
  );
}
