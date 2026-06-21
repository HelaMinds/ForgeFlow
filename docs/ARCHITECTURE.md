# ForgeFlow Architecture

## What it does

ForgeFlow converts a vague business or project idea into a structured, risk-aware execution roadmap. The user describes their idea in plain text; a four-agent AI pipeline turns that into phased plans, risk assessments, and strategic path options — all shaped by explicit answers the user provides rather than LLM guesses.

---

## System overview

```
Browser (Next.js)
    │
    │  HTTP (REST JSON)
    ▼
Express API (Node.js)
    │
    ├── /api/idea/clarify   → Clarifier agent
    ├── /api/idea/plan      → LangGraph pipeline (Planner → Stress Tester → Synthesizer)
    ├── /api/idea/apply-path → Path Adapter agent
    └── /api/idea/chat      → Plan Refiner agent
              │
              │  Structured JSON prompt
              ▼
         OpenAI GPT-4o
```

The frontend and backend are two separate packages (`frontend/`, `backend/`) with shared utilities in `shared/`.

---

## User flow

### Step 1 — Idea input (Home page `/`)

The user types a free-text idea and optionally picks an idea type:

| Type | Context |
|---|---|
| `startup` | Real market goals, funding, scale |
| `class_project` | Coursework deadlines, rubrics, demo-ready |
| `side_hustle` | Part-time, lean scope, low burn |

The frontend calls `POST /api/idea/clarify`. The Clarifier agent runs and the structured result is saved to `sessionStorage` (`forgeflow-clarify`). The user is routed to `/clarify`.

### Step 2 — Clarification (Clarify page `/clarify`)

The Clarifier's output is displayed: the idea summary, detected goals, known constraints, and 3–5 multiple-choice questions. The user selects one answer per question.

These answers shape the plan — the system will not guess on the user's behalf.

On submit, the frontend calls `POST /api/idea/plan` with the original idea, the clarified context, and the user's answers. The full LangGraph pipeline runs. The result is saved to `sessionStorage` (`forgeflow-result`) and the user is routed to `/result`.

### Step 3 — Result (Result page `/result`)

A multi-section page with a left sidebar for navigation:

| Section | Content |
|---|---|
| **Overview** | Plan title, summary, user answers, phase count, duration |
| **Pipeline** | Trace of all four agent outputs; reasoning details |
| **Timeline** | Step-by-step roadmap with tasks and milestones |
| **Your path** | 2–3 strategic path options the user can select and apply |
| **Risks** | Risk cards (severity + mitigation) and weak assumptions |
| **Start here** | Single concrete first action |

A persistent **chat panel** on the right lets the user refine the plan conversationally at any time.

---

## Backend agents

All agents call the same `runStructuredPrompt()` helper in `backend/services/llm.js`, which calls `gpt-4o` with `response_format: json_object` and `temperature: 0.4`. Every agent receives a system prompt defining its role and the expected JSON schema, and a user prompt with the current pipeline state.

### Clarifier (`backend/agents/clarifier.js`)

**Input:** raw idea text + optional idea type  
**Output:** `ClarifiedIdea`

```
{
  originalIdea, ideaType,
  summary,       // one sentence restatement
  goals,         // string[]
  constraints,   // string[] (includes idea type as first item if set)
  questions,     // 3-5 ClarifierQuestion objects
  openQuestions  // string[] (question texts)
}
```

Each question is always `type: "choice"` with 4–5 concrete, mutually exclusive options tailored to the idea (e.g. real competitor names, specific pricing tiers). Free-text questions are explicitly prohibited in the system prompt. If the LLM returns questions without valid options, `inferDefaultOptions()` fills them in as a fallback.

### Planner (`backend/agents/planner.js`)

**Input:** enriched `ClarifiedIdea` (with `userAnswers` merged into `constraints`)  
**Output:** `ExecutionPlan`

```
{
  overview,     // narrative summary
  phases,       // 5-8 PlanStep objects (order, title, description,
                //   timeframe, durationDays, tasks[], milestone)
  assumptions,  // string[] — gaps NOT already confirmed by user
  dependencies  // string[] — cross-phase dependencies
}
```

The system prompt explicitly instructs the agent to treat `userAnswers` as confirmed facts and not re-guess them. Budget, timeline, and skills stated by the user are respected directly.

### Stress Tester (`backend/agents/stressTest.js`)

**Input:** `ClarifiedIdea` + `ExecutionPlan`  
**Output:** `StressTestResult`

```
{
  risks,           // Risk[] — { title, description, severity: low|medium|high, mitigation }
  weakAssumptions, // string[] — gaps that remain after user answers
  failureModes     // string[]
}
```

The agent is instructed not to list user-confirmed answers as weak assumptions — it focuses adversarially on the remaining unknowns.

### Synthesizer (`backend/agents/synthesizer.js`)

**Input:** `ClarifiedIdea` + `ExecutionPlan` + `StressTestResult`  
**Output:** `FinalPlan`

```
{
  title,          // ≤8 words
  summary,        // ≤25 words
  overview,       // 2-3 sentence executive brief
  roadmap,        // 5-8 PlanStep[] (refined from planner phases)
  timeline,       // { totalDuration }
  pathOptions,    // 2-3 strategic paths: { id, title, description, tradeoffs }
  risks,          // merged from stressTest
  firstAction,    // single concrete first step
  confidenceNote  // honesty disclaimer
}
```

The synthesizer merges all prior agent outputs into the user-facing deliverable, personalizing it around the user's stated constraints.

### Path Adapter (`backend/agents/applyPath.js`)

**Input:** current plan context + selected path (`{ id, title }`)  
**Output:** updated `FinalPlan` + confirmation message

