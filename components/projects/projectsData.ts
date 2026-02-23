/**
 * Handles projects.json: loads and processes it for orbital layout and list views.
 * Projects.tsx uses this module and passes the results to Orbits and List.
 */

import type { Project, ProjectCategory } from "@/types";
import projectsJson from "../../public/projects.json";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

export interface JsonProject {
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

export type ProjectType = "42" | "CODAC" | "independent" | "professional";
export type FilterOption = ProjectType | "highlighted";

export interface OrbitalProject {
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

export interface OrbitalData {
  orbital: OrbitalProject[];
  seRadii: number[];
  wdRadii: number[];
  seCenter: { x: number; y: number };
  wdCenter: { x: number; y: number };
  convCenter: { x: number; y: number };
  seOuterR: number;
  wdOuterR: number;
  hasConv: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS (used for orbital layout)
   ═══════════════════════════════════════════════════════════════════════════ */

const VIEW_W = 1200;
const CENTER_Y = 360;
const CONV_RADII = [20, 40];
const GROWTH = 0.7;
const SCHOOL_COMPRESS = 0.7;
const SIDE_PAD = 60;
const MAX_R = Math.min(
  (VIEW_W - 2 * SIDE_PAD) / 4,
  CENTER_Y - 60,
  700 - CENTER_Y - 60
);

/* ═══════════════════════════════════════════════════════════════════════════
   PROCESSING
   ═══════════════════════════════════════════════════════════════════════════ */

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

function buildRadii(
  maxRing: number,
  baseGap: number,
  schoolLast: number
): number[] {
  const radii = [0];
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

function dotSize(ring: number, maxRing: number): number {
  if (ring === 0) return 4;
  if (maxRing <= 1) return 4;
  const t = (ring - 1) / (maxRing - 1);
  return 3 + t * 3;
}

/**
 * Processes raw JSON projects into orbital layout data.
 */
export function processOrbitalData(raw: JsonProject[]): OrbitalData {
  const all = raw.filter((p) => p.id && p.name);

  const seAll = all.filter((p) => p.domain === "software" && !p.isShared);
  const wdAll = all.filter((p) => p.domain === "web" && !p.isShared);
  const shared = all.filter((p) => p.isShared);

  const seMax = seAll.length ? Math.max(...seAll.map((p) => p.ring)) : 0;
  const wdMax = wdAll.length ? Math.max(...wdAll.map((p) => p.ring)) : 0;

  const se42 = seAll.filter((p) => p.type === "42").map((p) => p.ring);
  const seSchoolLast = se42.length ? Math.max(...se42) : 0;
  const wdCodac = wdAll.filter((p) => p.type === "CODAC").map((p) => p.ring);
  const wdSchoolLast = wdCodac.length ? Math.max(...wdCodac) : 0;

  const seBaseGap = seMax > 0 ? MAX_R / ringWeightSum(seMax, seSchoolLast) : 0;
  const wdBaseGap = wdMax > 0 ? MAX_R / ringWeightSum(wdMax, wdSchoolLast) : 0;

  const seRadii = buildRadii(seMax, seBaseGap, seSchoolLast);
  const wdRadii = buildRadii(wdMax, wdBaseGap, wdSchoolLast);

  const seOuterR = seRadii[seRadii.length - 1] || 0;
  const wdOuterR = wdRadii[wdRadii.length - 1] || 0;

  const midX = VIEW_W / 2;
  const seCenter = { x: midX - seOuterR, y: CENTER_Y };
  const wdCenter = { x: midX + wdOuterR, y: CENTER_Y };
  const convCenter = { x: midX, y: CENTER_Y };

  const orbital: OrbitalProject[] = [];

  function pushRing(
    projects: JsonProject[],
    ring: number,
    maxRing: number,
    schoolLast: number,
    cat: "se" | "wd"
  ) {
    const n = projects.length;
    const offset = ring * Math.PI * 1.236;
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

/**
 * Loads projects from projects.json and returns processed orbital data.
 */
export function getOrbitalData(): OrbitalData {
  const raw = (projectsJson as { projects: JsonProject[] }).projects;
  return processOrbitalData(raw);
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIST VIEW (Project type for ProjectCard)
   ═══════════════════════════════════════════════════════════════════════════ */

const PLACEHOLDER_IMAGE = "https://picsum.photos/400/300";

function jsonToProjectCategory(p: JsonProject): ProjectCategory {
  if (!p) return "web-development";
  if (p.isShared) return "web-development";
  if (p.domain === "software" && p.type === "42") return "42berlin";
  if (p.domain === "software") return "software-engineering";
  return "web-development";
}

/**
 * Converts projects from projects.json into Project[] for List/ProjectCard.
 * Used when MongoDB returns no projects (fallback).
 */
export function getListProjectsFromJson(): Project[] {
  const raw = (projectsJson as { projects?: JsonProject[] }).projects;
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((p, index) => ({
    internal_id: index + 1000,
    name: p?.name ?? "Project",
    alt: p?.name ?? "Project",
    stack: (p?.tech_stack ?? []).filter(Boolean).join(", "),
    stack_list: (p?.tech_stack ?? []).filter(Boolean),
    description: p?.description ?? "",
    composition: [],
    features: [],
    mockup_desktop: PLACEHOLDER_IMAGE,
    mockup_mobile: PLACEHOLDER_IMAGE,
    link: "",
    repository: "",
    category: jsonToProjectCategory(p),
  }));
}
