/**
 * Seed the personal-site DB with dummy projects (for design work).
 *
 * Loads MONGODB_URI from .env.local (Node 20.6+):
 *   node --env-file=.env.local scripts/seed-projects.js
 *
 * Options:
 *   --replace   Clear the projects collection first, then insert dummy data.
 *               Use this when you want a clean slate for design iteration.
 *
 * Examples:
 *   node --env-file=.env.local scripts/seed-projects.js
 *   node --env-file=.env.local scripts/seed-projects.js --replace
 */

const { MongoClient } = require("mongodb");
const dummyProjects = require("./dummy-projects.js");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI. Use .env.local or set the variable.");
  process.exit(1);
}

const replace = process.argv.includes("--replace");

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("personal-site");
    const coll = db.collection("projects");

    if (replace) {
      await coll.deleteMany({});
      console.log('Cleared "projects" collection.');
    } else {
      const existing = await coll.countDocuments();
      if (existing > 0) {
        console.log(
          `Collection "projects" already has ${existing} document(s). Use --replace to clear and re-seed.`
        );
        return;
      }
    }

    await coll.insertMany(dummyProjects);
    console.log(`Inserted ${dummyProjects.length} dummy projects into personal-site.projects.`);
    console.log("  Web Development: 3");
    console.log("  Software Engineering: 3");
    console.log("  42Berlin: 3");
  } catch (e) {
    console.error("Seed failed:", e.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
