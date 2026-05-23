import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMoney(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待接单',
    accepted: '已接单',
    completed: '已完成',
    cancelled: '已取消',
    disputed: '纠纷中',
  };
  return statusMap[status] || status;
}

export function getRoleText(role: string): string {
  const roleMap: Record<string, string> = {
    student: '普通学生',
    publisher: '任务发布者',
    acceptor: '接单者',
    admin: '管理员',
  };
  return roleMap[role] || role;
}
