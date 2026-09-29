import React from 'react';
import { useNexora } from '../../context/NexoraContext';
import {
  TrendingUp,
  Users,
  ShieldAlert,
  Zap,
  CreditCard,
  Crown,
  Smartphone,
  CheckCircle,
  Receipt,
  Trophy,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { paymentTransactions, allUsersList, missions, socialPosts } = useNexora();

  const totalFiatRevenue = paymentTransactions.reduce((acc, tx) => acc + tx.amountFiat, 0);
  const totalXpSold = paymentTransactions
    .filter((tx) => tx.grantedXp)
    .reduce((acc, tx) => acc + (tx.grantedXp || 0), 0);

  const activeSubscribers = allUsersList.filter((u) => u.isPremium).length;
  const bannedCount = allUsersList.filter((u) => u.status === 'banned').length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto no-scrollbar pb-16">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
          <span>TABLEAU DE BORD EXÉCUTIF & TRÉSORERIE</span>
        </h2>
        <p className="text-xs text-slate-400">
          Suivi consolidé des paiements Wave/Moov/MTN, abonnements et modération
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-4 rounded-3xl bg-[#0b1120] border border-blue-500/30 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase">Revenus Encaissés</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {totalFiatRevenue.toFixed(2)} €
          </p>
          <p className="text-[11px] text-emerald-400 font-mono">
            ≈ {(totalFiatRevenue * 655.957).toFixed(0)} F CFA reçus
          </p>
        </div>

        {/* XP Sold */}
        <div className="p-4 rounded-3xl bg-[#0b1120] border border-amber-500/30 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase">Volume XP Vendu</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">
            +{totalXpSold.toLocaleString('fr-FR')} XP
          </p>
          <p className="text-[11px] text-slate-400 font-mono">Ventes directes sans abonnement</p>
        </div>

        {/* Active Subscribers */}
        <div className="p-4 rounded-3xl bg-[#0b1120] border border-purple-500/30 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase">Abonnés Premium</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-300 font-mono">{activeSubscribers}</p>
          <p className="text-[11px] text-purple-400 font-mono">Pass 2€, 4€ et 8€ actifs</p>
        </div>

        {/* Moderation / Safety */}
        <div className="p-4 rounded-3xl bg-[#0b1120] border border-rose-500/30 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase">Comptes Bannis</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-400 font-mono">{bannedCount}</p>
          <p className="text-[11px] text-slate-400 font-mono">Sur {allUsersList.length} comptes audités</p>
        </div>
      </div>

      {/* Two Columns: Recent Payment Ledger + Quick System Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Ledger (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-[#090d1a] border border-slate-800/80 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white font-mono">
                Dernières Transactions Monétaires (Wave, Moov, MTN, CB)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold">
              {paymentTransactions.length} enregistrées
            </span>
          </div>

          <div className="space-y-2">
            {paymentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-base">
                    {tx.provider === 'wave'
                      ? '🌊'
                      : tx.provider === 'moov'
                      ? '📱'
                      : tx.provider === 'mtn'
                      ? '🟡'
                      : '💳'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{tx.userName}</span>
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {tx.provider}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{tx.itemTitle}</p>
                    <span className="text-[9px] text-slate-500 font-mono">
                      Réf: {tx.receiptNumber} • {tx.timestamp}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-emerald-400 font-mono text-sm">
                    +{tx.amountFiat.toFixed(2)} €
                  </span>
                  <span className="block text-[9px] text-emerald-500/80 font-mono uppercase font-bold">
                    Confirmé
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick System Summary */}
        <div className="rounded-3xl bg-[#090d1a] border border-slate-800/80 p-5 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white font-mono border-b border-slate-800 pb-3">
            Statut du Parc Jeux & Social
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between">
              <span className="text-slate-400">Jeux Déployés :</span>
              <span className="font-bold text-cyan-400">{missions.length} Actifs</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between">
              <span className="text-slate-400">Publications Modérées :</span>
              <span className="font-bold text-amber-400">{socialPosts.length} En Ligne</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between">
              <span className="text-slate-400">Règle de Sécurité :</span>
              <span className="font-bold text-emerald-400">RBAC Token Enforced</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-[11px] text-slate-300 leading-relaxed font-sans">
              <p className="font-bold text-blue-400 mb-1">Rappel de Sécurité :</p>
              Aucun utilisateur ne peut modifier les catalogues de jeux ou s'octroyer des privilèges d'administrateur. Toutes les actions sensibles sont journalisées.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
