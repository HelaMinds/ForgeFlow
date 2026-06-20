'use client';

import { useEffect, useState } from 'react';

export default function PathDecisionPanel({
  pathOptions,
  selectedPath,
  onApply,
  appliedMessage,
}) {
  const [choice, setChoice] = useState(selectedPath?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setChoice(selectedPath?.id || '');
  }, [selectedPath?.id]);

  if (!pathOptions?.length) {
    return null;
  }

  async function handleConfirm() {
    if (!choice || loading) {
      return;
    }

    const path = pathOptions.find((option) => option.id === choice);
    if (!path) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onApply(path);
    } catch (err) {
      setError(err.message || 'Could not apply path');
    } finally {
      setLoading(false);
    }
  }

  const isApplied = selectedPath?.id && choice === selectedPath.id;

  return (
    <section className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-5 sm:p-6">
      <div className="space-y-3" role="radiogroup" aria-label="Strategic path options">
        {pathOptions.map((option) => {
          const isSelected = choice === option.id;
          const isActivePath = selectedPath?.id === option.id;

          return (
            <label
              key={option.id}
              className={`block cursor-pointer rounded-xl border p-4 transition ${
                isSelected
                  ? 'border-sky-500/50 bg-slate-950/80 ring-1 ring-sky-500/30'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="pathOption"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => setChoice(option.id)}
                  disabled={loading}
                  className="mt-1 accent-sky-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-100">{option.title}</p>
                    {isActivePath ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        Active plan
                      </span>
                    ) : null}
                  </div>
                  {option.description ? (
                    <p className="mt-1 text-sm text-slate-400">{option.description}</p>
                  ) : null}
                  {option.tradeoffs ? (
                    <p className="mt-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-400">Trade-offs: </span>
                      {option.tradeoffs}
                    </p>
                  ) : null}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!choice || loading}
        className="mt-5 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Adapting your plan…' : isApplied ? 'Re-apply this path' : 'Apply this path'}
      </button>

      {appliedMessage ? (
        <div className="mt-4 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
          <p className="text-sm text-emerald-300">{appliedMessage}</p>
        </div>
      ) : null}
    </section>
  );
}
