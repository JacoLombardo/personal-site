/* eslint-disable react-hooks/exhaustive-deps */
import About from "@/components/about/About";
import Contact from "@/components/Contact";
import CV from "@/components/cv/CV";
import Intro from "@/components/intro/Intro";
import NavBar from "@/components/NavBar";
import Projects from "@/components/Projects";
import Technologies from "@/components/technologies/Technologies";
import clientPromise from "@/lib/mongodb";

interface Props {
  projectString: string;
}

export default function Home({ projectString }: Props) {
  const projects = JSON.parse(projectString);
  return (
    <>
      <NavBar page={"home"} />
      <main>
        <Intro />
        <Projects projects={projects} />
        <Technologies />
        <About />
        <CV />
        <Contact />
      </main>
    </>
  );
}

export async function getStaticProps() {
  try {
    const client = await clientPromise;
    const db = client.db("personal-site");
    const res = await db.collection("projects").find({}).toArray();
    return { props: { projectString: JSON.stringify(res) } };
  } catch (e) {
    console.error("MongoDB connection failed (check MONGODB_URI and network):", e);
    return { props: { projectString: "[]" } };
  }
}
