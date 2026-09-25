import type { MetadataRoute } from "next";
import clientPromise from "@/lib/mongodb";
import { SITE_URL } from "@/lib/site";

// Built once at build time, like the pages, so it always lists the deployed projects.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = await clientPromise;
  const projects = await client
    .db("personal-site")
    .collection("projects")
    .find({}, { projection: { _id: 0, id: 1 } })
    .toArray();

  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/speed-date` },
    { url: `${SITE_URL}/privacy` },
    ...projects.map((p) => ({ url: `${SITE_URL}/project/${p.id}` })),
  ];
}
