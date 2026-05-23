import { useState, useEffect } from 'react';
import { getNoticeList, publishNotice, updateNotice, updateNoticeStatus, deleteNotice, SysNotice } from '../api/api';
import { Plus, Edit2, Trash2, X, Megaphone, Eye, EyeOff } from 'lucide-react';

export default function Notices() {
  const [notices, setNotices] = useState<SysNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<SysNotice | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    noticeType: 1,
  });

  useEffect(() => {
    fetchNotices();
  }, [currentPage, statusFilter]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await getNoticeList(currentPage, pageSize, statusFilter);
      if (res.code === 200) {
        setNotices(res.data.records);
        const totalCount = res.data.total || res.data.records.length;
        setTotal(totalCount);
      }
    } catch (err) {
      console.error('Failed to fetch notices:', err);
      showMessage('获取公告列表失败', 'error');
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

  const handleOpenModal = (notice?: SysNotice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        content: notice.content,
        noticeType: notice.noticeType,
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        content: '',
        noticeType: 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      showMessage('请填写标题和内容', 'error');
      return;
    }

    try {
      if (editingNotice) {
        const res = await updateNotice(editingNotice.id, formData);
        if (res.code === 200) {
          showMessage('更新成功', 'success');
          fetchNotices();
          handleCloseModal();
        } else {
          showMessage(res.message || '更新失败', 'error');
        }
      } else {
        const res = await publishNotice(formData);
        if (res.code === 200) {
          showMessage('发布成功', 'success');
          fetchNotices();
          handleCloseModal();
        } else {
          showMessage(res.message || '发布失败', 'error');
        }
      }
    } catch (err) {
      console.error('Failed to save notice:', err);
      showMessage('操作失败，请稍后重试', 'error');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`确定要删除公告「${title}」吗？`)) {
      try {
        const res = await deleteNotice(id);
        if (res.code === 200) {
          showMessage('删除成功', 'success');
          fetchNotices();
        } else {
          showMessage(res.message || '删除失败', 'error');
        }
      } catch (err) {
        console.error('Failed to delete notice:', err);
        showMessage('网络异常，请稍后重试', 'error');
      }
    }
  };

  const handleToggleStatus = async (notice: SysNotice) => {
    const newStatus = notice.status === 1 ? 0 : 1;
    const action = newStatus === 1 ? '发布' : '撤回';

    try {
      const res = await updateNoticeStatus(notice.id, newStatus);
      if (res.code === 200) {
        showMessage(`${action}成功`, 'success');
        fetchNotices();
      } else {
        showMessage(res.message || `${action}失败`, 'error');
      }
    } catch (err) {
      console.error('Failed to update notice status:', err);
      showMessage('网络异常，请稍后重试', 'error');
    }
  };

  const getStatusLabel = (status: number) => {
    return status === 1 ? '已发布' : '草稿';
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  const getNoticeTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return '系统公告';
      case 2:
        return '活动公告';
      case 3:
        return '维护公告';
      default:
        return '其他';
    }
  };

  const getNoticeTypeColor = (type: number) => {
    switch (type) {
      case 1:
        return 'bg-blue-100 text-blue-700';
      case 2:
        return 'bg-purple-100 text-purple-700';
      case 3:
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
          <h1 className="text-2xl font-bold text-gray-800">公告管理</h1>
          <p className="text-gray-500 mt-1">发布和管理平台公告</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>发布公告</span>
        </button>
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
            <option value="1">已发布</option>
            <option value="0">草稿</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>公告标题</th>
                <th>类型</th>
                <th>状态</th>
                <th>发布时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id}>
                  <td>
                    <div>
                      <p className="font-medium text-gray-800">{notice.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                        {notice.content}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getNoticeTypeColor(
                        notice.noticeType
                      )}`}
                    >
                      {getNoticeTypeLabel(notice.noticeType)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        notice.status
                      )}`}
                    >
                      {getStatusLabel(notice.status)}
                    </span>
                  </td>
                  <td>{formatDate(notice.publishTime || notice.createTime)}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(notice)}
                        className={`p-2 rounded-lg ${
                          notice.status === 1
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={notice.status === 1 ? '撤回' : '发布'}
                      >
                        {notice.status === 1 ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenModal(notice)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id, notice.title)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {notices.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无公告，点击上方按钮发布</p>
          </div>
        )}

        {notices.length > 0 && (
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingNotice ? '编辑公告' : '发布公告'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">公告标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="请输入公告标题"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">公告类型</label>
                <select
                  value={formData.noticeType}
                  onChange={(e) => setFormData({ ...formData, noticeType: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={1}>系统公告</option>
                  <option value={2}>活动公告</option>
                  <option value={3}>维护公告</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">公告内容 *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="请输入公告内容"
                  rows={10}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600"
                >
                  {editingNotice ? '保存' : '发布'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
