import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import FloatingShapes from './FloatingShapes';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branded */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative flex-col items-center justify-center p-12 overflow-hidden">
        <FloatingShapes />
        <div className={`relative z-10 text-center ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
          <div className="mb-8">
            <img
              src="/assets/generated/gs-medical-logo.dim_400x400.png"
              alt="G&S Medical"
              className="w-24 h-24 mx-auto rounded-2xl shadow-2xl object-cover"
            />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            G&S Medical
          </h1>
          <p className="text-white/80 text-lg max-w-sm leading-relaxed">
            Your trusted partner for genuine medicines and healthcare products.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-center">
            {[
              { label: 'Products', value: '500+' },
              { label: 'Customers', value: '10K+' },
              { label: 'Delivery', value: 'Same Day' },
              { label: 'Support', value: '24/7' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`bg-white/10 rounded-xl p-4 border border-white/20 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
                style={!prefersReducedMotion ? { animationDelay: `${0.3 + i * 0.1}s` } : {}}
              >
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-background">
        <div className={`w-full max-w-md ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img
              src="/assets/generated/gs-medical-logo.dim_400x400.png"
              alt="G&S Medical"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="text-xl font-display font-bold text-foreground">G&S Medical</span>
          </div>
          {title && (
            <div className="mb-8">
              <h2 className="text-3xl font-display font-bold text-foreground">{title}</h2>
              {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
