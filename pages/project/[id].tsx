/* eslint-disable react-hooks/exhaustive-deps */
import NavBar from "@/components/NavBar";
import { Mode, Project } from "@/types";
import { useRef, useState } from "react";
import styles from "@/styles/project.module.css";
import Image from "next/image";
import Link from "next/link";
import Contact from "@/components/Contact";
import ProjectCard from "@/components/ProjectCard";
import clientPromise from "@/lib/mongodb";

interface Props {
  projectString: string;
  projectsString: string;
  theme: Mode;
  toggleTheme: Function;
}

export default function ProjectDetails({
  projectString,
  projectsString,
  theme,
  toggleTheme,
}: Props) {
  const project = JSON.parse(projectString);
  const projects = JSON.parse(projectsString);
  const [mockup, setMockup] = useState<string>("desktop");
  const [scrollX, setscrollX] = useState<number>(0);
  const [scrolEnd, setscrolEnd] = useState<boolean>(false);
  const scrl = useRef(null);

  const slide = (shift: number) => {
    (scrl.current! as HTMLBodyElement).scrollLeft += shift;
    if (
      Math.floor(
        (scrl.current! as HTMLBodyElement).scrollWidth -
          (scrl.current! as HTMLBodyElement).scrollLeft
      ) <= (scrl.current! as HTMLBodyElement).offsetWidth
    ) {
      setscrolEnd(true);
    } else {
      setscrolEnd(false);
    }

    setscrollX(scrollX + shift);
  };

  const scrollCheck = () => {
    setscrollX((scrl.current! as HTMLBodyElement).scrollLeft);
    if (
      Math.floor(
        (scrl.current! as HTMLBodyElement).scrollWidth -
          (scrl.current! as HTMLBodyElement).scrollLeft
      ) <= (scrl.current! as HTMLBodyElement).offsetWidth
    ) {
      setscrolEnd(true);
    } else {
      setscrolEnd(false);
    }
  };

  return (
    <>
      <NavBar
        page={"id"}
        projects={projects}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      {project && (
        <div className={styles.project_info_div}>
          <h3>{project.name}</h3>
          <div>
            {project.stack_list.map((stack: string, index: number) => {
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
                  priority={true}
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
                {project.composition.map((item: string, index: number) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
              <h2>Features</h2>
              <ul>
                {project.features.map((item: string, index: number) => {
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
                {mockup === "desktop" ? (
                  <Image
                    src={project.mockup_desktop}
                    alt={project.alt}
                    title={project.alt}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className={styles.project_info_img}
                  />
                ) : (
                  <Image
                    src={project.mockup_mobile}
                    alt={project.alt}
                    title={project.alt}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className={styles.project_info_img}
                  />
                )}
              </Link>
              <div className={styles.icons_div}>
                <Image
                  src={"/Icons/desktop.png"}
                  alt={"desktop"}
                  title={"Desktop Mockup"}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className={styles.mockup_icon}
                  onClick={() => {
                    setMockup("desktop");
                  }}
                />
                <Image
                  src={"/Icons/mobile.png"}
                  alt={"mobile"}
                  title={"Mobile Mockup"}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className={styles.mockup_icon}
                  onClick={() => {
                    setMockup("mobile");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <hr />
      <div className={styles.other_projects_div}>
        {scrollX !== 0 && (
          <div className={styles.scroll_button}>
            <Image
              src={"/Icons/left-arrow1.png"}
              alt="left"
              title="Go left"
              width="0"
              height="0"
              sizes="100vw"
              className={styles.scroll_icon}
              onClick={() => slide(-150)}
            />
          </div>
        )}
        {projects && (
          <div
            className={styles.other_projects_div_2}
            ref={scrl}
            onScroll={scrollCheck}
          >
            {projects
              .filter((item: Project) => {
                return item.internal_id !== project?.internal_id;
              })
              .map((project: Project, index: number) => {
                return (
                  <ProjectCard
                    project={project}
                    key={index}
                    page={"id"}
                    theme={theme}
                  />
                );
              })}
          </div>
        )}
        {!scrolEnd && (
          <div className={styles.scroll_button}>
            <Image
              src={"/Icons/right-arrow1.png"}
              alt="right"
              title="Go right"
              width="0"
              height="0"
              sizes="100vw"
              className={styles.scroll_icon}
              onClick={() => slide(+150)}
            />
          </div>
        )}
      </div>
      <br />
      <br />
      <hr />
      <Contact theme={theme} />
    </>
  );
}

export async function getStaticPaths() {
  const client = await clientPromise;
  const db = client.db("personal-site");

  const res = await db.collection("projects").find({}).toArray();
  const paths = res.map((project) => ({
    params: { id: JSON.stringify(project.internal_id) },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: any) {
  const client = await clientPromise;
  const db = client.db("personal-site");
  const id: number = +params.id;
  const projects = await db.collection("projects").find({}).toArray();
  const project = await db.collection("projects").findOne({ internal_id: id });

  const projectString = JSON.stringify(project);
  const projectsString = JSON.stringify(projects);

  return {
    props: {
      projectString,
      projectsString,
    },
  };
}
