'use client';

import { useEffect, useState } from 'react';

export default function PathDecisionPanel({ pathOptions, selectedPath, onApply, appliedMessage }) {
  const [choice, setChoice] = useState(selectedPath?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setChoice(selectedPath?.id || '');
  }, [selectedPath?.id]);

  if (!pathOptions?.length) return null;

  async function handleConfirm() {
    if (!choice || loading) return;
    const path = pathOptions.find((o) => o.id === choice);
    if (!path) return;
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
    <section className="rounded-2xl border border-riso-blue/20 bg-riso-blue-light p-5 shadow-riso sm:p-6">
      <div className="space-y-3" role="radiogroup" aria-label="Strategic path options">
        {pathOptions.map((option) => {
          const isSelected = choice === option.id;
          const isActivePath = selectedPath?.id === option.id;

          return (
            <label
              key={option.id}
              className={`block cursor-pointer rounded-xl border p-4 transition ${
                isSelected
                  ? 'border-riso-blue/40 bg-white shadow-riso'
                  : 'border-riso-border bg-white hover:border-riso-blue/30 hover:shadow-riso'
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
                  className="mt-1 accent-[#2860A0]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-riso-ink">{option.title}</p>
                    {isActivePath ? (
                      <span className="rounded-full border border-riso-green/25 bg-riso-green-light px-2 py-0.5 text-xs font-semibold text-riso-green">
                        Active plan
                      </span>
                    ) : null}
                  </div>
                  {option.description ? (
                    <p className="mt-1 text-sm text-riso-muted">{option.description}</p>
                  ) : null}
                  {option.tradeoffs ? (
                    <p className="mt-2 text-xs text-riso-faint">
                      <span className="font-semibold text-riso-muted">Trade-offs: </span>
                      {option.tradeoffs}
                    </p>
                  ) : null}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!choice || loading}
        className="mt-5 rounded-xl bg-riso-blue px-5 py-2.5 text-sm font-semibold text-white shadow-riso-btn transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? 'Adapting your plan…' : isApplied ? 'Re-apply this path' : 'Apply this path'}
      </button>

      {appliedMessage ? (
        <div className="mt-4 rounded-xl border border-riso-green/25 bg-riso-green-light px-4 py-3">
          <p className="text-sm text-riso-green">{appliedMessage}</p>
        </div>
      ) : null}
    </section>
  );
}
