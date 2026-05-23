import { useState, useEffect } from 'react';
import {
  Coins,
  Target,
  Handshake,
  TrendingUp,
  ShieldCheck,
  Clock,
  Zap,
  Star,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  Gift,
  Users,
  Briefcase
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function Navbar({ onLoginClick, onRegisterClick }: { onLoginClick: () => void; onRegisterClick: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
              <div className="absolute inset-1 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 rounded-full flex items-center justify-center">
                <p className="text-yellow-900 font-bold text-base sm:text-lg">G</p>
              </div>
              <div className="absolute top-1 left-1.5 sm:left-2 w-2.5 sm:w-3 h-0.5 sm:h-1 bg-white/60 rounded-full transform -rotate-45"></div>
            </div>
            <span className="text-xl sm:text-2xl font-bold gradient-text-gold">GetMoney</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('features')} className="text-gray-600 hover:text-yellow-600 transition-colors font-medium">核心功能</button>
            <button onClick={() => handleNavClick('how')} className="text-gray-600 hover:text-yellow-600 transition-colors font-medium">如何赚钱</button>
            <button onClick={() => handleNavClick('gcoin')} className="text-gray-600 hover:text-yellow-600 transition-colors font-medium">G豆系统</button>
            <div className="flex items-center gap-3">
              <button onClick={onLoginClick} className="px-6 py-2.5 text-gray-700 font-medium hover:text-yellow-600 transition-colors">登录</button>
              <button onClick={onRegisterClick} className="px-6 py-2.5 gradient-bg-gold text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-yellow-500/25">
                立即注册
              </button>
            </div>
          </div>

          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="菜单"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-3 py-4 border-t border-gray-100 bg-white/98 backdrop-blur-lg rounded-b-2xl shadow-lg">
            <div className="flex flex-col gap-3 px-2">
              <button 
                onClick={() => handleNavClick('features')} 
                className="w-full text-left text-gray-700 hover:text-yellow-600 transition-colors font-medium py-3 px-4 rounded-xl hover:bg-yellow-50 active:bg-yellow-100"
              >核心功能</button>
              <button 
                onClick={() => handleNavClick('how')} 
                className="w-full text-left text-gray-700 hover:text-yellow-600 transition-colors font-medium py-3 px-4 rounded-xl hover:bg-yellow-50 active:bg-yellow-100"
              >如何赚钱</button>
              <button 
                onClick={() => handleNavClick('gcoin')} 
                className="w-full text-left text-gray-700 hover:text-yellow-600 transition-colors font-medium py-3 px-4 rounded-xl hover:bg-yellow-50 active:bg-yellow-100"
              >G豆系统</button>
              <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-gray-100">
                <button 
                  onClick={onLoginClick} 
                  className="w-full text-center text-gray-700 font-medium py-3 px-6 rounded-xl border-2 border-gray-100 hover:border-yellow-200 hover:text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100 transition-all"
                >登录</button>
                <button 
                  onClick={onRegisterClick} 
                  className="w-full text-center gradient-bg-gold text-white rounded-xl font-medium py-3 px-6 shadow-lg shadow-yellow-500/25 hover:opacity-90 active:opacity-80 transition-all"
                >立即注册</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero({ onStartClick }: { onStartClick: () => void }) {
  const handleLearnMore = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 gold-gradient overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }} />

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-6 opacity-0 animate-fade-in">
              <Star className="w-4 h-4 fill-current" />
              <span>校园任务平台 · G豆赚不停</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              轻松赚取
              <span className="gradient-text-gold"> G豆 </span>
              奖励
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              校园任务平台，发布任务、接单赚钱，G豆奖励实时到账。
              安全、便捷、高效的校园互助平台。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <button onClick={onStartClick} className="px-8 py-4 gradient-bg-gold text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-yellow-500/30 flex items-center justify-center gap-2">
                开始赚钱
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={handleLearnMore} className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center gap-2">
                了解更多
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div className="relative">
              <div className="absolute inset-0 gradient-bg-gold rounded-3xl rotate-6 opacity-20 blur-2xl" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-yellow-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full mb-4">
                    <Coins className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-700 font-medium">G豆钱包</span>
                  </div>
                  <div className="text-5xl font-bold gradient-text-gold mb-2">1,286.50</div>
                  <p className="text-gray-500">当前余额</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl card-hover">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800">累计获得</p>
                    <p className="text-sm text-green-600 mt-1 font-bold">+2,500 G豆</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl card-hover mt-8">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800">完成任务</p>
                    <p className="text-sm text-blue-600 mt-1 font-bold">28 个任务</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl card-hover">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3">
                      <Handshake className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800">发布任务</p>
                    <p className="text-sm text-purple-600 mt-1 font-bold">5 个任务</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-2xl card-hover mt-8">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800">待结算</p>
                    <p className="text-sm text-orange-600 mt-1 font-bold">+86.50 G豆</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: '海量任务',
      description: '校园各类需求任务，实时更新，轻松接单赚钱',
      color: 'from-yellow-400 to-amber-500'
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: 'G豆奖励',
      description: '完成任务获得G豆，实时到账，随时提现',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: '资金托管',
      description: '任务佣金托管在平台，确认完成后安全结算',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: '快速响应',
      description: '一键接单，实时推送，任务完成即时结算',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '超时保障',
      description: '超时自动取消，佣金原路退回，保障双方权益',
      color: 'from-teal-400 to-cyan-500'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: '信誉体系',
      description: '完善的用户评价系统，打造可信的校园社区',
      color: 'from-rose-400 to-red-500'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            为什么选择 GetMoney
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            安全可靠的任务平台，让校园生活更便捷，让付出都有回报
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm card-hover opacity-0 animate-slide-up"
              style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowToEarn() {
  const steps = [
    {
      number: '01',
      icon: <Users className="w-8 h-8" />,
      title: '注册账号',
      description: '完成校园认证，加入GetMoney大家庭'
    },
    {
      number: '02',
      icon: <Briefcase className="w-8 h-8" />,
      title: '接单赚钱',
      description: '浏览任务列表，选择感兴趣的任务一键接单'
    },
    {
      number: '03',
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: '完成任务',
      description: '按照任务要求完成工作，提交完成申请'
    },
    {
      number: '04',
      icon: <Coins className="w-8 h-8" />,
      title: '获得G豆',
      description: '任务确认后，G豆实时到账，轻松赚钱'
    }
  ];

  return (
    <section id="how" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            如何赚取 G豆
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            简单四步，轻松开启你的赚钱之旅
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white p-8 rounded-3xl shadow-sm card-hover opacity-0 animate-slide-up"
              style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-400" />
              )}
              <div className="text-5xl font-bold gradient-text-gold mb-4">{step.number}</div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white mb-6`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GcoinSystem() {
  return (
    <section id="gcoin" className="py-24 gold-gradient">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full mb-6">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700 font-medium">G豆货币系统</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            什么是 G豆
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            G豆是平台内的虚拟货币，通过完成任务获得，可用于发布任务、转账、提现
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-lg opacity-0 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">如何获得</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>完成平台任务获得奖励</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>新人注册赠送G豆</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>邀请好友获得奖励</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-lg opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white mb-6">
              <Handshake className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">如何使用</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>发布任务支付佣金</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>向其他用户转账</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>兑换平台服务</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-lg opacity-0 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">安全保障</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span>资金托管保障安全</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span>交易记录可查询</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span>国库系统支撑</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { number: '10,000+', label: '注册用户' },
    { number: '50,000+', label: '完成任务' },
    { number: '100万+', label: 'G豆流通' },
    { number: '99%', label: '满意度' }
  ];

  return (
    <section id="stats" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="opacity-0 animate-slide-up" style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}>
              <div className="text-5xl md:text-6xl font-bold gradient-text-gold mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ onRegisterClick }: { onRegisterClick: () => void }) {
  return (
    <section className="py-24 gold-gradient">
      <div className="container mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="relative p-12 md:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full mb-6">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-700 font-medium">加入我们</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              准备好赚取你的第一笔 G豆了吗？
            </h2>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
              简单注册，轻松接单，让校园生活更有价值
            </p>
            <button onClick={onRegisterClick} className="px-10 py-4 gradient-bg-gold text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-yellow-500/30">
              立即注册
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFooterNavClick = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
                <div className="absolute inset-1 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 rounded-full flex items-center justify-center">
                  <p className="text-yellow-900 font-bold text-lg">G</p>
                </div>
              </div>
              <span className="text-2xl font-bold">GetMoney</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              校园任务平台，让每一次付出都有回报，让校园生活更便捷。
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">平台功能</h4>
            <ul className="space-y-3">
              <li><button onClick={() => handleFooterNavClick('features')} className="text-gray-400 hover:text-white transition-colors">核心功能</button></li>
              <li><button onClick={() => handleFooterNavClick('how')} className="text-gray-400 hover:text-white transition-colors">如何赚钱</button></li>
              <li><button onClick={() => handleFooterNavClick('gcoin')} className="text-gray-400 hover:text-white transition-colors">G豆系统</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">帮助中心</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">常见问题</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">联系客服</Link></li>
              <li><Link to="/feedback" className="text-gray-400 hover:text-white transition-colors">意见反馈</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">法律声明</h4>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">用户协议</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">隐私政策</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2024 GetMoney 校园任务平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

interface WelcomePageProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function WelcomePage({ onShowToast }: WelcomePageProps) {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/login');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <Hero onStartClick={handleStartClick} />
      <Features />
      <HowToEarn />
      <GcoinSystem />
      <Stats />
      <CTA onRegisterClick={handleRegisterClick} />
      <Footer />
    </div>
  );
}
