"use client";

import { motion } from "framer-motion";
import styles from "@/styles/homepage.module.css";
import siteData from "../public/projects.json";

const { "about-me": aboutMe } = siteData as { "about-me": { text: string } };

export default function About() {
  return (
    <motion.div
      id="about"
      className={styles.about_div}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={styles.about_label}>About</span>
      <div>
        <p>{aboutMe.text}</p>
      </div>
    </motion.div>
  );
}
