import React, { useState, useEffect } from 'react';
import { NexoraProvider } from './context/NexoraContext';
import { UserAppRoot } from './user-app/UserAppRoot';
import { AdminAppRoot } from './admin-app/AdminAppRoot';
import { Shield, Smartphone, Lock } from 'lucide-react';

const AppGateway: React.FC = () => {
  // Check if URL specifies portal=admin or pathname is /admin
  const [currentApp, setCurrentApp] = useState<'user' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('portal') === 'admin' || window.location.pathname.startsWith('/admin')) {
        return 'admin';
      }
    }
    return 'user';
  });

  // Keep URL query in sync when switching apps
  const handleSwitchToAdmin = () => {
    setCurrentApp('admin');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('portal', 'admin');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSwitchToUser = () => {
    setCurrentApp('user');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('portal');
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Isolated Application Rendering */}
      {currentApp === 'admin' ? (
        <AdminAppRoot onReturnToUserApp={handleSwitchToUser} />
      ) : (
        <UserAppRoot />
      )}

      {/* Discret Dev Environment Switcher (Allows testing both 100% separated apps) */}
      <div className="fixed bottom-2 right-2 z-50 pointer-events-auto">
        {currentApp === 'user' ? (
          <button
            onClick={handleSwitchToAdmin}
            className="p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-500 hover:text-cyan-400 border border-slate-800 shadow-xl transition-all opacity-40 hover:opacity-100 flex items-center gap-1 text-[10px] font-mono group"
            title="Accès Propriétaire Secret : Portail Admin"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden group-hover:inline pr-1">Lien Secret Admin</span>
          </button>
        ) : (
          <button
            onClick={handleSwitchToUser}
            className="px-2.5 py-1 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white shadow-xl transition-all flex items-center gap-1.5 text-xs font-mono font-bold"
            title="Retour à l'Application Client Play Store"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>App Client</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <NexoraProvider>
      <AppGateway />
    </NexoraProvider>
  );
}
