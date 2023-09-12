import clientPromise from "../../lib/mongodb";

export default async function getProjectById(_req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("personal-site");
    const id: number = +_req.query.id;
    const project = await db
      .collection("projects")
      .findOne({ internal_id: id });

    res.json(project);
  } catch (e) {
    console.error(e);
  }
}
