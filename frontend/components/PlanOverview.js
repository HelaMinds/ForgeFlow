import { isUserAnswerConstraint, normalizeReasoningList } from '../lib/reasoningUtils';

export default function PlanOverview({ idea, ideaTypeLabel, clarified }) {
  const goals = normalizeReasoningList(clarified.goals);
  const constraints = normalizeReasoningList(clarified.constraints).filter(isUserAnswerConstraint);
  const userAnswers = clarified.userAnswers || [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {idea ? (
          <section className="riso-card p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-riso-faint">
                Your idea
              </h2>
              {ideaTypeLabel ? (
                <span className="rounded-full border border-riso-coral/25 bg-riso-coral-light px-2.5 py-0.5 text-xs font-semibold text-riso-coral">
                  {ideaTypeLabel}
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-riso-ink">{idea}</p>
          </section>
        ) : null}

        {clarified.summary ? (
          <section className="riso-card p-5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-riso-faint">
              Clarified scope
            </h2>
            <p className="text-sm leading-relaxed text-riso-ink">{clarified.summary}</p>
          </section>
        ) : null}
      </div>

      {(goals.length > 0 || constraints.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.length > 0 ? (
            <section className="riso-card p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-riso-faint">Goals</h2>
              <ul className="space-y-2">
                {goals.map((goal, index) => (
                  <li key={`goal-${index}-${goal}`} className="flex items-start gap-2 text-sm text-riso-ink">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-riso-coral" />
                    {goal}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {constraints.length > 0 ? (
            <section className="riso-card p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-riso-faint">Constraints</h2>
              <ul className="space-y-2">
                {constraints.map((constraint, index) => (
                  <li key={`constraint-${index}-${constraint}`} className="flex items-start gap-2 text-sm text-riso-ink">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-riso-muted" />
                    {constraint}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      {userAnswers.length > 0 ? (
        <section className="riso-card p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-riso-faint">
            Your inputs
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {userAnswers.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-riso-border bg-riso-paper px-3 py-2.5">
                <dt className="text-xs text-riso-faint">{entry.question}</dt>
                <dd className="mt-1 text-sm font-semibold text-riso-ink">{entry.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
