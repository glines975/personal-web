"use client";

import { useEffect, useRef, useState } from "react";

type Project = {
  id: string;
  title: string;
  type: string;
  year: string;
  sector: string;
  x: number;
  y: number;
  shape: string;
  description: string;
  concept: string;
};

const projects: Project[] = [
  {
    id: "AR-01",
    title: "Radiant Spire",
    type: "Cultural / Mixed Use",
    year: "2026",
    sector: "Sector 7–G",
    x: 52,
    y: 46,
    shape: "spire",
    description:
      "A vertical civic archive where light is treated as a building material, threading public rooms through a luminous structural core.",
    concept: "LIGHT AS MEMORY",
  },
  {
    id: "AR-02",
    title: "Veil Library",
    type: "Library / Research",
    year: "2025",
    sector: "Sector 4–N",
    x: 25,
    y: 28,
    shape: "library",
    description:
      "An introverted repository wrapped in translucent stone, revealing its hidden circulation as dusk falls.",
    concept: "KNOWLEDGE IN VEILS",
  },
  {
    id: "AR-03",
    title: "Tidal Reliquary",
    type: "Landscape / Memorial",
    year: "2025",
    sector: "Sector 9–E",
    x: 76,
    y: 66,
    shape: "reliquary",
    description:
      "A tidal archive that appears and disappears with the waterline, recording time through erosion, reflection and ritual.",
    concept: "TIDE AS CLOCK",
  },
  {
    id: "AR-04",
    title: "Taikoo Wharf",
    type: "Urban / Waterfront",
    year: "2024",
    sector: "Sector 5–K",
    x: 64,
    y: 34,
    shape: "garden",
    description:
      "A waterfront intervention that stitches public circulation, heritage fragments, and vertical volumes into a civic landscape.",
    concept: "PUBLIC HARBOUR RITUAL",
  },
  {
    id: "AR-05",
    title: "Aging City",
    type: "Urban / Mobility",
    year: "2024",
    sector: "Sector 2–W",
    x: 18,
    y: 74,
    shape: "garden",
    description:
      "A vertical mobility belt that links rooftops, parks, and facades into a barrier-free network for aging communities.",
    concept: "VERTICAL VITALITY",
  },
];

