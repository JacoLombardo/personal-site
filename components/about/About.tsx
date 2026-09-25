import { motion } from "framer-motion";
import styles from "@/styles/homepage.module.css";

interface AboutMeData {
  text: string;
}

interface Props {
  aboutMe: AboutMeData | null;
}

export default function About({ aboutMe }: Props) {
  return (
    <motion.section
      id="about"
      className={styles.about_div}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={styles.about_label}>About</span>
      <div>{aboutMe?.text && <p>{aboutMe.text}</p>}</div>
    </motion.section>
  );
}
