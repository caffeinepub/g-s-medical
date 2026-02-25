import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AnimatedCheckmarkProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function AnimatedCheckmark({
  size = 80,
  color = 'oklch(0.52 0.18 145)',
  className = '',
}: AnimatedCheckmarkProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle */}
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke={color}
          strokeWidth="4"
          fill="none"
          style={
            prefersReducedMotion
              ? {}
              : {
                  strokeDasharray: '226',
                  strokeDashoffset: '0',
                  animation: 'draw-circle 0.6s ease-out forwards',
                }
          }
        />
        {/* Checkmark */}
        <path
          d="M22 40 L34 52 L58 28"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={
            prefersReducedMotion
              ? {}
              : {
                  strokeDasharray: '50',
                  strokeDashoffset: '50',
                  animation: 'draw-check 0.5s ease-out 0.4s forwards',
                }
          }
        />
      </svg>
      <style>{`
        @keyframes draw-circle {
          from { stroke-dashoffset: 226; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          from { stroke-dashoffset: 50; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
