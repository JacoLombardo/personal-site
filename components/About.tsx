"use client";

import { motion } from "framer-motion";
import styles from "@/styles/homepage.module.css";

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
        <p>
          When I was little I had two passions, computers and cooking. To shape
          my path I decided to follow the second and I started a career as chef
          that brought me in kitchens in Ireland, Denmark, Germany and, of
          course, Italy. But gastronomy is a tough and everchanging sector, and
          witnessing the new direction I eventually lost passion and decided to
          move to something else. And that&apos;s when I decided to go back to
          the origins and I enrolled in a Full Stack Web Development course. I
          loved it, coding is the perfect food for my logical mind!
        </p>
        <p style={{ color: "var(--text-muted)" }}>
          Currently I&apos;m working on both widening my tech knowledge and
          improving my German skills. I&apos;m a passionate and motivated
          person, goal-oriented but not too self-focused. I find myself very
          comfortable in collaborative working in groups, as I manage to get the
          best out of it.
        </p>
      </div>
    </motion.div>
  );
}
