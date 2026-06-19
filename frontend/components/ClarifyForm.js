'use client';

import { useState } from 'react';

function QuestionField({ question, value, onChange }) {
  if (question.type === 'choice' && question.options?.length) {
    return (
      <div className="space-y-2">
        {question.options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 transition hover:border-slate-700"
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="accent-orange-500"
            />
            <span className="text-sm text-slate-200">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={3}
      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100 outline-none ring-orange-500 focus:ring-2"
      placeholder="Your answer..."
    />
  );
}

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
      {questions.map((question, index) => (
        <fieldset key={question.id} className="space-y-3">
          <legend className="text-sm font-medium text-slate-200">
            {index + 1}. {question.text}
          </legend>
          <QuestionField
            question={question}
            value={answers[question.id]}
            onChange={(value) => handleChange(question.id, value)}
          />
        </fieldset>
      ))}

      <button
        type="submit"
        disabled={loading || !allAnswered}
        className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Building plan...' : 'Continue'}
      </button>
    </form>
  );
}
