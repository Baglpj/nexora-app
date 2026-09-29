import React from 'react';
import { useNexora } from '../context/NexoraContext';
import { ShieldCheck, UserCheck, Smartphone, Monitor, Mic, MicOff, Sparkles, Sun, Moon } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const {
    viewMode,
    setViewMode,
    activeRole,
    switchRole,
    isMicMuted,
    toggleMic,
    toastMessage,
    colorMode,
    toggleColorMode,
  } = useNexora();

  const isLight = colorMode === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start transition-colors selection:bg-amber-500/30 selection:text-amber-700 ${
        isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Top Device & Environment Control Bar (Outside the phone) */}
      <div
        className={`w-full border-b backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-40 transition-colors ${
          isLight
            ? 'bg-white/90 border-slate-200 text-slate-800'
            : 'bg-slate-900/90 border-slate-800/80 text-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-black tracking-wider text-amber-500 text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            NEXORA ENGINE
          </div>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-500 hidden sm:inline">
            Plateforme Mobile Android & Hub Social
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Light/Dark toggle in top bar */}
          <button
            onClick={toggleColorMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              isLight
                ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                : 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750'
            }`}
            title="Basculer entre Mode Sombre et Mode Clair"
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span className="font-semibold text-[11px] hidden sm:inline">
              {isLight ? 'Mode Sombre' : 'Mode Clair'}
            </span>
          </button>

          {/* Audio Mic Simulator */}
          <button
            onClick={toggleMic}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              isMicMuted
                ? isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500 shadow-sm shadow-emerald-500/20'
            }`}
            title="Activer/Couper le micro pour le salon vocal"
          >
            {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-500" />}
            <span className="font-medium hidden sm:inline">
              {isMicMuted ? 'Micro coupé' : 'Micro en direct'}
            </span>
          </button>

          {/* Role Switcher: Joueur vs Admin */}
          <div
            className={`flex items-center rounded-lg p-0.5 border ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/80 border-slate-700/80'
            }`}
          >
            <button
              onClick={() => switchRole('player')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                activeRole === 'player'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Joueur</span>
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                activeRole === 'admin'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* View Mode Toggle: Android Frame vs Full Responsive */}
          <div
            className={`flex items-center rounded-lg p-0.5 border ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/80 border-slate-700/80'
            }`}
          >
            <button
              onClick={() => setViewMode('mobile-frame')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                viewMode === 'mobile-frame'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'bg-slate-700 text-amber-300 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Affichage cadre Smartphone Android"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Format Téléphone</span>
            </button>
            <button
              onClick={() => setViewMode('responsive')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                viewMode === 'responsive'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'bg-slate-700 text-amber-300 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Affichage étendu tablette / bureau"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Plein Écran</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-amber-500/95 text-slate-950 px-4 py-2 rounded-full font-bold text-xs tracking-wide shadow-xl shadow-amber-500/20 border border-amber-300 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          {toastMessage}
        </div>
      )}

      {/* Main Container */}
      <div
        className={`w-full flex justify-center py-2 sm:py-6 px-0 sm:px-4 ${
          viewMode === 'responsive' ? 'max-w-6xl' : ''
        }`}
      >
        {viewMode === 'mobile-frame' ? (
          // Android Phone Shell
          <div
            className={`relative w-full max-w-[425px] h-[890px] max-h-[92vh] rounded-[44px] shadow-2xl flex flex-col overflow-hidden border-[8px] transition-colors ${
              isLight
                ? 'bg-slate-50 border-slate-300 shadow-slate-400/30 ring-1 ring-slate-300'
                : 'bg-slate-950 border-slate-850 shadow-cyan-950/40 ring-1 ring-slate-700/50'
            }`}
          >
            {/* Camera Punch-Hole & Android Status Bar */}
            <div
              className={`w-full px-6 pt-3 pb-2 flex items-center justify-between text-[11px] select-none z-30 shrink-0 border-b ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-600'
                  : 'bg-slate-950 border-slate-900 text-slate-400'
              }`}
            >
              <span
                className={`font-semibold font-mono tracking-tight ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                10:42
              </span>
              {/* Punch hole camera */}
              <div className="w-4 h-4 rounded-full bg-black border-2 border-slate-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className="text-amber-500 font-bold">5G</span>
                <span>📶</span>
                <span>94%</span>
              </div>
            </div>

            {/* Inner Phone Viewport */}
            <div
              className={`flex-1 flex flex-col overflow-hidden relative ${
                isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
              }`}
            >
              {children}
            </div>

            {/* Android Home Navigation Bar Pill */}
            <div
              className={`w-full py-1.5 flex items-center justify-center z-30 shrink-0 ${
                isLight ? 'bg-white border-t border-slate-200' : 'bg-slate-950'
              }`}
            >
              <div
                className={`w-32 h-1 rounded-full ${
                  isLight ? 'bg-slate-300' : 'bg-slate-600/70'
                }`}
              />
            </div>
          </div>
        ) : (
          // Responsive fluid container
          <div
            className={`w-full min-h-[820px] rounded-2xl shadow-xl flex flex-col overflow-hidden border transition-colors ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900'
                : 'bg-slate-950 border-slate-800/80 text-slate-100'
            }`}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
