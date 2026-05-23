import { useState, useEffect } from 'react';
import { Bell, Check, ChevronLeft, Mail } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';
import { api, Notice } from '@/api/api';
import { useNavigate } from 'react-router-dom';

interface MessagesPageProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function MessagesPage({ onShowToast }: MessagesPageProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadNotices();
  }, [current]);

  const loadNotices = async () => {
    setIsLoading(true);
    try {
      const data = await api.notice.getList(current, pageSize);
      setNotices(data.records);
      setTotal(data.total);
    } catch (error) {
      console.error('加载公告失败:', error);
      onShowToast('加载失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (notice: Notice) => {
    if (notice.isRead) {
      setSelectedNotice(notice);
      return;
    }
    
    setIsDetailLoading(true);
    try {
      const detail = await api.notice.getDetail(notice.id);
      setSelectedNotice(detail);
      
      setNotices(prev => prev.map(n => 
        n.id === notice.id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('获取详情失败:', error);
      onShowToast('获取详情失败', 'error');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notice.markAllRead();
      setNotices(prev => prev.map(n => ({ ...n, isRead: true })));
      onShowToast('全部已读', 'success');
    } catch (error) {
      console.error('标记失败:', error);
      onShowToast('操作失败', 'error');
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  const unreadCount = notices.filter(n => !n.isRead).length;

  if (selectedNotice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 py-6 sm:py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">公告详情</h1>
            </div>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{selectedNotice.title}</h2>
              <div className="text-sm text-gray-500 mb-6">
                发布时间: {new Date(selectedNotice.publishTime).toLocaleString('zh-CN')}
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedNotice.content}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary-500" />
              <h1 className="text-xl font-bold text-gray-800">消息通知</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkAllRead}
                className="flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                全部已读
              </Button>
            )}
          </div>

          <Card className="p-0">
            {isLoading ? (
              <div className="p-8">
                <Loading text="加载中..." />
              </div>
            ) : notices.length === 0 ? (
              <div className="p-8">
                <Empty message="暂无消息通知" />
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    onClick={() => handleViewDetail(notice)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notice.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !notice.isRead ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        <Mail className={`w-5 h-5 ${!notice.isRead ? 'text-primary-500' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium truncate ${
                            !notice.isRead ? 'text-gray-800' : 'text-gray-600'
                          }`}>
                            {notice.title}
                          </h3>
                          {!notice.isRead && (
                            <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1 mb-1">
                          {notice.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(notice.publishTime).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-4">
              <p className="text-sm text-gray-500">
                共 {total} 条记录
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrent(Math.max(1, current - 1))}
                  disabled={current === 1}
                >
                  上一页
                </Button>
                <span className="text-sm text-gray-600">
                  第 {current} / {totalPages} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrent(Math.min(totalPages, current + 1))}
                  disabled={current === totalPages}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isDetailLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <Loading text="加载中..." />
          </div>
        </div>
      )}
    </div>
  );
}
