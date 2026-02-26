import React, { useRef, useEffect, useState } from 'react';

interface WaveUnderlineProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h2' | 'h3';
}

const WAVE_PATH = 'M0,4 C10,0 20,8 30,4 C40,0 50,8 60,4 C70,0 80,8 90,4 C100,0 110,8 120,4 C130,0 140,8 150,4 C160,0 170,8 180,4 C190,0 200,8 210,4';
const WAVE_LENGTH = 215;

/**
 * Wraps a heading with an animated emerald wavy SVG underline that draws on viewport entry.
 * Uses stroke-dashoffset animation over 600ms. Respects prefers-reduced-motion.
 */
export default function WaveUnderline({ children, className, as: Tag = 'h2' }: WaveUnderlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGPathElement>(null);
  const [visible, setVisible] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (visible && svgRef.current && !prefersReducedMotion) {
      svgRef.current.classList.add('animate');
    }
  }, [visible, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={`inline-block ${className || ''}`}>
      <Tag>{children}</Tag>
      <svg
        viewBox="0 0 210 10"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full mt-1"
        style={{ height: '10px', overflow: 'visible' }}
        aria-hidden="true"
      >
        <path
          ref={svgRef}
          d={WAVE_PATH}
          fill="none"
          stroke="oklch(0.55 0.18 145)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="wave-underline-svg"
          style={
            {
              '--wave-length': `${WAVE_LENGTH}`,
              strokeDasharray: WAVE_LENGTH,
              strokeDashoffset: prefersReducedMotion ? 0 : WAVE_LENGTH,
            } as React.CSSProperties
          }
        />
      </svg>
    </div>
  );
}
