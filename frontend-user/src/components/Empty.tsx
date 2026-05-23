import { Package } from 'lucide-react';

interface EmptyProps {
  message?: string;
}

export function Empty({ message = '暂无数据' }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Package className="w-16 h-16 mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
