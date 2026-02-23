"use client";

import { motion } from "framer-motion";
import styles from "@/styles/homepage.module.css";
import { Project, ProjectCategory } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  project: Project;
  page: string;
  category?: ProjectCategory;
}

export default function ProjectCard({ project, page, category }: Props) {
  return (
    <motion.div
      className={styles.project_div}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <Link
        href={`/project/${project.internal_id}`}
        className={styles.project_link}
      >
        <div className={styles.project_img_wrapper}>
          <Image
            src={project.mockup_desktop}
            alt={project.alt}
            title={project.name}
            width="0"
            height="0"
            sizes="100vw"
            className={
              page === "home" ? styles.project_img_home : styles.project_img
            }
          />
        </div>
        <h3 className={styles.project_title} data-page={page}>
          {project.name} <span className={styles.project_stack}>/ {project.stack}</span>
        </h3>
      </Link>
    </motion.div>
  );
}
