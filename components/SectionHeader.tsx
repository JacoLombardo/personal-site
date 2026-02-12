"use client";

import { motion } from "framer-motion";
import { ProjectCategory, CATEGORY_LABELS } from "@/types";
import styles from "@/styles/homepage.module.css";

interface Props {
  category: ProjectCategory;
  id: string;
}

const categoryAccent: Record<ProjectCategory, string> = {
  "web-development": "var(--accent-web)",
  "software-engineering": "var(--accent-software)",
  "42berlin": "var(--accent-42)",
};

export default function SectionHeader({ category, id }: Props) {
  const label = CATEGORY_LABELS[category];
  const accent = categoryAccent[category];

  return (
    <motion.div
      id={id}
      className={styles.section_header}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        className={styles.section_header_accent}
        style={{ backgroundColor: accent }}
      />
      <h2 className={styles.section_header_title}>{label}</h2>
    </motion.div>
  );
}
