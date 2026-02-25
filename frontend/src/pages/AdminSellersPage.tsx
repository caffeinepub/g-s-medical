import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Clock, Loader2, Store, AlertTriangle, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useGetSellers, useUpdateSellerVerificationStatus } from '../hooks/useQueries';
import type { SellerPublic } from '../backend';

function VerificationBadge({ status }: { status: string }) {
  if (status === 'verified') {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 gap-1 text-xs">
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </Badge>
    );
  }
  if (status === 'rejected') {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200 gap-1 text-xs">
        <XCircle className="w-3 h-3" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-100 text-amber-800 border-amber-200 gap-1 text-xs">
      <Clock className="w-3 h-3" />
      Pending
    </Badge>
  );
}

export default function AdminSellersPage() {
  const { data: sellers, isLoading } = useGetSellers();
  const updateStatus = useUpdateSellerVerificationStatus();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const pendingCount = (sellers || []).filter((s) => s.verificationStatus === 'pending').length;

  const filtered = (sellers || []).filter((s) => {
    const matchSearch =
      s.storeName.toLowerCase().includes(search.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.verificationStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (sellerId: string, status: string) => {
    setUpdatingId(sellerId);
    try {
      await updateStatus.mutateAsync({ sellerId, status });
      toast.success(`Seller ${status === 'verified' ? 'approved' : status === 'rejected' ? 'rejected' : 'set to pending'} successfully`);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Manage Sellers</h1>
        <p className="text-sm text-muted-foreground">Review and approve seller applications</p>
      </div>

      {/* Pending Applications Alert Banner */}
      {!isLoading && pendingCount > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">
              {pendingCount} new seller application{pendingCount > 1 ? 's' : ''} awaiting your review
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Review and approve or reject each application below. Only approved sellers can list products on your website.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100 rounded-lg text-xs"
            onClick={() => setStatusFilter('pending')}
          >
            View Pending
          </Button>
        </div>
      )}

      {/* All Clear Banner */}
      {!isLoading && pendingCount === 0 && (sellers || []).length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800 font-medium">
            All seller applications have been reviewed. No pending approvals.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: sellers?.length || 0, color: 'text-foreground' },
          { label: 'Pending', value: pendingCount, color: 'text-amber-600' },
          { label: 'Verified', value: sellers?.filter((s) => s.verificationStatus === 'verified').length || 0, color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4 text-center">
            <div className={`font-heading text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sellers..."
            className="pl-9 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44 rounded-xl">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">
              <span className="flex items-center gap-2">
                Pending
                {pendingCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                    {pendingCount}
                  </span>
                )}
              </span>
            </SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground font-medium">
            {search || statusFilter !== 'all' ? 'No sellers match your filters' : 'No sellers registered yet'}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Store</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Documents</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Registered</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((seller) => (
                  <SellerRow
                    key={seller.id}
                    seller={seller}
                    isUpdating={updatingId === seller.id}
                    onApprove={() => handleStatusChange(seller.id, 'verified')}
                    onReject={() => handleStatusChange(seller.id, 'rejected')}
                    onPending={() => handleStatusChange(seller.id, 'pending')}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

interface SellerRowProps {
  seller: SellerPublic;
  isUpdating: boolean;
  onApprove: () => void;
  onReject: () => void;
  onPending: () => void;
}

function SellerRow({ seller, isUpdating, onApprove, onReject, onPending }: SellerRowProps) {
  return (
    <tr className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${seller.verificationStatus === 'pending' ? 'bg-amber-50/30' : ''}`}>
      <td className="px-4 py-3">
        <div className="font-medium text-sm">{seller.storeName}</div>
        <div className="text-xs text-muted-foreground">{seller.ownerName}</div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="text-xs text-muted-foreground">{seller.email}</div>
        <div className="text-xs text-muted-foreground">{seller.phone}</div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="text-xs space-y-0.5">
          <div><span className="text-muted-foreground">Aadhaar:</span> <span className="font-mono">{'XXXX' + seller.aadhaarNumber.slice(-4)}</span></div>
          <div><span className="text-muted-foreground">PAN:</span> <span className="font-mono">{seller.panNumber}</span></div>
          <div><span className="text-muted-foreground">License:</span> <span className="font-mono">{seller.medicalLicenseNumber}</span></div>
        </div>
      </td>
      <td className="px-4 py-3">
        <VerificationBadge status={seller.verificationStatus} />
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
        {new Date(Number(seller.createdAt) / 1_000_000).toLocaleDateString('en-IN')}
      </td>
      <td className="px-4 py-3">
        {isUpdating ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : (
          <div className="flex gap-1 flex-wrap">
            {seller.verificationStatus !== 'verified' && (
              <Button
                size="sm"
                variant="outline"
                className="text-green-700 border-green-200 hover:bg-green-50 rounded-lg text-xs h-7 px-2"
                onClick={onApprove}
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Approve
              </Button>
            )}
            {seller.verificationStatus !== 'rejected' && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-700 border-red-200 hover:bg-red-50 rounded-lg text-xs h-7 px-2"
                onClick={onReject}
              >
                <XCircle className="w-3 h-3 mr-1" />
                Reject
              </Button>
            )}
            {seller.verificationStatus !== 'pending' && (
              <Button
                size="sm"
                variant="outline"
                className="text-amber-700 border-amber-200 hover:bg-amber-50 rounded-lg text-xs h-7 px-2"
                onClick={onPending}
              >
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
