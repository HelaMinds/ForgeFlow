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
        {steps.map(({ stage, isActive, isComplete }, index) => (
          <li key={stage} className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isComplete
                  ? 'border border-riso-coral/30 bg-riso-coral-light text-riso-coral'
                  : isActive
                    ? 'border border-riso-border bg-riso-sidebar text-riso-ink'
                    : 'border border-riso-border bg-riso-paper text-riso-faint'
              }`}
            >
              {STAGE_LABELS[stage]}
              {isComplete ? ' ✓' : isActive ? ' …' : ''}
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden="true" className="text-riso-border">→</span>
            ) : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <section className="rounded-2xl border border-riso-border bg-riso-card p-5 shadow-riso sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-riso-ink">How ForgeFlow built this plan</h2>
        <p className="mt-1 text-sm text-riso-muted">
          Four specialized agents ran in sequence — not a single prompt. Here is what each one produced.
        </p>
      </div>

      <ol className="space-y-3">
        {steps.map(({ stage, entry, isActive, isComplete }) => (
          <li
            key={stage}
            className={`relative rounded-xl border p-4 transition ${
              isComplete
                ? 'border-riso-border bg-riso-paper shadow-riso'
                : isActive
                  ? 'border-riso-coral/30 bg-riso-coral-light'
                  : 'border-riso-border bg-riso-paper opacity-50'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-riso-coral">
                  {STAGE_LABELS[stage]}
                </p>
                <h3 className="mt-1 font-semibold text-riso-ink">{entry?.agent || stage}</h3>
                <p className="mt-0.5 text-sm text-riso-muted">{entry?.role}</p>
              </div>
              {isComplete ? (
                <span className="rounded-full border border-riso-green/25 bg-riso-green-light px-2.5 py-1 text-xs font-semibold text-riso-green">
                  Complete
                </span>
              ) : isActive ? (
                <span className="rounded-full border border-riso-coral/25 bg-riso-coral-light px-2.5 py-1 text-xs font-semibold text-riso-coral">
                  Running
                </span>
              ) : (
                <span className="rounded-full border border-riso-border bg-riso-sidebar px-2.5 py-1 text-xs font-semibold text-riso-faint">
                  Pending
                </span>
              )}
            </div>

            {entry ? (
              <div className="mt-4 border-t border-riso-border pt-4">
                <p className="text-sm text-riso-ink">{entry.summary}</p>
                {entry.highlights?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {entry.highlights.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-riso-border bg-riso-sidebar px-2.5 py-1 text-xs text-riso-muted"
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
