"use client";

import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/orbital.module.css";
import { getOrbitalData, getListProjectsFromJson, convertToProjectList, type JsonProject } from "./projectsData";
import Orbits from "./Orbits";
import List from "./List";

type ViewMode = "orbits" | "list";

interface Props {
  /** Raw project documents (e.g. from MongoDB), same shape as JsonProject. */
  projects: JsonProject[];
}

export default function Projects({ projects }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewMode>("orbits");
  const raw = useMemo(() => projects ?? [], [projects]);
  const orbitalData = useMemo(() => getOrbitalData(raw), [raw]);
  const listProjects = useMemo(
    () => (raw.length > 0 ? convertToProjectList(raw) : getListProjectsFromJson()),
    [raw]
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
        {view === "orbits" ? (
          <Orbits containerRef={containerRef} orbitalData={orbitalData} />
        ) : (
          <List projects={listProjects} />
        )}
      </div>
    </motion.section>
  );
}
