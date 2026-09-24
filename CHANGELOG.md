# Changelog

Every medium-to-big change to the site, newest first. The entry format lives in [CLAUDE.md](CLAUDE.md).

**Update rule:** add an entry after every medium-to-big change. Small changes that accumulate into a medium one get a single combined entry. Tiny isolated tweaks (typos, one-line lint) need no entry. If in doubt, write it.

<!-- Template

## YYYY-MM-DD HH:MM — type(scope): one-line summary

Body paragraph: what changed and why. Reference files with [path](path) links.

`<short-sha>`

-->

---

## 2026-09-24 — docs(workflow): add CLAUDE.md, CHANGELOG.md and TODO.md

Added [CLAUDE.md](CLAUDE.md) with the working rules imported from the atag project: a commit block at the end of medium and big changes, checks before it, one-line commit messages without AI attribution, no em dash inside sentences, desktop and phone checks for visual changes, and the discipline for this changelog and [TODO.md](TODO.md). The checks are `npm run lint` and `npm run build` because this site has no test suite. Left out atag's infrastructure rules (Coolify, Prisma, Supabase, e2e) and its "menus close only on an outside click" rule, because [NavBar.tsx](components/NavBar.tsx) closes the mobile menu on link tap on purpose: its links scroll within the page, so nothing remounts the header.

## 2026-09-24 — fix(deps): bump next to 15.5.26 and patch vulnerable dependencies

Bumped `next` and `eslint-config-next` from 15.5.15 to 15.5.26 in [package.json](package.json) to clear GitHub's Dependabot alerts, including two unauthenticated remote code execution advisories fixed in 15.5.24. Next pins `postcss` to exactly 8.4.31, even in 15.5.26, so a `postcss@<8.5.28` override joins the existing picomatch and minimatch ones. `npm audit fix` moved the remaining transitive packages (flatted, js-yaml, nanoid, immutable, browserslist, brace-expansion, yaml, sharp, the Babel packages) to patched versions within their ranges in [package-lock.json](package-lock.json). `npm audit` went from 19 vulnerable packages (2 critical) to 0; lint and build pass.
