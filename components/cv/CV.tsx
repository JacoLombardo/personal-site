"use client";

import { motion } from "framer-motion";
import styles from "@/styles/homepage.module.css";

export default function CV() {
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

      <div className={styles.cv_subsection}>
        <h3 className={styles.cv_subsection_title}>Professional Experience</h3>
        <div className={styles.cv_subsection_body}>
          <article className={styles.cv_entry}>
            <header className={styles.cv_entry_header}>
              <h4 className={styles.cv_entry_title}>
                Full Stack Developer (Volunteer) | Need4Deed
              </h4>
              <p className={styles.cv_entry_meta}>
                June 2025 – November 2025 | Berlin
              </p>
            </header>
            <ul className={styles.cv_entry_list}>
              <li>
                Developed and optimized front- and back-end features using
                Next.js, improving load performance.
              </li>
              <li>
                Migrated database handling to MongoDB, improving data
                flexibility and system scalability for core platform features.
              </li>
            </ul>
          </article>

          <article className={styles.cv_entry}>
            <header className={styles.cv_entry_header}>
              <h4 className={styles.cv_entry_title}>
                Chef de Partie | Gastronomy Sector
              </h4>
              <p className={styles.cv_entry_meta}>2014 – 2022 | Europe</p>
            </header>
            <ul className={styles.cv_entry_list}>
              <li>
                Led teams of up to 4 people in fast-paced, high-pressure
                environments.
              </li>
              <li>
                Applied a detail-oriented approach to manage complex operations
                and maintain high standards of performance.
              </li>
            </ul>
          </article>
        </div>
      </div>

      <div className={styles.cv_subsection}>
        <h3 className={styles.cv_subsection_title}>Education</h3>
        <div className={styles.cv_subsection_body}>
          <article className={styles.cv_entry}>
            <header className={styles.cv_entry_header}>
              <h4 className={styles.cv_entry_title}>
                Software Engineering | 42 Berlin
              </h4>
              <p className={styles.cv_entry_meta}>April 2024 – December 2025</p>
            </header>
            <ul className={styles.cv_entry_list}>
              <li>
                A peer-to-peer, project-based software engineering program
                focused on autonomous learning.
              </li>
              <li>
                Curriculum covers fundamental and advanced topics in C
                programming, Unix/Linux systems, algorithms, and memory
                management.
              </li>
            </ul>
          </article>

          <article className={styles.cv_entry}>
            <header className={styles.cv_entry_header}>
              <h4 className={styles.cv_entry_title}>
                Full Stack Development | Code Academy
              </h4>
              <p className={styles.cv_entry_meta}>
                September 2022 – February 2023
              </p>
            </header>
            <ul className={styles.cv_entry_list}>
              <li>
                Intensive 6-month onsite course consisting of 840 hours of
                practical, project-based work.
              </li>
              <li>
                Followed the Agile/SCRUM framework as a cohort, incorporating
                code reviews and technical presentations.
              </li>
            </ul>
          </article>
        </div>
      </div>

      <div className={styles.cv_subsection}>
        <h3 className={styles.cv_subsection_title}>Languages</h3>
        <div className={styles.cv_subsection_body}>
          <div className={styles.cv_languages}>
            <p className={styles.cv_language_item}>Italian: Native</p>
            <p className={styles.cv_language_item}>English: C1 (Advanced)</p>
            <p className={styles.cv_language_item}>
              Spanish: B1 (Intermediate)
            </p>
            <p className={styles.cv_language_item}>German: B1 (Intermediate)</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
