import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';
import { FullPageLoader } from '@/components/Loading';
import DashboardLayout, { operatorNavItems, adminNavItems } from '@/components/DashboardLayout';
import OrderDetailModal from '@/components/OrderDetailModal';

import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';

import OperatorDashboard from '@/pages/operator/OperatorDashboard';
import OperatorOrderHistory from '@/pages/operator/OperatorOrderHistory';
import OperatorProfile from '@/pages/operator/OperatorProfile';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminAllOrders from '@/pages/admin/AdminAllOrders';
import CreateOrder from '@/pages/admin/CreateOrder';
import AdminOperators from '@/pages/admin/AdminOperators';
import AdminProfile from '@/pages/admin/AdminProfile';

type AppView = 'landing' | 'login';

function AppContent() {
  const { session, profile, loading } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

  if (loading) {
    return <FullPageLoader message="Loading LogiFlow..." />;
  }

  // Not authenticated - show landing or login
  if (!session || !profile) {
    if (view === 'login') {
      return <LoginPage onBack={() => setView('landing')} />;
    }
    return (
      <LandingPage
        onGetStarted={() => setView('login')}
        onLogin={() => setView('login')}
      />
    );
  }

  const isAdmin = profile.role === 'ADMIN';

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (isAdmin) {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard onViewOrder={setDetailOrderId} onNavigate={handleNavigate} />;
        case 'all-orders':
          return <AdminAllOrders onViewOrder={setDetailOrderId} onNavigate={handleNavigate} />;
        case 'create-order':
          return <CreateOrder onNavigate={handleNavigate} />;
        case 'operators':
          return <AdminOperators />;
        case 'profile':
          return <AdminProfile />;
        default:
          return <AdminDashboard onViewOrder={setDetailOrderId} onNavigate={handleNavigate} />;
      }
    } else {
      switch (currentPage) {
        case 'dashboard':
          return <OperatorDashboard onViewOrder={setDetailOrderId} onNavigate={handleNavigate} />;
        case 'current-order':
          return <OperatorDashboard onViewOrder={setDetailOrderId} onNavigate={handleNavigate} />;
        case 'order-history':
          return <OperatorOrderHistory onViewOrder={setDetailOrderId} />;
        case 'profile':
          return <OperatorProfile />;
        default:
          return <OperatorDashboard onViewOrder={setDetailOrderId} onNavigate={handleNavigate} />;
      }
    }
  };

  return (
    <>
      <DashboardLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        navItems={isAdmin ? adminNavItems : operatorNavItems}
        role={profile.role}
      >
        {renderPage()}
      </DashboardLayout>
      <OrderDetailModal orderId={detailOrderId} onClose={() => setDetailOrderId(null)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
