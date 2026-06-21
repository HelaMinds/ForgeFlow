'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ResultTopBar from '../../components/ResultTopBar';
import PlanHero from '../../components/PlanHero';
import PlanOverview from '../../components/PlanOverview';
import PipelineTrace from '../../components/PipelineTrace';
import PathSummaryCard from '../../components/PathSummaryCard';
import ResponsibleAiNotice from '../../components/ResponsibleAiNotice';
import ResultSidebar from '../../components/ResultSidebar';
import PlanChatPanel from '../../components/PlanChatPanel';
import TimelineFlow from '../../components/TimelineFlow';
import RiskCard from '../../components/RiskCard';
import { getIdeaTypeLabel } from '../../lib/api';
import { normalizeReasoningList } from '../../lib/reasoningUtils';

const PATH_STORAGE_KEY = 'forgeflow-path-choice';
const RESULT_STORAGE_KEY = 'forgeflow-result';

function SectionIntro({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      {description ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
    </div>
  );
}

const CHANGE_SECTION = {
  timeline: 'timeline',
  'first action': 'next',
  risks: 'risks',
  'path options': 'overview',
  overview: 'overview',
  summary: 'overview',
  title: 'overview',
  'your answers': 'overview',
};

function sectionForChange(changed) {
  if (!Array.isArray(changed)) {
    return null;
  }

  for (const field of changed) {
    if (CHANGE_SECTION[field]) {
      return CHANGE_SECTION[field];
    }
  }

  return null;
}

function buildSections(result) {
  if (!result) {
    return [];
  }

  const { finalPlan, pipelineTrace, reasoning, stressTest } = result;
  const hasPipeline = (pipelineTrace?.length ?? 0) > 0;
  const hasReasoning =
    reasoning &&
    normalizeReasoningList([
      ...(reasoning.goals || []),
      ...(reasoning.constraints || []),
      ...(reasoning.assumptions || []),
      ...(reasoning.dependencies || []),
      ...(reasoning.weakAssumptions || []),
    ]).length > 0;
  const hasRisks = (finalPlan.risks?.length ?? 0) > 0;
  const hasWeakAssumptions = normalizeReasoningList(stressTest?.weakAssumptions).length > 0;
  const hasFailureModes = normalizeReasoningList(stressTest?.failureModes).length > 0;

  return [
    { id: 'overview', label: 'Overview' },
    hasPipeline || hasReasoning ? { id: 'pipeline', label: 'Pipeline' } : null,
    { id: 'timeline', label: 'Timeline' },
    hasRisks || hasWeakAssumptions || hasFailureModes ? { id: 'risks', label: 'Risks' } : null,
    { id: 'next', label: 'Start here' },
  ].filter(Boolean);
}

export default function ResultPage() {
  const [result, setResult] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [pathApplyMessage, setPathApplyMessage] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  const sections = useMemo(() => buildSections(result), [result]);

  useEffect(() => {
    const stored = sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setResult(parsed);
      if (parsed.finalPlan?.selectedPath) {
        setSelectedPath(parsed.finalPlan.selectedPath);
      }
    }

    const storedPath = sessionStorage.getItem(PATH_STORAGE_KEY);
    if (storedPath) {
      setSelectedPath(JSON.parse(storedPath));
    }

    const storedPathMessage = sessionStorage.getItem('forgeflow-path-message');
    if (storedPathMessage) {
      setPathApplyMessage(storedPathMessage);
    }
  }, []);

  useEffect(() => {
    if (sections.length && !sections.some((section) => section.id === activeSection)) {
      setActiveSection(sections[0].id);
    }
  }, [sections, activeSection]);

  function persistResult(nextResult) {
    setResult(nextResult);
    sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(nextResult));
  }

  function handlePathSelect(path) {
    setSelectedPath(path);
    sessionStorage.setItem(PATH_STORAGE_KEY, JSON.stringify(path));
  }

  function handlePlanUpdate(payload) {
    if (!result) {
      return;
    }

    const updates = payload?.updates || {};

    const nextResult = {
      ...result,
      finalPlan: updates.finalPlan || result.finalPlan,
      clarified: updates.clarified
        ? { ...result.clarified, ...updates.clarified }
        : result.clarified,
      pipelineTrace: payload?.traceEntry
        ? [...(result.pipelineTrace || []), payload.traceEntry]
        : result.pipelineTrace,
    };

    persistResult(nextResult);

    if (updates.finalPlan?.pathOptions?.length === 1) {
      handlePathSelect(updates.finalPlan.pathOptions[0]);
    }

    const target = sectionForChange(payload?.changed);
    if (target) {
      setActiveSection(target);
    }
  }

  if (!result) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <div className="card p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">No result found.</p>
          <Link href="/" className="btn-primary mt-5 inline-flex">
            Start over
          </Link>
        </div>
      </main>
    );
  }

  const { idea, finalPlan, clarified, stressTest, reasoning, pipelineTrace } = result;
  const ideaTypeLabel = clarified.ideaType ? getIdeaTypeLabel(clarified.ideaType) : null;
  const userAnswers = clarified.userAnswers || [];
  const phaseCount = finalPlan.roadmap?.length || 0;
  const totalDuration = finalPlan.timeline?.totalDuration;

  const firstPhase = finalPlan.roadmap?.[0] || null;
  const firstWeekTasks = Array.isArray(firstPhase?.tasks) ? firstPhase.tasks.slice(0, 5) : [];
  const validateItems = (() => {
    const weak = normalizeReasoningList(stressTest?.weakAssumptions);
    if (weak.length) {
      return weak.slice(0, 4);
    }
    return (finalPlan.risks || [])
      .slice(0, 3)
      .map((risk) => risk?.title)
      .filter(Boolean);
  })();

  return (
    <div className="flex min-h-screen flex-col">
      <ResultTopBar finalPlan={finalPlan} clarified={clarified} idea={idea} />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 lg:flex lg:flex-col">
          <ResultSidebar
            sections={sections}
            activeId={activeSection}
            onChange={setActiveSection}
          />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:max-h-[calc(100vh-65px)]">
            <div className="mb-4 lg:hidden">
              <ResultSidebar
                sections={sections}
                activeId={activeSection}
                onChange={setActiveSection}
                orientation="horizontal"
              />
            </div>

            {activeSection === 'overview' ? (
              <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
                <PlanHero
                  finalPlan={finalPlan}
                  clarified={clarified}
                  idea={idea}
                  ideaTypeLabel={ideaTypeLabel}
                  userAnswers={userAnswers}
                  phaseCount={phaseCount}
                  totalDuration={totalDuration}
                />
                <PathSummaryCard
                  finalPlan={finalPlan}
                  selectedPath={selectedPath}
                  pathApplyMessage={pathApplyMessage}
                />
                <PlanOverview idea={idea} ideaTypeLabel={ideaTypeLabel} clarified={clarified} />
                <ResponsibleAiNotice variant="compact" />
              </div>
            ) : null}

            {activeSection === 'pipeline' ? (
              <div className="mx-auto max-w-4xl animate-fade-in">
                <PipelineTrace trace={pipelineTrace} reasoning={reasoning} clarified={clarified} />
              </div>
            ) : null}

            {activeSection === 'timeline' ? (
              <div className="mx-auto max-w-4xl animate-fade-in">
                <SectionIntro
                  title="Execution timeline"
                  description="A sequenced view of your journey — each phase builds on the one before it."
                />
                {selectedPath ? (
                  <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true">
                      <path fillRule="evenodd" d="M9.965 2.022a.75.75 0 0 1 .07 1.058l-.07.07-1.5 1.5a.75.75 0 0 0 1.06 1.06l1.5-1.5a2.25 2.25 0 1 0-3.182-3.182l-1.5 1.5a.75.75 0 0 0 1.06 1.06l1.5-1.5a.75.75 0 0 1 1.062 0ZM12.5 7.5a.75.75 0 0 0-1.06 0l-3.94 3.94a.75.75 0 1 0 1.06 1.06l3.94-3.94a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm text-indigo-800 dark:text-indigo-200">
                        Plan shaped for: <span className="font-semibold">{selectedPath.title}</span>
                      </p>
                      {pathApplyMessage ? (
                        <p className="mt-0.5 text-xs text-indigo-600 dark:text-indigo-300">{pathApplyMessage}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <TimelineFlow roadmap={finalPlan.roadmap} timeline={finalPlan.timeline} />
              </div>
            ) : null}

            {activeSection === 'risks' ? (
              <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
                <SectionIntro
                  title="Risks & mitigations"
                  description="Known challenges flagged by the Stress Tester agent and how to handle them."
                />
                {finalPlan.risks?.length ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {finalPlan.risks.map((risk, index) => (
                      <RiskCard key={`${risk.title}-${index}`} risk={risk} />
                    ))}
                  </div>
                ) : null}
                <div className="grid gap-4 sm:grid-cols-2">
                  {normalizeReasoningList(stressTest?.weakAssumptions).length > 0 ? (
                    <div className="card p-5">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Weak assumptions to validate</p>
                      <ul className="mt-3 space-y-2">
                        {normalizeReasoningList(stressTest?.weakAssumptions).map((item, index) => (
                          <li
                            key={`weak-${index}-${item}`}
                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                          >
                            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {normalizeReasoningList(stressTest?.failureModes).length > 0 ? (
                    <div className="card border-rose-200 p-5 dark:border-rose-500/30">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Failure modes — how this could go wrong
                      </p>
                      <ul className="mt-3 space-y-2">
                        {normalizeReasoningList(stressTest?.failureModes).map((item, index) => (
                          <li
                            key={`failure-${index}-${item}`}
                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                          >
                            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {activeSection === 'next' ? (
              <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
                <SectionIntro
                  title="Start here"
                  description="Your launch kit — the single first move, this week's focus, and what to de-risk before you commit."
                />

                <div className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-card dark:border-orange-500/30 dark:from-orange-500/10 dark:to-amber-500/5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                        <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-orange-700 dark:text-orange-300">Do this first</p>
                      <p className="mt-1 text-base leading-relaxed text-slate-800 dark:text-slate-100">{finalPlan.firstAction}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {firstWeekTasks.length ? (
                    <div className="card p-5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                            <path d="M5.75 3a.75.75 0 0 0-.75.75V4.5H4.25A2.25 2.25 0 0 0 2 6.75v8A2.25 2.25 0 0 0 4.25 17h11.5A2.25 2.25 0 0 0 18 14.75v-8a2.25 2.25 0 0 0-2.25-2.25H15v-.75a.75.75 0 0 0-1.5 0V4.5h-7v-.75A.75.75 0 0 0 5.75 3ZM3.5 8.5h13v6.25a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75V8.5Z" />
                          </svg>
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Focus for phase 1</h3>
                          {firstPhase?.timeframe ? (
                            <p className="text-xs text-slate-500 dark:text-slate-400">{firstPhase.title} · {firstPhase.timeframe}</p>
                          ) : null}
                        </div>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {firstWeekTasks.map((task) => (
                          <li key={task} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="mt-1 h-3.5 w-3.5 shrink-0 text-sky-500 dark:text-sky-400" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
                            </svg>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {validateItems.length ? (
                    <div className="card border-amber-200 p-5 dark:border-amber-500/30">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.515 2.625H3.72c-1.345 0-2.188-1.458-1.515-2.625L8.485 2.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Validate before you commit</h3>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {validateItems.map((item, index) => (
                          <li key={`validate-${index}-${item}`} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <ResponsibleAiNotice confidenceNote={finalPlan.confidenceNote} />
              </div>
            ) : null}
          </main>

          <aside className="h-96 shrink-0 lg:h-auto lg:w-80 xl:w-96">
            <PlanChatPanel result={result} onPlanUpdate={handlePlanUpdate} />
          </aside>
        </div>
      </div>
    </div>
  );
}
