function normalizeSteps(roadmap) {
  if (!Array.isArray(roadmap)) {
    return [];
  }

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

  if (!steps.length) {
    return null;
  }

  const totalDuration =
    timeline?.totalDuration ||
    (steps[steps.length - 1]?.timeframe ? steps[steps.length - 1].timeframe : null);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-orange-300">
          {timeline?.totalSteps ?? steps.length} phases
        </span>
        {totalDuration ? (
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
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
                  className="absolute bottom-0 left-[15px] top-8 w-px bg-gradient-to-b from-orange-500/60 via-slate-700 to-slate-800"
                />
              ) : null}

              <span className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-500 bg-slate-950 text-sm font-bold text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.25)]">
                {step.order}
              </span>

              <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-100">{step.title}</h3>
                  {step.timeframe ? (
                    <span className="shrink-0 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400">
                      {step.timeframe}
                    </span>
                  ) : null}
                </div>

                {step.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
                ) : null}

                {step.tasks.length ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
                      To do
                    </p>
                    <ul className="space-y-2">
                      {step.tasks.map((task) => (
                        <li
                          key={task}
                          className="flex items-start gap-3 rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-300"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-600"
                          />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {step.milestone ? (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-emerald-400/80">
                        Milestone
                      </p>
                      <p className="mt-0.5 text-sm text-slate-300">{step.milestone}</p>
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
