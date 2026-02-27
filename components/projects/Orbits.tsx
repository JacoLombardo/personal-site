"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/orbital.module.css";
import type { OrbitalData, OrbitalProject, FilterOption } from "./projectsData";

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURATION (SVG viewBox + colors)
   ═══════════════════════════════════════════════════════════════════════════ */

const VIEW_W = 1200;
const VIEW_H = 700;
/** Match ORBIT_SCALE in projectsData.ts so convergence orbits stay proportional */
const CONV_RADII = [18, 35];
/** Scale convergence zone on mobile (vertical layout) to match bigger SE/WD orbits */
const MOBILE_CONV_SCALE = 2.5;
const SE_HUE = "#00e5ff";
const SE_HUE_BRIGHT = "#80f0ff";
const WD_HUE = "#00e676";
const WD_HUE_BRIGHT = "#80ffb0";
const FONT = "poppins, sans-serif";

function getColor(cat: string, isSchool: boolean) {
  if (cat === "se") return isSchool ? SE_HUE : SE_HUE_BRIGHT;
  if (cat === "wd") return isSchool ? WD_HUE : WD_HUE_BRIGHT;
  return "#ffffff";
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface OrbitsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  orbitalData: OrbitalData;
  isMobile: boolean;
  activeFilter?: FilterOption | null;
  setActiveFilter?: (f: FilterOption | null) => void;
}

