const severityStyles = {
  low: 'text-riso-green bg-riso-green-light border-riso-green/20',
  medium: 'text-riso-yellow bg-riso-yellow-light border-riso-yellow/20',
  high: 'text-riso-coral bg-riso-coral-light border-riso-coral/20',
};

export default function RiskCard({ risk }) {
  const severity = risk.severity || 'medium';

  return (
    <article className="riso-card p-5 transition hover:shadow-riso-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-riso-ink">{risk.title}</h3>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${severityStyles[severity] || severityStyles.medium}`}>
          {severity}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-riso-muted">{risk.description}</p>
      {risk.mitigation ? (
        <div className="mt-4 rounded-lg border border-riso-border bg-riso-paper px-3 py-2.5">
          <p className="text-sm text-riso-ink">
            <span className="font-semibold text-riso-ink">Mitigation: </span>
            {risk.mitigation}
          </p>
        </div>
      ) : null}
    </article>
  );
}
