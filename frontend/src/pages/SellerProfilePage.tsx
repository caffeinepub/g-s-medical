import React from 'react';
import { Store, User, Mail, Phone, CreditCard, Building2, Shield, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSellerAuth } from '../hooks/useSellerAuth';

function StatusBadge({ status }: { status: string }) {
  if (status === 'verified') {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </Badge>
    );
  }
  if (status === 'rejected') {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200 gap-1">
        <XCircle className="w-3 h-3" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-100 text-amber-800 border-amber-200 gap-1">
      <Clock className="w-3 h-3" />
      Pending Review
    </Badge>
  );
}

function DocStatusIcon({ status }: { status: string }) {
  if (status === 'verified') {
    return <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />;
  }
  if (status === 'rejected') {
    return <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
  }
  return <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
}

export default function SellerProfilePage() {
  const { seller, isLoading } = useSellerAuth();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!seller) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground">Your store and verification details</p>
      </div>

      {/* Store Info */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" />
            Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">{seller.storeName}</h2>
              <p className="text-sm text-muted-foreground">Seller ID: {seller.id}</p>
              <div className="mt-1">
                <StatusBadge status={seller.verificationStatus} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <InfoRow icon={<User className="w-4 h-4" />} label="Owner Name" value={seller.ownerName} />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={seller.email} />
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={seller.phone} />
            <InfoRow
              icon={<Clock className="w-4 h-4" />}
              label="Registered On"
              value={new Date(Number(seller.createdAt) / 1_000_000).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Document Verification */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Document Verification
            <span className="ml-auto">
              <StatusBadge status={seller.verificationStatus} />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-blue-800 text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" />
              Documents are verified against DigiLocker records by our admin team.
            </p>
          </div>

          <div className="space-y-3">
            <DocRow
              icon={<User className="w-4 h-4" />}
              label="Aadhaar Card"
              value={maskAadhaar(seller.aadhaarNumber)}
              status={seller.verificationStatus}
            />
            <DocRow
              icon={<CreditCard className="w-4 h-4" />}
              label="PAN Card"
              value={maskPan(seller.panNumber)}
              status={seller.verificationStatus}
            />
            <DocRow
              icon={<Building2 className="w-4 h-4" />}
              label="Medical Shop License"
              value={seller.medicalLicenseNumber}
              status={seller.verificationStatus}
            />
          </div>

          {seller.verificationStatus === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-amber-800 text-sm font-medium">⏳ Verification in Progress</p>
              <p className="text-amber-700 text-xs mt-1">
                Our admin team is reviewing your documents. This typically takes 2–3 business days.
              </p>
            </div>
          )}

          {seller.verificationStatus === 'verified' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-green-800 text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                All Documents Verified
              </p>
              <p className="text-green-700 text-xs mt-1">
                Your documents have been verified. You are authorized to sell medicines on G&S Medical.
              </p>
            </div>
          )}

          {seller.verificationStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-800 text-sm font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Verification Rejected
              </p>
              <p className="text-red-700 text-xs mt-1">
                Your application was rejected. Please contact support for more information.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function DocRow({ icon, label, value, status }: { icon: React.ReactNode; label: string; value: string; status: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-mono font-medium">{value}</p>
      </div>
      <DocStatusIcon status={status} />
    </div>
  );
}

function maskAadhaar(num: string): string {
  if (num.length <= 4) return num;
  return 'XXXX XXXX ' + num.slice(-4);
}

function maskPan(pan: string): string {
  if (pan.length <= 4) return pan;
  return pan.slice(0, 2) + 'XXXXXXX' + pan.slice(-1);
}
