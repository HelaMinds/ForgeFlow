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
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Idea type</span>
        <select
          value={ideaType}
          onChange={(event) => setIdeaType(event.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-100 outline-none ring-orange-500 focus:ring-2"
        >
          {IDEA_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
        {selectedType?.description ? (
          <p className="text-xs leading-relaxed text-slate-500">{selectedType.description}</p>
        ) : null}
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Your idea</span>
        <textarea
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="Describe your idea..."
          rows={6}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100 outline-none ring-orange-500 focus:ring-2"
        />
      </label>

      <button
        type="submit"
        disabled={loading || !idea.trim()}
        className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Running Clarifier agent...' : 'Continue to clarify'}
      </button>
    </form>
  );
}
