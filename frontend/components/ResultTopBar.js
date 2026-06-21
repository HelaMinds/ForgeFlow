import Link from 'next/link';
import { derivePlanTitle } from '../lib/planDisplay';
import ThemeToggle from './ThemeToggle';

export default function ResultTopBar({ finalPlan, clarified, idea }) {
  const title = derivePlanTitle({ finalPlan, clarified, idea });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 py-3.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/" aria-label="ForgeFlow home" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" aria-hidden="true">
            <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" fill="currentColor" />
          </svg>
        </Link>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">ForgeFlow</p>
          <h1 className="truncate text-base font-bold text-slate-900 dark:text-white sm:text-lg">{title}</h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <Link href="/" className="btn-secondary px-4 py-2 text-sm">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          <span className="hidden sm:inline">New idea</span>
        </Link>
      </div>
    </header>
  );
}
