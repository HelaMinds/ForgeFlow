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
  const stats = extractPlanStats({ idea, userAnswers, ideaTypeLabel, phaseCount, totalDuration });

  return (
    <section className="relative overflow-hidden rounded-2xl border border-riso-border bg-riso-card px-6 py-6 shadow-riso-md sm:px-8 sm:py-8">
      {/* Riso decorative dots — top right */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 20 + 10}
                cy={row * 20 + 10}
                r="2.5"
                fill="#D95B2A"
                opacity={0.12 + (row + col) * 0.015}
              />
            ))
          )}
        </svg>
      </div>

      {/* Riso offset color block */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-riso-blue/8 blur-2xl"
      />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-riso-coral">
          Execution plan
        </p>
        {subtitle ? (
          <p className="mt-3 text-sm leading-relaxed text-riso-muted sm:text-base">{subtitle}</p>
        ) : null}

        {stats.length > 0 ? (
          <dl className="mt-5 flex flex-wrap gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-full border border-riso-border bg-riso-paper px-3.5 py-1.5 shadow-riso"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-xs text-riso-ink">
                  <span className="font-medium text-riso-faint">{stat.label}</span>
                  <span className="mx-1.5 text-riso-border">·</span>
                  <span className="font-semibold text-riso-ink">{stat.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
