const VERDICT_META = {
  proceed: {
    label: 'Looks workable',
    tone: 'emerald',
    blurb: 'No major blockers found. Review the notes below, then continue.',
  },
  caution: {
    label: 'Proceed with caution',
    tone: 'amber',
    blurb: 'This idea is workable, but there are serious concerns worth weighing before you commit.',
  },
  reframe: {
    label: 'Worth reframing first',
    tone: 'rose',
    blurb: 'As described, this idea has fundamental issues. Consider the tighter version below — or continue anyway if this is really what you want.',
  },
  refuse_framing: {
    label: 'Honest assessment',
    tone: 'rose',
    blurb: 'ForgeFlow only gives honest feedback — it can’t skip the criticism. Here’s a straight assessment.',
  },
};

const TONE = {
  emerald: {
    card: 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-500/10',
    chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  amber: {
    card: 'border-amber-200 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-500/10',
    chip: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  rose: {
    card: 'border-rose-200 bg-rose-50/70 dark:border-rose-500/30 dark:bg-rose-500/10',
    chip: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
};

const SEVERITY_CHIP = {
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export default function IdeaReviewPanel({ assessment }) {
  if (!assessment) return null;

  const meta = VERDICT_META[assessment.verdict] || VERDICT_META.caution;
  const tone = TONE[meta.tone];
  const { concerns = [], saferAlternative, recommendation, headline, injectionDetected } = assessment;

  return (
    <section className={`mb-6 rounded-2xl border p-5 shadow-soft sm:p-6 ${tone.card}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Idea review
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tone.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
          {meta.label}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200">{headline || meta.blurb}</p>
      {headline ? (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{meta.blurb}</p>
      ) : null}

      {injectionDetected ? (
        <p className="mt-3 rounded-lg border border-slate-300/60 bg-white/60 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
          Note: the idea text asked ForgeFlow to skip criticism or only respond positively. That
          request was ignored — the assessment below is unfiltered.
        </p>
      ) : null}

      {concerns.length ? (
        <ul className="mt-4 space-y-2.5">
          {concerns.map((concern) => (
            <li
              key={`${concern.title}-${concern.dimension}`}
              className="rounded-xl border border-white/60 bg-white/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${SEVERITY_CHIP[concern.severity] || SEVERITY_CHIP.medium}`}>
                  {concern.severity}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {concern.dimension}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{concern.title}</span>
              </div>
              {concern.detail && concern.detail !== concern.title ? (
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{concern.detail}</p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {saferAlternative ? (
        <div className="mt-4 rounded-xl border border-slate-300/60 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            A tighter version to consider
          </p>
          <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">{saferAlternative.summary}</p>
          {saferAlternative.why ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{saferAlternative.why}</p>
          ) : null}
        </div>
      ) : null}

      {recommendation ? (
        <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
          <span className="font-semibold">Recommendation:</span> {recommendation}
        </p>
      ) : null}
    </section>
  );
}
