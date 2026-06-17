export default function PlanCard({ step, index }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs uppercase tracking-widest text-orange-400">Step {index}</p>
      <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
      <p className="mt-2 text-sm text-slate-400">{step.description}</p>
      {step.timeframe ? (
        <p className="mt-4 text-xs text-slate-500">{step.timeframe}</p>
      ) : null}
    </article>
  );
}
