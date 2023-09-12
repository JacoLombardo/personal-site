/* eslint-disable react-hooks/exhaustive-deps */
import NavBar from "@/components/NavBar";
import { Project } from "@/types/project";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import styles from "@/styles/project.module.css";
import Image from "next/image";
import Link from "next/link";
import Contact from "@/components/Contact";
import ProjectCard from "@/components/ProjectCard";
import { ProjectContext } from "@/contexts/ProjectContext";

export default function ProjectDetails() {
  const { getProjects, projects } = useContext(ProjectContext);
  const [project, setProject] = useState<Project>();
  const [mockup, setMockup] = useState<string>();
  const [theme, setTheme] = useState<string>("black");
  const router = useRouter();
  const id = router.query.id;

  const getProjectById = (id: number) => {
    var requestOptions = {
      headers: new Headers(),
    };

    fetch(`/api/project-by-id?id=${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setProject(result);
        setMockup(result.mockup_browser);
        console.log("result", result);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    if (id) {
      getProjectById(+id);
    }
  }, [id]);

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <NavBar page={"id"} />
      {project && (
        <div className={styles.project_info_div}>
          <Link
            href={project.link}
            target="_blank"
            style={{ textDecoration: "none", color: "white" }}
          >
            <h3>{project.name}</h3>
          </Link>
          <div>
            {project.stack_list.map((stack, index) => {
              return (
                <Image
                  key={index}
                  src={
                    stack === "Next.js"
                      ? `/Icons/Stack/${stack}-${theme}.png`
                      : `/Icons/Stack/${stack}.png`
                  }
                  alt={stack}
                  title={stack}
                  width="35"
                  height="35"
                  sizes="100vw"
                  style={{ marginRight: "10px" }}
                />
              );
            })}
          </div>
          <div className={styles.project_info_body}>
            <div>
              <p>{project.description}</p>
              <h2>Composition</h2>
              <ul>
                {project.composition.map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
              <h2>Features</h2>
              <ul>
                {project.features.map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
              <div className={styles.product_info_link}>
                <p>
                  Check the repository on{" "}
                  <Link href={project.repository} target="_blank">
                    → Github
                  </Link>
                </p>
                <p>
                  Check the deployed version on{" "}
                  <Link href={project.link} target="_blank">
                    → Vercel
                  </Link>
                </p>
              </div>
            </div>
            <div className={styles.image_div}>
              <Link href={project.link} target="_blank">
                <Image
                  // src={mockup}
                  src={
                    "https://res.cloudinary.com/dtl48kr1u/image/upload/v1694358931/personal-site/DSC02863_owsl4d.jpg"
                  }
                  alt={project.alt}
                  title={project.alt}
                  width="0"
                  height="0"
                  sizes="100vw"
                  style={{ width: "auto", height: "400px" }}
                />
              </Link>
              <div className={styles.icons_div}>
                <Image
                  src={"/Icons/desktop.png"}
                  alt={"desktop"}
                  title={"Desktop"}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className={styles.mockup_icon}
                  onClick={() => {
                    setMockup(project.mockup_desktop);
                  }}
                />
                <Image
                  src={"/Icons/mobile.png"}
                  alt={"mobile"}
                  title={"Mobile"}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className={styles.mockup_icon}
                  onClick={() => {
                    setMockup(project.mockup_mobile);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <hr />
      {projects && (
        <div className={styles.other_projects_div}>
          {projects
            .filter((item) => {
              return item.internal_id !== project?.internal_id;
            })
            .map((project: Project, index: number) => {
              return <ProjectCard project={project} key={index} page={"id"} />;
            })}
        </div>
      )}
      <br />
      <br />
      <hr />
      <Contact />
    </>
  );
}
