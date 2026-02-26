import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminRefundsPage from './pages/AdminRefundsPage';
import AdminLayout from './components/AdminLayout';
import NotFoundPage from './pages/NotFoundPage';
import { CartProvider } from './context/CartContext';

const queryClient = new QueryClient();

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment',
  component: PaymentPage,
});

const orderSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-success',
  component: OrderSuccessPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/',
  component: AdminDashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/products',
  component: AdminProductsPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/orders',
  component: AdminOrdersPage,
});

const adminRefundsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/refunds',
  component: AdminRefundsPage,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  aboutRoute,
  contactRoute,
  cartRoute,
  paymentRoute,
  orderSuccessRoute,
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminOrdersRoute,
    adminRefundsRoute,
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
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}
