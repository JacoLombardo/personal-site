import clientPromise from "../../lib/mongodb";

export default async function getProjects(_req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("personal-site");

    const projects = await db.collection("projects").find({}).toArray();

    res.json(projects);
  } catch (e) {
    console.error(e);
  }
}
