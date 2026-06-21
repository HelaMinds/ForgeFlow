const { Annotation, StateGraph, START, END } = require('@langchain/langgraph');
const { createPlan } = require('../agents/planner');
const { stressTestPlan } = require('../agents/stressTest');
const { synthesizePlan } = require('../agents/synthesizer');
const { validateFinalPlan } = require('../../shared/schemas');
const {
  buildPlannerTrace,
  buildStressTesterTrace,
  buildSynthesizerTrace,
} = require('./pipelineTrace');

const PipelineState = Annotation.Root({
  idea: Annotation({ default: () => '' }),
  ideaType: Annotation({ default: () => null }),
  clarified: Annotation({ default: () => null }),
  plan: Annotation({ default: () => null }),
  stressTest: Annotation({ default: () => null }),
  finalPlan: Annotation({ default: () => null }),
  pipelineTrace: Annotation({
    reducer: (left, right) => left.concat(Array.isArray(right) ? right : [right]),
    default: () => [],
  }),
});

async function plannerNode(state) {
  const plan = await createPlan(state.clarified);

  return {
    plan,
    pipelineTrace: [buildPlannerTrace(plan)],
  };
}

async function stressTesterNode(state) {
  const stressTest = await stressTestPlan({
    clarified: state.clarified,
    plan: state.plan,
  });

  return {
    stressTest,
    pipelineTrace: [buildStressTesterTrace(stressTest)],
  };
}

async function synthesizerNode(state) {
  const input = {
    clarified: state.clarified,
    plan: state.plan,
    stressTest: state.stressTest,
  };

  let finalPlan = await synthesizePlan(input);

  // Schema gate: if the synthesizer returns an incomplete plan, retry once
  // before delivering it to the user.
  if (!validateFinalPlan(finalPlan)) {
    console.warn('[pipeline] synthesizer output failed validation — retrying once');
    finalPlan = await synthesizePlan(input);
  }

  return {
    finalPlan,
    pipelineTrace: [buildSynthesizerTrace(finalPlan)],
  };
}

const planGraph = new StateGraph(PipelineState)
  .addNode('planner', plannerNode)
  .addNode('stressTester', stressTesterNode)
  .addNode('synthesizer', synthesizerNode)
  .addEdge(START, 'planner')
  .addEdge('planner', 'stressTester')
  .addEdge('stressTester', 'synthesizer')
  .addEdge('synthesizer', END)
  .compile();

async function runPlanPipeline({ idea, ideaType, clarified }) {
  const result = await planGraph.invoke({
    idea,
    ideaType,
    clarified,
    pipelineTrace: [],
  });

  return {
    plan: result.plan,
    stressTest: result.stressTest,
    finalPlan: result.finalPlan,
    pipelineTrace: result.pipelineTrace,
  };
}

module.exports = {
  runPlanPipeline,
};
