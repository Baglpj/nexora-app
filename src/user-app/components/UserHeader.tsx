import React, { useState } from 'react';
import { useNexora } from '../../context/NexoraContext';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Sparkles,
  Zap,
  X,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  Menu,
} from 'lucide-react';

export const UserHeader: React.FC = () => {
  const {
    currentUser,
    notifications,
    dismissNotification,
    colorMode,
    toggleColorMode,
    activeTab,
    setActiveTab,
    toggleDrawer,
    openCheckout,
    setIsUniversalSearchOpen,
    searchFilterCategory,
    setSearchFilterCategory,
    activeThemePreset,
  } = useNexora();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  if (!currentUser) return null;

  const isLight = colorMode === 'light';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const categories = ['Tous', 'Action', 'Arcade', 'Réflexion', 'Course', 'Tournois'];

  return (
    <header
      className="relative px-3.5 pt-3 pb-2.5 flex flex-col gap-2 shrink-0 z-20 backdrop-blur-xl border-b transition-all duration-300"
      style={{
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.92)',
        borderColor: isLight ? '#e2e8f0' : 'rgba(51, 65, 85, 0.6)',
      }}
    >
      {/* Top Row: Nexora Drawer, Profile Avatar, Quick Search Trigger, Balances */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Nexora Logo + User Profile */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={toggleDrawer}
            className="flex items-center justify-center p-1 rounded-xl hover:opacity-85 active:scale-95 transition-all group"
            title="Menu NEXORA"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md p-0.5"
              style={{
                background: `linear-gradient(135deg, ${activeThemePreset.primaryColor}, ${activeThemePreset.accentColor})`,
              }}
            >
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <path d="M9 16V8l6 8V8" />
                </svg>
              </div>
            </div>
          </button>

          {/* User Profile Avatar with Blue Badge indicator (No global LV / No global hearts) */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 text-left group min-w-0"
            title="Voir mon profil et statistiques par jeu"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-8 h-8 rounded-full object-cover ring-2 transition-all shadow-sm"
                style={{ borderColor: activeThemePreset.primaryColor }}
              />
              {currentUser.hasBlueBadge && (
                <span
                  className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 shadow"
                  title="Badge Bleu Vérifié"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 fill-blue-500 text-white" />
                </span>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span
                  className={`font-black text-xs truncate max-w-[80px] sm:max-w-[110px] ${
                    isLight ? 'text-slate-900' : 'text-slate-100'
                  }`}
                >
                  {currentUser.username}
                </span>
                {currentUser.hasBlueBadge && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1 py-0.2 rounded shrink-0">
                    Vérifié
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 truncate">
                {currentUser.stats.rankTitle}
              </span>
            </div>
          </button>
        </div>

        {/* Right: XP Balance (Purchasable via Wave/Moov/MTN), Coins & Notifications */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* XP Balance with quick 'Acheter XP' button */}
          <button
            onClick={() =>
              openCheckout({
                type: 'xp_pack',
                id: 'xp_pack_5000',
                title: 'Pack 5 000 XP Booster',
                price: 6.0,
                xp: 5000,
              })
            }
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs border transition-all ${
              isLight
                ? 'bg-amber-50/90 border-amber-200 text-amber-900 hover:bg-amber-100'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
            title="Acheter de l'XP avec Wave, Moov, MTN ou Carte"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-mono font-bold text-[11px]">
              {currentUser.currentXp.toLocaleString('fr-FR')} XP
            </span>
            <PlusCircle className="w-3 h-3 text-amber-500 opacity-80" />
          </button>

          {/* Coins Balance */}
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs border transition-all ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-800'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
            title="Pièces NEX"
          >
            <span className="text-xs">🪙</span>
            <span className="font-mono font-bold text-[11px]">
              {currentUser.nexCoins.toLocaleString('fr-FR')}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className={`p-1.5 rounded-xl border relative transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifDropdown && (
              <div
                className={`absolute right-0 mt-2 w-72 rounded-2xl p-3 border shadow-2xl z-50 text-xs ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
                    : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/40">
                  <span className="font-black text-xs uppercase tracking-wide">Notifications</span>
                  <span className="text-[10px] text-slate-400 font-mono">{notifications.length} au total</span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">Aucune notification.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2 rounded-xl border flex flex-col gap-1 transition-colors ${
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
                        <span className="text-[9px] text-slate-500 self-end">{notif.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Universal Search Bar & Fast Category Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsUniversalSearchOpen(true)}
          className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-left border transition-all ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-500'
              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400'
          }`}
          title="Recherche instantanée de jeux et tournois"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs flex-1 truncate">
            Rechercher un jeu, un tournoi ou un joueur...
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 hidden sm:inline">
            Filtres
          </span>
        </button>

        <button
          onClick={() => setIsUniversalSearchOpen(true)}
          className={`p-2 rounded-xl border transition-all ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
          title="Filtrer par catégorie"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Category Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSearchFilterCategory(cat);
              if (activeTab !== 'home' && activeTab !== 'missions') {
                setActiveTab('missions');
              }
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
              searchFilterCategory === cat
                ? 'text-white shadow-sm'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
            style={{
              backgroundColor: searchFilterCategory === cat ? activeThemePreset.primaryColor : undefined,
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
};
