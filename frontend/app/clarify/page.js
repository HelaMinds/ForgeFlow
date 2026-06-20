'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ClarifyForm from '../../components/ClarifyForm';
import PipelineTrace from '../../components/PipelineTrace';
import ResponsibleAiNotice from '../../components/ResponsibleAiNotice';
import { generatePlan, getIdeaTypeLabel } from '../../lib/api';
import { ensureChoiceQuestions, inferDefaultOptions } from '../../lib/questionUtils';

export default function ClarifyPage() {
  const router = useRouter();
  const [clarifyData, setClarifyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('forgeflow-clarify');
    if (stored) setClarifyData(JSON.parse(stored));
  }, []);

  async function handleSubmit(answers) {
    setLoading(true);
    setError('');
    try {
      const result = await generatePlan({
        idea: clarifyData.idea,
        answers,
        clarified: clarifyData.clarified,
      });
      sessionStorage.setItem('forgeflow-result', JSON.stringify(result));
      sessionStorage.removeItem('forgeflow-clarify');
      sessionStorage.removeItem('forgeflow-path-choice');
      router.push('/result');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!clarifyData) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-riso-muted">No idea to clarify.</p>
        <Link href="/" className="mt-4 inline-block font-medium text-riso-coral hover:underline">
          Start over
        </Link>
      </main>
    );
  }

  const { idea, ideaType, clarified, pipelineTrace = [] } = clarifyData;
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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-riso-coral/30 bg-riso-coral-light px-3 py-1 shadow-riso">
            <div className="h-1.5 w-1.5 rounded-full bg-riso-coral" />
            <p className="text-xs font-semibold uppercase tracking-widest text-riso-coral">Clarify</p>
          </div>
          <h1 className="text-3xl font-bold text-riso-ink">Choose your answers</h1>
          <p className="mt-3 text-sm leading-relaxed text-riso-muted">
            Select one option per question. Your choices shape the plan — ForgeFlow will not guess
            on your behalf.
          </p>
        </div>
        <Link
          href="/"
          aria-label="Back"
          className="ml-6 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-riso-border bg-riso-card text-riso-muted shadow-riso transition hover:border-riso-coral/40 hover:text-riso-ink"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      <div className="mb-8">
        <PipelineTrace trace={pipelineTrace} activeStage="planner" compact />
      </div>

      <div className="mb-8">
        <ResponsibleAiNotice variant="compact" />
      </div>

      <section className="riso-card mb-8 p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-riso-ink">Your idea</h2>
          {ideaType ? (
            <span className="rounded-full border border-riso-coral/25 bg-riso-coral-light px-3 py-0.5 text-xs font-semibold text-riso-coral">
              {getIdeaTypeLabel(ideaType)}
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-riso-ink">{idea}</p>
        {clarified.summary ? (
          <p className="mt-3 text-sm leading-relaxed text-riso-muted">{clarified.summary}</p>
        ) : null}
      </section>

      {clarified.goals?.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-riso-faint">
            Detected goals
          </h2>
          <ul className="space-y-1.5">
            {clarified.goals.map((goal) => (
              <li key={goal} className="flex items-start gap-2 text-sm text-riso-muted">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-riso-coral" />
                {goal}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {clarified.constraints?.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-riso-faint">
            Known constraints
          </h2>
          <ul className="space-y-1.5">
            {clarified.constraints.map((constraint) => (
              <li key={constraint} className="flex items-start gap-2 text-sm text-riso-muted">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-riso-muted" />
                {constraint}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ClarifyForm questions={questions} onSubmit={handleSubmit} loading={loading} />

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
    </main>
  );
}
