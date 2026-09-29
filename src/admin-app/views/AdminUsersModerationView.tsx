import React, { useState } from 'react';
import { useNexora } from '../../context/NexoraContext';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Award,
  Zap,
  Coins,
  Search,
  Filter,
} from 'lucide-react';

export const AdminUsersModerationView: React.FC = () => {
  const {
    allUsersList,
    adminToggleUserBlueBadge,
    adminBanUserAccount,
    adminUnbanUserAccount,
    showToast,
  } = useNexora();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = allUsersList.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 overflow-y-auto no-scrollbar pb-16">
      {/* Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>MODÉRATION DES UTILISATEURS & GESTION DES BADGES</span>
          </h2>
          <p className="text-xs text-slate-400">
            Contrôle des privilèges, attribution du Badge Bleu Vérifié et sanctions de bannissement
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par pseudo ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Blue Badge Explanatory Banner */}
      <div className="p-4 rounded-3xl bg-blue-950/20 border border-blue-800/40 text-xs text-slate-300 flex items-start gap-3 shadow-lg">
        <Award className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-blue-400">Politique d'Attribution du Badge Bleu Vérifié :</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Seul l'administrateur propriétaire peut délivrer le <strong>Badge Bleu</strong>. Les détenteurs de ce badge sont certifiés comme créateurs reconnus et bénéficient des autorisations pour soumettre des projets de code (HTML, CSS, JS, Dart) pour leurs fans. Les utilisateurs sans badge restent en mode joueur standard (photos et textes simples).
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-[#090d1a] border border-slate-800/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Statut & Rôle</th>
                <th className="p-4">Badge Vérifié</th>
                <th className="p-4">XP & Pièces</th>
                <th className="p-4">Abonnement</th>
                <th className="p-4 text-right">Actions Administrateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => {
                const isBanned = user.status === 'banned';

                return (
                  <tr key={user.id} className="hover:bg-slate-850/40 transition-colors">
                    {/* User */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800 shadow"
                        />
                        <div>
                          <p className="font-bold text-white font-sans text-xs">{user.username}</p>
                          <p className="text-[10px] text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {isBanned ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          BANNI
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          ACTIF
                        </span>
                      )}
                    </td>

                    {/* Blue Badge Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => adminToggleUserBlueBadge(user.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                          user.hasBlueBadge
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                        title="Cliquer pour accorder ou retirer le Badge Bleu"
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            user.hasBlueBadge ? 'fill-blue-500 text-white' : 'text-slate-500'
                          }`}
                        />
                        <span>{user.hasBlueBadge ? 'Badge Actif' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Balances */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="text-amber-400 font-bold">
                          {user.currentXp.toLocaleString('fr-FR')} XP
                        </p>
                        <p className="text-yellow-300 text-[10px]">
                          {user.nexCoins.toLocaleString('fr-FR')} 🪙
                        </p>
                      </div>
                    </td>

                    {/* Subscription */}
                    <td className="p-4">
                      <span className="text-slate-300">
                        {user.activeSubscriptionTier === 'pro_4'
                          ? 'Pass Pro (4€)'
                          : user.activeSubscriptionTier === 'starter_2'
                          ? 'Pass Starter (2€)'
                          : user.activeSubscriptionTier === 'elite_8'
                          ? 'Pass Elite (8€)'
                          : 'Gratuit'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      {isBanned ? (
                        <button
                          onClick={() => adminUnbanUserAccount(user.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
                        >
                          Débannir
                        </button>
                      ) : (
                        <button
                          onClick={() => adminBanUserAccount(user.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-all"
                        >
                          Bannir le Compte
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
