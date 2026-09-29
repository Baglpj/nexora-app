import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import { Bell, Crown, Heart, Sparkles, X, Menu, Sun, Moon, LayoutDashboard, Rocket, ArrowLeft } from 'lucide-react';

export const TopHeaderBar: React.FC = () => {
  const {
    currentUser,
    notifications,
    dismissNotification,
    activeTab,
    setActiveTab,
    toggleDrawer,
    colorMode,
    toggleColorMode,
    switchAppMode,
  } = useNexora();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  if (!currentUser) return null;

  const isLight = colorMode === 'light';
  const xpPercent = Math.min(100, Math.round((currentUser.currentXp / currentUser.nextLevelXp) * 100));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={`relative px-4 py-2.5 flex flex-col gap-2 shrink-0 z-20 backdrop-blur-md border-b transition-colors ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
          : 'bg-slate-900/90 border-slate-800/80 text-slate-100'
      }`}
    >
      {/* Upper line: NEXORA Drawer Button, Profile, Level, Currencies, Bell */}
      <div className="flex items-center justify-between gap-2">
        {/* Left Side: Back Arrow (if not home) + NEXORA Logo Drawer Button + Profile */}
        <div className="flex items-center gap-2">
          {/* Back to Home arrow if not on home tab */}
          {activeTab !== 'home' && (
            <button
              onClick={() => setActiveTab('home')}
              className={`p-1.5 rounded-xl border transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
              }`}
              title="Retour à l'Accueil"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {/* Interactive NEXORA Drawer Trigger */}
          <button
            onClick={toggleDrawer}
            className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-amber-500/10 active:scale-95 transition-all group"
            title="Ouvrir le menu NEXORA et fonctionnalités modernes"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <path d="M9 16V8l6 8V8" />
                </svg>
              </div>
            </div>
          </button>

          {/* User Avatar & Level info - Clean circle with level beside it */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400 group-hover:ring-amber-300 transition-all shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-900 rounded-full" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-black text-xs truncate max-w-[85px] sm:max-w-[120px] transition-colors ${
                    isLight
                      ? 'text-slate-900 group-hover:text-amber-600'
                      : 'text-slate-100 group-hover:text-amber-300'
                  }`}
                >
                  {currentUser.username}
                </span>

                {/* Level pill beside username */}
                <span
                  className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full border leading-tight ${
                    isLight
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-slate-800/90 border-amber-500/50 text-amber-300'
                  }`}
                >
                  Niv.{currentUser.level}
                </span>

                {currentUser.isPremium && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-500 border border-amber-500/40 px-1 py-0.2 rounded">
                    VIP
                  </span>
                )}
              </div>
              <span className="text-[10px] text-amber-500 font-medium">
                {currentUser.stats.rankTitle}
              </span>
            </div>
          </button>
        </div>

        {/* Right Side: Studio Switcher, Theme, Currencies & Notification */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick link to separate Play Console app */}
          <button
            onClick={() => switchAppMode('admin-console')}
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-black bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/40 text-blue-400 hover:border-blue-400 transition-all shadow-sm"
            title="Ouvrir la Console Développeur & Éditeur NEXORA (Portail Séparé)"
          >
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Play Console</span>
          </button>

          {/* Quick theme toggle */}
          <button
            onClick={toggleColorMode}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-amber-600 hover:bg-slate-200'
                : 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
            }`}
            title={isLight ? 'Passer en Mode Sombre' : 'Passer en Mode Clair'}
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Hearts / Lives */}
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border ${
              isLight
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/70'
            }`}
            title="Vies restantes"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="font-mono font-bold text-rose-500 text-[11px]">
              {currentUser.lives}/{currentUser.maxLives}
            </span>
          </button>

          {/* NEX Coins */}
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border ${
              isLight
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/70'
            }`}
            title="Pièces NEX"
          >
            <span className="text-amber-500 text-xs">🪙</span>
            <span className="font-mono font-bold text-amber-500 text-[11px]">
              {currentUser.nexCoins.toLocaleString('fr-FR')}
            </span>
          </button>

          {/* Quantum Gems */}
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border hidden sm:flex ${
              isLight
                ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/70'
            }`}
            title="Gemmes Quantiques"
          >
            <span className="text-cyan-500 text-xs">💎</span>
            <span className="font-mono font-bold text-cyan-500 text-[11px]">
              {currentUser.quantumGems}
            </span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className={`relative p-2 rounded-lg border transition-colors ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/70'
              }`}
              title="Centre de notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifDropdown && (
              <div
                className={`absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl shadow-2xl p-3 z-50 text-xs border ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-900 shadow-xl'
                    : 'bg-slate-900 border-slate-800 text-slate-100'
                }`}
              >
                <div
                  className={`flex items-center justify-between pb-2 mb-2 border-b ${
                    isLight ? 'border-slate-200' : 'border-slate-800'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1.5 text-amber-500">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Notifications ({notifications.length})
                  </span>
                  <button
                    onClick={() => setShowNotifDropdown(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">Aucune notification.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-colors ${
                          notif.read
                            ? isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-600'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400'
                            : isLight
                            ? 'bg-amber-50 border-amber-200 text-slate-900'
                            : 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-500 text-[11px] truncate">
                            {notif.title}
                          </span>
                          <button
                            onClick={() => dismissNotification(notif.id)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] leading-tight">{notif.message}</p>
                        <span className="text-[9px] text-slate-400 self-end">{notif.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lower line: XP Progress bar */}
      <div className="w-full flex items-center gap-2">
        <div
          className={`flex-1 h-1.5 rounded-full overflow-hidden ${
            isLight ? 'bg-slate-200' : 'bg-slate-800'
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <span
          className={`font-mono text-[10px] shrink-0 font-semibold ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          {currentUser.currentXp}/{currentUser.nextLevelXp} XP ({xpPercent}%)
        </span>
      </div>
    </header>
  );
};
