import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  List,
  MessageCircle,
  User,
  Search,
  Plus,
  Bell,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { useUserStore } from "@/store/userStore";
import { api } from "@/api/api";
import { cn } from "@/lib/utils";
import MusicTrun from "@/components/MusicTrun";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isLoggedIn, logout } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      loadUnreadCount();
    }
  }, [location.pathname]);

  const loadUnreadCount = async () => {
    try {
      const count = await api.notice.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("获取未读消息数失败:", error);
    }
  };

  const navItems = [
    { path: "/app", label: "首页", icon: Home },
    { path: "/app/tasks", label: "任务列表", icon: List },
    { path: "/app/messages", label: "消息", icon: MessageCircle },
    { path: "/app/profile", label: "我的", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 pointer-events-none">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
                <div className="absolute inset-1 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 rounded-full flex items-center justify-center">
                  <p className="text-yellow-900 font-bold text-lg">G</p>
                </div>
                <div className="absolute top-1 left-2 w-3 h-1 bg-white/60 rounded-full transform -rotate-45"></div>
              </div>
              <div
                className="hidden md:block relative text-malfunction"
                data-word="GetMoney"
              >
                <style>{`
                  .text-malfunction {
                    position: relative;
                    padding: 0 4px;
                    font-size: 20px;
                    font-family: sans-serif;
                    color: transparent;
                    font-weight: bold;
                  }
                  
                  .text-malfunction::before,
                  .text-malfunction::after {
                    content: attr(data-word);
                    position: absolute;
                    top: 0;
                    left: 0;
                    overflow: hidden;
                    filter: contrast(200%);
                  }
                  
                  .text-malfunction::before {
                    color: red;
                    text-shadow: 1px 0 0 red;
                    animation: glitch-1 0.95s infinite;
                  }
                  
                  .text-malfunction::after {
                    color: cyan;
                    text-shadow: -1px 0 0 cyan;
                    mix-blend-mode: lighten;
                    animation: glitch-2 1.1s infinite 0.2s;
                  }
                  
                  @keyframes glitch-1 {
                    10% { top: -0.4px; left: -1.1px; }
                    20% { top: 0.4px; left: -0.2px; }
                    30% { left: .5px; }
                    40% { top: -0.3px; left: -0.7px; }
                    50% { left: 0.2px; }
                    60% { top: 1.8px; left: -1.2px; }
                    70% { top: -1px; left: 0.1px; }
                    80% { top: -0.4px; left: -0.9px; }
                    90% { left: 1.2px; }
                    100% { left: -1.2px; }
                  }
                  
                  @keyframes glitch-2 {
                    10% { top: 0.3px; left: 0.8px; }
                    20% { top: -0.5px; left: 0.1px; }
                    30% { left: -0.4px; }
                    40% { top: 0.4px; left: 0.6px; }
                    50% { left: -0.3px; }
                    60% { top: -1.5px; left: 1.0px; }
                    70% { top: 0.8px; left: -0.2px; }
                    80% { top: 0.3px; left: 0.7px; }
                    90% { left: -0.9px; }
                    100% { left: 1.1px; }
                  }
                `}</style>
                GetMoney
              </div>
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-500 rounded">
                内测
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const showBadge =
                  item.path === "/app/messages" && unreadCount > 0;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                      isActive(item.path)
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
            <div>如果不想测试，那就来听歌吧</div>
            <div>
              <MusicTrun />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center">
              <div
                className={cn(
                  "flex items-center bg-gray-100 rounded-lg transition-all duration-300",
                  isSearchOpen ? "w-64" : "w-10 h-10 cursor-pointer",
                )}
                onClick={() => !isSearchOpen && setIsSearchOpen(true)}
              >
                {isSearchOpen ? (
                  <div className="flex items-center w-full px-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索任务..."
                      className="flex-1 bg-transparent border-none outline-none px-2 py-2 text-sm"
                      autoFocus
                      onBlur={() => setIsSearchOpen(false)}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {isLoggedIn ? (
              <>
                <Button
                  size="sm"
                  onClick={() => navigate("/app/tasks/publish")}
                  className="hidden md:flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  发布任务
                </Button>
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block"
                  onClick={() => navigate("/app/messages")}
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-danger-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <Avatar
                      name={user?.nickname || "用户"}
                      avatar={user?.avatar}
                      size="sm"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.nickname || "用户"}
                    </span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {user?.nickname}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => navigate("/app/profile")}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        个人中心
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        退出登录
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="md:hidden flex items-center gap-2 p-1"
                  onClick={() => navigate("/app/profile")}
                >
                  <Avatar
                    name={user?.nickname || "用户"}
                    avatar={user?.avatar}
                    size="sm"
                  />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  登录
                </Button>
                <Button size="sm" onClick={() => navigate("/login")}>
                  注册
                </Button>
              </div>
            )}

            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="px-6 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const showBadge =
                item.path === "/app/messages" && unreadCount > 0;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors relative",
                    isActive(item.path)
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </span>
                  {showBadge && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
            {isLoggedIn && (
              <Button
                className="w-full mt-3"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/app/tasks/publish");
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                发布任务
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
