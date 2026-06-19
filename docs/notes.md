# ForgeFlow Notes

## Pipeline Overview

1. **Clarifier** — Refines the raw user idea into goals, constraints, and open questions.
2. **Planner** — Produces a phased execution plan with assumptions and dependencies.
3. **Stress Tester** — Surfaces risks, weak assumptions, and failure modes.
4. **Synthesizer** — Merges all stages into a final roadmap with a first action.

## Development Notes

- Backend runs on port `4000` by default (`PORT` in `backend/.env`).
- Frontend proxies `/api/*` to the backend via `BACKEND_URL` in `frontend/.env.local`.
- Each agent should return structured JSON for predictable downstream parsing.
