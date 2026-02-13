/* eslint-disable react-hooks/exhaustive-deps */
import About from "@/components/About";
import Contact from "@/components/Contact";
import Intro from "@/components/Intro";
import NavBar from "@/components/NavBar";
import Projects from "@/components/Projects";
import clientPromise from "@/lib/mongodb";

interface Props {
  projectString: string;
}

export default function Home({ projectString }: Props) {
  const projects = JSON.parse(projectString);
  return (
    <>
      <NavBar page={"home"} />
      <Intro />
      <hr />
      <About />
      <hr />
      <Projects projects={projects} />
      <hr />
      <Contact />
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
