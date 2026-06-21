# ForgeFlow

ForgeFlow is a structured AI-powered system that turns vague ideas into clear, actionable execution plans. Its five-agent pipeline — **Assessor → Clarifier → Planner → Stress Tester → Synthesizer** — is orchestrated with **LangGraph**. The output is practical, realistic, aware of risks, and resistant to manipulation.

**Stack:** Next.js · Express · OpenAI GPT-4o / Claude / Gemini · LangGraph

## Why ForgeFlow (pitch)

Most “AI planners” are a single prompt disguised as a product. ForgeFlow exposes its reasoning and enforces honest evaluation:

1. **Assessor** — critical gate that judges your idea across scope, feasibility, ethics, and market viability *before* planning. Catches vague/infeasible/unethical ideas early and offers concrete safer alternatives. Resistant to manipulation (e.g. demands for “only positive feedback”).
2. **Clarifier** — structures your idea, surfaces goals/constraints, and asks you targeted questions (human-in-the-loop).
3. **Planner** — builds phased execution steps from *your* confirmed answers.
4. **Stress Tester** — adversarially challenges assumptions and flags risks.
5. **Synthesizer** — merges everything into a roadmap plus strategic path options for you to choose.

The UI shows the pipeline trace, agent reasoning (assumptions, open questions, failure modes), assessment verdict and concerns, and a clear **”decision support, not advice”** disclaimer. You stay in control. No idea is blocked — a poor assessment just becomes visible.

## Setup

```bash
git clone https://github.com/HelaMinds/ForgeFlow.git
cd ForgeFlow
npm install
cp backend/.env.example backend/.env
```

Add your OpenAI API key to `backend/.env`:

```
OPENAI_API_KEY=your_key_here
```

Copy the frontend env file and set the backend URL to match `PORT` in `backend/.env`:

```bash
cp frontend/.env.example frontend/.env.local
```

## Run

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

Run individually if needed:

```bash
npm run dev:backend
npm run dev:frontend
```

## User flow

1. **Home** — pick idea type (startup / class project / side hustle) and describe your idea.
2. **Clarify** — see the Assessor's verdict and concerns. If the verdict is `proceed`, answer 3–5 clarification questions. If not (`caution`, `reframe`, `refuse_framing`), you can read the critique and decide to refine your idea or continue anyway.
3. **Result** — see the pipeline trace, agent reasoning, strategic path options, timeline, and risks.
