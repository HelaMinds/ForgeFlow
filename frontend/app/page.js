'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputBox from '../components/InputBox';
import PipelineTrace from '../components/PipelineTrace';
import ResponsibleAiNotice from '../components/ResponsibleAiNotice';
import { clarifyIdea } from '../lib/api';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit({ idea, ideaType }) {
    setLoading(true);
    setError('');
    try {
      const result = await clarifyIdea({ idea, ideaType });
      sessionStorage.setItem(
        'forgeflow-clarify',
        JSON.stringify({
          idea: result.idea,
          ideaType: result.ideaType,
          clarified: result.clarified,
          pipelineTrace: result.pipelineTrace || [],
        }),
      );
      sessionStorage.removeItem('forgeflow-path-choice');
      router.push('/clarify');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      {/* Riso dot decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 overflow-hidden opacity-40">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 24 + 12}
                cy={row * 24 + 12}
                r="3"
                fill="#D95B2A"
                opacity={0.08 + (row + col) * 0.012}
              />
            ))
          )}
        </svg>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 overflow-hidden opacity-30">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 24 + 12}
                cy={row * 24 + 12}
                r="3"
                fill="#2860A0"
                opacity={0.1 + (row + col) * 0.015}
              />
            ))
          )}
        </svg>
      </div>

      <div className="relative mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-riso-coral/30 bg-riso-coral-light px-3 py-1.5 shadow-riso">
          <div className="h-1.5 w-1.5 rounded-full bg-riso-coral" />
          <p className="text-xs font-semibold uppercase tracking-widest text-riso-coral">ForgeFlow</p>
        </div>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-riso-ink sm:text-5xl">
          Turn ideas into
          <br />
          <span className="relative">
            execution plans
            <svg
              aria-hidden="true"
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 300 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 6 C75 2, 150 2, 225 4 S275 6, 300 5" stroke="#D95B2A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
            </svg>
          </span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-riso-muted">
          A four-agent AI pipeline — Clarifier, Planner, Stress Tester, Synthesizer — turns vague
          ideas into structured, risk-aware roadmaps. You answer the hard questions; the agents do
          the analysis.
        </p>
      </div>

      <div className="mb-8">
        <PipelineTrace trace={[]} activeStage="clarifier" compact />
      </div>

      <div className="riso-card p-6">
        <InputBox onSubmit={handleSubmit} loading={loading} />
        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
      </div>

      <div className="mt-6">
        <ResponsibleAiNotice variant="compact" />
      </div>
    </main>
  );
}
