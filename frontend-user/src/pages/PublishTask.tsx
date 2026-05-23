import { useState, useEffect, useRef } from 'react';
import { Package, ShoppingCart, Users, Briefcase, FileText, Tag, Calendar, Building, Image, Clock, Wallet, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Select } from '@/components/Select';
import { api } from '@/api/api';
import { useUserStore } from '@/store/userStore';
import type { TaskType } from '@/types';

interface PublishTaskPageProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function PublishTaskPage({ onShowToast }: PublishTaskPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [typeId, setTypeId] = useState<number>(0);
  const [commission, setCommission] = useState('');
  const [deadline, setDeadline] = useState('');
  const [building, setBuilding] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isLoggedIn, accessToken } = useUserStore();
  
  console.log('PublishTask 页面 - isLoggedIn:', isLoggedIn);
  console.log('PublishTask 页面 - accessToken:', accessToken);
  console.log('PublishTask 页面 - localStorage accessToken:', localStorage.getItem('accessToken'));
  console.log('PublishTask 页面 - localStorage refreshToken:', localStorage.getItem('refreshToken'));

  useEffect(() => {
    loadTaskTypes();
  }, []);

  const loadTaskTypes = async () => {
    try {
      const types = await api.taskType.list();
      setTaskTypes(types);
    } catch {
      onShowToast('加载任务类型失败', 'error');
    }
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      onShowToast('请先登录', 'warning');
      navigate('/login');
      return;
    }

    if (!title.trim()) {
      onShowToast('请输入任务标题', 'error');
      return;
    }
    if (!description.trim()) {
      onShowToast('请输入任务描述', 'error');
      return;
    }
    if (!typeId) {
      onShowToast('请选择任务类型', 'error');
      return;
    }
    if (!commission || parseFloat(commission) <= 0) {
      onShowToast('请输入有效的佣金金额', 'error');
      return;
    }
    if (!deadline) {
      onShowToast('请选择截止时间', 'error');
      return;
    }
    if (!building.trim()) {
      onShowToast('请输入地点', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.task.create({
        title: title.trim(),
        description: description.trim(),
        typeId,
        commission: parseFloat(commission),
        deadline,
        building: building.trim(),
        images,
      });
      onShowToast('任务发布成功', 'success');
      navigate('/app');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('余额不足')) {
        onShowToast('余额不足，无法发布任务', 'error');
      } else if (errorMessage.includes('G豆')) {
        onShowToast(errorMessage, 'error');
      } else {
        onShowToast('发布失败，请重试', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImage = () => {
    if (images.length >= 4) {
      onShowToast('最多上传4张图片', 'warning');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        onShowToast('请选择图片文件', 'error');
        return;
      }
      
      // 限制单张图片大小为200KB，多张图片总大小不超过800KB
      if (file.size > 200 * 1024) {
        onShowToast('单张图片大小不能超过200KB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImages([...images, result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                发布任务
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                发布任务是校园互助平台的核心功能。您可以在这里发布各种校园任务，如代取快递、图书馆占座、资料复印等，让其他同学帮助您完成。
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-500" />
                任务类型说明
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">代取快递</p>
                    <p className="text-xs text-gray-500">帮忙领取并送达快递</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-4 h-4 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">代买商品</p>
                    <p className="text-xs text-gray-500">代为购买物品</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-warning-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">组队互助</p>
                    <p className="text-xs text-gray-500">寻找同学一起完成任务</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">其他任务</p>
                    <p className="text-xs text-gray-500">其他校园互助需求</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-500" />
                发布须知
              </h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                  任务描述请尽量详细，便于接单人理解
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                  佣金金额请合理设定，建议参考市场行情
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                  请确保任务地点准确，便于接单人找到位置
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                  上传清晰的任务图片可以提高接单率
                </li>
              </ul>
            </Card>
          </aside>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">发布新任务</h2>
              
              <div className="space-y-6">
                <div>
                  <Input
                    label="任务标题"
                    placeholder="请输入任务标题（如：帮取快递到图书馆）"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Select
                    label="任务类型"
                    value={typeId || ''}
                    onChange={(e) => setTypeId(parseInt(e.target.value) || 0)}
                  >
                    <option value="">请选择任务类型</option>
                    {taskTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Textarea
                    label="任务描述"
                    placeholder="请详细描述任务内容，包括具体要求、注意事项等..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Input
                      label="佣金金额"
                      icon={<Wallet className="w-4 h-4" />}
                      placeholder="请输入佣金"
                      value={commission}
                      onChange={(e) => setCommission(e.target.value)}
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Input
                      label="截止时间"
                      icon={<Clock className="w-4 h-4" />}
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      label="地点"
                      icon={<Building className="w-4 h-4" />}
                      placeholder="如：1号楼、图书馆、二食堂"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">任务图片（可选，最多4张）</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-lg relative group overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`图片 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                    {images.length < 4 && (
                      <button
                        onClick={handleAddImage}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        <Image className="w-6 h-6 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/app')}
                  >
                    取消
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '发布中...' : '发布任务'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
