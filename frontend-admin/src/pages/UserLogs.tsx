import { useState, useEffect } from 'react';
import { getUserLogs, UserLog } from '../api/api';
import { LogIn, LogOut, UserPlus, Clock, Search } from 'lucide-react';

export default function UserLogs() {
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [currentPage, actionFilter, statusFilter, searchKeyword]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getUserLogs(currentPage, pageSize, actionFilter, statusFilter, searchKeyword);
      console.log('User logs response:', res);
      if (res.code === 200) {
        if (res.data && res.data.records) {
          setLogs(res.data.records);
          const totalCount = res.data.total || res.data.records.length;
          setTotal(totalCount);
        } else if (res.data && Array.isArray(res.data)) {
          setLogs(res.data);
          setTotal(res.data.length);
        } else {
          console.error('Unexpected response structure:', res.data);
        }
      } else {
        console.error('API error:', res.message);
      }
    } catch (err) {
      console.error('Failed to fetch user logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: number) => {
    switch (action) {
      case 1:
        return '登录';
      case 2:
        return '注册';
      case 3:
        return '注销';
      default:
        return '未知';
    }
  };

  const getActionIcon = (action: number) => {
    switch (action) {
      case 1:
        return <LogIn className="w-4 h-4" />;
      case 2:
        return <UserPlus className="w-4 h-4" />;
      case 3:
        return <LogOut className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: number) => {
    switch (action) {
      case 1:
        return 'bg-blue-100 text-blue-700';
      case 2:
        return 'bg-green-100 text-green-700';
      case 3:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: number) => {
    return status === 1 ? '成功' : '失败';
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <h1 className="text-2xl font-bold text-gray-800">用户日志</h1>
          <p className="text-gray-500 mt-1">记录用户的登录、注册、注销行为</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-wrap">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索用户名/邮箱..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
          >
            搜索
          </button>
        </form>

        <div className="flex items-center space-x-2">
          <span className="text-gray-600">操作类型:</span>
          <select
            value={actionFilter ?? ''}
            onChange={(e) => {
              setActionFilter(e.target.value ? parseInt(e.target.value) : undefined);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">全部</option>
            <option value="1">登录</option>
            <option value="2">注册</option>
            <option value="3">注销</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-600">状态:</span>
          <select
            value={statusFilter ?? ''}
            onChange={(e) => {
              setStatusFilter(e.target.value ? parseInt(e.target.value) : undefined);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">全部</option>
            <option value="1">成功</option>
            <option value="0">失败</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>操作时间</th>
                <th>用户</th>
                <th>操作类型</th>
                <th>IP地址</th>
                <th>状态</th>
                <th>消息</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDate(log.createTime)}</td>
                  <td>
                    <div>
                      <p className="font-medium text-gray-800">{log.username}</p>
                      <p className="text-sm text-gray-500">用户ID: {log.userId}</p>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                        log.action
                      )}`}
                    >
                      {getActionIcon(log.action)}
                      <span className="ml-1">{getActionLabel(log.action)}</span>
                    </span>
                  </td>
                  <td className="font-mono text-sm">{log.ipAddress || '-'}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {getStatusLabel(log.status)}
                    </span>
                  </td>
                  <td className="max-w-xs">
                    <span className="truncate">{log.message || '-'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无用户操作日志</p>
          </div>
        )}

        {logs.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-gray-500 text-sm">共 {total} 条记录</p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="px-3 py-1 text-gray-600">
                {currentPage} / {Math.ceil(total / pageSize) || 1}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
