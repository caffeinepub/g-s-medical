import { useGetProducts, useGetOrders, useGetRefunds } from '../hooks/useQueries';
import { Package, ShoppingCart, DollarSign, RefreshCw, TrendingUp, Clock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboardPage() {
  const { data: products = [] } = useGetProducts();
  const { data: orders = [] } = useGetOrders();
  const { data: refunds = [] } = useGetRefunds();

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const pendingRefunds = refunds.filter(r => r.status === 'pending').length;
  const availableProducts = products.filter(p => p.isAvailable).length;

  const recentOrders = [...orders]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  const stats = [
    { label: 'Total Products', value: products.length, sub: `${availableProducts} available`, icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Orders', value: orders.length, sub: `${pendingOrders} pending`, icon: ShoppingCart, color: 'text-green-600 bg-green-50' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: 'All time', icon: DollarSign, color: 'text-purple-600 bg-purple-50' },
    { label: 'Pending Refunds', value: pendingRefunds, sub: `${refunds.length} total`, icon: RefreshCw, color: 'text-orange-600 bg-orange-50' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 text-gray-300" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={Number(order.id)} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono text-gray-600">#{Number(order.id)}</td>
                    <td className="px-5 py-3 text-sm text-gray-900">{order.customerName}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900">₹{Number(order.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} type="order" />
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
