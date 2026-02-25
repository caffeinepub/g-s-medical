import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseAnimatedCounterOptions {
  duration?: number;
  start?: number;
  easing?: (t: number) => number;
}

export function useAnimatedCounter(
  target: number,
  options: UseAnimatedCounterOptions = {}
): number {
  const { duration = 1500, start = 0, easing = (t) => 1 - Math.pow(1 - t, 3) } = options;
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(prefersReducedMotion ? target : start);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrent(target);
      return;
    }

    setCurrent(start);
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      setCurrent(Math.round(start + (target - start) * easedProgress));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, start, prefersReducedMotion]);

  return current;
}
