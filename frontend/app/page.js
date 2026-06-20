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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-widest text-orange-400">ForgeFlow</p>
        <h1 className="text-4xl font-bold">Turn ideas into execution plans</h1>
        <p className="mt-4 text-slate-400">
          A four-agent AI pipeline — Clarifier, Planner, Stress Tester, Synthesizer — turns vague
          ideas into structured, risk-aware roadmaps. You answer the hard questions; the agents do
          the analysis.
        </p>
      </div>

      <div className="mb-8">
        <PipelineTrace trace={[]} activeStage="clarifier" compact />
      </div>

      <InputBox onSubmit={handleSubmit} loading={loading} />

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      <div className="mt-8">
        <ResponsibleAiNotice variant="compact" />
      </div>
    </main>
  );
}
