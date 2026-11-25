# SUBMISSION PACK — Kane CLI Online Hackathon
Deadline: **Thu 26 Nov 2026, 23:59 IST = Fri 27 Nov 01:29 WIB.** One submission per team; updates allowed until the deadline. Submit via the "Submit your project →" form at kaneclihack.sh.

## Status (updated 25 Nov 2026, ~18:10 WIB)
- ✅ **DONE — TestMu AI account + Kane runs.** Registered with margarinx2000@gmail.com, credits claimed; Kane CLI authenticated via basic auth. The full scoring sequence has RUN:
  - **v1 run (evidence pack `evidence/2026-11-25T10-59-57-441Z`, commit dea2fa2):** invoice-total **FAILED** — Kane's assertion "Tax shows $9.00" failed; the app showed tax **$10.00** / grand total **$100.00** vs SPEC's $9.00 / **$99.00**. Lifecycle PASS, validation PASS. Loop verdict: FAIL — do not ship.
  - **Fix (commit 5d4fdb2):** one line in `computeTotals` — tax now computed on the discounted amount (`taxable`), per SPEC rule 4.
  - **Green re-run (evidence pack `evidence/2026-11-25T11-06-25-364Z`):** all 3 suites **PASS** (Subtotal $100.00 ✓, Discount −$10.00 ✓, Tax $9.00 ✓, Grand total $99.00 ✓). Loop verdict: PASS — verified, safe to ship. Credits used across all runs: ~230 of 11,200.
  - Run-environment notes for reproduction: Kane needs a real Chrome (`/usr/bin/google-chrome`, installed 25 Nov) and a proxy-bypass list without bracketed IPv6 entries (`NO_PROXY=localhost,127.0.0.1`) or its step runner dies with `Invalid port: ':1]'`.
- ⬜ **REMAINING — Create the public GitHub repo** `proofloop-invoicedesk` under margarinx2000 and push (commands below). No non-interactive authenticated GitHub route exists on the VM (no `gh` auth, no stored token) — this needs an interactive GitHub login by Mantri, or Mantri creates the empty repo and a token/session is provided.
- ⬜ **REMAINING — Record/upload the demo video** to YouTube (script below; 3–5 min).
- ⬜ **REMAINING — Post the two launch posts** (drafts below — X + Reddit/HN/LinkedIn; at least two are mandatory).
- ⬜ **REMAINING — Submit the form** with the fields below (2 minutes once the three above exist).

```bash
cd ~/workspace/kane-cli-entry
git remote add origin https://github.com/margarinx2000/proofloop-invoicedesk.git
git push -u origin main   # or: master, match the branch GitHub created
```

## Form fields (drafted, ready to paste)
- **Project name:** ProofLoop — InvoiceDesk, verified by Kane
- **One-liner:** A freelancer invoicing app that refuses to ship until Kane CLI verifies it in a real browser — wired into a closed agent loop.
- **Description:**
  InvoiceDesk is a working invoicing app (create invoices, line items, discount + tax, save, mark paid, live dashboard; zero dependencies, one command to run). Around it I built the thing the hackathon is really about: a closed verification loop. The coding agent writes code, `npm run verify` runs three Kane CLI suites (testmd, plain English, citing SPEC.md) against the app in a real Chrome, parses Kane's NDJSON into an evidence pack + verdict, and the agent reads the verdict and fixes what Kane caught before anything ships.
  Kane earned its keep immediately: SPEC.md says tax is charged on the discounted amount only (2 × $50, 10% discount, 10% tax = $99.00). V1 charged tax on the full subtotal and showed $100.00. The money suite caught it; the fix and the green re-run are both in the repo's evidence/ history.
- **Repo:** https://github.com/margarinx2000/proofloop-invoicedesk _(after step 2)_
- **Demo video:** _(YouTube URL after step 3)_
- **TestMu AI email:** margarinx2000@gmail.com
- **Launch posts:** _(URLs after step 4)_
- **Team:** Solo — Margarin (Indonesia)

## Demo video script (3–5 min)
1. (0:00) Title + one-liner. "Agents write code fast but can't check their own work. This is the loop that checks it."
2. (0:20) The app: create the Acme Studio invoice — 2 × $50, 10% discount, 10% tax. Show the totals.
3. (1:00) The spec: SPEC.md rule 4 on screen — tax after discount → $99.00.
4. (1:20) The loop: run `npm run verify` in the terminal. Kane drives a real Chrome; show the money suite FAILING on v1 ($100.00 vs $99.00) and the verdict landing in evidence/LATEST.md.
5. (2:20) The fix: show the one-line change in computeTotals (tax on the discounted amount). Commit it.
6. (2:45) Re-run `npm run verify` — all three suites green. Save the invoice, mark it paid, dashboard updates.
7. (3:40) Close: repo tour (tests/, evidence/), "build it with any agent — verify it with Kane."

## Launch post drafts
**Post 1 — X (@satuemrc, ≤280 chars):**
> I built InvoiceDesk for the @testmuai Kane CLI Hackathon — an invoicing app that refuses to ship until Kane verifies it in a real browser. Kane caught a real tax bug ($100.00 vs the spec's $99.00), I fixed it, Kane re-verified. Repo + demo in the replies 👇

**Post 2 — Reddit (r/SideProject) or Hacker News (Show HN):**
> Show HN: ProofLoop — an invoicing app that refuses to ship until Kane CLI verifies it
> I wired Kane CLI into my coding agent's loop: the agent writes code, `npm run verify` runs plain-English Kane suites against the app in a real Chrome, and the agent reads the NDJSON verdict and fixes what failed. First catch was a real money bug — tax charged before discount ($100.00 shown, $99.00 correct per spec). Fix + green re-run are in the repo's evidence folder. Zero-dependency app, one command to run. Repo: <link> · Demo: <link>
