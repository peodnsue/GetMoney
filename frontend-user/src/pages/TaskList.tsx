import { useState, useEffect } from 'react';
import { Package, MapPin, Clock, Wallet, Filter, Search, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Avatar } from '@/components/Avatar';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';
import { api } from '@/api/api';
import { useUserStore } from '@/store/userStore';
import type { Task, TaskType } from '@/types';
import { formatDate, formatMoney, getStatusText, getStatusColor } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface TaskListPageProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const statusOptions = [
  { value: 1, label: '待接单', color: 'bg-blue-100 text-blue-700' },
  { value: 2, label: '已接单', color: 'bg-yellow-100 text-yellow-700' },
  { value: 3, label: '已完成', color: 'bg-green-100 text-green-700' },
  { value: 4, label: '已取消', color: 'bg-gray-100 text-gray-700' },
  { value: 5, label: '已过期', color: 'bg-red-100 text-red-700' },
];

export function TaskListPage({ onShowToast }: TaskListPageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptingTaskIds, setAcceptingTaskIds] = useState<Set<number>>(new Set());

  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedType, selectedStatus]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params: { typeId?: number; status?: number } = {};
      if (selectedType !== null) params.typeId = selectedType;
      if (selectedStatus !== null) params.status = selectedStatus;

      const [tasksData, typesData] = await Promise.all([
        api.task.list(params),
        api.taskType.list(),
      ]);
      const processedTasks = tasksData.map(task => {
        let processedImages: string[] = [];
        if (task.images) {
          if (typeof task.images === 'string') {
            try {
              processedImages = JSON.parse(task.images);
            } catch {
              processedImages = [];
            }
          } else if (Array.isArray(task.images)) {
            processedImages = task.images;
          }
        }
        let publisherName = task.publisherName || '';
        let publisherAvatar = task.publisherAvatar || '';
        if (task.publisher && typeof task.publisher === 'object') {
          publisherName = task.publisher.nickname || '';
          publisherAvatar = task.publisher.avatar || '';
        }
        return { ...task, images: processedImages, publisherName, publisherAvatar };
      });
      setTasks(processedTasks);
      setTaskTypes(typesData);
    } catch {
      onShowToast('加载数据失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = searchQuery
    ? tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  const handleAcceptTask = async (taskId: number) => {
    if (acceptingTaskIds.has(taskId)) return;
    if (!user) {
      onShowToast('请先登录', 'warning');
      navigate('/login');
      return;
    }
    setAcceptingTaskIds(prev => new Set(prev).add(taskId));
    try {
      await api.task.accept(taskId);
      onShowToast('抢单成功', 'success');
      loadData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '抢单失败';
      onShowToast(errorMessage, 'error');
    } finally {
      setAcceptingTaskIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* 移动端筛选器 */}
          <div className="lg:hidden mb-4 space-y-3">
            <div className="flex gap-2">
              <select
                value={selectedType ?? ''}
                onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">全部类型</option>
                {taskTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus ?? ''}
                onChange={(e) => setSelectedStatus(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">全部状态</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {(selectedType !== null || selectedStatus !== null) && (
              <button
                onClick={() => {
                  setSelectedType(null);
                  setSelectedStatus(null);
                }}
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                重置筛选
              </button>
            )}
          </div>
          
          {/* 桌面端侧边栏 */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="p-4 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                筛选条件
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">任务类型</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedType(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedType === null
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      全部类型
                    </button>
                    {taskTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedType === type.id
                            ? 'bg-primary-50 text-primary-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">任务状态</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedStatus(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedStatus === null
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      全部状态
                    </button>
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedStatus(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedStatus === option.value
                            ? 'bg-primary-50 text-primary-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {(selectedType !== null || selectedStatus !== null) && (
                  <button
                    onClick={() => {
                      setSelectedType(null);
                      setSelectedStatus(null);
                    }}
                    className="w-full text-sm text-primary-500 hover:text-primary-600"
                  >
                    重置筛选
                  </button>
                )}
              </div>
            </Card>
          </aside>

          <div className="flex-1">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">任务列表</h1>
                  <span className="text-sm text-gray-500">共 {filteredTasks.length} 个任务</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索任务..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <Button onClick={() => navigate('/app/tasks/publish')}>
                    发布任务
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <Loading text="加载中..." />
              ) : filteredTasks.length === 0 ? (
                <Empty message="暂无任务" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/app/tasks/${task.id}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-600">
                            {task.typeName}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-primary-500">{formatMoney(task.commission)}</span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{task.description}</p>

                      {task.images && task.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-1 mb-3">
                          {task.images.slice(0, 4).map((img, index) => (
                            <div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden">
                              <img
                                src={img}
                                alt={`${task.title} - ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{task.building}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(task.deadline)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <Avatar name={task.publisherName} avatar={task.publisherAvatar} size="sm" />
                          <span className="text-sm text-gray-600">{task.publisherName}</span>
                        </div>
                        {task.status === 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptTask(task.id);
                            }}
                            disabled={acceptingTaskIds.has(task.id)}
                          >
                            {acceptingTaskIds.has(task.id) ? '接单中...' : '立即接单'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
