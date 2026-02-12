"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "@/styles/homepage.module.css";

export default function Intro() {
  return (
    <motion.div
      className={styles.intro_div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className={styles.intro_title}>
        Hi, I&apos;m Jacopo. A junior Full-Stack Developer, based in Berlin.
      </h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="https://res.cloudinary.com/dtl48kr1u/image/upload/v1694358931/personal-site/DSC02863_owsl4d.jpg"
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
