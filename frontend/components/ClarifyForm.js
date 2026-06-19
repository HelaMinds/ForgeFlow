'use client';

import { useState } from 'react';

export default function ClarifyForm({ questions, onSubmit, loading }) {
  const [answers, setAnswers] = useState(() =>
    Object.fromEntries(questions.map((question) => [question.id, ''])),
  );

  function handleChange(id, value) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    const trimmedAnswers = Object.fromEntries(
      Object.entries(answers).map(([id, value]) => [id, value.trim()]),
    );

    onSubmit(trimmedAnswers);
  }

  const allAnswered = questions.every((question) => answers[question.id]?.trim());

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question) => (
        <label key={question.id} className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">{question.text}</span>
          <textarea
            value={answers[question.id]}
            onChange={(event) => handleChange(question.id, event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100 outline-none ring-orange-500 focus:ring-2"
            placeholder="Your answer..."
          />
        </label>
      ))}

      <button
        type="submit"
        disabled={loading || !allAnswered}
        className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Building plan...' : 'Generate Plan'}
      </button>
    </form>
  );
}
