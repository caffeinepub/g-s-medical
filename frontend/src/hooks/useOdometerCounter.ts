import { useState, useEffect, useRef } from 'react';

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

export interface OdometerDigitState {
  digit: number;
  isAnimating: boolean;
  targetDigit: number;
}

export interface UseOdometerCounterReturn {
  digits: OdometerDigitState[];
  displayValue: number;
  isAnimating: boolean;
  trigger: () => void;
}

export function useOdometerCounter(
  targetValue: number,
  autoTrigger = false,
  duration = 1200
): UseOdometerCounterReturn {
  const reducedMotion = useReducedMotion();
  const targetStr = Math.floor(targetValue).toString();
  const numDigits = targetStr.length;

  const [digits, setDigits] = useState<OdometerDigitState[]>(() =>
    Array.from({ length: numDigits }, (_, i) => ({
      digit: 0,
      isAnimating: false,
      targetDigit: parseInt(targetStr[i], 10),
    }))
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const hasTriggered = useRef(false);

  const trigger = () => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    if (reducedMotion) {
      setDigits(
        Array.from({ length: numDigits }, (_, i) => ({
          digit: parseInt(targetStr[i], 10),
          isAnimating: false,
          targetDigit: parseInt(targetStr[i], 10),
        }))
      );
      return;
    }

    setIsAnimating(true);
    setDigits(
      Array.from({ length: numDigits }, (_, i) => ({
        digit: 0,
        isAnimating: true,
        targetDigit: parseInt(targetStr[i], 10),
      }))
    );

    // Stagger each digit
    Array.from({ length: numDigits }, (_, i) => {
      const delay = i * (duration / numDigits / 2);
      setTimeout(() => {
        setDigits((prev) =>
          prev.map((d, idx) =>
            idx === i ? { ...d, digit: parseInt(targetStr[i], 10), isAnimating: false } : d
          )
        );
        if (i === numDigits - 1) {
          setIsAnimating(false);
        }
      }, delay + duration);
    });
  };

  useEffect(() => {
    if (autoTrigger) {
      trigger();
    }
  }, [autoTrigger]);

  return {
    digits,
    displayValue: targetValue,
    isAnimating,
    trigger,
  };
}
