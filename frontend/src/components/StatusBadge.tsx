interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'payment' | 'refund';
}

export default function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
  const getStyles = () => {
    if (type === 'payment') {
      return status === 'paid'
        ? 'bg-green-100 text-green-800'
        : 'bg-yellow-100 text-yellow-800';
    }
    if (type === 'refund') {
      switch (status) {
        case 'approved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'processed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-yellow-100 text-yellow-800';
      }
    }
    // order status
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStyles()}`}>
      {status}
    </span>
  );
}