Reshapes the roadmap, timeline, tasks, and `firstAction` to match the chosen strategic path (e.g. Lean MVP → fewer phases, faster milestones; Feature-Rich Launch → longer timeline, broader feature tasks). `pathOptions` array is preserved unchanged.

### Plan Refiner (`backend/agents/planChat.js`)

**Input:** user chat message + current plan context + last 8 messages of conversation history  
**Output:** `{ reply, updates: { finalPlan?, clarified? } }`

Conversational agent that allows targeted edits to any part of the plan. Returns only the fields that changed — the frontend merges diffs onto the existing result. If the user changes answers, `clarified.userAnswers` is updated.

---

## LangGraph pipeline (`backend/graph/`)

The three core analysis agents (Planner, Stress Tester, Synthesizer) are wired into a sequential LangGraph `StateGraph`:

```
START → planner → stressTester → synthesizer → END
```

**State schema (`PipelineState`):**

```
idea, ideaType, clarified,
plan,           // set by plannerNode
stressTest,     // set by stressTesterNode
finalPlan,      // set by synthesizerNode
pipelineTrace   // array — each node appends a trace entry
```

`pipelineTrace` uses a custom reducer that concatenates arrays, so each node can append its trace without overwriting previous entries.

**Orchestration (`backend/graph/flow.js`):**

| Function | Description |
|---|---|
| `runClarify({ idea, ideaType })` | Runs Clarifier only; returns clarified + trace |
| `runPlanFromAnswers({ idea, answers, clarified })` | Merges answers into clarified, runs LangGraph pipeline, builds reasoning |
| `runForgeFlow(idea)` | Convenience: clarify + plan in one call (no user Q&A) |

`mergeAnswersIntoClarified()` converts the user's answer map into `userAnswers[]` and appends them to `constraints` so every downstream agent sees them as facts.

---

## Pipeline trace and reasoning

Each agent produces a trace entry (`buildXxxTrace()` in `backend/graph/pipelineTrace.js`):

```
{
  stage,    // 'clarifier' | 'planner' | 'stressTester' | 'synthesizer'
  agent,    // display name
  role,     // one-line description of what this agent does
  status,   // 'complete'
  summary,  // agent-specific summary string
  highlights // string[] — key counts (e.g. "5 phases planned")
}
```

`buildReasoning()` assembles a structured `reasoning` object from the clarifier snapshot and plan outputs. This powers the **Pipeline** section in the UI, showing the user exactly how the plan was derived.

---

## Frontend structure

```
frontend/
  app/
    page.js          # Home — idea input
    clarify/page.js  # Clarify — Q&A form
    result/page.js   # Result — full plan display
  components/
    InputBox         # Idea text input + idea type selector
    ClarifyForm      # Multiple-choice question form
    PipelineTrace    # Agent step visualization
    TimelineFlow     # Roadmap timeline
    PathDecisionPanel # Strategic path selector
    RiskCard         # Individual risk display
    ReasoningPanel   # Goals/constraints/assumptions breakdown
    PlanChatPanel    # Conversational plan editor
    ResultSidebar    # Section navigation
    ResultTopBar     # Plan title + metadata
    PlanHero / PlanOverview # Summary displays
    ResponsibleAiNotice     # AI disclaimer
  lib/
    api.js           # All fetch calls to backend
    planDisplay.js   # Formatting helpers
    questionUtils.js # Client-side question normalization
    reasoningUtils.js
```

State between pages is passed through `sessionStorage` — no server-side session or database. The result page handles in-place updates (path selection, chat) by re-saving to `sessionStorage` and re-rendering from local state.

---

## Data types (summary)

Defined in `shared/types.js` and validated by `shared/schemas.js`:

| Type | Key fields |
|---|---|
| `ClarifiedIdea` | `summary`, `goals[]`, `constraints[]`, `questions[]`, `userAnswers[]` |
| `ClarifierQuestion` | `id`, `text`, `type: 'choice'`, `options[]` |
| `ExecutionPlan` | `overview`, `phases[]`, `assumptions[]`, `dependencies[]` |
| `PlanStep` | `order`, `title`, `description`, `timeframe`, `durationDays`, `tasks[]`, `milestone` |
| `StressTestResult` | `risks[]`, `weakAssumptions[]`, `failureModes[]` |
| `Risk` | `title`, `description`, `severity: low\|medium\|high`, `mitigation` |
| `FinalPlan` | `title`, `summary`, `overview`, `roadmap[]`, `timeline`, `risks[]`, `pathOptions[]`, `firstAction`, `confidenceNote` |

---

## API endpoints

All routes under `POST /api/idea/`:

| Endpoint | Input | Output |
|---|---|---|
| `/clarify` | `{ idea, ideaType? }` | `{ idea, ideaType, clarified, pipelineTrace }` |
| `/plan` | `{ idea, answers, clarified? }` | Full pipeline result with `finalPlan`, `stressTest`, `reasoning`, `pipelineTrace` |
| `/apply-path` | `{ context, selectedPath }` | `{ message, finalPlan, selectedPath }` |
| `/chat` | `{ message, context, history? }` | `{ reply, updates }` |
| `/` | `{ idea }` | Same as `/plan` but skips user Q&A (auto-run) |

---

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), Tailwind CSS |
| Backend | Express.js, Node.js |
| Agent orchestration | LangGraph (`@langchain/langgraph`) |
| LLM | OpenAI GPT-4o (`gpt-4o`), `response_format: json_object` |
| Shared | Plain JS modules (`shared/`) |
| State persistence | Browser `sessionStorage` (no database) |
