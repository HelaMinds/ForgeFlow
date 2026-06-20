function normalizeSteps(roadmap) {
  if (!Array.isArray(roadmap)) return [];
  return roadmap.map((step, index) => ({
    order: step.order ?? index + 1,
    title: step.title || `Step ${index + 1}`,
    description: step.description || '',
    timeframe: step.timeframe || '',
    durationDays: step.durationDays ?? null,
    tasks: Array.isArray(step.tasks) ? step.tasks : [],
    milestone: step.milestone || '',
  }));
}

export default function TimelineFlow({ roadmap, timeline }) {
  const steps = normalizeSteps(roadmap);
  if (!steps.length) return null;

  const totalDuration =
    timeline?.totalDuration ||
    (steps[steps.length - 1]?.timeframe ? steps[steps.length - 1].timeframe : null);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-riso-coral/30 bg-riso-coral-light px-3 py-1 text-xs font-semibold uppercase tracking-wider text-riso-coral">
          {timeline?.totalSteps ?? steps.length} phases
        </span>
        {totalDuration ? (
          <span className="rounded-full border border-riso-border bg-riso-paper px-3 py-1 text-xs font-semibold text-riso-muted shadow-riso">
            {totalDuration}
          </span>
        ) : null}
      </div>

      <ol className="relative space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li key={`${step.order}-${step.title}`} className={`relative pl-12 ${isLast ? '' : 'pb-10'}`}>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[15px] top-8 w-px bg-gradient-to-b from-riso-coral/50 via-riso-border to-riso-border"
                />
              ) : null}

              <span className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-riso-coral bg-riso-card text-sm font-bold text-riso-coral shadow-riso">
                {step.order}
              </span>

              <article className="riso-card p-5 transition hover:shadow-riso-md">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-riso-ink">{step.title}</h3>
                  {step.timeframe ? (
                    <span className="shrink-0 rounded-md border border-riso-border bg-riso-paper px-2.5 py-1 text-xs font-medium text-riso-muted">
                      {step.timeframe}
                    </span>
                  ) : null}
                </div>

                {step.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-riso-muted">{step.description}</p>
                ) : null}

                {step.tasks.length ? (
                  <div className="mt-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-riso-faint">
                      To do
                    </p>
                    <ul className="space-y-1.5">
                      {step.tasks.map((task) => (
                        <li
                          key={task}
                          className="flex items-start gap-3 rounded-lg border border-riso-border bg-riso-paper px-3 py-2.5 text-sm text-riso-ink"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-riso-border"
                          />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {step.milestone ? (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-riso-green/25 bg-riso-green-light px-3 py-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="mt-0.5 h-4 w-4 shrink-0 text-riso-green"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-riso-green">
                        Milestone
                      </p>
                      <p className="mt-0.5 text-sm text-riso-ink">{step.milestone}</p>
                    </div>
                  </div>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
