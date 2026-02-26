"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "@/styles/homepage.module.css";

export interface Tech {
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

interface Props {
  technologies: Tech[];
  projects: ProjectItem[];
}

const HALO_DELAY_MS = 500;
const HALO_CLOSE_DELAY_MS = 200;
const HALO_SIZE = 200; /* one coordinate system: orbit around card center */
const HALO_CX = HALO_SIZE / 2;
const HALO_CY = HALO_SIZE / 2;
const HALO_R = 62; /* orbit radius – ring passes through planet dots */
const PLANET_R = 4; /* dot radius in SVG */
const PLANET_HIT = 12; /* clickable hit area radius */

function TechnologyCard({ tech, projectNameById }: { tech: Tech; projectNameById: Map<string, string> }) {
  const [haloVisible, setHaloVisible] = useState(false);
  const [haloPosition, setHaloPosition] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseDelay = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const onEnter = useCallback(() => {
    clearCloseDelay();
    openTimeoutRef.current = setTimeout(() => {
      openTimeoutRef.current = null;
      const el = wrapperRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        setHaloPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
      setHaloVisible(true);
    }, HALO_DELAY_MS);
  }, [clearCloseDelay]);

  const onLeave = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(
      () => setHaloVisible(false),
      HALO_CLOSE_DELAY_MS,
    );
  }, []);

  const onPortalEnter = useCallback(() => {
    clearCloseDelay();
  }, [clearCloseDelay]);

  const onPortalLeave = useCallback(() => {
    setHaloVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  /* Keep halo centered on the card when the user scrolls or resizes */
  const updateHaloPosition = useCallback(() => {
    const el = wrapperRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setHaloPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, []);

  useEffect(() => {
    if (!haloVisible) return;
    updateHaloPosition();
    window.addEventListener("scroll", updateHaloPosition, true);
    window.addEventListener("resize", updateHaloPosition);
    return () => {
      window.removeEventListener("scroll", updateHaloPosition, true);
      window.removeEventListener("resize", updateHaloPosition);
    };
  }, [haloVisible, updateHaloPosition]);

  const projectIds = tech.projects.filter(Boolean);
  const projectNames = projectIds.map((id) => projectNameById.get(id) || id);
  const n = projectIds.length;

  const haloPortal =
    typeof document !== "undefined" &&
    createPortal(
      <AnimatePresence>
        {haloVisible && n > 0 && (
          <motion.div
            key="halo"
            className={styles.technology_card_halo_portal}
            style={{
              left: haloPosition.x - HALO_SIZE / 2,
              top: haloPosition.y - HALO_SIZE / 2,
              width: HALO_SIZE,
              height: HALO_SIZE,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={onPortalEnter}
            onMouseLeave={onPortalLeave}
          >
            <div className={styles.technology_card_halo_clipped}>
              <div className={styles.technology_card_halo_backdrop} />
              <svg
                className={styles.technology_halo_svg}
                viewBox={`0 0 ${HALO_SIZE} ${HALO_SIZE}`}
                width="100%"
                height="100%"
              >
                <circle
                  className={styles.technology_halo_circle}
                  cx={HALO_CX}
                  cy={HALO_CY}
                  r={HALO_R}
                  fill="none"
                  stroke="rgba(255,255,255,0.75)"
                  strokeWidth="2"
                />
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
                      fill="rgba(255,255,255,0.95)"
                    />
                  );
                })}
              </svg>
            </div>
            <div className={styles.technology_card_halo}>
              {projectIds.map((id, i) => {
                const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
                const x = HALO_CX + HALO_R * Math.cos(angle);
                const y = HALO_CY + HALO_R * Math.sin(angle);
                /* Top half: name above planet. Bottom half or midline: name underneath planet. */
                const labelOffset = 14;
                const lx = x;
                const ly = y < HALO_CY ? y - labelOffset : y + labelOffset;
                const name = projectNames[i] || id;
                /* Limit label width so long names don't reach the card (80px wide, center 100) */
                const cardLeft = 60;
                const cardRight = 140;
                const clearance = 4;
                const maxLabelWidth =
                  lx <= HALO_CX
                    ? 2 * (lx - cardLeft - clearance)
                    : 2 * (cardRight - lx - clearance);
                const clampedMaxWidth = Math.min(
                  110,
                  Math.max(44, Math.round(maxLabelWidth)),
                );
                return (
                  <Link
                    key={`${tech.id}-link-${i}`}
                    href={`/project/${id}`}
                    className={styles.technology_halo_planet_link}
                    style={{
                      left: x,
                      top: y,
                      width: PLANET_HIT * 2,
                      height: PLANET_HIT * 2,
                      marginLeft: -PLANET_HIT,
                      marginTop: -PLANET_HIT,
                    }}
                    title={name}
                  >
                    <span
                      className={styles.technology_halo_label}
                      style={{
                        left: lx - x + PLANET_HIT,
                        top: ly - y + PLANET_HIT,
                        transform: "translate(-50%, -50%)",
                        maxWidth: clampedMaxWidth,
                      }}
                    >
                      {name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <div
      ref={wrapperRef}
      className={`${styles.technology_card_wrapper} ${haloVisible ? styles.technology_card_wrapper_halo_open : ""}`}
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
                <Image src={tech.icon} alt={tech.name} width={36} height={36} />
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
      {haloPortal}
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

export default function Technologies({ technologies, projects }: Props) {
  const projectNameById = useMemo(
    () => new Map(projects.map((p) => [p.id, p.name])),
    [projects]
  );
  const [showAll, setShowAll] = useState(false);
  const byType = groupByType(technologies);
  const orderedTypes = TYPE_ORDER.filter((type) => byType.has(type));
  const otherTypes = Array.from(byType.keys()).filter(
    (t) => !TYPE_ORDER.includes(t),
  );

  const typesToRender = [...orderedTypes, ...otherTypes];
  const hasHidden = technologies.some((t) => !t.alwaysShown);

  const getTechsForType = (type: string) => {
    const list = byType.get(type) ?? [];
    return showAll ? list : list.filter((t) => t.alwaysShown);
  };

  return (
    <motion.section
      id="technologies"
      className={styles.technologies_div}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={styles.section_label}>Technologies</span>
      <div className={styles.technologies_columns}>
        {typesToRender.map((type) => {
          const techs = getTechsForType(type);
          if (techs.length === 0) return null;
          return (
            <div key={type} className={styles.technology_group}>
              <h3 className={styles.technology_group_label}>{type}</h3>
              <div className={styles.technologies_list}>
                {techs.map((tech) => (
                  <TechnologyCard key={tech.id} tech={tech} projectNameById={projectNameById} />
                ))}
              </div>
            </div>
          );
        })}
        {hasHidden && (
          <button
            type="button"
            className={styles.technologies_expand}
            onClick={() => setShowAll((v) => !v)}
            title={showAll ? "Show less" : "Show all technologies"}
            aria-label={showAll ? "Show less" : "Show all technologies"}
          >
            {showAll ? "−" : "+"}
          </button>
        )}
      </div>
    </motion.section>
  );
}
