import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  ShieldAlert,
  Plus,
  Bell,
  History,
  Ban,
  UserCheck,
  AlertTriangle,
  Coins,
  Trash2,
  Lock,
  PauseCircle,
  Gem,
  Check,
  Search,
  Sparkles,
  Gamepad2,
} from 'lucide-react';
import { MissionCategory, MissionDifficulty } from '../types/nexora';

export const AdminView: React.FC = () => {
  const {
    adminCreateMission,
    adminDeleteMission,
    adminUserAction,
    adminBroadcastNotification,
    auditLogs,
    currentUser,
    missions,
    friends,
    leaderboard,
    colorMode,
    showToast,
  } = useNexora();

  const isLight = colorMode === 'light';

  const [activeAdminTab, setActiveAdminTab] = useState<
    'users' | 'missions' | 'create-mission' | 'broadcast' | 'audit'
  >('users');

  // Search filter for users
  const [userSearch, setUserSearch] = useState('');

  // Selected player for direct actions
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // New Mission Form state
  const [missionTitle, setMissionTitle] = useState('');
  const [missionCat, setMissionCat] = useState<MissionCategory>('Action');
  const [missionDiff, setMissionDiff] = useState<MissionDifficulty>('Moyen');
  const [maxPlayers, setMaxPlayers] = useState<1 | 2 | 3>(2);
  const [description, setDescription] = useState('');
  const [rewardXp, setRewardXp] = useState(600);
  const [rewardCoins, setRewardCoins] = useState(400);

  // Broadcast state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  // Gather list of managed users
  const allManagedUsers = [
    {
      id: currentUser?.id || 'usr_001',
      username: currentUser?.username || 'Kaelen_Void',
      avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100',
      level: currentUser?.level || 18,
      rankTier: currentUser?.stats.rankTier || 'Diamant',
      status: currentUser?.status || 'active',
      isCurrent: true,
      coins: currentUser?.nexCoins || 2850,
      gems: currentUser?.quantumGems || 120,
    },
    ...leaderboard
      .filter((u) => u.username !== currentUser?.username)
      .map((u) => ({
        id: u.id,
        username: u.username,
        avatarUrl: u.avatarUrl,
        level: u.level,
        rankTier: u.rankTier,
        status: (u.username === 'Zack_Pixel' ? 'warned' : 'active') as 'active' | 'warned' | 'suspended' | 'banned',
        isCurrent: false,
        coins: u.level * 140,
        gems: 45,
      })),
  ];

  const filteredUsers = allManagedUsers.filter((u) =>
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleCreateMissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionTitle.trim()) return;

    await adminCreateMission({
      title: missionTitle.trim(),
      category: missionCat,
      difficulty: missionDiff,
      maxPlayers,
      description: description.trim() || 'Mission d intervention spéciale ordonnée par le commandement NEXORA.',
      xp: rewardXp,
      coins: rewardCoins,
      gems: 10,
      playableType: missionCat === 'Réflexion' || missionCat === 'Stratégie' ? 'matrix' : 'runner',
    });

    setMissionTitle('');
    setDescription('');
    setActiveAdminTab('missions');
  };

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;
    await adminBroadcastNotification(notifTitle.trim(), notifMessage.trim());
    setNotifTitle('');
    setNotifMessage('');
  };

  const handleDeleteUser = async (targetId: string, username: string) => {
    await adminUserAction('delete_user', targetId, undefined, `Suppression manuelle du joueur ${username}`);
    setConfirmDeleteId(null);
    showToast(`Compte de "${username}" supprimé de la base de données.`);
  };

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-4 pb-20 transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Header Banner */}
      <div
        className={`rounded-2xl p-4 border flex items-center justify-between shadow-lg ${
          isLight
            ? 'bg-rose-50 border-rose-200 text-rose-950'
            : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-sm flex items-center gap-2">
              CONSOLE D'ADMINISTRATION NEXORA
              <span className="text-[10px] bg-rose-600 text-white font-mono px-1.5 py-0.2 rounded font-bold">
                ROOT ACCESS
              </span>
            </h2>
            <p className="text-xs opacity-80">
              Modération, suppression, blocage, bannissement, catalogue et audit.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
        {[
          { id: 'users', label: 'Modération Joueurs', icon: UserCheck },
          { id: 'missions', label: 'Catalogue Missions', icon: Gamepad2 },
          { id: 'create-mission', label: '+ Créer Mission', icon: Plus },
          { id: 'broadcast', label: 'Push Annonce', icon: Bell },
          { id: 'audit', label: 'Journal d Audit', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : isLight
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: USERS MODERATION (SUPPRIMER, BLOQUER, BANNIR, AVERTIR, SUBVENTIONNER) */}
      {activeAdminTab === 'users' && (
        <div
          className={`border rounded-2xl p-4 space-y-4 text-xs ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-black text-sm uppercase tracking-wide block">
                Gestion des Comptes & Modération
              </span>
              <p className="text-[11px] text-slate-400">
                Actions directes : Bannir, Bloquer (24h), Avertir, Supprimer le compte ou Subventionner.
              </p>
            </div>

            {/* User Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un joueur..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className={`pl-8 pr-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              />
            </div>
          </div>

          {/* User Cards Grid */}
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-3.5 rounded-2xl border flex flex-col gap-3 transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-750'
                }`}
              >
                {/* User Row Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/50"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">{user.username}</span>
                        {user.isCurrent && (
                          <span className="text-[9px] font-mono bg-amber-500/20 text-amber-500 px-1 py-0.2 rounded font-bold">
                            MOI
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            user.status === 'banned'
                              ? 'bg-rose-500 text-white'
                              : user.status === 'suspended'
                              ? 'bg-orange-500 text-white'
                              : user.status === 'warned'
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-emerald-500/20 text-emerald-500'
                          }`}
                        >
                          {user.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>Lv.{user.level}</span>
                        <span>•</span>
                        <span>{user.rankTier}</span>
                        <span>•</span>
                        <span>{user.coins} 🪙</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons Bar */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/40">
                  {/* Action 1: BANNIR / DEBANNIR */}
                  {user.status !== 'banned' ? (
                    <button
                      onClick={() =>
                        adminUserAction('ban', user.id, undefined, `Bannissement infligé à ${user.username}`)
                      }
                      className="px-2.5 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-lg flex items-center gap-1 text-[11px] shadow-sm transition-all"
                      title="Bannir définitivement le joueur de tous les salons et parties"
                    >
                      <Ban className="w-3 h-3" />
                      <span>Bannir</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        adminUserAction('unban', user.id, undefined, `Rétablissement de ${user.username}`)
                      }
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1 text-[11px] shadow-sm transition-all"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>Débannir</span>
                    </button>
                  )}

                  {/* Action 2: BLOQUER (Suspendre 24h) */}
                  <button
                    onClick={() =>
                      adminUserAction(
                        'block',
                        user.id,
                        undefined,
                        `Suspension temporaire de 24h pour fair-play sur ${user.username}`
                      )
                    }
                    className={`px-2.5 py-1.5 font-bold rounded-lg flex items-center gap-1 text-[11px] border transition-all ${
                      user.status === 'suspended'
                        ? 'bg-orange-500 text-white border-orange-400'
                        : isLight
                        ? 'bg-orange-50 border-orange-300 text-orange-800 hover:bg-orange-100'
                        : 'bg-orange-950/40 border-orange-500/50 text-orange-300 hover:bg-orange-900/40'
                    }`}
                    title="Suspendre temporairement l'accès aux lobbies pour 24 heures"
                  >
                    <PauseCircle className="w-3 h-3" />
                    <span>Bloquer (24h)</span>
                  </button>

                  {/* Action 3: AVERTIR */}
                  <button
                    onClick={() =>
                      adminUserAction(
                        'warn',
                        user.id,
                        undefined,
                        `Avertissement officiel de modération adressé à ${user.username}`
                      )
                    }
                    className={`px-2.5 py-1.5 font-bold rounded-lg flex items-center gap-1 text-[11px] border transition-all ${
                      isLight
                        ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                        : 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30'
                    }`}
                    title="Envoyer une notification d'avertissement push au joueur"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Avertir</span>
                  </button>

                  {/* Action 4: SUBVENTIONNER (+1 000 Pièces) */}
                  <button
                    onClick={() => adminUserAction('grant_coins', user.id, 1000)}
                    className={`px-2.5 py-1.5 font-bold rounded-lg flex items-center gap-1 text-[11px] border transition-all ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                        : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750'
                    }`}
                    title="Créditer 1000 Pièces NEX"
                  >
                    <Coins className="w-3 h-3 text-amber-400" />
                    <span>+1 000 🪙</span>
                  </button>

                  {/* Action 5: SUPPRIMER LE COMPTE */}
                  {confirmDeleteId === user.id ? (
                    <div className="flex items-center gap-1 bg-rose-950 p-1 rounded-lg border border-rose-500 animate-fade-in">
                      <span className="text-[10px] text-rose-300 font-bold px-1">Confirmer ?</span>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-[10px]"
                      >
                        Oui, Supprimer
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold text-[10px]"
                      >
                        Non
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(user.id)}
                      className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-rose-950 border border-slate-700 hover:border-rose-600 text-slate-400 hover:text-rose-400 font-bold rounded-lg flex items-center gap-1 text-[11px] transition-all ml-auto"
                      title="Supprimer définitivement le profil et les données du joueur"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Supprimer</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MISSIONS CATALOG MANAGER & DELETE */}
      {activeAdminTab === 'missions' && (
        <div
          className={`border rounded-2xl p-4 space-y-3 text-xs ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-black text-sm uppercase tracking-wide block">
                Catalogue des Missions Actives ({missions.length})
              </span>
              <p className="text-[11px] text-slate-400">
                Gérez ou supprimez en un clic les missions du catalogue en direct.
              </p>
            </div>
            <button
              onClick={() => setActiveAdminTab('create-mission')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> + Nouvelle Mission
            </button>
          </div>

          <div className="space-y-2">
            {missions.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs truncate">{m.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 font-bold">
                      {m.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {m.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{m.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                    <span>+{m.reward.xp} XP</span>
                    <span>•</span>
                    <span>+{m.reward.coins} 🪙</span>
                    <span>•</span>
                    <span>Max {m.maxPlayers} Joueur(s)</span>
                  </div>
                </div>

                {/* Delete Mission Button */}
                <button
                  onClick={() => adminDeleteMission(m.id)}
                  className="px-3 py-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs shrink-0"
                  title="Supprimer cette mission immédiatement"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CREATE MISSION */}
      {activeAdminTab === 'create-mission' && (
        <form
          onSubmit={handleCreateMissionSubmit}
          className={`border rounded-2xl p-4 space-y-3 text-xs ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <span className="font-black text-sm uppercase tracking-wide block">
            Déployer une Nouvelle Mission Tactique
          </span>

          <div>
            <label className="text-slate-400 block mb-1">Nom de la Mission :</label>
            <input
              type="text"
              value={missionTitle}
              onChange={(e) => setMissionTitle(e.target.value)}
              placeholder="ex: Opération Nova-Strike"
              required
              className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-950 border-slate-800 text-slate-100'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Catégorie :</label>
              <select
                value={missionCat}
                onChange={(e: any) => setMissionCat(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <option value="Action">Action</option>
                <option value="Réflexion">Réflexion</option>
                <option value="Course">Course</option>
                <option value="Stratégie">Stratégie</option>
                <option value="RPG">RPG</option>
                <option value="Cartes">Cartes</option>
                <option value="Simulation">Simulation</option>
                <option value="Aventure">Aventure</option>
                <option value="Sport">Sport</option>
                <option value="Jeux de société">Jeux de société</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Difficulté :</label>
              <select
                value={missionDiff}
                onChange={(e: any) => setMissionDiff(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
                <option value="Héroïque">Héroïque</option>
                <option value="Légendaire">Légendaire</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Joueurs :</label>
              <select
                value={maxPlayers}
                onChange={(e: any) => setMaxPlayers(Number(e.target.value) as any)}
                className={`w-full border rounded-xl px-3 py-2 ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <option value={1}>1 Joueur (Solo)</option>
                <option value={2}>2 Joueurs (Duo)</option>
                <option value={3}>3 Joueurs (Trio Raid)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Gain XP :</label>
              <input
                type="number"
                value={rewardXp}
                onChange={(e) => setRewardXp(Number(e.target.value))}
                className={`w-full border rounded-xl px-3 py-2 ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-100'
                }`}
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Gain Pièces :</label>
              <input
                type="number"
                value={rewardCoins}
                onChange={(e) => setRewardCoins(Number(e.target.value))}
                className={`w-full border rounded-xl px-3 py-2 ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-100'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Briefing tactique :</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les objectifs et conditions de victoire..."
              rows={2}
              className={`w-full border rounded-xl px-3 py-2 resize-none ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-950 border-slate-800 text-slate-100'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl tracking-wide flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-rose-600/20"
          >
            <Plus className="w-4 h-4" /> Publier la Mission sur NEXORA
          </button>
        </form>
      )}

      {/* TAB 4: BROADCAST NOTIFICATION */}
      {activeAdminTab === 'broadcast' && (
        <form
          onSubmit={handleBroadcastSubmit}
          className={`border rounded-2xl p-4 space-y-3 text-xs ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <span className="font-black text-sm uppercase tracking-wide block">
            Envoyer une Notification Push Globale
          </span>

          <div>
            <label className="text-slate-400 block mb-1">Titre de l'alerte :</label>
            <input
              type="text"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              placeholder="ex: Événement Week-end Double Butin"
              required
              className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-950 border-slate-800 text-slate-100'
              }`}
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Message d'annonce :</label>
            <textarea
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              placeholder="Texte diffusé sur tous les téléphones connectés..."
              rows={3}
              required
              className={`w-full border rounded-xl px-3 py-2 resize-none ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-950 border-slate-800 text-slate-100'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl tracking-wide flex items-center justify-center gap-1.5 transition-colors shadow-md"
          >
            <Bell className="w-4 h-4" /> Diffuser à la Communauté
          </button>
        </form>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeAdminTab === 'audit' && (
        <div
          className={`border rounded-2xl p-4 space-y-2 text-xs ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <span className="font-black text-sm uppercase tracking-wide block mb-2">
            Journal d'Audit Système Chiffré en Temps Réel
          </span>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className={`p-2.5 rounded-xl border flex flex-col gap-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-500 text-[11px]">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[11px] leading-tight">{log.details}</p>
                <span className="text-[9px] text-slate-400 font-mono">
                  Par : {log.adminName} | Cible : {log.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
