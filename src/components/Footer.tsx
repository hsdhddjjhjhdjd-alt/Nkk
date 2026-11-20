import React from 'react';
import { ArrowUp } from 'lucide-react';
import { PageRoute } from '../data/projects';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#141513] text-[#E8E5DC] border-t border-[#F8F7F2]/10">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-display text-2xl font-extrabold tracking-[0.16em] uppercase text-[#F8F7F2] hover:opacity-80 transition-opacity cursor-pointer"
            >
              ARCHVERSE
            </button>
            <p className="mt-4 max-w-md font-editorial text-xl italic leading-relaxed text-[#A7A69F]">
              An independent digital exhibition dedicated to experimental concrete, timber, and parametric structures across shifting landscapes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A7A69F]">
                Exhibition
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="text-[#E8E5DC] hover:text-[#777C68] transition-colors cursor-pointer"
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('discover')}
                    className="text-[#E8E5DC] hover:text-[#777C68] transition-colors cursor-pointer"
                  >
                    Discover Archive
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('projects')}
                    className="text-[#E8E5DC] hover:text-[#777C68] transition-colors cursor-pointer"
                  >
                    All Projects
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A7A69F]">
                Practice
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('design-lab')}
                    className="text-[#E8E5DC] hover:text-[#777C68] transition-colors cursor-pointer"
                  >
                    Interactive 3D Lab
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('about')}
                    className="text-[#E8E5DC] hover:text-[#777C68] transition-colors cursor-pointer"
                  >
                    Curatorial Vision
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A7A69F]">
                Colophon
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-[#A7A69F]">
                Edition 2026
                <br />
                Zurich · Kyoto · Oslo
                <br />
                curatorial@archverse.org
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[#F8F7F2]/10 pt-8 text-xs text-[#A7A69F] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ARCHVERSE Spatial Monograph. All architectural rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="tabular-nums">
              Exhibition Index · 08 Structural Studies
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#E8E5DC] hover:text-[#777C68] transition-colors cursor-pointer uppercase tracking-wider font-semibold"
            >
              <span>Top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
