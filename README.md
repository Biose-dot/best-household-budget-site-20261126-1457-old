# NestEgg — Household Budget Planner

[![make.fun](https://img.shields.io/badge/make.fun-bounty-1e4d3b)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![make.fun](https://img.shields.io/badge/make.fun-judged%20entry-c98a2e)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![make.fun](https://img.shields.io/badge/make.fun-offline%20site-2e7d5b)](https://make.fun/c/best-household-budget-site-20261126-1457)

**Entry for the [best household budget site bounty](https://make.fun/c/best-household-budget-site-20261126-1457) on make.fun.**

NestEgg is a household budget site that runs entirely in the browser from static files — no network, no account, no build step. Open `app/index.html` (or serve `app/` with any static server) and it works on desktop and on a phone.

## What it does

- **Dashboard** — November 2026 at a glance for the Rivera family: income $6,400, spending $5,145, savings rate 19.6%, a budget-health score, a spending donut, six months of income vs spending, a savings-rate gauge and a 50/30/20 breakdown.
- **Planner** — a fully interactive budget: edit any income line or expense category with sliders and number inputs and watch the totals, savings rate, health score and 50/30/20 bars re-balance live. Four what-if buttons test real changes (meal-plan groceries −$140, one takeaway night −$95, cancel two subscriptions −$32).
- **Households** — three real monthly budgets with full figures: the Rivera family (2 adults + 2 children), Maya Chen (single professional), and the Okafor retirees. Any of them loads into the Planner with one click.
- **Tracker** — a November spending log of 16 real purchases ($3,053.69), filterable by category, with a working add-a-purchase form.
- **Goals** — four savings goals (emergency fund, holiday, car, house deposit) with progress bars and a finish date for each.
- **Saving tips** — eight moves priced against the Rivera family's actual spending, worth about $450 a month, biggest saving first.

## Layout

- `app/` — the site: `index.html`, `style.css`, `data.js` (figures), `charts.js` (SVG charts), `views.js` (one function per page), `main.js` (router + interactions)
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`
- `screenshots/` — four real renders of the site (desktop dashboard, planner, households, phone tracker)
- `vendor/makefun-frontend.ts` — the kit's library, unchanged
- `serve.ts` — a tiny static server for local testing (`node serve.ts`, then http://localhost:8080)

## Run it

```sh
node serve.ts            # http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # build the hand-in
```

## License

SPDX-License-Identifier: MIT — see [LICENSE](LICENSE).
