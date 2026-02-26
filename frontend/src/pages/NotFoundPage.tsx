import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary/20 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate({ to: '/' })}>
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
