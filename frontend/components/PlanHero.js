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
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-6 sm:px-8 sm:py-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl"
      />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-orange-400/90">
          Execution plan
        </p>
        {subtitle ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">{subtitle}</p>
        ) : null}

        {stats.length > 0 ? (
          <dl className="mt-6 flex flex-wrap gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-xs text-slate-300">
                  <span className="font-medium text-slate-500">{stat.label}</span>
                  <span className="mx-1.5 text-slate-600">·</span>
                  <span className="text-slate-200">{stat.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
