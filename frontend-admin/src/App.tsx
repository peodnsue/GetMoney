import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { setOnAuthExpired } from './api/api';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tasks from './pages/Tasks';
import Disputes from './pages/Disputes';
import Statistics from './pages/Statistics';
import Banners from './pages/Banners';
import Feedbacks from './pages/Feedbacks';
import Notices from './pages/Notices';
import UserLogs from './pages/UserLogs';
import GcoinManagement from './pages/GcoinManagement';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((state) => state.currentUser);
  const token = localStorage.getItem('token');
  
  if (!currentUser || !token) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role !== 4) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((state) => state.currentUser);
  const token = localStorage.getItem('token');
  
  if (currentUser && token && currentUser.role === 4) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const navigate = useNavigate();
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    // 设置认证过期回调
    setOnAuthExpired(() => {
      logout();
      navigate('/login', { replace: true });
    });
  }, [logout, navigate]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/disputes"
        element={
          <ProtectedRoute>
            <Disputes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <ProtectedRoute>
            <Statistics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banners"
        element={
          <ProtectedRoute>
            <Banners />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedbacks"
        element={
          <ProtectedRoute>
            <Feedbacks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notices"
        element={
          <ProtectedRoute>
            <Notices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-logs"
        element={
          <ProtectedRoute>
            <UserLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gcoin"
        element={
          <ProtectedRoute>
            <GcoinManagement />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
