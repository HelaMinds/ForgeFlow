# Demo — Golden Path

This is the **pre-tested, scripted demo**. Run *this* idea with *these* answers so the
output is known and the API timing is predictable. Do not improvise the idea live —
judges remember a smooth 60 seconds, not a creative prompt that timed out.

## 0. Setup (before the call)

1. `npm run dev:backend` (port 4000)
2. `npm run dev:frontend` (port 3000)
3. Confirm an LLM key is set in `backend/.env` (e.g. `OPENAI_API_KEY` or `GOOGLE_API_KEY`).
4. Do **one full dry run** with the script below so responses are warm.

---

## 1. The idea (copy/paste exactly)

> An AI-powered revenue management SaaS for small independent hotels and restaurants
> that lack a dedicated revenue manager.

Idea type: **Startup**

## 2. Clarifier answers (choose exactly these)

The Clarifier returns choice questions. Pick the option closest to the text below — wording
may vary slightly per run, but the *intent* is fixed so the plan stays on the golden path.

| Question theme        | Choose                                |
| --------------------- | ------------------------------------- |
| Target market size    | **Under 10,000 potential customers**  |
| Pricing strategy      | **Under $10/month**                   |
| Competitors           | **Mix of incumbents and startups**    |
| MVP / launch scope    | **Integrations-first MVP**            |
| Timeline              | **Over 12 months**                    |
| Budget (if asked)     | **$1,000 – $10,000**                  |

Then click **Generate plan**. The plan cannot generate until these are selected — that is the
mandatory human gate, call it out.

## 3. What to point at on `/result` (the 60-second narrative)

1. **Overview** — concise title + executive overview + stats (type, phases, duration).
   "Six agents produced this, not one prompt."
2. **Pipeline tab** — Clarifier → Planner → Stress Tester → Synthesizer, each with a real
   summary. "This is the AI thinking, exposed."
3. **Risks tab** — risk cards + **weak assumptions** + **failure modes** from the adversarial
   Stress Tester. This is your Responsible AI beat.
4. **Decisions tab → apply a path** — pick **Lean MVP**, click apply. The roadmap visibly
   reshapes. Now reopen **Pipeline** — a **Path Adapter** entry appears under "Your refinements."
   "The system evolves with my decision — this isn't a wrapper."
5. **Plan chat** — type `Make the timeline more aggressive`. The reply shows an **Updated:
   timeline** badge, the sidebar jumps to Timeline, and a **Plan Refiner** entry is appended to
   the Pipeline trace.
6. **Export** (top bar) — download the plan as Markdown. "Decision value the user keeps."

## 4. Responsible AI line (say it out loud)

> "Every screen says *decision support, not advice*. The Stress Tester is adversarial — it
> challenges the plan's own assumptions but never treats the user's confirmed answers as weak.
> Plans are schema-validated before delivery, with a retry if validation fails."

---

## Backup idea (if you must)

> A side hustle: an online tutoring platform for high-school students in my city.

Idea type: **Side hustle**. Answers: small market, sub-$30/month, 2–3 essential features,
under 6 months, bootstrapped. Same demo beats apply.

## Reset between runs

Refresh the home page (`/`) — session storage is cleared on a new idea submission.
