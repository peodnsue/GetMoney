import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getUsers, getTasks, getTodayStatistics } from '../api/api';
import { mockDisputes } from '../data/mockData';
import { Users, ClipboardList, AlertCircle, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { formatMoney } from '../lib/utils';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const setUsers = useStore((state) => state.setUsers);
  const setTasks = useStore((state) => state.setTasks);
  const setStatistics = useStore((state) => state.setStatistics);
  const users = useStore((state) => state.users);
  const tasks = useStore((state) => state.tasks);
  const statistics = useStore((state) => state.statistics);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [usersRes, tasksRes, statsRes] = await Promise.all([
          getUsers(1, 50),
          getTasks(1, 50),
          getTodayStatistics(),
        ]);
        
        if (usersRes.code === 200) {
          setUsers(usersRes.data.records);
        }
        if (tasksRes.code === 200) {
          setTasks(tasksRes.data.records);
        }
        if (statsRes.code === 200) {
          setStatistics(statsRes.data);
        }
      } catch (err) {
        setError('数据加载失败，请检查后端服务是否启动');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setUsers, setTasks, setStatistics]);

  const pendingDisputes = mockDisputes.filter((d) => d.status === 'pending');

  const statsCards = [
    {
      title: '总用户数',
      value: users.length,
      icon: Users,
      color: 'bg-blue-500',
      subtext: `${users.filter(u => u.status === 1).length} 活跃 / ${users.filter(u => u.status === 0).length} 封禁`,
    },
    {
      title: '总任务数',
      value: tasks.length,
      icon: ClipboardList,
      color: 'bg-green-500',
      subtext: `${tasks.filter(t => t.status === 1).length} 待接单 / ${tasks.filter(t => t.status === 3).length} 已完成`,
    },
    {
      title: '待处理纠纷',
      value: pendingDisputes.length,
      icon: AlertCircle,
      color: 'bg-red-500',
      subtext: '需要处理',
    },
    {
      title: '今日成交',
      value: statistics ? formatMoney(statistics.totalAmount) : '¥0.00',
      icon: DollarSign,
      color: 'bg-purple-500',
      subtext: statistics ? `${statistics.totalTasks} 单` : '0 单',
    },
  ];

  const recentTasks = tasks.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center justify-center min-h-[200px] text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">首页</h1>
          <p className="text-gray-500 mt-1">欢迎来到校园接单平台管理后台</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>系统运行正常</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                  <p className="text-gray-500 text-sm mt-2">{card.subtext}</p>
                </div>
                <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">最新任务</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>任务名称</th>
                  <th>发布者</th>
                  <th>佣金</th>
                  <th>状态</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="font-medium text-gray-800">{task.title}</td>
                    <td>{task.publisherName || '未知'}</td>
                    <td className="text-primary-600 font-semibold">{formatMoney(task.commission)}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 3
                            ? 'bg-green-100 text-green-700'
                            : task.status === 1
                            ? 'bg-yellow-100 text-yellow-700'
                            : task.status === 2
                            ? 'bg-blue-100 text-blue-700'
                            : task.status === 5
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {task.status === 3
                          ? '已完成'
                          : task.status === 1
                          ? '待接单'
                          : task.status === 2
                          ? '已接单'
                          : task.status === 5
                          ? '已过期'
                          : '已取消'}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">{task.createTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">待处理纠纷</h2>
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              {pendingDisputes.length} 件
            </span>
          </div>
          <div className="space-y-4">
            {pendingDisputes.length > 0 ? (
              pendingDisputes.map((dispute) => (
                <div key={dispute.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{dispute.taskTitle}</p>
                  <p className="text-gray-500 text-sm mt-1">{dispute.reason}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{dispute.initiatorName}</span>
                    <span className="text-xs text-gray-400">{dispute.createdAt}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无待处理纠纷</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
