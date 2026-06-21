'use client';

import { useEffect, useState } from 'react';

const STAGES = [
  { agent: 'Planner', role: 'Building a phased execution plan from your answers' },
  { agent: 'Stress Tester', role: 'Challenging assumptions and surfacing risks' },
  { agent: 'Synthesizer', role: 'Merging everything into a final roadmap' },
];

export default function PlanGenerationOverlay() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Advance through stages on a timer for visual progress feedback.
    // Stops on the last stage until the real response arrives.
    const timer = setInterval(() => {
      setActive((current) => (current < STAGES.length - 1 ? current + 1 : current));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6 backdrop-blur-sm animate-fade-in dark:bg-slate-950/70"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lift dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center text-center">
          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
            <svg className="h-7 w-7 animate-spin text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
            </svg>
          </span>
          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">Forging your plan</h2>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            The agents are analyzing your idea. This usually takes under a minute.
          </p>
        </div>

        <ol className="mt-7 space-y-2.5">
          {STAGES.map((stage, index) => {
            const isDone = index < active;
            const isActive = index === active;

            return (
              <li
                key={stage.agent}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                  isActive
                    ? 'border-orange-300 bg-orange-50 dark:border-orange-500/40 dark:bg-orange-500/10'
                    : isDone
                      ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                      : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/40'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isActive
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  {isDone ? (
                    '✓'
                  ) : isActive ? (
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <div className="min-w-0 text-left">
                  <p className={`text-sm font-semibold ${isActive || isDone ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {stage.agent}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{stage.role}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
