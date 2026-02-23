"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "@/styles/homepage.module.css";

const CV_PDF = "/Jacopo Lombardo.pdf";

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
      <div className={styles.cv_inner}>
        <h2 className={styles.cv_heading}>CV</h2>
        <Link href={CV_PDF} target="_blank" rel="noopener noreferrer" className={styles.cv_link}>
          Download my CV
        </Link>
      </div>
    </motion.section>
  );
}
