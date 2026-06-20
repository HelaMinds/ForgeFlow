import { isUserAnswerConstraint, normalizeReasoningList } from '../lib/reasoningUtils';

export default function PlanOverview({ idea, ideaTypeLabel, clarified }) {
  const goals = normalizeReasoningList(clarified.goals);
  const constraints = normalizeReasoningList(clarified.constraints).filter(isUserAnswerConstraint);
  const userAnswers = clarified.userAnswers || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {idea ? (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500">
                Your idea
              </h2>
              {ideaTypeLabel ? (
                <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-300">
                  {ideaTypeLabel}
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-slate-300">{idea}</p>
          </section>
        ) : null}

        {clarified.summary ? (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500">
              Clarified scope
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{clarified.summary}</p>
          </section>
        ) : null}
      </div>

      {(goals.length > 0 || constraints.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.length > 0 ? (
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500">Goals</h2>
              <ul className="mt-3 space-y-2">
                {goals.map((goal, index) => (
                  <li key={`goal-${index}-${goal}`} className="flex items-start gap-2 text-sm text-slate-300">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                    {goal}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {constraints.length > 0 ? (
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500">
                Constraints
              </h2>
              <ul className="mt-3 space-y-2">
                {constraints.map((constraint, index) => (
                  <li key={`constraint-${index}-${constraint}`} className="flex items-start gap-2 text-sm text-slate-300">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    {constraint}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      {userAnswers.length > 0 ? (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500">
            Your inputs
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {userAnswers.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                <dt className="text-xs text-slate-500">{entry.question}</dt>
                <dd className="mt-1 text-sm font-medium text-slate-200">{entry.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
