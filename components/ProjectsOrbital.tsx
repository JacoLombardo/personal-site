"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/orbital.module.css";

import projectsJson from "../public/projects.json";

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════ */

const VIEW_W = 1200;
const VIEW_H = 700;
const CENTER_Y = 360;
const CONV_RADII = [20, 40];

// Each successive ring gap is wider (0.7 = 70 % increase inner→outer)
const GROWTH = 0.7;
// School rings are compressed by 50 % relative to the growth curve
const SCHOOL_COMPRESS = 0.7;

// Largest outer radius – the system with more rings fills this; the other
// is proportionally smaller.  Derived from viewBox so it scales with layout.
const SIDE_PAD = 60;
const MAX_R = Math.min(
  (VIEW_W - 2 * SIDE_PAD) / 4, // horizontal fit (center − outerR ≥ pad)
  CENTER_Y - 60, // vertical top
  VIEW_H - CENTER_Y - 60 // vertical bottom
);

const SE_HUE = "#00e5ff";
const SE_HUE_BRIGHT = "#80f0ff";
const WD_HUE = "#00e676";
const WD_HUE_BRIGHT = "#80ffb0";
const FONT = "poppins, sans-serif";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface JsonProject {
  id: string;
  name: string;
  domain: string;
  type: string;
  ring: number;
  tech_stack: string[];
  description: string;
  isShared: boolean;
  highlighted: boolean;
}

type ProjectType = "42" | "CODAC" | "independent" | "professional";
type FilterOption = ProjectType | "highlighted";

