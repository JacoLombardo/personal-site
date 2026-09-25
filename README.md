# Personal Site

Portfolio of Jacopo Lombardo, live at [jacopolombardo.com](https://jacopolombardo.com). Built with Next.js 16 (Pages Router), deployed on Vercel, with its content in MongoDB Atlas.

## What's on the site

- **Home** ([pages/index.tsx](pages/index.tsx)): intro, projects (orbit and list views), technologies, about, CV and contact.
- **Project pages** ([pages/project/[id].tsx](pages/project/[id].tsx)): one per project.
- **Quick tour** ([pages/speed-date.tsx](pages/speed-date.tsx)) and **privacy** ([pages/privacy.tsx](pages/privacy.tsx)).
- **Visit logging**: [pages/api/visit.ts](pages/api/visit.ts) stores one anonymous visit per browser session; the privacy page lists what it stores.
- **SEO**: page metadata and link previews in [pages/_app.tsx](pages/_app.tsx) (site values in [lib/site.ts](lib/site.ts)), [public/robots.txt](public/robots.txt), and a sitemap built from the projects ([app/sitemap.ts](app/sitemap.ts)).

## How it works

- Every page is built once at build time from MongoDB (`getStaticProps`); only the visit logger touches the database per request. If MongoDB can't be reached, the build fails instead of deploying empty pages.
- The content lives in [public/projects.json](public/projects.json) and is loaded into MongoDB with `npm run push-json`.
- Styling: CSS Modules in `styles/`, a Bootstrap subset for the base styles and the navbar ([styles/bootstrap.scss](styles/bootstrap.scss)), Poppins through `next/font`, animations with framer-motion.

## Setup

```bash
npm install
npm run dev
```

Set `MONGODB_URI` in `.env.local` (and in the Vercel project settings for production). [docs/MONGODB_SETUP.md](docs/MONGODB_SETUP.md) covers creating a cluster and loading the content. Then open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev`: development server
- `npm run build` and `npm run start`: production build and server (the build needs MongoDB)
- `npm run lint`: ESLint
- `npm run push-json`: load `public/projects.json` into MongoDB

## Troubleshooting: `Could not connect to MongoDB (querySrv ENOTFOUND …)`

The build could not reach the Atlas cluster. Usually one of:

1. **The cluster is paused.** Resume it in [MongoDB Atlas](https://cloud.mongodb.com), wait for it to come up, and build again.
2. **Wrong or outdated connection string.** If the cluster was recreated, its hostname changed: copy the URI from Atlas (**Connect → Drivers**) into `MONGODB_URI`.
3. **Network or DNS.** Make sure `*.mongodb.net` is reachable from your network.
