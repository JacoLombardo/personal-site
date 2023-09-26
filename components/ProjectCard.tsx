import styles from "@/styles/homepage.module.css";
import { Mode, Project } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  project: Project;
  page: string;
  theme: Mode;
}

export default function ProjectCard({ project, page, theme }: Props) {
  return (
    <>
      <div className={styles.project_div}>
        <Link
          href={`/project/${project.internal_id}`}
          style={{ textDecoration: "none" }}
        >
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
          <h3
            style={
              page === "home"
                ? theme === "dark"
                  ? { color: "white", fontSize: "medium" }
                  : { color: "black", fontSize: "medium" }
                : theme === "dark"
                ? { color: "white", maxWidth: "180px", fontSize: "12px" }
                : { color: "black", maxWidth: "180px", fontSize: "12px" }
            }
          >
            {project.name} / {project.stack}
          </h3>
        </Link>
      </div>
    </>
  );
}
