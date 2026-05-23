import type { User, Task, TaskType, Message, Comment, LoginRequest, RegisterRequest, TaskRequest, ApiResponse, Banner } from '@/types';
import { mockUser, mockTasks, mockTaskTypes, mockMessages, mockComments } from './mockData';

//const BASE_URL = 'http://8.160.190.72:8080/api';
const BASE_URL = 'http://localhost:8080/api';

const REFRESH_THRESHOLD = 30 * 60 * 1000;

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const getAccessTokenExpireTime = () => {
  const expireTime = localStorage.getItem('accessTokenExpireTime');
  return expireTime ? parseInt(expireTime) : 0;
};
const getRefreshTokenExpireTime = () => {
  const expireTime = localStorage.getItem('refreshTokenExpireTime');
  return expireTime ? parseInt(expireTime) : 0;
};

const isAccessTokenExpired = () => {
  const expireTime = getAccessTokenExpireTime();
  return !expireTime || Date.now() >= expireTime;
};

const isAccessTokenAboutToExpire = () => {
  const expireTime = getAccessTokenExpireTime();
  if (!expireTime) return false;
  const remaining = expireTime - Date.now();
  return remaining <= REFRESH_THRESHOLD && remaining > 0;
};

const isRefreshTokenExpired = () => {
  const expireTime = getRefreshTokenExpireTime();
  return !expireTime || Date.now() >= expireTime;
};

const handleLogout = (isRefreshTokenExpired = false) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessTokenExpireTime');
  localStorage.removeItem('refreshTokenExpireTime');
  localStorage.removeItem('user');
  localStorage.removeItem('loginTime');
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('logout'));
    
    if (isRefreshTokenExpired) {
      alert('登录已过期，请重新登录');
    }
    
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
      window.location.href = '/login';
    }
  }
};

const refreshToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
      handleLogout(true);
      return null;
    }

    if (isRefreshTokenExpired()) {
      handleLogout(true);
      return null;
    }

    const response = await fetch(`${BASE_URL}/auth/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });

    const result = await response.json();

    if (result.code === 200 && result.data) {
      const { accessToken, refreshToken: newRefreshToken, accessTokenExpireTime, refreshTokenExpireTime } = result.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('accessTokenExpireTime', String(accessTokenExpireTime));
      localStorage.setItem('refreshTokenExpireTime', String(refreshTokenExpireTime));

      if (result.data.user) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      onTokenRefreshed(accessToken);
      return accessToken;
    } else if (result.code === 401) {
      handleLogout(true);
      return null;
    } else {
      throw new Error(result.message || '刷新失败');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    handleLogout(true);
    return null;
  } finally {
    isRefreshing = false;
  }
};

const requestWithAuth = async <T>(url: string, options: RequestInit = {}): Promise<T | null> => {
  let accessToken = getAccessToken();

  if (!accessToken || isAccessTokenExpired()) {
    accessToken = await refreshToken();
    if (!accessToken) {
      throw new Error('认证已过期');
    }
  } else if (isAccessTokenAboutToExpire()) {
    refreshToken().catch(console.error);
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  headers['Authorization'] = `Bearer ${accessToken}`;

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  console.log('API 响应:', result);

  if (result.code === 401) {
    if (result.message?.includes('过期') || result.message?.includes('请刷新')) {
      accessToken = await refreshToken();
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        const retryResponse = await fetch(`${BASE_URL}${url}`, {
          ...options,
          headers,
        });
        const retryResult = await retryResponse.json();
        if (retryResult.code === 200) {
          return retryResult.data;
        } else if (retryResult.code === 401) {
          handleLogout(true);
          return null;
        }
        console.log('重试失败，抛出错误:', retryResult.message);
        throw new Error(retryResult.message || '请求失败');
      }
    }
    handleLogout(true);
    return null;
  }

  if (result.code !== 200) {
    console.log('请求失败，抛出错误:', result.message);
    throw new Error(result.message || '请求失败');
  }

  return result.data;
};

const request = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const result = await requestWithAuth<T>(url, options);
  if (result === null) {
    throw new Error('请求失败');
  }
  return result;
};

const publicRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const result = await response.json();

  if (result.code !== 200) {
    throw new Error(result.message || '请求失败');
  }

  return result.data;
};

export const api = {
  auth: {
    login: async (form: LoginRequest): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (result.code !== 200) {
        throw new Error(result.message || '登录失败');
      }

      const { accessToken, refreshToken, accessTokenExpireTime, refreshTokenExpireTime, user } = result.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('accessTokenExpireTime', String(accessTokenExpireTime));
      localStorage.setItem('refreshTokenExpireTime', String(refreshTokenExpireTime));
      localStorage.setItem('user', JSON.stringify(user));

      return { accessToken, refreshToken, user };
    },
    register: async (form: RegisterRequest): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (result.code !== 200) {
        throw new Error(result.message || '注册失败');
      }

      const { accessToken, refreshToken, accessTokenExpireTime, refreshTokenExpireTime, user } = result.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('accessTokenExpireTime', String(accessTokenExpireTime));
      localStorage.setItem('refreshTokenExpireTime', String(refreshTokenExpireTime));
      localStorage.setItem('user', JSON.stringify(user));

      return { accessToken, refreshToken, user };
    },
    logout: async (): Promise<void> => {
      try {
        const refreshTokenValue = getRefreshToken();
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: refreshTokenValue }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessTokenExpireTime');
        localStorage.removeItem('refreshTokenExpireTime');
        localStorage.removeItem('user');
      }
    },
    sendCode: async (email: string, type?: string): Promise<void> => {
      const response = await fetch(`${BASE_URL}/auth/sendCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
      });
      const result = await response.json();
      if (result.code !== 200) {
        throw new Error(result.message || '发送失败');
      }
    },
    getCooldown: async (email: string): Promise<number> => {
      const response = await fetch(`${BASE_URL}/auth/cooldown?email=${encodeURIComponent(email)}`);
      const result = await response.json();
      if (result.code !== 200) {
        return 0;
      }
      return result.data || 0;
    },
    getProfile: async (): Promise<User> => {
      return request<User>('/auth/profile');
    },
    checkAuth: (): boolean => {
      const accessToken = getAccessToken();
      if (!accessToken) return false;
      if (isRefreshTokenExpired()) {
        handleLogout(true);
        return false;
      }
      return !isAccessTokenExpired() || !isRefreshTokenExpired();
    },
  },

  task: {
    list: async (params?: { typeId?: number; building?: string; status?: number; page?: number; pageSize?: number }): Promise<Task[]> => {
      const queryParams = new URLSearchParams();
      if (params?.typeId) queryParams.append('typeId', String(params.typeId));
      if (params?.building) queryParams.append('building', params.building);
      if (params?.status !== undefined) queryParams.append('status', String(params.status));
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.pageSize) queryParams.append('pageSize', String(params.pageSize));

      const url = `/task/list${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const data = await request<{ records: Task[] }>(url);
      return data.records || [];
    },
    detail: async (id: number): Promise<Task> => {
      return request<Task>(`/task/detail/${id}`);
    },
    create: async (form: TaskRequest): Promise<Task> => {
      return request<Task>('/task/create', {
        method: 'POST',
        body: JSON.stringify(form),
      });
    },
    accept: async (taskId: number): Promise<Task> => {
      return request<Task>(`/task/accept/${taskId}`, {
        method: 'POST',
      });
    },
    complete: async (taskId: number, completionProof?: string[]): Promise<Task> => {
      return request<Task>('/task/complete', {
        method: 'POST',
        body: JSON.stringify({ taskId, completionProof }),
      });
    },
    cancel: async (taskId: number): Promise<void> => {
      return request<void>(`/task/cancel/${taskId}`, {
        method: 'POST',
      });
    },
    confirmComplete: async (taskId: number): Promise<Task> => {
      return request<Task>(`/task/confirm/${taskId}`, {
        method: 'POST',
      });
    },
    myPublished: async (): Promise<Task[]> => {
      return request<Task[]>('/task/my/published');
    },
    myAccepted: async (): Promise<Task[]> => {
      return request<Task[]>('/task/my/accepted');
    },
  },

  taskType: {
    list: async (): Promise<TaskType[]> => {
      return request<TaskType[]>('/task-type/list');
    },
  },

  banner: {
    list: async (): Promise<Banner[]> => {
      return publicRequest<Banner[]>('/public/banners');
    },
  },

  message: {
    list: async (): Promise<Message[]> => {
      return request<Message[]>('/message/list');
    },
    markRead: async (id: number): Promise<void> => {
      return request<void>(`/message/read/${id}`, {
        method: 'POST',
      });
    },
    markAllRead: async (): Promise<void> => {
      return request<void>('/message/readAll', {
        method: 'POST',
      });
    },
  },

  comment: {
    list: async (userId?: number): Promise<Comment[]> => {
      const url = userId ? `/comment/list?userId=${userId}` : '/comment/list';
      return request<Comment[]>(url);
    },
    create: async (taskId: number, score: number, content: string): Promise<Comment> => {
      return request<Comment>('/comment/create', {
        method: 'POST',
        body: JSON.stringify({ taskId, score, content }),
      });
    },
  },

  user: {
    updateProfile: async (data: Partial<User>): Promise<User> => {
      return request<User>('/user/update', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    changeEmail: async (email: string, code: string): Promise<any> => {
      return request<any>('/user/changeEmail', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });
    },
    changePassword: async (oldPassword: string, newPassword: string, code: string): Promise<any> => {
      return request<any>('/user/changePassword', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword, code }),
      });
    },
    uploadAvatar: async (avatar: string): Promise<any> => {
      return request<any>('/user/uploadAvatar', {
        method: 'POST',
        body: JSON.stringify({ avatar }),
      });
    },
  },

  evaluation: {
    submit: async (rating: number, feedback: string): Promise<any> => {
      return request<any>('/evaluation/submit', {
        method: 'POST',
        body: JSON.stringify({ rating, feedback }),
      });
    },
  },

  notice: {
    getUnreadCount: async (): Promise<number> => {
      const data = await request<{ count: number }>('/notice/unread/count');
      return data.count || 0;
    },
    getList: async (current = 1, size = 10): Promise<{ records: Notice[]; total: number; size: number; current: number }> => {
      return request<{ records: Notice[]; total: number; size: number; current: number }>(`/notice/list?current=${current}&size=${size}`);
    },
    getDetail: async (id: number): Promise<Notice> => {
      return request<Notice>(`/notice/detail/${id}`);
    },
    markAllRead: async (): Promise<void> => {
      return request<void>('/notice/read/all', {
        method: 'POST',
      });
    },
  },

  gcoin: {
    getWallet: async (): Promise<GcoinWalletResponse> => {
      return request<GcoinWalletResponse>('/gcoin/wallet');
    },
    transfer: async (targetAccount: string, amount: string, remark?: string): Promise<GcoinTransferResponse> => {
      return request<GcoinTransferResponse>('/gcoin/transfer', {
        method: 'POST',
        body: JSON.stringify({ targetAccount, amount, remark }),
      });
    },
    getTransactions: async (page = 1, size = 20): Promise<{ records: GcoinTransaction[]; total: number; size: number; current: number }> => {
      return request<{ records: GcoinTransaction[]; total: number; size: number; current: number }>(`/gcoin/transactions?page=${page}&size=${size}`);
    },
  },
};

export interface Notice {
  id: number;
  title: string;
  content: string;
  noticeType: number;
  status: number;
  publishTime: string;
  adminId: number;
  createTime: string;
  updateTime: string;
  isRead?: boolean;
}

export interface GcoinWalletResponse {
  balance: string;
  totalEarned: string;
  totalSpent: string;
  holdLimit: string;
}

export interface GcoinTransaction {
  id: number;
  userId: number;
  type: number;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  description: string;
  relatedUserId: number;
  fee: string;
  treasuryOperation: number;
  createdAt: string;
}

export interface GcoinTransferRequest {
  targetAccount: string;
  amount: string;
  remark?: string;
}

export interface GcoinTransferResponse {
  amount: string;
  fee: string;
  actualReceived: string;
  senderBalance: string;
  receiverBalance: string;
  receiverNickname: string;
}
