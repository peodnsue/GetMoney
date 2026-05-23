import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { getUsers, updateUserStatus, updateUserRole } from '../api/api';
import { formatMoney } from '../lib/utils';
import { Search, Edit, Ban, Unlock, MoreVertical, X, Eye, RefreshCw, UserPlus } from 'lucide-react';

export default function Users() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const users = useStore((state) => state.users);
  const setUsers = useStore((state) => state.setUsers);
  const toggleUserStatus = useStore((state) => state.toggleUserStatus);
  const updateUserRoleStore = useStore((state) => state.updateUserRole);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchingRef = useRef(false);

  const fetchUsers = useCallback(async () => {
    if (fetchingRef.current) {
      abortControllerRef.current?.abort();
    }
    
    fetchingRef.current = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setLoading(true);
    try {
      const roleParam = roleFilter === 'all' ? undefined : parseInt(roleFilter);
      const statusParam = statusFilter === 'all' ? undefined : parseInt(statusFilter);
      
      const res = await getUsers(currentPage, 10, roleParam, statusParam);
      
      if (controller.signal.aborted) return;
      
      if (res.code === 200) {
        setUsers(res.data.records);
        setTotalPages(Math.ceil(res.data.total / 10));
        clearMessage();
      } else {
        showMessage(res.message || '获取用户列表失败', 'error');
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error('Failed to fetch users:', err);
      showMessage('网络异常，请稍后重试', 'error');
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }, [currentPage, roleFilter, statusFilter, setUsers]);

  useEffect(() => {
    fetchUsers();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchUsers]);

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      clearMessage();
    }, 3000);
  };

  const clearMessage = () => {
    setMessage('');
    setMessageType('success');
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleToggleStatus = async (userId: number, currentStatus: number, nickname: string) => {
    const action = currentStatus === 1 ? '封禁' : '解封';
    if (window.confirm(`确定要${action}用户「${nickname}」吗？`)) {
      try {
        const newStatus = currentStatus === 1 ? 0 : 1;
        const res = await updateUserStatus(userId, newStatus);
        if (res.code === 200) {
          toggleUserStatus(userId);
          showMessage(`${action}成功`, 'success');
        } else {
          showMessage(res.message || `${action}失败`, 'error');
        }
      } catch (err) {
        console.error('Failed to update user status:', err);
        showMessage('网络异常，请稍后重试', 'error');
      }
    }
  };

  const handleUpdateRole = async () => {
    if (editingUserId && newRole) {
      try {
        const res = await updateUserRole(editingUserId, parseInt(newRole));
        if (res.code === 200) {
          updateUserRoleStore(editingUserId, parseInt(newRole));
          showMessage('角色修改成功', 'success');
        } else {
          showMessage(res.message || '角色修改失败', 'error');
        }
      } catch (err) {
        console.error('Failed to update user role:', err);
        showMessage('网络异常，请稍后重试', 'error');
      }
      setEditingUserId(null);
      setNewRole('');
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const getRoleText = (role: number): string => {
    const roleMap: Record<number, string> = {
      1: '普通学生',
      2: '任务发布者',
      3: '接单者',
      4: '管理员',
    };
    return roleMap[role] || '未知';
  };

  const getRoleColor = (role: number): string => {
    const colorMap: Record<number, string> = {
      1: 'bg-gray-100 text-gray-700',
      2: 'bg-blue-100 text-blue-700',
      3: 'bg-green-100 text-green-700',
      4: 'bg-purple-100 text-purple-700',
    };
    return colorMap[role] || 'bg-gray-100 text-gray-700';
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
          <h1 className="text-2xl font-bold text-gray-800">用户管理</h1>
          <p className="text-gray-500 mt-1">管理平台所有用户</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>刷新</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <UserPlus className="w-4 h-4" />
            <span>添加用户</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="搜索用户名、邮箱或学号..."
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部角色</option>
              <option value="1">普通学生</option>
              <option value="2">任务发布者</option>
              <option value="3">接单者</option>
              <option value="4">管理员</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部状态</option>
              <option value="1">正常</option>
              <option value="0">封禁</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>用户名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>余额</th>
                <th>状态</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium text-gray-800">{user.nickname}</td>
                  <td>{user.email}</td>
                  <td>
                    {editingUserId === user.id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        >
                          <option value="1">普通学生</option>
                          <option value="2">任务发布者</option>
                          <option value="3">接单者</option>
                          <option value="4">管理员</option>
                        </select>
                        <button
                          onClick={handleUpdateRole}
                          className="px-2 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600"
                        >
                          确定
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    )}
                  </td>
                  <td className="text-primary-600 font-semibold">{formatMoney(user.balance)}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 1 ? '正常' : '封禁'}
                    </span>
                  </td>
                  <td className="text-gray-500 text-sm">{user.createTime}</td>
                  <td>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingUserId(user.id);
                          setNewRole(String(user.role));
                        }}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="修改角色"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status, user.nickname)}
                        className={`p-1.5 rounded-lg ${
                          user.status === 1 ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.status === 1 ? '封禁' : '解封'}
                      >
                        {user.status === 1 ? <Ban className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>暂无符合条件的用户</p>
          </div>
        )}

        {filteredUsers.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              共 {totalPages} 页，当前第 {currentPage} 页
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">用户详情</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-sm">用户名</label>
                <p className="font-medium">{selectedUser.nickname}</p>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">邮箱</label>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">角色</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                  {getRoleText(selectedUser.role)}
                </span>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">余额</label>
                <p className="text-primary-600 font-semibold">{formatMoney(selectedUser.balance)}</p>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">状态</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedUser.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedUser.status === 1 ? '正常' : '封禁'}
                </span>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">注册时间</label>
                <p>{selectedUser.createTime}</p>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">更新时间</label>
                <p>{selectedUser.updateTime}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
