'use client';

import Link from 'next/link';

export default function PathSummaryCard({ finalPlan, selectedPath, pathApplyMessage }) {
  const pathOptions = finalPlan?.pathOptions || [];
  const activePath = selectedPath || finalPlan?.selectedPath;

  if (!pathOptions.length && !activePath) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 p-5 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-violet-500/5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-soft">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">
              Strategic path
            </p>
            {activePath ? (
              <>
                <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">{activePath.title}</p>
                {pathApplyMessage ? (
                  <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">{pathApplyMessage}</p>
                ) : (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Your timeline and tasks reflect this approach.
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">Baseline plan</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  You skipped path selection — pick one to reshape the roadmap.
                </p>
              </>
            )}
          </div>
        </div>
        {pathOptions.length ? (
          <Link
            href="/choose-path"
            className="btn-secondary shrink-0 px-4 py-2 text-sm"
          >
            {activePath ? 'Change path' : 'Choose a path'}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
