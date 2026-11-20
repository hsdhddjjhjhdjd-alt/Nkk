import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { PageRoute } from '../data/projects';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  transparentHero?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  transparentHero = false,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const isDarkSurface =
    currentPage === 'design-lab' ||
    (transparentHero && !scrolled && !mobileMenuOpen);

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Discover', route: 'discover' },
    { label: 'Projects', route: 'projects' },
    { label: 'About', route: 'about' },
  ];

  const handleLinkClick = (route: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <>
      <motion.header
        initial={{ y: -14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 inset-x-3 z-50 mx-auto max-w-[1392px] sm:top-4 sm:inset-x-6"
      >
        <div
          className={`flex h-14 sm:h-[60px] items-center justify-between gap-4 lg:gap-8 rounded-2xl px-4 sm:px-6 lg:px-8 backdrop-blur-[24px] transition-all duration-300 ${
            isDarkSurface
              ? 'bg-[#141513]/48 text-[#F8F7F2] border border-[#F8F7F2]/14 shadow-[0_14px_38px_-12px_rgba(0,0,0,0.45)]'
              : 'bg-[#F8F7F2]/64 text-[#141513] border border-[#141513]/10 shadow-[0_14px_38px_-14px_rgba(20,21,19,0.14)]'
          }`}
        >
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className="font-display text-sm sm:text-base font-extrabold tracking-[0.18em] uppercase whitespace-nowrap shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#777C68]"
          >
            ARCHVERSE
          </button>

          {/* Zone 2: 4 Concise Single-line Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1.5 lg:gap-2"
          >
            {navLinks.map((item) => {
              const isActive =
                currentPage === item.route ||
                (currentPage === 'project-details' && item.route === 'projects');
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => handleLinkClick(item.route)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative px-3.5 py-2 rounded-xl text-[13px] font-medium tracking-[0.04em] whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777C68] ${
                    isActive
                      ? isDarkSurface
                        ? 'text-[#F8F7F2]'
                        : 'text-[#141513]'
                      : isDarkSurface
                        ? 'text-[#E8E5DC]/72 hover:text-[#F8F7F2] hover:bg-[#F8F7F2]/8'
                        : 'text-[#141513]/65 hover:text-[#141513] hover:bg-[#141513]/5'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="archverse-nav-active-indicator"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 32,
                      }}
                      className={`absolute bottom-1 left-3.5 right-3.5 h-[1.5px] rounded-full ${
                        isDarkSurface ? 'bg-[#F8F7F2]' : 'bg-[#141513]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleLinkClick('design-lab')}
              aria-current={currentPage === 'design-lab' ? 'page' : undefined}
              className={`rounded-xl px-4 py-2 text-[11px] sm:text-xs font-semibold tracking-[0.13em] uppercase whitespace-nowrap shrink-0 cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777C68] ${
                currentPage === 'design-lab'
                  ? 'bg-[#777C68] text-[#F8F7F2] shadow-sm'
                  : isDarkSurface
                    ? 'bg-[#F8F7F2]/92 text-[#141513] hover:bg-[#F8F7F2]'
                    : 'bg-[#141513]/92 text-[#F8F7F2] hover:bg-[#777C68]'
              }`}
            >
              Design Lab
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={
                mobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              className={`md:hidden flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#777C68] ${
                isDarkSurface
                  ? 'hover:bg-[#F8F7F2]/10'
                  : 'hover:bg-[#141513]/8'
              }`}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Frosted-Glass Fullscreen Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#141513]/88 backdrop-blur-[24px] px-6 pt-24 pb-10 text-[#F8F7F2] md:hidden"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-5">
              {[
                ...navLinks,
                { label: 'Design Lab', route: 'design-lab' as PageRoute },
              ].map((item, idx) => {
                const isActive =
                  currentPage === item.route ||
                  (currentPage === 'project-details' &&
                    item.route === 'projects');
                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => handleLinkClick(item.route)}
                    className="flex min-h-[48px] items-baseline justify-between border-b border-[#F8F7F2]/15 pb-4 text-left cursor-pointer transition-colors duration-200"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`font-display text-3xl font-bold tracking-tight transition-colors ${
                          isActive
                            ? 'text-[#F8F7F2]'
                            : 'text-[#F8F7F2]/70 hover:text-[#F8F7F2]'
                        }`}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[#777C68]"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="text-xs tabular-nums text-[#A7A69F]">
                      0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-[#F8F7F2]/15 pt-6 text-xs text-[#A7A69F]">
              <p className="font-editorial italic text-base text-[#E8E5DC]">
                Digital Exhibition of Experimental Architecture
              </p>
              <p className="mt-2 tracking-wider uppercase">
                Basel · Kyoto · Hardangerfjord
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
