import Link from 'next/link';
import { derivePlanSubtitle, derivePlanTitle, extractPlanStats } from '../lib/planDisplay';

export default function PlanHero({
  finalPlan,
  clarified,
  idea,
  ideaTypeLabel,
  userAnswers,
  phaseCount,
  totalDuration,
}) {
  const title = derivePlanTitle({ finalPlan, clarified, idea });
  const subtitle = derivePlanSubtitle({ finalPlan, clarified, idea });
  const stats = extractPlanStats({
    idea,
    userAnswers,
    ideaTypeLabel,
    phaseCount,
    totalDuration,
  });

  return (
    <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-7 sm:px-8 sm:py-9">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-orange-400/90">
            Execution plan
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-[1.75rem] sm:leading-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">{subtitle}</p>
          ) : null}
        </div>

        <Link
          href="/"
          className="shrink-0 rounded-lg border border-slate-700 bg-slate-950/50 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
        >
          New idea
        </Link>
      </div>

      {stats.length > 0 ? (
        <dl className="relative mt-6 flex flex-wrap gap-2">
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
    </header>
  );
}
