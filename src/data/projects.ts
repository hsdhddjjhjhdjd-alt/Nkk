export type ArchitecturalStyle =
  | 'Brutalism'
  | 'Futurism'
  | 'Minimalism'
  | 'Organic Architecture'
  | 'Parametric Architecture'
  | 'Sustainable Architecture';

export type BuildingType =
  | 'Cultural Pavilion'
  | 'Private Residence'
  | 'Observatory'
  | 'Museum'
  | 'Gallery & Atrium';

export type GeographicRegion = 'Europe' | 'Asia' | 'Americas';

export type PageRoute =
  | 'home'
  | 'discover'
  | 'projects'
  | 'project-details'
  | 'design-lab'
  | 'about';

export interface MaterialSpec {
  name: string;
  origin: string;
  finish: string;
  role: string;
  swatchHex: string;
}

export interface DesignLabPreset {
  material: 'concrete' | 'cedar' | 'titanium' | 'limestone';
  colorId: 'obsidian' | 'stone' | 'concrete' | 'olive' | 'chalk';
  finish: 'matte' | 'satin' | 'anodized' | 'weathered';
  lighting: 'overcast' | 'golden' | 'twilight' | 'zenith';
}

export interface ProjectItem {
  id: string;
  indexNumber: string;
  title: string;
  subtitle: string;
  location: string;
  country: string;
  region: GeographicRegion;
  coordinates: string;
  architect: string;
  studio: string;
  year: number;
  style: ArchitecturalStyle;
  buildingType: BuildingType;
  areaSqm: number;
  cantileverMeters: number;
  heroImage: string;
  interiorImage: string;
  drawingImage: string;
  secondaryImage: string;
  featured: boolean;
  collectionId: string;
  labPreset: DesignLabPreset;
  philosophy: string;
  summary: string;
  editorialEssay: string[];
  materials: MaterialSpec[];
  metrics: {
    label: string;
    value: string;
  }[];
  relatedIds: string[];
}

export interface CuratedCollection {
  id: string;
  index: string;
  title: string;
  curatorNote: string;
  focusStyle: ArchitecturalStyle | 'All';
  coverImage: string;
}

export const HERO_IMAGE =
  '/src/assets/images/hero_monolith_pavilion_1794969694651.jpg';
export const GALLERY_INTERIOR_IMAGE =
  '/src/assets/images/interior_concrete_gallery_1794969697892.jpg';
export const BLUEPRINT_DRAWING_IMAGE =
  '/src/assets/images/blueprint_architectural_section_1794969698976.jpg';

export const ARCHITECTURAL_STYLES: ArchitecturalStyle[] = [
  'Brutalism',
  'Futurism',
  'Minimalism',
  'Organic Architecture',
  'Parametric Architecture',
  'Sustainable Architecture',
];

export const BUILDING_TYPES: BuildingType[] = [
  'Cultural Pavilion',
  'Private Residence',
  'Observatory',
  'Museum',
  'Gallery & Atrium',
];

