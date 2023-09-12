/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/homepage.module.css";
import { useContext, useEffect } from "react";
import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
import { ProjectContext } from "@/contexts/ProjectContext";

export default function Projects() {
  const { getProjects, projects } = useContext(ProjectContext);

  useEffect(() => {
    getProjects();
  }, []);

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
