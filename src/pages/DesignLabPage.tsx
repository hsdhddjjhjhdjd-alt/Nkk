import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { DesignLabPreset, HERO_IMAGE } from '../data/projects';

type MaterialType = 'concrete' | 'cedar' | 'titanium' | 'limestone';
type FinishType = 'matte' | 'satin' | 'anodized' | 'weathered';
type LightingPreset = 'overcast' | 'golden' | 'twilight' | 'zenith';
type CameraPreset = 'hero' | 'elevation' | 'aerial' | 'threshold';
type DockTab = 'material' | 'lighting' | 'structure';

interface ColorOption {
  id: 'obsidian' | 'stone' | 'concrete' | 'olive' | 'chalk';
  label: string;
  hex: string;
}

const MATERIAL_OPTIONS: { id: MaterialType; label: string; summary: string }[] = [
  { id: 'concrete', label: 'Board Concrete', summary: 'Spruce formwork grain' },
  { id: 'cedar', label: 'Charred Cedar', summary: 'Shou Sugi Ban timber' },
  { id: 'titanium', label: 'Brushed Titanium', summary: 'Anisotropic alloy' },
  { id: 'limestone', label: 'Honed Limestone', summary: 'Open-pore Mediterranean' },
];

const COLOR_OPTIONS: ColorOption[] = [
  { id: 'obsidian', label: 'Obsidian', hex: '#434540' },
  { id: 'stone', label: 'Warm Stone', hex: '#DDD7C8' },
  { id: 'concrete', label: 'Concrete Grey', hex: '#A4A39B' },
  { id: 'olive', label: 'Muted Olive', hex: '#777C68' },
  { id: 'chalk', label: 'Raw Chalk', hex: '#F0EDE4' },
];

const FINISH_OPTIONS: { id: FinishType; label: string }[] = [
  { id: 'matte', label: 'Raw Matte' },
  { id: 'satin', label: 'Honed Satin' },
  { id: 'anodized', label: 'Anodized' },
  { id: 'weathered', label: 'Weathered' },
];

const LIGHTING_PRESETS: {
  id: LightingPreset;
  label: string;
  skyHex: number;
  zenithHex: string;
  horizonHex: string;
  sunPos: [number, number, number];
  sunColor: number;
  sunIntensity: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  envIntensity: number;
  interiorIntensity: number;
  exposure: number;
}[] = [
  {
    id: 'overcast',
    label: 'Nordic Overcast',
    skyHex: 0x35393a,
    zenithHex: '#25292B',
    horizonHex: '#464B4D',
    sunPos: [14, 18, 12],
    sunColor: 0xe6edf4,
    sunIntensity: 2.1,
    hemiSky: 0xd0d8e0,
    hemiGround: 0x383a36,
    hemiIntensity: 1.15,
    envIntensity: 0.95,
    interiorIntensity: 1.5,
    exposure: 1.08,
  },
  {
    id: 'golden',
    label: 'Golden Hour',
    skyHex: 0x34281d,
    zenithHex: '#1D1D22',
    horizonHex: '#634329',
    sunPos: [24, 6.5, 11],
    sunColor: 0xffa754,
    sunIntensity: 3.4,
    hemiSky: 0xffd19e,
    hemiGround: 0x2b251e,
    hemiIntensity: 0.72,
    envIntensity: 0.68,
    interiorIntensity: 2.8,
    exposure: 1.12,
  },
  {
    id: 'twilight',
    label: 'Twilight Monolith',
    skyHex: 0x0e1116,
    zenithHex: '#07090D',
    horizonHex: '#1C2533',
    sunPos: [-12, 8, -16],
    sunColor: 0x6c88b5,
    sunIntensity: 0.95,
    hemiSky: 0x364966,
    hemiGround: 0x111210,
    hemiIntensity: 0.45,
    envIntensity: 0.24,
    interiorIntensity: 5.8,
    exposure: 1.0,
  },
  {
    id: 'zenith',
    label: 'Zenithal Noon',
    skyHex: 0x454947,
    zenithHex: '#2F3639',
    horizonHex: '#5B5E58',
    sunPos: [4, 28, 6],
    sunColor: 0xfff9ee,
    sunIntensity: 3.1,
    hemiSky: 0xf6f3e8,
    hemiGround: 0x57544a,
    hemiIntensity: 0.95,
    envIntensity: 0.85,
    interiorIntensity: 0.6,
    exposure: 1.06,
  },
];

