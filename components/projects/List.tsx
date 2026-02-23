"use client";

import Link from "next/link";
import { Project } from "@/types";
import styles from "@/styles/orbital.module.css";

interface Props {
  projects: Project[];
}

function getColumn(project: Project): "software" | "web" {
  const cat = project.category;
  if (cat === "software-engineering" || cat === "42berlin") return "software";
  return "web";
}

export default function List({ projects }: Props) {
  const software = projects.filter((p) => getColumn(p) === "software");
  const web = projects.filter((p) => getColumn(p) === "web");

  return (
    <div className={styles.list_columns}>
      <div className={styles.list_column}>
        <h3 className={styles.list_column_title}>Software Engineering</h3>
        <ul className={styles.list_items}>
          {software.map((project) => (
            <li key={project.internal_id}>
              <Link href={`/project/${project.internal_id}`} className={styles.list_item_link}>
                {project.name} <span className={styles.list_item_stack}>/ {project.stack}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.list_column}>
        <h3 className={styles.list_column_title}>Web Development</h3>
        <ul className={styles.list_items}>
          {web.map((project) => (
            <li key={project.internal_id}>
              <Link href={`/project/${project.internal_id}`} className={styles.list_item_link}>
                {project.name} <span className={styles.list_item_stack}>/ {project.stack}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