function ParticleField({ calm = false }: { calm?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: globalThis.PointerEvent) => {
      pointerX = (event.clientX / width - 0.5) * 18;
      pointerY = (event.clientY / height - 0.5) * 10;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const horizon = height * (calm ? 0.72 : 0.44);
      const rows = calm ? 16 : 32;
      const cols = calm ? 36 : 58;
      ctx.save();
      ctx.translate(pointerX, pointerY);
      for (let z = 1; z < rows; z++) {
        const depth = z / rows;
        const y = horizon + Math.pow(depth, 1.8) * height * 0.72;
        const spread = width * (0.18 + depth * 1.15);
        for (let x = 0; x < cols; x++) {
          const px = width / 2 - spread / 2 + (x / (cols - 1)) * spread;
          const wave =
            Math.sin(x * 0.55 + z * 0.3 + time * 0.00028) * (5 + depth * 10);
          const alpha = (calm ? 0.08 : 0.11) + depth * (calm ? 0.08 : 0.32);
          ctx.fillStyle = `rgba(${x % 9 === 0 ? "143,119,181" : "202,203,211"},${alpha})`;
          ctx.beginPath();
          ctx.arc(px, y + wave, calm ? 0.55 : 0.75 + depth, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!calm) {
        const towers = [
          [0.34, 0.32, 150],
          [0.5, 0.22, 245],
          [0.63, 0.35, 110],
          [0.76, 0.3, 180],
        ];
        towers.forEach(([tx, ty, h], index) => {
          const baseX = width * tx + pointerX * (index + 1) * 0.1;
          const baseY = horizon + height * ty;
          const lines = 10 + index * 3;
          for (let i = 0; i < lines; i++) {
            const offset = (i - lines / 2) * 4.5;
            const flicker = 0.12 + Math.sin(time * 0.001 + i) * 0.045;
            ctx.strokeStyle = `rgba(${index === 1 ? "149,122,195" : "203,205,215"},${flicker})`;
            ctx.beginPath();
            ctx.moveTo(baseX + offset, baseY);
            ctx.lineTo(baseX + offset * 0.5, baseY - h - Math.sin(i) * 18);
            ctx.stroke();
          }
        });
      }
      ctx.restore();
      if (!reduced) frame = requestAnimationFrame(render);
    };
    render(0);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, [calm]);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}

function Hud({
  view,
  portfolioOpen,
  menuOpen,
  setMenuOpen,
  goTo,
  musicOn,
  toggleMusic,
}: {
  view: string;
  portfolioOpen: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  goTo: (view: "portal" | "map" | "about") => void;
  musicOn: boolean;
  toggleMusic: () => void;
}) {
  return (
    <header className={`hud ${view === "portal" ? "hud-hidden" : ""}`}>
      <button className="brand-mark" onClick={() => goTo("map")} aria-label="返回地图">
        <span className="brand-glyph">L</span>
        <span>LUMEN</span>
      </button>
      <div className="hud-location">
        <span className="live-dot" />
        {portfolioOpen
          ? "FEATURED WORKS"
          : view === "map"
            ? "SECTOR 7–G"
            : view === "about"
              ? "RECORD C–01"
              : "ARCHIVE AR–01"}
      </div>
      <button
        className="music-toggle"
        onClick={toggleMusic}
        aria-label={musicOn ? "关闭背景音乐" : "开启背景音乐"}
        aria-pressed={musicOn}
      />
      <button
        className="sector-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-controls="global-menu"
      >
        INDEX <span>{menuOpen ? "×" : "＋"}</span>
      </button>
      <div id="global-menu" className={`global-menu ${menuOpen ? "is-open" : ""}`}>
        <div className="menu-code">LUMEN / ROOT DIRECTORY</div>
        <button onClick={() => goTo("portal")}><span>01</span> PORTAL</button>
        <button onClick={() => goTo("map")}><span>02</span> CITY MAP</button>
        <button onClick={() => goTo("about")}><span>03</span> CREATOR&apos;S RECORD</button>
        <a href="mailto:hello@lumen.archive"><span>04</span> CONTACT</a>
      </div>
    </header>
  );
}

function Portal({
  onEnter,
  onUnlock,
  onOpening,
}: {
  onEnter: () => void;
  onUnlock: () => void;
  onOpening: () => void;
}) {
  const [phase, setPhase] = useState<"cover" | "ready" | "zooming" | "opening">("cover");
  const [cover2Visible, setCover2Visible] = useState(false);
  const [cover3Visible, setCover3Visible] = useState(false);
  const timersRef = useRef<number[]>([]);
  const finishingRef = useRef(false);

  useEffect(() => {
    // cover2 starts at 0.6s, runs 10.5s (last 0.5s = hold after footprints gone)
    const COVER2_START = 600;
    const COVER2_DURATION = 10500;
    const FOOTPRINTS_END = COVER2_START + COVER2_DURATION;
    // Leah starts a bit earlier so her reveal feels faster
    const COVER3_START = 2400;

    const timers = [
      window.setTimeout(() => setCover2Visible(true), COVER2_START),
      window.setTimeout(() => setCover3Visible(true), COVER3_START),
      window.setTimeout(() => setPhase("ready"), COVER3_START),
      // Music starts when cover3 appears
      window.setTimeout(onUnlock, COVER3_START),
      // Switch after footprints finish + 0.5s end hold baked into cover2
      window.setTimeout(onOpening, FOOTPRINTS_END),
      window.setTimeout(onEnter, FOOTPRINTS_END + 200),
    ];
    timersRef.current = timers;
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const finishToMap = (delayMs: number) => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    setPhase("opening");
    onUnlock();
    onOpening();
    window.setTimeout(onEnter, delayMs);
  };

  // Click anytime during the opening sequence to skip into the map.
  const skipOpening = () => {
    if (phase === "opening") return;
    finishToMap(420);
  };

  return (
    <main className={`portal is-${phase}${phase === "opening" ? " is-opening" : ""}`}>
      <button
        className="sealed-scroll"
        onClick={skipOpening}
        aria-label="点击跳过开场，进入主页"
      >
        <span className="portal-cover portal-cover-1 is-visible" aria-hidden="true" />
        <span className={`portal-cover portal-cover-2 ${cover2Visible ? "is-visible" : ""}`} aria-hidden="true" />
        <span className={`portal-cover portal-cover-3 ${cover3Visible ? "is-visible" : ""}`} aria-hidden="true" />
      </button>
    </main>
  );
}

function BuildingGlyph({ shape }: { shape: string }) {
  return (
    <div className={`building-glyph ${shape}`}>
      <span className="building-layer layer-a" />
      <span className="building-layer layer-b" />
      <span className="building-layer layer-c" />
      <span className="building-core" />
    </div>
  );
}

const castleAssetVersion = "20260801b";

const mapCastles = [
  {
    id: "castle1",
    src: `/castle1.png?v=${castleAssetVersion}`,
    label: "Featured Works",
    originX: "48.9%",
    originY: "47.3%",
    glowOriginY: "57%",
    hit: { left: "38.9%", top: "20%", width: "21%", height: "54.5%" },
  },
  {
    id: "castle2",
    src: `/castle2.png?v=${castleAssetVersion}`,
    label: "北塔",
    originX: "22.6%",
    originY: "20.4%",
    glowOriginY: "24.8%",
    hit: { left: "16.8%", top: "6.5%", width: "12.5%", height: "27.9%" },
  },
  {
    id: "castle3",
    src: `/castle3.png?v=${castleAssetVersion}`,
    label: "东塔",
    originX: "69.9%",
    originY: "45.6%",
    glowOriginY: "50.7%",
    hit: { left: "64.5%", top: "29.8%", width: "11.9%", height: "31.5%" },
  },
] as const;

/* portfolio cover1–5 share one 3508×3000 canvas; transparent gaps + left-on-top z-order
   recreate portfolio cover.png. Hit strips are the exclusive visible columns L→R.
   cover6 sits behind as the archive backdrop. */
const folderAssetVersion = "20260805e";
const folderBackdropSrc = `/portfolio cover6.png?v=${folderAssetVersion}`;
const folderThemes = [
  { src: `/portfolio cover1.png?v=${folderAssetVersion}`, label: "ARCHIVE LOG", ink: "#4c2b21", hit: { left: "0%", width: "19.5%" } },
  { src: `/portfolio cover2.png?v=${folderAssetVersion}`, label: "CLIFF CHURCH", ink: "#2b2218", hit: { left: "19.5%", width: "18.5%" } },
  { src: `/portfolio cover3.png?v=${folderAssetVersion}`, label: "PIT COURTYARD", ink: "#2b2218", hit: { left: "38%", width: "19%" } },
  { src: `/portfolio cover4.png?v=${folderAssetVersion}`, label: "TAIKOO WHARF", ink: "#1a100c", hit: { left: "57%", width: "18%" } },
  { src: `/portfolio cover5.png?v=${folderAssetVersion}`, label: "AGING CITY", ink: "#1a1c22", hit: { left: "75%", width: "20%" } },
] as const;

/* Page 2 mirrors page 1 for now — replace these paths when new art is ready. */
const folderPage2AssetVersion = "20260805e";
const folderPage2BackdropSrc = `/portfolio cover6.png?v=${folderPage2AssetVersion}`;
const folderPage2Themes = folderThemes.map((theme) => ({
  ...theme,
  src: theme.src.replace(folderAssetVersion, folderPage2AssetVersion),
}));

function MapView({
  selected,
  setSelected,
  enterArchive,
  portfolioOpen,
  setPortfolioOpen,
}: {
  selected: Project | null;
  setSelected: (project: Project | null) => void;
  enterArchive: (project: Project) => void;
  portfolioOpen: boolean;
  setPortfolioOpen: (open: boolean) => void;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [entered, setEntered] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);
  const [hoveredCastle, setHoveredCastle] = useState<string | null>(null);
  const [hoveredFolder, setHoveredFolder] = useState<number | null>(null);
  const [portfolioPage, setPortfolioPage] = useState<1 | 2>(1);
  const [folderTransit, setFolderTransit] = useState<
    "idle" | "stowing" | "held" | "opening"
  >("idle");
  const folderTransitTimerRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluoroRef = useRef<HTMLDivElement>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const overlayImageRef = useRef<HTMLImageElement | null>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, ready: false });
  const rafRef = useRef(0);
  const hintReadyRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntered(true));
    const transitionTimer = window.setTimeout(() => setTransitionComplete(true), 2400);
    const readyTimer = window.setTimeout(() => {
      hintReadyRef.current = true;
    }, 400);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(transitionTimer);
      window.clearTimeout(readyTimer);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      if (portfolioOpen) return;
      event.preventDefault();
      if (hintReadyRef.current) setScrollHintVisible(false);
      const mapPlane = planeRef.current;
      const canvasWidth = mapPlane?.getBoundingClientRect().width ?? viewport.clientWidth;
      const maxPanX = Math.max(0, (canvasWidth - viewport.clientWidth) / 2);
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      setOffsetX((prev) => Math.min(maxPanX, Math.max(-maxPanX, prev - delta)));
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [portfolioOpen]);

  const playFolderOpen = () => {
    window.clearTimeout(folderTransitTimerRef.current);
    setFolderTransit("held");
    // Leave spine immediately — only one frame to register the tucked pose
    folderTransitTimerRef.current = window.setTimeout(() => {
      setFolderTransit("opening");
      folderTransitTimerRef.current = window.setTimeout(() => {
        setFolderTransit("idle");
      }, 1400);
    }, 16);
  };

  const openPortfolio = () => {
    setSelected(null);
    setHoveredFolder(null);
    setPortfolioPage(1);
    setFolderTransit("held");
    setPortfolioOpen(true);
    playFolderOpen();
  };

  const goPortfolioPage = (next: 1 | 2) => {
    if (folderTransit !== "idle" || next === portfolioPage) return;
    setHoveredFolder(null);
    setFolderTransit("stowing");
    window.clearTimeout(folderTransitTimerRef.current);
    folderTransitTimerRef.current = window.setTimeout(() => {
      setPortfolioPage(next);
      playFolderOpen();
    }, 620);
  };

  const closePortfolioPage = () => {
    if (folderTransit !== "idle") return;
    setHoveredFolder(null);
    if (portfolioPage > 1) {
      goPortfolioPage(1);
      return;
    }
    setPortfolioOpen(false);
  };

  const openPortfolioPage2 = () => {
    goPortfolioPage(2);
  };

  useEffect(() => {
    return () => window.clearTimeout(folderTransitTimerRef.current);
  }, []);

  const activeFolderThemes = portfolioPage === 2 ? folderPage2Themes : folderThemes;
  const activeBackdropSrc =
    portfolioPage === 2 ? folderPage2BackdropSrc : folderBackdropSrc;
  const marksVisible = hoveredFolder === null && folderTransit === "idle";

  /**
   * Rest: cover2–5 sit a bit tighter (more overlap). cover1 never moves.
   * Hover N (N≥1): same fixed 拉开 / 退位 as before, added on top of rest.
   * Page transit: cover2–5 tuck left into the spine before the page swaps.
   */
  const folderShiftPx = (index: number) => {
    if (index === 0) return 0;
    const w = typeof window !== "undefined" ? window.innerWidth : 1440;
    if (folderTransit === "stowing" || folderTransit === "held") {
      // Pull each archive fully under the spine (cover1 ~19.5% wide)
      return -Math.round(w * (0.78 + index * 0.08));
    }
    // Pull cover2–5 slightly left so the default stack is tighter
    const rest = -Math.round(w * 0.0055 * index);
    let peel = 0;
    if (hoveredFolder !== null && hoveredFolder > 0 && index >= hoveredFolder) {
      const open = Math.round(w * 0.028);
      const retreat = Math.round(w * 0.014);
      peel =
        index === hoveredFolder
          ? open
          : open + (index - hoveredFolder) * retreat;
    }
    return rest + peel;
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    const plane = planeRef.current;
    if (!viewport || !canvas || !plane) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");
    const revealCanvas = document.createElement("canvas");
    const revealCtx = revealCanvas.getContext("2d");
    if (!maskCtx || !revealCtx) return;

    const baseImage = new Image();
    baseImage.src = "/footprint.png";
    baseImageRef.current = baseImage;

    const overlayImage = new Image();
    overlayImage.src = "/overlay.png";
    overlayImageRef.current = overlayImage;

    const LERP = 0.18;
    const FADE_LERP = 0.08;
    const TRAIL_LENGTH = 10;
    const trail: { x: number; y: number }[] = [];
    const glow = { visible: 0, target: 0, time: 0, idle: 0, lastMove: 0 };

    const resize = () => {
      const width = plane.clientWidth;
      const height = plane.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bw = Math.max(1, Math.floor(width * dpr));
      const bh = Math.max(1, Math.floor(height * dpr));
      canvas.width = bw;
      canvas.height = bh;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      maskCanvas.width = bw;
      maskCanvas.height = bh;
      revealCanvas.width = bw;
      revealCanvas.height = bh;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      revealCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!pointer.current.ready) {
        pointer.current.x = width * 0.5;
        pointer.current.y = height * 0.5;
        pointer.current.tx = pointer.current.x;
        pointer.current.ty = pointer.current.y;
        pointer.current.ready = true;
      }
    };

    const drawGlow = (
      target: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      alpha: number,
    ) => {
      if (alpha <= 0.01 || radius <= 0) return;
      const gradient = target.createRadialGradient(x, y, radius * 0.94, x, y, radius);
      gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      target.fillStyle = gradient;
      target.beginPath();
      target.arc(x, y, radius, 0, Math.PI * 2);
      target.fill();
    };

    const draw = () => {
      const width = plane.clientWidth;
      const height = plane.clientHeight;
      const p = pointer.current;
      p.x += (p.tx - p.x) * LERP;
      p.y += (p.ty - p.y) * LERP;
      glow.visible += (glow.target - glow.visible) * FADE_LERP;
      glow.time += 0.016;

      const stillMs = performance.now() - glow.lastMove;
      const idleTarget = stillMs > 50 ? 1 : 0;
      glow.idle += (idleTarget - glow.idle) * 0.22;
      fluoroRef.current?.classList.toggle("is-idle", stillMs > 180 && glow.visible > 0.2);

      trail.push({ x: p.x, y: p.y });
      if (trail.length > TRAIL_LENGTH) trail.shift();

      // Both layers drawn with identical drawImage sizing → no CSS/canvas misalignment warp
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(
        canvas.width / width,
        0,
        0,
        canvas.height / height,
        0,
        0,
      );
      // Keep the reveal canvas from exposing a different fallback color while image assets load.
      ctx.fillStyle = "#a48c6e";
      ctx.fillRect(0, 0, width, height);

      const overlay = overlayImageRef.current;
      if (overlay?.complete && overlay.naturalWidth > 0) {
        ctx.drawImage(overlay, 0, 0, width, height);
      }

      if (glow.visible > 0.01) {
        const baseRadius = Math.min(width, height) * 0.045;
        const pulse = 0.5 + 0.5 * Math.sin(glow.time * 2.6);
        const radius = baseRadius * (1 - glow.idle * 0.28 + glow.idle * pulse * 0.58);
        const alpha = glow.visible * (1 - glow.idle * (0.72 * (1 - pulse)));

        maskCtx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
        maskCtx.clearRect(0, 0, width, height);
        maskCtx.globalCompositeOperation = "lighter";
        const trailMix = 1 - glow.idle * 0.85;
        trail.forEach((point, index) => {
          const trailAlpha = ((index + 1) / trail.length) * alpha * 0.45 * Math.max(trailMix, 0.15);
          const trailRadius = radius * (0.78 + (index / trail.length) * 0.22);
          drawGlow(maskCtx, point.x, point.y, trailRadius, trailAlpha);
        });
        maskCtx.globalCompositeOperation = "source-over";
        drawGlow(maskCtx, p.x, p.y, radius, alpha);

        revealCtx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
        revealCtx.clearRect(0, 0, width, height);
        const base = baseImageRef.current;
        if (base?.complete && base.naturalWidth > 0) {
          revealCtx.drawImage(base, 0, 0, width, height);
        }
        revealCtx.globalCompositeOperation = "destination-in";
        revealCtx.drawImage(maskCanvas, 0, 0, width, height);
        revealCtx.globalCompositeOperation = "source-over";

        ctx.drawImage(revealCanvas, 0, 0, width, height);
      }

      rafRef.current = window.requestAnimationFrame(draw);
    };

    const syncFluoro = (clientX: number, clientY: number, visible: boolean) => {
      const el = fluoroRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      el.classList.toggle("is-visible", visible);
    };

    const onPointerMove = (event: globalThis.PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.current.tx = ((event.clientX - rect.left) / rect.width) * plane.clientWidth;
      pointer.current.ty = ((event.clientY - rect.top) / rect.height) * plane.clientHeight;
      glow.target = 1;
      glow.lastMove = performance.now();
      syncFluoro(event.clientX, event.clientY, true);
      fluoroRef.current?.classList.remove("is-idle");
    };
    const onPointerEnter = (event: globalThis.PointerEvent) => {
      glow.target = 1;
      glow.lastMove = performance.now();
      syncFluoro(event.clientX, event.clientY, true);
    };
    const onPointerLeave = () => {
      glow.target = 0;
      syncFluoro(0, 0, false);
      fluoroRef.current?.classList.remove("is-idle");
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(plane);
    baseImage.addEventListener("load", resize);
    overlayImage.addEventListener("load", resize);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerenter", onPointerEnter);
    viewport.addEventListener("pointerleave", onPointerLeave);
    rafRef.current = window.requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      baseImage.removeEventListener("load", resize);
      overlayImage.removeEventListener("load", resize);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerenter", onPointerEnter);
      viewport.removeEventListener("pointerleave", onPointerLeave);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main
      className={`map-view ${entered ? "is-entered" : ""} ${transitionComplete ? "is-rendered" : "is-rendering"} ${selected ? "is-deconstructed" : ""} ${portfolioOpen ? "is-portfolio" : ""}`}
    >
      <div className="map-viewport" ref={viewportRef}>
        <div
          className="map-plane"
          ref={planeRef}
          style={{ ["--pan-x" as string]: `${offsetX}px` }}
        >
          <div className="map-plane-stage">
            <canvas ref={canvasRef} className="map-reveal-canvas" aria-hidden="true" />
            {mapCastles.map((castle) => (
              <div
                key={castle.id}
                className={`castle-float-slot${hoveredCastle === castle.id ? " is-hovered" : ""}`}
                style={{
                  ["--castle-ox" as string]: castle.originX,
                  ["--castle-oy" as string]: castle.originY,
                  ["--castle-glow-oy" as string]: castle.glowOriginY,
                  ["--hit-l" as string]: castle.hit.left,
                  ["--hit-t" as string]: castle.hit.top,
                  ["--hit-w" as string]: castle.hit.width,
                  ["--hit-h" as string]: castle.hit.height,
                }}
              >
                <div className="castle-float-bob" aria-hidden="true">
                  <img
                    src={castle.src}
                    alt=""
                    className="castle-float-glow"
                    draggable={false}
                  />
                  <img
                    src={castle.src}
                    alt=""
                    className="castle-float"
                    draggable={false}
                  />
                </div>
                <button
                  type="button"
                  className="castle-float-hit"
                  aria-label={castle.label}
                  onClick={castle.id === "castle1" ? openPortfolio : undefined}
                  onPointerEnter={() => setHoveredCastle(castle.id)}
                  onPointerLeave={() => setHoveredCastle(null)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div ref={fluoroRef} className="fluorescent-cursor" aria-hidden="true" />
      <div
        className={`map-scroll-hint${scrollHintVisible && !portfolioOpen ? "" : " is-dismissed"}`}
        aria-hidden={!entered || !scrollHintVisible || portfolioOpen}
      >
        <div className="map-scroll-hint-img" role="img" aria-label="" />
      </div>
      <div className="map-compass" aria-hidden="true"><span>N</span><i /></div>
      <div className="map-scale">0 —— 100 —— 200M</div>
      <aside className={`project-dossier ${selected ? "is-visible" : ""}`} aria-hidden={!selected}>
        {selected && (
          <>
            <button className="panel-close" onClick={() => setSelected(null)} aria-label="关闭项目信息">×</button>
            <div className="dossier-code">{selected.id} / {selected.sector}</div>
            <div className="holo-mini"><BuildingGlyph shape={selected.shape} /></div>
            <p className="eyebrow">[DECRYPTED]</p>
            <h2>{selected.title}</h2>
            <div className="dossier-meta">
              <span>{selected.type}</span><span>{selected.year}</span>
            </div>
            <p className="dossier-description">{selected.description}</p>
            <div className="concept-line"><span>PRIMARY SPELL</span>{selected.concept}</div>
            <button className="enter-archive" onClick={() => enterArchive(selected)}>
              <span>ENTER ARCHIVE</span><i>↗</i>
            </button>
          </>
        )}
      </aside>

      <div
        className={[
          "portfolio-overlay",
          portfolioOpen ? "is-open" : "",
          marksVisible ? "is-collapsed" : "",
          folderTransit !== "idle" ? "is-transiting" : "",
          folderTransit === "stowing" ? "is-stowing" : "",
          folderTransit === "held" ? "is-held" : "",
          folderTransit === "opening" ? "is-opening" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={!portfolioOpen}
        data-portfolio-page={portfolioPage}
      >
        <div
          className="folder-rack"
          role="list"
          onPointerLeave={() => setHoveredFolder(null)}
        >
          <div className="folder-backdrop" aria-hidden="true">
            <img
              src={activeBackdropSrc}
              alt=""
              className="folder-cover-img"
              draggable={false}
            />
          </div>
          <button
            type="button"
            className="portfolio-mark portfolio-mark-back"
            onClick={closePortfolioPage}
            aria-label={portfolioPage > 1 ? "返回上一页" : "返回主页面"}
            tabIndex={portfolioOpen && marksVisible ? 0 : -1}
          >
            <svg viewBox="0 0 52 40" aria-hidden="true">
              <path
                d="M42 34 V18 A14 14 0 0 0 28 4 H16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 4 L26 -1.2 V9.2 Z"
                fill="currentColor"
              />
            </svg>
          </button>
          {portfolioPage === 1 && (
            <button
              type="button"
              className="portfolio-mark portfolio-mark-next"
              onClick={openPortfolioPage2}
              aria-label="打开下一页档案"
              tabIndex={portfolioOpen && marksVisible ? 0 : -1}
            >
              <svg viewBox="0 0 28 48" aria-hidden="true">
                <path
                  d="M6 6 L20 24 L6 42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {activeFolderThemes.map((theme, index) => (
            <div
              key={`layer-${theme.label}`}
              className={`folder-layer${index === 0 ? " is-spine" : ""}`}
              style={{
                ["--folder-i" as string]: index,
                ["--folder-shift" as string]: `${folderShiftPx(index)}px`,
                zIndex: activeFolderThemes.length - index,
              }}
              aria-hidden="true"
            >
              <img
                src={theme.src}
                alt=""
                className="folder-cover-img"
                draggable={false}
              />
            </div>
          ))}
          {activeFolderThemes.map((theme, index) => {
            const project = projects[index % projects.length];
            const isSpine = index === 0;
            return (
              <button
                key={`hit-${theme.label}`}
                type="button"
                role="listitem"
                className={`folder-hit${hoveredFolder === index ? " is-hovered" : ""}${isSpine ? " is-spine-hit" : ""}`}
                style={{
                  ["--folder-i" as string]: index,
                  left: theme.hit.left,
                  width: theme.hit.width,
                  transform:
                    isSpine ? undefined : `translateX(${folderShiftPx(index)}px)`,
                }}
                aria-label={theme.label}
                aria-disabled={isSpine}
                tabIndex={portfolioOpen && folderTransit === "idle" && !isSpine ? 0 : -1}
                onClick={() => {
                  if (folderTransit !== "idle" || isSpine) return;
                  enterArchive(project);
                }}
                onPointerEnter={() => {
                  if (folderTransit !== "idle" || isSpine) return;
                  setHoveredFolder(index);
                }}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

function ArchiveView({ project, close }: { project: Project; close: () => void }) {
  const [phase, setPhase] = useState<"enter" | "shown" | "leave">("enter");
  const [archiveData, setArchiveData] = useState<{ title: string; subtitle: string; body: string[] } | null>(null);
  const [heroImages, setHeroImages] = useState<string[]>([]);

  const sourceKey = project.id === "AR-03" ? "pit-courtyard" : project.id === "AR-04" ? "taikoo-wharf" : project.id === "AR-05" ? "aging-city" : "cliff-church";
  const archiveTitle = project.id === "AR-03" ? "PIT COURTYARD" : project.id === "AR-04" ? "TAIKOO WHARF" : project.id === "AR-05" ? "AGING CITY" : project.title.toUpperCase();
  const archiveImagePrefix = sourceKey === "pit-courtyard" ? "/portfolio/pit-courtyard/pit-courtyard" : sourceKey === "taikoo-wharf" ? "/portfolio/taikoo-wharf/taikoo-wharf" : sourceKey === "aging-city" ? "/portfolio/aging-city/aging-city" : "/portfolio/cliff-church/cliff-church";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setPhase("shown"));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const loadArchive = async () => {
      try {
        const res = await fetch(`/portfolio/${sourceKey}/${sourceKey}.txt`);
        const text = await res.text();
        const lines = text
          .replace(/\r/g, "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const readLabel = (label: string) => {
          const line = lines.find((entry) => entry.startsWith(`${label}：`));
          return line?.slice(label.length + 1).trim() ?? "";
        };

        const bodyIndex = lines.findIndex((entry) => entry.startsWith("正文："));
        const bodyLines =
          bodyIndex >= 0
            ? [
                lines[bodyIndex].slice("正文：".length).trim(),
                ...lines.slice(bodyIndex + 1),
              ].filter(Boolean)
            : [];

        setArchiveData({
          title: (readLabel("主标题") || archiveTitle).toUpperCase(),
          subtitle: readLabel("副标题") || project.description,
          body: bodyLines.length ? bodyLines : [project.description],
        });
        setHeroImages(
          sourceKey === "pit-courtyard"
            ? [
                `${archiveImagePrefix}-main.jpg`,
                `${archiveImagePrefix}-2.jpg`,
                `${archiveImagePrefix}-10.png`,
                `${archiveImagePrefix}-11.png`,
                `${archiveImagePrefix}-12.png`,
                `${archiveImagePrefix}-13.png`,
                `${archiveImagePrefix}-14.png`,
                `${archiveImagePrefix}-15.png`,
                `${archiveImagePrefix}-16.png`,
              ]
            : sourceKey === "taikoo-wharf"
            ? [
                `${archiveImagePrefix}-main.jpg`,
                `${archiveImagePrefix}-2.png`,
                `${archiveImagePrefix}-3.png`,
                `${archiveImagePrefix}-4.png`,
                `${archiveImagePrefix}-5.png`,
                `${archiveImagePrefix}-6.png`,
              ]
            : sourceKey === "aging-city"
            ? [
                `${archiveImagePrefix}-main.jpg`,
                `${archiveImagePrefix}-12.png`,
                `${archiveImagePrefix}-13.png`,
                `${archiveImagePrefix}-14.png`,
              ]
            : [
                "/portfolio/cliff-church/cliff-church-main.jpg",
                "/portfolio/cliff-church/cliff-church-3.jpg",
                "/portfolio/cliff-church/cliff-church-4.jpg",
                "/portfolio/cliff-church/cliff-church-5.jpg",
                "/portfolio/cliff-church/cliff-church-6.jpg",
                "/portfolio/cliff-church/cliff-church-7.jpg",
              ]
        );
      } catch {
        setArchiveData({
          title: archiveTitle,
          subtitle:
            sourceKey === "pit-courtyard"
              ? "This project modernizes traditional Dikengyuan (subterranean courtyards) by optimizing light, ventilation, and spatial connections. It transforms this eco-friendly regional heritage into sustainable housing for contemporary living."
              : sourceKey === "taikoo-wharf"
              ? "To reconnect Taikoo Wharf with its local community, this project inserts transparent vertical volumes to reclaim public space for residents, transforming the heritage site into an inclusive, contemporary waterfront landmark."
              : sourceKey === "aging-city"
              ? "In hyper-dense Hong Kong, an elevated walkway stitches together parks, facades, and rooftops through newly inserted volumes. This barrier-free \"Vertical Vitality Belt\" enhances elderly mobility while fostering intergenerational community life."
              : "Anchored within Bonifacio's eroded cliffs, architectural corridors interconnect three native reefs to frame a newly unified scenic vision.",
          body:
            sourceKey === "pit-courtyard"
              ? [
                  "As one of the traditional Chinese buildings, the dikeng-yuan has been replaced, and only a small number of them still exist on the Loess Plateau. However, as a green, environmentally friendly, low energy consumption and traditional way of living with cultural heritage, I think it is worth to improve it to make it conform to the current concept of architecture and living, and slowly adapt to the characteristics of the times so that this way of living can be preserved and inherited. This is not only a kind of preservation of the architecture, but also has the significance of the times and regional characteristics.",
                  "By connecting the courtyard and the courtyard, new space is created on the site, and the disadvantages of light and ventilation are also optimized. The concept of community is introduced to increase the interaction between kilns and kilns, and between residents and residents. By enhancing the public space between the buildings, the communication between people is enhanced to make the traditional buildings more in line with modern life and bring more convenience to the residents in their daily lives. The underground building will be more connected to the outside world and will no longer be an independent building. The project explores the collision between above and below ground, rural and urban, traditional and modern. It is transformed into a house that meets the modern living life, development and sustainability, so that it is not abandoned by the times.",
                ]
              : sourceKey === "taikoo-wharf"
              ? [
                  "Amidst a landscape dominated by modern high-rises, the historic Taikoo Wharf stands along the Pearl River, visually contrasting with its contemporary surroundings. On-site research revealed that while adaptive reuse extended the warehouse’s functional life, its new programming primarily serves tourists while neglecting local residents—failing to fully realize its potential social value.",
                  "To address this, the project re-evaluates the relationship between Taikoo Wharf and its urban context, introducing new public spaces that restore activity areas to the local community. By re-establishing connections between residents, tourists, and the site, the design enriches the venue with multi-functional programming. Architecturally, transparent vertical volumes are inserted to remedy the lack of vertical dimension, creating a dynamic interaction with the existing heritage structures. This intervention seamlessly integrates the site into its modern environment, transforming Taikoo Wharf into a unified architectural ensemble that harmonizes with the river and forms a striking waterfront landmark.",
                ]
              : sourceKey === "aging-city"
              ? [
                  "In response to Hong Kong's hyper-dense, extremely compact, and vertically oriented urban environment, traditional ground-plane urban renewal models are no longer sufficient. Breaking free from the limits of the two-dimensional ground level, this project proposes a 3D Spatial Intervention framework.",
                  "Centered around an Elevated Walkway System, the network acts as a spatial conduit weaving through the gaps between high-rises—seamlessly stitching together neighborhood parks, civic plazas, building facades, and high-altitude rooftop spaces. By strategically inserting medium-to-large functional nodes across various elevations, the design reactivates isolated, fragmented, and underutilized urban stock spaces (such as vacant rooftops and building envelopes), integrating them into a continuous, transparent, and dynamic three-dimensional public network.",
                  "These inserted architectural volumes interlock with the elevated walkways, extending public life beyond the ground plane into the vertical dimension. For elderly residents, the meandering walkway creates a gentle, all-weather, barrier-free pedestrian route that completely bypasses heavy street traffic, steep terrain, and vehicle-pedestrian conflicts. By reorganizing multi-level space and accommodating hybrid programs, the project dismantles the spatial detachment typical of high-density living, establishing a \"Vertical Vitality Belt\" that encourages intergenerational connectivity and presents an inclusive new paradigm for aging in place.",
                ]
              : [
                  `${archiveTitle} is a modern sanctuary of quiet reflection. Anchored within Bonifacio's eroded cliffs, architectural corridors interconnect three native reefs to frame a newly unified scenic vision.`,
                  "The architecture respects the natural terrain, with structural anchors engineered to withstand erosion from waves and coastal winds. It forms a visual continuation of the white limestone headlands, creating a symbiotic dialogue between sacred geometries and untamed landscape.",
                  "The main corridor floats above the crashing sea, with crystalline glass panels that invite dynamic light and water views. In the heart of the chapel, light streams down from a natural crevice in the karst cliff, casting sacred patterns across the polished raw stone floor.",
                ],
        });
        setHeroImages(
          sourceKey === "pit-courtyard"
            ? ["/portfolio/pit-courtyard/pit-courtyard-2.jpg"]
            : sourceKey === "taikoo-wharf"
            ? ["/portfolio/taikoo-wharf/taikoo-wharf-main.jpg"]
            : sourceKey === "aging-city"
            ? ["/portfolio/aging-city/aging-city-main.jpg"]
            : ["/portfolio/cliff-church/cliff-church-main.jpg"]
        );
      }
    };
    void loadArchive();
  }, [archiveTitle, project.description, sourceKey]);

  const requestClose = () => {
    if (phase === "leave") return;
    setPhase("leave");
    window.setTimeout(close, 420);
  };

  const title = archiveData?.title ?? archiveTitle;
  const subtitle = archiveData?.subtitle ?? project.description;
  const body = archiveData?.body ?? [project.description];
  const coverImage =
    heroImages[0] ??
    (sourceKey === "pit-courtyard"
      ? "/portfolio/pit-courtyard/pit-courtyard-main.jpg"
      : sourceKey === "taikoo-wharf"
      ? "/portfolio/taikoo-wharf/taikoo-wharf-main.jpg"
      : sourceKey === "aging-city"
      ? "/portfolio/aging-city/aging-city-main.jpg"
      : "/portfolio/cliff-church/cliff-church-main.jpg");
  const galleryImages =
    sourceKey === "pit-courtyard" || sourceKey === "aging-city"
      ? heroImages.slice(1)
      : heroImages;

  return (
    <main
      className={`archive-view${phase === "shown" ? " is-shown" : ""}${phase === "leave" ? " is-leaving" : ""}`}
    >
      <div className="archive-topbar">
        <div className="archive-brand-block">
          <p className="archive-kicker">ARCHITECTURAL WORKS</p>
          <p className="archive-brand-title">// {title}</p>
        </div>
        <button className="close-archive" onClick={requestClose} aria-label="关闭档案页">
          ×
        </button>
      </div>

      <div className="archive-shell">
        <article className="archive-card">
          <div className="archive-media">
            <img src={coverImage} alt={title} className="archive-image" draggable={false} />
          </div>

          <header className="archive-header">
            <h1>{title}</h1>
            <p className="archive-subtitle">{subtitle}</p>
          </header>

          <div className="archive-divider" aria-hidden="true" />

          <section className="archive-copy" aria-label="项目说明">
            {body.map((paragraph, index) => (
              <p key={`${title}-${index}`}>{paragraph}</p>
            ))}
          </section>

          <section className="archive-gallery" aria-label="项目图片">
            {galleryImages.map((src, index) => (
              <figure key={`${title}-image-${index}`} className="archive-gallery-item">
                <img src={src} alt={`${title} image ${index + 1}`} draggable={false} />
              </figure>
            ))}
          </section>

          <div className="archive-bottom-line" aria-hidden="true">
            <span />
            <i>•</i>
            <span />
          </div>
        </article>
      </div>
    </main>
  );
}

function AboutView() {
  return (
    <main className="about-view">
      <ParticleField calm />
      <div className="record-folder">
        <div className="folder-tab">RECORD C–01 / CONFIDENTIAL</div>
        <div className="record-stamp">CLEARED<br /><span>LEVEL 07</span></div>
        <div className="record-intro">
          <p className="eyebrow">THE CREATOR&apos;S RECORD</p>
          <h1>Leah<br />— Keeper of Lumen</h1>
          <p>
            Spatial designer and visual storyteller exploring the point where architecture,
            atmosphere and narrative become one continuous experience.
          </p>
        </div>
        <div className="portrait-reveal" aria-label="创作者抽象肖像占位">
          <div className="ink-silhouette" />
          <span>PORTRAIT / INK REVEAL</span>
        </div>
        <section className="record-section spellbook">
          <p className="section-num">I. SPELL PROFICIENCY</p>
          {[
            ["Spatial Narratives", "MASTER", 96],
            ["Rhino + Grasshopper", "ADVANCED", 86],
            ["AutoCAD", "MASTER", 92],
            ["Visual Direction", "ADVANCED", 88],
          ].map(([name, rank, level]) => (
            <div className="skill-row" key={String(name)}>
              <span>{name}</span><b>{rank}</b><i><em style={{ width: `${level}%` }} /></i>
            </div>
          ))}
        </section>
        <section className="record-section journey">
          <p className="section-num">II. PLACES OF PILGRIMAGE</p>
          <div><b>2024 — PRESENT</b><h3>Independent Spatial Designer</h3><p>Shanghai / London / Remote</p></div>
          <div><b>2022 — 2024</b><h3>Architectural Storytelling Lab</h3><p>Experimental environments & visual systems</p></div>
          <div><b>2018 — 2022</b><h3>B.Arch / School of the Built Environment</h3><p>Architecture, media and urban ritual</p></div>
        </section>
        <div className="record-footer">SIGNED IN SILVER INK · LUMEN ARCHIVE · 2026</div>
      </div>
    </main>
  );
}

export default function Home() {
  const [view, setView] = useState<"portal" | "map" | "archive" | "about">("portal");
  const [showPortal, setShowPortal] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [archiveProject, setArchiveProject] = useState<Project>(projects[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);

  const applyMusicRate = (audio: HTMLAudioElement) => {
    audio.playbackRate = 0.75;
    audio.preservesPitch = true;
  };

  const playMusic = () => {
    const audio = audioRef.current;
    if (!audio || !musicEnabled) return;
    applyMusicRate(audio);
    audio.volume = 0.45;
    void audio
      .play()
      .then(() => {
        audioUnlockedRef.current = true;
        setMusicOn(true);
      })
      .catch(() => setMusicOn(false));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    applyMusicRate(audio);
    if ((view === "map" || view === "archive") && musicEnabled) {
      // Resume if already unlocked; first start happens in the cover click gesture.
      if (audioUnlockedRef.current || !audio.paused) {
        audio.volume = 0.45;
        void audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
      }
    } else if (view === "portal" || view === "about") {
      audio.pause();
      setMusicOn(false);
    }
  }, [view, musicEnabled]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (showPortal && view !== "map") return;
    if (audio.paused) {
      setMusicEnabled(true);
      applyMusicRate(audio);
      audio.volume = 0.45;
      void audio.play().then(() => {
        audioUnlockedRef.current = true;
        setMusicOn(true);
      }).catch(() => setMusicOn(false));
    } else {
      setMusicEnabled(false);
      audio.pause();
      setMusicOn(false);
    }
  };

  const goTo = (next: "portal" | "map" | "about") => {
    setMenuOpen(false);
    setSelected(null);
    setPortfolioOpen(false);
    setView(next);
    setShowPortal(next === "portal");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const enterArchive = (project: Project) => {
    setArchiveProject(project);
    setSelected(null);
    setView("archive");
    window.scrollTo(0, 0);
  };

  return (
    <div className="lumen-app">
      <audio ref={audioRef} src="/bg-music.mp3" loop preload="auto" playsInline />
      <div className="noise" aria-hidden="true" />
      <div className="frame-corners" aria-hidden="true"><i /><i /><i /><i /></div>
      <Hud
        view={showPortal ? "portal" : view}
        portfolioOpen={portfolioOpen}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        goTo={goTo}
        musicOn={musicOn}
        toggleMusic={toggleMusic}
      />
      {view === "map" && (
        <MapView
          selected={selected}
          setSelected={setSelected}
          enterArchive={enterArchive}
          portfolioOpen={portfolioOpen}
          setPortfolioOpen={setPortfolioOpen}
        />
      )}
      {view === "archive" && (
        <ArchiveView
          project={archiveProject}
          close={() => {
            setView("map");
            setPortfolioOpen(true);
          }}
        />
      )}
      {view === "about" && <AboutView />}
      {showPortal && (
        <Portal
          onUnlock={playMusic}
          onOpening={() => setView("map")}
          onEnter={() => setShowPortal(false)}
        />
      )}
    </div>
  );
}
