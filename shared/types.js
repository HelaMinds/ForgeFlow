/**
 * @typedef {Object} UserAnswer
 * @property {string} question
 * @property {string} answer
 */

/**
 * @typedef {Object} ClarifiedIdea
 * @property {string} originalIdea
 * @property {string} summary
 * @property {string[]} goals
 * @property {string[]} constraints
 * @property {string[]} openQuestions
 * @property {UserAnswer[]} [userAnswers]
 */

/**
 * @typedef {Object} PlanStep
 * @property {string} title
 * @property {string} description
 * @property {string} timeframe
 */

/**
 * @typedef {Object} ExecutionPlan
 * @property {string} overview
 * @property {PlanStep[]} phases
 * @property {string[]} assumptions
 * @property {string[]} dependencies
 */

/**
 * @typedef {Object} Risk
 * @property {string} title
 * @property {string} description
 * @property {'low' | 'medium' | 'high'} severity
 * @property {string} mitigation
 */

/**
 * @typedef {Object} StressTestResult
 * @property {Risk[]} risks
 * @property {string[]} weakAssumptions
 * @property {string[]} failureModes
 */

/**
 * @typedef {Object} FinalPlan
 * @property {string} summary
 * @property {PlanStep[]} roadmap
 * @property {Risk[]} risks
 * @property {string} firstAction
 * @property {string} confidenceNote
 */

/**
 * @typedef {Object} PipelineState
 * @property {string} idea
 * @property {ClarifiedIdea} [clarified]
 * @property {ExecutionPlan} [plan]
 * @property {StressTestResult} [stressTest]
 * @property {FinalPlan} [finalPlan]
 */

module.exports = {};
