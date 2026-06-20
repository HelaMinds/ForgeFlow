'use client';

import { useEffect, useRef, useState } from 'react';
import { chatWithPlan } from '../lib/api';

const STARTER_MESSAGE = {
  role: 'assistant',
  content:
    'Ask me to adjust your plan — change the timeline, switch to a leaner path, update pricing assumptions, or refine any section.',
};

export default function PlanChatPanel({ result, onPlanUpdate }) {
  const [messages, setMessages] = useState([STARTER_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSubmit(event) {
    event.preventDefault();
    const text = input.trim();
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

      setMessages((current) => [...current, { role: 'assistant', content: response.reply }]);

      if (response.updates?.finalPlan || response.updates?.clarified) {
        onPlanUpdate(response.updates);
      }
    } catch (err) {
      setError(err.message || 'Chat request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="flex h-full flex-col border-l border-slate-800 bg-slate-950/90">
      <div className="border-b border-slate-800 px-4 py-4">
        <h2 className="text-sm font-semibold text-slate-100">Plan chat</h2>
        <p className="mt-1 text-xs text-slate-500">Refine options and update your plan</p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-xl px-3 py-2.5 text-sm leading-relaxed ${
              message.role === 'user'
                ? 'ml-4 bg-orange-500/15 text-orange-100'
                : 'mr-2 bg-slate-900 text-slate-300'
            }`}
          >
            {message.content}
          </div>
        ))}
        {loading ? (
          <div className="mr-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm text-slate-500">
            Updating plan…
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-800 p-4">
        {error ? <p className="mb-2 text-xs text-red-400">{error}</p> : null}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="e.g. Switch to lean MVP path"
            disabled={loading}
            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-orange-500 focus:ring-2 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </aside>
  );
}
