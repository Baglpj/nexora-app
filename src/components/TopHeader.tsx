import React from 'react';
import { Search, Plus, Download, Bell } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface TopHeaderProps {
  activeTab: ActiveTab;
  onOpenNewInvoiceModal: () => void;
  onExportReport: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (p: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onOpenNewInvoiceModal,
  onExportReport,
  searchQuery,
  setSearchQuery,
  selectedPeriod,
  setSelectedPeriod
}) => {
  const tabTitles: Record<ActiveTab, { title: string; breadcrumb: string }> = {
    dashboard: { title: 'Cockpit Financier Exécutif', breadcrumb: 'Finance / Vue Consolidée' },
    invoicing: { title: 'Facturation & Encaissements B2B', breadcrumb: 'Trésorerie / Factures' },
    audit: { title: 'Intelligence Artificielle & Audit Contrats', breadcrumb: 'Conformité / Gemini IA' },
    pipeline: { title: 'Pipeline Commercial & Prévisions', breadcrumb: 'Revenus / Affaires' },
    scenarios: { title: 'Simulateur Stratégique de Trésorerie', breadcrumb: 'Prévisions / Scénarios' },
    clients: { title: 'Répertoire des Comptes Clients', breadcrumb: 'Clients / Entreprises' }
  };

  const current = tabTitles[activeTab];

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-10 select-none">
      {/* Breadcrumb & Section Name */}
      <div className="flex flex-col">
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">{current.breadcrumb}</span>
        <h1 className="text-base font-semibold text-zinc-100 tracking-tight">{current.title}</h1>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher client, N° facture, SIREN, contrat..."
          className="w-full pl-9 pr-4 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
        />
      </div>

      {/* Actions & Period Switcher */}
      <div className="flex items-center gap-3">
        {/* Period Selector */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
          {[
            { id: 'month', label: 'Ce mois' },
            { id: 'q3', label: 'T3 2026' },
            { id: 'year', label: '12 Mois' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPeriod(item.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedPeriod === item.id
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Export Button */}
        <button
          onClick={onExportReport}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
          title="Exporter en CSV ou rapport consolidé"
        >
          <Download className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        {/* Primary Action Button: New Invoice */}
        <button
          onClick={onOpenNewInvoiceModal}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Facture</span>
        </button>

        {/* Notification Bell */}
        <div className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 cursor-pointer transition-colors border border-transparent hover:border-zinc-800">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </div>
      </div>
    </header>
  );
};
