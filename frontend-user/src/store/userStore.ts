import { create } from 'zustand';
import type { User } from '@/types';

interface UserStore {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string, user?: User) => void;
  logout: () => void;
}

const LOGIN_EXPIRE_TIME = 24 * 60 * 60 * 1000;

const checkLoginExpiry = () => {
  const loginTime = localStorage.getItem('loginTime');
  if (loginTime) {
    const elapsed = Date.now() - parseInt(loginTime);
    if (elapsed > LOGIN_EXPIRE_TIME) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('loginTime');
      localStorage.removeItem('user');
      return false;
    }
  }
  return true;
};

const getInitialState = () => {
  if (!checkLoginExpiry()) {
    return {
      user: null,
      accessToken: null,
      isLoggedIn: false,
    };
  }

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    user,
    accessToken,
    isLoggedIn: !!accessToken,
  };
};

export const useUserStore = create<UserStore>((set) => ({
  ...getInitialState(),
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  setTokens: (accessToken, refreshToken, user) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('loginTime', Date.now().toString());

    const newState: { accessToken: string; isLoggedIn: boolean; user?: User } = {
      accessToken,
      isLoggedIn: true
    };

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      newState.user = user;
    }

    set(newState);
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpireTime');
    localStorage.removeItem('refreshTokenExpireTime');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null, isLoggedIn: false });
  },
}));
