import { Link, FileText, Scale, Users, Coins, Target, AlertTriangle, Shield } from 'lucide-react';
import BackButton from '../components/BackButton';

export function TermsPage() {
  return (
    <div className="min-h-screen gold-gradient relative">
      <div className="max-w-5xl mx-auto px-6 pt-24">
        <div className="mb-8" style={{ position: 'static' }}>
          <BackButton text="返回首页" />
        </div>

        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">用户协议</h1>
          <p className="text-xl text-gray-600">最后更新日期：2024年1月1日</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-3xl p-12 shadow-xl border border-gray-100 mb-8">
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">一、服务说明</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              GetMoney校园任务平台（以下简称"平台"）是一个为校园用户提供任务发布、接单和G豆交易的中介服务平台。用户在使用本平台服务之前，应当认真阅读本协议的全部内容。用户一旦注册或使用本平台服务，即视为用户已经充分理解和同意本协议的全部内容，本协议即对用户产生法律约束力。
            </p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">二、用户注册</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              用户在使用本平台服务前需要注册一个账号。用户注册时应当按照注册提示填写真实、有效的信息，并及时更新。用户应保证其提供的注册资料真实、准确、完整、合法有效，用户注册资料如有变动的，应及时更新。
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              用户注册成功后，将获得平台账号和密码。用户应妥善保管账号和密码，因保管不善造成的经济损失由用户自行承担。
            </p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">三、G豆规则</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              G豆是平台内的虚拟货币，用于衡量用户在平台内的贡献价值和交易媒介。用户通过完成任务获得G豆奖励，可以使用G豆发布任务或向其他用户转账。
            </p>
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
              <p className="text-gray-600 leading-relaxed mb-3">
                <strong>获得G豆：</strong>用户通过完成平台任务获得G豆奖励。新用户注册可获得一定数量的G豆作为奖励。
              </p>
              <p className="text-gray-600 leading-relaxed mb-3">
                <strong>使用G豆：</strong>用户可以使用G豆发布任务、支付任务佣金、向其他用户转账。转账将收取一定比例的手续费。
              </p>
              <p className="text-gray-600 leading-relaxed">
                <strong>资金托管：</strong>用户发布任务时，佣金将托管在平台国库中。任务完成后，佣金将自动结算给接单者，扣除手续费后到账。
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">四、任务规则</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              <strong>发布任务：</strong>用户可以使用G豆发布任务，设定任务佣金、任务要求和完成期限。任务发布后，其他用户可以接取任务。
            </p>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              <strong>接取任务：</strong>用户可以浏览任务列表，选择感兴趣的任务接取。接取任务后，用户应在规定时间内完成任务并提交完成申请。
            </p>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              <strong>任务完成：</strong>接单者完成任务后提交完成申请，发布者确认任务完成。发布者确认后，G豆将自动结算给接单者。
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              <strong>任务取消：</strong>任务在接单者完成前可以取消。取消后，托管的佣金将原路退还给发布者。
            </p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">五、用户行为规范</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              用户在使用平台服务时应当遵守法律法规，不得利用平台从事任何违法违规活动。用户不得发布虚假任务、恶意刷单、进行欺诈交易等行为。
            </p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">六、免责声明</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              平台不对用户在平台内发布的信息真实性、合法性做任何担保。用户因使用平台服务产生的任何纠纷，由用户自行解决，与平台无关。
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              因不可抗力导致平台无法正常服务的，平台不承担任何责任。
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">七、联系我们</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              如您对本协议有任何疑问，请联系我们：<br />
              邮箱：support@getmoney.com<br />
              电话：400-888-8888
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
