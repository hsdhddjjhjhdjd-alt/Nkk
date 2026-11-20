import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { PROJECTS, ProjectItem, PageRoute } from '../data/projects';

interface InfiniteDimensionGalleryProps {
  onSelectProject: (projectId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

interface PlateDimensions {
  width: number;
  height: number;
  yOffset: number;
}

const PLATE_PROPORTIONS: PlateDimensions[] = [
  { width: 3.7, height: 2.2, yOffset: 0.45 },
  { width: 2.35, height: 3.05, yOffset: -0.55 },
  { width: 3.4, height: 2.25, yOffset: 0.8 },
  { width: 2.8, height: 2.8, yOffset: -0.3 },
  { width: 3.6, height: 2.1, yOffset: 0.35 },
  { width: 2.4, height: 3.1, yOffset: -0.65 },
  { width: 3.25, height: 2.3, yOffset: 0.65 },
  { width: 2.9, height: 2.55, yOffset: -0.25 },
];

// Reusable math helpers allocated outside the per-frame render loop
const _pointer = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();
const _targetScale = new THREE.Vector3();
const _worldPos = new THREE.Vector3();

export const InfiniteDimensionGallery: React.FC<
  InfiniteDimensionGalleryProps
> = ({ onSelectProject, onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const [hoveredProject, setHoveredProject] = useState<ProjectItem | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [expandedProject, setExpandedProject] = useState<ProjectItem | null>(
    null
  );
  const [webglFallback, setWebglFallback] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);

  const interactionRef = useRef<{
    hoveredIdx: number | null;
    expanded: boolean;
    reducedMotion: boolean;
    focusIndex: (index: number) => void;
  }>({
    hoveredIdx: null,
    expanded: false,
    reducedMotion: false,
    focusIndex: () => {},
  });

  interactionRef.current.expanded = expandedProject !== null;
  interactionRef.current.reducedMotion = prefersReducedMotion;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Keyboard navigation & Escape handler for full-screen presentation
  useEffect(() => {
    if (!expandedProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedProject(null);
      } else if (e.key === 'ArrowRight') {
        setExpandedProject((prev) => {
          if (!prev) return null;
          const idx = PROJECTS.findIndex((p) => p.id === prev.id);
          return PROJECTS[(idx + 1) % PROJECTS.length];
        });
      } else if (e.key === 'ArrowLeft') {
        setExpandedProject((prev) => {
          if (!prev) return null;
          const idx = PROJECTS.findIndex((p) => p.id === prev.id);
          return PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expandedProject]);

  useEffect(() => {
    const container = mountRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

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
      setWebglFallback(true);
      return;
    }

    const canvas = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFallback(true);
    };
    const handleContextRestored = () => {
      setWebglFallback(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(container.clientWidth, Math.max(container.clientHeight, 1));
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0d0b);
    scene.fog = new THREE.FogExp2(0x0c0d0b, 0.044);

    // Subtle procedural studio environment for frame reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.55;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const width = container.clientWidth;
    const height = Math.max(container.clientHeight, 1);
    const isNarrow = width < 768;

    const camera = new THREE.PerspectiveCamera(
      isNarrow ? 50 : 40,
      width / height,
      0.1,
      100
    );
    camera.position.set(0, 1.35, isNarrow ? 15.2 : 12.6);

    // Architectural warm/cool lighting rig
    const hemiLight = new THREE.HemisphereLight(0xd6d3c9, 0x141513, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf3ebd9, 1.65);
    keyLight.position.set(8, 12, 14);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x777c68, 0.9);
    rimLight.position.set(-10, -4, -10);
    scene.add(rimLight);

    // Spatial Trajectory Group
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = 0.085;
    orbitGroup.rotation.z = -0.04;
    scene.add(orbitGroup);

    const radiusX = isNarrow ? 8.2 : 10.6;
    const radiusZ = isNarrow ? 5.6 : 6.5;

    // Architectural Datum Ellipses (subtle spatial path indicators)
    const createDatumRing = (
      rx: number,
      rz: number,
      yPos: number,
      color: number,
      opacity: number
    ) => {
      const points: THREE.Vector3[] = [];
      const segments = 96;
      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * rx, yPos, Math.sin(a) * rz));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
      });
      return { loop: new THREE.LineLoop(geo, mat), geo, mat };
    };

    const datumOuter = createDatumRing(
      radiusX + 0.65,
      radiusZ + 0.65,
      -1.35,
      0x777c68,
      0.28
    );
    const datumInner = createDatumRing(
      radiusX * 0.72,
      radiusZ * 0.72,
      1.55,
      0xe8e5dc,
      0.12
    );
    orbitGroup.add(datumOuter.loop);
    orbitGroup.add(datumInner.loop);

    // Texture loader with SRGB & anisotropy
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const loadedTextures: THREE.Texture[] = [];

    interface PlateNode {
      index: number;
      project: ProjectItem;
      group: THREE.Group;
      hitMesh: THREE.Mesh;
      photoMat: THREE.MeshStandardMaterial;
      frameMat: THREE.LineBasicMaterial;
      baseAngle: number;
      yOffset: number;
      currentHover: number;
      currentOpacity: number;
      currentScale: number;
    }

    const plateNodes: PlateNode[] = [];
    const hitTargets: THREE.Mesh[] = [];
    const disposableGeometries: THREE.BufferGeometry[] = [];
    const disposableMaterials: THREE.Material[] = [];

    const backingMat = new THREE.MeshStandardMaterial({
      color: 0x181917,
      roughness: 0.38,
      metalness: 0.82,
    });
    disposableMaterials.push(backingMat);

    PROJECTS.forEach((project, idx) => {
      const prop = PLATE_PROPORTIONS[idx % PLATE_PROPORTIONS.length];
      const baseAngle = (idx / PROJECTS.length) * Math.PI * 2;

      const group = new THREE.Group();
      orbitGroup.add(group);

      const tex = textureLoader.load(project.heroImage);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAnisotropy;
      loadedTextures.push(tex);

      const photoGeo = new THREE.PlaneGeometry(prop.width, prop.height);
      const photoMat = new THREE.MeshStandardMaterial({
        map: tex,
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveMap: tex,
        emissiveIntensity: 0.42,
        roughness: 0.48,
        metalness: 0.04,
        transparent: true,
        opacity: 1,
      });
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.position.z = 0.02;
      photoMesh.userData.plateIndex = idx;
      group.add(photoMesh);

      // Recessed anodized backing slab
      const slabGeo = new THREE.BoxGeometry(
        prop.width + 0.14,
        prop.height + 0.14,
        0.05
      );
      const slabMesh = new THREE.Mesh(slabGeo, backingMat);
      slabMesh.position.z = -0.025;
      group.add(slabMesh);

      // Perimeter architectural hairline border
      const edgesGeo = new THREE.EdgesGeometry(slabGeo, 25);
      const frameMat = new THREE.LineBasicMaterial({
        color: 0xa7a69f,
        transparent: true,
        opacity: 0.36,
      });
      const frameLines = new THREE.LineSegments(edgesGeo, frameMat);
      slabMesh.add(frameLines);

      disposableGeometries.push(photoGeo, slabGeo, edgesGeo);
      disposableMaterials.push(photoMat, frameMat);
      hitTargets.push(photoMesh);

      plateNodes.push({
        index: idx,
        project,
        group,
        hitMesh: photoMesh,
        photoMat,
        frameMat,
        baseAngle,
        yOffset: prop.yOffset,
        currentHover: 0,
        currentOpacity: 1,
        currentScale: 1,
      });
    });

    // Motion & Input State
    let orbitAngle = Math.PI * 0.5; // Place Project 01 facing front at start
    let targetOrbitOffset = 0;
    let currentOrbitOffset = 0;
    let scrollMomentum = 0;
    let pointerNormX = 0;
    let pointerNormY = 0;
    let smoothCamX = 0;
    let smoothCamY = 1.35;
    let smoothLookX = 0;
    let smoothLookY = 0;

    let isPointerInside = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragDistance = 0;
    let lastDragX = 0;
    let lastRaycastTime = 0;
    let lastScrollY = window.scrollY;
    let lastFocusedFront = 0;

    const updatePointerFromClient = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      _pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      pointerNormX = THREE.MathUtils.clamp(_pointer.x, -1, 1);
      pointerNormY = THREE.MathUtils.clamp(_pointer.y, -1, 1);
    };

