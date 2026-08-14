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

The app fetches `reports/` from GitHub on open:

`https://raw.githubusercontent.com/Almos-Pal/Daily-news-report/main`

If the network fails, it uses cache, then the bundled copy in `app/assets/reports/`. Override the URL in `app/.env` if needed. Restart Expo after changing env.

## Weekly cloud agent

1. Push this repo to GitHub and connect Cursor Cloud Agents.
2. Create a Cursor Automation: weekly cron `0 8 * * 1`, this repository, memories on, PR creation on.
3. Prompt: read SPEC.md and PROFILE.md; research the previous ISO week; write `reports/YYYY-Www.json`; update `reports/index.json`; open a PR; do not invent news.

The sample issue `2026-W33` was replaced by the first live brief. Later weeks add new `reports/YYYY-Www.json` files.
