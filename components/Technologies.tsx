"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "@/styles/homepage.module.css";
import siteData from "../public/projects.json";

interface Tech {
  id: string;
  name: string;
  type: string;
  level: string;
  projects: string[];
  alwaysShown: boolean;
  icon: string;
}

interface ProjectItem {
  id: string;
  name: string;
}

const { technologies, projects: projectsList } = siteData as {
  technologies: Tech[];
  projects: ProjectItem[];
};

const projectNameById = new Map<string, string>(
  (projectsList as ProjectItem[]).map((p) => [p.id, p.name])
);

const HALO_DELAY_MS = 500;
const HALO_SIZE = 200;   /* one coordinate system: orbit around card center */
const HALO_CX = HALO_SIZE / 2;
const HALO_CY = HALO_SIZE / 2;
const HALO_R = 62;      /* orbit radius – ring passes through planet dots */
const PLANET_R = 4;     /* dot radius in SVG */

function TechnologyCard({ tech }: { tech: Tech }) {
  const [haloVisible, setHaloVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => setHaloVisible(true), HALO_DELAY_MS);
  }, []);

  const onLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHaloVisible(false);
  }, []);

  const projectNames = tech.projects
    .map((id) => projectNameById.get(id) || id)
    .filter(Boolean);
  const n = projectNames.length;

  return (
    <div
      className={styles.technology_card_wrapper}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div
        className={`${styles.technology_card} ${!tech.icon?.trim() ? styles.technology_card_no_icon : ""}`}
      >
        <div className={styles.technology_card_main}>
          {tech.icon?.trim() ? (
            <div className={styles.technology_card_content}>
              <div className={styles.technology_card_icon}>
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={36}
                  height={36}
                />
              </div>
              <span className={styles.technology_card_name}>{tech.name}</span>
            </div>
          ) : (
            <span className={styles.technology_card_name}>{tech.name}</span>
          )}
        </div>
        <div className={styles.technology_card_meta}>
          <span className={styles.technology_card_level}>{tech.level}</span>
        </div>
      </div>

      <AnimatePresence>
        {haloVisible && n > 0 && (
          <motion.div
            className={styles.technology_card_halo}
            style={{ width: HALO_SIZE, height: HALO_SIZE }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className={styles.technology_halo_svg}
              viewBox={`0 0 ${HALO_SIZE} ${HALO_SIZE}`}
              width="100%"
              height="100%"
            >
              {/* Orbit ring – same center and radius as planet positions */}
              <circle
                className={styles.technology_halo_circle}
                cx={HALO_CX}
                cy={HALO_CY}
                r={HALO_R}
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.5"
              />
              {/* Planets on the ring – same (cx,cy,r) geometry so ring passes through them */}
              {projectNames.map((_, i) => {
                const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
                const px = HALO_CX + HALO_R * Math.cos(angle);
                const py = HALO_CY + HALO_R * Math.sin(angle);
                return (
                  <circle
                    key={`${tech.id}-${i}`}
                    className={styles.technology_halo_dot}
                    cx={px}
                    cy={py}
                    r={PLANET_R}
                    fill="rgba(255,255,255,0.9)"
                  />
                );
              })}
            </svg>
            {/* Labels in same coordinate system (pixels = viewBox units here) */}
            {projectNames.map((name, i) => {
              const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
              const x = HALO_CX + HALO_R * Math.cos(angle);
              const y = HALO_CY + HALO_R * Math.sin(angle);
              const labelDist = 18;
              const lx = x + labelDist * Math.cos(angle);
              const ly = y + labelDist * Math.sin(angle);
              return (
                <span
                  key={`${tech.id}-label-${i}`}
                  className={styles.technology_halo_label}
                  style={{
                    left: lx,
                    top: ly,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {name}
                </span>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TYPE_ORDER = [
  "Language",
  "Framework",
  "Library",
  "Database",
  "Runtime",
  "Tool",
  "Platform",
  "Protocol",
  "API",
];

function groupByType(techs: Tech[]): Map<string, Tech[]> {
  const map = new Map<string, Tech[]>();
  for (const t of techs) {
    const list = map.get(t.type) ?? [];
    list.push(t);
    map.set(t.type, list);
  }
  return map;
}

export default function Technologies() {
  const byType = groupByType(technologies);
  const orderedTypes = TYPE_ORDER.filter((type) => byType.has(type));
  // Include any type not in TYPE_ORDER (e.g. custom)
  const otherTypes = [...byType.keys()].filter((t) => !TYPE_ORDER.includes(t));

  return (
    <motion.div
      id="technologies"
      className={styles.technologies_div}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.technologies_columns}>
        {[...orderedTypes, ...otherTypes].map((type) => (
          <div key={type} className={styles.technology_group}>
            <h3 className={styles.technology_group_label}>{type}</h3>
            <div className={styles.technologies_list}>
              {(byType.get(type) ?? []).map((tech) => (
                <TechnologyCard key={tech.id} tech={tech} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
