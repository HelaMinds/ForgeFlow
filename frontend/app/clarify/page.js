'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ClarifyForm from '../../components/ClarifyForm';
import { generatePlan, getIdeaTypeLabel } from '../../lib/api';

export default function ClarifyPage() {
  const router = useRouter();
  const [clarifyData, setClarifyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('forgeflow-clarify');
    if (stored) {
      setClarifyData(JSON.parse(stored));
    }
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
        <p className="text-slate-400">No idea to clarify.</p>
        <Link href="/" className="mt-4 inline-block text-orange-400 hover:underline">
          Start over
        </Link>
      </main>
    );
  }

  const { idea, ideaType, clarified } = clarifyData;
  const questions = clarified.questions?.length
    ? clarified.questions
    : (clarified.openQuestions || []).map((text, index) => ({
        id: `q${index + 1}`,
        text,
        type: 'text',
      }));

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-orange-400">Clarify</p>
          <h1 className="mt-2 text-3xl font-bold">Answer a few questions</h1>
          <p className="mt-4 text-slate-400">
            ForgeFlow needs your input before building a plan. You stay in control of the
            decisions.
          </p>
        </div>
        <Link
          href="/"
          aria-label="Back"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">Your idea</h2>
          {ideaType ? (
            <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
              {getIdeaTypeLabel(ideaType)}
            </span>
          ) : null}
        </div>
        <p className="text-slate-300">{idea}</p>
        {clarified.summary ? (
          <p className="mt-4 text-sm text-slate-400">{clarified.summary}</p>
        ) : null}
      </section>

      {clarified.goals?.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-slate-500">
            Detected goals
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-400">
            {clarified.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {clarified.constraints?.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-slate-500">
            Known constraints
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-400">
            {clarified.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <ClarifyForm questions={questions} onSubmit={handleSubmit} loading={loading} />

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
    </main>
  );
}
