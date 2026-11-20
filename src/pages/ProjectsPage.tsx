import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, LayoutGrid, List } from 'lucide-react';
import { PROJECTS, PageRoute } from '../data/projects';
import { ArchImage } from '../components/ArchImage';

interface ProjectsPageProps {
  onSelectProject: (projectId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onSelectProject,
  onNavigate,
}) => {
  const [viewMode, setViewMode] = useState<'editorial' | 'index'>('editorial');

  return (
    <div className="min-h-screen bg-[#E8E5DC] text-[#141513] pt-16">
      {/* Header Band */}
      <section className="border-b border-[#141513]/15 bg-[#E8E5DC] py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
                Complete Catalogue · 2024—2025
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
                Architectural Monograph Index
              </h1>
            </motion.div>

            {/* View Switcher */}
            <div className="flex items-center gap-2 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('editorial')}
                className={`inline-flex min-h-[44px] items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'editorial'
                    ? 'bg-[#141513] text-[#F8F7F2]'
                    : 'border border-[#141513]/25 text-[#141513] hover:bg-[#141513]/5'
                }`}
              >
                <LayoutGrid size={14} />
                <span>Editorial Plates</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('index')}
                className={`inline-flex min-h-[44px] items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'index'
                    ? 'bg-[#141513] text-[#F8F7F2]'
                    : 'border border-[#141513]/25 text-[#141513] hover:bg-[#141513]/5'
                }`}
              >
                <List size={14} />
                <span>Technical Index</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      {viewMode === 'editorial' ? (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1440px] space-y-24 px-6 lg:px-12">
            {PROJECTS.map((project, index) => {
              const reverse = index % 2 === 1;
              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 gap-10 border-b border-[#141513]/15 pb-20 lg:grid-cols-12 lg:items-center"
                >
                  <div
                    onClick={() => onSelectProject(project.id)}
                    data-cursor-label="Open"
                    className={`group cursor-pointer overflow-hidden lg:col-span-7 ${
                      reverse ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <ArchImage
                      src={project.heroImage}
                      alt={project.title}
                      aspectRatio={index % 3 === 0 ? '16/10' : '4/3'}
                      placeholderTone="light"
                      imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  <div
                    className={`lg:col-span-5 ${
                      reverse ? 'lg:order-1 lg:pr-8' : 'lg:order-2 lg:pl-8'
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-5xl font-extrabold text-[#777C68]/50 tabular-nums">
                        {project.indexNumber}
                      </span>
                      <span className="text-xs font-medium tracking-[0.14em] uppercase text-[#5E5F5A] tabular-nums">
                        {project.year} · {project.areaSqm} m²
                      </span>
                    </div>

                    <p className="mt-6 text-xs font-semibold tracking-[0.14em] uppercase text-[#777C68]">
                      {project.style} · {project.buildingType}
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#141513]">
                      {project.title}
                    </h2>
                    <p className="mt-4 font-editorial text-xl leading-relaxed text-[#2D2E2B]">
                      {project.subtitle}. {project.summary}
                    </p>

                    <div className="mt-6 border-t border-[#141513]/15 pt-4 text-xs text-[#5E5F5A]">
                      <span>{project.architect} ({project.studio})</span>
                      <span className="mx-2">·</span>
                      <span>{project.location}, {project.country}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectProject(project.id)}
                      className="mt-7 inline-flex min-h-[44px] items-center gap-2 bg-[#141513] px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#F8F7F2] hover:bg-[#777C68] transition-colors duration-200 cursor-pointer"
                    >
                      <span>View Project Story</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="bg-[#F8F7F2] py-16 lg:py-24">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            {/* Mobile / Small Tablet Stacked Technical List */}
            <div className="divide-y divide-[#141513]/15 border-t border-b border-[#141513]/15 md:hidden">
              {PROJECTS.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onSelectProject(project.id)}
                  className="w-full py-5 text-left cursor-pointer"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-sm font-bold text-[#777C68] tabular-nums">
                      {project.indexNumber} · {project.year}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#141513]">
                      {project.style}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-[#141513]">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#5E5F5A] tabular-nums">
                    {project.architect} · {project.location}, {project.country} ·{' '}
                    {project.areaSqm.toLocaleString()} m² ·{' '}
                    {project.cantileverMeters.toFixed(1)} m cantilever
                  </p>
                </button>
              ))}
            </div>

            {/* Desktop Tabular Technical Index */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#141513] text-xs font-semibold tracking-[0.15em] uppercase text-[#5E5F5A]">
                    <th className="py-4 pr-4">No.</th>
                    <th className="py-4 pr-6">Structure</th>
                    <th className="py-4 pr-6">Discipline</th>
                    <th className="py-4 pr-6">Architect / Studio</th>
                    <th className="py-4 pr-6">Location</th>
                    <th className="py-4 pr-6 text-right">Area</th>
                    <th className="py-4 pr-6 text-right">Cantilever</th>
                    <th className="py-4 text-right">Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141513]/12 text-sm">
                  {PROJECTS.map((project) => (
                    <tr
                      key={project.id}
                      onClick={() => onSelectProject(project.id)}
                      className="group cursor-pointer transition-colors hover:bg-[#E8E5DC]/70"
                    >
                      <td className="py-5 pr-4 font-display font-bold text-[#777C68] tabular-nums">
                        {project.indexNumber}
                      </td>
                      <td className="py-5 pr-6 font-display font-bold text-[#141513] group-hover:text-[#777C68]">
                        {project.title}
                      </td>
                      <td className="py-5 pr-6 text-[#4A4B47]">
                        {project.style}
                      </td>
                      <td className="py-5 pr-6 text-[#4A4B47]">
                        {project.architect}
                      </td>
                      <td className="py-5 pr-6 text-[#4A4B47]">
                        {project.location}, {project.country}
                      </td>
                      <td className="py-5 pr-6 text-right tabular-nums text-[#141513]">
                        {project.areaSqm.toLocaleString()} m²
                      </td>
                      <td className="py-5 pr-6 text-right tabular-nums text-[#141513]">
                        {project.cantileverMeters.toFixed(1)} m
                      </td>
                      <td className="py-5 text-right tabular-nums font-medium text-[#141513]">
                        {project.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-[#141513]/15 pt-10 sm:flex-row sm:items-center">
              <p className="font-editorial text-xl italic text-[#4A4B47]">
                Want to test structural cantilevers and material palettes in real time?
              </p>
              <button
                type="button"
                onClick={() => onNavigate('design-lab')}
                className="bg-[#141513] px-6 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#F8F7F2] hover:bg-[#777C68] transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                Open Design Lab
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
