//const BASE_URL = 'http://localhost:8080/api';
const BASE_URL = 'http://8.160.190.72:8080/api';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  avatar?: string;
  role: number;
  balance: number;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface Task {
  id: number;
  publisherId: number;
  typeId: number;
  title: string;
  description?: string;
  commission: number;
  deposit?: number;
  deadline: string;
  building?: string;
  address?: string;
  images?: string;
  status: number;
  acceptorId?: number;
  createTime: string;
  updateTime: string;
  publisherName?: string;
  acceptorName?: string;
  typeName?: string;
}

export interface Statistics {
  id: number;
  date: string;
  totalTasks: number;
  completedTasks: number;
  totalAmount: number;
  activeUsers: number;
  newUsers: number;
  createTime: string;
  updateTime: string;
}

export interface Dispute {
  id: number;
  taskId: number;
  taskTitle: string;
  initiatorId: number;
  initiatorName: string;
  responderId: number;
  responderName: string;
  reason: string;
  status: number;
  createTime: string;
}

export interface PageResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  records: T[];
}

export interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  sort: number;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface BannerRequest {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  sort?: number;
  status?: number;
}

export interface UserLocationStat {
  location: string;
  count: number;
  percentage: number;
}

export interface Evaluation {
  id: number;
  userId: number;
  rating: number;
  feedback: string;
  status: number;
  createTime: string;
  updateTime: string;
  userNickname?: string;
  userEmail?: string;
}

export interface SysNotice {
  id: number;
  title: string;
  content: string;
  noticeType: number;
  status: number;
  publishTime: string;
  adminId: number;
  createTime: string;
  updateTime: string;
}

export interface NoticeRequest {
  title: string;
  content: string;
  noticeType?: number;
}

let onAuthExpired: (() => void) | null = null;

export const setOnAuthExpired = (callback: () => void) => {
  onAuthExpired = callback;
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

const request = async (
  url: string,
  options: RequestInit = {},
  needAuth: boolean = true
): Promise<Response> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (needAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuth();
    if (onAuthExpired) {
      onAuthExpired();
    }
  }

  return response;
};

export const login = async (email: string, password: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>> => {
  const response = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, false);
  return response.json();
};

export const getUsers = async (
  page: number = 1,
  pageSize: number = 10,
  role?: number,
  status?: number
): Promise<ApiResponse<PageResponse<User>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (role !== undefined) params.append('role', role.toString());
  if (status !== undefined) params.append('status', status.toString());

  const response = await request(`/admin/users?${params}`);
  return response.json();
};

export const updateUserStatus = async (id: number, status: number): Promise<ApiResponse<void>> => {
  const response = await request(`/admin/users/${id}/status?status=${status}`, {
    method: 'PUT',
  });
  return response.json();
};

export const updateUserRole = async (id: number, role: number): Promise<ApiResponse<void>> => {
  const response = await request(`/admin/users/${id}/role?role=${role}`, {
    method: 'PUT',
  });
  return response.json();
};

export const getTasks = async (
  page: number = 1,
  pageSize: number = 10,
  typeId?: number,
  building?: string,
  status?: number
): Promise<ApiResponse<PageResponse<Task>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (typeId !== undefined) params.append('typeId', typeId.toString());
  if (building) params.append('building', building);
  if (status !== undefined) params.append('status', status.toString());

  const response = await request(`/task/list?${params}`);
  return response.json();
};

export const getTaskById = async (id: number): Promise<ApiResponse<Task>> => {
  const response = await request(`/task/${id}`);
  return response.json();
};

export const getTodayStatistics = async (): Promise<ApiResponse<Statistics>> => {
  const response = await request(`/statistics/today`);
  return response.json();
};

export const getStatisticsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<Statistics[]>> => {
  const params = new URLSearchParams({
    startDate,
    endDate,
  });
  const response = await request(`/statistics/range?${params}`);
  return response.json();
};

export const getDisputes = async (): Promise<ApiResponse<Dispute[]>> => {
  const response = await request(`/admin/disputes`);
  return response.json();
};

export const resolveDispute = async (id: number): Promise<ApiResponse<void>> => {
  const response = await request(`/admin/disputes/${id}/resolve`, {
    method: 'PUT',
  });
  return response.json();
};

