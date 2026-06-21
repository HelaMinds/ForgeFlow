'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputBox from '../components/InputBox';
import PipelineTrace from '../components/PipelineTrace';
import ResponsibleAiNotice from '../components/ResponsibleAiNotice';
import ThemeToggle from '../components/ThemeToggle';
import { clarifyIdea } from '../lib/api';

const FEATURES = [
  {
    title: 'Clarifies the vague',
    description: 'Turns a one-line idea into goals, constraints, and the questions that actually matter.',
    icon: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z',
  },
  {
    title: 'Plans in phases',
    description: 'Builds a sequential, milestone-driven roadmap sized to your real budget and timeline.',
    icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
  },
  {
    title: 'Stress-tests honestly',
    description: 'Challenges weak assumptions and surfaces risks before you commit real resources.',
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
  },
];

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
          assessment: result.assessment || null,
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
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 sm:py-16">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <Image
              src="/forgeflow-logo-v2.png"
              alt="ForgeFlow logo"
              width={48}
              height={48}
              priority
              className="h-12 w-12 object-contain"
            />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">ForgeFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            5-agent AI pipeline
          </span>
          <ThemeToggle />
        </div>
      </header>

      <div className="mt-12 grid items-start gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
        {/* Left: pitch */}
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M10 1.5 12.6 7l6 .5-4.5 3.9 1.4 5.9L10 14.2 4.5 17.3l1.4-5.9L1.4 7.5l6-.5L10 1.5Z" />
            </svg>
            Idea → execution plan in minutes
          </span>

          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Turn a vague idea into a{' '}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              risk-aware roadmap
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Five specialized AI agents: Assessor, Clarifier, Planner, Stress Tester, and Synthesizer.
            work in sequence to structure your thinking. You answer the hard questions; the agents
            do the analysis.
          </p>

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4">
            {[
              { value: '5', label: 'AI agents' },
              { value: '5–8', label: 'Plan phases' },
              { value: '~1 min', label: 'To first draft' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <dt className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</dt>
                <dd className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{feature.title}</p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: input card */}
        <div className="animate-fade-in-up lg:sticky lg:top-16">
          <div className="card p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Describe your idea</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Start rough. The Clarifier agent will fill in the gaps.
              </p>
            </div>

            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                The pipeline
              </p>
              <PipelineTrace trace={[]} activeStage="assessor" compact />
            </div>

            <InputBox onSubmit={handleSubmit} loading={loading} />

            {error ? (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-fade-in dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            ) : null}

            <div className="mt-6">
              <ResponsibleAiNotice variant="compact" />
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-12 border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <a
          href="https://github.com/HelaMinds/ForgeFlow"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-orange-600 transition hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
        >
          HelaMinds/ForgeFlow
        </a>
      </footer>
    </main>
  );
}
