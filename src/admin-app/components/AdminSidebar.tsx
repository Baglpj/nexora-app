import React from 'react';
import {
  LayoutDashboard,
  Rocket,
  ShieldAlert,
  Image,
  Palette,
  FileText,
  Lock,
  ExternalLink,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onSimulateUserApp: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onSimulateUserApp,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord & Trésorerie',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'games_studio',
      label: 'NEXORA Play Studio',
      sublabel: 'Création & Déploiement Jeux',
      icon: Rocket,
      badge: 'Exclusif',
    },
    {
      id: 'users_moderation',
      label: 'Utilisateurs & Badges',
      sublabel: 'Bannissement & Droits',
      icon: ShieldAlert,
    },
    {
      id: 'content_moderation',
      label: 'Modération du Contenu',
      sublabel: 'Photos & Publications',
      icon: Image,
    },
    {
      id: 'theme_presets',
      label: 'Gestionnaire de Thèmes',
      sublabel: 'YouTube, TikTok, WhatsApp...',
      icon: Palette,
    },
    {
      id: 'audit_logs',
      label: 'Journaux & Audits Système',
      sublabel: 'Traçabilité des accès',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-72 bg-[#090d1a] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-full">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#050811] rounded-[14px] flex items-center justify-center">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-black text-sm tracking-wider uppercase text-white">
                NEXORA ADMIN
              </span>
              <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 px-1 py-0.2 rounded">
                ROOT
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Station de Commandement</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
        <p className="px-3 pt-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
          Supervision & Contrôle
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full p-3 rounded-2xl text-left flex items-center justify-between transition-all group ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isActive ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className={`font-bold text-xs truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </p>
                  {item.sublabel && (
                    <p className="text-[10px] text-slate-500 truncate">{item.sublabel}</p>
                  )}
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-blue-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        {/* Fast Switcher to Player App */}
        <button
          onClick={onSimulateUserApp}
          className="w-full py-2 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-bold flex items-center justify-between transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vue Application Client</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-2 px-3 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 border border-rose-800/40 text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Verrouiller la Session Admin</span>
        </button>
      </div>
    </aside>
  );
};
