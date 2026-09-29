import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Sparkles, 
  Kanban, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Building2,
  ChevronDown
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'invoicing' | 'audit' | 'pipeline' | 'scenarios' | 'clients';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  overdueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, overdueCount }) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Cockpit Exécutif', icon: LayoutDashboard, badge: null },
    { id: 'invoicing' as ActiveTab, label: 'Factures & Règlements', icon: Receipt, badge: overdueCount > 0 ? `${overdueCount} en retard` : null, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { id: 'audit' as ActiveTab, label: 'Audit IA & Contrats', icon: Sparkles, badge: 'Gemini 2.5', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { id: 'pipeline' as ActiveTab, label: 'Pipeline Commercial', icon: Kanban, badge: null },
    { id: 'scenarios' as ActiveTab, label: 'Simulateur Trésorerie', icon: TrendingUp, badge: null },
    { id: 'clients' as ActiveTab, label: 'Comptes Entreprises', icon: Users, badge: null }
  ];

  return (
    <aside className="w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col justify-between select-none shrink-0 z-20">
      <div>
        {/* Organization Brand Header */}
        <div className="h-16 px-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-white font-sans">NEXUS FINANCE</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-mono tracking-wider font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Entreprise SAS • SIREN 892 411 902</p>
            </div>
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="px-4 py-3 border-b border-zinc-800/50">
          <button className="w-full px-3 py-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 flex items-center justify-between text-left transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              <div className="truncate">
                <p className="text-xs font-medium text-zinc-200 truncate">Holding France & EMEA</p>
                <p className="text-[10px] text-zinc-500 font-mono">Consolidé EUR (€)</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
            Navigation Principale
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono font-medium ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Compliance & User Status Footer */}
      <div className="p-4 border-t border-zinc-800/80 space-y-3">
        <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-[11px] leading-tight">
            <p className="text-zinc-300 font-medium">Conformité Facturation 2026</p>
            <p className="text-zinc-500 text-[10px]">Facturation électronique & Chorus Pro validé</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
            MD
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-200 truncate">Marc Dumont</p>
            <p className="text-[10px] text-zinc-500 truncate">Direction Financière (CFO)</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connecté" />
        </div>
      </div>
    </aside>
  );
};
