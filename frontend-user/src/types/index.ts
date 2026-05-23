export interface User {
  id: number;
  nickname: string;
  phone: string;
  email: string;
  studentId: string;
  avatar: string | null;
  role: number;
  balance: number;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface TaskType {
  id: number;
  name: string;
  icon: string;
  description: string;
  sortOrder: number;
  status: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  typeId: number;
  typeName: string;
  publisherId: number;
  publisherName: string;
  publisherAvatar: string;
  commission: number;
  deposit: number;
  deadline: string;
  building: string;
  address: string;
  status: number;
  acceptorId: number;
  acceptorName?: string;
  acceptTime?: string;
  completeTime?: string;
  images: string[];
  createTime: string;
  updateTime: string;
  publisher?: {
    id: number;
    nickname: string;
    avatar: string;
  };
}

export interface TaskAccept {
  id: number;
  taskId: number;
  taskTitle: string;
  takerId: number;
  takerName: string;
  takerAvatar: string;
  acceptTime: string;
  completionProof: string[];
  completeTime?: string;
  status: number;
}

export interface Payment {
  id: number;
  userId: number;
  taskId: number;
  amount: number;
  type: number;
  status: number;
  transactionId: string;
  refundId: string;
  refundAmount: number;
  createTime: string;
  updateTime: string;
}

export interface Comment {
  id: number;
  taskId: number;
  publisherId: number;
  acceptorId: number;
  fromUserId: number;
  fromUserName: string;
  toUserId: number;
  toUserName: string;
  score: number;
  content: string;
  type: number;
  createTime: string;
  updateTime: string;
}

export interface Message {
  id: number;
  userId: number;
  taskId?: number;
  taskTitle?: string;
  type: number;
  title: string;
  content: string;
  readStatus: number;
  createTime: string;
  updateTime: string;
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  sort: number;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
  code?: string;
}

export interface RegisterRequest {
  code: string;
  nickname?: string;
  email: string;
  password: string;
}

export interface TaskRequest {
  title: string;
  description: string;
  typeId: number;
  commission: number;
  deposit?: number;
  deadline: string;
  building: string;
  address?: string;
  images: string[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
