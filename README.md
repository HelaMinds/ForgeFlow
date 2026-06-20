# ForgeFlow

ForgeFlow is a structured AI-powered system that turns vague ideas into clear, actionable execution plans. It runs ideas through a **multi-agent pipeline** — **Clarifier → Planner → Stress Tester → Synthesizer** — orchestrated with **LangGraph**, so the output is practical, realistic, and aware of risks and uncertainty.

**Stack:** Next.js · Express · OpenAI GPT-4o · LangGraph

## Why ForgeFlow (pitch)

Most “AI planners” are a single prompt disguised as a product. ForgeFlow exposes its reasoning:

1. **Clarifier** — structures your idea, surfaces goals/constraints, and asks you targeted questions (human-in-the-loop).
2. **Planner** — builds phased execution steps from *your* confirmed answers.
3. **Stress Tester** — adversarially challenges assumptions and flags risks.
4. **Synthesizer** — merges everything into a roadmap plus strategic path options for you to choose.

The UI shows the pipeline trace, agent reasoning (assumptions, open questions, failure modes), and a clear **“decision support, not advice”** disclaimer. You stay in control.

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
2. **Clarify** — answer 3–5 agent-generated questions (your decisions shape the plan).
3. **Result** — see the LangGraph pipeline trace, agent reasoning, path options, timeline, and risks.
