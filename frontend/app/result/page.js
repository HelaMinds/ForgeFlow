'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PlanHero from '../../components/PlanHero';
import PlanOverview from '../../components/PlanOverview';
import TimelineFlow from '../../components/TimelineFlow';
import RiskCard from '../../components/RiskCard';
import { getIdeaTypeLabel } from '../../lib/api';

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

  const { idea, finalPlan, clarified, stressTest } = result;
  const ideaTypeLabel = clarified.ideaType ? getIdeaTypeLabel(clarified.ideaType) : null;
  const userAnswers = clarified.userAnswers || [];
  const phaseCount = finalPlan.roadmap?.length || 0;
  const totalDuration = finalPlan.timeline?.totalDuration;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <PlanHero
        finalPlan={finalPlan}
        clarified={clarified}
        idea={idea}
        ideaTypeLabel={ideaTypeLabel}
        userAnswers={userAnswers}
        phaseCount={phaseCount}
        totalDuration={totalDuration}
      />

      <div className="mt-10">
        <PlanOverview
          idea={idea}
          ideaTypeLabel={ideaTypeLabel}
          clarified={clarified}
          finalPlan={finalPlan}
        />
      </div>

      <section className="mt-12">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Step-by-step timeline</h2>
          <p className="mt-2 text-sm text-slate-400">
            Follow these phases in order. Each step includes concrete tasks and a milestone to hit
            before moving on.
          </p>
        </div>
        <TimelineFlow roadmap={finalPlan.roadmap} timeline={finalPlan.timeline} />
      </section>

      {finalPlan.risks?.length ? (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Risks & mitigations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {finalPlan.risks.map((risk, index) => (
              <RiskCard key={`${risk.title}-${index}`} risk={risk} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 rounded-xl border border-orange-500/30 bg-orange-500/10 p-6">
        <h2 className="mb-2 text-lg font-semibold text-orange-300">Start here</h2>
        <p className="text-slate-100">{finalPlan.firstAction}</p>
        {finalPlan.confidenceNote ? (
          <p className="mt-4 text-sm text-slate-400">{finalPlan.confidenceNote}</p>
        ) : null}
        {stressTest.weakAssumptions?.length ? (
          <div className="mt-4 border-t border-orange-500/20 pt-4">
            <p className="text-sm font-medium text-slate-300">Watch out for weak assumptions</p>
            <ul className="mt-2 space-y-1">
              {stressTest.weakAssumptions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                  <span aria-hidden="true" className="mt-1.5 text-orange-400/70">
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </main>
  );
}
