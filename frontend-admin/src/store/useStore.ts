import { create } from 'zustand';
import type { User, Task, Dispute, Statistics } from '../api/api';

interface AdminStore {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  disputes: Dispute[];
  statistics: Statistics | null;
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  setTasks: (tasks: Task[]) => void;
  setDisputes: (disputes: Dispute[]) => void;
  setStatistics: (stats: Statistics | null) => void;
  toggleUserStatus: (userId: number) => void;
  updateUserRole: (userId: number, role: number) => void;
  updateTaskStatus: (taskId: number, status: number) => void;
  resolveDispute: (disputeId: number) => void;
  logout: () => void;
}

const getInitialState = () => {
  const userStr = localStorage.getItem('currentUser');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem('token');

  return {
    currentUser: currentUser,
    users: [],
    tasks: [],
    disputes: [],
    statistics: null,
    isLoggedIn: !!token && !!currentUser,
  };
};

export const useStore = create<AdminStore>((set) => ({
  currentUser: getInitialState().currentUser,
  users: [],
  tasks: [],
  disputes: [],
  statistics: null,

  setCurrentUser: (user) => {
    set({ currentUser: user });
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  },

  setUsers: (users) => set({ users }),

  setTasks: (tasks) => set({ tasks }),

  setDisputes: (disputes) => set({ disputes }),

  setStatistics: (stats) => set({ statistics: stats }),

  toggleUserStatus: (userId) => set((state) => ({
    users: state.users.map((user) =>
      user.id === userId
        ? { ...user, status: user.status === 1 ? 0 : 1 }
        : user
    ),
  })),

  updateUserRole: (userId, role) => set((state) => ({
    users: state.users.map((user) =>
      user.id === userId ? { ...user, role } : user
    ),
  })),

  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    ),
  })),

  resolveDispute: (disputeId) => set((state) => ({
    disputes: state.disputes.map((dispute) =>
      dispute.id === disputeId ? { ...dispute, status: 1 } : dispute
    ),
  })),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    set({ currentUser: null, users: [], tasks: [], disputes: [], statistics: null });
  },
}));
