import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Clock, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Sparkles,
  ExternalLink,
  Send
} from 'lucide-react';
import { Invoice, MonthlyCashPoint } from '../types/enterprise';
import { HISTORICAL_CASHFLOW } from '../data/mockEnterpriseData';

interface ExecutiveDashboardProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onSendReminder: (invoice: Invoice) => void;
  onNavigateToAudit: () => void;
  onNavigateToInvoices: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  invoices,
  onSelectInvoice,
  onSendReminder,
  onNavigateToAudit,
  onNavigateToInvoices
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyCashPoint | null>(null);

  // Financial calculations
  const totalOverdue = invoices
    .filter(i => i.status === 'OVERDUE')
    .reduce((sum, i) => sum + i.totalTTC, 0);

  const totalPending = invoices
    .filter(i => i.status === 'PENDING')
    .reduce((sum, i) => sum + i.totalTTC, 0);

  const totalPaid = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + i.totalTTC, 0);

  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');

  // Chart dimensions & scaling
  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...HISTORICAL_CASHFLOW.map(d => Math.max(d.revenue, d.expenses))) * 1.15;

  const getX = (index: number) => {
    return paddingX + (index / (HISTORICAL_CASHFLOW.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    return chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
  };

  const revenuePath = HISTORICAL_CASHFLOW.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.revenue)}`).join(' ');
  const expensesPath = HISTORICAL_CASHFLOW.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.expenses)}`).join(' ');
  const revenueArea = `${revenuePath} L ${getX(HISTORICAL_CASHFLOW.length - 1)} ${chartHeight - paddingY} L ${getX(0)} ${chartHeight - paddingY} Z`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* C-Level Notification Bar if overdue invoices */}
      {overdueInvoices.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-rose-200">
                Alerte Trésorerie : {overdueInvoices.length} factures dépassent l'échéance légale
              </h2>
              <p className="text-[11px] text-rose-300/80">
                Montant total en souffrance : <span className="font-mono font-semibold text-rose-100">{totalOverdue.toLocaleString('fr-FR')} € TTC</span>. 
                Des actions de relance automatique sont recommandées.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToInvoices}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <span>Traiter les retards</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: MRR */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">MRR Consolidé</span>
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100 tabular-nums">86 400 €</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center">
              +14.2% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 font-sans">ARR projeté : <span className="font-mono text-zinc-300">1 036 800 €</span></p>
        </div>

        {/* KPI 2: Cash Balance */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Trésorerie Disponible</span>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100 tabular-nums">485 200 €</span>
            <span className="text-[11px] font-semibold text-zinc-400">Runway 18.2 m</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 font-sans">Burn net mensuel moyen : <span className="font-mono text-zinc-300">31 200 €</span></p>
        </div>

        {/* KPI 3: Accounts Receivable */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Créances à Recouvrer</span>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100 tabular-nums">{(totalPending + totalOverdue).toLocaleString('fr-FR')} €</span>
            <span className="text-[11px] font-semibold text-amber-400">DSO 38j</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 font-sans">
            Dont en retard : <span className="font-mono font-medium text-rose-400">{totalOverdue.toLocaleString('fr-FR')} €</span>
          </p>
        </div>

        {/* KPI 4: Gemini Audit Score */}
        <div 
          onClick={onNavigateToAudit}
          className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-zinc-900/80 to-zinc-900/70 border border-indigo-500/30 shadow-sm relative overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Score Solvabilité IA
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Gemini 2.5</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-100 tabular-nums">84 / 100</span>
            <span className="text-[11px] font-semibold text-emerald-400">Solide</span>
          </div>
          <p className="mt-1 text-[11px] text-indigo-300/70 flex items-center gap-1 group-hover:text-indigo-200">
            <span>Consulter l'audit & les risques</span>
            <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cashflow Curve Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800/60">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Trajectoire des Flux de Trésorerie (12 Derniers Mois)</h3>
              <p className="text-xs text-zinc-400">Évolution consolidée des encaissements clients vs charges opérationnelles</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-zinc-300">Revenus (€)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
                <span className="text-zinc-400">Dépenses (€)</span>
              </div>
            </div>
          </div>

          {/* SVG Vector Chart */}
          <div className="mt-4 relative overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-52 overflow-visible select-none">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                return (
                  <g key={i}>
                    <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#27272A" strokeDasharray="3 3" />
                    <text x={paddingX - 6} y={y + 3} textAnchor="end" fill="#71717A" fontSize="9" fontFamily="monospace">
                      {Math.round((ratio * maxVal) / 1000)}k€
                    </text>
                  </g>
                );
              })}

              {/* Area under revenue */}
              <path d={revenueArea} fill="url(#revenueGrad)" />

              {/* Expenses Line */}
              <path d={expensesPath} fill="none" stroke="#71717A" strokeWidth="2" strokeDasharray="4 4" />

              {/* Revenue Line */}
              <path d={revenuePath} fill="none" stroke="#3B82F6" strokeWidth="2.5" />

              {/* Interactive Data Points */}
              {HISTORICAL_CASHFLOW.map((pt, i) => {
                const cx = getX(i);
                const cy = getY(pt.revenue);
                const isHovered = hoveredPoint?.month === pt.month;
                return (
                  <g key={pt.month} onMouseEnter={() => setHoveredPoint(pt)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={isHovered ? 6 : 3.5} 
                      fill={isHovered ? '#60A5FA' : '#3B82F6'} 
                      stroke="#09090B" 
                      strokeWidth="2" 
                      className="transition-all"
                    />
                    {/* X Axis Labels */}
                    <text x={cx} y={chartHeight - 10} textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="sans-serif">
                      {pt.month}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-2 right-4 p-2.5 rounded-lg bg-zinc-950/95 border border-zinc-700 text-xs shadow-xl backdrop-blur-md pointer-events-none">
                <p className="font-semibold text-zinc-200">{hoveredPoint.month}</p>
                <div className="mt-1 space-y-0.5 font-mono text-[11px]">
                  <p className="text-blue-400">Revenus : {hoveredPoint.revenue.toLocaleString('fr-FR')} €</p>
                  <p className="text-zinc-400">Dépenses : {hoveredPoint.expenses.toLocaleString('fr-FR')} €</p>
                  <p className="text-emerald-400 font-semibold">Cash net : +{hoveredPoint.netCash.toLocaleString('fr-FR')} €</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Distribution by Line */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Répartition du CA</h3>
            <p className="text-xs text-zinc-400">Ventilation par segment d'offre B2B</p>
            
            <div className="mt-5 space-y-4">
              {[
                { label: 'Abonnements SaaS Récurrent', amount: '58 400 €', pct: 67, color: 'bg-blue-500' },
                { label: 'Licences & Dedicated Instance', amount: '16 000 €', pct: 19, color: 'bg-indigo-500' },
                { label: 'Architecture & Intégration', amount: '8 500 €', pct: 10, color: 'bg-emerald-500' },
                { label: 'Connecteurs ERP & Support', amount: '3 500 €', pct: 4, color: 'bg-amber-500' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium">{item.label}</span>
                    <span className="font-mono text-zinc-400">{item.amount} ({item.pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/70 flex items-center justify-between text-xs text-zinc-400">
            <span>Rétention nette (NDR)</span>
            <span className="font-mono font-semibold text-emerald-400">118%</span>
          </div>
        </div>
      </div>

      {/* Critical Overdue & Pending Table Preview */}
      <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Factures & Encaissements Prioritaires</h3>
            <p className="text-xs text-zinc-400">Créances nécessitant une attention immédiate</p>
          </div>
          <button
            onClick={onNavigateToInvoices}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Voir les {invoices.length} factures</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-medium font-mono text-[11px]">
                <th className="py-2.5 px-3">N° FACTURE</th>
                <th className="py-2.5 px-3">COMPTE CLIENT</th>
                <th className="py-2.5 px-3">ÉCHÉANCE</th>
                <th className="py-2.5 px-3 text-right">MONTANT TTC</th>
                <th className="py-2.5 px-3">STATUT</th>
                <th className="py-2.5 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-850/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-zinc-200">
                    <button 
                      onClick={() => onSelectInvoice(inv)}
                      className="hover:underline hover:text-blue-400 flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-zinc-500" />
                      {inv.invoiceNumber}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium text-zinc-200">{inv.clientName}</p>
                    <p className="text-[10px] text-zinc-500">{inv.clientContact}</p>
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-400">
                    {inv.dueDate}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-zinc-100 tabular-nums">
                    {inv.totalTTC.toLocaleString('fr-FR')} €
                  </td>
                  <td className="py-3 px-3">
                    {inv.status === 'PAID' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Payée
                      </span>
                    )}
                    {inv.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        En attente
                      </span>
                    )}
                    {inv.status === 'OVERDUE' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        En retard
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status === 'OVERDUE' && (
                        <button
                          onClick={() => onSendReminder(inv)}
                          className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-medium flex items-center gap-1 transition-colors"
                          title="Envoyer une mise en demeure amiable"
                        >
                          <Send className="w-3 h-3" />
                          <span>Relancer</span>
                        </button>
                      )}
                      <button
                        onClick={() => onSelectInvoice(inv)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                        title="Ouvrir la facture"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
