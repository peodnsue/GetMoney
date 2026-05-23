interface MockUser {
  id: string;
  username: string;
  phone: string;
  studentId: string;
  role: string;
  status: string;
  balance: number;
  createdAt: string;
}

interface MockTask {
  id: string;
  title: string;
  type: string;
  description: string;
  reward: number;
  deadline: string;
  building: string;
  publisherId: string;
  publisherName: string;
  acceptorId?: string;
  acceptorName?: string;
  status: string;
  createdAt: string;
}

interface MockDispute {
  id: string;
  taskId: string;
  taskTitle: string;
  initiatorId: string;
  initiatorName: string;
  responderId: string;
  responderName: string;
  reason: string;
  status: string;
  createdAt: string;
}

export const mockUsers: MockUser[] = [
  { id: '1', username: '管理员', phone: '13800138000', studentId: 'admin001', role: 'admin', status: 'active', balance: 0, createdAt: '2024-01-01 00:00:00' },
  { id: '2', username: '张三', phone: '13800138001', studentId: '2021001', role: 'publisher', status: 'active', balance: 500.00, createdAt: '2024-02-15 10:30:00' },
  { id: '3', username: '李四', phone: '13800138002', studentId: '2021002', role: 'acceptor', status: 'active', balance: 280.50, createdAt: '2024-03-20 14:20:00' },
  { id: '4', username: '王五', phone: '13800138003', studentId: '2021003', role: 'student', status: 'active', balance: 100.00, createdAt: '2024-04-05 09:15:00' },
  { id: '5', username: '赵六', phone: '13800138004', studentId: '2021004', role: 'publisher', status: 'banned', balance: 0, createdAt: '2024-05-10 16:45:00' },
  { id: '6', username: '钱七', phone: '13800138005', studentId: '2021005', role: 'acceptor', status: 'active', balance: 420.00, createdAt: '2024-06-18 11:00:00' },
  { id: '7', username: '孙八', phone: '13800138006', studentId: '2021006', role: 'student', status: 'active', balance: 50.00, createdAt: '2024-07-22 08:30:00' },
  { id: '8', username: '周九', phone: '13800138007', studentId: '2021007', role: 'publisher', status: 'active', balance: 800.00, createdAt: '2024-08-08 13:50:00' },
];

export const mockTasks: MockTask[] = [
  { id: '1', title: '代取快递', type: '代取快递', description: '帮我取一下快递，在菜鸟驿站，取件码是123456', reward: 5.00, deadline: '2024-12-20 18:00:00', building: '1号楼', publisherId: '2', publisherName: '张三', acceptorId: '3', acceptorName: '李四', status: 'completed', createdAt: '2024-12-18 10:00:00' },
  { id: '2', title: '代买奶茶', type: '代买', description: '帮我买一杯珍珠奶茶，少糖少冰，送到图书馆', reward: 8.00, deadline: '2024-12-21 12:00:00', building: '图书馆', publisherId: '4', publisherName: '王五', acceptorId: undefined, acceptorName: undefined, status: 'pending', createdAt: '2024-12-19 09:30:00' },
  { id: '3', title: '占座', type: '占座排队', description: '明天早上8点帮我在教学楼A座占个座', reward: 3.00, deadline: '2024-12-21 08:00:00', building: '教学楼A座', publisherId: '2', publisherName: '张三', acceptorId: '6', acceptorName: '钱七', status: 'accepted', createdAt: '2024-12-19 14:00:00' },
  { id: '4', title: '代打印', type: '代买', description: '帮我打印10份简历，在打印店', reward: 10.00, deadline: '2024-12-20 16:00:00', building: '打印店', publisherId: '7', publisherName: '孙八', acceptorId: '3', acceptorName: '李四', status: 'completed', createdAt: '2024-12-18 16:30:00' },
  { id: '5', title: '代取外卖', type: '代取快递', description: '帮我取一下外卖，在外卖柜，取件码789012', reward: 4.00, deadline: '2024-12-20 12:30:00', building: '2号楼', publisherId: '8', publisherName: '周九', acceptorId: undefined, acceptorName: undefined, status: 'pending', createdAt: '2024-12-20 11:00:00' },
  { id: '6', title: '兼职发传单', type: '兼职', description: '周末发传单，一天100元', reward: 100.00, deadline: '2024-12-22 18:00:00', building: '校门口', publisherId: '5', publisherName: '赵六', acceptorId: '6', acceptorName: '钱七', status: 'disputed', createdAt: '2024-12-15 10:00:00' },
  { id: '7', title: '代领快递', type: '代取快递', description: '帮我领一下顺丰快递，在西门', reward: 6.00, deadline: '2024-12-21 17:00:00', building: '西门', publisherId: '4', publisherName: '王五', acceptorId: undefined, acceptorName: undefined, status: 'pending', createdAt: '2024-12-19 17:00:00' },
  { id: '8', title: '代买水果', type: '代买', description: '帮我买两斤苹果和一斤香蕉', reward: 5.00, deadline: '2024-12-20 18:30:00', building: '3号楼', publisherId: '8', publisherName: '周九', acceptorId: '3', acceptorName: '李四', status: 'accepted', createdAt: '2024-12-20 15:00:00' },
];

export const mockDisputes: MockDispute[] = [
  { id: '1', taskId: '6', taskTitle: '兼职发传单', initiatorId: '6', initiatorName: '钱七', responderId: '5', responderName: '赵六', reason: '发布者未按时支付工资', status: 'pending', createdAt: '2024-12-17 10:00:00' },
  { id: '2', taskId: '1', taskTitle: '代取快递', initiatorId: '2', initiatorName: '张三', responderId: '3', responderName: '李四', reason: '快递取错了', status: 'resolved', createdAt: '2024-12-18 15:00:00' },
];

export const mockStats = {
  totalUsers: 8,
  activeUsers: 7,
  bannedUsers: 1,
  totalTasks: 8,
  pendingTasks: 3,
  completedTasks: 2,
  disputedTasks: 1,
  totalAmount: 141.00,
  todayTasks: 2,
};

export const taskTypes = ['代取快递', '代买', '占座排队', '兼职'];

export const buildingList = ['1号楼', '2号楼', '3号楼', '图书馆', '教学楼A座', '教学楼B座', '校门口', '西门', '打印店'];
