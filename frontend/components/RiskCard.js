const severityStyles = {
  low: 'text-emerald-400 bg-emerald-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  high: 'text-red-400 bg-red-400/10',
};

export default function RiskCard({ risk }) {
  const severity = risk.severity || 'medium';

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{risk.title}</h3>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${severityStyles[severity]}`}>
          {severity}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{risk.description}</p>
      {risk.mitigation ? (
        <p className="mt-4 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Mitigation:</span> {risk.mitigation}
        </p>
      ) : null}
    </article>
  );
}
