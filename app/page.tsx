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
    title: "Nocturne Garden",
    type: "Urban / Installation",
    year: "2024",
    sector: "Sector 2–W",
    x: 18,
    y: 74,
    shape: "garden",
    description:
      "A nocturnal commons mapped by scent, sound and low illumination rather than conventional paths.",
    concept: "DARKNESS AS ORIENTATION",
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
  menuOpen,
  setMenuOpen,
  goTo,
}: {
  view: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  goTo: (view: "portal" | "map" | "about") => void;
}) {
  return (
    <header className={`hud ${view === "portal" ? "hud-hidden" : ""}`}>
      <button className="brand-mark" onClick={() => goTo("map")} aria-label="返回地图">
        <span className="brand-glyph">L</span>
        <span>LUMEN</span>
      </button>
      <div className="hud-location">
        <span className="live-dot" />
        {view === "map" ? "SECTOR 7–G" : view === "about" ? "RECORD C–01" : "ARCHIVE AR–01"}
      </div>
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

function Portal({ onEnter }: { onEnter: () => void }) {
  const [opening, setOpening] = useState(false);
  const unlock = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onEnter, 1250);
  };
  return (
    <main className={`portal ${opening ? "is-opening" : ""}`}>
      <div className="ambient-stars" aria-hidden="true" />
      <button className="sealed-scroll" onClick={unlock} aria-label="点击解开封印，进入 Lumen">
        <span className="scroll-fold fold-left" />
        <span className="scroll-fold fold-right" />
        <span className="seal-ring"><i /></span>
        <span className="welcome">welcome<span className="cursor">_</span></span>
        <span className="unlock-copy">CLICK TO BREAK THE SEAL</span>
      </button>
      <div className="portal-index">LUMEN ARCHIVE · ENTRY 000</div>
      <div className="portal-status">ENCRYPTION: ACTIVE</div>
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
    label: "主城堡",
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

function MapView({
  selected,
  setSelected,
  enterArchive,
}: {
  selected: Project | null;
  setSelected: (project: Project | null) => void;
  enterArchive: (project: Project) => void;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [entered, setEntered] = useState(false);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);
  const [hoveredCastle, setHoveredCastle] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluoroRef = useRef<HTMLDivElement>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const overlayImageRef = useRef<HTMLImageElement | null>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, ready: false });
  const rafRef = useRef(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setScrollHintVisible(false);
      const mapPlane = planeRef.current;
      const canvasWidth = mapPlane?.getBoundingClientRect().width ?? viewport.clientWidth;
      const maxPanX = Math.max(0, (canvasWidth - viewport.clientWidth) / 2);
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      setOffsetX((prev) => Math.min(maxPanX, Math.max(-maxPanX, prev - delta)));
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, []);

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
    <main className={`map-view ${entered ? "is-entered" : ""} ${selected ? "is-deconstructed" : ""}`}>
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
        className={`map-scroll-hint${scrollHintVisible ? "" : " is-dismissed"}`}
        aria-hidden={!entered || !scrollHintVisible}
      >
        <span>SCROLL</span>
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
    </main>
  );
}

function ArchiveView({ project, close }: { project: Project; close: () => void }) {
  const [diving, setDiving] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setDiving(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <main className={`archive-view ${diving ? "is-diving" : ""}`}>
      <ParticleField calm={false} />
      <div className="archive-fog" />
      <button className="close-archive" onClick={close}>CLOSE ARCHIVE <span>×</span></button>
      <aside className="archive-rail">
        <div className="rail-code">LUMEN / {project.id}</div>
        <div><span>STATUS</span> DECRYPTED</div>
        <div><span>COORD.</span> 31°13&apos;N<br />121°28&apos;E</div>
        <div><span>TYPE</span> {project.type}</div>
        <div><span>YEAR</span> {project.year}</div>
        <div className="scroll-meter"><i /></div>
      </aside>
      <div className="archive-content">
        <section className="archive-hero">
          <p className="eyebrow">ARCHIVE {project.id} / CASE FILE</p>
          <h1>{project.title}</h1>
          <div className="hero-rule" />
          <p>{project.description}</p>
          <div className="scroll-cue">SCROLL TO DESCEND <span>↓</span></div>
        </section>
        <section className="editorial-card intro-card">
          <div>
            <p className="section-num">01 / MANIFESTO</p>
            <h2>Light is not applied.<br />It is excavated.</h2>
          </div>
          <p>
            The proposal begins with darkness as a material condition. Voids are carved to receive
            daylight; circulation follows the resulting gradients. Architecture becomes an instrument
            that measures the passing hour.
          </p>
        </section>
        <section className="visual-panel plan-visual">
          <div className="visual-code">FIG. 01 — SPATIAL FIELD</div>
          <div className="plan-rings" />
          <span>GROUND / LIGHT MAP</span>
        </section>
        <section className="editorial-card split-card">
          <div>
            <p className="section-num">02 / STRATEGY</p>
            <h2>Three layers of<br />luminous occupation.</h2>
          </div>
          <ol>
            <li><b>THE PUBLIC STRATA</b><span>A continuous civic ground cut by reflected light.</span></li>
            <li><b>THE ARCHIVE VEIL</b><span>Controlled shadow protects the inner collections.</span></li>
            <li><b>THE BEACON</b><span>A vertical room that gathers the city at night.</span></li>
          </ol>
        </section>
        <section className="visual-panel section-visual">
          <div className="visual-code">FIG. 02 — VERTICAL PROTOCOL</div>
          <div className="section-lines">
            {Array.from({ length: 13 }).map((_, index) => <i key={index} />)}
          </div>
          <span>SECTION / ENERGY TRACE</span>
        </section>
        <section className="closing-note">
          <p className="eyebrow">END OF RECORD / {project.id}</p>
          <h2>The archive remains<br />alive after dark.</h2>
          <button onClick={close}>RETURN TO THE CITY MAP <span>↗</span></button>
        </section>
      </div>
      <div className="dive-overlay"><div className="dive-core" /><span>DESCENDING INTO {project.id}</span></div>
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
  const [selected, setSelected] = useState<Project | null>(null);
  const [archiveProject, setArchiveProject] = useState<Project>(projects[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (next: "portal" | "map" | "about") => {
    setMenuOpen(false);
    setSelected(null);
    setView(next);
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
      <div className="noise" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />
      <div className="frame-corners" aria-hidden="true"><i /><i /><i /><i /></div>
      <Hud view={view} menuOpen={menuOpen} setMenuOpen={setMenuOpen} goTo={goTo} />
      {view === "portal" && <Portal onEnter={() => setView("map")} />}
      {view === "map" && (
        <MapView selected={selected} setSelected={setSelected} enterArchive={enterArchive} />
      )}
      {view === "archive" && <ArchiveView project={archiveProject} close={() => setView("map")} />}
      {view === "about" && <AboutView />}
    </div>
  );
}
