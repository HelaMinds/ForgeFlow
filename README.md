# ForgeFlow

ForgeFlow is a structured AI-powered system that turns vague ideas into clear, actionable execution plans. It runs ideas through a multi-stage pipeline — **Clarifier → Planner → Stress Tester → Synthesizer** — so the output is practical, realistic, and aware of risks and uncertainty.

**Stack:** Next.js · Express · OpenAI GPT-4o · LangGraph

## Setup

```bash
git clone <repo-url>
cd helaminds
npm install
cp backend/.env.example backend/.env
```

Add your OpenAI API key to `backend/.env`:

```
OPENAI_API_KEY=your_key_here
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
