import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function formatMoney(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}

export function getStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    1: '待接单',
    2: '已接单',
    3: '待确认',
    4: '已完成',
    5: '已取消',
  };
  return statusMap[status] || '未知';
}

export function getStatusColor(status: number): string {
  const colorMap: Record<number, string> = {
    1: 'text-warning-500 bg-warning-50',
    2: 'text-primary-500 bg-primary-50',
    3: 'text-warning-500 bg-warning-50',
    4: 'text-success-500 bg-success-50',
    5: 'text-danger-500 bg-danger-50',
  };
  return colorMap[status] || 'text-gray-500 bg-gray-50';
}

export function getRoleText(role: number): string {
  const roleMap: Record<number, string> = {
    1: '普通用户',
    2: '任务发布者',
    3: '任务接单者',
    4: '管理员',
  };
  return roleMap[role] || '未知';
}

export function getMessageTypeText(type: number): string {
  const typeMap: Record<number, string> = {
    1: '任务推送',
    2: '订单状态',
    3: '纠纷提醒',
    4: '系统通知',
  };
  return typeMap[type] || '其他';
}

export function getMessageTypeIcon(type: number): string {
  const iconMap: Record<number, string> = {
    1: 'ShoppingCart',
    2: 'Package',
    3: 'AlertCircle',
    4: 'Bell',
  };
  return iconMap[type] || 'MessageCircle';
}
