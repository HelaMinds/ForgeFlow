'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ResultTopBar from '../../components/ResultTopBar';
import PlanHero from '../../components/PlanHero';
import PlanOverview from '../../components/PlanOverview';
import PipelineTrace from '../../components/PipelineTrace';
import ReasoningPanel from '../../components/ReasoningPanel';
import PathDecisionPanel from '../../components/PathDecisionPanel';
import ResponsibleAiNotice from '../../components/ResponsibleAiNotice';
import ResultSidebar from '../../components/ResultSidebar';
import PlanChatPanel from '../../components/PlanChatPanel';
import TimelineFlow from '../../components/TimelineFlow';
import RiskCard from '../../components/RiskCard';
import { getIdeaTypeLabel, applyPathChoice as applyPathChoiceApi } from '../../lib/api';
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
  const hasPaths = (finalPlan.pathOptions?.length ?? 0) > 0;
  const hasRisks = (finalPlan.risks?.length ?? 0) > 0;
  const hasWeakAssumptions = normalizeReasoningList(stressTest?.weakAssumptions).length > 0;

  return [
    { id: 'overview', label: 'Overview' },
    hasPipeline || hasReasoning ? { id: 'pipeline', label: 'Pipeline' } : null,
    { id: 'timeline', label: 'Timeline' },
    hasPaths ? { id: 'decisions', label: 'Your path' } : null,
    hasRisks || hasWeakAssumptions ? { id: 'risks', label: 'Risks' } : null,
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

  async function handlePathApply(path) {
    const response = await applyPathChoiceApi({
      context: {
        idea: result.idea,
        ideaType: result.ideaType,
        clarified: result.clarified,
        finalPlan: result.finalPlan,
        stressTest: result.stressTest,
      },
      selectedPath: path,
    });

    const nextResult = {
      ...result,
      finalPlan: response.finalPlan,
    };

    persistResult(nextResult);
    handlePathSelect(response.selectedPath || path);
    setPathApplyMessage(response.message);
    setActiveSection('timeline');
  }

  function handlePlanUpdate(updates) {
    if (!result) {
      return;
    }

    const nextResult = {
      ...result,
      finalPlan: updates.finalPlan || result.finalPlan,
      clarified: updates.clarified
        ? { ...result.clarified, ...updates.clarified }
        : result.clarified,
    };

    persistResult(nextResult);

    if (updates.finalPlan?.pathOptions?.length === 1) {
      handlePathSelect(updates.finalPlan.pathOptions[0]);
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
                <PlanOverview idea={idea} ideaTypeLabel={ideaTypeLabel} clarified={clarified} />
                <ResponsibleAiNotice variant="compact" />
              </div>
            ) : null}

            {activeSection === 'pipeline' ? (
              <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
                <SectionIntro
                  title="How this plan was built"
                  description="Four agents ran in sequence. Here is what each one produced and why."
                />
                <PipelineTrace trace={pipelineTrace} />
                <ReasoningPanel reasoning={reasoning} clarified={clarified} />
              </div>
            ) : null}

            {activeSection === 'timeline' ? (
              <div className="mx-auto max-w-4xl animate-fade-in">
                <SectionIntro
                  title="Step-by-step timeline"
                  description="Follow these phases in order. Complete each milestone before moving on."
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

            {activeSection === 'decisions' ? (
              <div className="mx-auto max-w-4xl animate-fade-in">
                <SectionIntro
                  title="Choose your strategic path"
                  description="Pick an approach — the plan will adapt your timeline, tasks, and first action to match."
                />
                <PathDecisionPanel
                  pathOptions={finalPlan.pathOptions}
                  selectedPath={selectedPath}
                  onApply={handlePathApply}
                  appliedMessage={
                    selectedPath && pathApplyMessage
                      ? pathApplyMessage
                      : selectedPath
                        ? `Active path: ${selectedPath.title}. Switch options and apply again to reshape the plan.`
                        : ''
                  }
                />
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
                {normalizeReasoningList(stressTest.weakAssumptions).length > 0 ? (
                  <div className="card p-5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Weak assumptions to validate</p>
                    <ul className="mt-3 space-y-2">
                      {normalizeReasoningList(stressTest.weakAssumptions).map((item, index) => (
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
              </div>
            ) : null}

            {activeSection === 'next' ? (
              <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
                <SectionIntro
                  title="Start here"
                  description="Your first concrete move — do this before anything else."
                />
                <div className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-card dark:border-orange-500/30 dark:from-orange-500/10 dark:to-amber-500/5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                        <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-orange-700 dark:text-orange-300">Your first action</p>
                      <p className="mt-1 text-base leading-relaxed text-slate-800 dark:text-slate-100">{finalPlan.firstAction}</p>
                    </div>
                  </div>
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
