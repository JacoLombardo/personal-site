import Head from "next/head";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import projectsJson from "../../public/projects.json";
import styles from "@/styles/project.module.css";

interface JsonProject {
  id: string;
  name: string;
  domain: string;
  type: string;
  description: string;
  tech_stack?: string[];
  repository?: string;
  link?: string;
}

interface AdjacentProject {
  id: string;
  name: string;
}

interface Props {
  project: JsonProject | null;
  prevProject: AdjacentProject;
  nextProject: AdjacentProject;
}

function formatDomain(domain: string): string {
  if (domain === "software") return "Software Engineering";
  if (domain === "web") return "Web Development";
  return domain.charAt(0).toUpperCase() + domain.slice(1).toLowerCase();
}

function formatType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export default function ProjectPage({ project, prevProject, nextProject }: Props) {
  if (!project) {
    return (
      <>
        <NavBar page="project" />
        <main className={styles.project_page_main}>
          <p>Project not found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{project.name} | Jacopo Lombardo</title>
      </Head>
      <NavBar page="project" />
      <main className={styles.project_page_main}>
        <nav className={styles.project_adjacent} aria-label="Previous and next project">
          <Link href={`/project/${prevProject.id}`} className={styles.project_adjacent_link} title={prevProject.name}>
            <span className={styles.project_adjacent_arrow} aria-hidden>←</span>
            <span className={styles.project_adjacent_label}>{prevProject.name}</span>
          </Link>
          <Link href={`/project/${nextProject.id}`} className={styles.project_adjacent_link} title={nextProject.name}>
            <span className={styles.project_adjacent_label}>{nextProject.name}</span>
            <span className={styles.project_adjacent_arrow} aria-hidden>→</span>
          </Link>
        </nav>
        <article className={styles.project_article}>
          <h1 className={styles.project_title}>{project.name}</h1>
          <dl className={styles.project_meta}>
            <div className={styles.project_meta_row}>
              <dt>Domain</dt>
              <dd>{formatDomain(project.domain)}</dd>
            </div>
            <div className={styles.project_meta_row}>
              <dt>Type</dt>
              <dd>{formatType(project.type)}</dd>
            </div>
          </dl>
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className={styles.project_stack_wrap}>
              <h2 className={styles.project_stack_title}>Stack</h2>
              <ul className={styles.project_stack_list}>
                {project.tech_stack.map((tech) => (
                  <li key={tech} className={styles.project_stack_tag}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={styles.project_description}>
            <p>{project.description}</p>
          </div>
          {(project.repository || project.link) && (
            <div className={styles.project_links}>
              <h2 className={styles.project_links_title}>Links</h2>
              <div className={styles.project_links_list}>
                {project.repository && (
                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.project_link}
                  >
                    Repository
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.project_link}
                  >
                    Live site
                  </a>
                )}
              </div>
            </div>
          )}
        </article>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const raw = (projectsJson as { projects?: JsonProject[] }).projects;
  if (!raw || !Array.isArray(raw)) {
    return { paths: [], fallback: false };
  }
  const paths = raw.map((p) => ({ params: { id: p.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({
  params,
}: {
  params: { id: string };
}) {
  const raw = (projectsJson as { projects?: JsonProject[] }).projects;
  if (!raw || !Array.isArray(raw)) {
    return { notFound: true };
  }
  const index = raw.findIndex((p) => p.id === params.id);
  if (index === -1) return { notFound: true };
  const project = raw[index];
  const last = raw.length - 1;
  const prevProject = { id: raw[index === 0 ? last : index - 1].id, name: raw[index === 0 ? last : index - 1].name };
  const nextProject = { id: raw[index === last ? 0 : index + 1].id, name: raw[index === last ? 0 : index + 1].name };
  return {
    props: {
      project: {
        id: project.id,
        name: project.name,
        domain: project.domain,
        type: project.type,
        description: project.description,
        tech_stack: project.tech_stack ?? [],
        repository: project.repository ?? "",
        link: project.link ?? "",
      },
      prevProject,
      nextProject,
    },
  };
}