export const GEOGRAPHIC_REGIONS: GeographicRegion[] = [
  'Europe',
  'Asia',
  'Americas',
];

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'cantilevered-monoliths',
    index: 'Collection 01',
    title: 'Cantilevered Monoliths',
    curatorNote:
      'Structures anchored into raw geological strata that project horizontally over water, forest ravines, and coastal cliffs.',
    focusStyle: 'Brutalism',
    coverImage: '/src/assets/images/hero_monolith_pavilion_1794969694651.jpg',
  },
  {
    id: 'living-timber-earth',
    index: 'Collection 02',
    title: 'Living Timber & Earth',
    curatorNote:
      'Regenerative assemblies where rammed earth, charred cedar, and bent cross-laminated timber respond to microclimate.',
    focusStyle: 'Organic Architecture',
    coverImage: '/src/assets/images/project_mycelium_canopy_1794969695482.jpg',
  },
  {
    id: 'zenithal-light-studies',
    index: 'Collection 03',
    title: 'Zenithal Light Studies',
    curatorNote:
      'Interiors calibrated as optical instruments, sculpting sunlight across cast concrete and honed limestone planes.',
    focusStyle: 'Minimalism',
    coverImage: '/src/assets/images/project_vortex_atrium_1794969697119.jpg',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'monolith-pavilion',
    indexNumber: '01',
    title: 'Monolith Fjord Pavilion',
    subtitle: 'Post-tensioned concrete vessel suspended over tidal basalt water',
    location: 'Hardangerfjord',
    country: 'Norway',
    region: 'Europe',
    coordinates: '60.412° N · 6.458° E',
    architect: 'Henrik Solberg',
    studio: 'Solberg & Nord',
    year: 2025,
    style: 'Brutalism',
    buildingType: 'Cultural Pavilion',
    areaSqm: 1480,
    cantileverMeters: 22.5,
    heroImage: '/src/assets/images/hero_monolith_pavilion_1794969694651.jpg',
    interiorImage:
      '/src/assets/images/interior_concrete_gallery_1794969697892.jpg',
    drawingImage:
      '/src/assets/images/blueprint_architectural_section_1794969698976.jpg',
    secondaryImage:
      '/src/assets/images/project_vortex_atrium_1794969697119.jpg',
    featured: true,
    collectionId: 'cantilevered-monoliths',
    labPreset: {
      material: 'concrete',
      colorId: 'concrete',
      finish: 'matte',
      lighting: 'twilight',
    },
    philosophy:
      'Mass does not oppose gravity; it negotiates a quiet suspension above still water.',
    summary:
      'Anchored into glacial gneiss along the Hardangerfjord, this 22.5-meter cantilevered pavilion slices twilight light through vertical apertures onto a black reflecting basin.',
    editorialEssay: [
      'Conceived as an acoustic and visual chamber for seasonal Nordic sound installations, the Monolith Fjord Pavilion rejects ornamental cladding in favor of raw structural truth. Cast in situ using local dark aggregate and Norwegian spruce formwork, the outer shell carries the tactile memory of timber grain across forty-meter uninterrupted spans.',
      'As visitors approach along the low basalt causeway, the building appears simultaneously grounded and weightless. A narrow reflecting pool mirrors the underside of the sloped soffit, doubling the vertical amber light slits carved along the western flank.',
      'Inside, a single continuous ramp descends toward the water horizon before opening into an unpartitioned concrete hall illuminated strictly by calibrated clerestory blades and low-kelvin floor grazers.',
    ],
    materials: [
      {
        name: 'Pigmented Basalt Concrete',
        origin: 'Bergen Quarry, Norway',
        finish: 'Rough spruce board-formed',
        role: 'Primary cantilevered hull & shear core',
        swatchHex: '#3A3B37',
      },
      {
        name: 'Brushed Bronze Brass',
        origin: 'Oslo Foundry',
        finish: 'Hand-oxidized satin patina',
        role: 'Vertical aperture reveals & threshold sills',
        swatchHex: '#8E6F4E',
      },
      {
        name: 'Honed Flamed Basalt',
        origin: 'Hardanger Ridge',
        finish: 'Thermal anti-slip',
        role: 'Reflecting pool perimeter & approach deck',
        swatchHex: '#1F201E',
      },
    ],
    metrics: [
      { label: 'Gross Floor Area', value: '1,480 m²' },
      { label: 'Primary Cantilever', value: '22.5 m' },
      { label: 'Formwork Module', value: '1,200 mm' },
      { label: 'Daylight Factor', value: '3.4%' },
    ],
    relatedIds: ['kuro-sanctuary', 'obsidian-observatory', 'vortex-atrium'],
  },
  {
    id: 'kuro-sanctuary',
    indexNumber: '02',
    title: 'Kuro Ravine Sanctuary',
    subtitle: 'Board-formed concrete residence overlooking cedar mist in Kyoto',
    location: 'Kyoto Prefecture',
    country: 'Japan',
    region: 'Asia',
    coordinates: '35.091° N · 135.824° E',
    architect: 'Kenji Takahashi',
    studio: 'Atelier Koku',
    year: 2024,
    style: 'Brutalism',
    buildingType: 'Private Residence',
    areaSqm: 410,
    cantileverMeters: 9.2,
    heroImage: '/src/assets/images/project_kuro_sanctuary_1794969695425.jpg',
    interiorImage:
      '/src/assets/images/interior_concrete_gallery_1794969697892.jpg',
    drawingImage:
      '/src/assets/images/blueprint_architectural_section_1794969698976.jpg',
    secondaryImage:
      '/src/assets/images/project_bamboo_horizon_1794969698300.jpg',
    featured: true,
    collectionId: 'cantilevered-monoliths',
    labPreset: {
      material: 'concrete',
      colorId: 'obsidian',
      finish: 'weathered',
      lighting: 'overcast',
    },
    philosophy:
      'Shelter is forged where rigid human geometry yields to rising mountain mist.',
    summary:
      'Set deep inside a steep cedar ravine north of Kyoto, Kuro Sanctuary balances weathered concrete shear towers with a warm timber-framed glass living room projecting into the canopy.',
    editorialEssay: [
      'Rather than leveling the 42-degree granite slope, Atelier Koku inserted a single vertical concrete spine anchored by deep micropiles, preserving the root networks and seasonal mountain runoff below. Every timber shutter used to cast the walls was salvaged from storm-felled Kitayama cedars.',
      'The upper living volume projects outward into the humidity of the forest canopy. Frameless low-iron glass walls slide completely into structural pockets, dissolving the threshold between warm interior oak joinery and drifting ravine fog.',
      'Rainwater is harvested across the stepped flat roofs and routed into a granite moss trough at the entry bridge, turning mountain weather into an audible architectural companion.',
    ],
    materials: [
      {
        name: 'Cedar-Shuttered Concrete',
        origin: 'Kitayama Valley, Kyoto',
        finish: 'Unsealed weathered matte',
        role: 'Retaining tower & cantilevered soffit',
        swatchHex: '#4E4F4A',
      },
      {
        name: 'Aged Hinoki Cypress',
        origin: 'Nara Forestry',
        finish: 'Oil-rubbed natural grain',
        role: 'Window mullions, ceiling battens & hearth',
        swatchHex: '#9C7B56',
      },
      {
        name: 'Kurama Granite',
        origin: 'Kyoto Basin',
        finish: 'Split-face dry stack',
        role: 'Entry bridge & stepped garden terraces',
        swatchHex: '#6F6D66',
      },
    ],
    metrics: [
      { label: 'Gross Floor Area', value: '410 m²' },
      { label: 'Ravine Cantilever', value: '9.2 m' },
      { label: 'Slope Inclination', value: '42°' },
      { label: 'Local Timber Reuse', value: '94%' },
    ],
    relatedIds: ['monolith-pavilion', 'bamboo-horizon', 'obsidian-observatory'],
  },
  {
    id: 'aether-spire',
    indexNumber: '03',
    title: 'Flux Parametric Archive',
    subtitle: 'Algorithmically folded titanium ribbon shell and civic atrium',
    location: 'Basel',
    country: 'Switzerland',
    region: 'Europe',
    coordinates: '47.559° N · 7.588° E',
    architect: 'Elena Vance & Studio Form',
    studio: 'Vance Computational',
    year: 2025,
    style: 'Parametric Architecture',
    buildingType: 'Museum',
    areaSqm: 6850,
    cantileverMeters: 18.0,
    heroImage: '/src/assets/images/project_aether_spire_1794969696059.jpg',
    interiorImage:
      '/src/assets/images/project_vortex_atrium_1794969697119.jpg',
    drawingImage:
      '/src/assets/images/blueprint_architectural_section_1794969698976.jpg',
    secondaryImage:
      '/src/assets/images/interior_concrete_gallery_1794969697892.jpg',
    featured: true,
    collectionId: 'zenithal-light-studies',
    labPreset: {
      material: 'titanium',
      colorId: 'chalk',
      finish: 'anodized',
      lighting: 'golden',
    },
    philosophy:
      'Continuous curvature transforms structural load paths into fluid urban choreography.',
    summary:
      'Engineered through custom structural optimization scripts, the Flux Archive wraps three exhibition levels in brushed Grade-2 titanium ribbons that register shifting sky tones across the day.',
    editorialEssay: [
      'Designed as an architectural repository for experimental spatial media and large-scale kinetic installations, the building avoids conventional column grids in its public atrium. Instead, twin doubly-curved steel trusses concealed within the titanium folds transfer roof loads to three perimeter cores.',
      'Each exterior panel was CNC-rolled to a unique radius calculated to minimize solar heat gain during summer afternoons while bouncing low winter daylight deep into the travertine plaza.',
      'Inside, the sweeping shell folds inward to form an acoustic amphitheater and spiral circulation ribbon that links subterranean vaults with the upper daylight galleries.',
    ],
    materials: [
      {
        name: 'Brushed Grade-2 Titanium',
        origin: 'Zürich Precision Mill',
        finish: 'Micro-directional satin',
        role: 'Parametric outer shell & folded ribs',
        swatchHex: '#A7A69F',
      },
      {
        name: 'Roman Travertine',
        origin: 'Tivoli Quarry',
        finish: 'Unfilled honed matte',
        role: 'Civic plaza & interior gallery plinths',
        swatchHex: '#DCD5C5',
      },
      {
        name: 'Curved Low-Iron Glazing',
        origin: 'Bavaria Glassworks',
        finish: 'Acoustic triple-laminated',
        role: 'Atrium curtain wall & sky oculus',
        swatchHex: '#7A8C8D',
      },
    ],
    metrics: [
      { label: 'Gross Floor Area', value: '6,850 m²' },
      { label: 'Clear Atrium Span', value: '44.0 m' },
      { label: 'Unique Titanium Panels', value: '1,940' },
      { label: 'Solar Gain Reduction', value: '38%' },
    ],
    relatedIds: ['vortex-atrium', 'monolith-pavilion', 'solis-courtyard'],
  },
  {
    id: 'solis-courtyard',
    indexNumber: '04',
    title: 'Solis Limestone Courtyard',
    subtitle: 'Monolithic stone colonnade calibrated for Mediterranean sun',
    location: 'Mallorca',
    country: 'Spain',
    region: 'Europe',
    coordinates: '39.695° N · 3.017° E',
    architect: 'Mateo Serra',
    studio: 'Serra Taller',
    year: 2024,
    style: 'Minimalism',
    buildingType: 'Private Residence',
    areaSqm: 580,
    cantileverMeters: 4.5,
    heroImage: '/src/assets/images/project_solis_courtyard_1794969695969.jpg',
    interiorImage:
      '/src/assets/images/interior_concrete_gallery_1794969697892.jpg',
    drawingImage:
      '/src/assets/images/blueprint_architectural_section_1794969698976.jpg',
    secondaryImage:
      '/src/assets/images/project_mycelium_canopy_1794969695482.jpg',
    featured: true,
    collectionId: 'zenithal-light-studies',
    labPreset: {
      material: 'limestone',
      colorId: 'stone',
      finish: 'matte',
      lighting: 'zenith',
    },
    philosophy:
      'Silence is built from shadow width, stone mass, and the stillness of unrippled water.',
    summary:
      'Constructed entirely from dry-cut Mares limestone quarried twelve kilometers from the site, Solis Courtyard orchestrates rhythmic midday shadows across a calm cooling basin.',
    editorialEssay: [
      'In Mediterranean climates, thermal mass and deep shade replace mechanical cooling. Mateo Serra organized the house around a closed monastic cloister whose rhythm of 600mm-thick limestone piers breaks direct solar radiation before it reaches the interior glazing.',
      'Every vertical joint aligns across floor pavers, colonnade piers, and parapet blocks, establishing a calm mathematical grid that turns shifting daylight into a living sundial.',
      'A slender axial water trough runs the full length of the colonnade, drawing coastal breezes over chilled water and reflecting sky brightness onto the timber ceiling soffits.',
    ],
    materials: [
      {
        name: 'Marès Limestone',
        origin: 'Santanyí Quarry, Mallorca',
        finish: 'Saw-cut open pore',
        role: 'Load-bearing colonnade & courtyard walls',
        swatchHex: '#E3DAC8',
      },
      {
        name: 'Reclaimed Olive Timber',
        origin: 'Tramuntana Valley',
        finish: 'Wire-brushed raw',
        role: 'Pivot doors & deep window shutters',
        swatchHex: '#7A6850',
      },
      {
        name: 'Lime-Pozzolana Plaster',
        origin: 'Local Balearic kiln',
        finish: 'Hand-troweled mineral',
        role: 'Interior acoustic wall finish',
        swatchHex: '#F0ECE1',
      },
    ],
    metrics: [
      { label: 'Gross Floor Area', value: '580 m²' },
      { label: 'Stone Wall Thickness', value: '600 mm' },
      { label: 'Passive Cooling Gain', value: '-6.5 °C' },
      { label: 'Quarry Distance', value: '12 km' },
    ],
    relatedIds: ['mycelium-canopy', 'kuro-sanctuary', 'aether-spire'],
  },
  {
    id: 'mycelium-canopy',
    indexNumber: '05',
    title: 'Coastal Timber Canopy',
    subtitle: 'Undulating glulam ribs and rammed earth beneath a living moss roof',
    location: 'Lofoten',
    country: 'Norway',
    region: 'Europe',
    coordinates: '68.208° N · 13.882° E',
    architect: 'Freja Lindqvist',
    studio: 'Nordic Bioform',
    year: 2025,
    style: 'Organic Architecture',
    buildingType: 'Cultural Pavilion',
    areaSqm: 340,
    cantileverMeters: 6.4,
    heroImage: '/src/assets/images/project_mycelium_canopy_1794969695482.jpg',
    interiorImage:
      '/src/assets/images/project_vortex_atrium_1794969697119.jpg',
    drawingImage:
      '/src/assets/images/blueprint_architectural_section_1794969698976.jpg',
    secondaryImage:
      '/src/assets/images/project_bamboo_horizon_1794969698300.jpg',
    featured: false,
    collectionId: 'living-timber-earth',
    labPreset: {
      material: 'cedar',
      colorId: 'olive',
      finish: 'weathered',
      lighting: 'overcast',
    },
    philosophy:
      'Architecture belongs to the hillside when its roof continues the native ecology.',
    summary:
      'Layered compacted local earth walls support sculpted Douglas fir ribs topped by coastal heather and moss, sheltering hikers and researchers above the Norwegian Sea.',
    editorialEssay: [
      'Positioned along an exposed Arctic coastal headland, the pavilion behaves aerodynamically like a natural dune. Wind tunnel modeling shaped the undulating double-curved roof profile so Atlantic gales pass smoothly overhead rather than generating uplift.',
      'The base walls are compacted directly from excavated site moraine and crushed shell aggregate, displaying stratified geological bands that anchor the timber arches without poured concrete footings above grade.',
      'Over five growing seasons, native crowberry and coastal moss colonizing the roof substrate have turned the structure into a continuous thermal blanket and biodiversity corridor.',
    ],
    materials: [
      {
        name: 'Steam-Bent Douglas Fir',
        origin: 'Trøndelag Sustainable Forest',
        finish: 'Pine-tar preservative',
        role: 'Primary undulating structural ribs',
        swatchHex: '#8C6D4F',
      },
      {
        name: 'Compacted Rammed Earth',
        origin: 'On-site glacial moraine',
        finish: 'Raw stratified lift lines',
        role: 'Thermal windbreak perimeter walls',
        swatchHex: '#A78E75',
      },
      {
        name: 'Arctic Sedum & Moss Mat',
        origin: 'Local coastal propagation',
        finish: 'Living vegetative roof',
        role: 'Stormwater retention & wind damping',
        swatchHex: '#5F6B50',
      },
    ],
    metrics: [
      { label: 'Gross Floor Area', value: '340 m²' },
      { label: 'Embodied Carbon', value: '-18 tCO₂e' },
      { label: 'Wind Rating', value: '185 km/h' },
      { label: 'Biogenic Material Share', value: '89%' },
    ],
    relatedIds: ['bamboo-horizon', 'solis-courtyard', 'obsidian-observatory'],
  },
  {
    id: 'obsidian-observatory',
    indexNumber: '06',
    title: 'Obsidian Cliff Observatory',
    subtitle: 'Volcanic basalt-aggregate cantilever poised over the North Atlantic',
    location: 'Vik í Mýrdal',
    country: 'Iceland',
    region: 'Europe',
    coordinates: '63.418° N · 19.006° W',
    architect: 'Soren Halvorsen',
    studio: 'Studio Hekla',
    year: 2024,
    style: 'Futurism',
    buildingType: 'Observatory',
    areaSqm: 265,
    cantileverMeters: 14.0,
    heroImage:
      '/src/assets/images/project_obsidian_observatory_1794969696425.jpg',
    interiorImage:
      '/src/assets/images/interior_concrete_gallery_1794969697892.jpg',
    drawingImage:
      '/src/assets/images/blueprint_architectural_section_1794969698976.jpg',
    secondaryImage:
      '/src/assets/images/hero_monolith_pavilion_1794969694651.jpg',
    featured: false,
    collectionId: 'cantilevered-monoliths',
    labPreset: {
      material: 'concrete',
      colorId: 'obsidian',
      finish: 'matte',
      lighting: 'twilight',
    },
    philosophy:
      'A single horizon slot frames the Atlantic without competing against the cliff.',
    summary:
      'Cast from crushed volcanic basalt and anchored into sheer sea cliffs, this atmospheric research outpost projects fourteen meters toward breaking surf with a sole warm amber aperture.',
    editorialEssay: [
      'Designed as a year-round atmospheric and oceanographic monitoring station, the Obsidian Cliff Observatory minimizes visual disturbance across the volcanic coastline by adopting the exact mineral tone of wet basalt.',
      'Its structural belly tapers like a naval hull, deflecting upward sea spray away from the triple-glazed horizon slit. Inside, warm birch acoustic paneling contrasts starkly with the storm-battered concrete exterior.',
      'Geothermal borehole loops beneath the entry spine supply steady radiant floor warmth through sub-arctic winter storms.',
    ],
    materials: [
      {
        name: 'Volcanic Basalt Concrete',
        origin: 'Mýrdal Tephra Deposit',
        finish: 'Hydrophobic charcoal wash',
        role: 'Cantilevered box girder shell',
        swatchHex: '#1D1E1C',
      },
      {
        name: 'Marine-Grade Corten & Bronze',
        origin: 'Reykjavík Metalworks',
        finish: 'Salt-passivated dark',
        role: 'Window framing & cliff anchor plates',
        swatchHex: '#43382F',
      },
      {
        name: 'Warm Nordic Birch',
        origin: 'FSC Certified Timber',
        finish: 'Matte beeswax seal',
        role: 'Interior acoustic lining & benches',
        swatchHex: '#C29D6E',
      },
    ],
    metrics: [
      { label: 'Gross Floor Area', value: '265 m²' },
      { label: 'Cliff Cantilever', value: '14.0 m' },
      { label: 'Thermal U-Value', value: '0.14 W/m²K' },
      { label: 'Geothermal Output', value: '100% Off-Grid' },
    ],
    relatedIds: ['monolith-pavilion', 'kuro-sanctuary', 'vortex-atrium'],
  },
  {
    id: 'vortex-atrium',
    indexNumber: '07',
    title: 'Vortex Oculus Gallery',
    subtitle: 'Helical cast-concrete circulation core beneath a zenithal skylight',
    location: 'São Paulo',
    country: 'Brazil',
    region: 'Americas',
    coordinates: '23.550° S · 46.633° W',
    architect: 'Camila Duarte',
    studio: 'Duarte Arquitetura',
    year: 2025,
    style: 'Futurism',
    buildingType: 'Gallery & Atrium',
    areaSqm: 3920,
    cantileverMeters: 11.8,
    heroImage: '/src/assets/images/project_vortex_atrium_1794969697119.jpg',
    interiorImage:
      '/src/assets/images/interior_concrete_gallery_1794969697892.jpg',
    drawingImage:
      '/src/assets/images/blueprint_architectural_section_1794969698976.jpg',
    secondaryImage:
      '/src/assets/images/project_aether_spire_1794969696059.jpg',
    featured: false,
    collectionId: 'zenithal-light-studies',
    labPreset: {
      material: 'concrete',
      colorId: 'chalk',
      finish: 'satin',
      lighting: 'zenith',
    },
    philosophy:
      'Vertical movement becomes sculpture when light acts as the sole structural guide.',
    summary:
      'A free-spanning helical concrete ribbon rises through four stacked exhibition decks, illuminated solely by a twelve-meter circular oculus overhead.',
    editorialEssay: [
      'Working within a dense urban footprint in São Paulo, Camila Duarte inverted the traditional museum atrium: instead of perimeter stairs tucked behind walls, circulation becomes the central sculptural artifact.',
      'The helical stair acts as a continuous prestressed torsion beam spanning 11.8 meters between floor slabs with zero intermediate hangers. Its underside absorbs and scatters sunlight entering from the zenithal skylight.',
      'Surrounding gallery bays step back in quiet shadow, allowing curators to stage site-specific light and sound installations alongside monolithic stone sculptures.',
    ],
    materials: [
      {
        name: 'White-Cement Architectural Concrete',
        origin: 'Minas Gerais',
        finish: 'Phenolic-ply satin cast',
        role: 'Helical torsion stair & coffered slabs',
        swatchHex: '#B6B4AC',
      },
      {
        name: 'Laminated Steel Balustrade',
        origin: 'São Paulo Foundry',
        finish: 'Raw waxed mill scale',
        role: 'Bridge guardrails & structural ties',
        swatchHex: '#2B2C29',
      },
      {
        name: 'Low-Iron Diffused Oculus Glass',
        origin: 'Saint-Gobain',
        finish: 'Micro-etched solar frit',
        role: '12m zenithal daylight diffuser',
        swatchHex: '#CAD2D3',
      },
    ],
    metrics: [
      { label: 'Gross Floor Area', value: '3,920 m²' },
      { label: 'Helix Free Span', value: '11.8 m' },
      { label: 'Oculus Diameter', value: '12.0 m' },
      { label: 'Atrium Height', value: '24.6 m' },
    ],
    relatedIds: ['aether-spire', 'monolith-pavilion', 'solis-courtyard'],
  },
  {
    id: 'bamboo-horizon',
    indexNumber: '08',
    title: 'Cloud Ridge Residence',
    subtitle: 'Charred cedar & weathered steel shelter suspended in montane mist',
    location: 'Monteverde',
    country: 'Costa Rica',
    region: 'Americas',
    coordinates: '10.301° N · 84.825° W',
    architect: 'Lucía Morales',
    studio: 'Bosque Tectónico',
    year: 2024,
    style: 'Sustainable Architecture',
    buildingType: 'Private Residence',
    areaSqm: 390,
    cantileverMeters: 8.6,
    heroImage: '/src/assets/images/project_bamboo_horizon_1794969698300.jpg',
    interiorImage:
      '/src/assets/images/interior_concrete_gallery_1794969697892.jpg',
    drawingImage:
      '/src/assets/images/blueprint_architectural_section_1794969698976.jpg',
    secondaryImage:
      '/src/assets/images/project_kuro_sanctuary_1794969695425.jpg',
    featured: false,
    collectionId: 'living-timber-earth',
    labPreset: {
      material: 'cedar',
      colorId: 'obsidian',
      finish: 'matte',
      lighting: 'golden',
    },
    philosophy:
      'To build lightly in a cloud forest is to elevate the dwelling above the living floor.',
    summary:
      'Supported by twin corten steel I-beams anchored into volcanic bedrock, this net-positive residence floats gently above Monteverde cloud forest ferns.',
    editorialEssay: [
      'Conventional hillside grading destroys montane topsoil and amphibian migration corridors. Bosque Tectónico elevated the entire 390-square-meter residence on two compact foundation piers, leaving 92 percent of the forest floor completely untouched.',
      'The exterior skin pairs charred cypress cladding—resistant to humidity, rot, and insects without synthetic sealants—with cross-laminated tropical hardwood floor cassettes prefabricated off-site to shorten field assembly to nineteen days.',
      'Deep roof overhangs shield triple-glazed operable louvers from torrential seasonal rains while driving passive cross-ventilation throughout the two-story living volume.',
    ],
    materials: [
      {
        name: 'Shou Sugi Ban Cypress',
        origin: 'Alajuela Managed Plantation',
        finish: 'Kiln-charred & wire brushed',
        role: 'Weather-resistant exterior rainscreen',
        swatchHex: '#252422',
      },
      {
        name: 'Weathered Corten A Steel',
        origin: 'San José Structural Mill',
        finish: 'Natural oxide patina',
        role: 'Primary cantilevered truss beams',
        swatchHex: '#6E4730',
      },
      {
        name: 'Cross-Laminated Teak',
        origin: 'Guanacaste Forestry',
        finish: 'Matte plant-oil finish',
        role: 'Cantilevered terrace decks & soffits',
        swatchHex: '#9E774D',
      },
    ],
    metrics: [
      { label: 'Gross Floor Area', value: '390 m²' },
      { label: 'Deck Cantilever', value: '8.6 m' },
      { label: 'Untouched Forest Floor', value: '92%' },
      { label: 'Assembly Time', value: '19 Days' },
    ],
    relatedIds: ['mycelium-canopy', 'kuro-sanctuary', 'solis-courtyard'],
  },
];

