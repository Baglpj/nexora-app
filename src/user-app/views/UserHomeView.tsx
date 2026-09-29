import React from 'react';
import { useNexora } from '../../context/NexoraContext';
import {
  Play,
  Trophy,
  Users,
  Flame,
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  Star,
} from 'lucide-react';
import { Mission } from '../../types/nexora';

export const UserHomeView: React.FC = () => {
  const {
    missions,
    startPlayMission,
    startLobby,
    tournaments,
    openCheckout,
    colorMode,
    activeThemePreset,
    setActiveTab,
    setIsUniversalSearchOpen,
    searchFilterCategory,
  } = useNexora();

  const isLight = colorMode === 'light';

  // Hero Featured Mission
  const heroMission = missions[0];

  const filteredMissions = missions.filter((m) => {
    if (searchFilterCategory === 'Tous' || searchFilterCategory === 'Tournois') return true;
    return m.category.toLowerCase() === searchFilterCategory.toLowerCase();
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar pb-10">
      {/* Hero Spotlight Game Banner */}
      {heroMission && (
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 text-white">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black font-mono tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>À la Une • Saison eSport</span>
              </span>
              <span className="text-xs font-mono text-slate-300">
                {heroMission.activePlayersCount} joueurs en ligne
              </span>
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight text-white">{heroMission.title}</h2>
              <p className="text-xs text-slate-300 line-clamp-2 mt-1 max-w-sm">
                {heroMission.description}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => startPlayMission(heroMission)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs text-slate-950 shadow-lg hover:scale-105 active:scale-95 transition-all"
                style={{ backgroundColor: activeThemePreset.primaryColor }}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Jouer Maintenant</span>
              </button>

              <button
                onClick={() => startLobby(heroMission)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Fiche & Avis</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tournaments Teaser Banner */}
      {tournaments.length > 0 && (
        <div className="p-4 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xl border border-cyan-500/30">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xs text-cyan-300">{tournaments[0].title}</h3>
                <span className="text-[9px] font-mono bg-cyan-500 text-slate-950 px-1 py-0.2 rounded font-black">
                  EN COURS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cagnotte : <strong className="text-amber-400">{tournaments[0].prizePoolGems} Gemmes</strong> • Fin dans {tournaments[0].endsIn}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('missions')}
            className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/40 shrink-0"
            title="Voir les tournois"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Playable Games Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-100 flex items-center gap-2">
            <span>Catalogue des Jeux</span>
            <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-full">
              {filteredMissions.length}
            </span>
          </h3>

          <button
            onClick={() => setIsUniversalSearchOpen(true)}
            className="text-xs text-amber-400 hover:underline font-bold"
          >
            Recherche avancée
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className={`p-4 rounded-3xl border transition-all duration-300 flex flex-col justify-between shadow-md ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-amber-300'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/80">
                    {mission.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    {mission.activePlayersCount} joueurs
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md shrink-0 text-white"
                    style={{
                      background: mission.coverGradient || 'linear-gradient(135deg, #f59e0b, #d97706)',
                    }}
                  >
                    {mission.category === 'Action' ? '⚡' : mission.category === 'Réflexion' ? '🔮' : '🏎️'}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-black text-xs text-white truncate">{mission.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {mission.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
                  <span>Récompense :</span>
                  <span className="font-bold text-amber-400">+{mission.reward.xp} XP</span>
                  <span className="font-bold text-yellow-300">+{mission.reward.coins} 🪙</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 mt-1 border-t border-slate-800/40">
                <button
                  onClick={() => startLobby(mission)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-center"
                >
                  Fiche & Avis
                </button>
                <button
                  onClick={() => startPlayMission(mission)}
                  className="flex-1 py-2 rounded-xl text-xs font-black text-slate-950 shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1"
                  style={{ backgroundColor: activeThemePreset.primaryColor }}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Jouer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
