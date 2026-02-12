"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/orbital.module.css";
import { Mode } from "@/types";
import projectsJson from "../public/projects.json";

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════ */

const VIEW_W = 1200;
const VIEW_H = 700;

const SE_CENTER = { x: 330, y: 360 };
const WD_CENTER = { x: 870, y: 360 };
const CONV_CENTER = { x: 600, y: 360 };

// Both outer-most rings meet exactly at x = 600
const TANGENT_R = 270;
const MIN_ORBIT_R = 60;
const CONV_RADII = [20, 40];

const SE_HUE = "#00e5ff";
const WD_HUE = "#00e676";
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
}

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
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA PROCESSING
   ═══════════════════════════════════════════════════════════════════════════ */

/** Ring 0 = center (radius 0). Rings 1-maxRing spread from MIN_ORBIT_R to TANGENT_R.
 *  Uses a power curve (t^1.6) so school rings cluster tighter near the core. */
function buildRadii(maxRing: number): number[] {
  const radii = [0]; // ring 0 sits at the core
  for (let i = 1; i <= maxRing; i++) {
    const t = maxRing <= 1 ? 0 : (i - 1) / (maxRing - 1);
    radii.push(MIN_ORBIT_R + Math.pow(t, 1.6) * (TANGENT_R - MIN_ORBIT_R));
  }
  return radii;
}

function orbitSpeed(ring: number): number {
  const base = 0.07 / (1 + ring * 0.25);
  return ring % 2 === 0 ? base : -base;
}

function dotSize(ring: number, maxRing: number): number {
  if (ring === 0) return 6; // core dot
  if (maxRing <= 1) return 5;
  const t = (ring - 1) / (maxRing - 1);
  return 5.5 - t * 2; // 5.5 → 3.5
}

function processData(raw: JsonProject[]) {
  const all = raw.filter((p) => p.id && p.name);

  const seAll = all.filter((p) => p.domain === "software" && !p.isShared);
  const wdAll = all.filter((p) => p.domain === "web" && !p.isShared);
  const shared = all.filter((p) => p.isShared);

  const seMax = seAll.length ? Math.max(...seAll.map((p) => p.ring)) : 0;
  const wdMax = wdAll.length ? Math.max(...wdAll.map((p) => p.ring)) : 0;

  const seRadii = buildRadii(seMax);
  const wdRadii = buildRadii(wdMax);

  const orbital: OrbitalProject[] = [];

  // helper: distribute projects on a ring with a per-ring angular offset
  function pushRing(
    projects: JsonProject[],
    ring: number,
    maxRing: number,
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
      });
    });
  }

  for (let r = 0; r <= seMax; r++) pushRing(seAll.filter((p) => p.ring === r), r, seMax, "se");
  for (let r = 0; r <= wdMax; r++) pushRing(wdAll.filter((p) => p.ring === r), r, wdMax, "wd");

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
    });
  });

  return { orbital, seRadii, wdRadii, hasConv: shared.length > 0 };
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

function getCenter(cat: string) {
  return cat === "se" ? SE_CENTER : cat === "wd" ? WD_CENTER : CONV_CENTER;
}

function getColor(cat: string) {
  return cat === "se" ? SE_HUE : cat === "wd" ? WD_HUE : "#ffffff";
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  theme: Mode;
}

