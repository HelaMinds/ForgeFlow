import Link from 'next/link';
import { derivePlanTitle } from '../lib/planDisplay';

export default function ResultTopBar({ finalPlan, clarified, idea }) {
  const title = derivePlanTitle({ finalPlan, clarified, idea });

  return (
    <header className="flex items-center justify-between gap-4 border-b border-riso-border bg-riso-card px-4 py-3.5 sm:px-6">
      <div className="min-w-0 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-riso-coral shadow-riso">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-4 w-4">
            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-riso-coral">
            ForgeFlow
          </p>
          <h1 className="truncate text-base font-bold text-riso-ink sm:text-lg">{title}</h1>
        </div>
      </div>
      <Link
        href="/"
        className="shrink-0 rounded-lg border border-riso-border bg-riso-paper px-4 py-2 text-sm font-medium text-riso-muted transition hover:border-riso-coral/40 hover:text-riso-ink shadow-riso"
      >
        New idea
      </Link>
    </header>
  );
}
