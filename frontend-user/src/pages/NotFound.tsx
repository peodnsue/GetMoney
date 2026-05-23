import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import BackButton from '../components/BackButton';

export function NotFoundPage() {
  const location = useLocation();

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('show404'));
    return () => {
      window.dispatchEvent(new CustomEvent('hide404'));
    };
  }, []);

  return (
    <div className="min-h-screen gold-gradient relative flex items-center justify-center p-8">
      <BackButton text="返回首页" to="/" />
      <div className="bg-white/95 backdrop-blur rounded-3xl p-16 shadow-2xl max-w-lg text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <span className="text-5xl">🦆</span>
        </div>
        <h1 className="text-8xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-10">抱歉，页面不存在</p>
        <div className="flex justify-center">
          <BackButton text="返回首页" to="/" />
        </div>
      </div>
    </div>
  );
}