interface OrbitalProject {
  id: string;
  name: string;
  stack: string;
  description: string;
  orbit: number;
  angle: number;
  speed: number;
  size: number;
  category: "se" | "wd" | "conv";
  isSchool: boolean;
  highlighted: boolean;
  projectType: ProjectType;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA PROCESSING
   ═══════════════════════════════════════════════════════════════════════════ */

/** Sum of spacing multipliers for n rings (used to derive baseGap).
 *  School rings (1→schoolLast) are compressed by SCHOOL_COMPRESS. */
function ringWeightSum(n: number, schoolLast: number): number {
  if (n <= 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    const t = n <= 1 ? 0 : (i - 1) / (n - 1);
    const w = 1 + GROWTH * t;
    sum += i <= schoolLast ? w * SCHOOL_COMPRESS : w;
  }
  return sum;
}

/**
 * Ring 0 = center dot (radius 0).
 * Rings 1-maxRing have increasing spacing (GROWTH), with school rings
 * additionally compressed by SCHOOL_COMPRESS.
 */
function buildRadii(
  maxRing: number,
  baseGap: number,
  schoolLast: number
): number[] {
  const radii = [0]; // ring 0 at center
  let cumul = 0;
  for (let i = 1; i <= maxRing; i++) {
    const t = maxRing <= 1 ? 0 : (i - 1) / (maxRing - 1);
    let spacing = baseGap * (1 + GROWTH * t);
    if (i <= schoolLast) spacing *= SCHOOL_COMPRESS;
    cumul += spacing;
    radii.push(cumul);
  }
  return radii;
}

function orbitSpeed(ring: number): number {
  const base = 0.07 / (1 + ring * 0.25);
  return ring % 2 === 0 ? base : -base;
}

/** Outer rings = more important = bigger dots. Ring 0 = core dot. */
function dotSize(ring: number, maxRing: number): number {
  if (ring === 0) return 4; // core dot
  if (maxRing <= 1) return 4;
  const t = (ring - 1) / (maxRing - 1);
  return 3 + t * 3; // ring 1 → 3, outermost → 6
}

function processData(raw: JsonProject[]) {
  const all = raw.filter((p) => p.id && p.name);

  const seAll = all.filter((p) => p.domain === "software" && !p.isShared);
  const wdAll = all.filter((p) => p.domain === "web" && !p.isShared);
  const shared = all.filter((p) => p.isShared);

  const seMax = seAll.length ? Math.max(...seAll.map((p) => p.ring)) : 0;
  const wdMax = wdAll.length ? Math.max(...wdAll.map((p) => p.ring)) : 0;

  // Detect last school ring from project type
  const se42 = seAll.filter((p) => p.type === "42").map((p) => p.ring);
  const seSchoolLast = se42.length ? Math.max(...se42) : 0;
  const wdCodac = wdAll.filter((p) => p.type === "CODAC").map((p) => p.ring);
  const wdSchoolLast = wdCodac.length ? Math.max(...wdCodac) : 0;

  // Each system gets its own baseGap so both fill MAX_R (same outer radius)
  const seBaseGap = seMax > 0 ? MAX_R / ringWeightSum(seMax, seSchoolLast) : 0;
  const wdBaseGap = wdMax > 0 ? MAX_R / ringWeightSum(wdMax, wdSchoolLast) : 0;

  const seRadii = buildRadii(seMax, seBaseGap, seSchoolLast);
  const wdRadii = buildRadii(wdMax, wdBaseGap, wdSchoolLast);

  const seOuterR = seRadii[seRadii.length - 1] || 0;
  const wdOuterR = wdRadii[wdRadii.length - 1] || 0;

  // Position centers so the two systems are tangent at the SVG midpoint
  const midX = VIEW_W / 2;
  const seCenter = { x: midX - seOuterR, y: CENTER_Y };
  const wdCenter = { x: midX + wdOuterR, y: CENTER_Y };
  const convCenter = { x: midX, y: CENTER_Y };

  const orbital: OrbitalProject[] = [];

  // helper: distribute projects on a ring with a per-ring angular offset
  function pushRing(
    projects: JsonProject[],
    ring: number,
    maxRing: number,
    schoolLast: number,
    cat: "se" | "wd"
  ) {
    const n = projects.length;
    const offset = ring * Math.PI * 1.236; // golden-angle offset per ring
    projects.forEach((p, i) => {
      orbital.push({
        id: p.id,
        name: p.name,
        stack: p.tech_stack.filter(Boolean).join(" / "),
        description: p.description,
        orbit: ring,
        angle: (2 * Math.PI * i) / n + offset,
        speed: orbitSpeed(ring),
        size: dotSize(ring, maxRing),
        category: cat,
        isSchool: ring <= schoolLast,
        highlighted: p.highlighted ?? false,
        projectType: p.type as ProjectType,
      });
    });
  }

  for (let r = 0; r <= seMax; r++)
    pushRing(
      seAll.filter((p) => p.ring === r),
      r,
      seMax,
      seSchoolLast,
      "se"
    );
  for (let r = 0; r <= wdMax; r++)
    pushRing(
      wdAll.filter((p) => p.ring === r),
      r,
      wdMax,
      wdSchoolLast,
      "wd"
    );

  shared.forEach((p, i) => {
    orbital.push({
      id: p.id,
      name: p.name,
      stack: p.tech_stack.filter(Boolean).join(" / "),
      description: p.description,
      orbit: i % CONV_RADII.length,
      angle: i * Math.PI * 1.236,
      speed: i % 2 === 0 ? 0.05 : -0.04,
      size: 4,
      category: "conv",
      isSchool: false,
      highlighted: p.highlighted ?? false,
      projectType: p.type as ProjectType,
    });
  });

  return {
    orbital,
    seRadii,
    wdRadii,
    seCenter,
    wdCenter,
    convCenter,
    seOuterR,
    wdOuterR,
    hasConv: shared.length > 0,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

function getColor(cat: string, isSchool: boolean) {
  if (cat === "se") return isSchool ? SE_HUE : SE_HUE_BRIGHT;
  if (cat === "wd") return isSchool ? WD_HUE : WD_HUE_BRIGHT;
  return "#ffffff";
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ProjectsOrbital() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Map<string, SVGGElement>>(new Map());
  const pausedRef = useRef(false);
  const timeRef = useRef(0);

  // Drag-to-spin state
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef(0);   // accumulated angular offset (radians) added to all orbits
  const dragVelRef = useRef(0);      // angular velocity at release (for momentum)
  const lastDragAngleRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const dragCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // DJ scratch audio
  const scratchCtxRef = useRef<{
    ctx: AudioContext;
    source: AudioBufferSourceNode;
    filter: BiquadFilterNode;
    gain: GainNode;
  } | null>(null);

  const [hovered, setHovered] = useState<OrbitalProject | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const [arcGeo, setArcGeo] = useState<{ cx: number; cy: number; r: number } | null>(null);

  const {
    orbital,
    seRadii,
    wdRadii,
    seCenter,
    wdCenter,
    convCenter,
    seOuterR,
    wdOuterR,
    hasConv,
  } = useMemo(() => processData(projectsJson.projects as JsonProject[]), []);

  const getCenter = useCallback(
    (cat: string) =>
      cat === "se" ? seCenter : cat === "wd" ? wdCenter : convCenter,
    [seCenter, wdCenter, convCenter]
  );

  const getRadius = useCallback(
    (cat: string, orbit: number) => {
      const r = cat === "se" ? seRadii : cat === "wd" ? wdRadii : CONV_RADII;
      return r[orbit] ?? 0;
    },
    [seRadii, wdRadii]
  );

  /* ── Compute arc geometry + button scale ─────────────── */
  useEffect(() => {
    const svg = svgRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !wrapper) return;

    const update = () => {
      const svgRect = svg.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      const scale = svgRect.width / VIEW_W;

      // Scale buttons proportionally with the SVG
      wrapper.style.setProperty("--btn-scale", String(Math.min(scale, 1)));

      // SE orbit center in page pixels
      const seCxPage = svgRect.left + seCenter.x * scale;
      const seCyPage = svgRect.top + seCenter.y * scale;

      // Relative to wrapper origin (real CSS pixels)
      const cx = seCxPage - wrapperRect.left;
      const cy = seCyPage - wrapperRect.top;
      // Ring radius in rendered pixels
      const r = (seOuterR + 30) * scale;

      setArcGeo({ cx, cy, r });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [seCenter, seOuterR]);

  /* ── Animation loop ─────────────────────────────────── */
  useEffect(() => {
    let frameId: number;
    let last = performance.now();

    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;

      // Momentum: after drag release, keep spinning with friction
      if (!draggingRef.current && Math.abs(dragVelRef.current) > 0.001) {
        dragOffsetRef.current += dragVelRef.current * dt;
        dragVelRef.current *= Math.pow(0.02, dt); // friction: ~98 %/s decay
      } else if (!draggingRef.current) {
        dragVelRef.current = 0;
      }

      if (!pausedRef.current) {
        timeRef.current += dt;
      }

      for (const p of orbital) {
        const g = groupRefs.current.get(p.id);
        if (!g) continue;
        const c = getCenter(p.category);
        const r = getRadius(p.category, p.orbit);
        const a = p.angle + timeRef.current * p.speed + dragOffsetRef.current;
        g.setAttribute(
          "transform",
          `translate(${c.x + Math.cos(a) * r},${c.y + Math.sin(a) * r})`
        );
      }

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [orbital, getRadius, getCenter]);

  /* ── Handlers ───────────────────────────────────────── */
  const onEnter = useCallback((p: OrbitalProject, e: React.MouseEvent) => {
    pausedRef.current = true;
    setHovered(p);
    const box = containerRef.current;
    const g = e.currentTarget as SVGGElement;
    if (box && g) {
      const br = box.getBoundingClientRect();
      const gr = g.getBoundingClientRect();
      setTipPos({
        x: gr.left + gr.width / 2 - br.left,
        y: gr.top - br.top - 10,
      });
    }
  }, []);

  const onLeave = useCallback(() => {
    pausedRef.current = false;
    setHovered(null);
  }, []);

  /* ── DJ scratch audio ───────────────────────────────── */
  const initScratchAudio = useCallback(() => {
    if (scratchCtxRef.current) return;
    const ctx = new AudioContext();

    // Create 2 seconds of noise
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.loop = true;

    // Bandpass filter → scratchy character
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 1.5;

    // Gain → silent until dragging
    const gain = ctx.createGain();
    gain.gain.value = 0;

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();

    scratchCtxRef.current = { ctx, source, filter, gain };
  }, []);

  const updateScratchAudio = useCallback((velocity: number) => {
    const s = scratchCtxRef.current;
    if (!s) return;
    const absVel = Math.abs(velocity);
    const t = s.ctx.currentTime;

    // Volume proportional to speed (clamped)
    const vol = Math.min(absVel / 6, 0.18);
    s.gain.gain.cancelScheduledValues(t);
    s.gain.gain.setTargetAtTime(vol, t, 0.03);

    // Filter freq follows speed → higher = brighter scratch
    const freq = 600 + Math.min(absVel, 10) * 300;
    s.filter.frequency.cancelScheduledValues(t);
    s.filter.frequency.setTargetAtTime(freq, t, 0.03);

    // Playback rate: direction + speed → vinyl direction
    const rate = Math.sign(velocity) * Math.max(0.3, Math.min(absVel * 1.5, 4));
    s.source.playbackRate.cancelScheduledValues(t);
    s.source.playbackRate.setTargetAtTime(rate || 0.3, t, 0.04);
  }, []);

  const fadeScratchAudio = useCallback(() => {
    const s = scratchCtxRef.current;
    if (!s) return;
    const t = s.ctx.currentTime;
    s.gain.gain.cancelScheduledValues(t);
    s.gain.gain.setTargetAtTime(0, t, 0.12); // fade out over ~120 ms
  }, []);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      scratchCtxRef.current?.ctx.close();
    };
  }, []);

  /* ── Drag-to-spin handlers ─────────────────────────── */

  // Convert page coords to SVG viewBox coords
  const pageToSvg = useCallback((px: number, py: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const s = VIEW_W / rect.width;
    return { x: (px - rect.left) * s, y: (py - rect.top) * s };
  }, []);

  const onDragStart = useCallback(
    (e: React.PointerEvent) => {
      // Don't interfere with dot hover / click
      if ((e.target as Element).closest(`.${styles.projectGroup}`)) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      dragVelRef.current = 0;

      // Lazily init audio on first user gesture
      initScratchAudio();

      const pt = pageToSvg(e.clientX, e.clientY);
      // Pick the closer orbit center as the drag pivot
      const dSE = Math.hypot(pt.x - seCenter.x, pt.y - seCenter.y);
      const dWD = Math.hypot(pt.x - wdCenter.x, pt.y - wdCenter.y);
      const pivot = dSE <= dWD ? seCenter : wdCenter;
      dragCenterRef.current = pivot;

      lastDragAngleRef.current = Math.atan2(pt.y - pivot.y, pt.x - pivot.x);
      lastDragTimeRef.current = performance.now();
    },
    [pageToSvg, seCenter, wdCenter, initScratchAudio]
  );

  const onDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      const now = performance.now();
      const dt = (now - lastDragTimeRef.current) / 1000;
      if (dt < 0.005) return;

      const pt = pageToSvg(e.clientX, e.clientY);
      const pivot = dragCenterRef.current;
      const angle = Math.atan2(pt.y - pivot.y, pt.x - pivot.x);

      let delta = angle - lastDragAngleRef.current;
      // Unwrap around ±π
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;

      // Add the angular change directly to the offset
      dragOffsetRef.current += delta;
      // Track velocity for momentum after release (smoothed)
      dragVelRef.current = dragVelRef.current * 0.6 + (delta / dt) * 0.4;

      // Update scratch audio
      updateScratchAudio(dragVelRef.current);

      lastDragAngleRef.current = angle;
      lastDragTimeRef.current = now;
    },
    [pageToSvg, updateScratchAudio]
  );

