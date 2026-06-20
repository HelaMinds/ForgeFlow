import Link from 'next/link';
import { derivePlanTitle } from '../lib/planDisplay';

export default function ResultTopBar({ finalPlan, clarified, idea }) {
  const title = derivePlanTitle({ finalPlan, clarified, idea });

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-4 py-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/90">
          ForgeFlow
        </p>
        <h1 className="truncate text-lg font-bold text-white sm:text-xl">{title}</h1>
      </div>
      <Link
        href="/"
        className="shrink-0 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
      >
        New idea
      </Link>
    </header>
  );
}