export default function Orbits({ containerRef, orbitalData, isMobile, activeFilter: activeFilterProp, setActiveFilter: setActiveFilterProp }: OrbitsProps) {
  const router = useRouter();
  const orbitsRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Map<string, SVGGElement>>(new Map());
  const pausedRef = useRef(false);
  const timeRef = useRef(0);

  const draggingRef = useRef(false);
  const dragOffsetRef = useRef(0);
  const dragVelRef = useRef(0);
  const lastDragAngleRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const dragCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const scratchCtxRef = useRef<{
    ctx: AudioContext;
    source: AudioBufferSourceNode;
    filter: BiquadFilterNode;
    gain: GainNode;
  } | null>(null);

  const [internalFilter, setInternalFilter] = useState<FilterOption | null>(null);
  const activeFilter = setActiveFilterProp ? activeFilterProp : internalFilter;
  const setActiveFilter = setActiveFilterProp ?? setInternalFilter;

  const [hovered, setHovered] = useState<OrbitalProject | null>(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const [lastClickedPlanetId, setLastClickedPlanetId] = useState<string | null>(null);
  const [arcGeo, setArcGeo] = useState<{ cx: number; cy: number; r: number } | null>(null);
  const [tipAnchor, setTipAnchor] = useState<{ centerX: number; topY: number; bottomY: number } | null>(null);
  const [tipWrapMaxWidth, setTipWrapMaxWidth] = useState<number | null>(null);
  const tipRafRef = useRef<number | null>(null);

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
  } = orbitalData;

  /* ViewBox must contain the drawn circles: arcs use radius up to maxR + 40 (see r={seOuterR+40} below) */
  const padding = 0;
  const maxR = Math.max(seOuterR, wdOuterR);
  const drawnOuterR = maxR + 40;
  const contentTop = Math.min(
    seCenter.y - drawnOuterR,
    convCenter.y - 80,
    wdCenter.y - drawnOuterR
  );
  const contentBottom = Math.max(
    seCenter.y + drawnOuterR,
    convCenter.y + 58,
    wdCenter.y + drawnOuterR
  );
  const viewBoxY = contentTop - padding;
  const viewBoxHeight = contentBottom - contentTop + padding * 2;
  const viewBox = `0 ${viewBoxY} ${VIEW_W} ${viewBoxHeight}`;

  const getCenter = useCallback(
    (cat: string) =>
      cat === "se" ? seCenter : cat === "wd" ? wdCenter : convCenter,
    [seCenter, wdCenter, convCenter]
  );

  /* Vertical layout (mobile): centers share same x; use scaled convergence radii */
  const isVerticalLayout = seCenter.x === wdCenter.x && seCenter.y !== wdCenter.y;
  const convRadii = isVerticalLayout
    ? CONV_RADII.map((r) => r * MOBILE_CONV_SCALE)
    : CONV_RADII;

  const getRadius = useCallback(
    (cat: string, orbit: number) => {
      const r = cat === "se" ? seRadii : cat === "wd" ? wdRadii : convRadii;
      return r[orbit] ?? 0;
    },
    [seRadii, wdRadii, convRadii]
  );

  const showDesktopFilterBar = !setActiveFilterProp;

  useEffect(() => {
    if (!showDesktopFilterBar) return;
    const svg = svgRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !wrapper) return;

    const update = () => {
      const svgRect = svg.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      const scale = Math.min(svgRect.width / VIEW_W, svgRect.height / viewBoxHeight);
      const offsetX = (svgRect.width - VIEW_W * scale) / 2;
      const offsetY = (svgRect.height - viewBoxHeight * scale) / 2;

      wrapper.style.setProperty("--btn-scale", String(Math.min(scale, 1)));

      const seCxPage = svgRect.left + offsetX + seCenter.x * scale;
      const seCyPage = svgRect.top + offsetY + (seCenter.y - viewBoxY) * scale;
      const cx = seCxPage - wrapperRect.left;
      const cy = seCyPage - wrapperRect.top;
      const r = (seOuterR + 30) * scale;

      setArcGeo({ cx, cy, r });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [showDesktopFilterBar, seCenter, seOuterR, viewBoxY, viewBoxHeight]);

  useEffect(() => {
    let frameId: number;
    let last = performance.now();

    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;

      if (!draggingRef.current && Math.abs(dragVelRef.current) > 0.001) {
        dragOffsetRef.current += dragVelRef.current * dt;
        dragVelRef.current *= Math.pow(0.02, dt);
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

  const onEnter = useCallback((p: OrbitalProject, e: React.MouseEvent) => {
    pausedRef.current = true;
    setTipWrapMaxWidth(null);
    setHovered(p);
    const g = e.currentTarget as SVGGElement;
    const gr = g.getBoundingClientRect();
    setTipAnchor({
      centerX: gr.left + gr.width / 2,
      topY: gr.top,
      bottomY: gr.bottom,
    });
  }, []);

  const onLeave = useCallback(() => {
    pausedRef.current = false;
    setHovered(null);
    setTipAnchor(null);
    setTipWrapMaxWidth(null);
  }, []);

  const onPlanetClick = useCallback(
    (p: OrbitalProject, e: React.MouseEvent) => {
      if (!isMobile) return;
      e.preventDefault();
      if (hovered?.id === p.id) {
        setHovered(null);
        setTipAnchor(null);
        setLastClickedPlanetId(null);
        setTipWrapMaxWidth(null);
        return;
      }
      setTipWrapMaxWidth(null);
      setLastClickedPlanetId(p.id);
      setHovered(p);
      const g = groupRefs.current.get(p.id);
      if (g) {
        const gr = g.getBoundingClientRect();
        setTipAnchor({
          centerX: gr.left + gr.width / 2,
          topY: gr.top,
          bottomY: gr.bottom,
        });
      }
    },
    [isMobile, hovered?.id]
  );

  const onTooltipClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isMobile || !hovered) return;
      e.preventDefault();
      e.stopPropagation();
      router.push(`/project/${hovered.id}`);
    },
    [isMobile, hovered, router]
  );

  const updateTooltipPosition = useCallback(() => {
    if (!hovered || !tipAnchor) return;
    const tip = tooltipRef.current;
    if (!tip) return;
    const tipRect = tip.getBoundingClientRect();
    const tipW = tipRect.width;
    const tipH = tipRect.height;

    const vv = window.visualViewport;
    const viewportW = vv?.width ?? document.documentElement.clientWidth;
    const viewportH = vv?.height ?? document.documentElement.clientHeight;
    const viewportLeft = vv?.offsetLeft ?? 0;
    const viewportTop = vv?.offsetTop ?? 0;

    // Same inset from all viewport edges so left/right margins match.
    const inset = 10 + 6; // margin + shadow so tooltip isn't cut
    const edgeLeft = viewportLeft + inset;
    const edgeTop = viewportTop + inset;
    const edgeRight = viewportLeft + viewportW - inset;
    const edgeBottom = viewportTop + viewportH - inset;

    const offsetX = 20;
    const offsetY = 10;

    // If the tooltip's natural (nowrap) width is wider than the viewport,
    // constrain it and allow wrapping so it becomes taller instead of being cut.
    const viewportMaxW = edgeRight - edgeLeft;
    if (tipWrapMaxWidth == null && tipW > viewportMaxW) {
      setTipWrapMaxWidth(viewportMaxW);
      return; // Wait for re-render with new width, then reposition.
    }

    // Prefer above; if clipped, flip below; clamp within viewport.
    const topAbove = tipAnchor.topY - tipH - offsetY;
    const topBelow = tipAnchor.bottomY + offsetY;
    let top = topAbove < edgeTop ? topBelow : topAbove;
    if (top + tipH > edgeBottom) top = topAbove;
    top = Math.min(Math.max(top, edgeTop), edgeBottom - tipH);

    // Prefer slightly to the right; if clipped, flip to left; clamp within viewport.
    const leftRight = tipAnchor.centerX - tipW / 2 + offsetX;
    const leftLeft = tipAnchor.centerX - tipW / 2 - offsetX;
    let left = leftRight + tipW > edgeRight ? leftLeft : leftRight;
    left = Math.min(Math.max(left, edgeLeft), edgeRight - tipW);

    // Tooltip is position: fixed (viewport coords)
    const next = { x: left, y: top };
    setTipPos((prev) => {
      const dx = Math.abs(prev.x - next.x);
      const dy = Math.abs(prev.y - next.y);
      return dx < 0.5 && dy < 0.5 ? prev : next;
    });
  }, [hovered, tipAnchor, tipWrapMaxWidth]);

  useLayoutEffect(() => {
    updateTooltipPosition();
  }, [updateTooltipPosition]);

  useEffect(() => {
    if (!hovered) return;
    const on = () => {
      if (tipRafRef.current != null) cancelAnimationFrame(tipRafRef.current);
      tipRafRef.current = requestAnimationFrame(() => {
        tipRafRef.current = null;
        updateTooltipPosition();
      });
    };
    window.addEventListener("resize", on);
    window.addEventListener("scroll", on, true);
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("scroll", on, true);
      if (tipRafRef.current != null) cancelAnimationFrame(tipRafRef.current);
      tipRafRef.current = null;
    };
  }, [hovered, updateTooltipPosition]);

  const initScratchAudio = useCallback(() => {
    if (scratchCtxRef.current) return;
    const ctx = new AudioContext();
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 1.5;

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
    const vol = Math.min(absVel / 6, 0.18);
    s.gain.gain.cancelScheduledValues(t);
    s.gain.gain.setTargetAtTime(vol, t, 0.03);
    const freq = 600 + Math.min(absVel, 10) * 300;
    s.filter.frequency.cancelScheduledValues(t);
    s.filter.frequency.setTargetAtTime(freq, t, 0.03);
    const rate = Math.sign(velocity) * Math.max(0.3, Math.min(absVel * 1.5, 4));
    s.source.playbackRate.cancelScheduledValues(t);
    s.source.playbackRate.setTargetAtTime(rate || 0.3, t, 0.04);
  }, []);

  const fadeScratchAudio = useCallback(() => {
    const s = scratchCtxRef.current;
    if (!s) return;
    const t = s.ctx.currentTime;
    s.gain.gain.cancelScheduledValues(t);
    s.gain.gain.setTargetAtTime(0, t, 0.12);
  }, []);

  useEffect(() => {
    return () => {
      scratchCtxRef.current?.ctx.close();
    };
  }, []);

  const pageToSvg = useCallback((px: number, py: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const s = VIEW_W / rect.width;
    return { x: (px - rect.left) * s, y: (py - rect.top) * s };
  }, []);

  const onDragStart = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as Element).closest(`.${styles.projectGroup}`)) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      dragVelRef.current = 0;
      initScratchAudio();

      const pt = pageToSvg(e.clientX, e.clientY);
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
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;

      dragOffsetRef.current += delta;
      dragVelRef.current = dragVelRef.current * 0.6 + (delta / dt) * 0.4;
      updateScratchAudio(dragVelRef.current);

      lastDragAngleRef.current = angle;
      lastDragTimeRef.current = now;
    },
    [pageToSvg, updateScratchAudio]
  );

  const onDragEnd = useCallback(() => {
    draggingRef.current = false;
    fadeScratchAudio();
  }, [fadeScratchAudio]);

  return (
    <div ref={orbitsRef} className={styles.orbits}>
      {showDesktopFilterBar && (
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
                  type="button"
                  className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ""}`}
                  style={isActive && tint ? { borderColor: tint, color: tint } : undefined}
                  onClick={() => setActiveFilter(isActive ? null : t)}
                >
                  {label}
                </button>
              );
            })}
          </div>
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
      )}

      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className={styles.svg}
        style={{ touchAction: isMobile ? "auto" : "none" }}
        data-hovering={hovered ? "true" : "false"}
        data-filtering={activeFilter ? "true" : "false"}
        onPointerDown={isMobile ? undefined : onDragStart}
        onPointerMove={isMobile ? undefined : onDragMove}
        onPointerUp={isMobile ? undefined : onDragEnd}
        onPointerCancel={isMobile ? undefined : onDragEnd}
      >
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

        <circle
          id="first-circle"
          cx={seCenter.x}
          cy={seCenter.y}
          r={seOuterR + 40}
          fill="url(#rg-se)"
        />

        {seRadii.slice(1).map((r, i) => (
          <circle
            key={`se-o-${i}`}
            cx={seCenter.x}
            cy={seCenter.y}
            r={r}
            fill="none"
            stroke={SE_HUE}
            strokeWidth={i === 0 ? 0.8 : 0.4}
            opacity={isVerticalLayout ? 0.4 + (i / (seRadii.length - 1)) * 0.25 : 0.1 + (i / (seRadii.length - 1)) * 0.12}
          />
        ))}

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

        <circle
          cx={wdCenter.x}
          cy={wdCenter.y}
          r={wdOuterR + 40}
          fill="url(#rg-wd)"
        />

        {wdRadii.slice(1).map((r, i) => (
          <circle
            key={`wd-o-${i}`}
            cx={wdCenter.x}
            cy={wdCenter.y}
            r={r}
            fill="none"
            stroke={WD_HUE}
            strokeWidth={i === 0 ? 0.8 : 0.4}
            opacity={isVerticalLayout ? 0.4 + (i / (wdRadii.length - 1)) * 0.25 : 0.1 + (i / (wdRadii.length - 1)) * 0.12}
          />
        ))}

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

        {hasConv && (
          <>
            <circle
              cx={convCenter.x}
              cy={convCenter.y}
              r={isVerticalLayout ? 55 * MOBILE_CONV_SCALE : 55}
              fill="url(#rg-conv)"
              className={styles.convergenceGlow}
            />
            <rect
              x={convCenter.x - 1}
              y={convCenter.y - (isVerticalLayout ? 80 * MOBILE_CONV_SCALE : 80)}
              width={2}
              height={isVerticalLayout ? 160 * MOBILE_CONV_SCALE : 160}
              fill="url(#lg-beam-v)"
              opacity={0.1}
            />
            <rect
              x={convCenter.x - (isVerticalLayout ? 25 * MOBILE_CONV_SCALE : 25)}
              y={convCenter.y - 0.5}
              width={isVerticalLayout ? 50 * MOBILE_CONV_SCALE : 50}
              height={1}
              fill="url(#lg-beam-h)"
              opacity={0.06}
            />
            {convRadii.map((r, i) => (
              <circle
                key={`cv-o-${i}`}
                cx={convCenter.x}
                cy={convCenter.y}
                r={r}
                fill="none"
                stroke="#fff"
                strokeWidth={0.4}
                opacity={isVerticalLayout ? 0.4 : 0.12}
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
              y={convCenter.y + (isVerticalLayout ? 58 * MOBILE_CONV_SCALE : 58)}
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
            <Link
              key={p.id}
              href={`/project/${p.id}`}
              className={styles.planetLink}
              onClick={isMobile ? (e) => { e.preventDefault(); onPlanetClick(p, e); } : undefined}
            >
              <g
                ref={(el) => {
                  if (el) groupRefs.current.set(p.id, el);
                }}
                className={`${styles.projectGroup} ${dimmed ? styles.dimmed : ""} ${isMobile && hovered?.id === p.id ? styles.planetActive : ""}`}
                data-active={isMobile && hovered?.id === p.id ? "true" : undefined}
                onMouseEnter={(e) => onEnter(p, e)}
                onMouseLeave={onLeave}
              >
                <circle r={isVerticalLayout ? 26 : 14} fill="transparent" />
                <circle
                  r={isVerticalLayout ? p.size * 1.85 : p.size}
                  fill={color}
                  filter={`url(#${filter})`}
                  className={styles.dot}
                />
                {p.highlighted && (() => {
                  const baseSize = isVerticalLayout ? p.size * 1.85 : p.size;
                  const s = baseSize * 0.45;
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
            </Link>
          );
        })}
      </svg>

      <AnimatePresence>
        {hovered && (
          <motion.div
            ref={tooltipRef}
            className={styles.tooltip}
            style={{
              left: tipPos.x,
              top: tipPos.y,
              maxWidth: tipWrapMaxWidth ? `${tipWrapMaxWidth}px` : undefined,
              whiteSpace: tipWrapMaxWidth ? "normal" : "nowrap",
              overflowWrap: tipWrapMaxWidth ? "anywhere" : undefined,
              wordBreak: tipWrapMaxWidth ? "break-word" : undefined,
              pointerEvents: isMobile ? "auto" : undefined,
              cursor: isMobile ? "pointer" : undefined,
            }}
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            onClick={isMobile ? onTooltipClick : undefined}
            role={isMobile ? "button" : undefined}
            tabIndex={isMobile ? 0 : undefined}
            onKeyDown={isMobile && hovered ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/project/${hovered.id}`); } } : undefined}
          >
            <div className={styles.tooltipName}>{hovered.name}</div>
            <div className={styles.tooltipStack}>{hovered.stack}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
