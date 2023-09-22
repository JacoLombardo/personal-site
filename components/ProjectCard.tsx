import styles from "@/styles/homepage.module.css";
import { Project } from "@/types/project";
import Image from "next/image";
import Link from "next/link";

interface Props {
  project: Project;
  page: string;
}

export default function ProjectCard({ project, page }: Props) {
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
            style={
              page === "home"
                ? { width: "auto", height: "200px" }
                : { width: "auto", height: "120px" }
            }
          />
          <h3
            style={
              page === "home"
                ? { maxWidth: "300px", fontSize: "smaller" }
                : { maxWidth: "180px", fontSize: "12px" }
            }
          >
            {project.name} / {project.stack}
          </h3>
        </Link>
      </div>
    </>
  );
}
