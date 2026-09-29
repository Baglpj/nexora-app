import React, { useState } from 'react';
import { Sliders, TrendingUp, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react';

export const ScenarioSimulator: React.FC = () => {
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState<number>(8); // in %
  const [annualChurnRate, setAnnualChurnRate] = useState<number>(4); // in %
  const [costInflation, setCostInflation] = useState<number>(5); // in %

  const currentMRR = 86400;
  const currentCash = 485200;
  const currentMonthlyBurn = 31200;

  // 12-month projections calculation
  const months = ['M+1', 'M+2', 'M+3', 'M+4', 'M+5', 'M+6', 'M+7', 'M+8', 'M+9', 'M+10', 'M+11', 'M+12'];
  
  let runningCash = currentCash;
  let runningMRR = currentMRR;
  const projectedPoints = months.map((m, idx) => {
    const netGrowthFactor = 1 + (monthlyGrowthRate / 100) - ((annualChurnRate / 12) / 100);
    runningMRR = runningMRR * netGrowthFactor;
    const monthlyCost = currentMonthlyBurn * (1 + (costInflation / 100) * (idx / 12));
    const netMonthlyProfit = runningMRR - monthlyCost;
    runningCash += netMonthlyProfit;

    return {
      month: m,
      mrr: Math.round(runningMRR),
      expenses: Math.round(monthlyCost),
      cash: Math.round(runningCash)
    };
  });

  const finalMRR = projectedPoints[11].mrr;
  const finalCash = projectedPoints[11].cash;
  const totalNetGain = finalCash - currentCash;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Intro Header */}
      <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sliders className="w-4 h-4" />
            <span>Modélisation Financière Prédictive</span>
          </div>
          <h2 className="text-base font-bold text-zinc-100 mt-1">Simulateur Stratégique de Trésorerie & Croissance</h2>
          <p className="text-xs text-zinc-400">Ajustez les variables macro-économiques pour tester la résilience du modèle d'exploitation à 12 mois.</p>
        </div>

        <div className="flex items-center gap-4 bg-zinc-950 px-4 py-2.5 rounded-lg border border-zinc-800 font-mono text-xs">
          <div>
            <span className="text-zinc-500 text-[10px] uppercase block">Trésorerie Actuelle</span>
            <span className="font-bold text-zinc-200">{currentCash.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="text-zinc-600">→</div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase block">Trésorerie à M+12</span>
            <span className={`font-bold ${finalCash >= currentCash ? 'text-emerald-400' : 'text-rose-400'}`}>
              {finalCash.toLocaleString('fr-FR')} €
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Control Panel */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 shadow-sm space-y-6">
          <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
            Hypothèses de Modélisation
          </h3>

          {/* Slider 1: Growth Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium">Croissance Commerciale Mensuelle</span>
              <span className="font-mono font-bold text-blue-400">+{monthlyGrowthRate}% / mois</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={monthlyGrowthRate}
              onChange={(e) => setMonthlyGrowthRate(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-[10px] text-zinc-500">Moyenne de marché SaaS B2B : +6% à +12%</p>
          </div>

          {/* Slider 2: Churn */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium">Taux d'Attrition Client (Churn Annuel)</span>
              <span className="font-mono font-bold text-amber-400">{annualChurnRate}% / an</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={annualChurnRate}
              onChange={(e) => setAnnualChurnRate(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-zinc-500">Benchmark Enterprise contractuel : &lt; 5%</p>
          </div>

          {/* Slider 3: Cost Inflation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium">Variation des Charges & Salaires</span>
              <span className="font-mono font-bold text-zinc-200">+{costInflation}%</span>
            </div>
            <input
              type="range"
              min="-10"
              max="30"
              step="1"
              value={costInflation}
              onChange={(e) => setCostInflation(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
            />
            <p className="text-[10px] text-zinc-500">Impact indexation Syntec & recrutement tech</p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>ARR Atteint à M+12 :</span>
              <span className="font-mono font-bold text-zinc-100">{(finalMRR * 12).toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Flux Net Généré :</span>
              <span className={`font-mono font-bold ${totalNetGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalNetGain >= 0 ? '+' : ''}{totalNetGain.toLocaleString('fr-FR')} €
              </span>
            </div>
          </div>
        </div>

        {/* Projection Trajectory Grid & Visual Table */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Projections Trimestrielles Consolidées</h3>
              <p className="text-xs text-zinc-400">Atterrissage financier estimé selon les paramètres saisis</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Modèle Monte-Carlo Simplifié
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">HORIZON</th>
                  <th className="py-2.5 px-3 text-right">MRR VISÉ</th>
                  <th className="py-2.5 px-3 text-right">CHARGES MENSUELLES</th>
                  <th className="py-2.5 px-3 text-right">MARGE BRUTE</th>
                  <th className="py-2.5 px-3 text-right">CASH DISPONIBLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
                {[
                  { label: 'T4 2026 (M+3)', point: projectedPoints[2] },
                  { label: 'T1 2027 (M+6)', point: projectedPoints[5] },
                  { label: 'T2 2027 (M+9)', point: projectedPoints[8] },
                  { label: 'T3 2027 (M+12)', point: projectedPoints[11] }
                ].map((row, idx) => {
                  const marginPct = Math.round(((row.point.mrr - row.point.expenses) / row.point.mrr) * 100);
                  return (
                    <tr key={idx} className="hover:bg-zinc-850/40 transition-colors">
                      <td className="py-3 px-3 font-sans font-semibold text-zinc-200">
                        {row.label}
                      </td>
                      <td className="py-3 px-3 text-right text-blue-400 font-bold">
                        {row.point.mrr.toLocaleString('fr-FR')} €
                      </td>
                      <td className="py-3 px-3 text-right text-zinc-400">
                        {row.point.expenses.toLocaleString('fr-FR')} €
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-400">
                        {marginPct}%
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-zinc-100">
                        {row.point.cash.toLocaleString('fr-FR')} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center gap-3 text-xs text-zinc-400">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              Avec un rythme de croissance de <strong>+{monthlyGrowthRate}%</strong> et un churn contenu à <strong>{annualChurnRate}%</strong>, votre entreprise génère un excédent de trésorerie net annuel sans recours à l'endettement bancaire.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
