// UIB Pulse — Count-Up Animation Hook
import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Uses easeOutCubic easing for a premium feel.
 */
export function useCountUp(target, duration = 1800, decimals = 0, delay = 0) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const startAnimation = () => {
      startTimeRef.current = null;

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const animate = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = eased * target;

        setValue(parseFloat(current.toFixed(decimals)));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setValue(target);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, decimals, delay]);

  return value;
}

/**
 * Returns a formatted string with optional suffix (%, pts, etc.)
 */
export function useFormattedCountUp(target, suffix = '', duration = 1800, decimals = 0, delay = 0) {
  const value = useCountUp(target, duration, decimals, delay);
  return `${value}${suffix}`;
}
