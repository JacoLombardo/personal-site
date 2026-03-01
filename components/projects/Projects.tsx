"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/orbital.module.css";
import {
  getOrbitalData,
  getListProjectsFromJson,
  convertToProjectList,
  type JsonProject,
  type FilterOption,
} from "./projectsData";
import Orbits from "./Orbits";
import List from "./List";

type ViewMode = "orbits" | "list";

const MOBILE_MAX_WIDTH = 550;

const SE_HUE = "#00e5ff";
const WD_HUE = "#00e676";
const SE_HUE_BRIGHT = "#80f0ff";
const WD_HUE_BRIGHT = "#80ffb0";

const FILTER_OPTIONS: FilterOption[] = [
  "independent",
  "professional",
  "CODAC",
  "42",
  "highlighted",
];

function filterLabel(t: FilterOption) {
  return t === "42"
    ? "42"
    : t === "CODAC"
      ? "CODAC"
      : t === "independent"
        ? "Independent"
        : t === "professional"
          ? "Professional"
          : "★";
}

function filterTint(t: FilterOption) {
  return t === "42"
    ? SE_HUE
    : t === "CODAC"
      ? WD_HUE
      : t === "independent"
        ? SE_HUE_BRIGHT
        : t === "professional"
          ? WD_HUE_BRIGHT
          : "#ffd54f";
}

interface Props {
  /** Raw project documents (e.g. from MongoDB), same shape as JsonProject. */
  projects: JsonProject[];
}

export default function Projects({ projects }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewMode>("orbits");
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);

  useEffect(() => {
    const check = () =>
      setIsMobile(
        typeof window !== "undefined" && window.innerWidth <= MOBILE_MAX_WIDTH,
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const raw = useMemo(() => projects ?? [], [projects]);
  const orbitalData = useMemo(
    () => getOrbitalData(raw, isMobile),
    [raw, isMobile],
  );
  const listProjects = useMemo(
    () =>
      raw.length > 0 ? convertToProjectList(raw) : getListProjectsFromJson(),
    [raw],
  );

  return (
    <motion.section
      ref={containerRef}
      className={styles.container}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2 }}
    >
      <div id="projects" className={styles.projects_main}>
        <span className={styles.section_title}>Projects</span>
        <div className={styles.viewToggle}>
          <button
            type="button"
            className={`${styles.viewToggleBtn} ${view === "orbits" ? styles.viewToggleBtnActive : ""}`}
            onClick={() => setView("orbits")}
          >
            Orbits View
          </button>
          <button
            type="button"
            className={`${styles.viewToggleBtn} ${view === "list" ? styles.viewToggleBtnActive : ""}`}
            onClick={() => setView("list")}
          >
            List View
          </button>
        </div>
        {view === "orbits" && isMobile && (
          <div className={styles.filterBarTop}>
            {FILTER_OPTIONS.map((t) => {
              const isActive = activeFilter === t;
              const tint = filterTint(t);
              return (
                <button
                  key={t}
                  type="button"
                  className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ""}`}
                  style={
                    isActive && tint
                      ? { borderColor: tint, color: tint }
                      : undefined
                  }
                  onClick={() => setActiveFilter(isActive ? null : t)}
                >
                  {filterLabel(t)}
                </button>
              );
            })}
          </div>
        )}
        {view === "orbits" ? (
          <Orbits
            containerRef={containerRef}
            orbitalData={orbitalData}
            isMobile={isMobile}
            activeFilter={isMobile ? activeFilter : undefined}
            setActiveFilter={isMobile ? setActiveFilter : undefined}
          />
        ) : (
          <List projects={listProjects} />
        )}
      </div>
    </motion.section>
  );
}
