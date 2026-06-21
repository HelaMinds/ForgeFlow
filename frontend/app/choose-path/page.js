'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PathDecisionPanel from '../../components/PathDecisionPanel';
import PipelineTrace from '../../components/PipelineTrace';
import ThemeToggle from '../../components/ThemeToggle';
import { applyPathChoice } from '../../lib/api';
import { derivePlanTitle } from '../../lib/planDisplay';

const RESULT_STORAGE_KEY = 'forgeflow-result';
const PATH_STORAGE_KEY = 'forgeflow-path-choice';

export default function ChoosePathPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (!stored) {
      return;
    }

    const parsed = JSON.parse(stored);
    if (!parsed.finalPlan?.pathOptions?.length) {
      router.replace('/result');
      return;
    }

    setResult(parsed);
  }, [router]);

  async function handleContinue(path) {
    if (!result || loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await applyPathChoice({
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
        pipelineTrace: response.traceEntry
          ? [...(result.pipelineTrace || []), response.traceEntry]
          : result.pipelineTrace,
      };

      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(nextResult));
      sessionStorage.setItem(PATH_STORAGE_KEY, JSON.stringify(response.selectedPath || path));
      if (response.message) {
        sessionStorage.setItem('forgeflow-path-message', response.message);
      }
      router.push('/result');
    } catch (err) {
      setError(err.message || 'Could not adapt the plan to this path');
      setLoading(false);
    }
  }

  function handleSkip() {
    sessionStorage.removeItem(PATH_STORAGE_KEY);
    sessionStorage.removeItem('forgeflow-path-message');
    router.push('/result');
  }

  if (!result) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <div className="card p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">No plan ready yet.</p>
          <Link href="/" className="btn-primary mt-5 inline-flex">
            Start over
          </Link>
        </div>
      </main>
    );
  }

  const { finalPlan, clarified, idea, pipelineTrace = [] } = result;
  const title = derivePlanTitle({ finalPlan, clarified, idea });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <div className="mb-8 flex items-start justify-between gap-4 animate-fade-in">
        <div>
          <span className="eyebrow">Step 3 of 3 · Your decision</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How do you want to build this?
          </h1>
          <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            The Synthesizer surfaced strategic options — you pick the approach. ForgeFlow will reshape your
            timeline, tasks, and first action to match. This is your call, not the AI&apos;s.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <PipelineTrace trace={pipelineTrace} activeStage="synthesizer" compact />
      </div>

      <section className="card mb-6 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Your plan</p>
        <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
        {finalPlan.overview || finalPlan.summary ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {finalPlan.overview || finalPlan.summary}
          </p>
        ) : null}
      </section>

      <PathDecisionPanel
        variant="step"
        pathOptions={finalPlan.pathOptions}
        onContinue={handleContinue}
        onSkip={handleSkip}
        loading={loading}
      />

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
  );
}
