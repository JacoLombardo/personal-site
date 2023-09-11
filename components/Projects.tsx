import styles from "@/styles/homepage.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>();

  const getProjects = () => {
    var requestOptions = {
      headers: new Headers(),
    };

    fetch("/api/get-projects", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setProjects(result);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <div id="projects" className={styles.projects_div}>
        Projects
        <div>
          {projects?.map((project: Project, index: number) => {
            return (
              <div key={index} className={styles.project_div}>
                <Image
                  src="https://res.cloudinary.com/dtl48kr1u/image/upload/v1694358931/personal-site/DSC02863_owsl4d.jpg"
                  alt={project.alt}
                  title={project.name}
                  width="0"
                  height="0"
                  sizes="100vw"
                  style={{ width: "auto", height: "200px" }}
                />
                <h3 className={styles.projects_title}>
                  {project.name} / {project.stack}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
