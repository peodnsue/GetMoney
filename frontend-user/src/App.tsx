import { useState, Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/Toast';
import { Loading } from '@/components/Loading';
import { useUserStore } from '@/store/userStore';

const WelcomePage = lazy(() => import('@/pages/Welcome').then(m => ({ default: m.WelcomePage })));
const HomePage = lazy(() => import('@/pages/Home').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('@/pages/Login').then(m => ({ default: m.LoginPage })));
const ProfilePage = lazy(() => import('@/pages/Profile').then(m => ({ default: m.ProfilePage })));
const MessagesPage = lazy(() => import('@/pages/Messages').then(m => ({ default: m.MessagesPage })));
const TaskListPage = lazy(() => import('@/pages/TaskList').then(m => ({ default: m.TaskListPage })));
const TaskDetailPage = lazy(() => import('@/pages/TaskDetail').then(m => ({ default: m.TaskDetailPage })));
const PublishTaskPage = lazy(() => import('@/pages/PublishTask').then(m => ({ default: m.PublishTaskPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFoundPage })));
const HelpPage = lazy(() => import('@/pages/Help').then(m => ({ default: m.HelpPage })));
const ContactPage = lazy(() => import('@/pages/Contact').then(m => ({ default: m.ContactPage })));
const FeedbackPage = lazy(() => import('@/pages/Feedback').then(m => ({ default: m.FeedbackPage })));
const TermsPage = lazy(() => import('@/pages/Terms').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('@/pages/Privacy').then(m => ({ default: m.PrivacyPage })));

interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

function AppContent() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { isLoggedIn, logout } = useUserStore();
  const location = useLocation();
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);

  useEffect(() => {
    const handleLogoutEvent = () => {
      logout();
    };
    
    const handleShow404 = () => {
      setIsNotFoundPage(true);
    };
    
    const handleHide404 = () => {
      setIsNotFoundPage(false);
    };
    
    window.addEventListener('logout', handleLogoutEvent);
    window.addEventListener('show404', handleShow404);
    window.addEventListener('hide404', handleHide404);
    
    return () => {
      window.removeEventListener('logout', handleLogoutEvent);
      window.removeEventListener('show404', handleShow404);
      window.removeEventListener('hide404', handleHide404);
    };
  }, [logout]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const showToast = (message: string, type: ToastItem['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(toasts.filter((t) => t.id !== id));
  };

  const isLoginPage = location.pathname === '/login';
  const isWelcomePage = location.pathname === '/' || location.pathname === '/welcome';
  const isPublicPage = ['/help', '/contact', '/feedback', '/terms', '/privacy', '/404'].some(
    path => location.pathname.startsWith(path)
  );
  const shouldShowHeader = !isLoginPage && !isWelcomePage && !isPublicPage && !isNotFoundPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowHeader && <Header />}
      
      <Suspense fallback={<Loading text="加载中..." />}>
        <Routes>
          <Route
            path="/login"
            element={!isLoggedIn ? <LoginPage onShowToast={showToast} /> : <Navigate to="/app" />}
          />
          <Route
            path="/"
            element={!isLoggedIn ? <WelcomePage onShowToast={showToast} /> : <Navigate to="/app" />}
          />
          <Route
            path="/welcome"
            element={<WelcomePage onShowToast={showToast} />}
          />
          <Route
            path="/app"
            element={isLoggedIn ? <HomePage onShowToast={showToast} /> : <Navigate to="/" />}
          />
          <Route path="/app/tasks" element={isLoggedIn ? <TaskListPage onShowToast={showToast} /> : <Navigate to="/" />} />
          <Route path="/app/tasks/:id" element={isLoggedIn ? <TaskDetailPage onShowToast={showToast} /> : <Navigate to="/" />} />
          <Route path="/app/tasks/publish" element={isLoggedIn ? <PublishTaskPage onShowToast={showToast} /> : <Navigate to="/" />} />
          <Route path="/app/messages" element={isLoggedIn ? <MessagesPage onShowToast={showToast} /> : <Navigate to="/" />} />
          <Route path="/app/profile" element={isLoggedIn ? <ProfilePage onShowToast={showToast} /> : <Navigate to="/" />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
