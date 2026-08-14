# Daily News Report

Personal weekly briefing: Apple, Cursor, AI, tech, Hungary, and world items that actually matter. A Cursor cloud agent writes JSON; an Expo app reads it.

Product rules: [SPEC.md](SPEC.md). Reader filter: [PROFILE.md](PROFILE.md). Agent ops: [AGENTS.md](AGENTS.md).

## Layout

```
SPEC.md              Product source of truth
PROFILE.md           Who the brief is for
AGENTS.md            Cloud-agent operating notes
reports/             Issues the app loads (GitHub-as-CMS)
app/                 Expo React Native reader
```

## Reader app

```bash
cd app
npm install
npx expo start
```

Then open in iOS Simulator, Android emulator, or Expo Go.

Until a GitHub remote is configured, the app loads the bundled sample in `app/assets/reports/` (copied from `reports/`). To fetch live issues from the default branch of a **public** repo, set in `app/.env`:

```
EXPO_PUBLIC_FEED_BASE_URL=https://raw.githubusercontent.com/<owner>/<repo>/main
```

Restart Expo after changing env. For a private repo, keep the token out of git (EAS secrets) — see SPEC.md §9.

## Weekly cloud agent

1. Push this repo to GitHub and connect Cursor Cloud Agents.
2. Create a Cursor Automation: weekly cron `0 8 * * 1`, this repository, memories on, PR creation on.
3. Prompt: read SPEC.md and PROFILE.md; research the previous ISO week; write `reports/YYYY-Www.json`; update `reports/index.json`; open a PR; do not invent news.

The sample issue `2026-W33` is fixture copy for the UI. The first real run should add a new week (or replace the sample once you have live reporting).
