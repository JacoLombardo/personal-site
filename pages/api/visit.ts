import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

const SESSION_KEY = "visitRecorded";

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
    const body = req.body as VisitBody;
    const userAgent = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : "";
    const doc = {
      path: typeof body.path === "string" ? body.path : "",
      referrer: typeof body.referrer === "string" ? body.referrer : "",
      userAgent,
      timestamp: new Date(),
      language: typeof body.language === "string" ? body.language : undefined,
      timezone: typeof body.timezone === "string" ? body.timezone : undefined,
      screenWidth: typeof body.screenWidth === "number" ? body.screenWidth : undefined,
      screenHeight: typeof body.screenHeight === "number" ? body.screenHeight : undefined,
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
