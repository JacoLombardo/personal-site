/* eslint-disable react-hooks/exhaustive-deps */
import About from "@/components/About";
import Contact from "@/components/Contact";
import Intro from "@/components/Intro";
import NavBar from "@/components/NavBar";
import Projects from "@/components/Projects";
import { ProjectContext } from "@/contexts/ProjectContext";
import { useContext, useEffect } from "react";

export default function Home() {
  const { getProjects } = useContext(ProjectContext);

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <NavBar page={"home"} />
      <Intro />
      <hr />
      <About />
      <hr />
      <Projects />
      <hr />
      <Contact />
    </>
  );
}
