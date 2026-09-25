# Changelog

Every medium-to-big change to the site, newest first. The entry format lives in [CLAUDE.md](CLAUDE.md).

**Update rule:** add an entry after every medium-to-big change. Small changes that accumulate into a medium one get a single combined entry. Tiny isolated tweaks (typos, one-line lint) need no entry. If in doubt, write it.

<!-- Template

## YYYY-MM-DD HH:MM — type(scope): one-line summary

Body paragraph: what changed and why. Reference files with [path](path) links.

`<short-sha>`

-->

---

## 2026-09-25 — feat(projects): add BackToLife

Added BackToLife to [public/projects.json](public/projects.json) and pushed it to MongoDB: a professional project, marked `isShared` because it spans mobile apps and a web backend, so it orbits in the convergence zone next to VidBase and appears under Software Engineering in the list view. It is appended after VidBase so VidBase keeps its orbit. Its stack (Flutter, Laravel, MySQL, Firebase, RevenueCat, Swift, Kotlin) shows as tags on the project page; none of these are in the Technologies section yet. Checked the orbits and the new project page at 1440, 390 and 320px.

## 2026-09-25 — fix(design): no white flash on first load, drop styled-components

The dark background and white text came from a styled-components `createGlobalStyle`, and without a styled-components SSR setup it was only injected by JavaScript: the server HTML and CSS had Bootstrap's white body, so every first visit painted white until hydration. The two declarations now live in [global.css](styles/global.css), and styled-components (`ThemeProvider`, `styles/ThemeConfig.ts`, `types/styled-components.d.ts`) is gone; it existed only for this.

## 2026-09-25 — feat(seo): link previews, canonical URLs, robots.txt and sitemap

With the site on jacopolombardo.com, [pages/_app.tsx](pages/_app.tsx) now sets a default description, a canonical URL per route, Open Graph and Twitter tags (preview image: the intro photo cropped to 1200x630 by Cloudinary), from constants in [lib/site.ts](lib/site.ts); project pages override the description and title with the project's own. [public/robots.txt](public/robots.txt) points to [app/sitemap.ts](app/sitemap.ts), which lists the pages and every project and is generated at build time like the pages. `<html>` now has `lang="en"`.

## 2026-09-25 — fix(security): Windows-only TLS workaround, bounded visit logging

[lib/mongodb.ts](lib/mongodb.ts) and the push-json script enabled `SSL_OP_LEGACY_SERVER_CONNECT` everywhere, including on Vercel; it re-enables insecure legacy TLS renegotiation and was only a Windows development workaround, so it is now applied on `win32` only. [pages/api/visit.ts](pages/api/visit.ts) is public and stored whatever it was sent (up to 1 MB per request), so anyone could fill the free Atlas cluster: requests are now capped at 4 KB, every stored string is length-limited, and screen sizes must be plausible numbers.

## 2026-09-25 — perf: smaller pages and less background work

`projectsData.ts` imported all of `public/projects.json` into the client bundle as a fallback for an empty collection, while the same projects also came through page props as double-encoded JSON with Mongo's `_id`: the fallback is gone and the props are a plain array without `_id`. `StarBackground` server-rendered 300 random circles (54 KB, 43% of the home HTML) that the browser then re-generated differently; it now renders in the browser only (home HTML 126 KB to 71 KB). The `Orbits` animation loop only runs while the projects section is on screen, and the site respects `prefers-reduced-motion` (orbits, star twinkle, framer-motion via `MotionConfig`). The full `bootstrap.css` (233 KB, 30.8 KB gzipped) is replaced by [styles/bootstrap.scss](styles/bootstrap.scss), Bootstrap's own reboot, containers, transitions, nav and navbar sources (25 KB, 5.5 KB gzipped). Poppins comes from `next/font` as self-hosted woff2 with `font-display: swap` and the real 400 to 700 weights, replacing a single Regular TTF with no `font-display` whose heavier weights were faked by the browser; headings and the intro subtitle are visibly bolder as a result, which is what the CSS always specified.

Checked in three batches against a baseline of the previous build, with screenshots of the home, privacy, speed-date and a project page at 1440, 390 and 320px plus the open mobile menu and the speed-date popup. The first two batches match the baseline apart from text anti-aliasing mode; the font batch differs only in text weight, with identical page heights.

## 2026-09-25 — chore(cleanup): dead code, unused CSS and dependencies, tooling, docs

Removed unused code: `SectionHeader`, `ProjectCard`, the `components/Projects.tsx` re-export, `app/globals.css`, the unused and broken `/api/get-projects` and `/api/project-by-id` routes, the dummy-data seed scripts, `"use client"` directives (no effect in the Pages Router), the placeholder fields of the `Project` type, and the CSS module classes nothing uses (taking `composes` into account). The unused flaticon and picsum image hosts are gone from [next.config.js](next.config.js). TypeScript 5.2 moved to 6.0.3 (what editors now run; `typescript-eslint` supports up to 6.0), the `@types` packages to current React 18 and Node 22, and the dev tools to `devDependencies`. [README.md](README.md) and [docs/MONGODB_SETUP.md](docs/MONGODB_SETUP.md) were rewritten to match the site as it is.

