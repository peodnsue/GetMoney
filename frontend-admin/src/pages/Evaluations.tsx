import { useState, useEffect } from 'react';
import { Search, CheckCircle, Eye, Star, MessageSquare } from 'lucide-react';
import { getEvaluations, updateEvaluationStatus, Evaluation } from '../api/api';

export default function Evaluations() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    loadEvaluations();
  }, [current, statusFilter]);

  const loadEvaluations = async () => {
    setIsLoading(true);
    try {
      const status = statusFilter === 'all' ? undefined : parseInt(statusFilter);
      const response = await getEvaluations(current, pageSize, status);
      if (response.code === 200) {
        setEvaluations(response.data.records);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('加载评价失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkProcessed = async (id: number) => {
    try {
      const response = await updateEvaluationStatus(id, 1);
      if (response.code === 200) {
        loadEvaluations();
      } else {
        alert(response.message || '操作失败');
      }
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      (evaluation.userNickname?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (evaluation.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (evaluation.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    return matchesSearch;
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">用户反馈</h1>
          <p className="text-gray-500 mt-1">查看和管理用户提交的评价与反馈</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-50 px-4 py-2 rounded-lg">
            <span className="text-yellow-700 font-medium">平均评分: </span>
            <span className="text-yellow-700 font-bold">
              {evaluations.length > 0 
                ? (evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length).toFixed(1)
                : '0.0'}
            </span>
            <Star className="inline-block w-4 h-4 text-yellow-500 ml-1 fill-yellow-500" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="搜索用户名、邮箱或反馈内容..."
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrent(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部状态</option>
              <option value="0">未处理</option>
              <option value="1">已处理</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="table">
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    加载中...
                  </td>
                </tr>
              ) : filteredEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    暂无符合条件的反馈
                  </td>
                </tr>
              ) : (
                filteredEvaluations.map((evaluation) => (
                  <tr key={evaluation.id}>
                    <td>
                      <div>
                        <p className="font-medium text-gray-800">{evaluation.userNickname || '未知用户'}</p>
                        <p className="text-xs text-gray-500">{evaluation.userEmail || ''}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= evaluation.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm font-medium">{evaluation.rating}</span>
                      </div>
                    </td>
                    <td className="max-w-[300px]">
                      {evaluation.feedback ? (
                        <p className="truncate text-gray-600" title={evaluation.feedback}>
                          {evaluation.feedback}
                        </p>
                      ) : (
                        <span className="text-gray-400 text-sm">无文字反馈</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          evaluation.status === 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {evaluation.status === 0 ? '未处理' : '已处理'}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">
                      {new Date(evaluation.createTime).toLocaleString('zh-CN')}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedEvaluation(evaluation)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {evaluation.status === 0 && (
                          <button
                            onClick={() => handleMarkProcessed(evaluation.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="标记已处理"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-4">
            <p className="text-sm text-gray-500">
              共 {total} 条记录，第 {current} / {totalPages} 页
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrent(Math.max(1, current - 1))}
                disabled={current === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrent(Math.min(totalPages, current + 1))}
                disabled={current === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">反馈详情</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-sm">用户昵称</label>
                  <p className="font-medium">{selectedEvaluation.userNickname || '未知用户'}</p>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm">用户邮箱</label>
                  <p className="font-medium">{selectedEvaluation.userEmail || '未知'}</p>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">评分</label>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= selectedEvaluation.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold">{selectedEvaluation.rating}</span>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-sm flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  反馈内容
                </label>
                <div className="bg-gray-50 p-4 rounded-lg mt-1 min-h-[80px]">
                  {selectedEvaluation.feedback ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedEvaluation.feedback}</p>
                  ) : (
                    <p className="text-gray-400 italic">用户未提供文字反馈</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-sm">提交时间</label>
                  <p className="text-sm">{new Date(selectedEvaluation.createTime).toLocaleString('zh-CN')}</p>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm">状态</label>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      selectedEvaluation.status === 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {selectedEvaluation.status === 0 ? '未处理' : '已处理'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setSelectedEvaluation(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300"
              >
                关闭
              </button>
              {selectedEvaluation.status === 0 && (
                <button
                  onClick={() => {
                    handleMarkProcessed(selectedEvaluation.id);
                    setSelectedEvaluation(null);
                  }}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>标记已处理</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
