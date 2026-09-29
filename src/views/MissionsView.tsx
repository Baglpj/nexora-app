import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import { Mission, MissionCategory } from '../types/nexora';
import { Play, Users, Sparkles, Filter, Plus, Flame, Clock, Star, Trophy, MessageSquare } from 'lucide-react';

const CATEGORIES: ('Toutes' | MissionCategory)[] = [
  'Toutes',
  'Action',
  'Réflexion',
  'Course',
  'Stratégie',
  'RPG',
  'Cartes',
  'Simulation',
  'Aventure',
  'Sport',
  'Jeux de société',
];

export const MissionsView: React.FC = () => {
  const { missions, startPlayMission, startLobby, activeRole, setActiveTab, gameReviews, tournaments } = useNexora();
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Toutes');

  const filteredMissions = missions.filter((m) => {
    const matchCat = selectedCategory === 'Toutes' || m.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'Toutes' || m.difficulty === selectedDifficulty;
    return matchCat && matchDiff;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
      {/* Top Header with title and Admin Shortcut */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Missions & Arènes de Jeu
          </h2>
          <p className="text-xs text-slate-400">
            Jouez seul, rejoignez les tournois avec récompenses en gemmes et notez vos jeux favoris.
          </p>
        </div>

        {activeRole === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-600/20 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-1 hover:bg-rose-600/30"
          >
            <Plus className="w-3.5 h-3.5" /> + Mission
          </button>
        )}
      </div>

      {/* Categories Horizontal Scroll Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty Filters */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 text-[11px] font-mono">Difficulté :</span>
        {['Toutes', 'Facile', 'Moyen', 'Difficile', 'Héroïque'].map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              selectedDifficulty === diff
                ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Missions Grid */}
      <div className="space-y-3">
        {filteredMissions.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-xs">Aucune mission trouvée pour cette catégorie.</p>
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const isHighTier = mission.difficulty === 'Héroïque' || mission.difficulty === 'Légendaire';

            // Find reviews for this mission
            const reviews = gameReviews.filter(
              (r) =>
                r.gameId === mission.id ||
                r.gameTitle.toLowerCase().includes(mission.title.toLowerCase()) ||
                mission.title.toLowerCase().includes(r.gameTitle.toLowerCase())
            );
            const avgRating =
              reviews.length > 0
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : '4.9';

            // Find tournament
            const tournament = tournaments.find(
              (t) =>
                t.gameId === mission.id ||
                mission.title.toLowerCase().includes(t.gameTitle.toLowerCase()) ||
                t.gameTitle.toLowerCase().includes(mission.title.toLowerCase())
            );

            return (
              <div
                key={mission.id}
                className={`rounded-2xl border bg-gradient-to-br ${mission.coverGradient} p-4 transition-all hover:border-amber-500/40 shadow-lg ${
                  isHighTier ? 'border-purple-500/40 ring-1 ring-purple-500/20' : 'border-slate-800'
                }`}
              >
                {/* Header Strip with Category, Rating & Players */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-amber-400 border border-slate-700 px-2 py-0.5 rounded">
                      {mission.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        mission.difficulty === 'Facile'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : mission.difficulty === 'Moyen'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {mission.difficulty}
                    </span>

                    {/* Community Rating Pill */}
                    <button
                      onClick={() => startLobby(mission)}
                      className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 hover:bg-amber-500/20 transition-colors"
                      title="Voir les avis de la communauté"
                    >
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      <span>{avgRating}</span>
                      <span className="text-[9px] text-slate-400">({reviews.length})</span>
                    </button>

                    {mission.isCustom && (
                      <span className="text-[9px] font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        Jeu Communautaire
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Users className="w-3 h-3" /> Max {mission.maxPlayers}J
                  </span>
                </div>

                <h3 className="font-black text-sm text-slate-100 mb-1">{mission.title}</h3>
                <p className="text-xs text-slate-300 mb-2.5 leading-relaxed">{mission.description}</p>

                {/* Tournament Banner if active */}
                {tournament && (
                  <div
                    onClick={() => startLobby(mission)}
                    className="cursor-pointer mb-2.5 bg-gradient-to-r from-amber-500/15 via-slate-900 to-purple-500/15 border border-amber-500/30 hover:border-amber-500/60 p-2 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-slate-200 text-[11px] line-clamp-1">
                        {tournament.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-cyan-300 shrink-0 ml-2">
                      {tournament.prizePoolGems} 💎 · Fin dans {tournament.endsIn}
                    </span>
                  </div>
                )}

                {/* Rewards strip */}
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                  <span className="bg-slate-900/80 border border-slate-700/80 text-emerald-400 font-mono font-bold px-2 py-1 rounded-lg text-[11px]">
                    +{mission.reward.xp} XP
                  </span>
                  <span className="bg-slate-900/80 border border-slate-700/80 text-amber-300 font-mono font-bold px-2 py-1 rounded-lg text-[11px]">
                    +{mission.reward.coins} 🪙
                  </span>
                  {mission.reward.gems && (
                    <span className="bg-slate-900/80 border border-slate-700/80 text-cyan-300 font-mono font-bold px-2 py-1 rounded-lg text-[11px]">
                      +{mission.reward.gems} 💎
                    </span>
                  )}
                  {mission.reward.itemLoot && (
                    <span className="bg-slate-900/80 border border-slate-700/80 text-purple-300 font-mono text-[11px] px-2 py-1 rounded-lg flex items-center gap-1">
                      {mission.reward.itemLoot.icon} {mission.reward.itemLoot.name}
                    </span>
                  )}
                </div>

                {/* Play and Details Buttons */}
                <div className="flex gap-2 pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => startPlayMission(mission)}
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Lancer Solo
                  </button>

                  <button
                    onClick={() => startLobby(mission)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    Fiche & Avis ({reviews.length})
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

