'use client';

import { useEffect, useMemo, useState } from 'react';

function buildSuggestions(assessment, limit) {
  const suggestions = [];

  if (assessment?.saferAlternative?.summary) {
    suggestions.push(assessment.saferAlternative.summary);
  }

  if (assessment?.recommendation) {
    suggestions.push(assessment.recommendation);
  }

  for (const concern of assessment?.concerns || []) {
    if (concern.detail && concern.detail.length < 120) {
      suggestions.push(concern.detail);
    }
  }

  const fallbacks = [
    'Focus on one specific pain point instead of the whole market',
    'Define a narrow target customer and the single problem you solve first',
    'Scope an MVP with 2–3 core features only',
  ];

  for (const item of fallbacks) {
    if (!suggestions.includes(item)) {
      suggestions.push(item);
    }
  }

  return suggestions.slice(0, limit);
}

export default function IdeaRefinePanel({
  idea,
  assessment,
  onRefine,
  onContinue,
  refining = false,
  hasReanalyzed = false,
}) {
  const [draft, setDraft] = useState(idea || '');
  const [editing, setEditing] = useState(false);

  const suggestions = useMemo(
    () => buildSuggestions(assessment, hasReanalyzed ? 2 : 4),
    [assessment, hasReanalyzed],
  );

  useEffect(() => {
    setDraft(idea || '');
    setEditing(false);
  }, [idea]);

  function handleSuggestionClick(text) {
    setDraft((current) => {
      const trimmed = current.trim();
      if (!trimmed) {
        return text;
      }
      if (trimmed.includes(text)) {
        return current;
      }
      return `${trimmed} ${text}`;
    });
    setEditing(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || refining) {
      return;
    }
    onRefine(trimmed);
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Refine your idea
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Edit your idea or add a useful suggestion, then re-analyze it.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className={`rounded-xl border bg-white p-1.5 shadow-soft transition dark:bg-slate-950 ${
            editing
              ? 'border-orange-400 ring-2 ring-orange-200 dark:border-orange-500 dark:ring-orange-500/30'
              : 'border-slate-200 dark:border-slate-700'
          }`}
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            readOnly={!editing}
            rows={4}
            placeholder="Describe your idea..."
            className={`w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-relaxed text-slate-900 outline-none dark:text-slate-100 ${
              editing ? '' : 'cursor-default text-slate-700 dark:text-slate-300'
            }`}
          />
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-2 py-1.5 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditing((current) => !current)}
              disabled={refining}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="m2.695 14.762-1.262 3.34a.75.75 0 0 0 1.017 1.017l3.34-1.262a4.5 4.5 0 0 0 2.122-2.122L14.25 7.5V4.75a.75.75 0 0 0-.75-.75h-2.75L2.695 14.762Zm13.418-9.327a1.5 1.5 0 0 0-2.12-2.12l-1.22 1.22 2.12 2.12 1.22-1.22Z" />
              </svg>
              {editing ? 'Done editing' : 'Edit'}
            </button>
            <button
              type="submit"
              disabled={!draft.trim() || refining || draft.trim() === idea?.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {refining ? 'Re-analyzing...' : 'Re-analyze idea'}
            </button>
          </div>
        </div>
      </form>

      {!hasReanalyzed && suggestions.length ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Suggestions to add:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={refining}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs leading-relaxed text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-orange-500/40 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {hasReanalyzed ? 'Your revised idea is ready for the next step.' : 'You can continue without making changes.'}
        </p>
        <button
          type="button"
          onClick={onContinue}
          disabled={refining}
          className="btn-secondary shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {hasReanalyzed ? 'Continue' : 'Skip review & continue'}
        </button>
      </div>

      {hasReanalyzed && suggestions.length ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Optional final touches:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={refining}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs leading-relaxed text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-orange-500/40 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
