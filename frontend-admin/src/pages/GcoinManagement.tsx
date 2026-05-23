import { useState, useEffect } from 'react';
import {
  getCirculationStats,
  getTreasury,
  treasuryTransferOut,
  lockTreasuryBalance,
  unlockTreasuryBalance,
  adjustCirculation,
  deductUserGcoin,
  addUserGcoin,
  getGcoinTransactions,
  getUserBalances,
  getAccountOperationLogs,
  CirculationStats,
  TreasuryInfo,
  GcoinTransaction,
  GcoinAccount,
  AccountOperationLog,
} from '../api/api';
import { Coins, Wallet, TrendingUp, TrendingDown, Lock, Unlock, Send, History, RefreshCw, Users, Search, FileText } from 'lucide-react';

export default function GcoinManagement() {
  const [stats, setStats] = useState<CirculationStats | null>(null);
  const [treasury, setTreasury] = useState<TreasuryInfo | null>(null);
  const [transactions, setTransactions] = useState<GcoinTransaction[]>([]);
  const [userBalances, setUserBalances] = useState<GcoinAccount[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [balancesPage, setBalancesPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [balancesTotal, setBalancesTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterTreasuryOp, setFilterTreasuryOp] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'overview' | 'treasury' | 'user' | 'balances' | 'history' | 'operation-logs'>('overview');
  
  const [operationLogs, setOperationLogs] = useState<AccountOperationLog[]>([]);
  const [logsCurrentPage, setLogsCurrentPage] = useState(1);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsFilterAdminId, setLogsFilterAdminId] = useState('');
  const [logsFilterType, setLogsFilterType] = useState<string>('');
  const [logsFilterTargetUser, setLogsFilterTargetUser] = useState('');

  const [transferAmount, setTransferAmount] = useState('');
  const [transferDesc, setTransferDesc] = useState('');
  const [lockAmount, setLockAmount] = useState('');
  const [unlockAmount, setUnlockAmount] = useState('');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [deductUserId, setDeductUserId] = useState('');
  const [deductAmount, setDeductAmount] = useState('');
  const [deductReason, setDeductReason] = useState('');
  const [addUserId, setAddUserId] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [addReason, setAddReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      loadTransactions();
    } else if (activeTab === 'balances') {
      loadUserBalances();
    } else if (activeTab === 'operation-logs') {
      loadOperationLogs();
    }
  }, [activeTab, currentPage, balancesPage, searchKeyword, logsCurrentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, treasuryRes] = await Promise.all([
        getCirculationStats(),
        getTreasury(),
      ]);
      if (statsRes.code === 200) setStats(statsRes.data);
      if (treasuryRes.code === 200) setTreasury(treasuryRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const filters: any = {};
      if (filterUserId) filters.userId = parseInt(filterUserId);
      if (filterType) filters.type = parseInt(filterType);
      if (filterTreasuryOp) filters.treasuryOperation = parseInt(filterTreasuryOp);
      
      const res = await getGcoinTransactions(currentPage, pageSize, Object.keys(filters).length > 0 ? filters : undefined);
      if (res.code === 200) {
        setTransactions(res.data.records || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    loadTransactions();
  };

  const resetFilters = () => {
    setFilterUserId('');
    setFilterType('');
    setFilterTreasuryOp('');
    setCurrentPage(1);
    loadTransactions();
  };

  const loadOperationLogs = async () => {
    try {
      const filters: any = {};
      if (logsFilterAdminId) filters.adminId = parseInt(logsFilterAdminId);
      if (logsFilterType) filters.operationType = parseInt(logsFilterType);
      if (logsFilterTargetUser) filters.targetUserId = parseInt(logsFilterTargetUser);
      
      const res = await getAccountOperationLogs(logsCurrentPage, pageSize, Object.keys(filters).length > 0 ? filters : undefined);
      if (res.code === 200) {
        setOperationLogs(res.data.records || []);
        setLogsTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load operation logs:', err);
    }
  };

  const applyLogsFilters = () => {
    setLogsCurrentPage(1);
    loadOperationLogs();
  };

  const resetLogsFilters = () => {
    setLogsFilterAdminId('');
    setLogsFilterType('');
    setLogsFilterTargetUser('');
    setLogsCurrentPage(1);
    loadOperationLogs();
  };

  const loadUserBalances = async () => {
    try {
      const res = await getUserBalances(balancesPage, pageSize, searchKeyword);
      if (res.code === 200) {
        setUserBalances(res.data.records || []);
        setBalancesTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load user balances:', err);
    }
  };

  const handleSearch = () => {
    setBalancesPage(1);
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleTransferOut = async () => {
    if (!transferAmount || !transferDesc) {
      showMessage('请填写完整信息', 'error');
      return;
    }
    try {
      const res = await treasuryTransferOut(parseFloat(transferAmount), transferDesc);
      if (res.code === 200) {
        showMessage('国库资金投放成功', 'success');
        setTransferAmount('');
        setTransferDesc('');
        loadData();
      } else {
        showMessage(res.message || '操作失败', 'error');
      }
    } catch (err) {
      showMessage('网络异常', 'error');
    }
  };

  const handleLock = async () => {
    if (!lockAmount) {
      showMessage('请填写封存金额', 'error');
      return;
    }
    try {
      const res = await lockTreasuryBalance(parseFloat(lockAmount));
      if (res.code === 200) {
        showMessage('国库资金封存成功', 'success');
        setLockAmount('');
        loadData();
      } else {
        showMessage(res.message || '操作失败', 'error');
      }
    } catch (err) {
      showMessage('网络异常', 'error');
    }
  };

  const handleUnlock = async () => {
    if (!unlockAmount) {
      showMessage('请填写解封金额', 'error');
      return;
    }
    try {
      const res = await unlockTreasuryBalance(parseFloat(unlockAmount));
      if (res.code === 200) {
        showMessage('国库资金解封成功', 'success');
        setUnlockAmount('');
        loadData();
      } else {
        showMessage(res.message || '操作失败', 'error');
      }
    } catch (err) {
      showMessage('网络异常', 'error');
    }
  };

  const handleAdjust = async () => {
    if (!adjustAmount || !adjustReason) {
      showMessage('请填写完整信息', 'error');
      return;
    }
    try {
      const res = await adjustCirculation(parseFloat(adjustAmount), adjustReason);
      if (res.code === 200) {
        showMessage('流通量调整成功', 'success');
        setAdjustAmount('');
        setAdjustReason('');
        loadData();
      } else {
        showMessage(res.message || '操作失败', 'error');
      }
    } catch (err) {
      showMessage('网络异常', 'error');
    }
  };

  const handleDeduct = async () => {
    if (!deductUserId || !deductAmount || !deductReason) {
      showMessage('请填写完整信息', 'error');
      return;
    }
    try {
      const res = await deductUserGcoin(parseInt(deductUserId), parseFloat(deductAmount), deductReason);
      if (res.code === 200) {
        showMessage('扣减成功', 'success');
        setDeductUserId('');
        setDeductAmount('');
        setDeductReason('');
      } else {
        showMessage(res.message || '操作失败', 'error');
      }
    } catch (err) {
      showMessage('网络异常', 'error');
    }
  };

  const handleAdd = async () => {
    if (!addUserId || !addAmount || !addReason) {
      showMessage('请填写完整信息', 'error');
      return;
    }
    try {
      const res = await addUserGcoin(parseInt(addUserId), parseFloat(addAmount), addReason);
      if (res.code === 200) {
        showMessage('补发成功', 'success');
        setAddUserId('');
        setAddAmount('');
        setAddReason('');
      } else {
        showMessage(res.message || '操作失败', 'error');
      }
    } catch (err) {
      showMessage('网络异常', 'error');
    }
  };

  const getTransactionType = (type: number) => {
    switch (type) {
      case 1: return { label: '充值', color: 'text-green-600' };
      case 2: return { label: '消费', color: 'text-red-600' };
      case 3: return { label: '任务奖励', color: 'text-blue-600' };
      case 4: return { label: '提现', color: 'text-orange-600' };
      case 5: return { label: '系统调整', color: 'text-purple-600' };
      default: return { label: '未知', color: 'text-gray-600' };
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">G豆货币流通管理</h1>
          <p className="text-gray-500 mt-1">管理G豆的发行、流通和用户账户</p>
        </div>
        <button
          onClick={loadData}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>刷新数据</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            messageType === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">总流通量</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats?.totalCirculation || 0} G豆</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">国库余额</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{treasury?.balance || 0} G豆</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">今日增发</p>
              <p className="text-2xl font-bold text-green-600 mt-2">+{stats?.dailyProduction || 0} G豆</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">今日消耗</p>
              <p className="text-2xl font-bold text-red-600 mt-2">-{stats?.dailyConsumption || 0} G豆</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 bg-white rounded-lg shadow p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-primary-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          流通概览
        </button>
        <button
          onClick={() => setActiveTab('treasury')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'treasury'
              ? 'bg-primary-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          国库管理
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'balances'
              ? 'bg-primary-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          用户余额
        </button>
        <button
          onClick={() => setActiveTab('user')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'user'
              ? 'bg-primary-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          账户操作
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-primary-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          交易记录
        </button>
        <button
          onClick={() => setActiveTab('operation-logs')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'operation-logs'
              ? 'bg-primary-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          操作日志
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">流通统计详情</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-4">流通量调整</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">调整金额 (G豆)</label>
                    <input
                      type="number"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="输入调整金额"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">调整原因</label>
                    <textarea
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      placeholder="请输入调整原因"
                    />
                  </div>
                  <button
                    onClick={handleAdjust}
                    className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600"
                  >
                    执行调整
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-4">统计信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">平均用户持有</span>
                    <span className="font-medium">{stats?.avgUserHold || 0} G豆</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">活跃用户数</span>
                    <span className="font-medium">{stats?.userCount || 0} 人</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">国库总收入</span>
                    <span className="font-medium text-green-600">+{treasury?.totalIncome || 0} G豆</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">国库总支出</span>
                    <span className="font-medium text-red-600">-{treasury?.totalExpense || 0} G豆</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">封存资金</span>
                    <span className="font-medium text-orange-600">{treasury?.lockedBalance || 0} G豆</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'treasury' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">国库管理</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Send className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-700">资金投放</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">投放金额 (G豆)</label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (parseFloat(val) > 0)) {
                          setTransferAmount(val);
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="输入投放金额"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">投放说明</label>
                    <input
                      type="text"
                      value={transferDesc}
                      onChange={(e) => setTransferDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="请输入投放说明"
                    />
                  </div>
                  <button
                    onClick={handleTransferOut}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                  >
                    确认投放
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="w-5 h-5 text-orange-600" />
                  <h3 className="font-medium text-gray-700">资金封存</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">封存金额 (G豆)</label>
                    <input
                      type="number"
                      value={lockAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (parseFloat(val) > 0)) {
                          setLockAmount(val);
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="输入封存金额"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    当前可封存余额: {treasury?.balance || 0} G豆
                  </div>
                  <button
                    onClick={handleLock}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                  >
                    确认封存
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Unlock className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-700">资金解封</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">解封金额 (G豆)</label>
                    <input
                      type="number"
                      value={unlockAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (parseFloat(val) > 0)) {
                          setUnlockAmount(val);
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="输入解封金额"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    当前封存余额: {treasury?.lockedBalance || 0} G豆
                  </div>
                  <button
                    onClick={handleUnlock}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                  >
                    确认解封
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">用户余额查询</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="搜索用户名/邮箱..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
                >
                  搜索
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>用户ID</th>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>当前余额</th>
                    <th>累计获得</th>
                    <th>累计消费</th>
                  </tr>
                </thead>
                <tbody>
                  {userBalances.map((account) => (
                    <tr key={account.id}>
                      <td>{account.userId}</td>
                      <td>{account.nickname || '-'}</td>
                      <td className="max-w-xs truncate">{account.email || '-'}</td>
                      <td className="font-medium text-primary-600">{account.balance || 0} G豆</td>
                      <td>{account.totalEarned || 0} G豆</td>
                      <td>{account.totalSpent || 0} G豆</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {userBalances.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无用户余额数据</p>
              </div>
            )}

            {userBalances.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">共 {balancesTotal} 条记录</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setBalancesPage(balancesPage - 1)}
                    disabled={balancesPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    上一页
                  </button>
                  <span className="px-3 py-1 text-gray-600">
                    {balancesPage} / {Math.ceil(balancesTotal / pageSize) || 1}
                  </span>
                  <button
                    onClick={() => setBalancesPage(balancesPage + 1)}
                    disabled={balancesPage >= Math.ceil(balancesTotal / pageSize)}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'user' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">账户操作</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-red-700 mb-4">扣减G豆</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">用户ID</label>
                    <input
                      type="number"
                      min="1"
                      value={deductUserId}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (parseFloat(val) >= 1)) {
                          setDeductUserId(val);
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="输入用户ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">扣减金额 (G豆)</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={deductAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (parseFloat(val) > 0)) {
                          setDeductAmount(val);
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="输入扣减金额"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">扣减原因</label>
                    <textarea
                      value={deductReason}
                      onChange={(e) => setDeductReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={2}
                      placeholder="请输入扣减原因"
                    />
                  </div>
                  <button
                    onClick={handleDeduct}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    确认扣减
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-green-700 mb-4">补发G豆</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">用户ID</label>
                    <input
                      type="number"
                      min="1"
                      value={addUserId}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (parseFloat(val) >= 1)) {
                          setAddUserId(val);
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="输入用户ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">补发金额 (G豆)</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={addAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (parseFloat(val) > 0)) {
                          setAddAmount(val);
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="输入补发金额"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">补发原因</label>
                    <textarea
                      value={addReason}
                      onChange={(e) => setAddReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={2}
                      placeholder="请输入补发原因"
                    />
                  </div>
                  <button
                    onClick={handleAdd}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                  >
                    确认补发
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">交易记录</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  重置
                </button>
              </div>
            </div>

            {/* 筛选表单 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">用户ID</label>
                  <input
                    type="number"
                    value={filterUserId}
                    onChange={(e) => setFilterUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="输入用户ID"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">交易类型</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">全部</option>
                    <option value="1">接单奖励</option>
                    <option value="2">任务完成奖励</option>
                    <option value="3">系统奖励</option>
                    <option value="4">转账支出</option>
                    <option value="5">转账收入</option>
                    <option value="6">消费支出</option>
                    <option value="7">手续费</option>
                    <option value="8">管理员操作</option>
                    <option value="9">国库投放</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">国库操作</label>
                  <select
                    value={filterTreasuryOp}
                    onChange={(e) => setFilterTreasuryOp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">全部</option>
                    <option value="1">是</option>
                    <option value="0">否</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={applyFilters}
                    className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
                  >
                    筛选
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>交易ID</th>
                    <th>用户ID</th>
                    <th>交易类型</th>
                    <th>金额</th>
                    <th>交易前余额</th>
                    <th>交易后余额</th>
                    <th>描述</th>
                    <th>时间</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const typeInfo = getTransactionType(tx.type);
                    return (
                      <tr key={tx.id}>
                        <td>{tx.id}</td>
                        <td>{tx.userId}</td>
                        <td>
                          <span className={`font-medium ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                        </td>
                        <td className={tx.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} G豆
                        </td>
                        <td>{tx.balanceBefore} G豆</td>
                        <td>{tx.balanceAfter} G豆</td>
                        <td className="max-w-xs truncate">{tx.description}</td>
                        <td>{formatDate(tx.createTime)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {transactions.length === 0 && (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无交易记录</p>
              </div>
            )}

            {transactions.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">共 {total} 条记录</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    上一页
                  </button>
                  <span className="px-3 py-1 text-gray-600">
                    {currentPage} / {Math.ceil(total / pageSize) || 1}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(total / pageSize)}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'operation-logs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">操作日志</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetLogsFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  重置
                </button>
              </div>
            </div>

            {/* 筛选表单 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">管理员ID</label>
                  <input
                    type="number"
                    value={logsFilterAdminId}
                    onChange={(e) => setLogsFilterAdminId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="输入管理员ID"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">操作类型</label>
                  <select
                    value={logsFilterType}
                    onChange={(e) => setLogsFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">全部</option>
                    <option value="1">国库投放</option>
                    <option value="2">国库封存</option>
                    <option value="3">国库解封</option>
                    <option value="4">调整流通</option>
                    <option value="5">扣减用户</option>
                    <option value="6">补发用户</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">目标用户ID</label>
                  <input
                    type="number"
                    value={logsFilterTargetUser}
                    onChange={(e) => setLogsFilterTargetUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="输入目标用户ID"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={applyLogsFilters}
                    className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
                  >
                    筛选
                  </button>
                </div>
              </div>
            </div>

            {/* 操作日志列表 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">管理员ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作类型</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">目标用户</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作前余额</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作后余额</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP地址</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {operationLogs.map((log) => {
                    const getOperationTypeLabel = (type: number) => {
                      const types = {
                        1: { label: '国库投放', color: 'text-green-600' },
                        2: { label: '国库封存', color: 'text-yellow-600' },
                        3: { label: '国库解封', color: 'text-blue-600' },
                        4: { label: '调整流通', color: 'text-purple-600' },
                        5: { label: '扣减用户', color: 'text-red-600' },
                        6: { label: '补发用户', color: 'text-green-600' },
                      };
                      return types[type as keyof typeof types] || { label: '未知', color: 'text-gray-600' };
                    };

                    const typeInfo = getOperationTypeLabel(log.operationType);

                    return (
                      <tr key={log.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{log.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{log.adminId}</td>
                        <td>
                          <span className={`font-medium ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{log.targetUserId || '-'}</td>
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">{log.amount} G豆</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{log.beforeBalance} G豆</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{log.afterBalance} G豆</td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{log.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{log.ipAddress}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(log.createTime)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {operationLogs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无操作日志</p>
              </div>
            )}

            {operationLogs.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">共 {logsTotal} 条记录</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLogsCurrentPage(logsCurrentPage - 1)}
                    disabled={logsCurrentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    上一页
                  </button>
                  <span className="px-3 py-1 text-gray-600">
                    {logsCurrentPage} / {Math.ceil(logsTotal / pageSize) || 1}
                  </span>
                  <button
                    onClick={() => setLogsCurrentPage(logsCurrentPage + 1)}
                    disabled={logsCurrentPage >= Math.ceil(logsTotal / pageSize)}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
