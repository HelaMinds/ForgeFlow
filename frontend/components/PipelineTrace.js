const STAGE_ORDER = ['clarifier', 'planner', 'stressTester', 'synthesizer'];

const STAGE_LABELS = {
  clarifier: 'Clarify',
  planner: 'Plan',
  stressTester: 'Stress test',
  synthesizer: 'Synthesize',
};

const STAGE_INDEX = {
  clarifier: '1',
  planner: '2',
  stressTester: '3',
  synthesizer: '4',
};

export default function PipelineTrace({ trace, activeStage, compact = false }) {
  const steps = STAGE_ORDER.map((stage) => {
    const entry = trace?.find((item) => item.stage === stage);
    const isActive = activeStage === stage;
    const isComplete = Boolean(entry);

    return { stage, entry, isActive, isComplete };
  });

  if (compact) {
    return (
      <ol className="flex flex-wrap items-center gap-1.5">
        {steps.map(({ stage, isActive, isComplete }, index) => (
          <li key={stage} className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                isComplete
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : isActive
                    ? 'border border-orange-300 bg-orange-50 text-orange-700 shadow-soft dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-300'
                    : 'border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  isComplete
                    ? 'bg-emerald-500 text-white'
                    : isActive
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {isComplete ? '✓' : STAGE_INDEX[stage]}
              </span>
              {STAGE_LABELS[stage]}
            </span>
            {index < steps.length - 1 ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-slate-300 dark:text-slate-600" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
              </svg>
            ) : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">How ForgeFlow built this plan</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Four specialized agents ran in sequence — not a single prompt. Here is what each one produced.
        </p>
      </div>

      <ol className="space-y-3">
        {steps.map(({ stage, entry, isActive, isComplete }) => (
          <li
            key={stage}
            className={`relative rounded-xl border p-4 transition ${
              isComplete
                ? 'border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950/40'
                : isActive
                  ? 'border-orange-300 bg-orange-50/60 dark:border-orange-500/40 dark:bg-orange-500/5'
                  : 'border-slate-200 bg-slate-50/60 opacity-70 dark:border-slate-800 dark:bg-slate-950/30'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                    isComplete
                      ? 'bg-brand-gradient text-white shadow-glow'
                      : isActive
                        ? 'bg-orange-500 text-white animate-pulse-ring'
                        : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {STAGE_INDEX[stage]}
                </span>
                <div>
                  <p className="eyebrow">{STAGE_LABELS[stage]}</p>
                  <h3 className="mt-0.5 font-semibold text-slate-900 dark:text-white">{entry?.agent || stage}</h3>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{entry?.role}</p>
                </div>
              </div>
              {isComplete ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Complete
                </span>
              ) : isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                  Running
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Pending
                </span>
              )}
            </div>

            {entry ? (
              <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{entry.summary}</p>
                {entry.highlights?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {entry.highlights.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
