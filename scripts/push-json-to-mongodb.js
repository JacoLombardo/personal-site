/**
 * Push public/projects.json to MongoDB (personal-site DB).
 *
 * Pushes: projects, technologies, intro, about-me, contact, cv.
 *
 * Load MONGODB_URI from .env.local (Node 20.6+):
 *   node --env-file=.env.local scripts/push-json-to-mongodb.js
 *
 * Example:
 *   npm run push-json
 */

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const tls = require("tls");
const crypto = require("crypto");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI. Use .env.local or set the variable.");
  process.exit(1);
}

// Same TLS workaround as lib/mongodb.ts (Windows + Node 17+), Windows only for the same reason
const options =
  process.platform === "win32"
    ? { secureContext: tls.createSecureContext({ secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT ?? 0 }) }
    : {};

async function run() {
  const jsonPath = path.join(__dirname, "..", "public", "projects.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("Not found:", jsonPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error("Invalid JSON in projects.json:", e.message);
    process.exit(1);
  }

  const projects = data.projects;
  if (!Array.isArray(projects)) {
    console.error("projects.json must have a 'projects' array.");
    process.exit(1);
  }

  const technologies = Array.isArray(data.technologies) ? data.technologies : [];
  const intro = data.intro || null;
  const aboutMe = data["about-me"] || null;
  const contact = data.contact || null;
  const cv = data.cv || null;

  const client = new MongoClient(uri, options);
  try {
    await client.connect();
    const db = client.db("personal-site");

    // Projects
    const projectsColl = db.collection("projects");
    await projectsColl.deleteMany({});
    await projectsColl.insertMany(projects);
    console.log(`Inserted ${projects.length} projects into personal-site.projects.`);

    // Technologies
    const techColl = db.collection("technologies");
    await techColl.deleteMany({});
    if (technologies.length > 0) {
      await techColl.insertMany(technologies);
      console.log(`Inserted ${technologies.length} technologies into personal-site.technologies.`);
    }

    // Intro, about-me, contact (single-doc collection, keyed by _id)
    const contentColl = db.collection("content");
    if (intro) {
      await contentColl.replaceOne(
        { _id: "intro" },
        { _id: "intro", ...intro },
        { upsert: true }
      );
      console.log("Upserted intro into personal-site.content.");
    }
    if (aboutMe) {
      await contentColl.replaceOne(
        { _id: "about-me" },
        { _id: "about-me", ...aboutMe },
        { upsert: true }
      );
      console.log("Upserted about-me into personal-site.content.");
    }
    if (contact) {
      await contentColl.replaceOne(
        { _id: "contact" },
        { _id: "contact", ...contact },
        { upsert: true }
      );
      console.log("Upserted contact into personal-site.content.");
    }
    if (cv) {
      await contentColl.replaceOne(
        { _id: "cv" },
        { _id: "cv", ...cv },
        { upsert: true }
      );
      console.log("Upserted cv into personal-site.content.");
    }
  } catch (e) {
    console.error("Push failed:", e.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
