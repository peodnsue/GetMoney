import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { api } from '@/api/api';
import type { Banner } from '@/types';

interface HeaderBannerProps {
  onScrollToMain?: () => void;
}

export function HeaderBanner({ onScrollToMain }: HeaderBannerProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [percentage, setPercentage] = useState(0.5);
  const [isMoving, setIsMoving] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const startingPointRef = useRef<number>(0);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const data = await api.banner.list();
      if (data.length > 0) {
        setBanners(data);
      }
    } catch (error) {
      console.error('加载轮播图失败:', error);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    startingPointRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const newPercentage = (e.clientX - startingPointRef.current) / window.outerWidth + 0.5;
    setPercentage(Math.max(0.25, Math.min(0.75, newPercentage)));
    setIsMoving(true);
  };

  const handleMouseLeave = () => {
    setIsMoving(false);
    setPercentage(0.5);
  };

  const scrollToMain = () => {
    if (onScrollToMain) {
      onScrollToMain();
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleImageLoad = () => {
    setLoaded(true);
  };

  const getCurrentBanner = () => {
    return banners[0] || {
      id: 0,
      title: '校园互助接单平台',
      description: '让校园生活更便捷',
      imageUrl: 'https://picsum.photos/1920/1080?random=1',
      linkUrl: ''
    };
  };

  const currentBanner = getCurrentBanner();

  return (
    <header 
      ref={headerRef}
      className="header-banner"
      style={{ 
        '--percentage': percentage,
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none'
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="banner-view"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `translateX(calc(var(--percentage) * 100px))`,
          transition: isMoving ? 'none' : '.2s all ease-in'
        }}
      >
        {banners.length > 0 ? (
          <>
            <img 
              src={currentBanner.imageUrl} 
              alt="" 
              style={{ display: 'none' }}
              onLoad={handleImageLoad}
            />
            <div 
              className="banner-bg"
              style={{
                backgroundImage: `url(${currentBanner.imageUrl})`,
                zIndex: 10,
                opacity: `calc(1 - (var(--percentage) - 0.5) / 0.5)`
              }}
            />
            {banners.length > 1 && (
              <div 
                className="banner-bg banner-bg-2"
                style={{ backgroundImage: `url(${banners[1]?.imageUrl || currentBanner.imageUrl})` }}
              />
            )}
            {loaded && banners.length > 2 && (
              <div 
                className="banner-bg banner-bg-3"
                style={{ backgroundImage: `url(${banners[2]?.imageUrl || currentBanner.imageUrl})` }}
              />
            )}
          </>
        ) : (
          <>
            <div 
              className="banner-bg"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                zIndex: 10
              }}
            />
          </>
        )}
      </div>

      <div 
        className="banner-text-malfunction"
        data-word={currentBanner.title}
        style={{
          position: 'absolute',
          padding: '0 4px',
          top: '40%',
          left: '50.5%',
          transform: 'translate(-50%, -50%) scale(2.5)',
          fontSize: '34px',
          fontFamily: 'sans-serif',
          color: 'transparent',
          zIndex: 60
        }}
      >
        {currentBanner.title}
        <div className="banner-line" />
      </div>

      <div 
        className="banner-description"
        style={{
          position: 'absolute',
          top: '52%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '18px',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          zIndex: 60,
          textAlign: 'center'
        }}
      >
        {currentBanner.description}
      </div>

      <div 
        className="banner-scroll-wrapper"
        style={{
          position: 'absolute',
          width: '100px',
          bottom: '150px',
          left: 0,
          right: 0,
          margin: 'auto',
          fontSize: '26px',
          zIndex: 100
        }}
      >
        <button
          onClick={scrollToMain}
          className="banner-scroll-btn"
          style={{
            fontSize: '60px',
            opacity: 0.5,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            color: 'white',
            animation: 'bannerOpener 0.5s ease-in-out alternate infinite'
          }}
        >
          <ChevronDown size={60} />
        </button>
      </div>

      <div 
        className="banner-wave1"
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '75px',
          zIndex: 80,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23f9fafb\' fill-opacity=\'1\' d=\'M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
          backgroundSize: 'cover',
          transitionDuration: '.4s, .4s'
        }}
      />
      <div 
        className="banner-wave2"
        style={{
          position: 'absolute',
          bottom: 0,
          width: 'calc(100% + 100px)',
          left: '-100px',
          height: '90px',
          zIndex: 80,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23f3f4f6\' fill-opacity=\'0.5\' d=\'M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,234.7C960,235,1056,213,1152,208C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
          backgroundSize: 'cover',
          transitionDuration: '.4s, .4s'
        }}
      />

      <style>{`
        .header-banner {
          --percentage: 0.5;
        }

        .banner-bg {
          background-position: center center;
          background-size: cover;
          position: absolute;
          width: 110%;
          height: 100%;
        }

        .banner-bg-2 {
          z-index: 20;
          opacity: calc(1 - (var(--percentage) - 0.25) / 0.25);
        }

        .banner-bg-3 {
          left: -10%;
        }

        .banner-text-malfunction::before,
        .banner-text-malfunction::after {
          content: attr(data-word);
          position: absolute;
          top: 0;
          line-height: 50px;
          overflow: hidden;
          filter: contrast(200%);
        }

        .banner-text-malfunction::before {
          left: 0;
          color: red;
          text-shadow: 1px 0 0 red;
          z-index: 30;
          animation: malfunctionAni 0.95s infinite;
        }

        .banner-text-malfunction::after {
          left: -1px;
          color: cyan;
          text-shadow: -1px 0 0 cyan;
          z-index: 40;
          mix-blend-mode: lighten;
          animation: malfunctionAni 1.1s infinite 0.2s;
        }

        .banner-line {
          position: absolute;
          width: calc(100% - 8px);
          left: -0.5px;
          height: 1px;
          background: black;
          z-index: 50;
          animation: lineMove 5s ease-out infinite;
        }

        @keyframes malfunctionAni {
          10% { top: -0.4px; left: -1.1px; }
          20% { top: 0.4px; left: -0.2px; }
          30% { left: 0.5px; }
          40% { top: -0.3px; left: -0.7px; }
          50% { left: 0.2px; }
          60% { top: 1.8px; left: -1.2px; }
          70% { top: -1px; left: 0.1px; }
          80% { top: -0.4px; left: -0.9px; }
          90% { left: 1.2px; }
          100% { left: -1.2px; }
        }

        @keyframes lineMove {
          9% { top: 38px; }
          14% { top: 8px; }
          18% { top: 42px; }
          22% { top: 1px; }
          32% { top: 32px; }
          34% { top: 12px; }
          40% { top: 26px; }
          43% { top: 7px; }
          99% { top: 30px; }
        }

        @keyframes bannerOpener {
          100% { transform: translateY(10px); }
        }

        .banner-scroll-btn:hover {
          opacity: 1 !important;
        }
      `}</style>
    </header>
  );
}
