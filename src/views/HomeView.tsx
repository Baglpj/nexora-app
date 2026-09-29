import React from 'react';
import { useNexora } from '../context/NexoraContext';
import { Play, Users, Trophy, Flame, Sparkles, ChevronRight, Zap, ArrowUpRight, Eye, Star } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    missions,
    challenges,
    friends,
    statusPosts,
    setActiveTab,
    startLobby,
    startPlayMission,
    currentUser,
    colorMode,
    openInspectUser,
    gameReviews,
    tournaments,
  } = useNexora();

  const isLight = colorMode === 'light';
  const heroMission = missions && missions.length > 0 ? missions[0] : null;

  const heroReviews = heroMission
    ? gameReviews.filter(
        (r) =>
          r.gameId === heroMission.id ||
          r.gameTitle.toLowerCase().includes(heroMission.title.toLowerCase()) ||
          heroMission.title.toLowerCase().includes(r.gameTitle.toLowerCase())
      )
    : [];

  const heroAvgRating =
    heroReviews.length > 0
      ? (heroReviews.reduce((sum, r) => sum + r.rating, 0) / heroReviews.length).toFixed(1)
      : '4.9';

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-4 pb-20 transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Hero Featured Mission Card */}
      {heroMission ? (
        <div
          className={`relative rounded-3xl overflow-hidden border p-4 shadow-xl transition-all ${
            isLight
              ? 'bg-gradient-to-br from-amber-100/70 via-white to-amber-50/50 border-amber-300 shadow-amber-500/10'
              : 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border-amber-500/40 shadow-amber-500/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-500 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500 fill-current" /> MISSION VEDETTE DU JOUR
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startLobby(heroMission)}
                className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded flex items-center gap-1"
                title="Consulter les avis joueurs"
              >
                <Star className="w-2.5 h-2.5 fill-amber-400" />
                <span>{heroAvgRating}</span>
                <span className="text-slate-400">({heroReviews.length})</span>
              </button>
              <span className="text-[10px] font-mono text-slate-400">
                👥 {heroMission.activePlayersCount ?? 0}
              </span>
            </div>
          </div>

          <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight mb-1">
            {heroMission.title}
          </h2>
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
            {heroMission.description}
          </p>

          {/* Reward pills */}
          <div className="flex items-center gap-2 mb-3 text-xs">
            <div
              className={`px-2 py-1 rounded-lg flex items-center gap-1 font-mono font-bold text-[11px] border ${
                isLight
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-900/90 border-slate-700 text-emerald-400'
              }`}
            >
              <span>+{heroMission.reward?.xp ?? 0} XP</span>
            </div>
            <div
              className={`px-2 py-1 rounded-lg flex items-center gap-1 font-mono font-bold text-[11px] border ${
                isLight
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-slate-900/90 border-slate-700 text-amber-300'
              }`}
            >
              <span>+{heroMission.reward?.coins ?? 0} 🪙</span>
            </div>
            {heroMission.reward?.itemLoot && (
              <div
                className={`px-2 py-1 rounded-lg flex items-center gap-1 font-mono text-[11px] border ${
                  isLight
                    ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                    : 'bg-slate-900/90 border-slate-700 text-cyan-300'
                }`}
              >
                <span>
                  {heroMission.reward.itemLoot.icon} {heroMission.reward.itemLoot.name}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => startPlayMission(heroMission)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              Jouer en Solo
            </button>
            <button
              onClick={() => startLobby(heroMission)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/50 text-amber-300'
              }`}
              title="Créer un salon d'escouade multijoueur"
            >
              <Users className="w-4 h-4" />
              <span>Escouade</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Quick Category Jump Bar */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setActiveTab('missions')}
          className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all group ${
            isLight
              ? 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
              : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <span className="text-xl mb-1 group-hover:scale-110 transition-transform">⚔️</span>
          <span className="text-[11px] font-bold">Action</span>
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all group ${
            isLight
              ? 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
              : 'bg-slate-900 border-slate-800 hover:border-cyan-500/50'
          }`}
        >
          <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🧩</span>
          <span className="text-[11px] font-bold">Réflexion</span>
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all group ${
            isLight
              ? 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
              : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🏎️</span>
          <span className="text-[11px] font-bold">Course</span>
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all group ${
            isLight
              ? 'bg-white border-slate-200 hover:border-purple-400 shadow-sm'
              : 'bg-slate-900 border-slate-800 hover:border-purple-500/50'
          }`}
        >
          <span className="text-xl mb-1 group-hover:scale-110 transition-transform">👥</span>
          <span className="text-[11px] font-bold">Raid Coop</span>
        </button>
      </div>

      {/* Daily Challenges Section */}
      <div
        className={`border rounded-2xl p-3.5 space-y-3 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="font-black text-xs uppercase tracking-wide">
              Défis Quotidiens ({challenges.filter((c) => c.isCompleted).length}/{challenges.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Reset dans 14h</span>
        </div>

        <div className="space-y-2">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              className={`border rounded-xl p-2.5 flex flex-col gap-1.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{ch.title}</span>
                <span className="text-[10px] font-mono text-amber-500 font-bold">
                  +{ch.rewardXp} XP | +{ch.rewardCoins} 🪙
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{ch.description}</p>
              <div className="flex items-center gap-2 pt-0.5">
                <div
                  className={`flex-1 h-1.5 rounded-full overflow-hidden ${
                    isLight ? 'bg-slate-200' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${
                      ch.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (ch.progress / ch.maxProgress) * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {ch.progress}/{ch.maxProgress}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Online Friends Carousel (Clickable to inspect profile) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold">Amis en ligne (cliquez pour inspecter)</span>
          <button
            onClick={() => setActiveTab('social')}
            className="text-[11px] text-amber-500 hover:underline flex items-center gap-0.5 font-bold"
          >
            Tous ({friends.length}) <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => openInspectUser(friend)}
              className={`flex flex-col items-center p-2 rounded-2xl border min-w-[76px] shrink-0 text-center transition-all group ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="relative mb-1">
                <img
                  src={friend.avatarUrl}
                  alt={friend.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/40 group-hover:ring-amber-400 transition-all"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                    isLight ? 'border-white' : 'border-slate-900'
                  } ${friend.isOnline ? 'bg-emerald-400' : 'bg-slate-400'}`}
                />
              </div>
              <span className="text-[10px] font-bold truncate w-16 group-hover:text-amber-500 transition-colors">
                {friend.username}
              </span>
              <span className="text-[9px] font-mono text-amber-500">Lv.{friend.level}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
