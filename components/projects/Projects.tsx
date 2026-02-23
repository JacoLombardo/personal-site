"use client";

import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types";
import styles from "@/styles/orbital.module.css";
import { getOrbitalData, getListProjectsFromJson } from "./projectsData";
import Orbits from "./Orbits";
import List from "./List";

type ViewMode = "orbits" | "list";

interface Props {
  projects: Project[];
}

export default function Projects({ projects }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewMode>("orbits");
  const orbitalData = useMemo(() => getOrbitalData(), []);
  const listProjects = useMemo(
    () => ((projects ?? []).length > 0 ? projects : getListProjectsFromJson()),
    [projects]
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
