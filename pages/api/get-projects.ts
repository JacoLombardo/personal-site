import { Project } from "@/types/project";
import clientPromise from "../../lib/mongodb";

export default async function getProjects(_req: any, res: any) {
  // export default async function getProjects() {
  try {
    const client = await clientPromise;
    const db = client.db("personal-site");

    const projects = await db.collection("projects").find({}).toArray();

    res.json(projects);
    // return projects;
  } catch (e) {
    console.error(e);
  }
}
