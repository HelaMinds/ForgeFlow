import { isUserAnswerConstraint, normalizeReasoningList } from '../lib/reasoningUtils';

const toneClasses = {
  default: 'border-riso-border bg-riso-paper',
  warning: 'border-riso-yellow/25 bg-riso-yellow-light',
  question: 'border-riso-blue/25 bg-riso-blue-light',
};

function ReasoningBlock({ title, items, emptyText, tone = 'default' }) {
  const normalizedItems = normalizeReasoningList(items);

  return (
    <section className={`rounded-xl border p-4 ${toneClasses[tone]}`}>
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-riso-faint">{title}</h3>
      {normalizedItems.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {normalizedItems.map((item, index) => (
            <li key={`${title}-${index}-${item}`} className="text-sm leading-relaxed text-riso-ink">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-riso-faint">{emptyText}</p>
      )}
    </section>
  );
}

export default function ReasoningPanel({ reasoning, clarified }) {
  const data = reasoning || {};
  const goals = data.goals?.length ? data.goals : clarified?.goals || [];
  const constraints = (data.constraints?.length ? data.constraints : clarified?.constraints || []).filter(isUserAnswerConstraint);
  const openQuestions = data.openQuestions?.length
    ? data.openQuestions
    : (data.questions || []).map((q) => (typeof q === 'string' ? q : q.text)).filter(Boolean);
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

  if (!hasContent) return null;

  return (
    <section className="rounded-2xl border border-riso-border bg-riso-card p-5 shadow-riso sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-riso-ink">Agent reasoning</h2>
        <p className="mt-1 text-sm text-riso-muted">
          What the pipeline inferred, questioned, and challenged before producing your roadmap.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReasoningBlock title="Goals detected" items={goals} emptyText="No goals extracted." />
        <ReasoningBlock title="Constraints" items={constraints} emptyText="No constraints identified." />
        <ReasoningBlock title="Open questions (pre-answers)" items={openQuestions} emptyText="All questions were answered." tone="question" />
        <ReasoningBlock title="Planner assumptions" items={assumptions} emptyText="No extra assumptions beyond your answers." />
        <ReasoningBlock title="Dependencies" items={dependencies} emptyText="No cross-phase dependencies noted." />
        <ReasoningBlock title="Weak assumptions" items={weakAssumptions} emptyText="No weak assumptions flagged." tone="warning" />
      </div>

      {normalizeReasoningList(failureModes).length > 0 ? (
        <div className="mt-4">
          <ReasoningBlock title="Failure modes" items={failureModes} emptyText="" tone="warning" />
        </div>
      ) : null}
    </section>
  );
}
