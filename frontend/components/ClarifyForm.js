'use client';

import { useState } from 'react';

const OTHER = '__other__';

function OptionRow({ name, label, selected, onSelect }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all ${
        selected
          ? 'border-orange-300 bg-orange-50 shadow-soft ring-1 ring-orange-200 dark:border-orange-500/40 dark:bg-orange-500/10 dark:ring-orange-500/30'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:hover:bg-slate-800/50'
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          selected ? 'border-orange-500 bg-orange-500' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'
        }`}
      >
        {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </span>
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="sr-only" />
      <span className={`text-sm leading-relaxed ${selected ? 'font-medium text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
        {label}
      </span>
    </label>
  );
}

function QuestionField({ question, choice, customText, onSelect, onCustom }) {
  const isOther = choice === OTHER;

  return (
    <div className="grid gap-2.5">
      {question.options.map((option) => (
        <OptionRow
          key={option}
          name={question.id}
          label={option}
          selected={choice === option}
          onSelect={() => onSelect(option)}
        />
      ))}

      {/* Always-present "type your own" choice as the final option */}
      <div
        className={`rounded-xl border transition-all ${
          isOther
            ? 'border-orange-300 bg-orange-50 shadow-soft ring-1 ring-orange-200 dark:border-orange-500/40 dark:bg-orange-500/10 dark:ring-orange-500/30'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:hover:bg-slate-800/50'
        }`}
      >
        <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
              isOther ? 'border-orange-500 bg-orange-500' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'
            }`}
          >
            {isOther ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
          </span>
          <input
            type="radio"
            name={question.id}
            checked={isOther}
            onChange={() => onSelect(OTHER)}
            className="sr-only"
          />
          <span className={`text-sm leading-relaxed ${isOther ? 'font-medium text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
            Other: type your own answer
          </span>
        </label>

        {isOther ? (
          <div className="px-4 pb-4">
            <input
              type="text"
              autoFocus
              value={customText}
              onChange={(event) => onCustom(event.target.value)}
              onFocus={() => onSelect(OTHER)}
              placeholder="Type your answer…"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-orange-500 dark:focus:ring-orange-500/30"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ClarifyForm({ questions, onSubmit, loading }) {
  const [choices, setChoices] = useState(() =>
    Object.fromEntries(questions.map((question) => [question.id, ''])),
  );
  const [customText, setCustomText] = useState(() =>
    Object.fromEntries(questions.map((question) => [question.id, ''])),
  );

  function selectOption(id, value) {
    setChoices((current) => ({ ...current, [id]: value }));
  }

  function setCustom(id, text) {
    setCustomText((current) => ({ ...current, [id]: text }));
  }

  function answerFor(question) {
    const choice = choices[question.id];
    if (choice === OTHER) return (customText[question.id] || '').trim();
    return choice;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (loading || !allAnswered) return;

    const finalAnswers = Object.fromEntries(
      questions.map((question) => [question.id, answerFor(question)]),
    );
    onSubmit(finalAnswers);
  }

  const answeredCount = questions.filter((question) => answerFor(question)).length;
  const allAnswered = answeredCount === questions.length;
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Your progress</span>
          <span className="font-medium text-slate-500 dark:text-slate-400">
            {answeredCount} of {questions.length} answered
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-brand-gradient transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {questions.map((question, index) => (
        <fieldset key={question.id} className="card p-5 sm:p-6">
          <legend className="float-left flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-sm font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
              {index + 1}
            </span>
            <span className="pt-0.5 text-base font-semibold leading-snug text-slate-900 dark:text-white">
              {question.text}
            </span>
          </legend>
          <div className="clear-both pt-3">
            <QuestionField
              question={question}
              choice={choices[question.id]}
              customText={customText[question.id]}
              onSelect={(value) => selectOption(question.id, value)}
              onCustom={(text) => setCustom(question.id, text)}
            />
          </div>
        </fieldset>
      ))}

      <button type="submit" disabled={loading || !allAnswered} className="btn-primary w-full sm:w-auto">
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
            </svg>
            Building your plan…
          </>
        ) : (
          <>
            Generate execution plan
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
