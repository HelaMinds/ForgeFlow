import { derivePlanSubtitle, extractPlanStats } from '../lib/planDisplay';

export default function PlanHero({
  finalPlan,
  clarified,
  idea,
  ideaTypeLabel,
  userAnswers,
  phaseCount,
  totalDuration,
}) {
  const subtitle = derivePlanSubtitle({ finalPlan, clarified, idea });
  const stats = extractPlanStats({
    idea,
    userAnswers,
    ideaTypeLabel,
    phaseCount,
    totalDuration,
  });

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="bg-brand-gradient px-6 py-5 sm:px-8">
        <div className="flex items-center gap-2 text-white/90">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">Execution plan ready</p>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-7">
        {subtitle ? (
          <p className="text-balance text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg">{subtitle}</p>
        ) : null}

        {stats.length > 0 ? (
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
