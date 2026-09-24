import Head from "next/head";
import Link from "next/link";
import { useState, useCallback } from "react";
import NavBar from "@/components/NavBar";
import clientPromise from "@/lib/mongodb";
import styles from "@/styles/speeddate.module.css";
import projectStyles from "@/styles/project.module.css";

const HIGHLIGHTED_IDS = [
  "squisito",
  "42_webserv",
  "42_ft_transcendence",
  "vid-base",
];
const TOTAL_STEPS = 9; // 0 intro, 1-4 projects, 5 about title, 6 about text, 7 contact title, 8 contact

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

function formatDomain(domain: string): string {
  if (domain === "software") return "Software Engineering";
  if (domain === "web") return "Web Development";
  return domain.charAt(0).toUpperCase() + domain.slice(1).toLowerCase();
}

function formatType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function ProjectSlide({ project }: { project: JsonProject }) {
  return (
    <article className={projectStyles.project_article}>
      <h1 className={projectStyles.project_title}>{project.name}</h1>
      <dl className={projectStyles.project_meta}>
        <div className={projectStyles.project_meta_row}>
          <dt>Domain</dt>
          <dd>{formatDomain(project.domain)}</dd>
        </div>
        <div className={projectStyles.project_meta_row}>
          <dt>Type</dt>
          <dd>{formatType(project.type)}</dd>
        </div>
      </dl>
      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className={projectStyles.project_stack_wrap}>
          <h2 className={projectStyles.project_stack_title}>Stack</h2>
          <ul className={projectStyles.project_stack_list}>
            {project.tech_stack.map((tech) => (
              <li key={tech} className={projectStyles.project_stack_tag}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={projectStyles.project_description}>
        <p>{project.description}</p>
      </div>
      {(project.repository || project.link) && (
        <div className={projectStyles.project_links}>
          <h2 className={projectStyles.project_links_title}>Links</h2>
          <div className={projectStyles.project_links_list}>
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className={projectStyles.project_link}
              >
                Repository
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={projectStyles.project_link}
              >
                Live site
              </a>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={styles.sd_contact_svg}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={styles.sd_contact_svg}
      aria-hidden
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={styles.sd_contact_svg}
      aria-hidden
    >
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

interface Props {
  projects: JsonProject[];
  aboutText: string;
  intro: { name: string } | null;
  contact: { linkedin: string } | null;
}

export default function SpeedDatePage({
  projects,
  aboutText,
  intro,
  contact,
}: Props) {
  const navIntro = intro ? { name: intro.name } : undefined;
  const navContact = contact ? { linkedin: contact.linkedin } : undefined;
  const [step, setStep] = useState(0);

  const goPrev = useCallback(() => {
    setStep((s) => (s > 0 ? s - 1 : s));
  }, []);

  const goNext = useCallback(() => {
    setStep((s) => (s < TOTAL_STEPS - 1 ? s + 1 : s));
  }, []);

  const showLeftArrow = step > 0;
  const showRightArrow = step < TOTAL_STEPS - 1;

  const renderSlide = () => {
    if (step === 0) {
      return (
        <div className={styles.sd_slide}>
          <h2 className={styles.sd_slide_title}>Highlighted projects</h2>
        </div>
      );
    }
    if (step >= 1 && step <= 4) {
      const project = projects[step - 1];
      if (!project) return null;
      return (
        <div className={`${styles.sd_slide} ${styles.sd_slide_project}`}>
          <ProjectSlide project={project} />
        </div>
      );
    }
    if (step === 5) {
      return (
        <div className={styles.sd_slide}>
          <h2 className={styles.sd_slide_title}>About</h2>
        </div>
      );
    }
    if (step === 6) {
      return (
        <div className={styles.sd_slide}>
          <p className={styles.sd_about_text}>{aboutText}</p>
        </div>
      );
    }
    if (step === 7) {
      return (
        <div className={styles.sd_slide}>
          <h2 className={styles.sd_slide_title}>Contact</h2>
        </div>
      );
    }
    if (step === 8) {
      return (
        <div className={`${styles.sd_slide} ${styles.sd_contact_slide}`}>
          <p className={styles.sd_contact_heading}>Let&apos;s connect</p>
          <div className={styles.sd_contact_icons}>
            <a
              href="https://github.com/JacoLombardo"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sd_contact_link}
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/jacopo-lombardo/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sd_contact_link}
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a
              href="mailto:jacopo.lombardo@outlook.com"
              className={styles.sd_contact_link}
              aria-label="Email"
            >
              <EmailIcon />
            </a>
          </div>
          <Link href="/" className={styles.sd_home_btn}>
            Back to homepage
          </Link>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Head>
        <title>Quick tour | Jacopo Lombardo</title>
      </Head>
      <div className={styles.sd_page}>
        <NavBar page="project" intro={navIntro} contact={navContact} />
        <div className={styles.sd_content_wrap}>
          {showLeftArrow && (
            <button
              type="button"
              className={`${styles.sd_arrow} ${styles.sd_arrow_left}`}
              onClick={goPrev}
              aria-label="Previous"
            >
              ‹
            </button>
          )}
          {showRightArrow && (
            <button
              type="button"
              className={`${styles.sd_arrow} ${styles.sd_arrow_right}`}
              onClick={goNext}
              aria-label="Next"
            >
              ›
            </button>
          )}
          {renderSlide()}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const client = await clientPromise;
  const db = client.db("personal-site");
  const contentColl = db.collection("content");
  const [raw, aboutMeDoc, introDoc, contactDoc] = await Promise.all([
    db.collection("projects").find({}).toArray(),
    contentColl.findOne({ _id: "about-me" } as Record<string, unknown>),
    contentColl.findOne({ _id: "intro" } as Record<string, unknown>),
    contentColl.findOne({ _id: "contact" } as Record<string, unknown>),
  ]);
  const aboutText =
    aboutMeDoc && "shortText" in aboutMeDoc && typeof aboutMeDoc.shortText === "string"
      ? aboutMeDoc.shortText
      : aboutMeDoc && "text" in aboutMeDoc
        ? aboutMeDoc.text
        : "";
  const allProjects = raw as unknown as {
    id: string;
    name: string;
    domain: string;
    type: string;
    description: string;
    tech_stack?: string[];
    repository?: string;
    link?: string;
  }[];
  const projects: JsonProject[] = HIGHLIGHTED_IDS.map((id) =>
    allProjects.find((p) => p.id === id),
  )
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => ({
      id: p.id,
      name: p.name,
      domain: p.domain,
      type: p.type,
      description: p.description,
      tech_stack: p.tech_stack ?? [],
      repository: p.repository ?? "",
      link: p.link ?? "",
    }));
  const intro =
    introDoc && "name" in introDoc ? { name: introDoc.name } : null;
  const contact =
    contactDoc && "linkedin" in contactDoc
      ? { linkedin: contactDoc.linkedin }
      : null;
  return {
    props: { projects, aboutText, intro, contact },
  };
}
