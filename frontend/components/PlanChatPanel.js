'use client';

import { useEffect, useRef, useState } from 'react';
import { chatWithPlan } from '../lib/api';

const STARTER_MESSAGE = {
  role: 'assistant',
  content:
    'Ask me to adjust your plan: change the timeline, switch to a leaner path, update pricing assumptions, or refine any section.',
};

const SUGGESTIONS = ['Switch to a lean MVP path', 'Make the timeline more aggressive', 'Add a budget constraint'];

export default function PlanChatPanel({ result, onPlanUpdate }) {
  const [messages, setMessages] = useState([STARTER_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text) {
    if (!text || loading || !result) {
      return;
    }

    const userMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const history = nextMessages
        .filter((message) => message !== STARTER_MESSAGE)
        .map((message) => ({ role: message.role, content: message.content }));

      const response = await chatWithPlan({
        message: text,
        context: {
          idea: result.idea,
          ideaType: result.ideaType,
          clarified: result.clarified,
          finalPlan: result.finalPlan,
          stressTest: result.stressTest,
        },
        history: history.slice(0, -1),
      });

      const changed = Array.isArray(response.changed) ? response.changed : [];

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: response.reply, changed },
      ]);

      if (response.updates?.finalPlan || response.updates?.clarified) {
        onPlanUpdate({
          updates: response.updates,
          traceEntry: response.traceEntry,
          changed,
        });
      }
    } catch (err) {
      setError(err.message || 'Chat request failed');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input.trim());
  }

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <aside className="flex h-full flex-col border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:border-l lg:border-t-0">
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-white" aria-hidden="true">
            <path fillRule="evenodd" d="M10 2c-4.418 0-8 3.134-8 7 0 1.76.743 3.37 1.97 4.6-.13 1.02-.5 2.06-1.2 2.9-.16.2-.2.47-.1.7.1.24.33.4.6.4 1.7 0 3.04-.66 3.96-1.3A9.7 9.7 0 0 0 10 16c4.418 0 8-3.134 8-7s-3.582-7-8-7Z" clipRule="evenodd" />
          </svg>
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Plan chat</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Refine and update your plan</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed animate-fade-in ${
              message.role === 'user'
                ? 'ml-auto bg-brand-gradient text-white shadow-glow'
                : 'mr-auto border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            {message.content}
            {message.changed?.length ? (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-200/70 pt-2 dark:border-slate-700/70">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  Updated
                </span>
                {message.changed.map((field) => (
                  <span
                    key={field}
                    className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  >
                    {field}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {showSuggestions ? (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Try asking:</p>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-orange-500/40 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}

        {loading ? (
          <div className="mr-auto flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-slate-800 dark:bg-slate-800">
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4 dark:border-slate-800">
        {error ? <p className="mb-2 text-xs text-rose-600 dark:text-rose-400">{error}</p> : null}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-soft focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:border-orange-500 dark:focus-within:ring-orange-500/30">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask to adjust your plan…"
            disabled={loading}
            className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none disabled:opacity-50 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.085l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.289Z" />
            </svg>
          </button>
        </div>
      </form>
    </aside>
  );
}
