import { useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { cartCount } = useCart();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 group"
          >
            <img
              src="/assets/generated/gs-medical-logo.dim_400x400.png"
              alt="G&S Medical"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="text-left">
              <div className="font-bold text-primary text-lg leading-tight">G&S Medical</div>
              <div className="text-xs text-muted-foreground leading-tight">Your Health Partner</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => navigate({ to: link.path })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+919270556455"
              className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+91 92705 56455</span>
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/contact' })}
              className="hidden md:flex"
            >
              Seller Portal
            </Button>

            <button
              onClick={() => navigate({ to: '/cart' })}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => {
                  navigate({ to: link.path });
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <a
                href="tel:+919270556455"
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground"
              >
                <Phone className="h-4 w-4" />
                +91 92705 56455
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
