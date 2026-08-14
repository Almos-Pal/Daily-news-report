# AGENTS.md

Operational notes for cloud agents in this repo. Editorial rules, schema, and product decisions live in [SPEC.md](SPEC.md). Do not fork them here.

## What this repo is

A weekly personal news brief. You research the previous ISO week (Europe/Budapest), write JSON under `reports/`, update `reports/index.json`, and open a PR. An Expo app in `app/` reads that JSON. You do not need to run or change the app unless the schema in SPEC.md changed (it should not, in a normal weekly run).

## Read first

1. [SPEC.md](SPEC.md) — product, beats, language, schema, runbook
2. [PROFILE.md](PROFILE.md) — who the reader is
3. `reports/index.json` and the previous issue file
4. Agent memories (already covered, taste)

## Write these files

| Path | Action |
|------|--------|
| `reports/YYYY-Www.json` | New issue. `id` must match the filename. |
| `reports/index.json` | Set `latest`, prepend the issue (newest first). Same commit. |
| `reports-md/YYYY-Www.md` | Optional markdown mirror. App ignores this. |

Do not edit `SPEC.md`, `PROFILE.md`, or `app/` on a weekly run.

## JSON

- Validate by parsing. Pretty-print with 2-space indent and a trailing newline.
- Section order: `apple`, `cursor`, `ai`, `tech`, `hungary`, `world`. Omit empty sections.
- `hungary.language` is `hu`; everything else `en`.
- Every item needs at least one `https://` source URL.
- ISO week, `weekStart` (Monday), `weekEnd` (Sunday) in Europe/Budapest.

## Research

Use live web search and the browser. Training data is not a source. Do not invent news. If a beat yields nothing solid, omit the section and mention it in the PR body.

## PR

- Title: `Weekly brief YYYY-Www`
- Body: issue `tldr`, then a bullet list of section ids included
- Do not merge

## Environment

No install, tests, or secrets are required to write a brief. Node is only needed if you touch the Expo app (out of band).

Sample/fixture issue `reports/2026-W33.json` is for UI development. Replace or supersede it with a real week when you have live reporting; do not treat fixture copy as already-covered news.
