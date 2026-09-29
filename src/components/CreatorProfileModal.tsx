import React from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  X,
  Crown,
  Sparkles,
  Gamepad2,
  Users,
  Star,
  Play,
  Gem,
  Award,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

export const CreatorProfileModal: React.FC = () => {
  const {
    selectedCreatorForModal,
    setSelectedCreatorForModal,
    followCreator,
    startPlayMission,
    startLobby,
    missions,
    currentUser,
    claimCreatorRoyalties,
    creatorEarnings,
    showToast,
  } = useNexora();

  if (!selectedCreatorForModal) return null;

  const isCurrentUser =
    currentUser?.id === selectedCreatorForModal.id ||
    currentUser?.username === selectedCreatorForModal.username;

  const handlePlayGame = (gameTitle: string) => {
    // Find matching mission
    const mission = missions.find(
      (m) =>
        m.title.toLowerCase().includes(gameTitle.toLowerCase()) ||
        gameTitle.toLowerCase().includes(m.title.toLowerCase())
    );
    setSelectedCreatorForModal(null);
    if (mission) {
      startPlayMission(mission);
    } else if (missions.length > 0) {
      startPlayMission(missions[0]);
    } else {
      showToast(`Lancement de ${gameTitle}...`);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-amber-500/30 via-purple-600/30 to-cyan-500/30 relative border-b border-slate-800 flex items-start justify-end p-3">
          <button
            onClick={() => setSelectedCreatorForModal(null)}
            className="p-1.5 rounded-full bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creator Info Header */}
        <div className="px-5 pb-3 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-3 -mt-12">
          <div className="flex items-end gap-3.5">
            <div className="relative">
              <img
                src={selectedCreatorForModal.avatarUrl}
                alt={selectedCreatorForModal.username}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-lg text-slate-950 shadow-md">
                <Crown className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-white">
                  {selectedCreatorForModal.username}
                </h3>
                {selectedCreatorForModal.verifiedBadge && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                )}
              </div>
              <p className="text-xs text-amber-400 font-bold">
                {selectedCreatorForModal.studioName}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Créateur VIP {selectedCreatorForModal.vipTier}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCurrentUser ? (
              <button
                onClick={() => followCreator(selectedCreatorForModal.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                  selectedCreatorForModal.isFollowing
                    ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>
                  {selectedCreatorForModal.isFollowing ? '✓ Abonné' : '+ Suivre'}
                </span>
              </button>
            ) : (
              <span className="text-xs font-bold text-slate-400 px-3 py-1.5 bg-slate-800 rounded-xl">
                Votre Vitrine Publique
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Bio */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedCreatorForModal.bio}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Abonnés</span>
              <span className="text-sm font-black text-slate-100 font-mono">
                {selectedCreatorForModal.followersCount.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Parties Jouées</span>
              <span className="text-sm font-black text-cyan-400 font-mono">
                {selectedCreatorForModal.totalPlays.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Note Moyenne</span>
              <span className="text-sm font-black text-amber-400 font-mono flex items-center justify-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {selectedCreatorForModal.averageRating}
              </span>
            </div>
          </div>

          {/* If current user: Royalties claim widget */}
          {isCurrentUser && (
            <div className="bg-gradient-to-br from-amber-500/20 via-slate-950 to-slate-950 border border-amber-500/40 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Gem className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">
                      Gains & Royalties VIP
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      +5 Gemmes Quantiques par partie complétée
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">En attente</span>
                  <span className="text-base font-black text-cyan-300 font-mono flex items-center gap-1 justify-end">
                    <Gem className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                    +{creatorEarnings.pendingGems} 💎
                  </span>
                </div>
              </div>

              <button
                onClick={claimCreatorRoyalties}
                disabled={creatorEarnings.pendingGems <= 0}
                className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  creatorEarnings.pendingGems > 0
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>
                  {creatorEarnings.pendingGems > 0
                    ? `Encaisser mes ${creatorEarnings.pendingGems} Gemmes`
                    : 'Aucun gain en attente'}
                </span>
              </button>
            </div>
          )}

          {/* Published Games Showcase */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Jeux Publiés par le Studio ({selectedCreatorForModal.gamesPublished.length})</span>
            </h4>

            <div className="space-y-2">
              {selectedCreatorForModal.gamesPublished.map((game) => (
                <div
                  key={game.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-3 rounded-2xl flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={game.iconUrl}
                      alt={game.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-100">{game.title}</h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400">{game.category}</span>
                        <span className="text-[10px] text-amber-400 flex items-center gap-0.5 font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          {game.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayGame(game.title)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 transition-all active:scale-95 shadow-md shadow-amber-500/20"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Jouer</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            NEXORA VIP Creator Network · Programme Partenaire Officiel
          </p>
        </div>
      </div>
    </div>
  );
};
