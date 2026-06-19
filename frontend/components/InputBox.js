'use client';

import { useState } from 'react';

export default function InputBox({ onSubmit, loading }) {
  const [idea, setIdea] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!idea.trim() || loading) return;
    onSubmit(idea.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
        placeholder="Describe your idea..."
        rows={6}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100 outline-none ring-orange-500 focus:ring-2"
      />
      <button
        type="submit"
        disabled={loading || !idea.trim()}
        className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Analyzing idea...' : 'Continue'}
      </button>
    </form>
  );
}
