'use client';

import { useEffect, useState } from 'react';

export default function PathDecisionPanel({
  pathOptions,
  selectedPath,
  onApply,
  onContinue,
  onSkip,
  appliedMessage,
  variant = 'inline',
  loading: externalLoading = false,
}) {
  const [choice, setChoice] = useState(selectedPath?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isStep = variant === 'step';
  const isBusy = loading || externalLoading;

  useEffect(() => {
    setChoice(selectedPath?.id || '');
  }, [selectedPath?.id]);

  if (!pathOptions?.length) {
    return null;
  }

  const selectedOption = pathOptions.find((option) => option.id === choice);

  async function handleConfirm() {
    if (!choice || isBusy) {
      return;
    }

    const path = pathOptions.find((option) => option.id === choice);
    if (!path) {
      return;
    }

    if (isStep && onContinue) {
      await onContinue(path);
      return;
    }

    if (!onApply) {
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
    <section
      className={
        isStep
          ? 'space-y-4'
          : 'rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-soft dark:border-indigo-500/25 dark:bg-indigo-500/5 sm:p-6'
      }
    >
      {!isStep ? (
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Choose your strategic path</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Pick an approach — the plan will adapt your timeline, tasks, and first action to match.
          </p>
        </div>
      ) : null}

      <div className="space-y-3" role="radiogroup" aria-label="Strategic path options">
        {pathOptions.map((option) => {
          const isSelected = choice === option.id;
          const isActivePath = selectedPath?.id === option.id;

          return (
            <label
              key={option.id}
              className={`block cursor-pointer rounded-xl border p-4 transition-all ${
                isSelected
                  ? 'border-indigo-400 bg-white shadow-soft ring-1 ring-indigo-300 dark:border-indigo-500/50 dark:bg-slate-900 dark:ring-indigo-500/40'
                  : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                  }`}
                >
                  {isSelected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                </span>
                <input
                  type="radio"
                  name="pathOption"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => setChoice(option.id)}
                  disabled={isBusy}
                  className="sr-only"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white">{option.title}</p>
                    {isActivePath && !isStep ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : null}
                  </div>
                  {option.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{option.description}</p>
                  ) : null}
                  {option.tradeoffs ? (
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/80 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Trade-off: </span>
                      {option.tradeoffs}
                    </p>
                  ) : null}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      <div className={`flex flex-col gap-3 sm:flex-row sm:items-center ${isStep ? 'pt-2' : 'mt-5'}`}>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!choice || isBusy}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isBusy ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
              </svg>
              Shaping your plan…
            </>
          ) : isStep ? (
            selectedOption ? `Continue with ${selectedOption.title}` : 'Select a path to continue'
          ) : isApplied ? (
            'Re-apply this path'
          ) : (
            'Apply this path'
          )}
        </button>

        {isStep && onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            disabled={isBusy}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600"
          >
            View baseline plan
          </button>
        ) : null}
      </div>

      {!isStep && appliedMessage ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">{appliedMessage}</p>
        </div>
      ) : null}
    </section>
  );
}
