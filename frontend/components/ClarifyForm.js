'use client';

import { useState } from 'react';

function QuestionField({ question, value, onChange }) {
  return (
    <div className="grid gap-2">
      {question.options.map((option) => {
        const isSelected = value === option;
        return (
          <label
            key={option}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition ${
              isSelected
                ? 'border-riso-coral bg-riso-coral-light shadow-riso'
                : 'border-riso-border bg-riso-card hover:border-riso-coral/30 hover:bg-riso-coral-light/30'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={isSelected}
              onChange={() => onChange(option)}
              className="mt-0.5 accent-[#D95B2A]"
            />
            <span className={`text-sm leading-relaxed ${isSelected ? 'font-medium text-riso-ink' : 'text-riso-muted'}`}>
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
    Object.fromEntries(questions.map((q) => [q.id, ''])),
  );

  function handleChange(id, value) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    onSubmit({ ...answers });
  }

  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map((question, index) => (
        <fieldset key={question.id} className="space-y-3">
          <legend className="text-base font-semibold leading-snug text-riso-ink">
            {index + 1}. {question.text}
          </legend>
          <p className="text-xs text-riso-faint">Select one option</p>
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
        className="rounded-xl bg-riso-coral px-6 py-3 font-semibold text-white shadow-riso-btn transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? 'Building plan…' : 'Continue →'}
      </button>
    </form>
  );
}
