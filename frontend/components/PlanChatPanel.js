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
    if (!text || loading || !result) return;

    const userMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const history = nextMessages
        .filter((m) => m !== STARTER_MESSAGE)
        .map((m) => ({ role: m.role, content: m.content }));

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
    <div className="flex h-full flex-col bg-riso-card">
      <div className="border-b border-riso-border px-4 py-3">
        <h2 className="text-sm font-semibold text-riso-ink">Plan chat</h2>
        <p className="mt-0.5 text-xs text-riso-faint">Refine options and update your plan</p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-xl px-3 py-2.5 text-sm leading-relaxed ${
              message.role === 'user'
                ? 'ml-4 bg-riso-coral text-white shadow-riso-active'
                : 'mr-2 border border-riso-border bg-riso-paper text-riso-ink shadow-riso'
            }`}
          >
            {message.content}
          </div>
        ))}
        {loading ? (
          <div className="mr-2 flex items-center gap-2 rounded-xl border border-riso-border bg-riso-paper px-3 py-2.5 text-sm text-riso-faint">
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-riso-coral [animation-delay:0ms]" />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-riso-coral [animation-delay:150ms]" />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-riso-coral [animation-delay:300ms]" />
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-riso-border p-3">
        {error ? <p className="mb-2 text-xs text-red-500">{error}</p> : null}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Switch to lean MVP path"
            disabled={loading}
            className="min-w-0 flex-1 rounded-lg border border-riso-border bg-riso-paper px-3 py-2 text-sm text-riso-ink outline-none placeholder:text-riso-faint focus:border-riso-coral focus:ring-1 focus:ring-riso-coral disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-lg bg-riso-coral px-3 py-2 text-sm font-semibold text-white shadow-riso-btn transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
