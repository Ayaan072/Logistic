import { useState, type ReactNode } from 'react';
import { Truck, LayoutDashboard, Package, History, User, LogOut, Menu, Users, PlusCircle, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import NotificationDropdown from '@/components/NotificationDropdown';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  page: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  navItems: NavItem[];
  role: UserRole;
}

export default function DashboardLayout({ children, currentPage, onNavigate, navItems, role }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 text-lg leading-tight">LogiFlow</h1>
          <p className="text-xs text-gray-400 leading-tight">Logistics Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => handleNavigate(item.page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-semibold text-gray-600 text-sm">
            {profile?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{profile?.name}</p>
            <p className="text-xs text-gray-400 truncate">{role === 'ADMIN' ? 'Administrator' : 'Operator'}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col fixed inset-y-0 z-30">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-gray-900/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden animate-[slideInLeft_0.2s_ease-out]">
            {sidebar}
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-base font-semibold text-gray-900 capitalize">
              {navItems.find((n) => n.page === currentPage)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <NotificationDropdown />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export const operatorNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { label: 'Current Order', icon: Package, page: 'current-order' },
  { label: 'Order History', icon: History, page: 'order-history' },
  { label: 'Profile', icon: User, page: 'profile' },
];

export const adminNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { label: 'All Orders', icon: ClipboardList, page: 'all-orders' },
  { label: 'Create Order', icon: PlusCircle, page: 'create-order' },
  { label: 'Operators', icon: Users, page: 'operators' },
  { label: 'Profile', icon: User, page: 'profile' },
];
