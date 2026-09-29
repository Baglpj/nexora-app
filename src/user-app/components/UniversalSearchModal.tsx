import React, { useState } from 'react';
import { useNexora } from '../../context/NexoraContext';
import { Search, X, Play, Trophy, Users, Star, Sparkles, Filter } from 'lucide-react';
import { Mission } from '../../types/nexora';

export const UniversalSearchModal: React.FC = () => {
  const {
    isUniversalSearchOpen,
    setIsUniversalSearchOpen,
    missions,
    tournaments,
    startPlayMission,
    startLobby,
    colorMode,
    searchFilterCategory,
    setSearchFilterCategory,
    activeThemePreset,
  } = useNexora();

  const [query, setQuery] = useState('');

  if (!isUniversalSearchOpen) return null;

  const isLight = colorMode === 'light';
  const categories = ['Tous', 'Action', 'Arcade', 'Réflexion', 'Course', 'Tournois'];

  const filteredMissions = missions.filter((m) => {
    const matchesCategory =
      searchFilterCategory === 'Tous' ||
      searchFilterCategory === 'Tournois' ||
      m.category.toLowerCase() === searchFilterCategory.toLowerCase();

    const matchesQuery =
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.description.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  const filteredTournaments = tournaments.filter((t) => {
    return (
      (searchFilterCategory === 'Tous' || searchFilterCategory === 'Tournois') &&
      (t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.gameTitle.toLowerCase().includes(query.toLowerCase()))
    );
  });

  const handleLaunch = (mission: Mission) => {
    setIsUniversalSearchOpen(false);
    startPlayMission(mission);
  };

  const handleOpenLobby = (mission: Mission) => {
    setIsUniversalSearchOpen(false);
    startLobby(mission);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-12 sm:pt-20 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl flex flex-col max-h-[82vh] overflow-hidden transition-all ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800/60 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Rechercher par titre de jeu, catégorie, tournoi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder-slate-500 font-medium ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsUniversalSearchOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold shrink-0"
          >
            Fermer
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 border-b border-slate-800/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSearchFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
                searchFilterCategory === cat
                  ? 'text-white shadow'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              style={{
                backgroundColor: searchFilterCategory === cat ? activeThemePreset.primaryColor : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Tournaments Section if matching */}
          {filteredTournaments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400 tracking-wider">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Tournois Compétitifs Liés</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {filteredTournaments.map((tourney) => (
                  <div
                    key={tourney.id}
                    className="p-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-amber-300">{tourney.title}</span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                          {tourney.prizePoolGems} 💎 Cagnotte
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Jeu : {tourney.gameTitle} • Fin dans {tourney.endsIn}</p>
                    </div>
                    <button
                      onClick={() => {
                        const m = missions.find((item) => item.id === tourney.gameId) || missions[0];
                        handleLaunch(m);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0"
                    >
                      Participer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Games & Missions List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Jeux Disponibles ({filteredMissions.length})</span>
            </div>

            {filteredMissions.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">Aucun jeu ne correspond à votre recherche "{query}".</p>
                <p className="text-[11px] mt-1">Essayez une autre catégorie ou réinitialisez les filtres.</p>
              </div>
            ) : (
              filteredMissions.map((mission) => (
                <div
                  key={mission.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-md text-white font-black"
                      style={{
                        background: mission.coverGradient || 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      }}
                    >
                      {mission.category === 'Action' ? '⚡' : mission.category === 'Réflexion' ? '🔮' : '🏎️'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs truncate">{mission.title}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300">
                          {mission.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 max-w-[200px] sm:max-w-xs">
                        {mission.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                        <span>+{mission.reward.xp} XP</span>
                        <span>•</span>
                        <span>+{mission.reward.coins} 🪙</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenLobby(mission)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        isLight
                          ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                          : 'bg-slate-700/60 hover:bg-slate-700 border-slate-600 text-slate-200'
                      }`}
                      title="Ouvrir la fiche et les avis"
                    >
                      Fiche
                    </button>
                    <button
                      onClick={() => handleLaunch(mission)}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black text-slate-950 shadow-md hover:scale-105 active:scale-95 transition-all"
                      style={{
                        backgroundColor: activeThemePreset.primaryColor,
                        color: '#020617',
                      }}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Jouer</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
