'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ClarifyForm from '../../components/ClarifyForm';
import IdeaReviewPanel from '../../components/IdeaReviewPanel';
import IdeaRefinePanel from '../../components/IdeaRefinePanel';
import IdeaApprovedBanner from '../../components/IdeaApprovedBanner';
import PipelineTrace from '../../components/PipelineTrace';
import ResponsibleAiNotice from '../../components/ResponsibleAiNotice';
import PlanGenerationOverlay from '../../components/PlanGenerationOverlay';
import ThemeToggle from '../../components/ThemeToggle';
import { clarifyIdea, generatePlan, getIdeaTypeLabel } from '../../lib/api';
import { ensureChoiceQuestions, inferDefaultOptions } from '../../lib/questionUtils';

function isIdeaApproved(assessment) {
  return assessment?.verdict === 'proceed';
}

export default function ClarifyPage() {
  const router = useRouter();
  const [clarifyData, setClarifyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [refining, setRefining] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('forgeflow-clarify');
    if (!stored) {
      return;
    }

    const parsed = JSON.parse(stored);
    setClarifyData(parsed);
    if (isIdeaApproved(parsed.assessment)) {
      setAcknowledged(true);
    }
  }, []);

  async function handleRefineIdea(nextIdea) {
    setRefining(true);
    setError('');

    try {
      const result = await clarifyIdea({
        idea: nextIdea,
        ideaType: clarifyData.ideaType,
      });

      const nextData = {
        idea: result.idea,
        ideaType: result.ideaType,
        assessment: result.assessment || null,
        clarified: result.clarified,
        pipelineTrace: result.pipelineTrace || [],
      };

      const approved = isIdeaApproved(nextData.assessment);

      setClarifyData(nextData);
      sessionStorage.setItem('forgeflow-clarify', JSON.stringify(nextData));
      setAcknowledged(approved);
    } catch (err) {
      setError(err.message || 'Could not re-analyze your idea');
    } finally {
      setRefining(false);
    }
  }

  async function handleSubmit(answers) {
    setLoading(true);
    setError('');

    try {
      const result = await generatePlan({
        idea: clarifyData.idea,
        answers,
        clarified: clarifyData.clarified,
        assessment: clarifyData.assessment,
      });
      sessionStorage.setItem('forgeflow-result', JSON.stringify(result));
      sessionStorage.removeItem('forgeflow-clarify');
      sessionStorage.removeItem('forgeflow-path-choice');
      router.push(result.finalPlan?.pathOptions?.length ? '/choose-path' : '/result');
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  }

  if (!clarifyData) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <div className="card p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">No idea to clarify.</p>
          <Link href="/" className="btn-primary mt-5 inline-flex">
            Start over
          </Link>
        </div>
      </main>
    );
  }

  const { idea, ideaType, clarified, assessment, pipelineTrace = [] } = clarifyData;
  const approved = isIdeaApproved(assessment);
  const needsRefinement = Boolean(assessment) && !approved && !acknowledged;
  const showQuestions = approved || acknowledged;

  const questions = ensureChoiceQuestions(
    clarified.questions?.length
      ? clarified.questions
      : (clarified.openQuestions || []).map((text, index) => ({
          id: `q${index + 1}`,
          text,
          type: 'choice',
          options: inferDefaultOptions(`q${index + 1}`, text),
        })),
  );

  return (
    <>
      {loading ? <PlanGenerationOverlay /> : null}
      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <div className="mb-8 flex items-start justify-between gap-4 animate-fade-in">
          <div>
            <span className="eyebrow">Step 2 of 3 · {needsRefinement ? 'Idea review' : 'Clarify'}</span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {needsRefinement ? 'Sharpen your idea first' : 'Choose your answers'}
            </h1>
            <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              {needsRefinement
                ? 'The Assessor isn’t confident enough to plan yet. Refine your idea using the suggestions below, then re-analyze.'
                : 'Select one option per question. Your choices shape the plan — ForgeFlow will not guess on your behalf.'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              aria-label="Back to start"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-soft transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <PipelineTrace trace={pipelineTrace} activeStage={needsRefinement ? 'clarifier' : 'planner'} compact />
        </div>

        {needsRefinement ? (
          <>
            <IdeaReviewPanel assessment={assessment} />
            <div className="mb-6">
              <ResponsibleAiNotice variant="compact" />
            </div>
            <IdeaRefinePanel
              idea={idea}
              assessment={assessment}
              onRefine={handleRefineIdea}
              onContinue={() => setAcknowledged(true)}
              refining={refining}
            />
          </>
        ) : (
          <>
            <IdeaApprovedBanner assessment={approved ? assessment : null} />

            {!approved && acknowledged ? (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3.5 dark:border-amber-500/30 dark:bg-amber-500/10">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Continuing with noted concerns</p>
                <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-300">
                  You chose to proceed despite the Assessor’s review. Verify assumptions carefully.
                </p>
              </div>
            ) : null}

            <section className="card mb-6 p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Your idea</h2>
                {ideaType ? (
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                    {getIdeaTypeLabel(ideaType)}
                  </span>
                ) : null}
              </div>
              <p className="text-slate-800 dark:text-slate-200">{idea}</p>
              {clarified.summary ? (
                <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">{clarified.summary}</p>
              ) : null}
            </section>

            {clarified.goals?.length || clarified.constraints?.length ? (
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                {clarified.goals?.length ? (
                  <section className="card p-5">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Detected goals
                    </h2>
                    <ul className="space-y-2">
                      {clarified.goals.map((goal) => (
                        <li key={goal} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {clarified.constraints?.length ? (
                  <section className="card p-5">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Known constraints
                    </h2>
                    <ul className="space-y-2">
                      {clarified.constraints.map((constraint) => (
                        <li key={constraint} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            ) : null}

            <div className="mb-6">
              <ResponsibleAiNotice variant="compact" />
            </div>

            {showQuestions ? <ClarifyForm questions={questions} onSubmit={handleSubmit} loading={loading} /> : null}
          </>
        )}

        {error ? (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-fade-in dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        ) : null}
      </main>
    </>
  );
}
