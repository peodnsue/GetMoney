import { useState } from 'react';
import { Send, Star, CheckCircle, Link as LinkIcon, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

type FeedbackType = 'suggestion' | 'bug' | 'other';

export function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('suggestion');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('请输入反馈内容');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const feedbackTypes = [
    { value: 'suggestion' as FeedbackType, label: '功能建议', icon: '💡', color: 'from-yellow-400 to-amber-500' },
    { value: 'bug' as FeedbackType, label: '问题反馈', icon: '🐛', color: 'from-red-400 to-pink-500' },
    { value: 'other' as FeedbackType, label: '其他', icon: '📝', color: 'from-purple-400 to-indigo-500' }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen gold-gradient flex items-center justify-center p-8">
        <div className="bg-white/95 backdrop-blur rounded-3xl p-16 shadow-2xl max-w-lg text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">感谢您的反馈</h2>
          <p className="text-gray-600 text-lg mb-10">
            我们已经收到您的反馈，会认真处理并不断改进产品体验。
          </p>
          <BackButton text="返回首页" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gold-gradient relative">
      <div className="max-w-3xl mx-auto px-6 pt-24">
        <div className="mb-8" style={{ position: 'static' }}>
          <BackButton text="返回首页" />
        </div>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-purple-500/20">
            <Send className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">意见反馈</h1>
          <p className="text-xl text-gray-600">您的意见对我们非常重要</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-3xl p-10 shadow-xl border border-gray-100">
          <div className="mb-10">
            <label className="block text-lg font-medium text-gray-700 mb-4">反馈类型</label>
            <div className="grid grid-cols-3 gap-6">
              {feedbackTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFeedbackType(type.value)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    feedbackType === type.value
                      ? 'border-yellow-500 bg-yellow-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-4xl mb-3 block">{type.icon}</span>
                  <span className={`text-base font-semibold ${
                    feedbackType === type.value ? 'text-yellow-700' : 'text-gray-700'
                  }`}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-lg font-medium text-gray-700 mb-4">
              对平台满意度
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-3 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-4 text-lg text-gray-600">
                  {rating <= 2 ? '我们会努力改进' : rating <= 4 ? '感谢您的支持' : '非常感谢您的认可！'}
                </span>
              )}
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-lg font-medium text-gray-700 mb-4">
              反馈内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请详细描述您的问题或建议..."
              rows={6}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all resize-none text-base"
            />
          </div>

          <div className="mb-10">
            <label className="block text-lg font-medium text-gray-700 mb-4">
              联系方式（选填）
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="邮箱或手机号，方便我们联系您"
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all text-base"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-5 gradient-bg-gold text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-yellow-500/25"
          >
            {isSubmitting ? (
              <>
                <span className="text-2xl animate-spin">⏳</span>
                <span className="text-lg">提交中...</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                <span className="text-lg">提交反馈</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
