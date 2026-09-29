import React from 'react';
import { ShieldCheck, Activity, Terminal, Lock, RefreshCw, Bell } from 'lucide-react';

interface AdminTopBarProps {
  currentTabTitle: string;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ currentTabTitle }) => {
  return (
    <header className="h-16 px-6 bg-[#090d1a]/95 border-b border-slate-800/80 flex items-center justify-between shrink-0">
      {/* Left: Breadcrumbs & Current Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>NEXORA_CORE</span>
          <span>/</span>
          <span className="text-white font-bold">{currentTabTitle}</span>
        </div>
      </div>

      {/* Right: Security Status, Server Ping, Admin Identity */}
      <div className="flex items-center gap-4">
        {/* Server Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300">Cluster En Ligne</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-bold">18ms</span>
        </div>

        {/* Security Level Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-blue-300 text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Niveau Sécurité : MAX</span>
        </div>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
              alt="Admin"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="hidden md:block text-left font-mono">
            <p className="text-xs font-bold text-white leading-tight">Propriétaire Nexora</p>
            <p className="text-[10px] text-cyan-400">admin@nexora.io</p>
          </div>
        </div>
      </div>
    </header>
  );
};