const CAMERA_PRESETS: {
  id: CameraPreset;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}[] = [
  {
    id: 'hero',
    label: 'Hero Cantilever',
    position: [13.5, 6.2, 14.5],
    target: [0.5, 2.2, 0],
  },
  {
    id: 'elevation',
    label: 'South Elevation',
    position: [0.2, 3.6, 17.5],
    target: [0, 2.3, 0],
  },
  {
    id: 'aerial',
    label: 'Aerial Axon',
    position: [15.5, 13.5, 13.5],
    target: [0, 1.5, 0],
  },
  {
    id: 'threshold',
    label: 'Water Threshold',
    position: [-10.5, 2.6, 11.5],
    target: [1.5, 2.4, -0.5],
  },
];

interface MaterialTexturePair {
  albedo: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
}

function createProceduralTextures(
  type: MaterialType,
  maxAnisotropy: number
): MaterialTexturePair {
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = 512;
  albedoCanvas.height = 512;
  const aCtx = albedoCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d');

  if (aCtx && bCtx) {
    if (type === 'concrete') {
      aCtx.fillStyle = '#dad8d0';
      aCtx.fillRect(0, 0, 512, 512);
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, 512, 512);

      for (let y = 0; y < 512; y += 32) {
        const shade = 204 + Math.floor((Math.sin(y * 0.7) + 1) * 14);
        aCtx.fillStyle = `rgb(${shade}, ${shade - 2}, ${shade - 6})`;
        aCtx.fillRect(0, y, 512, 30);
        aCtx.fillStyle = 'rgba(20, 21, 19, 0.25)';
        aCtx.fillRect(0, y + 30, 512, 2);

        const bumpVal = 118 + Math.floor((Math.sin(y * 0.7) + 1) * 20);
        bCtx.fillStyle = `rgb(${bumpVal}, ${bumpVal}, ${bumpVal})`;
        bCtx.fillRect(0, y, 512, 30);
        bCtx.fillStyle = '#303030';
        bCtx.fillRect(0, y + 30, 512, 2);
      }

      for (let i = 0; i < 4200; i++) {
        const x = (i * 73) % 512;
        const y = (i * 137) % 512;
        aCtx.fillStyle =
          i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(20,21,19,0.1)';
        aCtx.fillRect(x, y, 2, 2);
        bCtx.fillStyle = i % 2 === 0 ? '#9c9c9c' : '#585858';
        bCtx.fillRect(x, y, 2, 2);
      }
    } else if (type === 'cedar') {
      aCtx.fillStyle = '#beb9b0';
      aCtx.fillRect(0, 0, 512, 512);
      bCtx.fillStyle = '#888888';
      bCtx.fillRect(0, 0, 512, 512);

      for (let x = 0; x < 512; x += 24) {
        const shade = 165 + ((x * 13) % 36);
        aCtx.fillStyle = `rgb(${shade}, ${shade - 5}, ${shade - 10})`;
        aCtx.fillRect(x, 0, 21, 512);
        aCtx.fillStyle = 'rgba(10, 10, 9, 0.45)';
        aCtx.fillRect(x + 21, 0, 3, 512);

        bCtx.fillStyle = '#a8a8a8';
        bCtx.fillRect(x, 0, 21, 512);
        bCtx.fillStyle = '#202020';
        bCtx.fillRect(x + 21, 0, 3, 512);
      }

      for (let i = 0; i < 1400; i++) {
        const x = (i * 53) % 512;
        const y = (i * 97) % 512;
        aCtx.fillStyle = 'rgba(10, 10, 10, 0.16)';
        aCtx.fillRect(x, y, 1, 26);
        bCtx.fillStyle = '#606060';
        bCtx.fillRect(x, y, 1, 26);
      }
    } else if (type === 'titanium') {
      aCtx.fillStyle = '#e5e5e1';
      aCtx.fillRect(0, 0, 512, 512);
      bCtx.fillStyle = '#909090';
      bCtx.fillRect(0, 0, 512, 512);

      for (let y = 0; y < 512; y += 2) {
        const alpha = ((y * 19) % 12) / 110;
        aCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        aCtx.fillRect(0, y, 512, 1);
      }

      aCtx.strokeStyle = 'rgba(20, 21, 19, 0.28)';
      aCtx.lineWidth = 2;
      bCtx.strokeStyle = '#252525';
      bCtx.lineWidth = 3;
      for (let y = 0; y < 512; y += 128) {
        aCtx.beginPath();
        aCtx.moveTo(0, y);
        aCtx.lineTo(512, y);
        aCtx.stroke();
        bCtx.beginPath();
        bCtx.moveTo(0, y);
        bCtx.lineTo(512, y);
        bCtx.stroke();
      }
      for (let x = 0; x < 512; x += 128) {
        aCtx.beginPath();
        aCtx.moveTo(x, 0);
        aCtx.lineTo(x, 512);
        aCtx.stroke();
        bCtx.beginPath();
        bCtx.moveTo(x, 0);
        bCtx.lineTo(x, 512);
        bCtx.stroke();
      }
    } else {
      // Honed Limestone
      aCtx.fillStyle = '#eae5da';
      aCtx.fillRect(0, 0, 512, 512);
      bCtx.fillStyle = '#949494';
      bCtx.fillRect(0, 0, 512, 512);

      for (let y = 0; y < 512; y += 64) {
        for (let x = 0; x < 512; x += 128) {
          const offset = (y / 64) % 2 === 0 ? 0 : 64;
          aCtx.strokeStyle = 'rgba(45, 42, 36, 0.18)';
          aCtx.lineWidth = 2;
          aCtx.strokeRect((x + offset) % 512, y, 128, 64);

          bCtx.strokeStyle = '#383838';
          bCtx.lineWidth = 2;
          bCtx.strokeRect((x + offset) % 512, y, 128, 64);
        }
      }

      for (let i = 0; i < 3200; i++) {
        const x = (i * 89) % 512;
        const y = (i * 193) % 512;
        aCtx.fillStyle = 'rgba(110, 102, 88, 0.1)';
        aCtx.fillRect(x, y, 3, 1);
        bCtx.fillStyle = '#6c6c6c';
        bCtx.fillRect(x, y, 3, 1);
      }
    }
  }

  const albedo = new THREE.CanvasTexture(albedoCanvas);
  albedo.wrapS = THREE.RepeatWrapping;
  albedo.wrapT = THREE.RepeatWrapping;
  albedo.repeat.set(2, 2);
  albedo.colorSpace = THREE.SRGBColorSpace;
  albedo.anisotropy = maxAnisotropy;
  albedo.needsUpdate = true;

  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(2, 2);
  bump.anisotropy = maxAnisotropy;
  bump.needsUpdate = true;

  return { albedo, bump };
}

