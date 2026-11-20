import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';
import {
  DesignLabPreset,
  PageRoute,
  PROJECTS,
  ProjectItem,
} from '../data/projects';
import { ArchImage } from '../components/ArchImage';
import { BlueprintToReality } from '../components/BlueprintToReality';

gsap.registerPlugin(ScrollTrigger);

interface ProjectDetailsPageProps {
  project: ProjectItem;
  onSelectProject: (projectId: string) => void;
  onNavigate: (page: PageRoute) => void;
  onOpenDesignLab: (preset?: DesignLabPreset) => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({
  project,
  onSelectProject,
  onNavigate,
  onOpenDesignLab,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroParallaxRef = useRef<HTMLDivElement>(null);

  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeMaterialIdx, setActiveMaterialIdx] = useState<number>(0);

  const spatialViews = useMemo(
    () => [
      {
        id: 'exterior',
        label: '01. Exterior Posture',
        src: project.heroImage,
        focusNote: `${project.cantileverMeters.toFixed(1)}m structural overhang calibrated against ${project.location} terrain.`,
        caption: `Fig. 01 — Primary elevation and structural posture (${project.title}).`,
      },
      {
        id: 'interior',
        label: '02. Interior Atmosphere',
        src: project.interiorImage,
        focusNote: `Calibrated daylight apertures illuminate raw ${project.materials[0]?.name.toLowerCase() || 'concrete'} planes.`,
        caption: `Fig. 02 — Interior daylight study and monolithic spatial threshold.`,
      },
      {
        id: 'context',
        label: '03. Spatial Context',
        src: project.secondaryImage,
        focusNote: `${project.areaSqm.toLocaleString()} m² programmatic envelope sited at ${project.coordinates}.`,
        caption: `Fig. 03 — Spatial dialogue between structural overhang and landscape.`,
      },
    ],
    [project]
  );

  const gallerySlides = useMemo(
    () => [
      ...spatialViews.map((v, i) => ({
        src: v.src,
        label: `Plate 0${i + 1}`,
        caption: v.caption,
      })),
      {
        src: project.drawingImage,
        label: 'Plate 04 · Section',
        caption: `Section A-A & South Elevation — Scale 1:100 (${project.title}).`,
      },
    ],
    [spatialViews, project.drawingImage, project.title]
  );

  const relatedProjects = PROJECTS.filter((p) =>
    project.relatedIds.includes(p.id)
  );

  const currentIdx = PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject =
    PROJECTS[(currentIdx - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIdx + 1) % PROJECTS.length];

  useEffect(() => {
    setActiveStageIdx(0);
    setActiveMaterialIdx(0);
    setLightboxIndex(null);
  }, [project.id]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.detail-title-line',
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 0.95,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );

      if (heroParallaxRef.current) {
        gsap.fromTo(
          heroParallaxRef.current,
          { yPercent: 0 },
          {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: '.detail-hero-section',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>('.detail-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [project.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % gallerySlides.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + gallerySlides.length) % gallerySlides.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, gallerySlides.length]);

  const activeMaterial =
    project.materials[activeMaterialIdx] || project.materials[0];
  const activeStage = spatialViews[activeStageIdx] || spatialViews[0];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8F7F2] text-[#141513]">
      {/* 1. FULL-SCREEN ARCHITECTURAL INTRODUCTION */}
      <section className="detail-hero-section relative flex min-h-[88vh] w-full flex-col justify-end overflow-hidden bg-[#141513] text-[#F8F7F2]">
        <div
          ref={heroParallaxRef}
          className="pointer-events-none absolute -inset-4 z-0"
        >
          <ArchImage
            src={project.heroImage}
            alt={project.title}
            className="h-full w-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141513] via-[#141513]/45 to-[#141513]/30" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pt-28 pb-14 lg:px-12 lg:pb-20">
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-[#E8E5DC] hover:text-[#F8F7F2] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Monograph Index</span>
          </button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#E8E5DC]/90 tabular-nums">
                Plate {project.indexNumber} · {project.style} · {project.year}
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,5.2vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em] overflow-hidden">
                <span className="detail-title-line block">{project.title}</span>
              </h1>
              <p className="mt-5 max-w-2xl font-editorial text-2xl italic leading-relaxed text-[#E8E5DC]">
                {project.subtitle}
              </p>
            </div>

            <div className="border-t border-[#F8F7F2]/20 pt-5 text-sm lg:col-span-4 lg:border-t-0 lg:border-l lg:pl-8">
              <div className="space-y-3 text-[#E8E5DC]">
                <div>
                  <span className="text-xs uppercase tracking-[0.14em] text-[#A7A69F] block">
                    Location
                  </span>
                  <span>
                    {project.location}, {project.country} ({project.coordinates})
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-[0.14em] text-[#A7A69F] block">
                    Architect &amp; Studio
                  </span>
                  <span>
                    {project.architect} · {project.studio}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL ESSAY + STRUCTURAL ACCESSION MARGIN RAIL */}
      <section className="bg-[#F8F7F2] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="detail-reveal lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
                Spatial Narrative
              </p>
              <div className="mt-6 space-y-6 text-base leading-[1.85] text-[#272824] max-w-[68ch]">
                {project.editorialEssay.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-editorial first-letter:text-6xl first-letter:font-medium first-letter:leading-none first-letter:text-[#141513]'
                        : ''
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <aside className="detail-reveal lg:col-span-5">
              <div className="border-t border-[#141513] pt-6">
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#141513]">
                  Technical Specifications
                </h2>
                <dl className="mt-6 divide-y divide-[#141513]/12 border-b border-[#141513]/12">
                  <div className="flex justify-between py-3.5 text-sm">
                    <dt className="text-[#5E5F5A]">Typology</dt>
                    <dd className="font-medium text-[#141513]">
                      {project.buildingType}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3.5 text-sm">
                    <dt className="text-[#5E5F5A]">Completion Year</dt>
                    <dd className="font-medium tabular-nums text-[#141513]">
                      {project.year}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3.5 text-sm">
                    <dt className="text-[#5E5F5A]">Architect</dt>
                    <dd className="font-medium text-[#141513]">
                      {project.architect}
                    </dd>
                  </div>
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="flex justify-between py-3.5 text-sm"
                    >
                      <dt className="text-[#5E5F5A]">{metric.label}</dt>
                      <dd className="font-semibold tabular-nums text-[#141513]">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE EXPERIENCE 02: INTERACTIVE SPATIAL THRESHOLD EXPLORER */}
      <section className="bg-[#141513] text-[#F8F7F2] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex flex-col gap-6 border-b border-[#F8F7F2]/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
                Spatial Project Exploration
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight lg:text-4xl">
                Exterior, Interior &amp; Threshold Transitions
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {spatialViews.map((view, idx) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveStageIdx(idx)}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                    activeStageIdx === idx
                      ? 'bg-[#F8F7F2] text-[#141513]'
                      : 'border border-[#F8F7F2]/25 text-[#E8E5DC] hover:border-[#F8F7F2]/60'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-9">
              <button
                type="button"
                onClick={() => setLightboxIndex(activeStageIdx)}
                data-cursor-label="Zoom"
                className="group relative block w-full overflow-hidden text-left cursor-pointer"
              >
                <ArchImage
                  key={activeStage.src}
                  src={activeStage.src}
                  alt={activeStage.caption}
                  aspectRatio="16/9"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <span className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center bg-[#141513]/85 text-[#F8F7F2] border border-[#F8F7F2]/20">
                  <Maximize2 size={15} />
                </span>
              </button>
            </div>

            <div className="flex flex-col justify-between gap-8 lg:col-span-3 lg:pl-4">
              <div>
                <span className="text-xs font-semibold tracking-[0.16em] uppercase text-[#777C68] tabular-nums">
                  View 0{activeStageIdx + 1} / 03
                </span>
                <h3 className="mt-2 font-display text-2xl font-bold text-[#F8F7F2]">
                  {activeStage.label.replace(/^\d+\.\s*/, '')}
                </h3>
                <p className="mt-3 font-editorial text-xl italic leading-relaxed text-[#E8E5DC]">
                  {activeStage.focusNote}
                </p>
              </div>

              <div className="border-t border-[#F8F7F2]/15 pt-5">
                <blockquote className="font-editorial text-lg italic text-[#A7A69F]">
                  &ldquo;{project.philosophy}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLUEPRINT TO REALITY + MATERIAL ASSEMBLY */}
      <section className="bg-[#F8F7F2] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">
            {/* Blueprint to Reality Scrubber */}
            <div className="detail-reveal lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
                Blueprint to Reality
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
                Section Drawing &amp; Built Elevation
              </h2>
              <div className="mt-6">
                <BlueprintToReality
                  drawingImage={project.drawingImage}
                  realityImage={project.heroImage}
                  projectTitle={project.title}
                  coordinates={project.coordinates}
                  cantileverMeters={project.cantileverMeters}
                  theme="light"
                  compact
                />
              </div>
            </div>

            {/* Interactive Material Assembly Breakdown */}
            <div className="detail-reveal lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
                Tectonic Palette
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
                Material Close-Ups &amp; Assembly
              </h2>

              <div className="mt-8 divide-y divide-[#141513]/15 border-t border-b border-[#141513]/15">
                {project.materials.map((mat, idx) => {
                  const isActive = idx === activeMaterialIdx;
                  return (
                    <button
                      key={mat.name}
                      type="button"
                      onClick={() => setActiveMaterialIdx(idx)}
                      className={`w-full py-5 text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#E8E5DC]/75 px-4 -mx-4'
                          : 'hover:bg-[#E8E5DC]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {/* Tactile Swatch Square */}
                          <span
                            className="relative h-10 w-10 shrink-0 border border-[#141513]/25 overflow-hidden"
                            style={{ backgroundColor: mat.swatchHex }}
                            aria-hidden="true"
                          >
                            <span
                              className="absolute inset-0 opacity-25"
                              style={{
                                backgroundImage:
                                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 1px, transparent 1px, transparent 5px)',
                              }}
                            />
                          </span>
                          <div>
                            <h3 className="font-display text-lg font-bold text-[#141513]">
                              {mat.name}
                            </h3>
                            <p className="text-xs tracking-[0.1em] uppercase text-[#777C68]">
                              {mat.origin} · {mat.finish}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold tabular-nums text-[#5E5F5A]">
                          0{idx + 1}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-[#464743]">
                        Structural Role: {mat.role}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 border border-[#141513]/15 bg-[#E8E5DC] p-6">
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#777C68]">
                  Selected Sample · {activeMaterial.name}
                </p>
                <p className="mt-2 font-editorial text-lg italic text-[#141513]">
                  Inspect this material&apos;s surface relief and atmospheric lighting response inside the interactive 3D Design Lab.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenDesignLab(project.labPreset)}
                  className="mt-5 inline-flex items-center gap-2 bg-[#141513] px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#F8F7F2] hover:bg-[#777C68] transition-colors duration-200 cursor-pointer"
                >
                  <span>Load in 3D Design Lab</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RELATED PROJECTS + SEQUENTIAL MONOGRAPH FOOTER */}
      <section className="bg-[#E8E5DC] border-t border-[#141513]/15 py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex items-baseline justify-between border-b border-[#141513]/15 pb-6">
            <h2 className="font-display text-2xl font-bold tracking-tight uppercase">
              Related Works
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('discover')}
              className="text-xs font-semibold tracking-[0.14em] uppercase text-[#141513] hover:text-[#777C68] cursor-pointer"
            >
              Browse All
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {relatedProjects.map((rel) => (
              <article
                key={rel.id}
                onClick={() => onSelectProject(rel.id)}
                data-cursor-label="Read"
                className="group cursor-pointer"
              >
                <div className="overflow-hidden">
                  <ArchImage
                    src={rel.heroImage}
                    alt={rel.title}
                    aspectRatio="4/3"
                    placeholderTone="light"
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-bold tracking-tight text-[#141513] group-hover:text-[#777C68] transition-colors">
                    {rel.title}
                  </h3>
                  <span className="font-display text-sm font-bold text-[#777C68] tabular-nums">
                    {rel.indexNumber}
                  </span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#5E5F5A]">
                  {rel.style} · {rel.location}
                </p>
              </article>
            ))}
          </div>

          {/* Sequential Plate Navigation with Plate Previews */}
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-[#141513]/20 pt-10 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onSelectProject(prevProject.id)}
              className="group flex items-center gap-4 text-left cursor-pointer"
            >
              <div className="hidden h-16 w-24 shrink-0 overflow-hidden sm:block">
                <ArchImage
                  src={prevProject.heroImage}
                  alt={prevProject.title}
                  className="h-full w-full"
                  placeholderTone="light"
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <ArrowLeft
                size={18}
                className="shrink-0 text-[#5E5F5A] transition-transform duration-200 group-hover:-translate-x-1"
              />
              <div>
                <span className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[#777C68]">
                  Previous Plate ({prevProject.indexNumber})
                </span>
                <span className="font-display text-lg font-bold text-[#141513] group-hover:text-[#777C68] transition-colors">
                  {prevProject.title}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectProject(nextProject.id)}
              className="group flex items-center justify-end gap-4 text-right cursor-pointer"
            >
              <div>
                <span className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[#777C68]">
                  Next Plate ({nextProject.indexNumber})
                </span>
                <span className="font-display text-lg font-bold text-[#141513] group-hover:text-[#777C68] transition-colors">
                  {nextProject.title}
                </span>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 text-[#5E5F5A] transition-transform duration-200 group-hover:translate-x-1"
              />
              <div className="hidden h-16 w-24 shrink-0 overflow-hidden sm:block">
                <ArchImage
                  src={nextProject.heroImage}
                  alt={nextProject.title}
                  className="h-full w-full"
                  placeholderTone="light"
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* MULTI-PLATE LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#141513]/96 p-6 text-[#F8F7F2]"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="flex w-full max-w-6xl items-center justify-between pb-4">
            <span className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A7A69F] tabular-nums">
              0{lightboxIndex + 1} / 0{gallerySlides.length} ·{' '}
              {gallerySlides[lightboxIndex].label}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close fullscreen view"
              className="flex h-11 w-11 items-center justify-center border border-[#F8F7F2]/30 text-[#F8F7F2] hover:bg-[#F8F7F2] hover:text-[#141513] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="relative flex max-h-[75vh] w-full max-w-6xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + gallerySlides.length) %
                    gallerySlides.length
                )
              }
              aria-label="Previous plate"
              className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center border border-[#F8F7F2]/25 bg-[#141513]/80 text-[#F8F7F2] hover:bg-[#F8F7F2] hover:text-[#141513] transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>

            <img
              src={gallerySlides[lightboxIndex].src}
              alt={gallerySlides[lightboxIndex].caption}
              referrerPolicy="no-referrer"
              className="max-h-[74vh] w-full object-contain px-14"
            />

            <button
              type="button"
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % gallerySlides.length)
              }
              aria-label="Next plate"
              className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center border border-[#F8F7F2]/25 bg-[#141513]/80 text-[#F8F7F2] hover:bg-[#F8F7F2] hover:text-[#141513] transition-colors cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <p className="mt-4 max-w-2xl text-center font-editorial text-lg italic text-[#E8E5DC]">
            {gallerySlides[lightboxIndex].caption}
          </p>
        </div>
      )}
    </div>
  );
};
