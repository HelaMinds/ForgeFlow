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
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-riso-ink">Idea type</span>
        <select
          value={ideaType}
          onChange={(e) => setIdeaType(e.target.value)}
          className="w-full rounded-xl border border-riso-border bg-riso-paper px-3 py-2.5 text-sm text-riso-ink outline-none focus:border-riso-coral focus:ring-2 focus:ring-riso-coral/20"
        >
          {IDEA_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
        {selectedType?.description ? (
          <p className="text-xs leading-relaxed text-riso-faint">{selectedType.description}</p>
        ) : null}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-riso-ink">Your idea</span>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your idea in a few sentences…"
          rows={5}
          className="w-full rounded-xl border border-riso-border bg-riso-paper px-4 py-3 text-sm text-riso-ink outline-none placeholder:text-riso-faint focus:border-riso-coral focus:ring-2 focus:ring-riso-coral/20"
        />
      </label>

      <button
        type="submit"
        disabled={loading || !idea.trim()}
        className="rounded-xl bg-riso-coral px-6 py-3 font-semibold text-white shadow-riso-btn transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? 'Running Clarifier agent…' : 'Continue to clarify →'}
      </button>
    </form>
  );
}
