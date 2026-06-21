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
      <div className="mb-8 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
          {timeline?.totalSteps ?? steps.length} phases
        </span>
        {totalDuration ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .199.079.39.22.53l3 3a.75.75 0 1 0 1.06-1.06l-2.78-2.78V5Z" clipRule="evenodd" />
            </svg>
            {totalDuration}
          </span>
        ) : null}
      </div>

      <ol className="relative space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <li key={`${step.order}-${step.title}`} className={`relative pl-14 ${isLast ? '' : 'pb-8'}`}>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[19px] top-10 w-0.5 bg-gradient-to-b from-orange-400 via-orange-200 to-slate-200 dark:via-orange-500/40 dark:to-slate-800"
                />
              ) : null}

              <span className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white shadow-glow">
                {step.order}
              </span>

              <article className="card p-5 transition-all hover:shadow-lift dark:hover:border-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  {step.timeframe ? (
                    <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {step.timeframe}
                    </span>
                  ) : null}
                </div>

                {step.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.description}</p>
                ) : null}

                {step.tasks.length ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">To do</p>
                    <ul className="space-y-2">
                      {step.tasks.map((task) => (
                        <li
                          key={task}
                          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900"
                          />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {step.milestone ? (
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Milestone</p>
                      <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">{step.milestone}</p>
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
