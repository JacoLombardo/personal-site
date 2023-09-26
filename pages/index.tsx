/* eslint-disable react-hooks/exhaustive-deps */
import About from "@/components/About";
import Contact from "@/components/Contact";
import Intro from "@/components/Intro";
import NavBar from "@/components/NavBar";
import Projects from "@/components/Projects";
import clientPromise from "@/lib/mongodb";
import { Mode } from "@/types";

interface Props {
  projectString: string;
  theme: Mode;
  toggleTheme: Function;
}

export default function Home({ projectString, theme, toggleTheme }: Props) {
  const projects = JSON.parse(projectString);
  return (
    <>
      <NavBar
        page={"home"}
        projects={projects}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <Intro />
      <hr />
      <About />
      <hr />
      <Projects projects={projects} theme={theme} />
      <hr />
      <Contact theme={theme} />
    </>
  );
}

export async function getStaticProps() {
  const client = await clientPromise;
  const db = client.db("personal-site");

  const res = await db.collection("projects").find({}).toArray();
  const projectString = JSON.stringify(res);

  return {
    props: {
      projectString,
    },
  };
}