  const onDragEnd = useCallback(() => {
    draggingRef.current = false;
    fadeScratchAudio();
    // dragVelRef keeps its value → momentum decays via friction in the tick loop
  }, [fadeScratchAudio]);

  /* ── Render ─────────────────────────────────────────── */
  return (
    <motion.div
      id="projects"
      ref={containerRef}
      className={styles.container}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2 }}
    >
      {/* ══════════ FILTER TABS ══════════ */}
      <div ref={wrapperRef} className={styles.filterBarWrapper}>
        <div
          className={styles.filterBar}
          style={
            arcGeo
              ? {
                  WebkitMaskImage: `radial-gradient(circle ${arcGeo.r}px at ${arcGeo.cx}px ${arcGeo.cy}px, transparent ${arcGeo.r - 1}px, black ${arcGeo.r}px)`,
                  maskImage: `radial-gradient(circle ${arcGeo.r}px at ${arcGeo.cx}px ${arcGeo.cy}px, transparent ${arcGeo.r - 1}px, black ${arcGeo.r}px)`,
                }
              : undefined
          }
        >
          {(["independent", "professional", "CODAC", "42", "highlighted"] as FilterOption[]).map((t) => {
            const label = t === "42" ? "42" : t === "CODAC" ? "CODAC" : t === "independent" ? "Independent" : t === "professional" ? "Professional" : "★";
            const tint = t === "42" ? SE_HUE : t === "CODAC" ? WD_HUE : t === "independent" ? SE_HUE_BRIGHT : t === "professional" ? WD_HUE_BRIGHT : "#ffd54f";
            const isActive = activeFilter === t;
            return (
              <button
                key={t}
                className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ""}`}
                style={isActive && tint ? { borderColor: tint, color: tint } : undefined}
                onClick={() => setActiveFilter(isActive ? null : t)}
              >
                {label}
              </button>
            );
          })}
        </div>
        {/* Arc border along the circular cut */}
        {arcGeo && (
          <div
            className={styles.filterBarArc}
            style={{
              width: arcGeo.r * 2,
              height: arcGeo.r * 2,
              top: arcGeo.cy - arcGeo.r,
              left: arcGeo.cx - arcGeo.r,
            }}
          />
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={styles.svg}
        style={{ touchAction: "none" }}
        data-hovering={hovered ? "true" : "false"}
        data-filtering={activeFilter ? "true" : "false"}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
      >
        {/* ══════════ DEFS ══════════ */}
        <defs>
          <filter id="gl-se" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gl-wd" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gl-cv" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gl-core" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="rg-conv" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.18} />
            <stop offset="35%" stopColor={SE_HUE} stopOpacity={0.06} />
            <stop offset="100%" stopColor="#080810" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="rg-se" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={SE_HUE} stopOpacity={0.05} />
            <stop offset="100%" stopColor={SE_HUE} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="rg-wd" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={WD_HUE} stopOpacity={0.05} />
            <stop offset="100%" stopColor={WD_HUE} stopOpacity={0} />
          </radialGradient>

          <linearGradient id="lg-beam-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity={0} />
            <stop offset="40%" stopColor="#fff" stopOpacity={0.5} />
            <stop offset="50%" stopColor="#fff" stopOpacity={0.8} />
            <stop offset="60%" stopColor="#fff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="lg-beam-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity={0} />
            <stop offset="50%" stopColor="#fff" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </linearGradient>

          {/* Arc paths for labels along the outermost ring */}
          {/* Arc paths inside the outermost ring */}
          <path
            id="arc-se"
            d={`M ${seCenter.x - seOuterR + 28},${seCenter.y} A ${seOuterR - 28},${seOuterR - 28} 0 0,1 ${seCenter.x + seOuterR - 28},${seCenter.y}`}
            fill="none"
          />
          <path
            id="arc-wd"
            d={`M ${wdCenter.x - wdOuterR + 28},${wdCenter.y} A ${wdOuterR - 28},${wdOuterR - 28} 0 0,1 ${wdCenter.x + wdOuterR - 28},${wdCenter.y}`}
            fill="none"
          />
        </defs>

        {/* ══════════ SOFTWARE ENGINEERING SYSTEM ══════════ */}

        <circle
          id="first-circle"
          cx={seCenter.x}
          cy={seCenter.y}
          r={seOuterR + 40}
          fill="url(#rg-se)"
        />

        {/* Orbit rings (skip ring 0 which is the core dot at center) */}
        {seRadii.slice(1).map((r, i) => (
          <circle
            key={`se-o-${i}`}
            cx={seCenter.x}
            cy={seCenter.y}
            r={r}
            fill="none"
            stroke={SE_HUE}
            strokeWidth={i === 0 ? 0.8 : 0.4}
            opacity={0.1 + (i / (seRadii.length - 1)) * 0.12}
          />
        ))}

        {/* Label – arc along outermost ring */}
        <text
          fill="#fff"
          fontSize={11}
          fontWeight="600"
          fontFamily={FONT}
          letterSpacing={4}
          opacity={0.35}
        >
          <textPath href="#arc-se" startOffset="35%" textAnchor="middle">
            SOFTWARE ENGINEERING
          </textPath>
        </text>

        {/* ══════════ WEB DEVELOPMENT SYSTEM ══════════ */}

        <circle
          cx={wdCenter.x}
          cy={wdCenter.y}
          r={wdOuterR + 40}
          fill="url(#rg-wd)"
        />

        {/* Orbit rings (skip ring 0 which is the core dot at center) */}
        {wdRadii.slice(1).map((r, i) => (
          <circle
            key={`wd-o-${i}`}
            cx={wdCenter.x}
            cy={wdCenter.y}
            r={r}
            fill="none"
            stroke={WD_HUE}
            strokeWidth={i === 0 ? 0.8 : 0.4}
            opacity={0.1 + (i / (wdRadii.length - 1)) * 0.12}
          />
        ))}

        {/* Label – arc along outermost ring */}
        <text
          fill="#fff"
          fontSize={11}
          fontWeight="600"
          fontFamily={FONT}
          letterSpacing={4}
          opacity={0.35}
        >
          <textPath href="#arc-wd" startOffset="65%" textAnchor="middle">
            WEB DEVELOPMENT
          </textPath>
        </text>

        {/* ══════════ CONVERGENCE ZONE ══════════ */}
        {hasConv && (
          <>
            <circle
              cx={convCenter.x}
              cy={convCenter.y}
              r={55}
              fill="url(#rg-conv)"
              className={styles.convergenceGlow}
            />
            <rect
              x={convCenter.x - 1}
              y={convCenter.y - 80}
              width={2}
              height={160}
              fill="url(#lg-beam-v)"
              opacity={0.1}
            />
            <rect
              x={convCenter.x - 25}
              y={convCenter.y - 0.5}
              width={50}
              height={1}
              fill="url(#lg-beam-h)"
              opacity={0.06}
            />
            {CONV_RADII.map((r, i) => (
              <circle
                key={`cv-o-${i}`}
                cx={convCenter.x}
                cy={convCenter.y}
                r={r}
                fill="none"
                stroke="#fff"
                strokeWidth={0.4}
                opacity={0.12}
              />
            ))}
            <circle
              cx={convCenter.x}
              cy={convCenter.y}
              r={2.5}
              fill="#fff"
              opacity={0.9}
              filter="url(#gl-core)"
            />
            <text
              x={convCenter.x}
              y={convCenter.y + 58}
              textAnchor="middle"
              fill="#fff"
              fontSize={8.5}
              fontWeight="600"
              fontFamily={FONT}
              letterSpacing={2}
              opacity={0.35}
            >
              CONVERGENCE ZONE
            </text>
          </>
        )}

        {/* ══════════ PROJECT DOTS ══════════ */}
        {orbital.map((p) => {
          const color = getColor(p.category, p.isSchool);
          const filter =
            p.category === "se"
              ? "gl-se"
              : p.category === "wd"
              ? "gl-wd"
              : "gl-cv";
          const dimmed = activeFilter !== null && (
            activeFilter === "highlighted" ? !p.highlighted : p.projectType !== activeFilter
          );
          return (
            <g
              key={p.id}
              ref={(el) => {
                if (el) groupRefs.current.set(p.id, el);
              }}
              className={`${styles.projectGroup} ${dimmed ? styles.dimmed : ""}`}
              onMouseEnter={(e) => onEnter(p, e)}
              onMouseLeave={onLeave}
            >
              <circle r={14} fill="transparent" />
              <circle
                r={p.size}
                fill={color}
                filter={`url(#${filter})`}
                className={styles.dot}
              />
              {p.highlighted && (() => {
                const s = p.size * 0.45; // star arm length relative to dot
                return (
                  <path
                    d={`M0,${-s} L${s*0.22},${-s*0.22} L${s},0 L${s*0.22},${s*0.22} L0,${s} L${-s*0.22},${s*0.22} L${-s},0 L${-s*0.22},${-s*0.22}Z`}
                    fill="#000"
                    opacity={0.7}
                    style={{ pointerEvents: "none" }}
                  />
                );
              })()}
            </g>
          );
        })}
      </svg>

      {/* ══════════ TOOLTIP ══════════ */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className={styles.tooltip}
            style={{ left: tipPos.x, top: tipPos.y }}
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ duration: 0.15 }}
          >
            <div className={styles.tooltipName}>{hovered.name}</div>
            <div className={styles.tooltipStack}>{hovered.stack}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
