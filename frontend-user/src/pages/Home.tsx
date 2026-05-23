import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, Briefcase, MapPin, Clock, Wallet, TrendingUp, Star, Filter, Plus, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';
import { Avatar } from '@/components/Avatar';
import { api } from '@/api/api';
import { useUserStore } from '@/store/userStore';
import type { Task, TaskType, Banner } from '@/types';
import { formatDate, formatMoney, getStatusText, getStatusColor } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function HomePage({ onShowToast }: HomePageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [acceptingTaskIds, setAcceptingTaskIds] = useState<Set<number>>(new Set());

  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedType]);

  useEffect(() => {
    if (banners.length === 0) return;
    
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tasksData, typesData, bannersData] = await Promise.all([
        api.task.list(selectedType !== null ? { typeId: selectedType } : undefined),
        api.taskType.list(),
        api.banner.list(),
      ]);
      console.log('API返回的任务数据:', tasksData);
      const tasksArray = tasksData;
      console.log('处理后的任务数组:', tasksArray, '长度:', tasksArray.length);
      const processedTasks = tasksArray.map((task: Task) => {
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
      console.log('处理后的任务列表:', processedTasks);
      setTasks(processedTasks);
      setTaskTypes(typesData);
      setBanners(bannersData);
    } catch (error) {
      console.error('加载数据失败:', error);
      onShowToast('加载数据失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

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

  const pendingTasks = tasks.filter(t => t.status === 1);
  const trendingTasks = pendingTasks.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {banners.length > 0 && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: index === activeBanner ? 1 : 0,
              }}
              onClick={() => banner.linkUrl && navigate(banner.linkUrl)}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{banner.title}</h2>
                {banner.description && (
                  <p className="text-sm sm:text-base md:text-lg opacity-90">{banner.description}</p>
                )}
              </div>
            </div>
          ))}
          
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveBanner(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                  index === activeBanner ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length)}
            className="hidden sm:block absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <span className="text-lg sm:text-xl font-bold">&lt;</span>
          </button>
          <button
            onClick={() => setActiveBanner((prev) => (prev + 1) % banners.length)}
            className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <span className="text-lg sm:text-xl font-bold">&gt;</span>
          </button>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* 移动端任务分类选择器 */}
          <div className="lg:hidden mb-4">
            <select
              value={selectedType ?? ''}
              onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">全部任务</option>
              {taskTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* 桌面端侧边栏 */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="p-4 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">任务分类</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedType === null
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  全部任务
                </button>
                {taskTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      selectedType === type.id
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          <div className="flex-1 space-y-4 sm:space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  热门任务
                </h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/app/tasks')}>
                  查看更多
                </Button>
              </div>

              {isLoading ? (
                <Loading text="加载中..." />
              ) : trendingTasks.length === 0 ? (
                <Empty message="暂无任务" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/app/tasks/${task.id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 flex-1">{task.title}</h4>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                      
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
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Avatar name={task.publisherName} avatar={task.publisherAvatar} size="sm" />
                          <span className="text-xs text-gray-500">{task.publisherName}</span>
                        </div>
                        <span className="text-lg font-bold text-primary-500">{formatMoney(task.commission)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">最新任务</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/app/tasks')}>
                  查看更多
                </Button>
              </div>

              {isLoading ? (
                <Loading text="加载中..." />
              ) : pendingTasks.length === 0 ? (
                <Empty message="暂无任务" />
              ) : (
                <div className="space-y-3">
                  {pendingTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/app/tasks/${task.id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-1">{task.title}</h4>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-1">{task.description}</p>
                        </div>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                      </div>
                      
                      {task.images && task.images.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {task.images.slice(0, 4).map((img, index) => (
                            <div key={index} className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
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
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {task.building}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(task.deadline)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-primary-500">{formatMoney(task.commission)}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptTask(task.id);
                            }}
                            disabled={acceptingTaskIds.has(task.id)}
                            className="px-3 py-1 bg-primary-500 text-white text-xs rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {acceptingTaskIds.has(task.id) ? '接单中...' : '接单'}
                          </button>
                        </div>
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
