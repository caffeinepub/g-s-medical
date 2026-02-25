import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface FloatingShapesProps {
  className?: string;
}

export default function FloatingShapes({ className = '' }: FloatingShapesProps) {
  const prefersReducedMotion = useReducedMotion();

  const animClass = prefersReducedMotion ? '' : '';

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large pill - top right */}
      <div
        className={`absolute top-[8%] right-[8%] w-20 h-8 rounded-full bg-white/10 border border-white/20 ${!prefersReducedMotion ? 'animate-float' : ''}`}
        style={{ animationDelay: '0s' }}
      />
      {/* Small pill - top left */}
      <div
        className={`absolute top-[15%] left-[12%] w-12 h-5 rounded-full bg-white/8 border border-white/15 ${!prefersReducedMotion ? 'animate-float-slow' : ''}`}
        style={{ animationDelay: '1s' }}
      />
      {/* Medical cross - center right */}
      <svg
        className={`absolute top-[35%] right-[15%] w-10 h-10 text-white/15 ${!prefersReducedMotion ? 'animate-float-reverse' : ''}`}
        style={{ animationDelay: '0.5s' }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
      </svg>
      {/* Capsule - bottom left */}
      <div
        className={`absolute bottom-[20%] left-[8%] w-16 h-6 rounded-full bg-white/8 border border-white/15 rotate-45 ${!prefersReducedMotion ? 'animate-float' : ''}`}
        style={{ animationDelay: '2s' }}
      />
      {/* Small circle - bottom right */}
      <div
        className={`absolute bottom-[30%] right-[20%] w-8 h-8 rounded-full bg-white/10 border border-white/20 ${!prefersReducedMotion ? 'animate-float-slow' : ''}`}
        style={{ animationDelay: '1.5s' }}
      />
      {/* Tiny pill - mid left */}
      <div
        className={`absolute top-[55%] left-[5%] w-10 h-4 rounded-full bg-white/8 border border-white/15 -rotate-12 ${!prefersReducedMotion ? 'animate-float-reverse' : ''}`}
        style={{ animationDelay: '0.8s' }}
      />
      {/* Medical cross small - top center */}
      <svg
        className={`absolute top-[10%] left-[45%] w-6 h-6 text-white/10 ${!prefersReducedMotion ? 'animate-float' : ''}`}
        style={{ animationDelay: '3s' }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
      </svg>
      {/* Large capsule - mid right */}
      <div
        className={`absolute top-[60%] right-[5%] w-24 h-8 rounded-full bg-white/6 border border-white/12 rotate-12 ${!prefersReducedMotion ? 'animate-float-slow' : ''}`}
        style={{ animationDelay: '2.5s' }}
      />
    </div>
  );
}
