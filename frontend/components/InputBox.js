'use client';

import { useState } from 'react';
import { IDEA_TYPES } from '../lib/api';

export default function InputBox({ onSubmit, loading }) {
  const [idea, setIdea] = useState('');
  const [ideaType, setIdeaType] = useState(IDEA_TYPES[0].id);

  const selectedType = IDEA_TYPES.find((type) => type.id === ideaType);

  function handleSubmit(event) {
    event.preventDefault();
    if (!idea.trim() || loading) return;
    onSubmit({ idea: idea.trim(), ideaType });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Idea type</span>
        <div className="grid grid-cols-3 gap-2">
          {IDEA_TYPES.map((type) => {
            const isSelected = type.id === ideaType;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setIdeaType(type.id)}
                aria-pressed={isSelected}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-orange-300 bg-orange-50 text-orange-700 shadow-soft ring-1 ring-orange-200 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
        {selectedType?.description ? (
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{selectedType.description}</p>
        ) : null}
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Your idea</span>
        <textarea
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="e.g. A mobile app that helps people track their daily water intake and build a hydration habit…"
          rows={5}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-slate-900 placeholder:text-slate-400 shadow-soft outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-orange-500 dark:focus:ring-orange-500/30"
        />
      </label>

      <button
        type="submit"
        disabled={loading || !idea.trim()}
        suppressHydrationWarning
        className="btn-primary w-full"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
            </svg>
            Running Clarifier agent…
          </>
        ) : (
          <>
            Continue to clarify
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
