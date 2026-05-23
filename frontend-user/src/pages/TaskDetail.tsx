import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Wallet, User, CheckCircle, XCircle, AlertCircle, FileText, Tag, Calendar, Building } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { Loading } from '@/components/Loading';
import { api } from '@/api/api';
import { useUserStore } from '@/store/userStore';
import type { Task } from '@/types';
import { formatDate, formatMoney, getStatusText, getStatusColor } from '@/lib/utils';

interface TaskDetailPageProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function TaskDetailPage({ onShowToast }: TaskDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    setIsLoading(true);
    try {
      if (id) {
        const taskData = await api.task.detail(parseInt(id));
        console.log('API返回的任务数据:', taskData);
        console.log('publisherId:', taskData.publisherId);
        console.log('acceptorId:', taskData.acceptorId);
        console.log('status:', taskData.status);
        console.log('acceptTime:', taskData.acceptTime);
        console.log('completeTime:', taskData.completeTime);
        let processedImages: string[] = [];
        if (taskData.images) {
          if (typeof taskData.images === 'string') {
            try {
              processedImages = JSON.parse(taskData.images);
            } catch {
              processedImages = [];
            }
          } else if (Array.isArray(taskData.images)) {
            processedImages = taskData.images;
          }
        }
        let publisherName = taskData.publisherName || '';
        let publisherAvatar = taskData.publisherAvatar || '';
        if (taskData.publisher && typeof taskData.publisher === 'object') {
          publisherName = taskData.publisher.nickname || '';
          publisherAvatar = taskData.publisher.avatar || '';
        }
        setTask({ ...taskData, images: processedImages, publisherName, publisherAvatar });
      }
    } catch {
      onShowToast('加载任务详情失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTask = async () => {
    if (!user) {
      onShowToast('请先登录', 'warning');
      navigate('/login');
      return;
    }
    if (!task || task.status !== 1) {
      onShowToast('任务状态不允许接单', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.task.accept(task.id);
      onShowToast('接单成功', 'success');
      loadTask();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '接单失败';
      onShowToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!user) {
      onShowToast('请先登录', 'warning');
      navigate('/login');
      return;
    }
    if (!task || task.status !== 2) {
      onShowToast('任务状态不允许完成', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.task.complete(task.id);
      onShowToast('已提交完成申请', 'success');
      loadTask();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '操作失败';
      onShowToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmComplete = async () => {
    if (!user) {
      onShowToast('请先登录', 'warning');
      navigate('/login');
      return;
    }
    if (!task || task.status !== 3) {
      onShowToast('任务状态不允许确认完成', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.task.confirmComplete(task.id);
      onShowToast('确认完成成功，佣金已结算', 'success');
      loadTask();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '操作失败';
      onShowToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelTask = async () => {
    if (!user) {
      onShowToast('请先登录', 'warning');
      navigate('/login');
      return;
    }
    if (!task || (task.status !== 1 && task.status !== 2)) {
      onShowToast('任务状态不允许取消', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.task.cancel(task.id);
      onShowToast('任务已取消', 'success');
      navigate('/app');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '取消失败';
      onShowToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading text="加载中..." />;
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">任务不存在</p>
      </div>
    );
  }

  const isPublisher = user && user.id === task.publisherId;
  console.log('user.id:', user?.id, 'task.publisherId:', task.publisherId, 'isPublisher:', isPublisher);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/app')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">任务详情</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-600">
                    {task.typeName}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </div>
                <span className="text-3xl font-bold text-primary-500">{formatMoney(task.commission)}</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">{task.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{task.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">任务地点</p>
                    <p className="text-base font-medium text-gray-700">{task.building}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-warning-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">截止时间</p>
                    <p className="text-base font-medium text-gray-700">{formatDate(task.deadline)}</p>
                  </div>
                </div>
              </div>

              {task.images.length > 0 && (
                <div className="mb-6">
                  <p className="text-base font-medium text-gray-700 mb-3">任务图片</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {task.images.map((img, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={img}
                          alt={`任务图片 ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" />
                发布者信息
              </h3>
              <div className="flex items-center gap-4">
                <Avatar name={task.publisherName} avatar={task.publisherAvatar} size="lg" />
                <div>
                  <p className="text-lg font-medium text-gray-800">{task.publisherName}</p>
                  <p className="text-sm text-gray-500">发布于 {formatDate(task.createTime)}</p>
                </div>
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                任务操作
              </h3>

              <div className="space-y-3">
                {task.status === 1 && (
                  <>
                    <Button className="w-full" onClick={handleAcceptTask} disabled={isSubmitting} size="lg">
                      {isSubmitting ? '操作中...' : '一键接单'}
                    </Button>
                    {isPublisher && (
                      <Button variant="danger" className="w-full" onClick={handleCancelTask} disabled={isSubmitting}>
                        {isSubmitting ? '操作中...' : '取消任务'}
                      </Button>
                    )}
                  </>
                )}

                {task.status === 2 && (
                  <>
                    {!isPublisher && (
                      <Button className="w-full" onClick={handleCompleteTask} disabled={isSubmitting} size="lg">
                        {isSubmitting ? '操作中...' : '提交完成'}
                      </Button>
                    )}
                    {isPublisher && (
                      <Button className="w-full" onClick={handleConfirmComplete} disabled={isSubmitting} size="lg">
                        {isSubmitting ? '操作中...' : '确认完成并结算'}
                      </Button>
                    )}
                    <Button variant="outline" className="w-full" onClick={handleCancelTask} disabled={isSubmitting}>
                      {isSubmitting ? '操作中...' : '取消任务'}
                    </Button>
                  </>
                )}

                {task.status === 3 && (
                  <>
                    {isPublisher ? (
                      <Button className="w-full" onClick={handleConfirmComplete} disabled={isSubmitting} size="lg">
                        {isSubmitting ? '操作中...' : '确认完成并结算'}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-warning-50 rounded-lg">
                        <Clock className="w-6 h-6 text-warning-500" />
                        <div>
                          <p className="font-medium text-warning-700">等待发布者确认</p>
                          <p className="text-sm text-warning-600">请等待发布者确认完成</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {task.status === 4 && (
                  <div className="flex items-center gap-3 p-4 bg-success-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-success-500" />
                    <div>
                      <p className="font-medium text-success-700">任务已完成</p>
                      <p className="text-sm text-success-600">佣金已结算</p>
                    </div>
                  </div>
                )}

                {task.status === 5 && (
                  <div className="flex items-center gap-3 p-4 bg-danger-50 rounded-lg">
                    <XCircle className="w-6 h-6 text-danger-500" />
                    <div>
                      <p className="font-medium text-danger-700">任务已取消</p>
                      <p className="text-sm text-danger-600">任务已被取消</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary-500" />
                任务须知
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                  接单前请仔细阅读任务描述，确保能够完成
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                  接单后请在截止时间前完成任务
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                  如有问题请及时与发布者沟通
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                  完成任务后请提交完成申请等待确认
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                任务时间线
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">任务发布</p>
                    <p className="text-xs text-gray-500">{formatDate(task.createTime)}</p>
                  </div>
                </div>
                {task.status > 1 && (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-success-600">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">任务接单</p>
                        <p className="text-xs text-gray-500">{task.acceptTime ? formatDate(task.acceptTime) : '接单时间'}</p>
                      </div>
                    </div>
                  </>
                )}
                {task.status > 2 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-warning-600">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">任务完成</p>
                      <p className="text-xs text-gray-500">{task.completeTime ? formatDate(task.completeTime) : '完成时间'}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