## 2026-09-24 — chore(deps): upgrade to Next.js 16

Upgraded `next` and `eslint-config-next` from 15.5.26 to 16.3.6, since the 15.x line only gets security backports now. `eslint-config-next` 16 needs ESLint 9 or later, so `eslint` moved from 8.48.0 to 9.39.5 (not 10: `eslint-plugin-react` doesn't support it yet), and [eslint.config.mjs](eslint.config.mjs) replaces `.eslintrc.json` with the same `core-web-vitals` rules in flat-config form. `next lint` is gone and `next build` no longer lints, so the `lint` script is now `eslint .`, which also covers files `next lint` skipped; ESLint 9 flagged two file-wide `react-hooks/exhaustive-deps` disables as unused, and they were removed. `images.domains` is deprecated, so [next.config.js](next.config.js) uses `remotePatterns`. Next 16 stops forcing instant scrolling on route changes when `<html>` has `scroll-behavior: smooth` (set in [global.css](styles/global.css) for the section links), so the new [pages/_document.tsx](pages/_document.tsx) opts back in with `data-scroll-behavior="smooth"`. Builds now use Turbopack, and Next rewrote [tsconfig.json](tsconfig.json) (`jsx: react-jsx`, `.next/dev/types`). Checked with typecheck, lint, a real-data build (31 pages) and screenshots of the home, privacy, speed-date and a project page at 1440, 390 and 320px: identical to the Next 15 build apart from the random background stars. Next's default 404 page, which the site uses, is restyled slightly.

## 2026-09-24 — fix(db): fail the build when MongoDB can't be reached

Every data page (`index`, `privacy`, `speed-date`, `project/[id]`) caught MongoDB errors and returned empty props, no paths or `notFound`, so `next build` reported success and shipped an empty site. That is what happened while the Atlas cluster was paused. No page revalidates and project paths use `fallback: false`, so all data is read once at build time: without the catches, a failed load now fails the build instead of deploying empty pages. [lib/mongodb.ts](lib/mongodb.ts) also wraps the connection error with a hint, because a paused cluster only shows up as `querySrv ENOTFOUND`. Checked both ways: a build against a nonexistent cluster fails with the new message, and a build with the real database still prerenders all 31 pages.

## 2026-09-24 — chore(deps): upgrade styled-components and remove unused emotion packages

`styled-components` 6.0.8 shipped the Babel toolchain (`@babel/core`, `preset-env`, `preset-react` and more) as runtime dependencies, and the unused `@emotion/react` and `@emotion/styled` brought `@emotion/babel-plugin`, `babel-plugin-macros`, `cosmiconfig` and `yaml`. Together they were behind most of the Babel and yaml security alerts. Upgrading to 6.5.3 and uninstalling emotion (nothing imported it) takes the install from 555 to 362 packages; only `@babel/runtime`, needed by react-bootstrap, remains. 6.5.3 types `DefaultTheme` as an empty interface meant to be extended, so `theme.body` in [ThemeConfig.ts](styles/ThemeConfig.ts) stopped typechecking: [types/styled-components.d.ts](types/styled-components.d.ts) now extends it with the shape of `darkTheme`. Checked with a real-data build and a before/after screenshot comparison at 1440, 390 and 320px: identical apart from the randomly placed background stars.

## 2026-09-24 — docs(workflow): add CLAUDE.md, CHANGELOG.md and TODO.md

Added [CLAUDE.md](CLAUDE.md) with the working rules imported from the atag project: a commit block at the end of medium and big changes, checks before it, one-line commit messages without AI attribution, no em dash inside sentences, desktop and phone checks for visual changes, and the discipline for this changelog and [TODO.md](TODO.md). The checks are `npm run lint` and `npm run build` because this site has no test suite. Left out atag's infrastructure rules (Coolify, Prisma, Supabase, e2e) and its "menus close only on an outside click" rule, because [NavBar.tsx](components/NavBar.tsx) closes the mobile menu on link tap on purpose: its links scroll within the page, so nothing remounts the header.

## 2026-09-24 — fix(deps): bump next to 15.5.26 and patch vulnerable dependencies

Bumped `next` and `eslint-config-next` from 15.5.15 to 15.5.26 in [package.json](package.json) to clear GitHub's Dependabot alerts, including two unauthenticated remote code execution advisories fixed in 15.5.24. Next pins `postcss` to exactly 8.4.31, even in 15.5.26, so a `postcss@<8.5.28` override joins the existing picomatch and minimatch ones. `npm audit fix` moved the remaining transitive packages (flatted, js-yaml, nanoid, immutable, browserslist, brace-expansion, yaml, sharp, the Babel packages) to patched versions within their ranges in [package-lock.json](package-lock.json). `npm audit` went from 19 vulnerable packages (2 critical) to 0; lint and build pass.
