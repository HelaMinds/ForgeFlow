'use client';

import Link from 'next/link';
import { derivePlanTitle } from '../lib/planDisplay';
import { downloadPlanMarkdown } from '../lib/exportPlan';
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
        {finalPlan ? (
          <button
            type="button"
            onClick={() => downloadPlanMarkdown({ finalPlan, clarified, idea })}
            className="btn-secondary px-4 py-2 text-sm"
            aria-label="Export plan as Markdown"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
              <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
            </svg>
            <span className="hidden sm:inline">Export</span>
          </button>
        ) : null}
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
