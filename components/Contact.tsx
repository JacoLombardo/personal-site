"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "@/styles/homepage.module.css";
import { Mode } from "@/types";

interface Props {
  theme: Mode;
}

export default function Contact({ theme }: Props) {
  return (
    <motion.div
      id="contact"
      className={styles.contact_div}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span>Let&apos;s connect.</span>
      <div>
        <Link href="https://github.com/JacoLombardo" target="_blank" aria-label="GitHub">
          <Image
            src={`/Icons/Contact/github-${theme}.png`}
            alt="GitHub"
            title="GitHub"
            width={30}
            height={30}
          />
        </Link>
        <Link
          href="https://www.linkedin.com/in/jacopo-lombardo/"
          target="_blank"
          aria-label="LinkedIn"
        >
          <Image
            src={`/Icons/Contact/linkedin.png`}
            alt="LinkedIn"
            title="LinkedIn"
            width={35}
            height={35}
          />
        </Link>
        <Link href="mailto:jacopo.lombardo@outlook.com" target="_blank" aria-label="Email">
          <Image
            src="https://res.cloudinary.com/dtl48kr1u/image/upload/v1694426625/personal-site/email_fdma3o.png"
            alt="Email"
            title="Email"
            width={30}
            height={30}
          />
        </Link>
        <Link href="/Jacopo Lombardo.pdf" target="_blank" aria-label="CV">
          <Image
            src="https://res.cloudinary.com/dtl48kr1u/image/upload/v1694426624/personal-site/cv_zec3wq.png"
            alt="CV"
            title="CV"
            width={30}
            height={30}
          />
        </Link>
      </div>
    </motion.div>
  );
}
