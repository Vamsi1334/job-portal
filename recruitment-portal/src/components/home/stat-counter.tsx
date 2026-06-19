'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

/**
 * Animated count-up stat used in the hero. Counts from 0 to `value` once the
 * element scrolls into view. Falls back to the final value when reduced motion
 * is requested.
 */
export function StatCounter({ value, suffix = '', label }: StatCounterProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let started = false;

    const run = () => {
      const duration = 1200;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div ref={ref} className="bg-background px-6 py-6">
      <dd className="font-display text-3xl font-extrabold tracking-tight">
        {display.toLocaleString()}
        {suffix}
      </dd>
      <dt className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
    </div>
  );
}
