export default function ResponsibleAiNotice({ confidenceNote, variant = 'default' }) {
  const isCompact = variant === 'compact';

  return (
    <aside
      className={`rounded-xl border border-riso-border bg-riso-sidebar ${isCompact ? 'px-4 py-3' : 'p-5'}`}
      role="note"
      aria-label="AI disclaimer"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-riso-border bg-riso-card text-riso-muted shadow-riso"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <div className="min-w-0">
          <p className={`font-semibold text-riso-ink ${isCompact ? 'text-sm' : 'text-base'}`}>
            Decision support, not advice
          </p>
          <p className={`mt-1 text-riso-muted ${isCompact ? 'text-xs' : 'text-sm'}`}>
            ForgeFlow helps you think through an idea with structured AI analysis. You stay in
            control — verify assumptions, adjust scope, and decide whether to act.
          </p>
          {confidenceNote ? (
            <p className={`mt-3 border-t border-riso-border pt-3 text-riso-muted ${isCompact ? 'text-xs' : 'text-sm'}`}>
              <span className="font-semibold text-riso-ink">Confidence note: </span>
              {confidenceNote}
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
