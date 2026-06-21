const severityStyles = {
  low: {
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    accent: 'bg-emerald-400',
  },
  medium: {
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    accent: 'bg-amber-400',
  },
  high: {
    badge: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
    accent: 'bg-rose-500',
  },
};

export default function RiskCard({ risk }) {
  const severity = risk.severity || 'medium';
  const styles = severityStyles[severity] || severityStyles.medium;

  return (
    <article className="relative overflow-hidden card p-5">
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${styles.accent}`} />
      <div className="flex items-start justify-between gap-3 pl-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{risk.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles.badge}`}>
          {severity}
        </span>
      </div>
      <p className="mt-2 pl-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{risk.description}</p>
      {risk.mitigation ? (
        <div className="mt-4 ml-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Mitigation</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{risk.mitigation}</p>
        </div>
      ) : null}
    </article>
  );
}
