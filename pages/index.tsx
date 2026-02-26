/* eslint-disable react-hooks/exhaustive-deps */
import About from "@/components/about/About";
import Contact from "@/components/Contact";
import CV from "@/components/cv/CV";
import Intro from "@/components/intro/Intro";
import NavBar from "@/components/NavBar";
import Projects from "@/components/Projects";
import SpeedDatePopup from "@/components/SpeedDatePopup";
import Technologies from "@/components/technologies/Technologies";
import clientPromise from "@/lib/mongodb";
import type { JsonProject } from "@/components/projects/projectsData";

interface IntroData {
  name: string;
  title: string;
  photo: string;
}

interface AboutMeData {
  text: string;
}

interface ContactData {
  email: string;
  linkedin: string;
  github: string;
}

interface TechData {
  id: string;
  name: string;
  type: string;
  level: string;
  projects: string[];
  alwaysShown: boolean;
  icon: string;
}

interface Props {
  projectString: string;
  intro: IntroData | null;
  aboutMe: AboutMeData | null;
  contact: ContactData | null;
  technologies: TechData[];
}

const emptyIntro: IntroData = { name: "", title: "", photo: "" };
const emptyContact: ContactData = { email: "", linkedin: "#", github: "#" };

export default function Home({ projectString, intro, aboutMe, contact, technologies }: Props) {
  const projects = JSON.parse(projectString) as JsonProject[];
  const introData = intro ?? emptyIntro;
  const contactData = contact ?? emptyContact;
  const projectListForTech = projects.map((p) => ({ id: p.id ?? "", name: p.name ?? "" }));
  return (
    <>
      <NavBar page="home" intro={introData} contact={contactData} />
      <SpeedDatePopup />
      <main>
        <Intro intro={introData} />
        <Projects projects={projects} />
        <Technologies technologies={technologies} projects={projectListForTech} />
        <About aboutMe={aboutMe} />
        <CV />
        <Contact contact={contactData} />
      </main>
    </>
  );
}

export async function getStaticProps() {
  const empty = {
    projectString: "[]",
    intro: null,
    aboutMe: null,
    contact: null,
    technologies: [] as TechData[],
  };
  try {
    const client = await clientPromise;
    const db = client.db("personal-site");
    const contentColl = db.collection("content");
    const [projects, introDoc, aboutMeDoc, contactDoc, technologiesList] = await Promise.all([
      db.collection("projects").find({}).toArray(),
      contentColl.findOne({ _id: "intro" } as Record<string, unknown>),
      contentColl.findOne({ _id: "about-me" } as Record<string, unknown>),
      contentColl.findOne({ _id: "contact" } as Record<string, unknown>),
      db.collection("technologies").find({}).toArray(),
    ]);
    const intro = introDoc ? { name: introDoc.name, title: introDoc.title, photo: introDoc.photo } : null;
    const aboutMe = aboutMeDoc && "text" in aboutMeDoc ? { text: aboutMeDoc.text } : null;
    const contact = contactDoc ? { email: contactDoc.email, linkedin: contactDoc.linkedin, github: contactDoc.github } : null;
    const technologies: TechData[] = ((technologiesList as unknown as Record<string, unknown>[]) ?? []).map((t) => ({
      id: t.id as string,
      name: t.name as string,
      type: t.type as string,
      level: t.level as string,
      projects: (t.projects as string[]) ?? [],
      alwaysShown: (t.alwaysShown as boolean) ?? false,
      icon: t.icon as string,
    }));
    return {
      props: {
        projectString: JSON.stringify(projects),
        intro,
        aboutMe,
        contact,
        technologies,
      },
    };
  } catch (e) {
    console.error("MongoDB connection failed (check MONGODB_URI and network):", e);
    return { props: empty };
  }
}
