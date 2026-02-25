import React from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldX, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccessDeniedScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6">
        <ShieldX className="w-10 h-10 text-destructive" />
      </div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        You don't have permission to access this area. This section is restricted to administrators only.
        Please log in with an admin account to continue.
      </p>
      <Button asChild className="rounded-xl">
        <Link to="/">
          <Home className="w-4 h-4 mr-2" />
          Return to Homepage
        </Link>
      </Button>
    </div>
  );
}