export const getBanners = async (): Promise<ApiResponse<Banner[]>> => {
  const response = await request(`/admin/banners`);
  return response.json();
};

export const createBanner = async (banner: BannerRequest): Promise<ApiResponse<Banner>> => {
  const response = await request(`/admin/banners`, {
    method: 'POST',
    body: JSON.stringify(banner),
  });
  return response.json();
};

export const updateBanner = async (id: number, banner: BannerRequest): Promise<ApiResponse<Banner>> => {
  const response = await request(`/admin/banners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(banner),
  });
  return response.json();
};

export const deleteBanner = async (id: number): Promise<ApiResponse<void>> => {
  const response = await request(`/admin/banners/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const getUserLocationStatistics = async (): Promise<ApiResponse<UserLocationStat[]>> => {
  const response = await request(`/statistics/user-location`);
  return response.json();
};

export const getEvaluations = async (
  current: number = 1,
  size: number = 10,
  status?: number
): Promise<ApiResponse<{ records: Evaluation[]; total: number; size: number; current: number }>> => {
  const params = new URLSearchParams({
    current: current.toString(),
    size: size.toString(),
  });
  if (status !== undefined) params.append('status', status.toString());

  const response = await request(`/evaluation/admin/list?${params}`);
  return response.json();
};

export const updateEvaluationStatus = async (id: number, status: number): Promise<ApiResponse<void>> => {
  const response = await request(`/evaluation/admin/updateStatus`, {
    method: 'POST',
    body: JSON.stringify({ id, status }),
  });
  return response.json();
};

export const getNoticeList = async (
  current: number = 1,
  size: number = 10,
  status?: number
): Promise<ApiResponse<{ records: SysNotice[]; total: number; size: number; current: number }>> => {
  const params = new URLSearchParams({
    current: current.toString(),
    size: size.toString(),
  });
  if (status !== undefined) params.append('status', status.toString());

  const response = await request(`/admin/notice/list?${params}`);
  return response.json();
};

export const getNoticeById = async (id: number): Promise<ApiResponse<SysNotice>> => {
  const response = await request(`/admin/notice/${id}`);
  return response.json();
};

export const publishNotice = async (notice: NoticeRequest): Promise<ApiResponse<SysNotice>> => {
  const response = await request(`/admin/notice/publish`, {
    method: 'POST',
    body: JSON.stringify(notice),
  });
  return response.json();
};

export const updateNotice = async (id: number, notice: NoticeRequest): Promise<ApiResponse<void>> => {
  const response = await request(`/admin/notice/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(notice),
  });
  return response.json();
};

export const updateNoticeStatus = async (id: number, status: number): Promise<ApiResponse<void>> => {
  const response = await request(`/admin/notice/status/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return response.json();
};

export const deleteNotice = async (id: number): Promise<ApiResponse<void>> => {
  const response = await request(`/admin/notice/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

export interface UserLog {
  id: number;
  userId: number;
  username: string;
  action: number;
  ipAddress: string;
  userAgent: string;
  status: number;
  message: string;
  createTime: string;
}

export const getUserLogs = async (
  current: number = 1,
  size: number = 10,
  action?: number,
  status?: number,
  keyword?: string
): Promise<ApiResponse<{ records: UserLog[]; total: number; size: number; current: number }>> => {
  const params = new URLSearchParams({
    current: current.toString(),
    size: size.toString(),
  });
  if (action !== undefined) params.append('action', action.toString());
  if (status !== undefined) params.append('status', status.toString());
  if (keyword) params.append('keyword', keyword);

  const response = await request(`/admin/user-log/list?${params}`);
  return response.json();
};

export interface CirculationStats {
  totalCirculation: number;
  dailyProduction: number;
  dailyConsumption: number;
  treasuryBalance: number;
  avgUserHold: number;
  userCount: number;
}

export interface TreasuryInfo {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  lockedBalance: number;
}

export interface GcoinTransaction {
  id: number;
  userId: number;
  type: number;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createTime: string;
}

export interface GcoinAccount {
  id: number;
  userId: number;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  nickname: string;
  email: string;
}

export interface AccountOperationLog {
  id: number;
  adminId: number;
  operationType: number;
  targetUserId: number | null;
  amount: number;
  description: string;
  beforeBalance: number;
  afterBalance: number;
  ipAddress: string;
  userAgent: string;
  createTime: string;
}

export const getCirculationStats = async (): Promise<ApiResponse<CirculationStats>> => {
  const response = await request(`/admin/gcoin/circulation/stats`);
  return response.json();
};

export const getTreasury = async (): Promise<ApiResponse<TreasuryInfo>> => {
  const response = await request(`/admin/gcoin/treasury`);
  return response.json();
};

export const treasuryTransferOut = async (amount: number, description: string): Promise<ApiResponse<void>> => {
  const params = new URLSearchParams({
    amount: amount.toString(),
    description,
  });
  const response = await request(`/admin/gcoin/treasury/transfer-out?${params}`, {
    method: 'POST',
  });
  return response.json();
};

export const lockTreasuryBalance = async (amount: number): Promise<ApiResponse<void>> => {
  const params = new URLSearchParams({
    amount: amount.toString(),
  });
  const response = await request(`/admin/gcoin/treasury/lock?${params}`, {
    method: 'POST',
  });
  return response.json();
};

export const unlockTreasuryBalance = async (amount: number): Promise<ApiResponse<void>> => {
  const params = new URLSearchParams({
    amount: amount.toString(),
  });
  const response = await request(`/admin/gcoin/treasury/unlock?${params}`, {
    method: 'POST',
  });
  return response.json();
};

export const adjustCirculation = async (amount: number, reason: string): Promise<ApiResponse<void>> => {
  const params = new URLSearchParams({
    amount: amount.toString(),
    reason,
  });
  const response = await request(`/admin/gcoin/circulation/adjust?${params}`, {
    method: 'POST',
  });
  return response.json();
};

export const deductUserGcoin = async (userId: number, amount: number, reason: string): Promise<ApiResponse<void>> => {
  const params = new URLSearchParams({
    userId: userId.toString(),
    amount: amount.toString(),
    reason,
  });
  const response = await request(`/admin/gcoin/user/deduct?${params}`, {
    method: 'POST',
  });
  return response.json();
};

export const addUserGcoin = async (userId: number, amount: number, reason: string): Promise<ApiResponse<void>> => {
  const params = new URLSearchParams({
    userId: userId.toString(),
    amount: amount.toString(),
    reason,
  });
  const response = await request(`/admin/gcoin/user/add?${params}`, {
    method: 'POST',
  });
  return response.json();
};

export const getGcoinTransactions = async (
  page: number = 1,
  size: number = 20,
  filters?: {
    userId?: number;
    type?: number;
    treasuryOperation?: number;
  }
): Promise<ApiResponse<{ records: GcoinTransaction[]; total: number; size: number; current: number }>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (filters?.userId !== undefined) params.append('userId', filters.userId.toString());
  if (filters?.type !== undefined) params.append('type', filters.type.toString());
  if (filters?.treasuryOperation !== undefined) params.append('treasuryOperation', filters.treasuryOperation.toString());

  const response = await request(`/admin/gcoin/transactions?${params}`);
  return response.json();
};

export const getUserBalances = async (
  page: number = 1,
  size: number = 20,
  keyword?: string
): Promise<ApiResponse<{ records: GcoinAccount[]; total: number; size: number; current: number }>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (keyword) params.append('keyword', keyword);

  const response = await request(`/admin/gcoin/user/balances?${params}`);
  return response.json();
};

export const getUserBalance = async (userId: number): Promise<ApiResponse<GcoinAccount>> => {
  const response = await request(`/admin/gcoin/user/balance/${userId}`);
  return response.json();
};

export const getAccountOperationLogs = async (
  page: number = 1,
  size: number = 20,
  filters?: {
    adminId?: number;
    operationType?: number;
    targetUserId?: number;
  }
): Promise<ApiResponse<{ records: AccountOperationLog[]; total: number; size: number; current: number }>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (filters?.adminId !== undefined) params.append('adminId', filters.adminId.toString());
  if (filters?.operationType !== undefined) params.append('operationType', filters.operationType.toString());
  if (filters?.targetUserId !== undefined) params.append('targetUserId', filters.targetUserId.toString());

  const response = await request(`/admin/gcoin/operation-logs?${params}`);
  return response.json();
};
