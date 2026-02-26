import { useNavigate, useSearch } from '@tanstack/react-router';
import { CheckCircle, Phone, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { orderId?: string };
  const orderId = search?.orderId;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-3">Order Placed Successfully!</h1>
      {orderId && (
        <p className="text-muted-foreground mb-2">
          Order ID: <span className="font-mono font-semibold text-foreground">#{orderId}</span>
        </p>
      )}
      <p className="text-muted-foreground mb-8">
        Thank you for your order. We'll verify your payment and process your order shortly.
      </p>

      <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left">
        <h2 className="font-semibold text-foreground mb-4">What happens next?</h2>
        <ol className="space-y-3">
          {[
            'We verify your UPI payment transaction',
            'Your order is confirmed and prepared',
            'Order is dispatched for delivery',
            'You receive your medicines at your doorstep',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 mb-8">
        <p className="text-sm text-muted-foreground mb-3">Need help? Contact our customer care:</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+919270556455"
            className="flex items-center gap-2 justify-center text-sm font-medium text-primary hover:underline"
          >
            <Phone className="h-4 w-4" />
            +91 92705 56455
          </a>
          <a
            href="tel:+919766343454"
            className="flex items-center gap-2 justify-center text-sm font-medium text-primary hover:underline"
          >
            <Phone className="h-4 w-4" />
            +91 97663 43454
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={() => navigate({ to: '/' })}>
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <Button onClick={() => navigate({ to: '/products' })}>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
