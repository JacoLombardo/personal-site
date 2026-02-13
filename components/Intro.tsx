"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "@/styles/homepage.module.css";
import siteData from "../public/projects.json";

const { intro } = siteData as { intro: { title: string; subtitle: string; photo: string } };

export default function Intro() {
  return (
    <motion.div
      className={styles.intro_div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <h1 className={styles.intro_title}>
          Hi, I&apos;m Jacopo. {intro.title}, based in Berlin.
        </h1>
        {intro.subtitle && (
          <p className={styles.intro_subtitle}>{intro.subtitle}</p>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={intro.photo}
          alt="Jacopo Lombardo"
          width={420}
          height={0}
          sizes="(max-width: 550px) 100vw, 420px"
          className={styles.intro_img}
        />
      </motion.div>
    </motion.div>
  );
}
