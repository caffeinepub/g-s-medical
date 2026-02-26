import React, { useRef, useEffect, useState } from 'react';

interface PriceFlipProps {
  children: React.ReactNode;
  className?: string;
  /** Pass a changing value as triggerKey to replay the animation */
  triggerKey?: string | number;
  /** If true, uses IntersectionObserver to trigger on viewport entry */
  observeViewport?: boolean;
}

/**
 * Wraps a price display and triggers a 3D rotateY flip-in animation on mount or when triggerKey changes.
 * Supports viewport-triggered animation via IntersectionObserver.
 * Respects prefers-reduced-motion.
 */
export default function PriceFlip({
  children,
  className,
  triggerKey,
  observeViewport = false,
}: PriceFlipProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [animKey, setAnimKey] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(!observeViewport);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Viewport observer
  useEffect(() => {
    if (!observeViewport || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldAnimate(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [observeViewport, prefersReducedMotion]);

  // Replay animation when triggerKey changes
  useEffect(() => {
    if (triggerKey !== undefined && !prefersReducedMotion) {
      setAnimKey((k) => k + 1);
    }
  }, [triggerKey, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      ref={ref}
      key={animKey}
      className={`inline-block ${shouldAnimate ? 'price-flip' : 'opacity-0'} ${className || ''}`}
      style={{ perspective: '400px' }}
    >
      {children}
    </span>
  );
}