export const MANIFESTO_STATEMENTS = [
  {
    index: '01',
    heading: 'Gravity is a material, not a constraint.',
    body: 'Every cantilever is a quiet debate between structural tension and human audacity. When mass hovers above terrain, the empty air beneath becomes architectural volume.',
  },
  {
    index: '02',
    heading: 'Light carves what stone merely outlines.',
    body: 'Concrete, limestone, and charred timber remain mute until daylight slices across their surface grain. We curate structures conceived as instruments for atmosphere.',
  },
  {
    index: '03',
    heading: 'Digital space reveals tectonic truth.',
    body: 'ARCHVERSE is neither portfolio nor directory—it is an open spatial exhibition where material weight, proportion, and environment can be studied without distance.',
  },
];

export const ABOUT_STATISTICS = [
  {
    value: '08',
    unit: 'Curated Monographs',
    detail: 'Full-scale architectural studies spanning brutalism, organic timber, and parametric shells.',
  },
  {
    value: '06',
    unit: 'Spatial Disciplines',
    detail: 'Categorized exhibition index across structural and environmental philosophies.',
  },
  {
    value: '14',
    unit: 'Partner Studios',
    detail: 'Independent architectural practices contributing drawings, material specs, and models.',
  },
  {
    value: '22.5m',
    unit: 'Peak Cantilever Span',
    detail: 'Measured at the Hardangerfjord Monolith Pavilion structural overhang.',
  },
];