interface DesignLabPageProps {
  initialPreset?: DesignLabPreset;
}

export const DesignLabPage: React.FC<DesignLabPageProps> = ({
  initialPreset,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const [material, setMaterial] = useState<MaterialType>(
    initialPreset?.material ?? 'concrete'
  );
  const [colorId, setColorId] = useState<ColorOption['id']>(
    initialPreset?.colorId ?? 'stone'
  );
  const [finish, setFinish] = useState<FinishType>(
    initialPreset?.finish ?? 'matte'
  );
  const [lighting, setLighting] = useState<LightingPreset>(
    initialPreset?.lighting ?? 'golden'
  );
  const [solarAzimuth, setSolarAzimuth] = useState<number>(0);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('hero');
  const [exploded, setExploded] = useState<number>(0);
  const [louverAngle, setLouverAngle] = useState<number>(28);
  const [interiorLit, setInteriorLit] = useState<boolean>(true);
  const [cadOverlay, setCadOverlay] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DockTab>('material');
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<boolean>(false);

  // Sync if user launches Design Lab from a specific project preset
  useEffect(() => {
    if (initialPreset) {
      setMaterial(initialPreset.material);
      setColorId(initialPreset.colorId);
      setFinish(initialPreset.finish);
      setLighting(initialPreset.lighting);
      setSolarAzimuth(0);
    }
  }, [initialPreset]);

  const stateRef = useRef({
    material,
    colorId,
    finish,
    lighting,
    solarAzimuth,
    exploded,
    louverAngle,
    interiorLit,
    cadOverlay,
  });
  stateRef.current = {
    material,
    colorId,
    finish,
    lighting,
    solarAzimuth,
    exploded,
    louverAngle,
    interiorLit,
    cadOverlay,
  };

  const sceneActionsRef = useRef<{
    applyVisualState: () => void;
    setCameraTarget: (preset: CameraPreset) => void;
    requestRender: () => void;
  } | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'h' &&
        !(e.target instanceof HTMLInputElement)
      ) {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const canvas = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    const handleContextRestored = () => {
      setWebglError(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x34281d);
    scene.fog = new THREE.FogExp2(0x634329, 0.012);

    // Architectural gradient sky sphere synced to active lighting preset
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 2;
    skyCanvas.height = 256;
    const skyCtx = skyCanvas.getContext('2d');
    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    skyTexture.colorSpace = THREE.SRGBColorSpace;
    const updateSkyGradient = (zenithHex: string, horizonHex: string) => {
      if (!skyCtx) return;
      const grad = skyCtx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, zenithHex);
      grad.addColorStop(0.52, horizonHex);
      grad.addColorStop(1, '#181917');
      skyCtx.fillStyle = grad;
      skyCtx.fillRect(0, 0, 2, 256);
      skyTexture.needsUpdate = true;
    };
    updateSkyGradient('#1D1D22', '#634329');

    const skyGeo = new THREE.SphereGeometry(95, 24, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
    const skySphere = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skySphere);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.7;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      160
    );
    camera.position.set(13.5, 6.2, 14.5);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0.5, 2.2, 0);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 7;
    controls.maxDistance = 32;
    controls.update();

    const hemiLight = new THREE.HemisphereLight(0xffd19e, 0x2b251e, 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffa754, 3.2);
    keyLight.position.set(24, 6.5, 11);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -14;
    keyLight.shadow.camera.right = 14;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 64;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9fb5c7, 0.6);
    rimLight.position.set(-14, 10, -12);
    scene.add(rimLight);

    const interiorLight = new THREE.PointLight(0xffaa55, 2.8, 20, 1.4);
    interiorLight.position.set(1.8, 2.9, 0.8);
    scene.add(interiorLight);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const textures: Record<MaterialType, MaterialTexturePair> = {
      concrete: createProceduralTextures('concrete', maxAnisotropy),
      cedar: createProceduralTextures('cedar', maxAnisotropy),
      titanium: createProceduralTextures('titanium', maxAnisotropy),
      limestone: createProceduralTextures('limestone', maxAnisotropy),
    };

    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#DDD7C8'),
      map: textures.concrete.albedo,
      bumpMap: textures.concrete.bump,
      bumpScale: 0.045,
      roughness: 0.78,
      metalness: 0.05,
      clearcoat: 0.0,
    });

    const accentTrimMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1B1C19'),
      roughness: 0.35,
      metalness: 0.85,
    });

    const plinthMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#232421'),
      roughness: 0.88,
      metalness: 0.05,
    });

    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0E1312'),
      roughness: 0.06,
      metalness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D7E2E0'),
      metalness: 0.0,
      roughness: 0.06,
      transmission: isSoftwareGl ? 0 : 0.86,
      transparent: true,
      opacity: isSoftwareGl ? 0.38 : 1.0,
      ior: 1.52,
      thickness: 0.35,
      depthWrite: false,
    });

    const glowMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFBA73'),
      emissive: new THREE.Color('#FF9E44'),
      emissiveIntensity: 1.4,
      roughness: 0.4,
    });

    const wireframeLineMat = new THREE.LineBasicMaterial({
      color: 0xe8e5dc,
      transparent: true,
      opacity: 0.42,
    });

    const pavilionGroup = new THREE.Group();
    scene.add(pavilionGroup);

    const groundGeo = new THREE.PlaneGeometry(140, 140);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1e201d,
      roughness: 0.95,
      metalness: 0.0,
    });
    const groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -0.02;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.6, 11),
      plinthMaterial
    );
    plinth.position.set(0, 0.3, 0);
    plinth.receiveShadow = true;
    plinth.castShadow = true;
    pavilionGroup.add(plinth);

    const waterBasin = new THREE.Mesh(
      new THREE.BoxGeometry(9.6, 0.08, 7.2),
      waterMaterial
    );
    waterBasin.position.set(2.4, 0.62, 0.8);
    waterBasin.receiveShadow = true;
    pavilionGroup.add(waterBasin);

    const shearCore = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 5.2, 4.8),
      shellMaterial
    );
    shearCore.position.set(-4.0, 3.2, -0.4);
    shearCore.castShadow = true;
    shearCore.receiveShadow = true;
    pavilionGroup.add(shearCore);

    const hullShape = new THREE.Shape();
    hullShape.moveTo(-4.8, 0);
    hullShape.lineTo(5.6, 0.55);
    hullShape.lineTo(6.2, 3.4);
    hullShape.lineTo(-4.8, 3.4);
    hullShape.closePath();

    const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
      depth: 5.4,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 2,
    });
    const mainHull = new THREE.Mesh(hullGeo, shellMaterial);
    mainHull.position.set(0, 1.9, -2.7);
    mainHull.castShadow = true;
    mainHull.receiveShadow = true;
    pavilionGroup.add(mainHull);

    const roofSlab = new THREE.Mesh(
      new THREE.BoxGeometry(12.0, 0.38, 6.2),
      shellMaterial
    );
    roofSlab.position.set(0.7, 5.48, 0);
    roofSlab.castShadow = true;
    roofSlab.receiveShadow = true;
    pavilionGroup.add(roofSlab);

    const roofFascia = new THREE.Mesh(
      new THREE.BoxGeometry(12.08, 0.1, 6.28),
      accentTrimMaterial
    );
    roofFascia.position.set(0.7, 5.69, 0);
    pavilionGroup.add(roofFascia);

    const upperVolume = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 1.6, 3.4),
      shellMaterial
    );
    upperVolume.position.set(-2.3, 6.45, -0.5);
    upperVolume.castShadow = true;
    upperVolume.receiveShadow = true;
    pavilionGroup.add(upperVolume);

    const glassFront = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 2.7, 0.08),
      glassMaterial
    );
    glassFront.position.set(1.6, 3.6, 2.72);
    glassFront.renderOrder = 2;
    pavilionGroup.add(glassFront);

    const glassEnd = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.5, 4.9),
      glassMaterial
    );
    glassEnd.position.set(5.95, 3.8, 0);
    glassEnd.renderOrder = 2;
    pavilionGroup.add(glassEnd);

    const interiorHearth = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 2.1, 3.6),
      glowMaterial
    );
    interiorHearth.position.set(1.4, 3.4, 0);
    pavilionGroup.add(interiorHearth);

    const louverGroup = new THREE.Group();
    const louverGeo = new THREE.BoxGeometry(0.1, 2.75, 0.42);
    const louverMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 11; i++) {
      const fin = new THREE.Mesh(louverGeo, accentTrimMaterial);
      fin.position.set(-1.6 + i * 0.72, 3.6, 2.95);
      fin.castShadow = true;
      louverGroup.add(fin);
      louverMeshes.push(fin);
    }
    pavilionGroup.add(louverGroup);

    const walkway = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.24, 2.2),
      plinthMaterial
    );
    walkway.position.set(-6.8, 0.72, 2.4);
    walkway.castShadow = true;
    walkway.receiveShadow = true;
    pavilionGroup.add(walkway);

    // CAD Wireframe Edge Overlay on structural volumes
    const edgeMeshes = [shearCore, mainHull, roofSlab, upperVolume];
    const cadLines: THREE.LineSegments[] = [];
    edgeMeshes.forEach((mesh) => {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 24);
      const line = new THREE.LineSegments(edges, wireframeLineMat);
      line.visible = false;
      mesh.add(line);
      cadLines.push(line);
    });

    const explodeTargets = [
      { mesh: upperVolume, baseY: 6.45, offsetY: 2.8 },
      { mesh: roofSlab, baseY: 5.48, offsetY: 1.75 },
      { mesh: roofFascia, baseY: 5.69, offsetY: 1.75 },
      { mesh: mainHull, baseY: 1.9, offsetY: 0.7 },
      { mesh: glassFront, baseY: 3.6, offsetY: 0.7 },
      { mesh: glassEnd, baseY: 3.8, offsetY: 0.7 },
      { mesh: louverGroup, baseY: 0, offsetY: 0.7 },
      { mesh: interiorHearth, baseY: 3.4, offsetY: 0.7 },
      { mesh: shearCore, baseY: 3.2, offsetY: 0.25 },
    ];

    const desiredCamPos = new THREE.Vector3(13.5, 6.2, 14.5);
    const desiredTarget = new THREE.Vector3(0.5, 2.2, 0);
    let camTransitionActive = false;
    let currentExploded = 0;
    let currentLouverRad = THREE.MathUtils.degToRad(28);

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        renderDirty = false;
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        const targetExploded = stateRef.current.exploded / 100;
        if (Math.abs(currentExploded - targetExploded) > 0.001) {
          currentExploded = THREE.MathUtils.damp(
            currentExploded,
            targetExploded,
            7,
            delta
          );
          for (const item of explodeTargets) {
            item.mesh.position.y = item.baseY + currentExploded * item.offsetY;
          }
          renderDirty = true;
        } else {
          currentExploded = targetExploded;
          for (const item of explodeTargets) {
            item.mesh.position.y = item.baseY + currentExploded * item.offsetY;
          }
        }

        const targetLouverRad = THREE.MathUtils.degToRad(
          stateRef.current.louverAngle
        );
        if (Math.abs(currentLouverRad - targetLouverRad) > 0.002) {
          currentLouverRad = THREE.MathUtils.damp(
            currentLouverRad,
            targetLouverRad,
            8,
            delta
          );
          for (const fin of louverMeshes) {
            fin.rotation.y = currentLouverRad;
          }
          renderDirty = true;
        } else {
          currentLouverRad = targetLouverRad;
          for (const fin of louverMeshes) {
            fin.rotation.y = currentLouverRad;
          }
        }

        if (camTransitionActive) {
          const factor = 1 - Math.exp(-5.5 * delta);
          camera.position.lerp(desiredCamPos, factor);
          controls.target.lerp(desiredTarget, factor);
          if (
            camera.position.distanceTo(desiredCamPos) < 0.03 &&
            controls.target.distanceTo(desiredTarget) < 0.03
          ) {
            camera.position.copy(desiredCamPos);
            controls.target.copy(desiredTarget);
            camTransitionActive = false;
          } else {
            renderDirty = true;
          }
        }

        controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    const applyVisualState = () => {
      const s = stateRef.current;
      const colorObj =
        COLOR_OPTIONS.find((c) => c.id === s.colorId) || COLOR_OPTIONS[1];

      shellMaterial.color.set(colorObj.hex);
      shellMaterial.map = textures[s.material].albedo;
      shellMaterial.bumpMap = textures[s.material].bump;

      let baseRoughness = 0.8;
      let baseMetalness = 0.05;
      let bumpScale = 0.045;
      let clearcoat = 0.0;

      if (s.material === 'concrete') {
        baseRoughness = 0.84;
        baseMetalness = 0.04;
        bumpScale = 0.055;
      } else if (s.material === 'cedar') {
        baseRoughness = 0.72;
        baseMetalness = 0.03;
        bumpScale = 0.075;
      } else if (s.material === 'titanium') {
        baseRoughness = 0.22;
        baseMetalness = 0.92;
        bumpScale = 0.028;
      } else if (s.material === 'limestone') {
        baseRoughness = 0.76;
        baseMetalness = 0.02;
        bumpScale = 0.04;
      }

      if (s.finish === 'satin') {
        baseRoughness = Math.max(0.16, baseRoughness - 0.28);
        clearcoat = 0.42;
      } else if (s.finish === 'anodized') {
        baseRoughness = 0.26;
        baseMetalness = Math.max(0.68, baseMetalness);
        clearcoat = 0.3;
      } else if (s.finish === 'weathered') {
        baseRoughness = Math.min(0.96, baseRoughness + 0.14);
        bumpScale *= 1.25;
      }

      shellMaterial.roughness = baseRoughness;
      shellMaterial.metalness = baseMetalness;
      shellMaterial.bumpScale = bumpScale;
      shellMaterial.clearcoat = clearcoat;
      shellMaterial.needsUpdate = true;

      const preset =
        LIGHTING_PRESETS.find((l) => l.id === s.lighting) ||
        LIGHTING_PRESETS[1];
      updateSkyGradient(preset.zenithHex, preset.horizonHex);
      scene.background = new THREE.Color(preset.horizonHex);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.set(preset.horizonHex);
      }
      scene.environmentIntensity = preset.envIntensity;

      // Rotate preset sun vector around Y axis by Solar Azimuth angle
      const azRad = THREE.MathUtils.degToRad(s.solarAzimuth);
      const [sx, sy, sz] = preset.sunPos;
      const cosA = Math.cos(azRad);
      const sinA = Math.sin(azRad);
      keyLight.position.set(
        sx * cosA - sz * sinA,
        sy,
        sx * sinA + sz * cosA
      );
      keyLight.color.setHex(preset.sunColor);
      keyLight.intensity = preset.sunIntensity;
      hemiLight.color.setHex(preset.hemiSky);
      hemiLight.groundColor.setHex(preset.hemiGround);
      hemiLight.intensity = preset.hemiIntensity;

      const glowMult = s.interiorLit ? 1.0 : 0.08;
      interiorLight.intensity = preset.interiorIntensity * glowMult;
      glowMaterial.emissiveIntensity =
        (0.6 + preset.interiorIntensity * 0.45) * glowMult;
      interiorHearth.visible = s.interiorLit;

      cadLines.forEach((line) => {
        line.visible = s.cadOverlay;
      });

      renderer.toneMappingExposure = preset.exposure;
      requestRender();
    };

    sceneActionsRef.current = {
      applyVisualState,
      setCameraTarget: (presetId: CameraPreset) => {
        const preset =
          CAMERA_PRESETS.find((c) => c.id === presetId) || CAMERA_PRESETS[0];
        desiredCamPos.set(...preset.position);
        desiredTarget.set(...preset.target);
        camTransitionActive = true;
        requestRender();
      },
      requestRender,
    };

    const onControlStart = () => {
      camTransitionActive = false;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    applyVisualState();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      controls.dispose();
      Object.values(textures).forEach((t) => {
        t.albedo.dispose();
        t.bump.dispose();
      });
      cadLines.forEach((l) => l.geometry.dispose());
      envRT.dispose();
      skyGeo.dispose();
      skyMat.dispose();
      skyTexture.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      hullGeo.dispose();
      louverGeo.dispose();

      pavilionGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
        }
      });

      shellMaterial.dispose();
      accentTrimMaterial.dispose();
      plinthMaterial.dispose();
      waterMaterial.dispose();
      glassMaterial.dispose();
      glowMaterial.dispose();
      wireframeLineMat.dispose();
      renderer.dispose();

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
      sceneActionsRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneActionsRef.current?.applyVisualState();
  }, [material, colorId, finish, lighting, solarAzimuth, interiorLit, cadOverlay]);

  useEffect(() => {
    sceneActionsRef.current?.requestRender();
  }, [exploded, louverAngle]);

  const handleCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    sceneActionsRef.current?.setCameraTarget(preset);
  };

  const handleResetLab = () => {
    setMaterial('concrete');
    setColorId('stone');
    setFinish('matte');
    setLighting('golden');
    setSolarAzimuth(0);
    setExploded(0);
    setLouverAngle(28);
    setInteriorLit(true);
    setCadOverlay(false);
    handleCameraPreset('hero');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#141513] text-[#F8F7F2] pt-16">
      {/* Isolated 3D WebGL Mount with touch-action: none */}
      {!webglError ? (
        <div
          ref={mountRef}
          data-cursor-label="Drag 3D"
          className="h-full w-full touch-none cursor-grab active:cursor-grabbing"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          <img
            src={HERO_IMAGE}
            alt="Monolith Pavilion fallback architectural studio view"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute bg-[#141513]/90 p-8 text-center border border-[#F8F7F2]/20">
            <h2 className="font-display text-2xl font-bold">
              3D WebGL Context Unavailable
            </h2>
            <p className="mt-2 text-sm text-[#A7A69F]">
              Hardware acceleration is currently unavailable in this browser session.
            </p>
          </div>
        </div>
      )}

      {/* Minimal Top-Left Specification Badge */}
      <div className="pointer-events-none fixed top-20 left-6 right-40 z-20 sm:right-auto lg:left-10">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#A7A69F]">
          Design Lab · Tectonic Pavilion Study
        </p>
        <h1 className="mt-1 font-display text-xl font-bold tracking-tight text-[#F8F7F2] sm:text-2xl">
          Cantilevered Monolith 01
        </h1>
        <p className="mt-1 text-xs text-[#E8E5DC]/85">
          {MATERIAL_OPTIONS.find((m) => m.id === material)?.label} ·{' '}
          {COLOR_OPTIONS.find((c) => c.id === colorId)?.label} ·{' '}
          {FINISH_OPTIONS.find((f) => f.id === finish)?.label} ·{' '}
          {LIGHTING_PRESETS.find((l) => l.id === lighting)?.label}
        </p>
      </div>

      {/* Top-Right Quick Reset Action */}
      <div className="fixed top-20 right-6 z-20 lg:right-10">
        <button
          type="button"
          onClick={handleResetLab}
          className="inline-flex min-h-[40px] items-center gap-2 border border-[#F8F7F2]/25 bg-[#141513]/85 px-3.5 py-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#F8F7F2] hover:bg-[#F8F7F2] hover:text-[#141513] transition-colors duration-200 cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Reset Model</span>
        </button>
      </div>

      {/* Unified Collapsible Bottom Control Dock (Zero Central Occlusion, No backdrop-blur) */}
      <div
        className={`fixed bottom-4 left-1/2 z-30 w-[min(940px,94vw)] -translate-x-1/2 transition-transform duration-300 ${
          dockCollapsed ? 'translate-y-[calc(100%-34px)]' : 'translate-y-0'
        }`}
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            className="inline-flex items-center gap-2 border border-b-0 border-[#F8F7F2]/20 bg-[#141513]/95 px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-[#E8E5DC] hover:text-[#F8F7F2] cursor-pointer"
          >
            {dockCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{dockCollapsed ? 'Show Controls (H)' : 'Hide Controls (H)'}</span>
          </button>
        </div>

        <div className="max-h-[46vh] overflow-y-auto border border-[#F8F7F2]/20 bg-[#141513]/95 p-4 shadow-2xl sm:p-5">
          {/* Dock Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F8F7F2]/12 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'material', label: 'Material & Finish' },
                  { id: 'lighting', label: 'Atmosphere & Light' },
                  { id: 'structure', label: 'Structure & Camera' },
                ] as { id: DockTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold tracking-[0.1em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#777C68] text-[#F8F7F2]'
                      : 'text-[#A7A69F] hover:text-[#F8F7F2]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCadOverlay((prev) => !prev)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider border transition-colors cursor-pointer whitespace-nowrap ${
                  cadOverlay
                    ? 'border-[#E8E5DC] bg-[#E8E5DC] text-[#141513]'
                    : 'border-[#F8F7F2]/20 text-[#A7A69F] hover:text-[#F8F7F2]'
                }`}
              >
                CAD Edges
              </button>
              <button
                type="button"
                onClick={() => setInteriorLit((prev) => !prev)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider border transition-colors cursor-pointer whitespace-nowrap ${
                  interiorLit
                    ? 'border-[#E8E5DC] bg-[#E8E5DC] text-[#141513]'
                    : 'border-[#F8F7F2]/20 text-[#A7A69F] hover:text-[#F8F7F2]'
                }`}
              >
                Interior Glow
              </button>
            </div>
          </div>

          {/* Tab Panel Content */}
          {activeTab === 'material' && (
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
              <div className="md:col-span-5">
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#A7A69F]">
                  Primary Material
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {MATERIAL_OPTIONS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMaterial(m.id)}
                      className={`border px-3 py-2 text-left transition-colors cursor-pointer ${
                        material === m.id
                          ? 'border-[#F8F7F2] bg-[#F8F7F2]/12 text-[#F8F7F2]'
                          : 'border-[#F8F7F2]/15 text-[#A7A69F] hover:border-[#F8F7F2]/40'
                      }`}
                    >
                      <span className="block text-xs font-semibold whitespace-nowrap">
                        {m.label}
                      </span>
                      <span className="block text-[10px] text-[#A7A69F]">
                        {m.summary}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-4">
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#A7A69F]">
                  Exterior Pigment
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => {
                    const active = colorId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setColorId(c.id)}
                        title={c.label}
                        className={`flex min-h-[36px] items-center gap-2 border px-2.5 py-1.5 text-xs transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'border-[#F8F7F2] bg-[#F8F7F2]/15 text-[#F8F7F2]'
                            : 'border-[#F8F7F2]/15 text-[#A7A69F] hover:border-[#F8F7F2]/40'
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 border border-white/30"
                          style={{ backgroundColor: c.hex }}
                          aria-hidden="true"
                        />
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-3">
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#A7A69F]">
                  Surface Finish
                </p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {FINISH_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFinish(f.id)}
                      className={`min-h-[36px] border px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        finish === f.id
                          ? 'border-[#F8F7F2] bg-[#F8F7F2] text-[#141513]'
                          : 'border-[#F8F7F2]/15 text-[#A7A69F] hover:border-[#F8F7F2]/40'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lighting' && (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#A7A69F]">
                  Solar &amp; Atmospheric Presets
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {LIGHTING_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setLighting(preset.id)}
                      className={`border px-4 py-3 text-left transition-colors cursor-pointer ${
                        lighting === preset.id
                          ? 'border-[#F8F7F2] bg-[#F8F7F2] text-[#141513]'
                          : 'border-[#F8F7F2]/20 text-[#E8E5DC] hover:border-[#F8F7F2]/50'
                      }`}
                    >
                      <span className="block text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                        {preset.label}
                      </span>
                      <span
                        className={`mt-1 block text-[11px] tabular-nums ${
                          lighting === preset.id
                            ? 'text-[#141513]/75'
                            : 'text-[#A7A69F]'
                        }`}
                      >
                        Env {preset.envIntensity.toFixed(2)} · Exp{' '}
                        {preset.exposure.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#F8F7F2]/12 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="solar-azimuth-slider"
                    className="font-semibold tracking-[0.12em] uppercase text-[#A7A69F]"
                  >
                    Solar Azimuth Sweep
                  </label>
                  <span className="tabular-nums font-semibold text-[#F8F7F2]">
                    {solarAzimuth > 0 ? `+${solarAzimuth}°` : `${solarAzimuth}°`}
                  </span>
                </div>
                <input
                  id="solar-azimuth-slider"
                  type="range"
                  min={-75}
                  max={75}
                  step={1}
                  value={solarAzimuth}
                  onChange={(e) => setSolarAzimuth(Number(e.target.value))}
                  className="mt-2 w-full accent-[#777C68] cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-12 md:items-center">
              <div className="md:col-span-4">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="explode-slider"
                    className="font-semibold tracking-[0.12em] uppercase text-[#A7A69F]"
                  >
                    Tectonic Explode
                  </label>
                  <span className="tabular-nums font-semibold text-[#F8F7F2]">
                    {exploded}%
                  </span>
                </div>
                <input
                  id="explode-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={exploded}
                  onChange={(e) => setExploded(Number(e.target.value))}
                  className="mt-2 w-full accent-[#777C68] cursor-pointer"
                />
              </div>

              <div className="md:col-span-4">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="louver-slider"
                    className="font-semibold tracking-[0.12em] uppercase text-[#A7A69F]"
                  >
                    Brise-Soleil Louvers
                  </label>
                  <span className="tabular-nums font-semibold text-[#F8F7F2]">
                    {louverAngle}°
                  </span>
                </div>
                <input
                  id="louver-slider"
                  type="range"
                  min={0}
                  max={75}
                  value={louverAngle}
                  onChange={(e) => setLouverAngle(Number(e.target.value))}
                  className="mt-2 w-full accent-[#777C68] cursor-pointer"
                />
              </div>

              <div className="md:col-span-4">
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#A7A69F]">
                  Camera Angles
                </p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {CAMERA_PRESETS.map((cam) => (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => handleCameraPreset(cam.id)}
                      className={`min-h-[36px] border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        cameraPreset === cam.id
                          ? 'border-[#F8F7F2] bg-[#F8F7F2] text-[#141513]'
                          : 'border-[#F8F7F2]/20 text-[#E8E5DC] hover:border-[#F8F7F2]/50'
                      }`}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
