import { isUserAnswerConstraint, normalizeReasoningList } from '../lib/reasoningUtils';

export default function PlanOverview({ idea, ideaTypeLabel, clarified }) {
  const goals = normalizeReasoningList(clarified.goals);
  const constraints = normalizeReasoningList(clarified.constraints).filter(isUserAnswerConstraint);
  const userAnswers = clarified.userAnswers || [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {idea ? (
          <section className="card p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Your idea</h2>
              {ideaTypeLabel ? (
                <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                  {ideaTypeLabel}
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{idea}</p>
          </section>
        ) : null}

        {clarified.summary ? (
          <section className="card p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Clarified scope</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{clarified.summary}</p>
          </section>
        ) : null}
      </div>

      {(goals.length > 0 || constraints.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.length > 0 ? (
            <section className="card p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Goals</h2>
              <ul className="mt-3 space-y-2">
                {goals.map((goal, index) => (
                  <li key={`goal-${index}-${goal}`} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                    {goal}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {constraints.length > 0 ? (
            <section className="card p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Constraints</h2>
              <ul className="mt-3 space-y-2">
                {constraints.map((constraint, index) => (
                  <li key={`constraint-${index}-${constraint}`} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    {constraint}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      {userAnswers.length > 0 ? (
        <section className="card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Your inputs</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {userAnswers.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                <dt className="text-xs text-slate-500 dark:text-slate-400">{entry.question}</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{entry.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
