import React, { useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { ArchImage } from './ArchImage';

interface BlueprintToRealityProps {
  drawingImage: string;
  realityImage: string;
  projectTitle: string;
  coordinates?: string;
  cantileverMeters?: number;
  theme?: 'light' | 'dark';
  compact?: boolean;
}

export const BlueprintToReality: React.FC<BlueprintToRealityProps> = ({
  drawingImage,
  realityImage,
  projectTitle,
  coordinates = '60.412° N · 6.458° E',
  cantileverMeters = 22.5,
  theme = 'light',
  compact = false,
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [splitPercent, setSplitPercent] = useState<number>(48);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const updateSplitFromClientX = (clientX: number) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const raw = ((clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const clamped = Math.max(4, Math.min(96, Math.round(raw)));
    setSplitPercent(clamped);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSplitFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSplitFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitPercent((prev) => Math.max(4, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitPercent((prev) => Math.min(96, prev + 5));
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="w-full">
      {/* Control Strip */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
          isDark ? 'border-[#F8F7F2]/15' : 'border-[#141513]/15'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: '01. Concept Drawing', value: 88 },
            { label: '02. Split Overlay', value: 50 },
            { label: '03. Built Reality', value: 10 },
          ].map((preset) => {
            const active = Math.abs(splitPercent - preset.value) <= 6;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setSplitPercent(preset.value)}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                  active
                    ? isDark
                      ? 'bg-[#F8F7F2] text-[#141513]'
                      : 'bg-[#141513] text-[#F8F7F2]'
                    : isDark
                      ? 'border border-[#F8F7F2]/20 text-[#E8E5DC] hover:border-[#F8F7F2]/50'
                      : 'border border-[#141513]/20 text-[#141513] hover:border-[#141513]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div
          className={`text-xs font-medium tabular-nums ${
            isDark ? 'text-[#A7A69F]' : 'text-[#5E5F5A]'
          }`}
        >
          Drawing {splitPercent}% · Built Form {100 - splitPercent}%
        </div>
      </div>

      {/* Interactive Scrub Frame */}
      <div
        ref={frameRef}
        role="slider"
        tabIndex={0}
        aria-label={`Blueprint to reality comparison for ${projectTitle}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={splitPercent}
        data-cursor-label="Scrub"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative mt-5 select-none overflow-hidden touch-none cursor-ew-resize border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777C68] ${
          isDark ? 'border-[#F8F7F2]/20' : 'border-[#141513]/20'
        } ${compact ? 'aspect-[4/3]' : 'aspect-[4/3] lg:aspect-[16/9]'}`}
      >
        {/* Base Layer: Built Reality */}
        <div className="absolute inset-0">
          <ArchImage
            src={realityImage}
            alt={`${projectTitle} completed architectural photograph`}
            className="h-full w-full"
            placeholderTone={isDark ? 'dark' : 'light'}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#141513]/70 to-transparent" />
          <span className="pointer-events-none absolute right-4 bottom-4 bg-[#141513]/85 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#F8F7F2]">
            Built Structure · {coordinates}
          </span>
        </div>

        {/* Top Clipped Layer: Technical Architectural Drawing */}
        <div
          className="absolute inset-0 transition-[clip-path] duration-150 ease-out"
          style={{
            clipPath: `inset(0 ${100 - splitPercent}% 0 0)`,
            transitionDuration: isDragging ? '0ms' : '220ms',
          }}
        >
          <ArchImage
            src={drawingImage}
            alt={`${projectTitle} architectural cross-section technical drawing`}
            className="h-full w-full"
            placeholderTone="light"
          />
          <span className="pointer-events-none absolute left-4 bottom-4 bg-[#F8F7F2]/92 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#141513] border border-[#141513]/15">
            Section A-A · Scale 1:100 · Span {cantileverMeters.toFixed(1)}m
          </span>
        </div>

        {/* Vertical Datum Split Line & Handle */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 z-10 w-px bg-[#F8F7F2] shadow-[0_0_12px_rgba(20,21,19,0.55)]"
          style={{ left: `${splitPercent}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#141513]/25 bg-[#F8F7F2] text-[#141513] shadow-md">
            <MoveHorizontal size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};
