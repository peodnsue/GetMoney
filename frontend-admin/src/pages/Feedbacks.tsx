import { useState, useEffect } from 'react';
import { getEvaluations, updateEvaluationStatus, Evaluation } from '../api/api';
import { Star, Check, Clock, Eye } from 'lucide-react';

export default function Feedbacks() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchEvaluations();
  }, [currentPage, statusFilter]);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const res = await getEvaluations(currentPage, pageSize, statusFilter);
      if (res.code === 200) {
        setEvaluations(res.data.records);
        const totalCount = res.data.total || res.data.records.length;
        setTotal(totalCount);
      }
    } catch (err) {
      console.error('Failed to fetch evaluations:', err);
      showMessage('获取反馈列表失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleStatusChange = async (id: number, status: number) => {
    try {
      const res = await updateEvaluationStatus(id, status);
      if (res.code === 200) {
        showMessage('状态更新成功', 'success');
        fetchEvaluations();
      } else {
        showMessage(res.message || '更新失败', 'error');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      showMessage('网络异常，请稍后重试', 'error');
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return '待处理';
      case 1:
        return '已处理';
      default:
        return '未知';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-yellow-100 text-yellow-700';
      case 1:
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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
    });
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
          <h1 className="text-2xl font-bold text-gray-800">用户反馈</h1>
          <p className="text-gray-500 mt-1">查看和管理用户反馈信息</p>
        </div>
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

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">状态筛选:</span>
          <select
            value={statusFilter ?? ''}
            onChange={(e) => {
              setStatusFilter(e.target.value ? parseInt(e.target.value) : undefined);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">全部</option>
            <option value="0">待处理</option>
            <option value="1">已处理</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>用户</th>
                <th>评分</th>
                <th>反馈内容</th>
                <th>状态</th>
                <th>提交时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation) => (
                <tr key={evaluation.id}>
                  <td>
                    <div>
                      <p className="font-medium text-gray-800">
                        {evaluation.userNickname || '匿名用户'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {evaluation.userEmail}
                      </p>
                    </div>
                  </td>
                  <td>{renderStars(evaluation.rating)}</td>
                  <td className="max-w-xs">
                    <div className="flex items-center">
                      <span className="truncate">{evaluation.feedback}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        evaluation.status
                      )}`}
                    >
                      {evaluation.status === 1 ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {getStatusLabel(evaluation.status)}
                    </span>
                  </td>
                  <td>{formatDate(evaluation.createTime)}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          evaluation.id,
                          evaluation.status === 1 ? 0 : 1
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        evaluation.status === 1
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-primary-500 text-white hover:bg-primary-600'
                      }`}
                    >
                      {evaluation.status === 1 ? '标记未处理' : '标记已处理'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {evaluations.length === 0 && (
          <div className="text-center py-12">
            <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无用户反馈</p>
          </div>
        )}

        {evaluations.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              共 {total} 条记录
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="px-3 py-1 text-gray-600">
                {currentPage} / {Math.ceil(total / pageSize)}
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
