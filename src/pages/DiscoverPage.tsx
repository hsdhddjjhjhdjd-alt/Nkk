import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import {
  ARCHITECTURAL_STYLES,
  ArchitecturalStyle,
  BUILDING_TYPES,
  BuildingType,
  CURATED_COLLECTIONS,
  GEOGRAPHIC_REGIONS,
  GeographicRegion,
  PROJECTS,
} from '../data/projects';
import { ArchImage } from '../components/ArchImage';

interface DiscoverPageProps {
  onSelectProject: (projectId: string) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  onSelectProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ArchitecturalStyle | 'All'>('All');
  const [selectedType, setSelectedType] = useState<BuildingType | 'All'>('All');
  const [selectedRegion, setSelectedRegion] = useState<GeographicRegion | 'All'>('All');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      const matchesStyle =
        selectedStyle === 'All' || project.style === selectedStyle;
      const matchesType =
        selectedType === 'All' || project.buildingType === selectedType;
      const matchesRegion =
        selectedRegion === 'All' || project.region === selectedRegion;
      const matchesCollection =
        !selectedCollection || project.collectionId === selectedCollection;

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.location.toLowerCase().includes(q) ||
        project.country.toLowerCase().includes(q) ||
        project.architect.toLowerCase().includes(q) ||
        project.style.toLowerCase().includes(q) ||
        project.materials.some((m) => m.name.toLowerCase().includes(q));

