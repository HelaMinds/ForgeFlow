# ForgeFlow

ForgeFlow is a structured AI-powered system that helps users turn vague ideas into clear, actionable execution plans.

Instead of simply generating answers, it guides users through a step-by-step reasoning pipeline where their idea is first clarified, then broken into a structured plan, stress-tested for risks and weak assumptions, and finally refined into a realistic roadmap with concrete next steps. The system uses a multi-stage LLM workflow to simulate different reasoning roles, ensuring that the output is not just informative but practical, realistic, and aware of uncertainty.

---

## Problem

People often have ideas but struggle to:

- Turn them into structured plans
- Understand risks and assumptions
- Know what to do first

Most AI tools generate ideas, but don't help with real execution clarity.

---

## Solution

ForgeFlow uses a structured LLM-based pipeline to:

- Clarify user ideas with targeted questions
- Build execution roadmaps
- Identify risks and weak assumptions
- Stress-test plans using adversarial reasoning
- Generate first actionable steps

---

## How It Works

Each stage focuses on a specific reasoning step instead of a single AI response.

```
User Idea → Clarifier → Planner → Stress Tester → Synthesizer → Final Plan
```

| Stage | Role |
|-------|------|
| **Clarifier** | Asks targeted questions to sharpen vague ideas into well-defined goals |
| **Planner** | Breaks the clarified idea into a structured execution plan |
| **Stress Tester** | Challenges assumptions and surfaces risks through adversarial reasoning |
| **Synthesizer** | Refines everything into a realistic roadmap with concrete next steps |

---

## Output

- Structured execution plan
- Risk analysis
- Confidence-based recommendations
- Step-by-step roadmap
- First action to start immediately

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js / Express
- **AI:** OpenAI GPT-4o
- **Orchestration:** LangGraph (multi-stage workflow)

---

## Responsible AI

ForgeFlow does not decide if an idea is good or bad. It helps users explore options, risks, and tradeoffs so they can make their own decisions.

---

## Goal

Help users move from **idea → clarity → execution** using structured AI reasoning.

---

## Project Structure

```
forgeflow/
│
├── frontend/              # Next.js UI
│   ├── app/
│   ├── components/
│   └── lib/
│
├── backend/               # API + LangGraph logic
│   ├── agents/
│   ├── routes/
│   ├── services/
│   ├── graph/
│   └── server.js
│
├── shared/                # Shared types/schemas
│
├── docs/                  # Notes + demo + prompts
│
├── README.md
└── package.json
```

### Backend

```
backend/
├── agents/
│   ├── clarifier.js
│   ├── planner.js
│   ├── stressTest.js
│   └── synthesizer.js
├── routes/
│   └── idea.js
├── graph/
│   └── flow.js
└── server.js
```

### Frontend

```
frontend/
├── app/
│   ├── page.js
│   └── result/page.js
├── components/
│   ├── InputBox.js
│   ├── PlanCard.js
│   └── RiskCard.js
└── lib/
    └── api.js
```

---

## Getting Started

1. Install dependencies: `npm install`
2. Copy `backend/.env.example` to `backend/.env` and add your OpenAI API key
3. Run both apps: `npm run dev`
4. Open `http://localhost:3000`
