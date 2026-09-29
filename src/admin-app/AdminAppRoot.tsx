import React, { useState, useEffect } from 'react';
import { useNexora } from '../context/NexoraContext';
import { AdminSecurityGate } from './auth/AdminSecurityGate';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTopBar } from './components/AdminTopBar';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminGamesStudioView } from './views/AdminGamesStudioView';
import { AdminUsersModerationView } from './views/AdminUsersModerationView';
import { AdminContentModerationView } from './views/AdminContentModerationView';
import { AdminThemePresetManagerView } from './views/AdminThemePresetManagerView';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface AdminAppRootProps {
  onReturnToUserApp: () => void;
}

export const AdminAppRoot: React.FC<AdminAppRootProps> = ({ onReturnToUserApp }) => {
  const { auditLogs } = useNexora();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nexora_admin_session') === 'authenticated';
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexora_admin_session');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminSecurityGate onAuthenticated={handleAuthenticated} />;
  }

  const tabTitles: Record<string, string> = {
    dashboard: 'Tableau de Bord Exécutif & Trésorerie',
    games_studio: 'NEXORA Play Studio (Création & Déploiement)',
    users_moderation: 'Modération des Utilisateurs & Badges Bleus',
    content_moderation: 'Modération des Publications du Flux',
    theme_presets: 'Gestionnaire de Thèmes & Styles',
    audit_logs: 'Journaux & Audits Système',
  };

  return (
    <div className="h-screen w-screen bg-[#050811] text-slate-100 flex overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={handleLogout}
        onSimulateUserApp={onReturnToUserApp}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminTopBar currentTabTitle={tabTitles[currentTab] || 'Section Admin'} />

        <main className="flex-1 overflow-y-auto bg-[#070b16] relative">
          {currentTab === 'dashboard' && <AdminDashboardView />}
          {currentTab === 'games_studio' && <AdminGamesStudioView />}
          {currentTab === 'users_moderation' && <AdminUsersModerationView />}
          {currentTab === 'content_moderation' && <AdminContentModerationView />}
          {currentTab === 'theme_presets' && <AdminThemePresetManagerView />}

          {currentTab === 'audit_logs' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-mono">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-white uppercase">
                    Journaux d'Audit & Traçabilité Sécurité
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Audit Immuable Actif
                </span>
              </div>

              <div className="rounded-3xl bg-[#090d1a] border border-slate-800 p-4 font-mono text-xs space-y-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-slate-950/70 border border-slate-850 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-400">{log.action}</span>
                        <span className="text-[10px] text-slate-500">• {log.adminName}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
