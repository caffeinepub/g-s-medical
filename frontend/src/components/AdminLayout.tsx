import { useEffect } from 'react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Package, ShoppingCart, RefreshCw, LogOut } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminLayout() {
  const { isAdminAuthenticated, isLoading, logout } = useAdminAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      navigate({ to: '/admin/login' });
    }
  }, [isAdminAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) return null;

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Refunds', path: '/admin/refunds', icon: RefreshCw },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return currentPath === '/admin';
    return currentPath.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/gs-medical-logo.dim_400x400.png"
              alt="G&S Medical"
              className="h-8 w-8 rounded-full object-cover"
            />
            <div>
              <div className="font-bold text-gray-900 text-sm">G&S Medical</div>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              logout();
              navigate({ to: '/admin/login' });
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
