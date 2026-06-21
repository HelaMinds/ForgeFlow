import { isUserAnswerConstraint, normalizeReasoningList } from '../lib/reasoningUtils';

function ReasoningBlock({ title, items, emptyText, tone = 'default' }) {
  const toneClasses = {
    default: 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/50',
    warning: 'border-amber-200 bg-amber-50/60 dark:border-amber-500/25 dark:bg-amber-500/10',
    question: 'border-indigo-200 bg-indigo-50/60 dark:border-indigo-500/25 dark:bg-indigo-500/10',
  };

  const normalizedItems = normalizeReasoningList(items);

  return (
    <section className={`rounded-xl border p-4 ${toneClasses[tone]}`}>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{title}</h3>
      {normalizedItems.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {normalizedItems.map((item, index) => (
            <li key={`${title}-${index}-${item}`} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">{emptyText}</p>
      )}
    </section>
  );
}

export default function ReasoningPanel({ reasoning, clarified }) {
  const data = reasoning || {};
  const goals = data.goals?.length ? data.goals : clarified?.goals || [];
  const constraints = (data.constraints?.length ? data.constraints : clarified?.constraints || []).filter(
    isUserAnswerConstraint,
  );
  const openQuestions = data.openQuestions?.length
    ? data.openQuestions
    : (data.questions || []).map((question) =>
        typeof question === 'string' ? question : question.text,
      ).filter(Boolean);
  const assumptions = data.assumptions || [];
  const dependencies = data.dependencies || [];
  const weakAssumptions = data.weakAssumptions || [];
  const failureModes = data.failureModes || [];

  const hasContent =
    normalizeReasoningList(goals).length +
      normalizeReasoningList(constraints).length +
      normalizeReasoningList(openQuestions).length +
      normalizeReasoningList(assumptions).length +
      normalizeReasoningList(dependencies).length +
      normalizeReasoningList(weakAssumptions).length +
      normalizeReasoningList(failureModes).length >
    0;

  if (!hasContent) {
    return null;
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Agent reasoning</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          What the pipeline inferred, questioned, and challenged before producing your roadmap.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReasoningBlock title="Goals detected" items={goals} emptyText="No goals extracted." />
        <ReasoningBlock title="Constraints" items={constraints} emptyText="No constraints identified." />
        <ReasoningBlock
          title="Open questions (pre-answers)"
          items={openQuestions}
          emptyText="All questions were answered."
          tone="question"
        />
        <ReasoningBlock
          title="Planner assumptions"
          items={assumptions}
          emptyText="No extra assumptions beyond your answers."
        />
        <ReasoningBlock title="Dependencies" items={dependencies} emptyText="No cross-phase dependencies noted." />
        <ReasoningBlock
          title="Weak assumptions"
          items={weakAssumptions}
          emptyText="No weak assumptions flagged."
          tone="warning"
        />
      </div>

      {normalizeReasoningList(failureModes).length > 0 ? (
        <div className="mt-4">
          <ReasoningBlock title="Failure modes" items={failureModes} emptyText="" tone="warning" />
        </div>
      ) : null}
    </section>
  );
}
