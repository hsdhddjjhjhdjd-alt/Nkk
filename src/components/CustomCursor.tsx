import React, { useEffect, useRef, useState } from 'react';

interface CustomCursorProps {
  routeKey?: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ routeKey }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // Reset hover labels cleanly when route changes
  useEffect(() => {
    setCursorLabel(null);
    setIsInteractive(false);
  }, [routeKey]);

  useEffect(() => {
    const isFinePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;
    const isCoarseTouch =
      window.matchMedia('(pointer: coarse)').matches && !isFinePointer;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!isFinePointer || isCoarseTouch || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const labelEl = target.closest('[data-cursor-label]') as HTMLElement | null;
      if (labelEl) {
        setCursorLabel(labelEl.getAttribute('data-cursor-label'));
        setIsInteractive(true);
        return;
      }

      const interactiveEl = target.closest(
        'a, button, input, select, [role="button"]'
      );
      setCursorLabel(null);
      setIsInteractive(Boolean(interactiveEl));
    };

    const handleMouseLeave = () => {
      setVisible(false);
      setCursorLabel(null);
      setIsInteractive(false);
    };

    const tick = () => {
      currentX += (mouseX - currentX) * 0.24;
      currentY += (mouseY - currentY) * 0.24;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {cursorLabel ? (
        <div className="flex items-center justify-center bg-[#141513] px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#F8F7F2] border border-[#F8F7F2]/25 shadow-lg">
          {cursorLabel}
        </div>
      ) : (
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-200 ${
            isInteractive
              ? 'h-9 w-9 border-[#777C68] bg-[#777C68]/15'
              : 'h-4 w-4 border-[#F8F7F2]/80 bg-transparent mix-blend-difference'
          }`}
        >
          <span className="h-1 w-1 rounded-full bg-[#F8F7F2] mix-blend-difference" />
        </div>
      )}
    </div>
  );
};
