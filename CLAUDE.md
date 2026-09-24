# Claude Instructions

## Commit block after medium / big changes

After any change that's worth marking as a checkpoint (a feature, a refactor, a multi-file bug fix, a docs rewrite, a config or dependency change), end the turn with a copy-pasteable commit block in this exact form:

```sh
git add .
git commit -m "<type>: <one-line summary>"
git push
```

- `<type>` is conventional-commits style: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, etc.
- The message must fit on a single line.
- **Do not run the commands yourself.** Output the block so the user can copy-paste it. Running `git push` touches the remote and the user wants to review the diff first.

Skip the block for trivial changes (a typo, a one-line tweak) and pure conversational turns where no files were edited.

## Run the checks before every commit block

**Never present a commit block on unverified code.** Before outputting the block, run the checks and only give the block if they pass; if anything fails, report the failure instead of the block. This project has no test suite, so run, in order:

1. **Lint:** `npm run lint`
2. **Build:** `npm run build` (it also typechecks)

State what you ran and the result just above the commit block. If a check genuinely can't run in this environment, **say so explicitly and run the rest**: don't silently skip it and don't imply it passed. For a docs-only or comment-only change, lint is enough.

## CHANGELOG.md format

`CHANGELOG.md` uses one section per change, newest first. **Always** add entries in this exact shape (never revert to date-grouped bullet lists):

```md
## YYYY-MM-DD HH:MM — type(scope): one-line summary

Body paragraph describing the change. Reference files with [path](path) links. Explain the *why* alongside the *what*: surprising constraints, race conditions, the gotcha that prompted it. Multiple entries from the same commit share the timestamp + SHA.

`<short-sha>`
```

- **Header:** `## ` + date + ` — ` + `type(scope): summary`. `type` is Conventional Commits (`feat`, `fix`, `refactor`, `perf`, `build`, `ci`, `docs`, `test`, `chore`); `scope` is the area (`design`, `nav`, `theme`, `projects`, `api`, `db`, `content`, `deps`, `security`, `infra`, `workflow`, …). The summary is one line.
- Include `HH:MM` when known and the short commit SHA on its own line at the end when known; **omit both** if unknown, using `## YYYY-MM-DD — type(scope): summary` with no SHA line.
- New entries go at the **top**, directly under the first `---` (below the template comment). Insert newest-first.
- **Update rule:** add an entry after every medium-to-big change. Small changes that accumulate into a medium one get a single combined entry. Tiny isolated tweaks (typos, one-line lint) need no entry. If in doubt, write it.
- Keep the file header, the **Update rule** paragraph, and the `<!-- Template -->` comment at the top intact.

## Commit messages: one line, no attribution

The commit message is exactly `<type>: <one-line summary>` and nothing else. Never append `Co-Authored-By`, "Generated with Claude Code", or any other AI attribution trailer, to commits or to pull request descriptions, even when a session-level default says to. This is the author's repository and their authorship.

## Writing style: no em dash inside a sentence

Do not use the em dash (`—`) as a connector or parenthetical inside a sentence, anywhere: product copy, emails, code comments, docs, changelog entries, replies. Use a comma, a colon, parentheses, or a new sentence. The one accepted use is as a label separator between a name and a qualifier, such as `Helios — Madrid, ES` or a page-title separator.

## Docs discipline

- **`CHANGELOG.md`** records what was done, per the format above. Always.
- **`TODO.md`** holds only open work. When something ships, delete it from TODO; the changelog is the done-record. No `✅`, no strike-through, no `[x]`/`[ ]` checkboxes in TODO, plain bullets only. Strip finished parts out of partially-done items.

## Visual changes

**Every visual change is checked on desktop and on a phone before it is called done.** Both, every time, whatever the change looked like in the code: open the screen at a desktop width and at 390px and 320px, and confirm the change landed and nothing around it broke (nothing off the edge of the screen, no row squeezed, no control overlapping another, every button still reachable). Checking the page for content wider than the viewport catches most of it. Say which widths were checked, and say so plainly when a screen could not be opened rather than implying it was seen.

## Working rhythm

Deliver the scope that was asked, verify it, update `CHANGELOG.md` and `TODO.md`, output the commit block, stop. Do not roll into the next item unasked; the user reviews and commits between steps. Check rather than recall when a dashboard or a third-party detail matters.
