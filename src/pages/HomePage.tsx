import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import {
  HERO_IMAGE,
  GALLERY_INTERIOR_IMAGE,
  BLUEPRINT_DRAWING_IMAGE,
  PROJECTS,
  MANIFESTO_STATEMENTS,
  PageRoute,
} from '../data/projects';
import { ArchImage } from '../components/ArchImage';
import { BlueprintToReality } from '../components/BlueprintToReality';
import { InfiniteDimensionGallery } from '../components/InfiniteDimensionGallery';

gsap.registerPlugin(ScrollTrigger);

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectProject: (projectId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProject,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroScrollLayerRef = useRef<HTMLDivElement>(null);
  const heroPointerLayerRef = useRef<HTMLDivElement>(null);

  const featuredProjects = PROJECTS.slice(0, 4);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Clean Masked Hero Headline Line Reveal
      gsap.fromTo(
        '.hero-line-inner',
        { yPercent: 108 },
        {
          yPercent: 0,
          duration: 1.05,
          stagger: 0.14,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );

      gsap.fromTo(
        '.hero-fade',
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          delay: 0.25,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );

      gsap.fromTo(
        '.hero-mask-reveal',
        { clipPath: 'inset(4% 3% 4% 3%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.35,
          ease: 'power3.out',
          clearProps: 'clipPath',
        }
      );

      // 2. Scroll Parallax ONLY on heroScrollLayerRef
      if (heroScrollLayerRef.current) {
        gsap.fromTo(
          heroScrollLayerRef.current,
          { yPercent: 0 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-section',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      // 3. Subtle Image Mask Reveals & Inner Parallax
      gsap.utils.toArray<HTMLElement>('.plate-reveal').forEach((plate) => {
        gsap.fromTo(
          plate,
          { clipPath: 'inset(0 0 12% 0)', opacity: 0.72 },
          {
            clipPath: 'inset(0 0 0% 0)',
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            clearProps: 'clipPath,opacity',
            scrollTrigger: {
              trigger: plate,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.plate-parallax').forEach((imgWrap) => {
        gsap.fromTo(
          imgWrap,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: imgWrap.parentElement || imgWrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      // 4. Manifesto Scroll Reveals
      gsap.utils.toArray<HTMLElement>('.manifesto-row').forEach((row) => {
        gsap.fromTo(
          row,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    }, containerRef);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => ctx.revert();
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024 || !heroPointerLayerRef.current) return;
    const xOffset = (e.clientX / window.innerWidth - 0.5) * -14;
    const yOffset = (e.clientY / window.innerHeight - 0.5) * -10;
    gsap.to(heroPointerLayerRef.current, {
      x: xOffset,
      y: yOffset,
      duration: 0.9,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleHeroMouseLeave = () => {
    if (!heroPointerLayerRef.current) return;
    gsap.to(heroPointerLayerRef.current, {
      x: 0,
      y: 0,
      duration: 1.0,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  return (
    <div ref={containerRef} className="w-full overflow-x-clip">
      {/* 1. OPENING SCREEN — FULL-SCREEN CINEMATIC HERO */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="hero-section relative flex min-h-screen w-full flex-col justify-end overflow-hidden bg-[#141513] text-[#F8F7F2]"
      >
        <div className="hero-mask-reveal pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div ref={heroScrollLayerRef} className="h-full w-full">
            <div
              ref={heroPointerLayerRef}
              className="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)]"
            >
              <ArchImage
                src={HERO_IMAGE}
                alt="Monolith Fjord Pavilion cantilevered over dark water at dusk"
                className="h-full w-full"
                imgClassName="h-full w-full object-cover object-center"
                priority
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#141513] via-[#141513]/45 to-[#141513]/30" />
        </div>

        {/* Subtle Architectural Grid Hairlines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] mx-auto hidden max-w-[1440px] px-12 lg:grid lg:grid-cols-12"
        >
          <div className="col-span-4 border-l border-[#F8F7F2]/8" />
          <div className="col-span-5 border-l border-[#F8F7F2]/8" />
          <div className="col-span-3 border-l border-r border-[#F8F7F2]/8" />
        </div>

        {/* Foreground Editorial Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pt-28 pb-10 lg:px-12 lg:pb-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-9">
              <p className="hero-fade text-xs font-medium tracking-[0.2em] uppercase text-[#E8E5DC]/90">
                Exhibition 01 · Hardangerfjord, Norway · 60.412° N
              </p>

              <h1 className="mt-5 font-display text-[clamp(2.25rem,5.2vw,5.15rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-[#F8F7F2]">
                <span className="block overflow-hidden">
                  <span className="hero-line-inner block">
                    ARCHITECTURE IS NOT
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span className="hero-line-inner block">
                    WHAT WE BUILD.
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span className="hero-line-inner block text-[#E8E5DC]">
                    IT&apos;S WHAT WE IMAGINE.
                  </span>
                </span>
              </h1>

              <p className="hero-fade mt-6 max-w-xl font-editorial text-xl italic leading-relaxed text-[#E8E5DC] lg:text-2xl">
                Explore the boundaries between architecture, technology, and imagination.
              </p>
            </div>

            <div className="hero-fade flex flex-col items-start gap-6 lg:col-span-3 lg:items-end">
              <div className="text-left lg:text-right">
                <p className="text-xs tracking-[0.16em] uppercase text-[#A7A69F]">
                  Featured Structure
                </p>
                <button
                  type="button"
                  onClick={() => onSelectProject('monolith-pavilion')}
                  className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#F8F7F2] hover:text-[#E8E5DC] transition-colors duration-200 cursor-pointer"
                >
                  <span>Monolith Fjord Pavilion</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('discover')}
                  className="border border-[#F8F7F2]/40 bg-[#141513]/70 px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#F8F7F2] hover:bg-[#F8F7F2] hover:text-[#141513] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                >
                  Enter Exhibition
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('design-lab')}
                  className="bg-[#777C68] px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#F8F7F2] hover:bg-[#8B917A] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                >
                  Open 3D Lab
                </button>
              </div>
            </div>
          </div>

          <div className="hero-fade mt-10 flex items-center justify-between border-t border-[#F8F7F2]/15 pt-5 text-xs text-[#A7A69F]">
            <div className="flex items-center gap-3">
              <span className="h-4 w-px bg-[#E8E5DC]/60" aria-hidden="true" />
              <span className="tracking-[0.16em] uppercase">
                Scroll to enter exhibition
              </span>
            </div>
            <span className="tabular-nums">
              08 Works · 06 Disciplines · 3D Lab
            </span>
          </div>
        </div>
      </section>

      {/* 2. FEATURED ARCHITECTURE — ASYMMETRICAL EDITORIAL SHOWCASE */}
      <section className="bg-[#E8E5DC] text-[#141513] py-24 lg:py-36">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-6 border-b border-[#141513]/15 pb-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
                Selected Plates · Chapter 01
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,3.8vw,3.75rem)] font-bold leading-[1.0] tracking-[-0.025em] [text-wrap:balance]">
                Asymmetrical Studies in Mass &amp; Horizon
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <p className="font-editorial text-xl italic text-[#3F403C]">
                Four flagship structures presented across varied proportions, overlapping typographic bridges, and tactile contrast.
              </p>
            </div>
          </div>

          {/* Plate 01 — Dominant Frame with Intentional Editorial Typography Overlap */}
          <article className="relative mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div
              className="plate-reveal group relative overflow-hidden lg:col-span-8 cursor-pointer"
              data-cursor-label="View Study"
              onClick={() => onSelectProject(featuredProjects[0].id)}
            >
              <div className="plate-parallax scale-[1.06]">
                <ArchImage
                  src={featuredProjects[0].heroImage}
                  alt={featuredProjects[0].title}
                  aspectRatio="16/9"
                  placeholderTone="light"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#141513]/85 via-[#141513]/35 to-transparent px-6 pt-12 pb-5 text-xs text-[#E8E5DC] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="tabular-nums">
                  {featuredProjects[0].coordinates}
                </span>
                <span className="tabular-nums uppercase tracking-wider">
                  {featuredProjects[0].cantileverMeters}m Cantilever · {featuredProjects[0].areaSqm} m²
                </span>
              </div>
            </div>

            {/* Overlapping Warm Stone Editorial Block */}
            <div className="relative z-10 bg-[#E8E5DC] p-6 sm:p-8 lg:col-span-4 lg:p-8 lg:border lg:border-[#141513]/15 lg:shadow-xl">
              <div className="flex items-baseline justify-between border-b border-[#141513]/15 pb-4">
                <span className="font-display text-6xl font-extrabold leading-none tracking-tighter text-[#777C68] tabular-nums lg:text-7xl">
                  {featuredProjects[0].indexNumber}
                </span>
                <span className="text-xs font-medium tabular-nums text-[#5E5F5A]">
                  {featuredProjects[0].year} · Norway
                </span>
              </div>
              <p className="mt-5 text-xs font-medium tracking-[0.14em] uppercase text-[#5E5F5A]">
                {featuredProjects[0].style} · {featuredProjects[0].location}
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#141513]">
                {featuredProjects[0].title}
              </h3>
              <p className="mt-4 font-editorial text-xl leading-relaxed text-[#2C2D2A]">
                {featuredProjects[0].summary}
              </p>
              <button
                type="button"
                onClick={() => onSelectProject(featuredProjects[0].id)}
                className="mt-7 inline-flex items-center gap-2 border-b border-[#141513] pb-1.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#141513] hover:text-[#777C68] hover:border-[#777C68] transition-colors duration-200 cursor-pointer"
              >
                <span>Open Monograph</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </article>

          {/* Plate 02 & 03 — Staggered Vertical & Panoramic Cadence */}
          <div className="mt-28 grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">
            <article className="lg:col-span-5">
              <div
                className="plate-reveal group relative cursor-pointer overflow-hidden"
                data-cursor-label="Inspect"
                onClick={() => onSelectProject(featuredProjects[1].id)}
              >
                <div className="plate-parallax scale-[1.06]">
                  <ArchImage
                    src={featuredProjects[1].heroImage}
                    alt={featuredProjects[1].title}
                    aspectRatio="3/4"
                    placeholderTone="light"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#141513]/85 to-transparent px-5 pt-10 pb-4 text-xs text-[#E8E5DC] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="tabular-nums">{featuredProjects[1].coordinates}</span>
                  <span className="tabular-nums">{featuredProjects[1].areaSqm} m²</span>
                </div>
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-[#141513]/15 pt-5">
                <span className="font-display text-4xl font-extrabold text-[#777C68]/65 tabular-nums">
                  {featuredProjects[1].indexNumber}
                </span>
                <span className="text-xs tracking-[0.14em] uppercase text-[#5E5F5A] tabular-nums">
                  {featuredProjects[1].location} · {featuredProjects[1].year}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
                {featuredProjects[1].title}
              </h3>
              <p className="mt-3 font-editorial text-lg leading-relaxed text-[#2C2D2A]">
                {featuredProjects[1].summary}
              </p>
              <button
                type="button"
                onClick={() => onSelectProject(featuredProjects[1].id)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-[#141513] hover:text-[#777C68] transition-colors cursor-pointer"
              >
                <span>Read Visual Story</span>
                <ArrowUpRight size={14} />
              </button>
            </article>

            <article className="lg:col-span-7 lg:mt-20">
              <p className="mb-12 border-t border-b border-[#141513]/15 py-6 font-editorial text-2xl italic leading-snug text-[#272824]">
                &ldquo;We do not decorate structure; we calibrate mass until shadow itself feels inhabited.&rdquo;
              </p>

              <div className="mb-5 flex items-baseline justify-between">
                <div>
                  <span className="text-xs tracking-[0.14em] uppercase text-[#5E5F5A]">
                    {featuredProjects[2].style} · {featuredProjects[2].location}
                  </span>
                  <h3 className="mt-1 font-display text-3xl font-bold tracking-tight">
                    {featuredProjects[2].title}
                  </h3>
                </div>
                <span className="font-display text-5xl font-extrabold text-[#777C68]/50 tabular-nums">
                  {featuredProjects[2].indexNumber}
                </span>
              </div>

              <div
                className="plate-reveal group relative cursor-pointer overflow-hidden"
                data-cursor-label="View Plate"
                onClick={() => onSelectProject(featuredProjects[2].id)}
              >
                <div className="plate-parallax scale-[1.06]">
                  <ArchImage
                    src={featuredProjects[2].heroImage}
                    alt={featuredProjects[2].title}
                    aspectRatio="16/9"
                    placeholderTone="light"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#141513]/85 to-transparent px-5 pt-10 pb-4 text-xs text-[#E8E5DC] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="tabular-nums">{featuredProjects[2].coordinates}</span>
                  <span className="tabular-nums">{featuredProjects[2].areaSqm.toLocaleString()} m²</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-end">
                <p className="font-editorial text-xl leading-relaxed text-[#2C2D2A] sm:col-span-8">
                  {featuredProjects[2].summary}
                </p>
                <div className="sm:col-span-4 sm:text-right">
                  <button
                    type="button"
                    onClick={() => onSelectProject(featuredProjects[2].id)}
                    className="inline-flex items-center gap-2 border border-[#141513] px-4 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#141513] hover:bg-[#141513] hover:text-[#F8F7F2] transition-colors duration-200 cursor-pointer"
                  >
                    <span>Explore Case</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Plate 04 — High-Contrast Obsidian Inset Spread */}
          <article className="mt-28 bg-[#141513] text-[#F8F7F2] p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="order-2 lg:order-1 lg:col-span-5">
                <span className="font-display text-6xl font-extrabold text-[#777C68] tabular-nums">
                  {featuredProjects[3].indexNumber}
                </span>
                <p className="mt-4 text-xs tracking-[0.14em] uppercase text-[#A7A69F]">
                  {featuredProjects[3].style} · {featuredProjects[3].location}, {featuredProjects[3].country}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8F7F2]">
                  {featuredProjects[3].title}
                </h3>
                <p className="mt-4 font-editorial text-xl leading-relaxed text-[#E8E5DC]">
                  {featuredProjects[3].summary}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs tabular-nums text-[#A7A69F]">
                  <span>{featuredProjects[3].areaSqm} m²</span>
                  <span>·</span>
                  <span>{featuredProjects[3].architect}</span>
                  <span>·</span>
                  <span>{featuredProjects[3].year}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectProject(featuredProjects[3].id)}
                  className="mt-7 inline-flex items-center gap-2 bg-[#F8F7F2] px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#141513] hover:bg-[#E8E5DC] transition-colors duration-200 cursor-pointer"
                >
                  <span>Inspect Structure</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>

              <div
                className="plate-reveal group order-1 cursor-pointer overflow-hidden lg:order-2 lg:col-span-7"
                data-cursor-label="Open"
                onClick={() => onSelectProject(featuredProjects[3].id)}
              >
                <div className="plate-parallax scale-[1.06]">
                  <ArchImage
                    src={featuredProjects[3].heroImage}
                    alt={featuredProjects[3].title}
                    aspectRatio="4/3"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* 3. SIGNATURE EXPERIENCE 01: BLUEPRINT TO REALITY */}
      <section className="bg-[#F8F7F2] text-[#141513] border-t border-[#141513]/10 py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end mb-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
                Blueprint to Reality · Chapter 02
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,3.6vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.025em] [text-wrap:balance]">
                From 1:100 Section Linework to Post-Tensioned Mass
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="font-editorial text-xl italic leading-relaxed text-[#464743]">
                Drag across the structural datum below to trace how calibrated drafting geometry materializes into cantilevered board-formed concrete.
              </p>
            </div>
          </div>

          <BlueprintToReality
            drawingImage={BLUEPRINT_DRAWING_IMAGE}
            realityImage={HERO_IMAGE}
            projectTitle="Monolith Fjord Pavilion"
            coordinates="60.412° N · 6.458° E"
            cantileverMeters={22.5}
            theme="light"
          />
        </div>
      </section>

      {/* 4. ARCHITECTURAL MANIFESTO — IMMERSIVE DARK OBSIDIAN SECTION */}
      <section className="bg-[#141513] text-[#F8F7F2] border-t border-[#F8F7F2]/10 py-24 lg:py-36">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="border-b border-[#F8F7F2]/15 pb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#777C68]">
              Architectural Manifesto · Chapter 03
            </p>
            <h2 className="mt-5 max-w-5xl font-display text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] [text-wrap:balance]">
              Space begins where structural certainty meets atmospheric silence.
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="plate-reveal overflow-hidden">
                <ArchImage
                  src={GALLERY_INTERIOR_IMAGE}
                  alt="Minimalist brutalist gallery interior illuminated by clerestory daylight"
                  aspectRatio="4/3"
                />
              </div>
              <p className="mt-3 font-editorial text-sm italic text-[#A7A69F]">
                Fig. 01 — Clerestory daylight grazing cast concrete plinths.
              </p>

              <div className="mt-10 ml-auto w-4/5 overflow-hidden border border-[#F8F7F2]/12">
                <ArchImage
                  src={PROJECTS[6].heroImage}
                  alt="Helical cast concrete staircase beneath circular skylight"
                  aspectRatio="16/10"
                />
              </div>
              <p className="mt-3 text-right font-editorial text-sm italic text-[#A7A69F]">
                Fig. 02 — Zenithal oculus stair, São Paulo.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-12 lg:col-span-7 lg:pl-12">
              {MANIFESTO_STATEMENTS.map((item) => (
                <div
                  key={item.index}
                  className="manifesto-row group border-t border-[#F8F7F2]/15 pt-8 transition-colors duration-300 hover:border-[#777C68]"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-display text-sm font-bold tracking-[0.15em] text-[#777C68] tabular-nums">
                      {item.index}.
                    </span>
                    <div>
                      <h3 className="font-editorial text-3xl italic leading-snug text-[#F8F7F2] lg:text-4xl">
                        {item.heading}
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-[#A7A69F]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. INFINITE DIMENSION — 3D ELLIPTICAL SPATIAL GALLERY */}
      <InfiniteDimensionGallery
        onSelectProject={onSelectProject}
        onNavigate={onNavigate}
      />

      {/* 6. CLOSING FULL-WIDTH ARCHITECTURAL STATEMENT */}
      <section className="relative flex min-h-[78vh] w-full items-end overflow-hidden bg-[#141513] text-[#F8F7F2]">
        <div className="absolute inset-0 z-0">
          <ArchImage
            src={PROJECTS[7].heroImage}
            alt="Cloud Ridge Residence suspended above tropical forest mist"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141513] via-[#141513]/55 to-[#141513]/25" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-20 lg:px-12 lg:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#E8E5DC]">
                Spatial Experimentation
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4.4vw,4.25rem)] font-extrabold leading-[1.0] tracking-[-0.03em] [text-wrap:balance]">
                Shape concrete, charred timber, and daylight inside the ARCHVERSE Design Lab.
              </h2>
            </div>

            <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
              <button
                type="button"
                onClick={() => onNavigate('design-lab')}
                className="bg-[#F8F7F2] px-6 py-4 text-xs font-bold tracking-[0.15em] uppercase text-[#141513] hover:bg-[#E8E5DC] transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                Launch Design Lab
              </button>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="border border-[#F8F7F2]/40 px-6 py-4 text-xs font-bold tracking-[0.15em] uppercase text-[#F8F7F2] hover:bg-[#F8F7F2] hover:text-[#141513] transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                View Index
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
