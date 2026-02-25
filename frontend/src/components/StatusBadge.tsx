import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'payment' | 'refund';
}

const orderStatusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const paymentStatusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-800 border-green-200',
  unpaid: 'bg-red-100 text-red-800 border-red-200',
};

const refundStatusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  processed: 'bg-blue-100 text-blue-800 border-blue-200',
};

export default function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
  let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';

  if (type === 'payment') {
    colorClass = paymentStatusColors[status.toLowerCase()] || colorClass;
  } else if (type === 'refund') {
    colorClass = refundStatusColors[status.toLowerCase()] || colorClass;
  } else {
    colorClass = orderStatusColors[status.toLowerCase()] || colorClass;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} capitalize`}>
      {status}
    </span>
  );
}
