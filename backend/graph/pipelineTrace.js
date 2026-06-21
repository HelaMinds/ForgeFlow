const AGENT_META = {
  assessor: {
    agent: 'Assessor',
    role: 'Evaluate feasibility, risks, and framing before planning',
  },
  clarifier: {
    agent: 'Clarifier',
    role: 'Structure the vague idea into goals, constraints, and questions',
  },
  planner: {
    agent: 'Planner',
    role: 'Build phased execution plan from confirmed context',
  },
  stressTester: {
    agent: 'Stress Tester',
    role: 'Challenge assumptions and surface risks',
  },
  synthesizer: {
    agent: 'Synthesizer',
    role: 'Merge everything into a final actionable roadmap',
  },
  pathAdapter: {
    agent: 'Path Adapter',
    role: 'Reshape the roadmap to match the strategic path you chose',
  },
  planRefiner: {
    agent: 'Plan Refiner',
    role: 'Apply your conversational edits to the plan',
  },
};

function buildAssessorTrace(assessment) {
  return buildTraceEntry('assessor', {
    summary: assessment.recommendation || `Idea assessed with a ${assessment.verdict || 'completed'} verdict`,
    highlights: [
      assessment.verdict ? `Verdict: ${assessment.verdict.replaceAll('_', ' ')}` : null,
      `${assessment.concerns?.length || 0} concerns identified`,
      assessment.saferAlternative ? 'Safer alternative proposed' : null,
    ].filter(Boolean),
  });
}

function buildTraceEntry(stage, { summary, highlights = [] }) {
  const meta = AGENT_META[stage];

  return {
    stage,
    agent: meta.agent,
    role: meta.role,
    status: 'complete',
    summary,
    highlights,
  };
}

function buildClarifierTrace(clarified) {
  return buildTraceEntry('clarifier', {
    summary: clarified.summary || 'Idea structured for planning',
    highlights: [
      `${clarified.goals?.length || 0} goals identified`,
      `${clarified.constraints?.length || 0} constraints noted`,
      `${clarified.questions?.length || clarified.openQuestions?.length || 0} questions for you`,
    ].filter(Boolean),
  });
}

function buildPlannerTrace(plan) {
  return buildTraceEntry('planner', {
    summary: plan.overview || 'Execution phases drafted',
    highlights: [
      `${plan.phases?.length || 0} phases planned`,
      `${plan.assumptions?.length || 0} assumptions logged`,
      `${plan.dependencies?.length || 0} dependencies mapped`,
    ],
  });
}

function buildStressTesterTrace(stressTest) {
  return buildTraceEntry('stressTester', {
    summary: 'Plan stress-tested for weak spots',
    highlights: [
      `${stressTest.risks?.length || 0} risks flagged`,
      `${stressTest.weakAssumptions?.length || 0} weak assumptions`,
      `${stressTest.failureModes?.length || 0} failure modes`,
    ],
  });
}

function buildSynthesizerTrace(finalPlan) {
  return buildTraceEntry('synthesizer', {
    summary: finalPlan.title || finalPlan.summary || 'Final roadmap synthesized',
    highlights: [
      `${finalPlan.roadmap?.length || 0} roadmap steps`,
      `${finalPlan.pathOptions?.length || 0} strategic paths`,
      `${finalPlan.risks?.length || 0} risks in final plan`,
    ],
  });
}

function buildPathAdapterTrace(selectedPath, message) {
  return buildTraceEntry('pathAdapter', {
    summary: message || `Plan reshaped for the "${selectedPath?.title || 'selected'}" path.`,
    highlights: [selectedPath?.title ? `Path: ${selectedPath.title}` : null, 'Roadmap & first action updated'].filter(
      Boolean,
    ),
  });
}

function buildPlanRefinerTrace(userMessage, changed = []) {
  const summary = userMessage
    ? `Applied your request: “${userMessage}”`
    : 'Applied a conversational refinement.';

  return buildTraceEntry('planRefiner', {
    summary,
    highlights: changed.length ? changed.map((field) => `Updated ${field}`) : ['Plan refined'],
  });
}

const { normalizeReasoningList } = require('../../shared/reasoningUtils');

function buildReasoning({ clarifiedSnapshot, plan, stressTest }) {
  return {
    goals: normalizeReasoningList(clarifiedSnapshot.goals),
    constraints: normalizeReasoningList(clarifiedSnapshot.constraints),
    openQuestions: normalizeReasoningList(clarifiedSnapshot.openQuestions),
    questions: clarifiedSnapshot.questions || [],
    assumptions: normalizeReasoningList(plan?.assumptions),
    dependencies: normalizeReasoningList(plan?.dependencies),
    weakAssumptions: normalizeReasoningList(stressTest?.weakAssumptions),
    failureModes: normalizeReasoningList(stressTest?.failureModes),
  };
}

module.exports = {
  buildAssessorTrace,
  buildClarifierTrace,
  buildPlannerTrace,
  buildStressTesterTrace,
  buildSynthesizerTrace,
  buildPathAdapterTrace,
  buildPlanRefinerTrace,
  buildReasoning,
};
