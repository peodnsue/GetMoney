import { useState } from 'react';
import { mockDisputes } from '../data/mockData';
import { Search, CheckCircle, Eye } from 'lucide-react';

export default function Disputes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDispute, setSelectedDispute] = useState<typeof mockDisputes[0] | null>(null);

  const filteredDisputes = mockDisputes.filter((dispute) => {
    const matchesSearch =
      dispute.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.initiatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.responderName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleResolve = (disputeId: string) => {
    setSelectedDispute(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">纠纷处理</h1>
          <p className="text-gray-500 mt-1">处理平台用户纠纷</p>
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
              placeholder="搜索任务名称、发起者或响应者..."
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部状态</option>
              <option value="pending">待处理</option>
              <option value="resolved">已解决</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>任务名称</th>
                <th>发起者</th>
                <th>响应者</th>
                <th>纠纷原因</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisputes.map((dispute) => (
                <tr key={dispute.id}>
                  <td className="font-medium text-gray-800">{dispute.taskTitle}</td>
                  <td>{dispute.initiatorName}</td>
                  <td>{dispute.responderName}</td>
                  <td className="max-w-[200px] truncate" title={dispute.reason}>
                    {dispute.reason}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dispute.status === 'pending'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {dispute.status === 'pending' ? '待处理' : '已解决'}
                    </span>
                  </td>
                  <td className="text-gray-500 text-sm">{dispute.createdAt}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedDispute(dispute)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {dispute.status === 'pending' && (
                        <button
                          onClick={() => handleResolve(dispute.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="标记已解决"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDisputes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>暂无符合条件的纠纷</p>
          </div>
        )}
      </div>

      {selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">纠纷详情</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-sm">关联任务</label>
                <p className="font-medium">{selectedDispute.taskTitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-sm">发起者</label>
                  <p>{selectedDispute.initiatorName}</p>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm">响应者</label>
                  <p>{selectedDispute.responderName}</p>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">纠纷原因</label>
                <p className="bg-gray-50 p-3 rounded-lg">{selectedDispute.reason}</p>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">状态</label>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedDispute.status === 'pending'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {selectedDispute.status === 'pending' ? '待处理' : '已解决'}
                </span>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">创建时间</label>
                <p>{selectedDispute.createdAt}</p>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setSelectedDispute(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300"
              >
                关闭
              </button>
              {selectedDispute.status === 'pending' && (
                <button
                  onClick={() => handleResolve(selectedDispute.id)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>标记已解决</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
