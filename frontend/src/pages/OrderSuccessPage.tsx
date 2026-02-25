import React from 'react';
import { Link } from '@tanstack/react-router';
import { CheckCircle2, Home, ShoppingBag, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderSuccessPage() {
  // Read orderId directly from URL search params to avoid route ID type constraints
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId') || 'N/A';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
      {/* Success Icon */}
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-14 h-14 text-primary" />
      </div>

      <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
        Order Placed Successfully!
      </h1>
      <p className="text-muted-foreground text-lg mb-2">
        Thank you for shopping with G&S Medical!
      </p>

      {/* Order ID */}
      <div className="bg-card border border-border rounded-2xl p-6 my-8 text-left">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground text-sm">Order ID</span>
          <span className="font-mono font-bold text-primary text-lg">#{orderId}</span>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">What happens next?</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Our team will verify your UPI payment</li>
            <li>You'll receive a confirmation call from us</li>
            <li>Your order will be prepared and dispatched</li>
            <li>Delivery within 1-3 business days</li>
          </ul>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-8">
        <p className="text-sm text-muted-foreground mb-3">
          For order updates, contact our customer care:
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="tel:+919270556455"
            className="flex items-center gap-2 font-bold text-primary text-lg hover:underline"
          >
            <Phone className="w-5 h-5" />
            +91 9270556455
          </a>
          <span className="hidden sm:block text-muted-foreground">|</span>
          <a
            href="tel:+919766343454"
            className="flex items-center gap-2 font-bold text-primary text-lg hover:underline"
          >
            <Phone className="w-5 h-5" />
            +91 9766343454
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="rounded-xl" size="lg">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl" size="lg">
          <Link to="/products">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}
