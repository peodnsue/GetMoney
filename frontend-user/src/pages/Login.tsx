import { useState, useEffect } from 'react';
import { Mail, Lock, User, Fingerprint } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { api } from '@/api/api';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

type LoginMode = 'email' | 'account';

export function LoginPage({ onShowToast }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginMode, setLoginMode] = useState<LoginMode>('email');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setTokens, setUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      api.auth.getCooldown(email).then((remaining) => {
        if (remaining > 0) {
          setCodeCountdown(Math.ceil(remaining / 1000));
        }
      });
    }
  }, [email]);

  useEffect(() => {
    if (codeCountdown > 0) {
      const timer = setTimeout(() => {
        setCodeCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [codeCountdown]);

  const handleSendCode = async () => {
    if (!email) {
      onShowToast('请输入邮箱', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      onShowToast('请输入正确的邮箱格式', 'error');
      return;
    }
    if (codeCountdown > 0) {
      onShowToast(`请 ${codeCountdown} 秒后再试`, 'warning');
      return;
    }
    setIsSendingCode(true);
    try {
      const type = isLogin ? 'login' : 'register';
      await api.auth.sendCode(email, type);
      onShowToast('验证码已发送到邮箱', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送失败，请重试';
      onShowToast(errorMessage, 'error');
    } finally {
      const remaining = await api.auth.getCooldown(email);
      if (remaining > 0) {
        setCodeCountdown(Math.ceil(remaining / 1000));
      }
      setIsSendingCode(false);
    }
  };

  const handleEmailLoginSubmit = async () => {
    if (isSubmitting) return;
    if (!email) {
      onShowToast('请输入邮箱', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      onShowToast('请输入正确的邮箱格式', 'error');
      return;
    }
    if (!code) {
      onShowToast('请输入验证码', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await api.auth.login({ email, code });
      if (data) {
        setTokens(data.accessToken, data.refreshToken, data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/app/home');
      } else {
        onShowToast('登录失败', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败，请重试';
      onShowToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccountLogin = async () => {
    if (isSubmitting) return;
    if (!email) {
      onShowToast('请输入邮箱', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      onShowToast('请输入正确的邮箱格式', 'error');
      return;
    }
    if (!password) {
      onShowToast('请输入密码', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await api.auth.login({ email, password });
      if (data) {
        setTokens(data.accessToken, data.refreshToken, data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/app/home');
      } else {
        onShowToast('登录失败', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败，请重试';
      onShowToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (isSubmitting) return;
    if (!email) {
      onShowToast('请输入邮箱', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      onShowToast('请输入正确的邮箱格式', 'error');
      return;
    }
    if (!password) {
      onShowToast('请输入密码', 'error');
      return;
    }
    if (password.length < 6) {
      onShowToast('密码至少6位', 'error');
      return;
    }
    if (password !== confirmPassword) {
      onShowToast('两次输入的密码不一致', 'error');
      return;
    }
    if (!code) {
      onShowToast('请输入验证码', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await api.auth.register({ email, password, code });
      if (data) {
        setTokens(data.accessToken, data.refreshToken, data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        onShowToast('注册成功', 'success');
        navigate('/app/home');
      } else {
        onShowToast('注册失败', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '注册失败，请重试';
      onShowToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    if (isLogin) {
      if (loginMode === 'email') {
        handleEmailLoginSubmit();
      } else {
        handleAccountLogin();
      }
    } else {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      <style>{`
        .flip-card {
          perspective: 1000px;
          width: 100%;
          max-width: 400px;
          height: 520px;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }
        
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          background: lightgrey;
          border-radius: 5px;
          border: 2px solid #323232;
          box-shadow: 4px 4px #323232;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
        }
        
        .switch-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 400px;
        }
        
        .switch-label {
          font-size: 14px;
          font-weight: 600;
          color: #323232;
          transition: text-decoration 0.3s;
        }
        
        .switch-label.active {
          text-decoration: underline;
        }
        
        .toggle-switch {
          position: relative;
          width: 50px;
          height: 24px;
        }
        
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #fff;
          border: 2px solid #323232;
          border-radius: 5px;
          box-shadow: 2px 2px #323232;
          transition: 0.3s;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 2px;
          bottom: 1px;
          background-color: #fff;
          border: 2px solid #323232;
          border-radius: 3px;
          box-shadow: 1px 1px #323232;
          transition: 0.3s;
        }
        
        input:checked + .toggle-slider {
          background-color: #2d8cf0;
        }
        
        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }
        
        .btn-submit {
          box-shadow: 4px 4px #323232;
          transition: all 0.1s;
        }
        
        .btn-submit:active {
          box-shadow: 0px 0px #323232;
          transform: translate(3px, 3px);
        }
        
        .btn-secondary {
          box-shadow: 2px 2px #323232;
          transition: all 0.1s;
        }
        
        .btn-secondary:active {
          box-shadow: 0px 0px #323232;
          transform: translate(2px, 2px);
        }
        
        .input-field {
          box-shadow: 4px 4px #323232;
          transition: border-color 0.3s;
        }
        
        .input-field:focus {
          border-color: #2d8cf0 !important;
        }
      `}</style>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#323232] to-gray-700 rounded-lg mb-4 shadow-[4px_4px_#323232] border-2 border-[#323232]">
          <Fingerprint className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-[25px] font-black text-[#323232] mb-2">GetMoney</h1>
        <p className="text-[#666] text-sm">{isLogin ? '欢迎回来' : '创建新账号'}</p>
      </div>

      <div className="switch-container">
        <span className={`switch-label ${isLogin ? 'active' : ''}`}>登录</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={!isLogin}
            onChange={(e) => setIsLogin(!e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className={`switch-label ${!isLogin ? 'active' : ''}`}>注册</span>
      </div>

      <div className="flip-card">
        <div className={`flip-card-inner ${!isLogin ? 'flipped' : ''}`}>
          <div className="flip-card-front">
            <h2 className="text-[20px] font-black text-center text-[#323232] mb-6">登录</h2>
            
            <div className="flex bg-white rounded-lg p-1 border-2 border-[#323232] shadow-[2px_2px_#323232] mb-4">
              <button
                onClick={() => setLoginMode('email')}
                className={`flex-1 px-4 py-2 rounded-md text-center text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  loginMode === 'email' ? 'bg-[#323232] text-white' : 'text-[#666] hover:text-[#323232]'
                }`}
              >
                <Mail className="w-4 h-4" />
                邮箱验证
              </button>
              <button
                onClick={() => setLoginMode('account')}
                className={`flex-1 px-4 py-2 rounded-md text-center text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  loginMode === 'account' ? 'bg-[#323232] text-white' : 'text-[#666] hover:text-[#323232]'
                }`}
              >
                <User className="w-4 h-4" />
                账号密码
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#666]">邮箱地址</label>
                <Input
                  icon={<Mail className="w-4 h-4 text-[#666]" />}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full h-10 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] placeholder-[#666] outline-none pl-10 input-field"
                />
              </div>

              {loginMode === 'email' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#666]">验证码</label>
                  <div className="flex gap-2">
                    <Input
                      icon={<Lock className="w-4 h-4 text-[#666]" />}
                      placeholder="6位数字"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      type="text"
                      maxLength={6}
                      className="flex-1 h-10 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] placeholder-[#666] outline-none pl-10 input-field"
                    />
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleSendCode}
                      disabled={isSendingCode || codeCountdown > 0}
                      className="h-10 px-4 text-sm bg-white border-2 border-[#323232] text-[#323232] rounded-[5px] hover:bg-gray-50 disabled:opacity-50 btn-secondary"
                    >
                      {codeCountdown > 0 ? `${codeCountdown}s` : '获取'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#666]">密码</label>
                  <Input
                    icon={<Lock className="w-4 h-4 text-[#666]" />}
                    placeholder="至少6位字符"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="w-full h-10 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] placeholder-[#666] outline-none pl-10 input-field"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 text-xs text-[#666] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-[#323232] bg-white text-[#2d8cf0] focus:ring-[#2d8cf0]"
                />
                记住我
              </label>
              <button className="text-xs text-[#2d8cf0] hover:underline transition-colors">
                忘记密码？
              </button>
            </div>

            <Button 
              size="lg" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full h-10 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] font-semibold text-base hover:bg-gray-50 mt-4 btn-submit"
            >
              {isSubmitting ? '登录中...' : '登录'}
            </Button>
          </div>

          <div className="flip-card-back">
            <h2 className="text-[20px] font-black text-center text-[#323232] mb-6">注册</h2>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#666]">邮箱地址</label>
                <Input
                  icon={<Mail className="w-4 h-4 text-[#666]" />}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full h-10 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] placeholder-[#666] outline-none pl-10 input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#666]">设置密码</label>
                <Input
                  icon={<Lock className="w-4 h-4 text-[#666]" />}
                  placeholder="至少6位字符"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full h-10 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] placeholder-[#666] outline-none pl-10 input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#666]">确认密码</label>
                <Input
                  icon={<Lock className="w-4 h-4 text-[#666]" />}
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="w-full h-10 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] placeholder-[#666] outline-none pl-10 pr-10 input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#666]">邮箱验证码</label>
                <div className="flex gap-2">
                  <Input
                    icon={<Lock className="w-4 h-4 text-[#666]" />}
                    placeholder="6位数字"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    type="text"
                    maxLength={6}
                    className="flex-1 h-10 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] placeholder-[#666] outline-none pl-10 input-field"
                  />
                  <Button
                    variant="outline"
                    size="md"
                    onClick={(e) => { e.stopPropagation(); handleSendCode(); }}
                    disabled={isSendingCode || codeCountdown > 0}
                    className="h-10 px-4 text-sm bg-white border-2 border-[#323232] text-[#323232] rounded-[5px] hover:bg-gray-50 disabled:opacity-50 btn-secondary"
                  >
                    {codeCountdown > 0 ? `${codeCountdown}s` : '获取'}
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full h-10 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] font-semibold text-base hover:bg-gray-50 mt-4 btn-submit"
            >
              {isSubmitting ? '注册中...' : '注册'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#323232]"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-gray-200 text-[#666]">其他方式</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <button className="flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] hover:bg-gray-50 btn-secondary">
            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
            </svg>
            <span className="text-xs">微信</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] hover:bg-gray-50 btn-secondary">
            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.5 3h-15C3.672 3 3 3.672 3 4.5v15c0 .828.672 1.5 1.5 1.5h15c.828 0 1.5-.672 1.5-1.5v-15c0-.828-.672-1.5-1.5-1.5zm-7.071 11.712l-3.536-3.536-.708.707 4.243 4.242 7.072-7.071-.707-.707z"/>
            </svg>
            <span className="text-xs">QQ</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-[#323232] rounded-[5px] text-[#323232] hover:bg-gray-50 btn-secondary">
            <svg className="w-5 h-5 text-[#323232]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-xs">GitHub</span>
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#666]">
        <span>登录即表示同意</span>
        <button className="text-[#2d8cf0] hover:underline transition-colors">用户协议</button>
        <span>和</span>
        <button className="text-[#2d8cf0] hover:underline transition-colors">隐私政策</button>
      </div>
    </div>
  );
}