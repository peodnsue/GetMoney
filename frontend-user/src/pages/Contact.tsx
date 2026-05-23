import { Link, Mail, Phone, MessageCircle, Clock, Send, MapPin, Headphones } from 'lucide-react';
import BackButton from '../components/BackButton';

export function ContactPage() {
  return (
    <div className="min-h-screen gold-gradient relative">
      <div className="max-w-6xl mx-auto px-6 pt-24">
        <div className="mb-8" style={{ position: 'static' }}>
          <BackButton text="返回首页" />
        </div>

        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">联系客服</h1>
          <p className="text-xl text-gray-600">我们随时为您解答疑问</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-lg border border-blue-100/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">邮箱联系</h3>
            <p className="text-gray-600 mb-4">发送邮件至客服邮箱</p>
            <a href="mailto:support@getmoney.com" className="text-blue-600 font-semibold hover:underline">
              support@getmoney.com
            </a>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-lg border border-green-100/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">电话咨询</h3>
            <p className="text-gray-600 mb-4">工作日 9:00-18:00</p>
            <a href="tel:400-888-8888" className="text-green-600 font-semibold hover:underline">
              400-888-8888
            </a>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-lg border border-purple-100/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">在线客服</h3>
            <p className="text-gray-600 mb-4">实时在线，快速响应</p>
            <button className="text-purple-600 font-semibold hover:underline">
              点击咨询
            </button>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-lg border border-amber-100/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">工作时间</h3>
            <p className="text-gray-600 mb-4">周一至周五</p>
            <p className="text-amber-600 font-semibold">
              09:00 - 18:00
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12 border border-blue-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">意见反馈</h3>
            <p className="text-gray-600 text-lg">
              如果您在使用过程中遇到问题或有好的建议，欢迎通过意见反馈提交
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/feedback"
              className="inline-flex items-center gap-2 px-8 py-4 gradient-bg-gold text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-yellow-500/25"
            >
              提交反馈
              <Send className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
