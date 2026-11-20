import React, { useState } from 'react';

interface ArchImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackLabel?: string;
  aspectRatio?: string;
  priority?: boolean;
  objectPosition?: string;
  placeholderTone?: 'dark' | 'light';
}

export const ArchImage: React.FC<ArchImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallbackLabel,
  aspectRatio,
  priority = false,
  objectPosition = 'center',
  placeholderTone = 'dark',
}) => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const bgTone = placeholderTone === 'light' ? 'bg-[#DCD8CE]' : 'bg-[#1D1E1B]';

  return (
    <div
      className={`relative overflow-hidden ${bgTone} ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          style={{ objectPosition }}
          className={`h-full w-full object-cover transition-opacity duration-500 ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      ) : (
        <div
          className="flex h-full w-full flex-col justify-between bg-[#1C1D1A] p-6 text-[#E8E5DC]"
          role="img"
          aria-label={alt}
        >
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#A7A69F]">
            Archival Plate
          </span>
          <div>
            <p className="font-display text-xl font-semibold tracking-tight text-[#F8F7F2]">
              {fallbackLabel || alt}
            </p>
            <div className="mt-3 h-px w-12 bg-[#777C68]" />
          </div>
        </div>
      )}
    </div>
  );
};
