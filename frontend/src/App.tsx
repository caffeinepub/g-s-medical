import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import SellerLayout from './components/SellerLayout';

// Customer Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import CustomerLoginPage from './pages/CustomerLoginPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminRefundsPage from './pages/AdminRefundsPage';
import AdminSellersPage from './pages/AdminSellersPage';

// Seller Pages
import SellerRegisterPage from './pages/SellerRegisterPage';
import SellerLoginPage from './pages/SellerLoginPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import SellerProductsPage from './pages/SellerProductsPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import SellerProfilePage from './pages/SellerProfilePage';

// Cart Context
import { CartProvider } from './context/CartContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Customer layout route
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: Layout,
});

// Customer routes
const homeRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/', component: HomePage });
const productsRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/products', component: ProductsPage });
const cartRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/cart', component: CartPage });
const paymentRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/payment', component: PaymentPage });
const orderSuccessRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/order-success', component: OrderSuccessPage });
const aboutRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/about', component: AboutPage });
const contactRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/contact', component: ContactPage });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: CustomerLoginPage });

// Admin login (standalone, no AdminLayout guard)
const adminLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/login', component: AdminLoginPage });

// Admin layout route — wraps children with AdminLayout which enforces auth
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});

// Admin routes
const adminDashboardRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin', component: AdminDashboardPage });
const adminProductsRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/products', component: AdminProductsPage });
const adminOrdersRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/orders', component: AdminOrdersPage });
const adminRefundsRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/refunds', component: AdminRefundsPage });
const adminSellersRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/sellers', component: AdminSellersPage });

// Seller standalone routes (no SellerLayout)
const sellerRegisterRoute = createRoute({ getParentRoute: () => rootRoute, path: '/seller/register', component: SellerRegisterPage });
const sellerLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/seller/login', component: SellerLoginPage });

// Seller layout route — wraps children with SellerLayout which enforces auth
const sellerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'seller-layout',
  component: () => (
    <SellerLayout>
      <Outlet />
    </SellerLayout>
  ),
});

// Seller dashboard routes
const sellerDashboardRoute = createRoute({ getParentRoute: () => sellerLayoutRoute, path: '/seller/dashboard', component: SellerDashboardPage });
const sellerProductsRoute = createRoute({ getParentRoute: () => sellerLayoutRoute, path: '/seller/products', component: SellerProductsPage });
const sellerOrdersRoute = createRoute({ getParentRoute: () => sellerLayoutRoute, path: '/seller/orders', component: SellerOrdersPage });
const sellerProfileRoute = createRoute({ getParentRoute: () => sellerLayoutRoute, path: '/seller/profile', component: SellerProfilePage });

// Not found
const notFoundRoute = createRoute({ getParentRoute: () => rootRoute, path: '*', component: NotFoundPage });

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    productsRoute,
    cartRoute,
    paymentRoute,
    orderSuccessRoute,
    aboutRoute,
    contactRoute,
  ]),
  loginRoute,
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminOrdersRoute,
    adminRefundsRoute,
    adminSellersRoute,
  ]),
  sellerRegisterRoute,
  sellerLoginRoute,
  sellerLayoutRoute.addChildren([
    sellerDashboardRoute,
    sellerProductsRoute,
    sellerOrdersRoute,
    sellerProfileRoute,
  ]),
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