      return (
        matchesStyle &&
        matchesType &&
        matchesRegion &&
        matchesCollection &&
        matchesQuery
      );
    });
  }, [
    searchQuery,
    selectedStyle,
    selectedType,
    selectedRegion,
    selectedCollection,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedStyle !== 'All' ||
    selectedType !== 'All' ||
    selectedRegion !== 'All' ||
    selectedCollection !== null;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStyle('All');
    setSelectedType('All');
    setSelectedRegion('All');
    setSelectedCollection(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#141513] pt-16">
      {/* 1. VISUAL INTRODUCTION */}
      <section className="bg-[#141513] text-[#F8F7F2] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A7A69F]">
                Architectural Exploration
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em] [text-wrap:balance]">
                Discover Spaces Across Material &amp; Climate.
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <p className="font-editorial text-2xl italic leading-relaxed text-[#E8E5DC]">
                Navigate brutalist shelters, parametric cultural vessels, and living timber structures indexed by discipline, typology, and geography.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTIONS */}
      <section className="bg-[#E8E5DC] border-b border-[#141513]/10 py-16">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight uppercase">
              Curated Collections
            </h2>
            <span className="text-xs tracking-[0.14em] uppercase text-[#5E5F5A]">
              Select a dossier to filter works
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {CURATED_COLLECTIONS.map((col) => {
              const isSelected = selectedCollection === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() =>
                    setSelectedCollection(isSelected ? null : col.id)
                  }
                  className={`group text-left transition-all duration-200 cursor-pointer border p-4 ${
                    isSelected
                      ? 'border-[#141513] bg-[#F8F7F2]'
                      : 'border-[#141513]/15 bg-transparent hover:border-[#141513]/50'
                  }`}
                >
                  <div className="overflow-hidden">
                    <ArchImage
                      src={col.coverImage}
                      alt={col.title}
                      aspectRatio="16/10"
                      imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-xs font-semibold tracking-[0.16em] uppercase text-[#777C68]">
                      {col.index}
                    </span>
                    <span className="text-xs font-medium text-[#141513]">
                      {isSelected ? 'Active Filter' : 'View Works'}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-[#141513]">
                    {col.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#464743]">
                    {col.curatorNote}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FUNCTIONAL SEARCH & MULTI-FACET FILTER BAR */}
      <section className="border-b border-[#141513]/12 bg-[#F8F7F2] py-10">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
            {/* Search Input */}
            <div className="lg:col-span-4">
              <label
                htmlFor="discover-search"
                className="block text-xs font-semibold tracking-[0.14em] uppercase text-[#5E5F5A]"
              >
                Search Archive
              </label>
              <div className="relative mt-2 flex items-center border-b border-[#141513]/35 focus-within:border-[#141513]">
                <Search size={16} className="text-[#5E5F5A] shrink-0" />
                <input
                  id="discover-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Title, architect, city, or material..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-[#141513] placeholder:text-[#A7A69F] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="p-1 text-[#5E5F5A] hover:text-[#141513] cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Building Type Select */}
            <div className="sm:col-span-6 lg:col-span-3">
              <label
                htmlFor="filter-type"
                className="block text-xs font-semibold tracking-[0.14em] uppercase text-[#5E5F5A]"
              >
                Building Type
              </label>
              <select
                id="filter-type"
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as BuildingType | 'All')
                }
                className="mt-2 w-full border-b border-[#141513]/35 bg-transparent py-2.5 text-sm font-medium text-[#141513] focus:border-[#141513] focus:outline-none cursor-pointer"
              >
                <option value="All">All Typologies</option>
                {BUILDING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="sm:col-span-6 lg:col-span-3">
              <label
                htmlFor="filter-region"
                className="block text-xs font-semibold tracking-[0.14em] uppercase text-[#5E5F5A]"
              >
                Location
              </label>
              <select
                id="filter-region"
                value={selectedRegion}
                onChange={(e) =>
                  setSelectedRegion(e.target.value as GeographicRegion | 'All')
                }
                className="mt-2 w-full border-b border-[#141513]/35 bg-transparent py-2.5 text-sm font-medium text-[#141513] focus:border-[#141513] focus:outline-none cursor-pointer"
              >
                <option value="All">All Regions</option>
                {GEOGRAPHIC_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Results & Reset */}
            <div className="flex items-center justify-between lg:col-span-2 lg:justify-end lg:gap-4">
              <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5E5F5A] tabular-nums">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Work' : 'Works'}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="border border-[#141513]/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#141513] hover:bg-[#141513] hover:text-[#F8F7F2] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Architectural Style Filter Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedStyle('All')}
              className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                selectedStyle === 'All'
                  ? 'bg-[#141513] text-[#F8F7F2]'
                  : 'bg-[#E8E5DC] text-[#141513] hover:bg-[#DCD8CC]'
              }`}
            >
              All Styles
            </button>
            {ARCHITECTURAL_STYLES.map((style) => {
              const active = selectedStyle === style;
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#777C68] text-[#F8F7F2]'
                      : 'bg-[#E8E5DC] text-[#141513] hover:bg-[#DCD8CC]'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EDITORIAL PROJECT GALLERY — VARIED PROPORTIONS */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          {filteredProjects.length === 0 ? (
            <div className="border border-[#141513]/15 bg-[#E8E5DC] p-12 text-center">
              <p className="font-display text-2xl font-bold text-[#141513]">
                No architectural works match your current criteria.
              </p>
              <p className="mt-2 font-editorial text-xl italic text-[#464743]">
                Adjust style, building typology, or search keywords to return to the exhibition catalogue.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 bg-[#141513] px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#F8F7F2] hover:bg-[#777C68] transition-colors cursor-pointer"
              >
                Show All Works
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-12">
              {filteredProjects.map((project, index) => {
                // Varied asymmetrical column spans and image proportions
                const pattern = index % 4;
                const colSpanClass =
                  pattern === 0
                    ? 'lg:col-span-7'
                    : pattern === 1
                      ? 'lg:col-span-5'
                      : pattern === 2
                        ? 'lg:col-span-5'
                        : 'lg:col-span-7';
                const aspect =
                  pattern === 0
                    ? '16/10'
                    : pattern === 1
                      ? '4/5'
                      : pattern === 2
                        ? '4/3'
                        : '16/9';

                return (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{
                      duration: 0.6,
                      delay: Math.min((index % 2) * 0.08, 0.16),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => onSelectProject(project.id)}
                    data-cursor-label="Inspect"
                    className={`group cursor-pointer ${colSpanClass}`}
                  >
                    <div className="overflow-hidden">
                      <ArchImage
                        src={project.heroImage}
                        alt={project.title}
                        aspectRatio={aspect}
                        placeholderTone="light"
                        imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-[#141513]/15 pb-3">
                      <div>
                        <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#777C68]">
                          {project.style} · {project.buildingType}
                        </p>
                        <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#141513] group-hover:text-[#777C68] transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      <span className="font-display text-2xl font-extrabold text-[#A7A69F] tabular-nums">
                        {project.indexNumber}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5E5F5A]">
                      <span>
                        {project.architect} · {project.location}, {project.country}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-[#141513] transition-transform duration-200 group-hover:translate-x-0.5">
                        Study <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
