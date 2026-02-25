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

function renderProjectList(projects: Project[]) {
  return (
    <ul className={styles.list_items}>
      {projects.map((project) => (
        <li key={project.internal_id}>
          <Link href={`/project/${project.id ?? project.internal_id}`} className={styles.list_item_link}>
            <span className={styles.list_item_name}>{project.name} / </span>
            <span className={styles.list_item_desc}>{project.stack}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function List({ projects }: Props) {
  const software = projects.filter((p) => getColumn(p) === "software");
  const web = projects.filter((p) => getColumn(p) === "web");
  const projects42 = software.filter((p) => p.category === "42berlin");
  const otherSoftware = software.filter((p) => p.category !== "42berlin");
  const projectsCODAC = web.filter((p) => p.projectType === "CODAC");
  const otherWeb = web.filter((p) => p.projectType !== "CODAC");

  return (
    <div className={styles.list_columns}>
      <div className={styles.list_column}>
        <h3 className={styles.list_column_title}>Software Engineering</h3>
        <div className={styles.list_column_body}>
          {projects42.length > 0 && (
            <div className={styles.list_bracket_group}>
              <span className={styles.list_bracket_label}>42</span>
              <div className={styles.list_bracket_wrap}>
                <span className={styles.list_bracket} aria-hidden="true" />
                {renderProjectList(projects42)}
              </div>
            </div>
          )}
          {otherSoftware.length > 0 && (
            <div className={styles.list_plain_group}>
              {renderProjectList(otherSoftware)}
            </div>
          )}
        </div>
      </div>
      <div className={styles.list_column}>
        <h3 className={styles.list_column_title}>Web Development</h3>
        <div className={styles.list_column_body}>
          {projectsCODAC.length > 0 && (
            <div className={styles.list_bracket_group}>
              <span className={styles.list_bracket_label}>CODAC</span>
              <div className={styles.list_bracket_wrap}>
                <span className={styles.list_bracket} aria-hidden="true" />
                {renderProjectList(projectsCODAC)}
              </div>
            </div>
          )}
          {otherWeb.length > 0 && (
            <div className={styles.list_plain_group}>
              {renderProjectList(otherWeb)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
