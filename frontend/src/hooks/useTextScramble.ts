import { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$%&';
const SCRAMBLE_DURATION = 400; // ms

/**
 * Hook that scrambles text characters for 400ms before resolving to the real value.
 * Respects prefers-reduced-motion by returning the final value immediately.
 */
export function useTextScramble(target: string): string {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [display, setDisplay] = useState(prefersReducedMotion ? target : '');
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(target);
      return;
    }

    if (!target) {
      setDisplay('');
      return;
    }

    startTimeRef.current = null;

    const scramble = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / SCRAMBLE_DURATION, 1);

      // Reveal characters progressively from left to right
      const revealedCount = Math.floor(progress * target.length);

      let result = '';
      for (let i = 0; i < target.length; i++) {
        if (i < revealedCount) {
          result += target[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplay(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(scramble);
      } else {
        setDisplay(target);
      }
    };

    frameRef.current = requestAnimationFrame(scramble);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, prefersReducedMotion]);

  return display;
}
