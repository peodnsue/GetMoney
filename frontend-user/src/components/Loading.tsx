import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function Loading({ size = 'md', text }: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', text && 'py-8')}>
      <div
        className={cn(sizes[size], 'border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin')}
      />
      {text && <span className="text-sm text-gray-500">{text}</span>}
    </div>
  );
}
