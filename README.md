# Personal Site

Personal Site is a portfolio site built with Next.js. It shows an intro, about section, project list (from MongoDB), and contact section. It supports dark/light theme and project detail pages.

## Composition

The app is built around a single-page layout with sections:

- **NavBar**: navigation and theme toggle.
- **Intro**: hero section.
- **About**: about section.
- **Projects**: project cards loaded from MongoDB; link to `/project/[id]`.
- **Contact**: contact section with links and CV.

## Features

- Projects stored in MongoDB; fetched at build time via `getStaticProps` and API routes (`/api/get-projects`, `/api/project-by-id`).
- Dark/light mode via `@anatoliygatt/dark-mode-toggle` and theme config.
- Project detail page with dynamic routing (`pages/project/[id].tsx`).
- Styling with Bootstrap, Emotion, styled-components, and SASS.
- Icons and assets in `public/Icons/` (Contact, Stack, arrows, etc.).

## Technology

- Next.js 13 + React 18
- TypeScript
- MongoDB
- Bootstrap, Emotion, styled-components, SASS

## Setup

```bash
npm install
npm run dev
```

Set `MONGODB_URI` in `.env.local` for the database connection (see [docs/MONGODB_SETUP.md](docs/MONGODB_SETUP.md) for creating a new Atlas cluster). Optionally seed a sample project:

```bash
node --env-file=.env.local scripts/seed-projects.js
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Notes

- Projects are read from MongoDB; ensure the DB and collection are set up and env vars are correct.
- Media folder at repo level (mockups, screenshots) is for design only and can be ignored for running the app.

## Troubleshooting: `querySrv ENOTFOUND _mongodb._tcp.cluster0....mongodb.net`

This means the app cannot resolve your MongoDB Atlas hostname. Common fixes:

1. **Check the exact connection string**  
   In [MongoDB Atlas](https://cloud.mongodb.com) → your cluster → **Connect** → **Drivers**. Copy the URI and set it in `.env.local` as `MONGODB_URI`. The hostname (e.g. `cluster0.xxxxx.mongodb.net`) must match your cluster.

2. **Typo or old cluster**  
   If you recreated the cluster, the hostname changed. Replace `MONGODB_URI` in `.env.local` with the new URI from Atlas.

3. **Network / DNS**  
   Ensure you have internet access and that firewall/VPN allow outbound DNS and connections to `*.mongodb.net`. Try from another network if needed.

If MongoDB is unreachable, the site still builds and runs: the homepage shows with no projects, and project detail pages return 404 until the DB is reachable again.
