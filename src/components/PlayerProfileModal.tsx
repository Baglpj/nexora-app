import React from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  X,
  Trophy,
  Shield,
  Swords,
  Crown,
  Lock,
  MessageSquare,
  Users,
  Sparkles,
  Flame,
  Award,
} from 'lucide-react';

export const PlayerProfileModal: React.FC = () => {
  const {
    inspectedUser,
    closeInspectUser,
    colorMode,
    startLobby,
    missions,
    setActiveTab,
    showToast,
  } = useNexora();

  if (!inspectedUser) return null;

  const isLight = colorMode === 'light';
  const isPrivate = inspectedUser.privacyMode === 'private';
  const isFriendsOnly = inspectedUser.privacyMode === 'friends' && !inspectedUser.isFriend;

  const handleInviteToSquad = () => {
    if (missions.length > 0) {
      startLobby(missions[0]);
      closeInspectUser();
      showToast(`Invitation de salon envoyée à ${inspectedUser.username} !`);
    }
  };

  const handleOpenChat = () => {
    closeInspectUser();
    setActiveTab('social');
    showToast(`Conversation ouverte avec ${inspectedUser.username}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div
        className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-950 border-slate-800 text-slate-100'
        }`}
      >
        {/* Header Banner */}
        <div className="relative h-24 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 p-3 flex justify-between items-start">
          <span className="text-[10px] font-mono font-black text-slate-950 bg-white/70 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
            Fiche Joueur NEXORA
          </span>
          <button
            onClick={closeInspectUser}
            className="w-8 h-8 rounded-full bg-slate-950/50 hover:bg-slate-950 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar & Main Identity */}
        <div className="px-5 pt-0 pb-4 relative -mt-10">
          <div className="flex items-end justify-between mb-3">
            <div className="relative">
              <img
                src={inspectedUser.avatarUrl}
                alt={inspectedUser.username}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-950 shadow-xl"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
                  inspectedUser.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
                title={inspectedUser.isOnline ? 'En ligne' : 'Hors ligne'}
              />
            </div>

            <div className="text-right">
              <span className="inline-block text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-500 border border-amber-500/30">
                {inspectedUser.rankTier}
              </span>
              <p className="text-xs font-mono font-bold text-amber-400 mt-1">
                Niveau {inspectedUser.level}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black tracking-tight">{inspectedUser.username}</h2>
            {inspectedUser.isPremium && (
              <span className="p-1 rounded-md bg-amber-500 text-slate-950 shadow">
                <Crown className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-medium">{inspectedUser.rankTitle || 'Pionnier Spatial'}</p>
        </div>

          {/* Content Section: Respect Privacy Settings */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3.5 no-scrollbar">
          {/* Card: Position au Classement & Ligue */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between shadow-sm ${
              isLight
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-slate-900'
                : 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/30 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
                <Trophy className="w-5 h-5 fill-amber-500/30" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Position Classement Mondial
                </span>
                <span className="font-mono font-black text-sm text-amber-500">
                  {inspectedUser.rankPosition ? `#${inspectedUser.rankPosition} Mondial` : 'Classé Top 10'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Points de Ligue
              </span>
              <span className="font-mono font-bold text-xs text-slate-300">
                {(inspectedUser.rankScore || (inspectedUser.stats?.highScore ?? 0)).toLocaleString()} PTS
              </span>
            </div>
          </div>

          {isPrivate || isFriendsOnly ? (
            /* Restricted / Private View */
            <div
              className={`p-4 rounded-2xl border text-center space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wide">
                {isPrivate ? 'Profil Configuré en Privé' : 'Profil Réservé aux Amis'}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isPrivate
                  ? 'Ce joueur a configuré son compte en mode privé. Ses statistiques détaillées de parties et son équipement ne sont pas consultables.'
                  : 'Ce joueur réserve la consultation de ses statistiques détaillées de parties à sa liste d amis.'}
              </p>
            </div>
          ) : (
            /* Public View: Full Stats & Equipment */
            <>
              {/* Detailed Stats Grid */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Statistiques de Combat & Performance
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`p-3 rounded-2xl border ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-850'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Victoires
                    </span>
                    <p className="text-base font-black text-emerald-400 font-mono mt-0.5">
                      {inspectedUser.stats?.victories ?? 0}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {inspectedUser.stats?.gamesPlayed ?? 0} parties
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-850'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Ratio de Victoires
                    </span>
                    <p className="text-base font-black text-amber-400 font-mono mt-0.5">
                      {inspectedUser.stats?.winRate ?? 0}%
                    </p>
                    <span className="text-[10px] text-slate-500">Parties compétitives</span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border col-span-2 flex items-center justify-between ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-850'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Score Record Cyber Dash
                      </span>
                      <p className="text-base font-black text-cyan-400 font-mono mt-0.5">
                        {(inspectedUser.stats?.highScore ?? 0).toLocaleString()} pts
                      </p>
                    </div>
                    <Flame className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
              </div>

              {/* Equipped Gear Display */}
              <div
                className={`p-3 rounded-2xl border space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Équipement Principal Visible</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Swords className="w-3.5 h-3.5 text-rose-400" /> Arme :
                  </span>
                  <span className="font-bold text-slate-200">
                    {inspectedUser.equippedWeapon || 'Katana Plasma Solaire'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" /> Armure :
                  </span>
                  <span className="font-bold text-slate-200">
                    {inspectedUser.equippedArmor || 'Cuirasse Nanotechnologique'}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Action: Consulter uniquement les statistiques et le classement */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                closeInspectUser();
                setActiveTab('profile');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>Consulter dans le Classement Global</span>
            </button>
            <button
              onClick={closeInspectUser}
              className={`w-full py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-750 text-slate-300'
              }`}
            >
              Fermer la fiche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
