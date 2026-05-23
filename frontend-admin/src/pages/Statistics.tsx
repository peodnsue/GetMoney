import { useEffect, useRef, useState } from 'react';
import { formatMoney } from '../lib/utils';
import { Users, ClipboardList, DollarSign, TrendingUp, Download, MapPin } from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { 
  getUserLocationStatistics, 
  UserLocationStat,
  getTodayStatistics,
  getStatisticsByDateRange,
  getUsers,
  getTasks
} from '../api/api';
import type { Statistics as StatisticsType } from '../api/api';

Chart.register(...registerables);

export default function Statistics() {
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const locationChartRef = useRef<HTMLCanvasElement>(null);
  const barChartInstance = useRef<Chart | null>(null);
  const lineChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);
  const locationChartInstance = useRef<Chart | null>(null);

  const [locationData, setLocationData] = useState<UserLocationStat[]>([]);
  const [todayStats, setTodayStats] = useState<StatisticsType | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<StatisticsType[]>([]);
  const [roleDistribution, setRoleDistribution] = useState<{ role: string; count: number }[]>([]);
  const [typeDistribution, setTypeDistribution] = useState<{ type: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [locationRes, todayRes, weeklyRes, usersRes, tasksRes] = await Promise.all([
          getUserLocationStatistics(),
          getTodayStatistics(),
          getWeeklyStatistics(),
          getUsers(1, 100),
          getTasks(1, 100),
        ]);

        if (locationRes.code === 200) {
          setLocationData(locationRes.data);
        }

        if (todayRes.code === 200) {
          setTodayStats(todayRes.data);
        }

        if (weeklyRes.code === 200) {
          setWeeklyStats(weeklyRes.data);
        }

        if (usersRes.code === 200) {
          const roleCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
          usersRes.data.records.forEach(user => {
            if (roleCounts[user.role] !== undefined) {
              roleCounts[user.role]++;
            }
          });
          setRoleDistribution([
            { role: '普通学生', count: roleCounts[1] },
            { role: '任务发布者', count: roleCounts[2] },
            { role: '接单者', count: roleCounts[3] },
            { role: '管理员', count: roleCounts[4] },
          ].filter(item => item.count > 0));
        }

        if (tasksRes.code === 200) {
          const typeCounts: Record<number, number> = {};
          const typeNames: Record<number, string> = {
            1: '代取快递',
            2: '代买',
            3: '占座排队',
            4: '兼职',
            5: '其他',
          };
          tasksRes.data.records.forEach(task => {
            const typeId = task.typeId || 5;
            typeCounts[typeId] = (typeCounts[typeId] || 0) + 1;
          });
          setTypeDistribution(Object.entries(typeCounts).map(([key, count]) => ({
            type: typeNames[Number(key)] || `类型${key}`,
            count,
          })));
        }
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
        setLocationData([
          { location: '北京市', count: 5, percentage: 31.25 },
          { location: '上海市', count: 4, percentage: 25 },
          { location: '广州市', count: 3, percentage: 18.75 },
          { location: '深圳市', count: 2, percentage: 12.5 },
          { location: '杭州市', count: 2, percentage: 12.5 },
        ]);
        setRoleDistribution([
          { role: '普通学生', count: 2 },
          { role: '任务发布者', count: 3 },
          { role: '接单者', count: 2 },
          { role: '管理员', count: 1 },
        ]);
        setTypeDistribution([
          { type: '代取快递', count: 3 },
          { type: '代买', count: 3 },
          { type: '占座排队', count: 1 },
          { type: '兼职', count: 1 },
        ]);
      } finally {
        setLoading(false);
        setLocationLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getWeeklyStatistics = async () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return getStatisticsByDateRange(formatDate(startDate), formatDate(today));
  };

  useEffect(() => {
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
      barChartInstance.current = null;
    }

    if (lineChartInstance.current) {
      lineChartInstance.current.destroy();
      lineChartInstance.current = null;
    }

    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
      pieChartInstance.current = null;
    }

    if (locationChartInstance.current) {
      locationChartInstance.current.destroy();
      locationChartInstance.current = null;
    }

    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
        barChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: typeDistribution.map(item => item.type),
            datasets: [{
              label: '任务数量',
              data: typeDistribution.map(item => item.count),
              backgroundColor: typeDistribution.map((_, index) => colors[index % colors.length]),
              borderRadius: 8,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
              },
            },
          },
        });
      }
    }

    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      if (ctx) {
        const dayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const today = new Date().getDay();
        const shiftedLabels = [...dayLabels.slice(today), ...dayLabels.slice(0, today)];
        
        lineChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: shiftedLabels.slice(0, weeklyStats.length),
            datasets: [{
              label: '任务数量',
              data: weeklyStats.map(s => s.totalTasks),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#3b82f6',
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 5 },
              },
            },
          },
        });
      }
    }

    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      if (ctx) {
        const colors = ['#9ca3af', '#3b82f6', '#10b981', '#8b5cf6'];
        pieChartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: roleDistribution.map(item => item.role),
            datasets: [{
              data: roleDistribution.map(item => item.count),
              backgroundColor: roleDistribution.map((_, index) => colors[index % colors.length]),
              borderWidth: 0,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' as const },
            },
          },
        });
      }
    }

    if (locationChartRef.current && !locationLoading) {
      const ctx = locationChartRef.current.getContext('2d');
      if (ctx) {
        const colors = [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
          '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
          '#0ea5e9', '#14b8a6', '#f43f5e', '#a855f7', '#eab308'
        ];
        
        locationChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: locationData.map(item => item.location),
            datasets: [{
              label: '用户数量',
              data: locationData.map(item => item.count),
              backgroundColor: locationData.map((_, index) => colors[index % colors.length]),
              borderRadius: 8,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1 } },
            },
          },
        });
      }
    }

    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
        lineChartInstance.current = null;
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
        pieChartInstance.current = null;
      }
      if (locationChartInstance.current) {
        locationChartInstance.current.destroy();
        locationChartInstance.current = null;
      }
    };
  }, [typeDistribution, weeklyStats, roleDistribution, locationData, locationLoading]);

  const statsCards = [
    {
      title: '总用户数',
      value: todayStats?.activeUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: '总任务数',
      value: todayStats?.totalTasks || 0,
      icon: ClipboardList,
      color: 'bg-green-500',
    },
    {
      title: '成交金额',
      value: formatMoney(todayStats?.totalAmount || 0),
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: '今日新增',
      value: `${todayStats?.newUsers || 0} 人`,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const recentData = weeklyStats.map(s => ({
    date: s.date,
    tasks: s.totalTasks,
    amount: s.totalAmount,
  }));

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
          <h1 className="text-2xl font-bold text-gray-800">数据统计</h1>
          <p className="text-gray-500 mt-1">查看平台运营数据</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
          <Download className="w-4 h-4" />
          <span>导出报表</span>
        </button>
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
                </div>
                <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">任务类型分布</h2>
          <div className="h-64 relative">
            <canvas ref={barChartRef} />
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">本周任务趋势</h2>
          <div className="h-64 relative">
            <canvas ref={lineChartRef} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">用户角色分布</h2>
          <div className="h-64 relative">
            <canvas ref={pieChartRef} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-800">用户地理位置分布</h2>
          </div>
          {locationLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="h-64 relative">
              <canvas ref={locationChartRef} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">地理位置统计明细</h2>
          <div className="space-y-3">
            {locationData.slice(0, 10).map((item, index) => (
              <div key={item.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500',
                     'bg-pink-500', 'bg-cyan-500', 'bg-lime-500', 'bg-orange-500', 'bg-indigo-500'][index % 10]
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-800">{item.location}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{item.count} 人</span>
                  <span className="text-primary-600 font-semibold">{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">近期数据</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>任务数量</th>
                  <th>成交金额</th>
                </tr>
              </thead>
              <tbody>
                {recentData.map((item) => (
                  <tr key={item.date}>
                    <td>{item.date}</td>
                    <td>{item.tasks} 单</td>
                    <td className="text-primary-600 font-semibold">{formatMoney(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