    const performRaycast = () => {
      if (interactionRef.current.expanded) return;
      _raycaster.setFromCamera(_pointer, camera);
      const hits = _raycaster.intersectObjects(hitTargets, false);
      const nextIdx =
        hits.length > 0 && typeof hits[0].object.userData.plateIndex === 'number'
          ? (hits[0].object.userData.plateIndex as number)
          : null;

      if (interactionRef.current.hoveredIdx !== nextIdx) {
        interactionRef.current.hoveredIdx = nextIdx;
        setHoveredProject(nextIdx !== null ? PROJECTS[nextIdx] : null);
        canvas.style.cursor = nextIdx !== null ? 'pointer' : 'grab';
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (interactionRef.current.expanded) return;
      isPointerInside = true;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      lastDragX = e.clientX;
      dragDistance = 0;
      updatePointerFromClient(e.clientX, e.clientY);
      if (e.pointerType === 'touch') {
        performRaycast();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (interactionRef.current.expanded) return;
      isPointerInside = true;
      updatePointerFromClient(e.clientX, e.clientY);

      if (isDragging) {
        const dx = e.clientX - lastDragX;
        const dy = e.clientY - dragStartY;
        dragDistance = Math.hypot(e.clientX - dragStartX, dy);
        lastDragX = e.clientX;
        targetOrbitOffset -= dx * 0.0052;
        canvas.style.cursor = 'grabbing';
        return;
      }

      const now = performance.now();
      if (now - lastRaycastTime >= 36) {
        lastRaycastTime = now;
        performRaycast();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      updatePointerFromClient(e.clientX, e.clientY);

      if (dragDistance <= 7 && !interactionRef.current.expanded) {
        _raycaster.setFromCamera(_pointer, camera);
        const hits = _raycaster.intersectObjects(hitTargets, false);
        if (hits.length > 0) {
          const hitIdx = hits[0].object.userData.plateIndex;
          if (typeof hitIdx === 'number') {
            setExpandedProject(PROJECTS[hitIdx]);
          }
        }
      }
      performRaycast();
    };

    const onPointerLeave = () => {
      isPointerInside = false;
      isDragging = false;
      pointerNormX = 0;
      pointerNormY = 0;
      if (interactionRef.current.hoveredIdx !== null) {
        interactionRef.current.hoveredIdx = null;
        setHoveredProject(null);
      }
      canvas.style.cursor = 'grab';
    };

    const onWindowScroll = () => {
      const currentY = window.scrollY;
      const dy = currentY - lastScrollY;
      lastScrollY = currentY;
      const rect = section.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        scrollMomentum = THREE.MathUtils.clamp(
          scrollMomentum + dy * 0.0014,
          -0.65,
          0.65
        );
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onWindowScroll, { passive: true });

    interactionRef.current.focusIndex = (index: number) => {
      const targetAngle = Math.PI * 0.5 - (index / PROJECTS.length) * Math.PI * 2;
      const fullCurrent = orbitAngle + currentOrbitOffset;
      let diff = targetAngle - fullCurrent;
      diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      if (diff < -Math.PI) diff += Math.PI * 2;
      targetOrbitOffset += diff;
    };

    // Pause animation loop when off-screen
    let isSectionVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isSectionVisible = entries[0]?.isIntersecting ?? true;
        if (isSectionVisible && !running) {
          lastTime = performance.now();
          scheduleNext();
        }
      },
      { threshold: 0.02 }
    );
    observer.observe(section);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      const narrow = w < 768;
      camera.fov = narrow ? 50 : 40;
      camera.aspect = w / h;
      camera.position.z = narrow ? 15.2 : 12.6;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let running = true;
    let disposed = false;
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
        if (disposed) return;
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

    function scheduleNext() {
      if (disposed || !isSectionVisible) {
        running = false;
        return;
      }
      running = true;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    function tick() {
      if (disposed || !isSectionVisible) {
        running = false;
        return;
      }

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const hoveredIdx = interactionRef.current.hoveredIdx;
      const hasHover = hoveredIdx !== null;
      const isPaused = interactionRef.current.expanded;
      const isReducedMotion = interactionRef.current.reducedMotion;

      // Continuous elliptical progression (paused gracefully when expanded or reduced-motion)
      const autoSpeed =
        isReducedMotion || isPaused ? 0 : hasHover ? 0.01 : 0.068;
      orbitAngle = (orbitAngle + (autoSpeed + scrollMomentum) * delta) % (Math.PI * 2);
      scrollMomentum = THREE.MathUtils.damp(scrollMomentum, 0, 4.5, delta);
      currentOrbitOffset = THREE.MathUtils.damp(
        currentOrbitOffset,
        targetOrbitOffset,
        6.5,
        delta
      );

      const activeTotalAngle = orbitAngle + currentOrbitOffset;

      // Subtle camera perspective response to pointer position
      const targetCamX =
        isPointerInside && !isReducedMotion ? pointerNormX * 1.15 : 0;
      const targetCamY =
        1.35 + (isPointerInside && !isReducedMotion ? pointerNormY * 0.55 : 0);
      const targetLookX =
        isPointerInside && !isReducedMotion ? pointerNormX * 0.55 : 0;
      const targetLookY =
        isPointerInside && !isReducedMotion ? pointerNormY * 0.25 : 0;

      smoothCamX = THREE.MathUtils.damp(smoothCamX, targetCamX, 4.2, delta);
      smoothCamY = THREE.MathUtils.damp(smoothCamY, targetCamY, 4.2, delta);
      smoothLookX = THREE.MathUtils.damp(smoothLookX, targetLookX, 4.2, delta);
      smoothLookY = THREE.MathUtils.damp(smoothLookY, targetLookY, 4.2, delta);

      camera.position.x = smoothCamX;
      camera.position.y = smoothCamY;
      camera.lookAt(smoothLookX, smoothLookY, 0);

      // Update each architectural plate along the elliptical trajectory
      let frontmostIdx = 0;
      let maxZ = -Infinity;

      for (let i = 0; i < plateNodes.length; i++) {
        const node = plateNodes[i];
        const theta = node.baseAngle + activeTotalAngle;

        const baseX = Math.cos(theta) * radiusX;
        const baseZ = Math.sin(theta) * radiusZ;
        const waveY =
          node.yOffset +
          (isReducedMotion ? 0 : Math.sin(theta * 2 + i * 0.7) * 0.35);

        const isHovered = hoveredIdx === i;
        const hoverTarget = isHovered ? 1 : 0;
        node.currentHover = THREE.MathUtils.damp(
          node.currentHover,
          hoverTarget,
          8.5,
          delta
        );

        // Depth normalization along Z (-radiusZ .. +radiusZ)
        const depthNorm = THREE.MathUtils.clamp(
          (baseZ + radiusZ) / (radiusZ * 2),
          0,
          1
        );

        // Pull hovered plate subtly toward viewer
        const radialLift = node.currentHover * 0.9;
        const normLen = Math.hypot(baseX, baseZ) || 1;
        node.group.position.set(
          baseX + (baseX / normLen) * radialLift * 0.35,
          waveY + node.currentHover * 0.16,
          baseZ + (baseZ / normLen) * radialLift
        );

        // Subtle tangent/perspective orientation toward the center + viewer
        const tangentYaw = -Math.atan2(
          Math.cos(theta) * radiusZ,
          -Math.sin(theta) * radiusX
        );
        // Blend between radial facing and camera-facing as plates come forward
        const faceCamFactor = THREE.MathUtils.lerp(
          0.35,
          0.85,
          Math.max(depthNorm, node.currentHover)
        );
        node.group.rotation.y = THREE.MathUtils.lerp(
          tangentYaw * 0.25,
          -Math.sin(theta) * 0.28,
          faceCamFactor
        ) * (1 - node.currentHover * 0.65);
        node.group.rotation.x = (1 - depthNorm) * 0.04 * (1 - node.currentHover);

        // Scale varies with depth + hover amplification
        const depthScale = THREE.MathUtils.lerp(0.72, 1.06, depthNorm);
        const targetScale = isHovered
          ? depthScale * 1.15
          : hasHover
            ? depthScale * 0.93
            : depthScale;
        node.currentScale = THREE.MathUtils.damp(
          node.currentScale,
          targetScale,
          7.5,
          delta
        );
        _targetScale.setScalar(node.currentScale);
        node.group.scale.copy(_targetScale);

        // Luminance & visual prominence contrast on hover
        const targetOpacity = isHovered
          ? 1.0
          : hasHover
            ? 0.28
            : THREE.MathUtils.lerp(0.46, 1.0, depthNorm);
        node.currentOpacity = THREE.MathUtils.damp(
          node.currentOpacity,
          targetOpacity,
          7.5,
          delta
        );
        node.photoMat.opacity = node.currentOpacity;
        node.photoMat.emissiveIntensity = THREE.MathUtils.lerp(
          0.25,
          isHovered ? 0.68 : 0.5,
          Math.max(depthNorm, node.currentHover)
        );

        node.frameMat.opacity = isHovered
          ? 0.95
          : hasHover
            ? 0.12
            : THREE.MathUtils.lerp(0.18, 0.55, depthNorm);
        node.frameMat.color.setHex(isHovered ? 0xe8e5dc : 0x777c68);

        node.group.getWorldPosition(_worldPos);
        node.hitMesh.renderOrder = Math.round((_worldPos.z + 20) * 100);
        if (_worldPos.z > maxZ) {
          maxZ = _worldPos.z;
          frontmostIdx = i;
        }
      }

      if (frontmostIdx !== lastFocusedFront) {
        lastFocusedFront = frontmostIdx;
        setFocusedIndex(frontmostIdx);
      }

      renderer.render(scene, camera);
      scheduleNext();
    }

    // Start render loop
    tick();

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('scroll', onWindowScroll);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      datumOuter.geo.dispose();
      datumOuter.mat.dispose();
      datumInner.geo.dispose();
      datumInner.mat.dispose();
      disposableGeometries.forEach((g) => g.dispose());
      disposableMaterials.forEach((m) => m.dispose());
      loadedTextures.forEach((t) => t.dispose());
      envRT.dispose();
      renderer.dispose();

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  const activeCaptionProject = hoveredProject || PROJECTS[focusedIndex];

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="Infinite Dimension Spatial Exhibition"
        className="relative overflow-hidden border-t border-[#F8F7F2]/12 bg-[#0C0D0B] text-[#F8F7F2]"
      >
        {/* Top Exhibition Header Bar */}
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-20 pb-6 lg:px-12 lg:pt-24">
          <div className="flex flex-col gap-6 border-b border-[#F8F7F2]/12 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#777C68]">
                Infinite Dimension · Chapter 04
              </p>
              <h2 className="mt-2 font-display text-[clamp(2rem,3.6vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.025em] [text-wrap:balance]">
                Spatial Trajectory Exhibition
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <p className="max-w-sm font-editorial text-lg italic leading-snug text-[#A7A69F]">
                Move, scroll, or drag through the elliptical orbit. Hover any plate to isolate; select to expand full-screen.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('discover')}
                className="inline-flex min-h-[42px] items-center gap-2 border border-[#F8F7F2]/25 px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase text-[#F8F7F2] hover:bg-[#F8F7F2] hover:text-[#141513] transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                <span>Filter Full Archive</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Central 3D Spatial Viewport */}
        <div className="relative h-[500px] w-full sm:h-[580px] lg:h-[660px]">
          {!webglFallback ? (
            <div
              ref={mountRef}
              className="h-full w-full touch-pan-y select-none cursor-grab"
            />
          ) : (
            <div className="mx-auto flex h-full max-w-[1440px] items-center justify-center px-6 lg:px-12">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {PROJECTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setExpandedProject(p)}
                    className="group relative overflow-hidden border border-[#F8F7F2]/15 text-left cursor-pointer"
                  >
                    <img
                      src={p.heroImage}
                      alt={p.title}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="p-3 bg-[#141513]">
                      <span className="text-[10px] tracking-widest uppercase text-[#777C68] tabular-nums">
                        {p.indexNumber}
                      </span>
                      <p className="mt-0.5 font-display text-sm font-bold text-[#F8F7F2]">
                        {p.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active / Hovered Plate Architectural Metadata Overlay (No backdrop-blur over WebGL) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="flex flex-col gap-4 border-t border-[#F8F7F2]/12 bg-[#0C0D0B]/88 pt-4 pb-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="pointer-events-auto">
                <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#777C68]">
                  <span className="tabular-nums">
                    {activeCaptionProject.indexNumber} / 0{PROJECTS.length}
                  </span>
                  <span>·</span>
                  <span>{activeCaptionProject.style}</span>
                  {hoveredProject && (
                    <>
                      <span>·</span>
                      <span className="text-[#E8E5DC]">Isolated Focus</span>
                    </>
                  )}
                </div>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#F8F7F2] sm:text-3xl">
                  {activeCaptionProject.title}
                </h3>
                <p className="mt-1 text-xs text-[#A7A69F]">
                  {activeCaptionProject.architect} ({activeCaptionProject.studio}) ·{' '}
                  {activeCaptionProject.location}, {activeCaptionProject.country} ·{' '}
                  <span className="tabular-nums">
                    {activeCaptionProject.cantileverMeters}m Cantilever
                  </span>
                </p>
              </div>

              <div className="pointer-events-auto flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setExpandedProject(activeCaptionProject)}
                  className="inline-flex min-h-[42px] items-center gap-2 bg-[#F8F7F2] px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#141513] hover:bg-[#E8E5DC] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Expand Plate</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Accessible Index Navigator Strip & Design Lab Quick Entry */}
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-16 pt-2 lg:px-12 lg:pb-20">
          <div className="flex flex-col gap-4 border-t border-[#F8F7F2]/12 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="tablist"
              aria-label="Orbiting Architectural Works"
              className="flex flex-wrap items-center gap-1.5"
            >
              {PROJECTS.map((project, idx) => {
                const isCurrent =
                  (hoveredProject && hoveredProject.id === project.id) ||
                  (!hoveredProject && focusedIndex === idx);
                return (
                  <button
                    key={project.id}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => interactionRef.current.focusIndex(idx)}
                    onDoubleClick={() => setExpandedProject(project)}
                    title={`${project.indexNumber} — ${project.title}`}
                    className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold tabular-nums tracking-[0.12em] uppercase transition-colors cursor-pointer border ${
                      isCurrent
                        ? 'border-[#F8F7F2] bg-[#F8F7F2] text-[#141513]'
                        : 'border-[#F8F7F2]/15 text-[#A7A69F] hover:border-[#F8F7F2]/45 hover:text-[#F8F7F2]'
                    }`}
                  >
                    {project.indexNumber}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('design-lab')}
              className="inline-flex min-h-[38px] items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-[#E8E5DC] hover:text-[#777C68] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Enter 3D Design Lab</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Full-Screen Cinematic Presentation Modal */}
      <AnimatePresence>
        {expandedProject && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={expandedProject.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-[#0D0E0C]/98 px-6 py-6 text-[#F8F7F2] lg:px-12 lg:py-10"
          >
            {/* Top Bar */}
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between border-b border-[#F8F7F2]/15 pb-5">
              <div className="flex items-center gap-4">
                <span className="font-display text-sm font-bold tracking-[0.16em] text-[#777C68] tabular-nums">
                  PLATE {expandedProject.indexNumber} / 0{PROJECTS.length}
                </span>
                <span className="hidden text-xs tracking-[0.14em] uppercase text-[#A7A69F] sm:inline">
                  {expandedProject.coordinates}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setExpandedProject(null)}
                className="inline-flex min-h-[42px] items-center gap-2 border border-[#F8F7F2]/25 px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#F8F7F2] hover:bg-[#F8F7F2] hover:text-[#141513] transition-colors cursor-pointer"
              >
                <X size={15} />
                <span>Return to Spatial Gallery</span>
              </button>
            </div>

            {/* Central Architectural Presentation */}
            <div className="mx-auto my-8 grid w-full max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <motion.div
                key={expandedProject.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden border border-[#F8F7F2]/15 bg-[#141513] lg:col-span-7"
              >
                <img
                  src={expandedProject.heroImage}
                  alt={expandedProject.title}
                  className="max-h-[60vh] w-full object-cover"
                />
              </motion.div>

              <div className="lg:col-span-5">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#777C68]">
                  {expandedProject.style} · {expandedProject.buildingType}
                </p>
                <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#F8F7F2] sm:text-4xl">
                  {expandedProject.title}
                </h2>
                <p className="mt-4 font-editorial text-xl italic leading-relaxed text-[#E8E5DC]">
                  &ldquo;{expandedProject.philosophy}&rdquo;
                </p>
                <p className="mt-5 text-sm leading-relaxed text-[#A7A69F]">
                  {expandedProject.summary}
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[#F8F7F2]/15 pt-5 text-xs">
                  <div>
                    <dt className="tracking-[0.14em] uppercase text-[#777C68]">
                      Architect
                    </dt>
                    <dd className="mt-1 font-medium text-[#F8F7F2]">
                      {expandedProject.architect}
                    </dd>
                  </div>
                  <div>
                    <dt className="tracking-[0.14em] uppercase text-[#777C68]">
                      Location
                    </dt>
                    <dd className="mt-1 font-medium text-[#F8F7F2]">
                      {expandedProject.location}, {expandedProject.country}
                    </dd>
                  </div>
                  <div>
                    <dt className="tracking-[0.14em] uppercase text-[#777C68]">
                      Area / Year
                    </dt>
                    <dd className="mt-1 font-medium text-[#F8F7F2] tabular-nums">
                      {expandedProject.areaSqm.toLocaleString()} m² ·{' '}
                      {expandedProject.year}
                    </dd>
                  </div>
                  <div>
                    <dt className="tracking-[0.14em] uppercase text-[#777C68]">
                      Cantilever Span
                    </dt>
                    <dd className="mt-1 font-medium text-[#F8F7F2] tabular-nums">
                      {expandedProject.cantileverMeters.toFixed(1)} m
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const id = expandedProject.id;
                      setExpandedProject(null);
                      onSelectProject(id);
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 bg-[#F8F7F2] px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase text-[#141513] hover:bg-[#E8E5DC] transition-colors cursor-pointer"
                  >
                    <span>Open Full Monograph</span>
                    <ArrowUpRight size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedProject(null)}
                    className="inline-flex min-h-[44px] items-center gap-2 border border-[#F8F7F2]/25 px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#E8E5DC] hover:border-[#F8F7F2] hover:text-[#F8F7F2] transition-colors cursor-pointer"
                  >
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sequential Plate Footer Navigation */}
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between border-t border-[#F8F7F2]/15 pt-5 text-xs">
              <button
                type="button"
                onClick={() => {
                  const idx = PROJECTS.findIndex(
                    (p) => p.id === expandedProject.id
                  );
                  setExpandedProject(
                    PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length]
                  );
                }}
                className="inline-flex min-h-[40px] items-center gap-2 tracking-[0.14em] uppercase text-[#E8E5DC] hover:text-[#F8F7F2] cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Previous Plate</span>
              </button>

              <span className="hidden text-[#A7A69F] sm:inline">
                Use ← / → keys to step · ESC to return
              </span>

              <button
                type="button"
                onClick={() => {
                  const idx = PROJECTS.findIndex(
                    (p) => p.id === expandedProject.id
                  );
                  setExpandedProject(PROJECTS[(idx + 1) % PROJECTS.length]);
                }}
                className="inline-flex min-h-[40px] items-center gap-2 tracking-[0.14em] uppercase text-[#E8E5DC] hover:text-[#F8F7F2] cursor-pointer"
              >
                <span>Next Plate</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
