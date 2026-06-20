const STAGE_ORDER = ['clarifier', 'planner', 'stressTester', 'synthesizer'];

const STAGE_LABELS = {
  clarifier: '1 · Clarify',
  planner: '2 · Plan',
  stressTester: '3 · Stress test',
  synthesizer: '4 · Synthesize',
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
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map(({ stage, entry, isActive, isComplete }, index) => (
          <li key={stage} className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isComplete
                  ? 'border border-orange-500/30 bg-orange-500/10 text-orange-300'
                  : isActive
                    ? 'border border-slate-600 bg-slate-800 text-slate-200'
                    : 'border border-slate-800 bg-slate-900/50 text-slate-500'
              }`}
            >
              {STAGE_LABELS[stage]}
              {isComplete ? ' ✓' : isActive ? ' …' : ''}
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden="true" className="text-slate-600">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-100">How ForgeFlow built this plan</h2>
        <p className="mt-1 text-sm text-slate-400">
          Four specialized agents ran in sequence — not a single prompt. Here is what each one
          produced.
        </p>
      </div>

      <ol className="space-y-4">
        {steps.map(({ stage, entry, isActive, isComplete }) => (
          <li
            key={stage}
            className={`relative rounded-xl border p-4 ${
              isComplete
                ? 'border-slate-700 bg-slate-950/60'
                : isActive
                  ? 'border-orange-500/40 bg-orange-500/5'
                  : 'border-slate-800/80 bg-slate-950/30 opacity-60'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-orange-400/90">
                  {STAGE_LABELS[stage]}
                </p>
                <h3 className="mt-1 font-semibold text-slate-100">
                  {entry?.agent || stage}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{entry?.role}</p>
              </div>
              {isComplete ? (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                  Complete
                </span>
              ) : isActive ? (
                <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-300">
                  Running
                </span>
              ) : (
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-500">
                  Pending
                </span>
              )}
            </div>

            {entry ? (
              <div className="mt-4 border-t border-slate-800 pt-4">
                <p className="text-sm text-slate-300">{entry.summary}</p>
                {entry.highlights?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {entry.highlights.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-400"
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
