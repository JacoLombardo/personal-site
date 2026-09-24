# TODO

Open work only. Delete items when they ship; [CHANGELOG.md](CHANGELOG.md) is the record of what was done.

- Upgrade `styled-components` from 6.0.8 to 6.5.x (inside the existing `^6.0.8` range). 6.0.8 installs about ten Babel packages as runtime dependencies, which is where most of the Babel security alerts came from; 6.5.3 needs no Babel. Check the site visually afterwards.
- Plan the move to Next.js 16. The 15.x line only gets security backports now, and `next lint` is removed in 16 (`npx @next/codemod@canary next-lint-to-eslint-cli .` migrates it).
