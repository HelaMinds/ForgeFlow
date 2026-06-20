'use client';

import PlanChatPanel from './PlanChatPanel';

function StatPill({ label, value }) {
  return (
    <div className="flex flex-col rounded-lg border border-riso-border bg-riso-paper px-3 py-2">
      <span className="text-[9px] font-semibold uppercase tracking-widest text-riso-faint">{label}</span>
      <span className="mt-0.5 text-sm font-semibold text-riso-ink">{value || '—'}</span>
    </div>
  );
}

export default function PlanSummaryPanel({ result, onPlanUpdate }) {
  if (!result) return null;

  const { finalPlan } = result;
  const phaseCount = finalPlan?.roadmap?.length;
  const duration = finalPlan?.timeline?.totalDuration;
  const firstAction = finalPlan?.firstAction;

  return (
    <div className="flex h-full flex-col border-l border-riso-border bg-riso-card">
      {/* Header */}
      <div className="border-b border-riso-border px-4 py-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-riso-coral">
          Execution Plan
        </p>
        <h2 className="mt-0.5 text-sm font-semibold text-riso-ink">Plan at a Glance</h2>
      </div>

      {/* Stats */}
      {(phaseCount || duration) ? (
        <div className="grid grid-cols-2 gap-2 border-b border-riso-border px-4 py-3">
          {phaseCount ? <StatPill label="Phases" value={phaseCount} /> : null}
          {duration ? <StatPill label="Timeline" value={duration} /> : null}
        </div>
      ) : null}

      {/* First action */}
      {firstAction ? (
        <div className="border-b border-riso-border px-4 py-4">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-riso-coral text-[8px] font-bold text-white">
              1
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-riso-coral">
              Start here
            </p>
          </div>
          <p className="text-xs leading-relaxed text-riso-ink">{firstAction}</p>
        </div>
      ) : null}

      {/* Chat — fills remainder */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <PlanChatPanel result={result} onPlanUpdate={onPlanUpdate} />
      </div>
    </div>
  );
}
