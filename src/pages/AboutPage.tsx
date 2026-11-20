import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import {
  ABOUT_STATISTICS,
  BLUEPRINT_DRAWING_IMAGE,
  GALLERY_INTERIOR_IMAGE,
  PageRoute,
} from '../data/projects';
import { ArchImage } from '../components/ArchImage';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#141513] pt-16">
      {/* 1. VISION OPENING */}
      <section className="bg-[#E8E5DC] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
                Our Vision
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em] [text-wrap:balance]">
                An Architectural Exhibition Built for Spatial Curiosity.
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <p className="font-editorial text-2xl italic leading-relaxed text-[#2C2D2A]">
                ARCHVERSE exists outside commercial brokerage and agency self-promotion. We document structures that expand how gravity, climate, and material honesty are imagined.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 overflow-hidden"
          >
            <ArchImage
              src={GALLERY_INTERIOR_IMAGE}
              alt="ARCHVERSE minimalist concrete exhibition gallery interior"
              aspectRatio="16/9"
              placeholderTone="light"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. ARCHITECTURAL PHILOSOPHY & CREATIVE APPROACH */}
      <section className="bg-[#141513] text-[#F8F7F2] py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A7A69F]">
                Architectural Philosophy
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
                Three Principles Governing Our Curation
              </h2>
            </div>

            <div className="space-y-12 lg:col-span-8">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-[#F8F7F2]/15 pt-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-10">
                  <span className="font-display text-sm font-bold tracking-[0.14em] text-[#777C68] tabular-nums">
                    01.
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight">
                      Tectonic Transparency
                    </h3>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#A7A69F]">
                      Every exhibited building reveals how it stands. Rather than concealing load-bearing members behind ornamental skins, selected works celebrate board-formed concrete, steam-bent timber ribs, and exposed steel cantilevers.
                    </p>
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-[#F8F7F2]/15 pt-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-10">
                  <span className="font-display text-sm font-bold tracking-[0.14em] text-[#777C68] tabular-nums">
                    02.
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight">
                      Climate as Co-Author
                    </h3>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#A7A69F]">
                      From volcanic sea spray in Iceland to mist in Kyoto cedar ravines and Mediterranean solar glare in Mallorca, our archive treats wind, rainfall, and daylight angles as primary architectural materials.
                    </p>
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-[#F8F7F2]/15 pt-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-10">
                  <span className="font-display text-sm font-bold tracking-[0.14em] text-[#777C68] tabular-nums">
                    03.
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight">
                      Interactive Spatial Inquiry
                    </h3>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#A7A69F]">
                      Architecture is never flat. Through cross-sectional drawings and our real-time Three.js Design Lab, visitors test how surface finish, color pigment, and sun elevation transform volume.
                    </p>
                  </div>
                </div>
              </motion.article>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & CREATIVE APPROACH */}
      <section className="bg-[#F8F7F2] py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
                Mission &amp; Approach
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-[1.08] tracking-tight lg:text-5xl [text-wrap:balance]">
                Bridging Swiss Editorial Precision with Experimental Spatial Media.
              </h2>
              <div className="mt-8 space-y-5 text-base leading-[1.8] text-[#353632] max-w-[62ch]">
                <p>
                  Our curatorial team collaborates directly with independent structural engineers, architectural photographers, and computational designers across Europe, Asia, and the Americas.
                </p>
                <p>
                  Instead of compressing buildings into uniform thumbnail feeds, every monograph on ARCHVERSE is paced like a physical exhibition room—pairing high-contrast typography, technical section drawings, and tactile material documentation.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="border border-[#141513]/15 p-3 bg-[#E8E5DC]">
                <ArchImage
                  src={BLUEPRINT_DRAWING_IMAGE}
                  alt="Technical architectural elevation and section drawing"
                  aspectRatio="4/3"
                  placeholderTone="light"
                />
              </div>
              <p className="mt-3 font-editorial text-sm italic text-[#5E5F5A]">
                Archival Section Study — Proportion, datum elevation, and structural grid calibration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SELECTED STATISTICS */}
      <section className="border-t border-[#141513]/15 bg-[#E8E5DC] py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
            Exhibition Metrics
          </p>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_STATISTICS.map((stat, idx) => (
              <motion.div
                key={stat.unit}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="border-t border-[#141513] pt-6"
              >
                <p className="font-display text-5xl font-extrabold tracking-tight text-[#141513] tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#777C68]">
                  {stat.unit}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#464743]">
                  {stat.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLOSING STATEMENT */}
      <section className="bg-[#141513] text-[#F8F7F2] py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-editorial text-[clamp(2rem,4vw,3.75rem)] italic leading-[1.15] text-[#F8F7F2] [text-wrap:balance]">
                Architecture endures when it teaches us a new way to measure light, horizon, and silence.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
              <button
                type="button"
                onClick={() => onNavigate('discover')}
                className="inline-flex items-center gap-2 border border-[#F8F7F2]/40 px-5 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#F8F7F2] hover:bg-[#F8F7F2] hover:text-[#141513] transition-colors cursor-pointer"
              >
                <span>Explore Archive</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('design-lab')}
                className="bg-[#777C68] px-5 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#F8F7F2] hover:bg-[#8A9079] transition-colors cursor-pointer"
              >
                Enter Design Lab
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
