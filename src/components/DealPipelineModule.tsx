import React, { useState } from 'react';
import { Kanban, Plus, Building2, User, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { Deal } from '../types/enterprise';
import { INITIAL_DEALS } from '../data/mockEnterpriseData';

export const DealPipelineModule: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);

  const stages: Array<{ id: Deal['stage']; label: string; color: string }> = [
    { id: 'PROSPECT', label: '1. Qualification', color: 'border-zinc-700' },
    { id: 'PROPOSAL', label: '2. Offre Commerciale', color: 'border-blue-500/50' },
    { id: 'NEGOTIATION', label: '3. Négociation Juridique', color: 'border-amber-500/50' },
    { id: 'WON', label: '4. Signé & Validé', color: 'border-emerald-500/50' }
  ];

  const moveDeal = (dealId: string, direction: 'forward' | 'backward') => {
    const stageOrder: Deal['stage'][] = ['PROSPECT', 'PROPOSAL', 'NEGOTIATION', 'WON'];
    setDeals(deals.map(d => {
      if (d.id !== dealId) return d;
      const currentIndex = stageOrder.indexOf(d.stage);
      const nextIndex = direction === 'forward' 
        ? Math.min(stageOrder.length - 1, currentIndex + 1)
        : Math.max(0, currentIndex - 1);
      const newStage = stageOrder[nextIndex];
      const newProb = newStage === 'WON' ? 100 : newStage === 'NEGOTIATION' ? 75 : newStage === 'PROPOSAL' ? 60 : 35;
      return { ...d, stage: newStage, probability: newProb };
    }));
  };

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipeline = deals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Metric Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Pipeline Commercial & Prévisions Trimestrielles</h2>
          <p className="text-xs text-zinc-400">Gestion des grands comptes et pondération des encaissements futurs</p>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Valeur Brute Pipeline</span>
            <span className="text-sm font-bold text-zinc-200">{totalPipelineValue.toLocaleString('fr-FR')} €</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Atterrissage Pondéré</span>
            <span className="text-sm font-bold text-blue-400">{Math.round(weightedPipeline).toLocaleString('fr-FR')} €</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div key={stage.id} className="rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col max-h-[700px]">
              {/* Column Header */}
              <div className={`p-3 border-b ${stage.color} flex items-center justify-between bg-zinc-950/40 rounded-t-xl`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-200">{stage.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-400 font-medium">
                  {stageTotal.toLocaleString('fr-FR')} €
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {stageDeals.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-zinc-600">
                    Aucun compte à cette étape
                  </div>
                ) : (
                  stageDeals.map(deal => (
                    <div 
                      key={deal.id}
                      className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-200">{deal.clientName}</span>
                        <span className="font-mono text-xs font-bold text-blue-400">
                          {deal.value.toLocaleString('fr-FR')} €
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-snug">{deal.dealName}</p>

                      <div className="pt-2 border-t border-zinc-800/70 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {deal.assignedTo}
                        </span>
                        <span className="text-emerald-400 font-semibold">{deal.probability}% prob.</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {deal.targetCloseDate}
                        </span>
                        <div className="flex items-center gap-1">
                          {deal.stage !== 'PROSPECT' && (
                            <button
                              onClick={() => moveDeal(deal.id, 'backward')}
                              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px]"
                              title="Étape précédente"
                            >
                              ←
                            </button>
                          )}
                          {deal.stage !== 'WON' && (
                            <button
                              onClick={() => moveDeal(deal.id, 'forward')}
                              className="px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[10px] flex items-center gap-0.5"
                              title="Avancer l'étape"
                            >
                              <span>Avancer</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
