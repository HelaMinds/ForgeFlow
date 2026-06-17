'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputBox from '../components/InputBox';
import { submitIdea } from '../lib/api';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(idea) {
    setLoading(true);
    setError('');

    try {
      const result = await submitIdea(idea);
      sessionStorage.setItem('forgeflow-result', JSON.stringify(result));
      router.push('/result');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-widest text-orange-400">ForgeFlow</p>
        <h1 className="text-4xl font-bold">Turn ideas into execution plans</h1>
        <p className="mt-4 text-slate-400">
          Clarify, plan, stress-test, and refine your idea into a realistic roadmap.
        </p>
      </div>

      <InputBox onSubmit={handleSubmit} loading={loading} />

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
    </main>
  );
}
