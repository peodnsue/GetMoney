import { Link, Shield, Lock, Eye, Database, UserCheck, Baby } from 'lucide-react';
import BackButton from '../components/BackButton';

export function PrivacyPage() {
  return (
    <div className="min-h-screen gold-gradient relative">
      <div className="max-w-5xl mx-auto px-6 pt-24">
        <div className="mb-8" style={{ position: 'static' }}>
          <BackButton text="返回首页" />
        </div>

        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">隐私政策</h1>
          <p className="text-xl text-gray-600">最后更新日期：2024年1月1日</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-3xl p-12 shadow-xl border border-gray-100 mb-8">
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">引言</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              GetMoney校园任务平台（以下简称"我们"或"平台"）非常重视用户的隐私和个人信息保护。本隐私政策旨在向您说明我们如何收集、使用、存储、保护您的个人信息，以及您享有的相关权利。
            </p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">一、信息收集</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">您主动提供的信息</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-base">
                  <li>注册信息：邮箱账号、昵称、密码等</li>
                  <li>个人资料：头像、个性签名等</li>
                  <li>任务信息：发布的任务内容、接取的任务记录</li>
                  <li>交易信息：G豆余额、交易记录</li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">您使用服务时自动收集的信息</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-base">
                  <li>设备信息：设备型号、操作系统版本、设备标识符</li>
                  <li>日志信息：访问时间、访问页面、操作记录</li>
                  <li>位置信息：IP地址、地理位置（仅在获得您授权时）</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">二、信息使用</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              我们将使用收集的信息用于以下目的：
            </p>
            <ul className="grid md:grid-cols-2 gap-3">
              {[
                '提供、维护和改进我们的服务',
                '处理您的注册、登录请求',
                '管理和执行任务交易',
                '处理G豆交易和结算',
                '向您发送服务通知、更新信息',
                '回应您的咨询、投诉和建议',
                '进行数据分析和统计',
                '检测和预防欺诈、违规行为'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">三、信息共享</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              除以下情况外，我们不会与任何第三方共享您的个人信息：
            </p>
            <div className="space-y-3">
              {[
                '获得您明确同意',
                '任务相关：向任务发布者/接单者展示必要的交易信息',
                '服务提供商：帮助我们提供服务的供应商、承包商',
                '法律法规：当法律、法规或政府机构要求时'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">四、信息存储与安全</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">存储地点</h3>
                <p className="text-gray-600">您的信息将存储在中国境内的服务器上。</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">存储安全</h3>
                <p className="text-gray-600">我们采用行业标准的安全措施保护您的信息，包括数据加密、访问控制、安全审计等。</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">五、您的权利</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: '访问权', desc: '您有权访问您的个人信息' },
                { name: '更正权', desc: '您有权要求更正不准确的个人信息' },
                { name: '删除权', desc: '在满足一定条件下，您有权要求删除您的个人信息' },
                { name: '注销账户', desc: '您有权注销您的账户' }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-green-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">六、未成年人保护</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              我们非常重视对未成年人信息的保护。平台服务主要面向成年人。如果您是未满18周岁的未成年人，请在监护人的陪同和指导下阅读本隐私政策，并在取得监护人的同意后使用我们的服务。
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">七、联系我们</h2>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <p className="text-gray-600 leading-relaxed text-lg">
                如您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700 font-medium">📧 邮箱：privacy@getmoney.com</p>
                <p className="text-gray-700 font-medium">📞 电话：400-888-8888</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
