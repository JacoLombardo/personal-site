/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/homepage.module.css";
import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: Project[];
}

export default function Projects({ projects }: Props) {
  return (
    <>
      <div id="projects" className={styles.projects_div}>
        Projects
        <div>
          {projects?.map((project: Project, index: number) => {
            return <ProjectCard project={project} key={index} page={"home"} />;
          })}
        </div>
      </div>
    </>
  );
}
