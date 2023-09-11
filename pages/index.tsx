import About from "@/components/About";
import Contact from "@/components/Contact";
import Intro from "@/components/Intro";
import NavBar from "@/components/NavBar";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <>
      <NavBar />
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
