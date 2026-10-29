# dot / status

A one-page status dashboard concept for a **fictional** dot cloud worker and an
illustrative OpenAI-account panel. All numbers are hardcoded synthetic fixtures.
**Nothing is connected. This is not real monitoring or an OpenAI quota tool.**

[![Quality and Pages](https://github.com/newdarwindev/dot-status-demo/actions/workflows/quality-pages.yml/badge.svg)](https://github.com/newdarwindev/dot-status-demo/actions/workflows/quality-pages.yml)

**[Public live demo](https://newdarwindev.github.io/dot-status-demo/)** ·
**[Screenshots and test videos](https://newdarwindev.github.io/dot-status-demo/evidence/)** ·
**[CI runs and artifacts](https://github.com/newdarwindev/dot-status-demo/actions/workflows/quality-pages.yml)**

## Explore

Switch among **Healthy**, **Warning**, and **Degraded** examples. The page shows
fictional disk used/free (GB), uptime, completed tasks, queue depth, and illustrative
request/token allocations. Every scenario shares a clearly fixed sample timestamp.
Refresh returns to Healthy. The data-disclosure accordion explains the boundaries.
The layout works on desktop and mobile, supports keyboard interaction, uses labeled
progress bars and a polite status announcement, and respects reduced motion.

### Data and privacy boundary

- All values are invented in [`src/scenarios.js`](src/scenarios.js).
- No machine metrics, real accounts, quotas, credentials, private files, telemetry,
  or user information are read or included.
- “Demo units” and capacities are **not** real OpenAI limits, product quotas,
  pricing, or claims that an account-status API exists.
- No backend, API integration, sign-in, analytics, external fonts, browser storage,
  runtime dependencies, or external metric requests.
- Scenario controls only switch local fixtures. This app cannot detect an incident
  or report actual resource availability.

## Run and verify

Requires Node 22 or newer.

```sh
npm ci
npm run dev
# Full quality contract
npm run check
npx playwright install --with-deps chromium
npm run test:ui
npm run evidence
```

`npm run check` runs ESLint (zero warnings), Prettier, strict TypeScript `checkJs`,
focused Node unit tests, and the relative-path Vite production build. ESLint caps
cyclomatic complexity at **8**, nesting at **3**, parameters at **3**, and function
length at **55** nonblank/noncomment lines. See [AGENTS.md](AGENTS.md).

Real-browser Playwright tests cover all three scenarios on desktop Chromium and
mobile Chromium (Pixel 7 emulation), coherent labels and values, repeated clicks,
keyboard activation, opening and dismissing the disclosure, reload/reset,
horizontal overflow, no external requests, no browser storage, and JavaScript
errors. **Videos are recorded for every test, including passing tests.** These are
interaction tests with visual evidence, not pixel-baseline regression tests or a
complete accessibility audit. Mobile emulation is not a physical-device test.

## Publication and visual evidence

The SHA-pinned [GitHub Actions workflow](.github/workflows/quality-pages.yml) runs
checks and UI tests before publishing default-branch pushes to GitHub Pages. Pull
requests validate but do not deploy. Only the deploy job gets Pages/OIDC write
permissions. No repository secret is needed. The new repository's Pages source
must be **GitHub Actions**.

The public [evidence gallery](https://newdarwindev.github.io/dot-status-demo/evidence/)
contains videos and screenshots from the latest **successfully deployed** commit,
including its SHA. [`build.json`](https://newdarwindev.github.io/dot-status-demo/build.json)
identifies that exact deployed commit. The gallery needs no login and is replaced
on the next successful deployment; it is not evidence for newer failed runs.

For a specific run, open [Actions](https://github.com/newdarwindev/dot-status-demo/actions),
select the run and download **visual-evidence-RUN_ID**. The artifact includes
`test-results/` WebM recordings, screenshots, failure traces, and
`playwright-report/`. Open the HTML report with `npx playwright show-report`.
Uploads run even if UI tests fail; an infrastructure failure before browser startup
may have no video. Artifacts are retained for **14 days**; downloads generally
require a GitHub login. The public gallery persists until replaced.

No TUI is included. This uses the quality infrastructure from the public
[newdarwindev/public-demo-template](https://github.com/newdarwindev/public-demo-template),
with original synthetic dashboard content and no private source.
