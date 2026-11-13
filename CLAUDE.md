# CLAUDE.md — SynQuanta website

The public company site: **www.synquanta.com**. React + Vite + Tailwind v4 +
Framer Motion. Part of the `synquanta/` umbrella workspace — see
`../CLAUDE.md` for the map of sibling projects.

## Sync rule (strict)

This repo pushes to **two** remotes:

| Remote | URL | Role |
|---|---|---|
| deployment | `git@github.com:iEmmanuel104/synquanta.git` (public) | was here first, unchanged |
| org mirror | `git@github.com:synquanta-hq/website.git` (private) | company copy |

`origin` carries **both** push URLs, so a plain `git push` reaches both. A
`pre-push` hook blocks the push if that fan-out is ever lost.

- Never `git remote set-url origin <url>` — it silently discards the fan-out.
  Use `sq wire website`.
- **`git push` does not deploy.** This Cloudflare Pages project is *not* git-connected;
  every deployment is CLI-pushed. This was already the standing policy in
  `SEO.md`: *"Pushing to git is for source backup; production ships via this
  CLI command."*
- Never connect this project to a Git integration (Cloudflare or any other host).

Full rule: `../workspace/SYNC.md`.

## Deploy

```bash
sq deploy website     # wraps `npm run deploy`, records the shipped SHA
```

`npm run deploy` is `scripts/deploy-pages.sh` — it builds, runs the Pages postbuild, ships to
the Cloudflare Pages `synquanta` project with wrangler (token from
`~/.config/umbrelar/cloudflare.env`), and pings IndexNow (Bing/Yandex/DuckDuckGo,
which feed ChatGPT/Copilot). `sq deploy` additionally refuses to run on a dirty
tree and writes the deployed SHA into `../workspace/manifest.json`, so
`sq status` can tell you how far production has fallen behind git.

See `SEO.md` for the SEO/analytics setup and what still needs doing manually.

## Notes

- Hosting config: `functions/_middleware.ts` (apex → `www` 301), `functions/api/contact.ts`
  (contact form), `public/_headers` (cache), `public/_redirects`, `public/_routes.json`.
  DNS for synquanta.com is on Cloudflare (moved from Namecheap/Vercel 2026-11-13).
- Build-time prerendering is deliberate; route-level code splitting was
  deliberately **avoided** — don't reintroduce it without re-measuring mobile
  critical JS.
- `documents/` is gitignored (confidential client bid docs).
