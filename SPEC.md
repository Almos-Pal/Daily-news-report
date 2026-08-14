# Daily News Report — Product Specification

This file is the source of truth for the product. Cloud agents, later `AGENTS.md`, and the Expo app must follow it. Do not re-decide product questions in a weekly run.

**Language of this spec:** English (agents read it).
**Language of briefs:** mixed — see [Language](#language).

---

## 1. Vision and reader

A personal weekly briefing, not a news dump.

The reader wants to stay current on Apple, Cursor, AI, broader tech, and Hungary without scrolling all week. The brief should answer: *what happened that affects me, or that is genuinely useful to know?*

**“Affects me”** means:

- Devices and software the reader actually uses (Apple ecosystem, Cursor)
- Tools and platforms they build or work with (AI, developer tooling)
- Life in Hungary and the EU (policy, economy, infrastructure, culture that lands locally)
- World events with a real personal or practical impact (not every headline)

Personal filter details live in [PROFILE.md](PROFILE.md).

---

## 2. Cadence and beats

| Setting | Value |
|---------|--------|
| Cadence | Once a week |
| Default schedule | Monday morning, Europe/Budapest |
| Suggested cron | `0 8 * * 1` (08:00 Monday; Automations cron has no separate timezone field — set this so it fires at local Monday morning) |
| Coverage window | The previous calendar week (Monday–Sunday, Europe/Budapest), plus anything still unfolding that started earlier and materially changed this week |

**Beats (sections), in this order:**

| `id` | Title | What belongs here |
|------|--------|-------------------|
| `apple` | Apple | Hardware, software, services, App Store, privacy, developer APIs, rumors only if widely reported and labeled as rumor |
| `cursor` | Cursor | Product updates, models, cloud agents, automations, pricing, IDE/agent workflow news |
| `ai` | AI | Models, labs, regulation, notable research or product launches that a practitioner should know |
| `tech` | Tech | Broader technology that is not primarily Apple/Cursor/AI: platforms, security incidents, infrastructure, notable industry moves |
| `hungary` | Magyarország | Hungarian and Hungary-relevant EU news: politics, economy, society, culture, infrastructure — written in Hungarian |
| `world` | World | International/life events that affect the reader or are good to know; skip generic wire copy |

Do not add extra section ids in v1.

---

## 3. Language

| Section | Language |
|---------|----------|
| `apple`, `cursor`, `ai`, `tech`, `world` | English |
| `hungary` | Hungarian |
| Issue-level `title` and `tldr` | English (the TL;DR may mention Hungary in English; the Hungary section itself stays Hungarian) |

Rules:

- Set `language` on every section (`en` or `hu`).
- The Expo app renders text as stored. **No auto-translate.**
- Hungarian copy should be natural Hungarian, not machine-calqued English.
- Source titles may stay in the original language of the outlet.

---

## 4. Editorial rules

**Volume:** about **8–15 items total** across all sections. A quiet week can be shorter. Never pad.

**Every item must have:**

- `headline` — specific, not clickbait
- `summary` — 2–4 sentences of what actually happened
- `whyItMatters` — one or two sentences tying it to the reader (`PROFILE.md`)
- `sources` — at least one working URL with a publisher name

**Quality bar:**

- Do not invent news, quotes, dates, or product details.
- Prefer primary or reputable sources (vendor blogs, official docs, established outlets).
- For Hungary: prefer Hungarian outlets; if the claim is large (election, major law, market shock), corroborate with a second source.
- Label rumor, leak, and unconfirmed reports explicitly in the summary.
- Skip an empty section rather than filling it with weak items. Omit the section from `sections` if it has zero items.
- Do not repeat last week’s items unless there is a material new development. Read the previous issue and any agent memories first.
- Prefer “why this matters” over recapping the article. The reader can open the source.
- No conspiracy, no medical or legal advice, no paywalled scraping (link the public page; do not paste paywalled body text).

**Selection heuristic (in order):**

1. Directly affects the reader’s devices, tools, or Hungary/EU life
2. Genuinely useful to know this week (career, money, safety, civic)
3. Interesting but skippable — include only if the issue still has room

---

## 5. Repository layout

```
Daily-news-report/
├── SPEC.md                 # this file
├── PROFILE.md              # personal filter
├── AGENTS.md               # cloud-agent operating notes
├── reports/
│   ├── index.json          # manifest of issues, newest first
│   └── YYYY-Www.json       # one issue per ISO week
├── reports-md/             # optional human-readable archive
└── app/                    # Expo React Native reader
```

ISO week id format: `YYYY-Www` (e.g. `2026-W33`). Use ISO week-numbering (weeks start Monday). The file name must match `id`.

---

## 6. Report JSON schema

### 6.1 Issue file — `reports/YYYY-Www.json`

```json
{
  "id": "2026-W33",
  "weekStart": "2026-08-10",
  "weekEnd": "2026-08-16",
  "generatedAt": "2026-08-17T06:12:00.000Z",
  "title": "Week 33: Apple intelligence, Cursor automations, and a quiet Budapest week",
  "tldr": "Two sentences in English covering the whole issue.",
  "sections": [
    {
      "id": "apple",
      "title": "Apple",
      "language": "en",
      "items": [
        {
          "headline": "Specific headline",
          "summary": "What happened.",
          "whyItMatters": "Why the reader should care.",
          "sources": [
            { "name": "Apple Newsroom", "url": "https://www.apple.com/newsroom/..." }
          ],
          "tags": ["ios", "privacy"]
        }
      ]
    }
  ]
}
```

**Issue fields**

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `id` | string | yes | `YYYY-Www`, matches filename |
| `weekStart` | string | yes | Monday date `YYYY-MM-DD` (Europe/Budapest) |
| `weekEnd` | string | yes | Sunday date `YYYY-MM-DD` |
| `generatedAt` | string | yes | ISO-8601 UTC timestamp |
| `title` | string | yes | English, one line |
| `tldr` | string | yes | English, 1–3 sentences |
| `sections` | array | yes | Only sections that have at least one item, in beat order |

**Section fields**

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `id` | string | yes | One of: `apple`, `cursor`, `ai`, `tech`, `hungary`, `world` |
| `title` | string | yes | Display title. Hungary section title is `Magyarország` |
| `language` | string | yes | `en` or `hu` |
| `items` | array | yes | Non-empty |

**Item fields**

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `headline` | string | yes | |
| `summary` | string | yes | |
| `whyItMatters` | string | yes | |
| `sources` | array | yes | At least one `{ "name", "url" }` |
| `tags` | string[] | no | Lowercase, short, optional |

Do not add extra top-level keys in v1. Unknown keys in a future issue should be ignored by the app, not crash it.

### 6.2 Manifest — `reports/index.json`

```json
{
  "latest": "2026-W33",
  "issues": [
    {
      "id": "2026-W33",
      "weekStart": "2026-08-10",
      "weekEnd": "2026-08-16",
      "title": "Week 33: …",
      "path": "reports/2026-W33.json"
    }
  ]
}
```

| Field | Notes |
|-------|--------|
| `latest` | `id` of the newest issue |
| `issues` | Newest first. Include every published issue. |

After writing a new issue file, **always** update `index.json` in the same commit.

---

## 7. Cloud agent runbook

The weekly job is a **Cursor Automation** that starts a **cloud agent** against **this repository** (single-repo, not no-repo). No-repo mode cannot write files or open PRs.

### 7.1 Trigger and tools

- **Trigger:** weekly cron (Monday morning, Europe/Budapest intent; see cadence above)
- **Repo:** this repo, default branch
- **Required capabilities:** web search and/or browser (computer use), git, pull request creation
- **Memories:** enabled — remember already-covered stories, source preferences, and taste notes across runs
- **Optional later:** Slack notification (out of scope for v1)

### 7.2 Each run

1. Read `SPEC.md` and `PROFILE.md` (if present).
2. Read `reports/index.json` and the previous issue (if any). Skip or update items already covered unless there is a material new development.
3. Read agent memories for “already covered” and editorial taste.
4. Research the coverage window for each beat. Use live web search / browser. Do not rely on training cutoff.
5. Select 8–15 items using the editorial rules.
6. Write `reports/YYYY-Www.json` with valid JSON matching this schema.
7. Update `reports/index.json` (`latest` + prepend to `issues`).
8. Optionally write a markdown mirror under `reports-md/YYYY-Www.md` for humans reading on GitHub. The app consumes JSON only.
9. Open a pull request. Title: `Weekly brief YYYY-Www`. Body: the issue `tldr` plus a bullet list of section ids included.
10. Do not merge the PR. The owner reviews.

If research fails for a beat, omit that section and note it in the PR body. Never fabricate items to keep a section.

### 7.3 PR quality bar

Open a PR only when:

- JSON parses
- `id` matches the filename and ISO week of the coverage window
- every item has at least one `https://` source URL
- `index.json` lists the new issue first and `latest` matches
- language rules are respected (`hungary` is Hungarian; other sections English)

If there is truly nothing new (unlikely), still produce an issue with a short `tldr` explaining a quiet week and whatever items exist. Do not skip the run silently.

### 7.4 Prompt sketch (for the Automation)

Use this intent when configuring the Automation (paraphrase, do not invent a second spec):

> Read SPEC.md and PROFILE.md. Produce this week’s brief for the previous ISO week (Europe/Budapest). Research Apple, Cursor, AI, tech, Hungary, and world-that-affects-the-reader. Write reports/YYYY-Www.json and update reports/index.json. Follow the schema and editorial rules in SPEC.md. Open a PR. Do not invent news.

---

## 8. Expo app (this repo)

The reader app lives in `app/`. It is a magazine-style client, not a social network.

### 8.1 Screens

| Screen | Behavior |
|--------|----------|
| Home | Current week (`index.json` → `latest`). Show `title`, `tldr`, then sections in spec order. |
| Archive | Past weeks from `index.json`, newest first. Tap opens that issue. |
| Issue | Same layout as Home for a chosen week. |
| Item | Headline, summary, why it matters, source links (open in the system browser). |

### 8.2 Behavior

- Render mixed language as stored. No translate button in v1.
- Pull to refresh re-fetches `index.json` and the displayed issue.
- Offline: cache the last successfully fetched `index.json` and latest issue. Show a stale indicator if the cache is older than 8 days.
- Empty/missing section: do not show a heading for it.
- Unknown future JSON fields: ignore.
- Invalid JSON: show an error and keep the last good cache if any.

### 8.3 Visual bar (v1)

- Readable typography, dark mode, Apple-like density (comfortable, not a tweet feed).
- Section labels use the JSON `title` (so Hungary appears as `Magyarország`).
- Do not require accounts.

---

## 9. How the app gets data (v1 — GitHub-as-CMS)

No custom API server in v1. The repo **is** the CMS.

1. Cloud agent merges (or the owner merges the PR) so `reports/` is on the default branch.
2. The app fetches `reports/index.json`, then the issue file in `path`.

**Public repo:** fetch raw files, for example:

`https://raw.githubusercontent.com/<owner>/<repo>/<branch>/reports/index.json`

**Private repo:** ship a read-only GitHub token via EAS secrets / Expo extra; fetch via the GitHub Contents API. Do not commit tokens.

Until a remote exists, the app may load bundled sample JSON from `reports/` for local development.

v1 constraint: **do not add Firebase, Supabase, or a custom backend** until this GitHub-as-CMS path is shipping.

---

## 10. Out of scope for v1

- Push notifications
- Daily (or more frequent) cadence
- Auto-translate
- Paywalled scraping
- Social features, comments, accounts
- Custom API server or third-party BaaS
- Slack/email delivery (optional later)
- Recommender / personalization beyond `PROFILE.md` and memories
- Extra section ids or a second JSON schema

---

## 11. Setup checklist

Do these in order when implementing after this spec:

1. Push this repo to GitHub and connect it to Cursor Cloud Agents.
2. Edit `PROFILE.md` with anything more specific (city, “never cover”, devices).
3. `AGENTS.md` is in place — keep editorial rules in SPEC.md only.
4. Sample `reports/` issue + `index.json` ships so the app renders without a live agent run.
5. Expo app lives in `app/` and reads the schema in this file.
6. Create a Cursor Automation: weekly cron, **this repo**, memories on, PR creation on, prompt from §7.4 (or `.cursor/commands/weekly-brief.md`).
7. Run once manually, review the PR, then leave the schedule on.

---

## 12. Companion files

| File | Role |
|------|------|
| `SPEC.md` | Product, editorial, schema, agent, app |
| `PROFILE.md` | Personal filter |
| `AGENTS.md` | Cloud VM / repo operating notes |
| `reports/*.json` | Issues produced by the agent (plus a UI fixture) |
| `app/` | Expo React Native reader |
