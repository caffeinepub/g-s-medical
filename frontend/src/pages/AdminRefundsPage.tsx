import React, { useState } from 'react';
import { useGetRefunds, useUpdateRefundStatus } from '../hooks/useQueries';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '../components/StatusBadge';
import { Search, RotateCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminRefundsPage() {
  const { data: refunds, isLoading } = useGetRefunds();
  const updateRefundStatus = useUpdateRefundStatus();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = (refunds ?? []).filter((r) => {
    const matchSearch =
      !search.trim() ||
      r.refundId.toString().includes(search) ||
      r.orderId.toString().includes(search) ||
      r.reason.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (refundId: bigint, status: string) => {
    try {
      await updateRefundStatus.mutateAsync({ refundId, status });
      toast.success('Refund status updated');
    } catch {
      toast.error('Failed to update refund status');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Refund Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and manage customer refund requests</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by refund ID, order ID, or reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <RotateCcw className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No refund requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Refund ID</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reason</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((refund) => (
                    <tr key={refund.refundId.toString()} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{refund.refundId.toString()}</td>
                      <td className="px-4 py-3 font-mono text-xs">#{refund.orderId.toString()}</td>
                      <td className="px-4 py-3 font-semibold text-primary">₹{Number(refund.amount).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground">{refund.reason}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={refund.status} type="refund" />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(Number(refund.timestamp) / 1_000_000).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          defaultValue={refund.status}
                          onValueChange={(val) => handleStatusChange(refund.refundId, val)}
                          disabled={updateRefundStatus.isPending}
                        >
                          <SelectTrigger className="h-8 w-32 text-xs">
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
