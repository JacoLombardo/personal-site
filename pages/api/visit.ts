import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

// A visit is a few hundred bytes; the limits stop anyone from filling the database through this public endpoint.
export const config = { api: { bodyParser: { sizeLimit: "4kb" } } };

const text = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : undefined);
const pixels = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 && value < 100000 ? Math.round(value) : undefined;

interface VisitBody {
  path?: string;
  referrer?: string;
  language?: string;
  timezone?: string;
  screenWidth?: number;
  screenHeight?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  try {
    const body = (req.body ?? {}) as VisitBody;
    const doc = {
      path: text(body.path, 200) ?? "",
      referrer: text(body.referrer, 500) ?? "",
      userAgent: text(req.headers["user-agent"], 300) ?? "",
      timestamp: new Date(),
      language: text(body.language, 35),
      timezone: text(body.timezone, 64),
      screenWidth: pixels(body.screenWidth),
      screenHeight: pixels(body.screenHeight),
    };

    const client = await clientPromise;
    const db = client.db("personal-site");
    await db.collection("visitors").insertOne(doc);

    res.status(201).json({ ok: true });
  } catch (e) {
    console.error("Visit API error:", e);
    res.status(500).json({ error: "Failed to record visit" });
  }
}
