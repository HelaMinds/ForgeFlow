'use client';

import { useState } from 'react';

function QuestionField({ question, value, onChange }) {
  return (
    <div className="grid gap-2 sm:grid-cols-1">
      {question.options.map((option) => {
        const isSelected = value === option;

        return (
          <label
            key={option}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition ${
              isSelected
                ? 'border-orange-500/60 bg-orange-500/10 ring-1 ring-orange-500/30'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={isSelected}
              onChange={() => onChange(option)}
              className="mt-0.5 accent-orange-500"
            />
            <span className={`text-sm leading-relaxed ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
              {option}
            </span>
          </label>
        );
      })}
    </div>
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

    onSubmit({ ...answers });
  }

  const allAnswered = questions.every((question) => answers[question.id]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map((question, index) => (
        <fieldset key={question.id} className="space-y-3">
          <legend className="text-base font-medium leading-snug text-slate-100">
            {index + 1}. {question.text}
          </legend>
          <p className="text-xs text-slate-500">Select one option</p>
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
