import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  Trophy,
  Shield,
  ShieldCheck,
  Award,
  Lock,
  Edit3,
  Check,
  Sun,
  Moon,
  Eye,
  Zap,
  Target,
  Swords,
  Flame,
  Share2,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    leaderboard,
    updateProfile,
    showToast,
    openInspectUser,
    colorMode,
    setColorMode,
  } = useNexora();

  const isLight = colorMode === 'light';

  const [activeTab, setActiveTab] = useState<'stats' | 'equipment' | 'leaderboard' | 'theme' | 'security'>('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(currentUser?.username || '');
  const [privacyMode, setPrivacyMode] = useState(currentUser?.privacyMode || 'public');
  const [twoFactor, setTwoFactor] = useState(currentUser?.twoFactorEnabled ?? true);

  if (!currentUser) return null;

  const handleSaveProfile = async () => {
    await updateProfile({
      username: editUsername,
      privacyMode,
      twoFactorEnabled: twoFactor,
    });
    setIsEditing(false);
  };

  const handleShareCard = () => {
    showToast('Carte Pro de joueur copiée dans le presse-papiers !');
  };

  const xpPercent = Math.min(100, Math.round((currentUser.currentXp / currentUser.nextLevelXp) * 100));

  const equippedWeapon = currentUser.inventory.find((i) => i.id === currentUser.equippedWeaponId);
  const equippedArmor = currentUser.inventory.find((i) => i.id === currentUser.equippedArmorId);

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-4 pb-20 transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* PROFESSIONAL PRO GAMER HEADER CARD */}
      <div
        className={`border rounded-3xl p-5 shadow-2xl relative overflow-hidden transition-colors ${
          isLight
            ? 'bg-white border-slate-200 shadow-slate-200/60'
            : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800'
        }`}
      >
        {/* Top subtle decorative ambient glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
          {/* 1. BIEN RONDE AVATAR (Perfect circle with glowing pro ring and live indicator) */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-xl shadow-amber-500/20"
              />
              {/* Online status indicator */}
              <span
                className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full shadow"
                title="En ligne - Serveur Compétitif"
              />
            </div>

            {/* 2. NIVEAU A COTE (Level cleanly placed beside avatar, NO version text) */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black tracking-tight truncate">{currentUser.username}</h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  PRO CERTIFIÉ
                </span>
              </div>

              {/* Level indicator pill cleanly next to avatar */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm ${
                    isLight
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-800/90 border-amber-500/40 text-amber-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-black font-mono">Niveau {currentUser.level}</span>
                </div>
                <span className="text-xs font-bold text-amber-500">{currentUser.stats.rankTitle}</span>
              </div>

              {/* Tag & Team Info */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                <span className="font-mono text-amber-400/90 font-bold">#NX-88219</span>
                <span>•</span>
                <span>Team Vortex [QVTX]</span>
                <span>•</span>
                <span className="uppercase text-[10px] tracking-wider font-semibold">
                  {currentUser.privacyMode}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons (Edit & Share Pro Card) */}
          <div className="flex items-center gap-2 self-end sm:self-center ml-auto">
            <button
              onClick={handleShareCard}
              className={`p-2 rounded-xl border transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Partager ma Carte Joueur Pro"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modifier</span>
            </button>
          </div>
        </div>

        {/* XP Progress Bar cleanly under the identity */}
        <div className="mt-4 pt-3 border-t border-slate-800/40">
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3 text-amber-400" /> Progression XP Pro
            </span>
            <span className="text-amber-400 font-bold">
              {currentUser.currentXp.toLocaleString()} / {currentUser.nextLevelXp.toLocaleString()} XP ({xpPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500 shadow-sm shadow-amber-400/50"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Edit Form Modal Drawer */}
        {isEditing && (
          <div
            className={`mt-4 pt-4 border-t space-y-3 animate-fade-in text-xs ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Pseudo de joueur professionnel :</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 font-bold ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-100'
                }`}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Visibilité du profil compétitif :</span>
              <select
                value={privacyMode}
                onChange={(e: any) => setPrivacyMode(e.target.value)}
                className={`border rounded-lg px-2.5 py-1.5 font-bold ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <option value="public">Public (Visible dans le classement)</option>
                <option value="friends">Amis uniquement</option>
                <option value="private">Privé (Statistiques masquées)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsEditing(false)}
                className={`px-3 py-1.5 rounded-lg ${
                  isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg hover:bg-amber-400"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PRO ESPORTS QUICK METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div
          className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Score ELO Pro
          </span>
          <p className="text-lg font-black text-amber-400 font-mono mt-0.5">2 450 PTS</p>
          <span className="text-[10px] text-emerald-500 font-semibold">Top 0.5% Mondial</span>
        </div>

        <div
          className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Taux de Victoire
          </span>
          <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
            {currentUser.stats.winRate}%
          </p>
          <span className="text-[10px] text-slate-400">{currentUser.stats.victories} Victoires / {currentUser.stats.gamesPlayed}</span>
        </div>

        <div
          className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Précision & K/D
          </span>
          <p className="text-lg font-black text-cyan-400 font-mono mt-0.5">94.2%</p>
          <span className="text-[10px] text-slate-400">Ratio K/D: 3.85</span>
        </div>

        <div
          className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Rang Compétitif
          </span>
          <p className="text-lg font-black text-purple-400 font-mono mt-0.5">
            #{leaderboard.find((l) => l.isCurrentUser)?.rank || 4}
          </p>
          <span className="text-[10px] text-amber-500 font-semibold">{currentUser.stats.rankTier}</span>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`flex items-center gap-1.5 border-b pb-2 text-xs overflow-x-auto no-scrollbar ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}
      >
        {[
          { id: 'stats', label: 'Statistiques Pro' },
          { id: 'equipment', label: 'Équipement de Tournoi' },
          { id: 'leaderboard', label: 'Classement Mondial' },
          { id: 'theme', label: 'Thème & Affichage' },
          { id: 'security', label: 'Sécurité & 2FA' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DETAILED PRO STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div
              className={`p-3.5 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Parties Disputées
                </span>
                <Target className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <p className="text-xl font-black text-amber-400 font-mono">
                {currentUser.stats.gamesPlayed}
              </p>
              <span className="text-[10px] text-slate-400">Total arènes officielles</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Victoires Totales
                </span>
                <Trophy className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className="text-xl font-black text-emerald-400 font-mono">
                {currentUser.stats.victories}
              </p>
              <span className="text-[10px] text-slate-400">Taux de victoire : {currentUser.stats.winRate}%</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Score Record
                </span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl font-black text-cyan-400 font-mono">
                {currentUser.stats.highScore.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400">Points en arène Cyber Dash</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Défis & Succès
                </span>
                <Award className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-xl font-black text-purple-400 font-mono">
                {currentUser.stats.challengesCompleted}
              </p>
              <span className="text-[10px] text-slate-400">Saison & ligue compétitive</span>
            </div>
          </div>

          {/* Esports Trophy Cabinet */}
          <div
            className={`border rounded-2xl p-4 space-y-3 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider block">
                Trophées & Médailles Compétitives
              </span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-2xl block mb-1">🏆</span>
                <p className="font-black text-[11px] text-amber-400">Champion S3</p>
                <span className="text-[9px] text-slate-400">Arène Maître</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <span className="text-2xl block mb-1">⚡</span>
                <p className="font-black text-[11px] text-cyan-400">Vitesse Pure</p>
                <span className="text-[9px] text-slate-400">300 km/h sans crash</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <span className="text-2xl block mb-1">🛡️</span>
                <p className="font-black text-[11px] text-purple-400">Invaincu</p>
                <span className="text-[9px] text-slate-400">10 victoires d affilée</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOURNAMENT EQUIPMENT SHOWCASE */}
      {activeTab === 'equipment' && (
        <div className="space-y-3 text-xs">
          <div
            className={`border rounded-2xl p-4 space-y-3 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <span className="text-xs font-black uppercase tracking-wider block">
              Armurerie & Équipement Actif de Compétition
            </span>
            <div className="space-y-2">
              {equippedWeapon ? (
                <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{equippedWeapon.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400">{equippedWeapon.name}</span>
                        <span className="text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                          {equippedWeapon.rarity}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{equippedWeapon.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-amber-400 font-bold block">+85 ATQ</span>
                    <span className="text-[9px] text-slate-400">Arme active</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-center py-2">Aucune arme équipée.</p>
              )}

              {equippedArmor ? (
                <div className="p-3 rounded-xl border border-cyan-500/40 bg-cyan-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{equippedArmor.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400">{equippedArmor.name}</span>
                        <span className="text-[9px] font-bold uppercase bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded">
                          {equippedArmor.rarity}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{equippedArmor.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-cyan-400 font-bold block">+60 DEF</span>
                    <span className="text-[9px] text-slate-400">Armure active</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-center py-2">Aucune armure équipée.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEADERBOARD WITH CLICKABLE PLAYER PROFILES */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          <div
            className={`border rounded-2xl p-3.5 space-y-2.5 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-xs font-black uppercase tracking-wide block">
                  Classement Mondial des Pilotes NEXORA
                </span>
                <p className="text-[10px] text-slate-400">
                  Cliquez sur n'importe quel joueur pour voir son profil public.
                </p>
              </div>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>

            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => openInspectUser(entry)}
                  role="button"
                  tabIndex={0}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer group ${
                    entry.isCurrentUser
                      ? isLight
                        ? 'bg-amber-50 border-amber-300 shadow-sm'
                        : 'bg-amber-500/10 border-amber-500/50'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      : 'bg-slate-950 border-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-black text-xs w-6 text-center ${
                        entry.rank === 1
                          ? 'text-amber-500 text-sm'
                          : entry.rank === 2
                          ? 'text-slate-400'
                          : entry.rank === 3
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      #{entry.rank}
                    </span>

                    <img
                      src={entry.avatarUrl}
                      alt={entry.username}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-amber-500/40"
                    />

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs group-hover:text-amber-500 transition-colors">
                          {entry.username}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1 rounded">
                            Moi
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-amber-500 font-mono">
                        {entry.rankTier} • Lv.{entry.level}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs">
                      {entry.score.toLocaleString()} <span className="text-amber-500 text-[10px]">PTS</span>
                    </span>
                    <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: THEME & DISPLAY (DARK / LIGHT MODE) */}
      {activeTab === 'theme' && (
        <div
          className={`border rounded-2xl p-4 space-y-4 text-xs ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div>
            <span className="font-black text-sm uppercase tracking-wide block">
              Préférences d'Affichage & Thème Visuel
            </span>
            <p className="text-[11px] text-slate-400">
              Choisissez entre le mode sombre cyberpunk immersif ou le mode clair minimaliste blanc et gris ardoise épuré.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Dark Mode Card */}
            <button
              onClick={() => setColorMode('dark')}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                !isLight
                  ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/50 shadow-lg text-slate-100'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Moon className="w-5 h-5 text-amber-400" />
                {!isLight && (
                  <span className="p-1 rounded-full bg-amber-500 text-slate-950">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div>
                <p className="font-black text-xs">Mode Sombre</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Obsidian profond & néons ambre/cyan</p>
              </div>
            </button>

            {/* Light Mode Card */}
            <button
              onClick={() => setColorMode('light')}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                isLight
                  ? 'bg-white border-amber-500 ring-2 ring-amber-500/50 shadow-lg text-slate-900'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Sun className="w-5 h-5 text-amber-500" />
                {isLight && (
                  <span className="p-1 rounded-full bg-amber-500 text-slate-950">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div>
                <p className="font-black text-xs">Mode Clair</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Blanc pur minimaliste & gris ardoise</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY & 2FA */}
      {activeTab === 'security' && (
        <div
          className={`border rounded-2xl p-4 space-y-4 text-xs ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <h3 className="font-black text-xs uppercase tracking-wide">
              Sécurité du Compte & Protection 2FA
            </h3>
          </div>

          <div
            className={`border rounded-xl p-3 flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <div>
              <span className="font-bold block">Double Authentification (2FA)</span>
              <span className="text-slate-400 text-[11px]">
                Sécurisation des retraits et de l'inventaire rare.
              </span>
            </div>
            <button
              onClick={() => {
                setTwoFactor(!twoFactor);
                updateProfile({ twoFactorEnabled: !twoFactor });
              }}
              className={`px-3 py-1 rounded-full font-bold text-[11px] transition-colors ${
                twoFactor
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {twoFactor ? 'Activé' : 'Désactivé'}
            </button>
          </div>

          <div
            className={`border rounded-xl p-3 space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <span className="font-bold block">Adresse de Secours Chiffrée</span>
            <p className="text-slate-400 text-[11px]">
              E-mail de liaison : <strong className="text-amber-500">{currentUser.email}</strong>
            </p>
            <button
              onClick={() => showToast('Email de vérification envoyé à ' + currentUser.email)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              Changer le mot de passe
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
