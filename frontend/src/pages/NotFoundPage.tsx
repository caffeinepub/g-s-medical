import React from 'react';
import { Link } from '@tanstack/react-router';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="relative mb-8">
        <div className="font-heading text-8xl md:text-9xl font-bold text-primary/10 select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
            <Search className="w-10 h-10 text-primary" />
          </div>
        </div>
      </div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Oops! The page you're looking for doesn't exist. It may have been moved or deleted.
      </p>
      <Button asChild className="rounded-xl" size="lg">
        <Link to="/">
          <Home className="w-4 h-4 mr-2" />
          Back to Homepage
        </Link>
      </Button>
    </div>
  );
}
