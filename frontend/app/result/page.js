'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PlanCard from '../../components/PlanCard';
import RiskCard from '../../components/RiskCard';

export default function ResultPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('forgeflow-result');
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-slate-400">No result found.</p>
        <Link href="/" className="mt-4 inline-block text-orange-400 hover:underline">
          Start over
        </Link>
      </main>
    );
  }

  const { finalPlan, clarified, stressTest } = result;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-orange-400">Final Plan</p>
          <h1 className="mt-2 text-3xl font-bold">{finalPlan.summary}</h1>
        </div>
        <Link href="/" className="text-sm text-slate-400 hover:text-white">
          New idea
        </Link>
      </div>

      <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-2 text-lg font-semibold">Clarified Idea</h2>
        <p className="text-slate-300">{clarified.summary}</p>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        {finalPlan.roadmap.map((step, index) => (
          <PlanCard key={`${step.title}-${index}`} step={step} index={index + 1} />
        ))}
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Risks</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {finalPlan.risks.map((risk, index) => (
            <RiskCard key={`${risk.title}-${index}`} risk={risk} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-6">
        <h2 className="mb-2 text-lg font-semibold text-orange-300">First Action</h2>
        <p className="text-slate-100">{finalPlan.firstAction}</p>
        {finalPlan.confidenceNote ? (
          <p className="mt-4 text-sm text-slate-400">{finalPlan.confidenceNote}</p>
        ) : null}
        {stressTest.weakAssumptions?.length ? (
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-300">Weak assumptions</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
              {stressTest.weakAssumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </main>
  );
}
