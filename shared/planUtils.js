function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeRoadmapStep(step, index) {
  const tasks = Array.isArray(step.tasks)
    ? step.tasks.filter(isNonEmptyString).map((task) => task.trim())
    : [];

  return {
    order: typeof step.order === 'number' ? step.order : index + 1,
    title: isNonEmptyString(step.title) ? step.title.trim() : `Step ${index + 1}`,
    description: isNonEmptyString(step.description) ? step.description.trim() : '',
    timeframe: isNonEmptyString(step.timeframe) ? step.timeframe.trim() : '',
    durationDays:
      typeof step.durationDays === 'number' && step.durationDays > 0 ? step.durationDays : null,
    tasks,
    milestone: isNonEmptyString(step.milestone) ? step.milestone.trim() : '',
  };
}

function normalizeRoadmap(roadmap) {
  if (!Array.isArray(roadmap)) {
    return [];
  }

  return roadmap
    .map((step, index) => normalizeRoadmapStep(step, index))
    .sort((a, b) => a.order - b.order)
    .map((step, index) => ({ ...step, order: index + 1 }));
}

function inferTotalDuration(roadmap) {
  const totalDays = roadmap.reduce((sum, step) => sum + (step.durationDays || 0), 0);

  if (totalDays >= 365) {
    const months = Math.round(totalDays / 30);
    return `${months}+ months`;
  }

  if (totalDays >= 30) {
    const months = Math.round(totalDays / 30);
    return `${months} months`;
  }

  if (totalDays > 0) {
    return `${totalDays} days`;
  }

  const lastStep = roadmap[roadmap.length - 1];
  return lastStep?.timeframe || 'See steps below';
}

function normalizeTimeline(timeline, roadmap) {
  return {
    totalDuration: isNonEmptyString(timeline?.totalDuration)
      ? timeline.totalDuration.trim()
      : inferTotalDuration(roadmap),
    totalSteps: roadmap.length,
  };
}

function normalizeTitle(result, clarified) {
  if (isNonEmptyString(result.title) && result.title.length <= 80) {
    return result.title.trim();
  }

  if (isNonEmptyString(clarified?.summary) && clarified.summary.length <= 100) {
    return clarified.summary.trim();
  }

  if (isNonEmptyString(result.summary) && result.summary.length <= 80) {
    return result.summary.trim();
  }

  return '';
}

function normalizeFinalPlan(result, stressTest, clarified) {
  const roadmap = normalizeRoadmap(result.roadmap || []);
  const timeline = normalizeTimeline(result.timeline, roadmap);
  const title = normalizeTitle(result, clarified);

  return {
    title,
    summary: isNonEmptyString(result.summary) ? result.summary.trim() : '',
    overview: isNonEmptyString(result.overview) ? result.overview.trim() : '',
    roadmap,
    timeline,
    risks: result.risks || stressTest?.risks || [],
    firstAction: isNonEmptyString(result.firstAction) ? result.firstAction.trim() : '',
    confidenceNote: isNonEmptyString(result.confidenceNote) ? result.confidenceNote.trim() : '',
  };
}

module.exports = {
  normalizeRoadmap,
  normalizeTimeline,
  normalizeFinalPlan,
};
