import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getTasks, getTaskById } from '../api/api';
import { formatMoney } from '../lib/utils';
import { Search, Eye, Edit2, Ban } from 'lucide-react';

export default function Tasks() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);
  const tasks = useStore((state) => state.tasks);
  const setTasks = useStore((state) => state.setTasks);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await getTasks(1, 50);
        if (res.code === 200) {
          setTasks(res.data.records);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [setTasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.publisherName && task.publisherName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || String(task.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = async (taskId: number) => {
    try {
      const res = await getTaskById(taskId);
      if (res.code === 200) {
        setSelectedTask(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch task:', err);
    }
  };

  const getStatusText = (status: number): string => {
    const statusMap: Record<number, string> = {
      1: '待接单',
      2: '已接单',
      3: '已完成',
      4: '已取消',
      5: '已过期',
    };
    return statusMap[status] || '未知';
  };

  const getStatusColor = (status: number): string => {
    const colorMap: Record<number, string> = {
      1: 'bg-yellow-100 text-yellow-700',
      2: 'bg-blue-100 text-blue-700',
      3: 'bg-green-100 text-green-700',
      4: 'bg-gray-100 text-gray-700',
      5: 'bg-red-100 text-red-700',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
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
          <h1 className="text-2xl font-bold text-gray-800">任务管理</h1>
          <p className="text-gray-500 mt-1">管理平台所有任务</p>
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
              placeholder="搜索任务名称或发布者..."
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部状态</option>
              <option value="1">待接单</option>
              <option value="2">已接单</option>
              <option value="3">已完成</option>
              <option value="4">已取消</option>
              <option value="5">已过期</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>任务名称</th>
                <th>类型</th>
                <th>发布者</th>
                <th>接单者</th>
                <th>佣金</th>
                <th>楼栋</th>
                <th>状态</th>
                <th>截止时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="font-medium text-gray-800">{task.title}</td>
                  <td>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {task.typeName || '未知'}
                    </span>
                  </td>
                  <td>{task.publisherName || '未知'}</td>
                  <td>{task.acceptorName || '-'}</td>
                  <td className="text-primary-600 font-semibold">{formatMoney(task.commission)}</td>
                  <td>{task.building || '-'}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {getStatusText(task.status)}
                    </span>
                  </td>
                  <td className="text-gray-500 text-sm">{task.deadline}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(task.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="编辑">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="封禁">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>暂无符合条件的任务</p>
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">任务详情</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-sm">任务名称</label>
                <p className="font-medium">{selectedTask.title}</p>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">任务类型</label>
                <p>{selectedTask.typeName || '未知'}</p>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">任务描述</label>
                <p className="bg-gray-50 p-3 rounded-lg">{selectedTask.description || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-sm">佣金</label>
                  <p className="text-primary-600 font-semibold">{formatMoney(selectedTask.commission)}</p>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm">状态</label>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}
                  >
                    {getStatusText(selectedTask.status)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-sm">发布者</label>
                  <p>{selectedTask.publisherName || '未知'}</p>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm">接单者</label>
                  <p>{selectedTask.acceptorName || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-sm">楼栋</label>
                  <p>{selectedTask.building || '-'}</p>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm">截止时间</label>
                  <p>{selectedTask.deadline}</p>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-sm">创建时间</label>
                <p>{selectedTask.createTime}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTask(null)}
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
