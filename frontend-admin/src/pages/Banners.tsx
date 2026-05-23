import { useState, useEffect } from 'react';
import { getBanners, createBanner, updateBanner, deleteBanner, Banner, BannerRequest } from '../api/api';
import { Plus, Edit2, Trash2, Image, X, Check } from 'lucide-react';

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState<BannerRequest>({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    sort: 0,
    status: 1,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getBanners();
      if (res.code === 200) {
        setBanners(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch banners:', err);
      showMessage('获取轮播图列表失败', 'error');
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

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        description: banner.description || '',
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl || '',
        sort: banner.sort,
        status: banner.status,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        sort: banners.length,
        status: 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.imageUrl) {
      showMessage('请填写标题和图片链接', 'error');
      return;
    }

    try {
      if (editingBanner) {
        const res = await updateBanner(editingBanner.id, formData);
        if (res.code === 200) {
          showMessage('更新成功', 'success');
          fetchBanners();
          handleCloseModal();
        } else {
          showMessage(res.message || '更新失败', 'error');
        }
      } else {
        const res = await createBanner(formData);
        if (res.code === 200) {
          showMessage('创建成功', 'success');
          fetchBanners();
          handleCloseModal();
        } else {
          showMessage(res.message || '创建失败', 'error');
        }
      }
    } catch (err) {
      console.error('Failed to save banner:', err);
      showMessage('操作失败，请稍后重试', 'error');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`确定要删除轮播图「${title}」吗？`)) {
      try {
        const res = await deleteBanner(id);
        if (res.code === 200) {
          showMessage('删除成功', 'success');
          fetchBanners();
        } else {
          showMessage(res.message || '删除失败', 'error');
        }
      } catch (err) {
        console.error('Failed to delete banner:', err);
        showMessage('网络异常，请稍后重试', 'error');
      }
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    const newStatus = banner.status === 1 ? 0 : 1;
    const action = newStatus === 1 ? '启用' : '禁用';

    try {
      const res = await updateBanner(banner.id, { ...banner, status: newStatus });
      if (res.code === 200) {
        showMessage(`${action}成功`, 'success');
        fetchBanners();
      } else {
        showMessage(res.message || `${action}失败`, 'error');
      }
    } catch (err) {
      console.error('Failed to update banner status:', err);
      showMessage('网络异常，请稍后重试', 'error');
    }
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
          <h1 className="text-2xl font-bold text-gray-800">轮播图管理</h1>
          <p className="text-gray-500 mt-1">管理首页轮播图</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>添加轮播图</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                banner.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
              }`}>
                {banner.status === 1 ? '启用' : '禁用'}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{banner.title}</h3>
              {banner.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{banner.description}</p>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-400">排序: {banner.sort}</div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleStatus(banner)}
                    className={`p-2 rounded-lg ${
                      banner.status === 1
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={banner.status === 1 ? '禁用' : '启用'}
                  >
                    {banner.status === 1 ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenModal(banner)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="编辑"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id, banner.title)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无轮播图，点击上方按钮添加</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingBanner ? '编辑轮播图' : '添加轮播图'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="请输入标题"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">图片链接 *</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              {formData.imageUrl && (
                <div className="mt-2">
                  <label className="block text-gray-500 text-xs mb-2">图片预览</label>
                  <div className="border rounded-lg overflow-hidden">
                    <img src={formData.imageUrl} alt="预览" className="w-full h-32 object-cover" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="请输入描述（可选）"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">链接地址</label>
                <input
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com（可选）"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">排序</label>
                  <input
                    type="number"
                    value={formData.sort}
                    onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={1}>启用</option>
                    <option value={0}>禁用</option>
                  </select>
                </div>
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
                  {editingBanner ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
