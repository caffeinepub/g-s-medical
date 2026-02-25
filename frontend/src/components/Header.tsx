import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X, Store } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CartItem {
  id: number;
  quantity: number;
}

interface HeaderProps {
  cartItems?: CartItem[];
  onCartClick?: () => void;
  isCustomerAuthenticated?: boolean;
  customerName?: string;
  onLogout?: () => void;
}

export default function Header({
  cartItems = [],
  onCartClick,
  isCustomerAuthenticated = false,
  customerName,
  onLogout,
}: HeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const prevCartCount = useRef(cartCount);
  const [badgeBounce, setBadgeBounce] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCartCount.current && !prefersReducedMotion) {
      setBadgeBounce(true);
      const t = setTimeout(() => setBadgeBounce(false), 500);
      prevCartCount.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCartCount.current = cartCount;
  }, [cartCount, prefersReducedMotion]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  // Mobile menu only shows items not already in the bottom nav (Home, Products, Cart are there)
  const mobileMenuLinks = [
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-card/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-card border-b border-border'
      } ${!prefersReducedMotion && mounted ? 'animate-slide-down' : ''}`}
      style={{
        borderTop: '3px solid oklch(0.52 0.18 145)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 group"
          >
            <img
              src="/assets/generated/gs-medical-logo.dim_400x400.png"
              alt="G&S Medical"
              className="w-9 h-9 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-display font-bold text-xl text-foreground">
              G&S <span className="text-primary">Medical</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate({ to: link.path })}
                className="nav-link-animated text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Seller Portal */}
            <button
              onClick={() => navigate({ to: '/seller/login' })}
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 rounded-full px-3 py-1.5 hover:bg-primary/10 transition-all duration-200 hover:scale-105"
            >
              <Store className="w-3.5 h-3.5" />
              Seller Portal
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick || (() => navigate({ to: '/cart' }))}
              className="relative p-2 rounded-full hover:bg-accent transition-all duration-200 hover:scale-110"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center ${
                    badgeBounce ? 'animate-badge-bounce' : ''
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {isCustomerAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Hi, {customerName}</span>
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-destructive hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate({ to: '/login' })}
                className="hidden md:block text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                Login
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — only shows links not already in the bottom nav */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        } bg-card border-t border-border`}
      >
        <div className="px-4 py-4 space-y-2">
          {mobileMenuLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate({ to: link.path });
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              navigate({ to: '/seller/login' });
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            <Store className="w-4 h-4" />
            Seller Portal
          </button>
          {isCustomerAuthenticated ? (
            <button
              onClick={() => {
                onLogout?.();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate({ to: '/login' });
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
