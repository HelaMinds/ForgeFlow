# ForgeFlow Notes

## Pipeline Overview

1. **Clarifier** — Refines the raw user idea into goals, constraints, and open questions.
2. **Planner** — Produces a phased execution plan with assumptions and dependencies.
3. **Stress Tester** — Surfaces risks, weak assumptions, and failure modes.
4. **Synthesizer** — Merges all stages into a final roadmap with a first action.

## Development Notes

- Backend runs on port `4000` by default.
- Frontend expects the API at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000`).
- Each agent should return structured JSON for predictable downstream parsing.
