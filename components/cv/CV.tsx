"use client";

import { motion } from "framer-motion";
import type { CvData, CvEntry } from "@/types";
import styles from "@/styles/homepage.module.css";

const DEFAULT_TITLES = {
  professionalExperience: "Professional Experience",
  education: "Education",
  languages: "Languages",
};

interface Props {
  cv: CvData | null;
}

function renderEntries(entries: CvEntry[] | undefined) {
  if (!entries?.length) return null;
  return entries.map((entry, i) => (
    <article key={i} className={styles.cv_entry}>
      <header className={styles.cv_entry_header}>
        <h4 className={styles.cv_entry_title}>{entry.title}</h4>
        <p className={styles.cv_entry_meta}>{entry.meta}</p>
      </header>
      <ul className={styles.cv_entry_list}>
        {entry.bullets.map((bullet, j) => (
          <li key={j}>{bullet}</li>
        ))}
      </ul>
    </article>
  ));
}

export default function CV({ cv }: Props) {
  const hasContent =
    (cv?.professionalExperience?.length ?? 0) > 0 ||
    (cv?.education?.length ?? 0) > 0 ||
    (cv?.languages?.length ?? 0) > 0;

  if (!hasContent) return null;

  return (
    <motion.section
      id="cv"
      className={styles.cv_section}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className={styles.cv_heading}>CV</h2>

      {(cv?.professionalExperience?.length ?? 0) > 0 && (
        <div className={styles.cv_subsection}>
          <h3 className={styles.cv_subsection_title}>{DEFAULT_TITLES.professionalExperience}</h3>
          <div className={styles.cv_subsection_body}>{renderEntries(cv?.professionalExperience)}</div>
        </div>
      )}

      {(cv?.education?.length ?? 0) > 0 && (
        <div className={styles.cv_subsection}>
          <h3 className={styles.cv_subsection_title}>{DEFAULT_TITLES.education}</h3>
          <div className={styles.cv_subsection_body}>{renderEntries(cv?.education)}</div>
        </div>
      )}

      {(cv?.languages?.length ?? 0) > 0 && (
        <div className={styles.cv_subsection}>
          <h3 className={styles.cv_subsection_title}>{DEFAULT_TITLES.languages}</h3>
          <div className={styles.cv_subsection_body}>
            <div className={styles.cv_languages}>
              {(cv?.languages ?? []).map((item, i) => (
                <p key={i} className={styles.cv_language_item}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
