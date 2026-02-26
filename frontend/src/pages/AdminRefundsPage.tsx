import { useState } from 'react';
import { Search, Loader2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetRefunds, useUpdateRefundStatus } from '../hooks/useQueries';
import StatusBadge from '../components/StatusBadge';
import { toast } from 'sonner';

export default function AdminRefundsPage() {
  const { data: refunds = [], isLoading } = useGetRefunds();
  const updateStatus = useUpdateRefundStatus();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = refunds.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search) {
      return r.orderId.toString().includes(search) || r.reason.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handleStatusUpdate = async (refundId: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ refundId: Number(refundId), status });
      toast.success('Refund status updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const pending = refunds.filter(r => r.status === 'pending').length;
  const totalAmount = refunds.reduce((s, r) => s + Number(r.amount), 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Refunds</h1>
        <p className="text-gray-500 text-sm">{refunds.length} total refund requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Refunds</p>
          <p className="text-2xl font-bold text-gray-900">{refunds.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search refunds..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 font-medium">Refund ID</th>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      <RefreshCw className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      No refunds found
                    </td>
                  </tr>
                ) : (
                  filtered.map(refund => (
                    <tr key={Number(refund.refundId)} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">#{Number(refund.refundId)}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">#{Number(refund.orderId)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{refund.reason}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary">₹{Number(refund.amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={refund.status} type="refund" />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(Number(refund.timestamp) / 1_000_000).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={refund.status}
                          onValueChange={val => handleStatusUpdate(refund.refundId, val)}
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="processed">Processed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
