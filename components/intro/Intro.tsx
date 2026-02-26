"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "@/styles/homepage.module.css";

interface IntroData {
  name: string;
  title: string;
  photo: string;
}

interface Props {
  intro: IntroData;
}

export default function Intro({ intro }: Props) {
  if (!intro?.name && !intro?.title && !intro?.photo) return null;
  return (
    <motion.section
      id="intro"
      className={styles.intro_div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.intro_left}>
        <h1 className={styles.intro_name}>{intro.name}</h1>
        <p className={styles.intro_title}>{intro.title}</p>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {intro.photo && (
        <Image
          src={intro.photo}
          alt={intro.name}
          width={420}
          height={0}
          sizes="(max-width: 550px) 100vw, 420px"
          className={styles.intro_img}
        />
        )}
      </motion.div>
    </motion.section>
  );
}
