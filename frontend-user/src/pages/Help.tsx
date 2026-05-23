import { Link, HelpCircle, Book, MessageCircle, ChevronRight, Shield } from 'lucide-react';
import BackButton from '../components/BackButton';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '如何开始接单赚钱？',
    answer: '首先注册并登录账号，然后在任务列表中浏览感兴趣的任务，点击"立即接单"即可接取任务。完成任务后提交完成申请，等待发布者确认即可获得G豆奖励。'
  },
  {
    question: 'G豆是什么？如何使用？',
    answer: 'G豆是平台内的虚拟货币。通过完成任务可获得G豆奖励，可用于发布任务支付佣金、向其他用户转账或兑换平台服务。'
  },
  {
    question: '发布任务需要多少G豆？',
    answer: '发布任务时需要支付任务佣金作为押金，佣金金额由您自行设定。任务完成后，佣金会扣除手续费后结算给接单者，剩余部分会退还给您。'
  },
  {
    question: '任务完成后多久能到账？',
    answer: '任务完成后需要发布者确认，确认后G豆会立即到账。您可以在个人中心的G豆钱包中查看余额和交易记录。'
  },
  {
    question: '如何提现G豆？',
    answer: '目前G豆主要用于平台内交易。您可以使用G豆发布任务或转账给其他用户。未来将开放更多兑换方式。'
  },
  {
    question: '任务超时怎么办？',
    answer: '如果任务在规定时间内未完成，发布者可以取消任务。取消后，托管的佣金会原路退回到发布者账户。'
  },
  {
    question: '如何保证交易安全？',
    answer: '平台采用资金托管机制，发布者的佣金会托管在平台国库中，确认完成后才会结算给接单者，确保双方权益。'
  },
  {
    question: '可以同时接取多个任务吗？',
    answer: '可以同时接取多个任务，但建议根据自己的能力和时间合理安排，确保能够按时完成每个任务。'
  }
];

export function HelpPage() {
  return (
    <div className="min-h-screen gold-gradient relative">
      <div className="max-w-6xl mx-auto px-6 pt-24">
        <div className="mb-8" style={{ position: 'static' }}>
          <BackButton text="返回首页" />
        </div>

        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-yellow-500/20">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">常见问题</h1>
          <p className="text-xl text-gray-600">解答您在使用平台过程中的常见疑问</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-lg border border-yellow-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Book className="w-7 h-7 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl p-12 text-center border border-yellow-200">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">还有其他问题？</h3>
          <p className="text-gray-600 mb-6 text-lg">我们的客服团队随时为您解答</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 gradient-bg-gold text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-yellow-500/25"
          >
            联系客服
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
