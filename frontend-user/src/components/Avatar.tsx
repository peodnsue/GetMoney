import { useState } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarProps {
  name?: string;
  avatar?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name = '', avatar, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const hasValidAvatar = avatar && !imageError;

  return (
    <div
      className={cn(
        sizes[size],
        'rounded-full flex items-center justify-center font-medium text-sm overflow-hidden',
        className
      )}
    >
      {hasValidAvatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-purple-500 text-white">
          {name ? initial : <User className="w-1/2 h-1/2" />}
        </span>
      )}
    </div>
  );
}