export default function ProjectsOrbital({ theme }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRefs = useRef<Map<string, SVGGElement>>(new Map());
  const pausedRef = useRef(false);
  const timeRef = useRef(0);

  const [hovered, setHovered] = useState<OrbitalProject | null>(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });

  const { orbital, seRadii, wdRadii, hasConv } = useMemo(
    () => processData(projectsJson.projects as JsonProject[]),
    []
  );

  const getRadius = useCallback(
    (cat: string, orbit: number) => {
      const r = cat === "se" ? seRadii : cat === "wd" ? wdRadii : CONV_RADII;
      return r[orbit] ?? 0;
    },
    [seRadii, wdRadii]
  );

  /* ── Animation loop ─────────────────────────────────── */
  useEffect(() => {
    let frameId: number;
    let last = performance.now();

    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current) timeRef.current += dt;

      for (const p of orbital) {
        const g = groupRefs.current.get(p.id);
        if (!g) continue;
        const c = getCenter(p.category);
        const r = getRadius(p.category, p.orbit);
        const a = p.angle + timeRef.current * p.speed;
        g.setAttribute("transform", `translate(${c.x + Math.cos(a) * r},${c.y + Math.sin(a) * r})`);
      }

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [orbital, getRadius]);

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
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={styles.svg}
        data-hovering={hovered ? "true" : "false"}
      >
        {/* ══════════ DEFS ══════════ */}
        <defs>
          <filter id="gl-se" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="gl-wd" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="gl-cv" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="gl-core" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
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
        </defs>

        {/* ══════════ SOFTWARE ENGINEERING SYSTEM ══════════ */}

        <circle cx={SE_CENTER.x} cy={SE_CENTER.y} r={TANGENT_R + 40} fill="url(#rg-se)" />

        {/* Orbit rings (skip ring 0 which is the core at radius 0) */}
        {seRadii.slice(1).map((r, i) => (
          <circle
            key={`se-o-${i}`}
            cx={SE_CENTER.x}
            cy={SE_CENTER.y}
            r={r}
            fill="none"
            stroke={SE_HUE}
            strokeWidth={i === 0 ? 0.8 : 0.4}
            opacity={0.1 + (i / (seRadii.length - 1)) * 0.12}
          />
        ))}

        {/* Labels */}
        <text x={SE_CENTER.x} y={34} textAnchor="middle" fill="#fff" fontSize={13} fontWeight="600" fontFamily={FONT} letterSpacing={3.5} opacity={0.6}>SOFTWARE ENGINEERING</text>
        <text x={SE_CENTER.x - 80} y={VIEW_H - 28} textAnchor="middle" fill={SE_HUE} fontSize={11} fontFamily={FONT} fontStyle="italic" opacity={0.4}>Post-42 Projects</text>

        {/* ══════════ WEB DEVELOPMENT SYSTEM ══════════ */}

        <circle cx={WD_CENTER.x} cy={WD_CENTER.y} r={TANGENT_R + 40} fill="url(#rg-wd)" />

        {/* Orbit rings (skip ring 0 which is the core at radius 0) */}
        {wdRadii.slice(1).map((r, i) => (
          <circle
            key={`wd-o-${i}`}
            cx={WD_CENTER.x}
            cy={WD_CENTER.y}
            r={r}
            fill="none"
            stroke={WD_HUE}
            strokeWidth={i === 0 ? 0.8 : 0.4}
            opacity={0.1 + (i / (wdRadii.length - 1)) * 0.12}
          />
        ))}

        {/* Labels */}
        <text x={WD_CENTER.x} y={34} textAnchor="middle" fill="#fff" fontSize={13} fontWeight="600" fontFamily={FONT} letterSpacing={3.5} opacity={0.6}>WEB DEVELOPMENT</text>
        <text x={WD_CENTER.x + 60} y={78} textAnchor="middle" fill={WD_HUE} fontSize={11} fontFamily={FONT} fontStyle="italic" opacity={0.4}>Latest Professional Work</text>

        {/* ══════════ CONVERGENCE ZONE ══════════ */}
        {hasConv && (
          <>
            <circle cx={CONV_CENTER.x} cy={CONV_CENTER.y} r={55} fill="url(#rg-conv)" className={styles.convergenceGlow} />
            <rect x={CONV_CENTER.x - 1} y={CONV_CENTER.y - 80} width={2} height={160} fill="url(#lg-beam-v)" opacity={0.1} />
            <rect x={CONV_CENTER.x - 25} y={CONV_CENTER.y - 0.5} width={50} height={1} fill="url(#lg-beam-h)" opacity={0.06} />
            {CONV_RADII.map((r, i) => (
              <circle key={`cv-o-${i}`} cx={CONV_CENTER.x} cy={CONV_CENTER.y} r={r} fill="none" stroke="#fff" strokeWidth={0.4} opacity={0.12} />
            ))}
            <circle cx={CONV_CENTER.x} cy={CONV_CENTER.y} r={2.5} fill="#fff" opacity={0.9} filter="url(#gl-core)" />
            <text x={CONV_CENTER.x} y={CONV_CENTER.y + 58} textAnchor="middle" fill="#fff" fontSize={8.5} fontWeight="600" fontFamily={FONT} letterSpacing={2} opacity={0.35}>CONVERGENCE ZONE</text>
          </>
        )}

        {/* ══════════ PROJECT DOTS ══════════ */}
        {orbital.map((p) => {
          const color = getColor(p.category);
          const filter = p.category === "se" ? "gl-se" : p.category === "wd" ? "gl-wd" : "gl-cv";
          return (
            <g
              key={p.id}
              ref={(el) => { if (el) groupRefs.current.set(p.id, el); }}
              className={styles.projectGroup}
              onMouseEnter={(e) => onEnter(p, e)}
              onMouseLeave={onLeave}
            >
              <circle r={14} fill="transparent" />
              <circle r={p.size} fill={color} filter={`url(#${filter})`} className={styles.dot} />
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
