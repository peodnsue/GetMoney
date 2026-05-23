import { useState, useEffect, useRef } from 'react';
import { User, Settings, Wallet, ClipboardList, MessageCircle, Star, LogOut, Edit3, ChevronRight, CreditCard, Gift, Shield, HelpCircle, Bell, History, Share2, Mail, Package, Lock, RefreshCw, Camera, Send, Coins, ArrowRightLeft, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import IdentityCard from '@/components/IdentityCard';
import { api, type GcoinWalletResponse, type GcoinTransaction } from '@/api/api';
import { useUserStore } from '@/store/userStore';
import type { User as UserType, Task } from '@/types';
import { formatMoney, getStatusText, getStatusColor } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ProfilePageProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function ProfilePage({ onShowToast }: ProfilePageProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [publishedTasks, setPublishedTasks] = useState<Task[]>([]);
  const [acceptedTasks, setAcceptedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nickname: '', email: '' });
  const [activeTab, setActiveTab] = useState<'published' | 'accepted'>('published');
  
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangeAvatarModal, setShowChangeAvatarModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState({ rating: 5, feedback: '' });
  const [changeEmailForm, setChangeEmailForm] = useState({ email: '', code: '' });
  const [changePasswordForm, setChangePasswordForm] = useState({ oldPassword: '', newPassword: '', code: '' });
  const [emailCodeTimer, setEmailCodeTimer] = useState(0);
  const [passwordCodeTimer, setPasswordCodeTimer] = useState(0);
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [gcoinWallet, setGcoinWallet] = useState<GcoinWalletResponse | null>(null);
  const [gcoinTransactions, setGcoinTransactions] = useState<GcoinTransaction[]>([]);
  const [showGcoinModal, setShowGcoinModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferForm, setTransferForm] = useState({ targetAccount: '', amount: '', remark: '' });
  const [transferIsSubmitting, setTransferIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { logout, setUser: setStoreUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadGcoinData();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (emailCodeTimer > 0) {
      timer = setInterval(() => {
        setEmailCodeTimer(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emailCodeTimer]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (passwordCodeTimer > 0) {
      timer = setInterval(() => {
        setPasswordCodeTimer(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [passwordCodeTimer]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userData, published, accepted] = await Promise.all([
        api.auth.getProfile(),
        api.task.myPublished(),
        api.task.myAccepted(),
      ]);
      setUser(userData);
      setEditForm({
        nickname: userData.nickname || '',
        email: userData.email || '',
      });
      setPublishedTasks(published);
      setAcceptedTasks(accepted);
    } catch (error) {
      console.error('加载失败:', error);
      logout();
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGcoinData = async () => {
    try {
      const wallet = await api.gcoin.getWallet();
      setGcoinWallet(wallet);
      
      const transactions = await api.gcoin.getTransactions(1, 20);
      setGcoinTransactions(transactions.records || []);
    } catch (error) {
      console.error('加载G豆数据失败:', error);
    }
  };

  const handleTransfer = async () => {
    if (transferIsSubmitting) return;
    if (!transferForm.targetAccount.trim()) {
      onShowToast('请输入目标账户', 'error');
      return;
    }
    if (!transferForm.amount.trim() || parseFloat(transferForm.amount) <= 0) {
      onShowToast('请输入有效金额', 'error');
      return;
    }

    setTransferIsSubmitting(true);
    try {
      await api.gcoin.transfer(
        transferForm.targetAccount.trim(),
        transferForm.amount.trim(),
        transferForm.remark?.trim()
      );
      onShowToast('转账成功', 'success');
      setShowTransferModal(false);
      setTransferForm({ targetAccount: '', amount: '', remark: '' });
      loadGcoinData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '转账失败';
      onShowToast(errorMessage, 'error');
    } finally {
      setTransferIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    if (!editForm.nickname.trim()) {
      onShowToast('请输入昵称', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedUser = await api.user.updateProfile({
        nickname: editForm.nickname.trim(),
      });
      setUser(updatedUser);
      setIsEditing(false);
      onShowToast('保存成功', 'success');
    } catch (error) {
      onShowToast('保存失败', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSendEmailCode = async () => {
    if (isSubmitting) return;
    if (!changeEmailForm.email.trim()) {
      onShowToast('请输入新邮箱', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changeEmailForm.email)) {
      onShowToast('请输入有效的邮箱地址', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.auth.sendCode(changeEmailForm.email);
      setEmailCodeTimer(60);
      onShowToast('验证码已发送', 'success');
    } catch (error) {
      onShowToast('发送失败', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeEmail = async () => {
    if (isSubmitting) return;
    if (!changeEmailForm.email.trim()) {
      onShowToast('请输入新邮箱', 'error');
      return;
    }
    if (!changeEmailForm.code.trim()) {
      onShowToast('请输入验证码', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changeEmailForm.email)) {
      onShowToast('请输入有效的邮箱地址', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await api.user.changeEmail(changeEmailForm.email, changeEmailForm.code);
      if (data) {
        setUser(prev => prev ? { ...prev, email: changeEmailForm.email } : null);
        setEditForm(prev => ({ ...prev, email: changeEmailForm.email }));
        setShowChangeEmailModal(false);
        setChangeEmailForm({ email: '', code: '' });
        onShowToast('邮箱修改成功', 'success');
      } else {
        onShowToast('修改失败', 'error');
      }
    } catch (error) {
      onShowToast('修改失败', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendPasswordCode = async () => {
    if (isSubmitting) return;
    if (!user?.email) {
      onShowToast('无法获取当前邮箱', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.auth.sendCode(user.email);
      setPasswordCodeTimer(60);
      onShowToast('验证码已发送到当前邮箱', 'success');
    } catch (error) {
      onShowToast('发送失败', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (isSubmitting) return;
    if (!changePasswordForm.oldPassword.trim()) {
      onShowToast('请输入旧密码', 'error');
      return;
    }
    if (!changePasswordForm.newPassword.trim()) {
      onShowToast('请输入新密码', 'error');
      return;
    }
    if (!changePasswordForm.code.trim()) {
      onShowToast('请输入验证码', 'error');
      return;
    }
    if (changePasswordForm.newPassword.length < 6) {
      onShowToast('新密码长度至少6位', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await api.user.changePassword(
        changePasswordForm.oldPassword,
        changePasswordForm.newPassword,
        changePasswordForm.code
      );
      if (data) {
        setShowChangePasswordModal(false);
        setChangePasswordForm({ oldPassword: '', newPassword: '', code: '' });
        onShowToast('密码修改成功', 'success');
      } else {
        onShowToast('修改失败', 'error');
      }
    } catch (error) {
      onShowToast('修改失败', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setTempAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (isSubmitting) return;
    if (!tempAvatarUrl) {
      onShowToast('请先选择图片', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await api.user.uploadAvatar(tempAvatarUrl);
      if (data) {
        const updatedUser = { ...user, avatar: tempAvatarUrl };
        setUser(updatedUser);
        setStoreUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setShowChangeAvatarModal(false);
        setTempAvatarUrl('');
        onShowToast('头像修改成功', 'success');
      } else {
        onShowToast('修改失败', 'error');
      }
    } catch (error) {
      onShowToast('修改失败', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAvatarModal = () => {
    setTempAvatarUrl(user?.avatar || '');
    setShowChangeAvatarModal(true);
  };

  const handleSubmitEvaluation = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const data = await api.evaluation.submit(evaluationForm.rating, evaluationForm.feedback);
      if (data && data.id) {
        setShowEvaluationModal(false);
        setEvaluationForm({ rating: 5, feedback: '' });
        onShowToast('感谢您的反馈！', 'success');
      } else {
        onShowToast('提交失败', 'error');
      }
    } catch (error) {
      onShowToast('提交失败', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems = [
    { icon: Wallet, label: '我的钱包', color: 'text-primary-500', bgColor: 'bg-primary-100', action: () => onShowToast('钱包功能开发中', 'info') },
    { icon: CreditCard, label: '银行卡管理', color: 'text-success-500', bgColor: 'bg-success-100', action: () => onShowToast('银行卡功能开发中', 'info') },
    { icon: ClipboardList, label: '订单记录', color: 'text-warning-500', bgColor: 'bg-warning-100', action: () => onShowToast('订单记录功能开发中', 'info') },
    { icon: MessageCircle, label: '消息通知', color: 'text-blue-500', bgColor: 'bg-blue-100', action: () => navigate('/app/messages') },
    { icon: Star, label: '我的反馈', color: 'text-yellow-500', bgColor: 'bg-yellow-100', action: () => setShowEvaluationModal(true) },
    { icon: Gift, label: '优惠券', color: 'text-pink-500', bgColor: 'bg-pink-100', action: () => onShowToast('优惠券功能开发中', 'info') },
    { icon: History, label: '浏览历史', color: 'text-purple-500', bgColor: 'bg-purple-100', action: () => onShowToast('浏览历史功能开发中', 'info') },
    { icon: Share2, label: '邀请好友', color: 'text-indigo-500', bgColor: 'bg-indigo-100', action: () => onShowToast('邀请好友功能开发中', 'info') },
    { icon: Shield, label: '账号安全', color: 'text-red-500', bgColor: 'bg-red-100', action: () => onShowToast('账号安全功能开发中', 'info') },
    { icon: Bell, label: '消息设置', color: 'text-cyan-500', bgColor: 'bg-cyan-100', action: () => onShowToast('消息设置功能开发中', 'info') },
    { icon: HelpCircle, label: '帮助中心', color: 'text-teal-500', bgColor: 'bg-teal-100', action: () => onShowToast('帮助中心功能开发中', 'info') },
    { icon: Settings, label: '设置', color: 'text-gray-500', bgColor: 'bg-gray-100', action: () => onShowToast('设置功能开发中', 'info') },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <p className="text-gray-500">请先登录</p>
          <Button onClick={() => {
            logout();
            navigate('/login');
          }} className="mt-4">
            登录
          </Button>
        </div>
      </div>
    );
  }

  const currentTasks = activeTab === 'published' ? publishedTasks : acceptedTasks;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-full px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <aside className="lg:col-span-1">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group cursor-pointer" onClick={handleOpenAvatarModal}>
                  <Avatar name={user.nickname} avatar={user.avatar} size="lg" />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-4">{user.nickname}</h2>
                <p className="text-gray-500 text-sm mt-1 truncate max-w-full px-2">{user.email}</p>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 w-full">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{publishedTasks.length}</p>
                    <p className="text-xs text-gray-500 mt-1">发布任务</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success-600">{acceptedTasks.length}</p>
                    <p className="text-xs text-gray-500 mt-1">接取任务</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning-600">{formatMoney(user.balance)}</p>
                    <p className="text-xs text-gray-500 mt-1">账户余额</p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="w-full mt-6 space-y-3">
                    <Input
                      label="昵称"
                      value={editForm.nickname}
                      onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                      placeholder="请输入昵称"
                    />
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                        取消
                      </Button>
                      <Button className="flex-1" onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? '保存中...' : '保存'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" className="mt-6" onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    编辑资料
                  </Button>
                )}
              </div>

              <div className="mt-2">
                <IdentityCard 
                  nickname={user.nickname} 
                  gcoinBalance={gcoinWallet?.balance || 0} 
                />
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">账号信息</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    <button
                      onClick={() => setShowChangeEmailModal(true)}
                      className="text-sm text-primary-500 hover:text-primary-600 flex items-center"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      修改
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">密码</span>
                    </div>
                    <button
                      onClick={() => setShowChangePasswordModal(true)}
                      className="text-sm text-primary-500 hover:text-primary-600 flex items-center"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      修改
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="danger" className="w-full" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </Button>
              </div>
            </Card>
          </aside>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 cursor-pointer" onClick={() => setShowGcoinModal(true)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">我的G豆</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {gcoinWallet?.balance ? parseFloat(gcoinWallet.balance).toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">累计获得</p>
                  <p className="text-sm text-green-600">
                    +{gcoinWallet?.totalEarned ? parseFloat(gcoinWallet.totalEarned).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">我的任务</h3>
                <button 
                  className="text-sm text-primary-500 hover:text-primary-600"
                  onClick={() => navigate('/app/tasks')}
                >
                  查看全部
                </button>
              </div>
              <div className="flex items-center bg-gray-50 rounded-xl p-1 mb-4">
                <button
                  onClick={() => setActiveTab('published')}
                  className={`flex-1 py-2 rounded-lg text-center text-sm font-medium transition-all ${
                    activeTab === 'published' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  我发布的 ({publishedTasks.length})
                </button>
                <button
                  onClick={() => setActiveTab('accepted')}
                  className={`flex-1 py-2 rounded-lg text-center text-sm font-medium transition-all ${
                    activeTab === 'accepted' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  我接的单 ({acceptedTasks.length})
                </button>
              </div>
              <div className="space-y-3">
                {currentTasks.slice(0, 5).map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => navigate(`/app/tasks/${task.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{task.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatMoney(task.commission)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                ))}
                {currentTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    暂无任务
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">常用功能</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {menuItems.slice(0, 8).map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Modal isOpen={showChangeEmailModal} onClose={() => setShowChangeEmailModal(false)} title="修改邮箱">
        <div className="space-y-4">
          <Input
            label="新邮箱"
            type="email"
            value={changeEmailForm.email}
            onChange={(e) => setChangeEmailForm({ ...changeEmailForm, email: e.target.value })}
            placeholder="请输入新邮箱地址"
          />
          <div className="flex gap-3">
            <Input
              label="验证码"
              value={changeEmailForm.code}
              onChange={(e) => setChangeEmailForm({ ...changeEmailForm, code: e.target.value })}
              placeholder="请输入验证码"
            />
            <Button
              variant="outline"
              onClick={handleSendEmailCode}
              disabled={emailCodeTimer > 0 || isSubmitting}
              className="h-[42px] mt-6"
            >
              {isSubmitting ? '发送中...' : (emailCodeTimer > 0 ? `${emailCodeTimer}s` : '获取验证码')}
            </Button>
          </div>
          <Button onClick={handleChangeEmail} className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? '修改中...' : '确认修改'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} title="修改密码">
        <div className="space-y-4">
          <Input
            label="旧密码"
            type="password"
            value={changePasswordForm.oldPassword}
            onChange={(e) => setChangePasswordForm({ ...changePasswordForm, oldPassword: e.target.value })}
            placeholder="请输入旧密码"
          />
          <Input
            label="新密码"
            type="password"
            value={changePasswordForm.newPassword}
            onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
            placeholder="请输入新密码（至少6位）"
          />
          <div className="flex gap-3">
            <Input
              label="验证码"
              value={changePasswordForm.code}
              onChange={(e) => setChangePasswordForm({ ...changePasswordForm, code: e.target.value })}
              placeholder="请输入验证码"
            />
            <Button
              variant="outline"
              onClick={handleSendPasswordCode}
              disabled={passwordCodeTimer > 0 || isSubmitting}
              className="h-[42px] mt-6"
            >
              {isSubmitting ? '发送中...' : (passwordCodeTimer > 0 ? `${passwordCodeTimer}s` : '获取验证码')}
            </Button>
          </div>
          <Button onClick={handleChangePassword} className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? '修改中...' : '确认修改'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showChangeAvatarModal} onClose={() => {
        setShowChangeAvatarModal(false);
        setTempAvatarUrl('');
      }} title="修改头像">
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            {tempAvatarUrl ? (
              <img
                src={tempAvatarUrl}
                alt="预览头像"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <Avatar name={user?.nickname || ''} avatar={user?.avatar} size="lg" />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            选择图片
          </Button>
          <Button
            onClick={handleSaveAvatar}
            className="w-full"
            disabled={!tempAvatarUrl || isSubmitting}
          >
            {isSubmitting ? '上传中...' : '确认修改'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showEvaluationModal} onClose={() => setShowEvaluationModal(false)} title="意见反馈">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">请为我们的服务打分</label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setEvaluationForm({ ...evaluationForm, rating: star })}
                  className="p-2 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= evaluationForm.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">
                {evaluationForm.rating === 1 && '非常不满意'}
                {evaluationForm.rating === 2 && '不满意'}
                {evaluationForm.rating === 3 && '一般'}
                {evaluationForm.rating === 4 && '满意'}
                {evaluationForm.rating === 5 && '非常满意'}
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">问题反馈（选填）</label>
            <textarea
              value={evaluationForm.feedback}
              onChange={(e) => setEvaluationForm({ ...evaluationForm, feedback: e.target.value })}
              placeholder="请告诉我们您的建议或遇到的问题..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
            />
          </div>
          
          <div className="text-xs text-gray-400 text-center">
            您的反馈将帮助我们改进系统
          </div>
          
          <Button onClick={handleSubmitEvaluation} className="w-full" disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? '提交中...' : '提交反馈'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showGcoinModal} onClose={() => setShowGcoinModal(false)} title="G豆钱包">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
            <div className="text-center">
              <p className="text-sm opacity-80">当前余额</p>
              <p className="text-4xl font-bold mt-2">
                {gcoinWallet?.balance ? parseFloat(gcoinWallet.balance).toFixed(2) : '0.00'}
                <span className="text-lg ml-2">G豆</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-600">
                <ArrowDownRight className="w-5 h-5" />
                <span className="text-sm">累计获得</span>
              </div>
              <p className="text-xl font-bold text-green-600 mt-1">
                +{gcoinWallet?.totalEarned ? parseFloat(gcoinWallet.totalEarned).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-600">
                <ArrowUpRight className="w-5 h-5" />
                <span className="text-sm">累计消耗</span>
              </div>
              <p className="text-xl font-bold text-red-600 mt-1">
                -{gcoinWallet?.totalSpent ? parseFloat(gcoinWallet.totalSpent).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>

          <Button onClick={() => { setShowGcoinModal(false); setShowTransferModal(true); }} className="w-full">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            转账
          </Button>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">交易记录</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {gcoinTransactions.length === 0 ? (
                <p className="text-center text-gray-400 py-4">暂无交易记录</p>
              ) : (
                gcoinTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`text-sm font-medium ${parseFloat(tx.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(tx.amount) >= 0 ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} title="G豆转账">
        <div className="space-y-4">
          <Input
            label="目标账户"
            placeholder="输入对方邮箱或用户ID"
            value={transferForm.targetAccount}
            onChange={(e) => setTransferForm({ ...transferForm, targetAccount: e.target.value })}
          />
          <Input
            label="转账金额"
            placeholder="请输入转账数量"
            type="number"
            value={transferForm.amount}
            onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
          />
          <Input
            label="备注（选填）"
            placeholder="选填备注"
            value={transferForm.remark}
            onChange={(e) => setTransferForm({ ...transferForm, remark: e.target.value })}
          />
          {transferForm.amount && (
            <p className="text-sm text-gray-500">
              手续费：{(parseFloat(transferForm.amount) * 0.01).toFixed(2)} G豆（1%）
            </p>
          )}
          <Button onClick={handleTransfer} className="w-full" disabled={transferIsSubmitting}>
            {transferIsSubmitting ? '转账中...' : '确认转账'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
