export default function IdeaApprovedBanner({ assessment }) {
  if (!assessment || assessment.verdict !== 'proceed') {
    return null;
  }

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3.5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Assessor: looks workable</p>
        <p className="mt-0.5 text-sm text-emerald-700 dark:text-emerald-300">
          {assessment.headline || 'Your idea is clear enough to plan. Answer the questions below.'}
        </p>
      </div>
    </div>
  );
}
