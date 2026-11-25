# ProofLoop · InvoiceDesk

**An invoicing app that refuses to ship until Kane CLI verifies it.**

InvoiceDesk is a small, real invoicing tool for freelancers — create an
invoice, add line items, apply discount and tax, save it, mark it paid, watch
the dashboard. It runs end to end with one command and zero dependencies.

What makes it a hackathon entry is not the app. It is the loop around it:

```
        ┌──────────────────────────────────────────────────┐
        │                                                  │
        ▼                                                  │
  agent writes code ──► npm run verify ──► Kane CLI drives a real
        ▲                     │            Chrome through the flows
        │                     │            in tests/*_test.md
        │                     ▼
        └──── agent reads evidence/LATEST.md ◄── NDJSON evidence pack
              and fixes what Kane caught            + pass/fail verdict
```

- **Ships** — the app works end to end: `npm start`, open
  http://localhost:4173, invoice someone.
- **Verified** — three Kane suites (`tests/`) check the money math against
  `SPEC.md`, the full create → save → mark-paid lifecycle, and the
  validation guard rails. The tests cite the spec; if app and spec disagree,
  the spec wins.
- **Closed loop** — `scripts/verify-loop.mjs` runs every suite with
  `kane-cli testmd run --agent`, parses Kane's NDJSON stream, writes an
  evidence pack to `evidence/<timestamp>/` and a verdict to
  `evidence/LATEST.md`, and exits non-zero on any failure. The agent reads
  the verdict, fixes the code, and runs the loop again. Nothing ships on a
  red verdict.

## The bug Kane was hired to catch

`SPEC.md` rule 4: *tax is charged on the discounted amount only.*
2 × $50.00 with 10% discount and 10% tax must total **$99.00**
(tax $9.00 on the discounted $90.00).

InvoiceDesk v1 charged tax on the full pre-discount subtotal and showed
**$100.00** (tax $10.00) — see `evidence-app-filled.png`, a screenshot of v1
doing exactly that in a real browser. `tests/invoice-total_test.md` exists
to catch precisely this. The loop's run history lives under `evidence/`.

## Run it

```bash
npm start            # http://localhost:4173  (Node 18+, no dependencies)
npm run verify       # start the app if needed, run all Kane suites, verdict → evidence/LATEST.md
```

Kane CLI setup (one time): register at testmuai.com (10,000 free credits),
then `npm install -g @testmuai/kane-cli` and `kane-cli login`, or pass
`--username/--access-key`. Judges: no login or paid service is needed to run
the app itself; the Kane suites need a free TestMu AI account.

## Layout

- `server.js` — zero-dependency static server (`/health` for the loop)
- `public/index.html` — the whole app (invoices persist in localStorage)
- `SPEC.md` — the money + behaviour rules the tests cite
- `tests/*_test.md` — Kane CLI suites in plain English
- `scripts/verify-loop.mjs` — the closed loop: run, parse, verdict, evidence
- `evidence/` — every loop run's NDJSON + verdict

Built solo with an AI coding agent for the Kane CLI Online Hackathon
(TestMu AI). Repo initialized 25 November 2026, inside the event window.
