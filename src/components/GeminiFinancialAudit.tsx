import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  FileText, 
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { FinancialAuditResult, ContractAuditResult } from '../types/enterprise';
import { CONTRACT_PRESET_SAMPLE } from '../data/mockEnterpriseData';

interface GeminiFinancialAuditProps {
  auditResult: FinancialAuditResult | null;
  isLoadingAudit: boolean;
  onRunFinancialAudit: () => void;
}

export const GeminiFinancialAudit: React.FC<GeminiFinancialAuditProps> = ({
  auditResult,
  isLoadingAudit,
  onRunFinancialAudit
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'financial' | 'contract'>('financial');
  const [contractText, setContractText] = useState(CONTRACT_PRESET_SAMPLE);
  const [clientName, setClientName] = useState('Capgemini France SAS');
  const [contractAmount, setContractAmount] = useState('85 000');
  const [isLoadingContract, setIsLoadingContract] = useState(false);
  const [contractResult, setContractResult] = useState<ContractAuditResult | null>(null);

  const handleAuditContract = async () => {
    setIsLoadingContract(true);
    try {
      const res = await fetch('/api/contracts/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractText,
          clientName,
          totalAmount: contractAmount
        })
      });
      const data = await res.json();
      setContractResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingContract(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('financial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              activeSubTab === 'financial'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Audit de Trésorerie & Solvabilité</span>
          </button>
          <button
            onClick={() => setActiveSubTab('contract')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              activeSubTab === 'contract'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Scanner de Contrat & Conformité LME</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Moteur d'Audit : Gemini 2.5 Flash</span>
        </div>
      </div>

      {activeSubTab === 'financial' && (
        <div className="space-y-6">
          {/* Executive Trigger & Score Overview */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-indigo-950/30 border border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>COPILOTE DE GOUVERNANCE FINANCIÈRE</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Diagnostic de Solvabilité & Optimisation du BFR
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Analyse algorithmique multi-critères : encaissements réels, ratio de liquidité générale, balance âgée des créances et projections d'atterrissage Q4.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {auditResult && (
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">
                    {auditResult.healthScore} <span className="text-xs font-sans text-zinc-400 font-normal">/ 100</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {auditResult.healthStatus}
                  </span>
                </div>
              )}
              <button
                onClick={onRunFinancialAudit}
                disabled={isLoadingAudit}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-2 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAudit ? 'animate-spin' : ''}`} />
                <span>{isLoadingAudit ? 'Audit en cours...' : 'Exécuter l\'Audit IA'}</span>
              </button>
            </div>
          </div>

          {auditResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Executive Summary & Runway */}
              <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 shadow-sm space-y-4">
                <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  Synthèse de Direction Générale
                </h3>
                <p className="text-xs text-zinc-200 leading-relaxed bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/80">
                  {auditResult.executiveSummary}
                </p>

                <div className="pt-2 border-t border-zinc-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Autonomie Financière (Runway)</span>
                    <span className="font-mono font-bold text-emerald-400">{auditResult.runwayMonths} mois</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Atterrissage Prévisionnel</span>
                    <span className="font-mono text-zinc-200">Revenus Q4 consolidés</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 pt-1 leading-snug">
                    {auditResult.forecastQ4}
                  </p>
                </div>
              </div>

              {/* Identified Financial Risks */}
              <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 shadow-sm space-y-3">
                <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Facteurs de Risque Identifiés</span>
                  <span className="text-[10px] text-rose-400 font-bold">{auditResult.topRisks.length} alertes</span>
                </h3>

                <div className="space-y-2.5">
                  {auditResult.topRisks.map((risk, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-200">{risk.title}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          risk.severity === 'HAUT' 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug">{risk.impact}</p>
                      <div className="pt-1 text-[11px] text-blue-400 flex items-start gap-1">
                        <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>{risk.recommendation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Optimizations */}
              <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 shadow-sm space-y-3">
                <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  Recommandations d'Optimisation
                </h3>

                <div className="space-y-3">
                  {auditResult.strategicOptimizations.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-mono font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'contract' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Input Area */}
          <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Texte Contractuel ou Conditions Générales</h3>
                <p className="text-xs text-zinc-400">Vérification de la conformité LME, délais et clauses de responsabilité</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Client Contractant</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Montant Global (€)</label>
                <input
                  type="text"
                  value={contractAmount}
                  onChange={(e) => setContractAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 font-mono"
                />
              </div>
            </div>

            <textarea
              rows={12}
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
              placeholder="Collez ici les articles ou clauses d'un contrat commercial..."
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500">{contractText.length} caractères analysés</span>
              <button
                onClick={handleAuditContract}
                disabled={isLoadingContract}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-2 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingContract ? 'Audit juridique en cours...' : 'Auditer le Contrat'}</span>
              </button>
            </div>
          </div>

          {/* Audit Results Panel */}
          <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center justify-between">
              <span>Résultat de l'Audit Juridique & Financier</span>
              {contractResult && (
                <span className="text-xs font-mono font-bold text-blue-400">
                  Conformité : {contractResult.complianceScore}/100
                </span>
              )}
            </h3>

            {contractResult ? (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Statut Global</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {contractResult.status}
                  </span>
                </div>

                {/* Key Clauses */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-zinc-500">Clauses Auditées</span>
                  {contractResult.keyClausesDetected.map((cl, i) => (
                    <div key={i} className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-200">{cl.clause}</span>
                        <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 bg-zinc-800 rounded">
                          {cl.status}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-400">{cl.note}</p>
                    </div>
                  ))}
                </div>

                {/* Legal Risks & Advice */}
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-amber-500/30 space-y-2">
                  <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Conseil de Négociation Juridique
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {contractResult.negotiationAdvice}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-center p-6 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                <FileText className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">Cliquez sur « Auditer le Contrat » pour analyser les clauses, détecter les pénalités cachées et obtenir des recommandations de négociation.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
