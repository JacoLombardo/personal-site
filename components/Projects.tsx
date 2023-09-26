/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/homepage.module.css";
import { Mode, Project } from "@/types";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: Project[];
  theme: Mode;
}

export default function Projects({ projects, theme }: Props) {
  return (
    <>
      <div id="projects" className={styles.projects_div}>
        Projects
        <div>
          {projects?.map((project: Project, index: number) => {
            return (
              <ProjectCard
                project={project}
                key={index}
                page={"home"}
                theme={theme}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
