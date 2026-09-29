import React, { useState } from 'react';
import { useNexora } from '../../context/NexoraContext';
import { GameMasterySection } from '../components/GameMasterySection';
import {
  User,
  Shield,
  CheckCircle2,
  Palette,
  Receipt,
  Zap,
  CreditCard,
  Crown,
  Share2,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    currentUser,
    colorMode,
    themePresets,
    activeThemePreset,
    setActiveThemePreset,
    paymentTransactions,
    showToast,
  } = useNexora();

  const [activeProfileTab, setActiveProfileTab] = useState<'mastery' | 'themes' | 'receipts'>(
    'mastery'
  );

  if (!currentUser) return null;

  const isLight = colorMode === 'light';

  // Only display themes made available by admin
  const availablePresets = themePresets.filter((t) => t.isAvailableForUsers);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar pb-16">
      {/* Player Header Identity Card (No global LV / No global lives) */}
      <div className="p-4 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.username}
              className="w-16 h-16 rounded-2xl object-cover ring-2 shadow-lg"
              style={{ borderColor: activeThemePreset.primaryColor }}
            />
            {currentUser.hasBlueBadge && (
              <span
                className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 shadow-md"
                title="Badge Bleu Vérifié"
              >
                <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white" />
              </span>
            )}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white truncate">{currentUser.username}</h2>
              {currentUser.hasBlueBadge ? (
                <span className="text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  Badge Bleu
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  Joueur
                </span>
              )}
            </div>

            <p className="text-xs text-amber-400 font-bold font-mono">
              {currentUser.stats.rankTitle} • {currentUser.stats.rankTier}
            </p>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
              <span>{currentUser.currentXp.toLocaleString('fr-FR')} XP</span>
              <span>•</span>
              <span>{currentUser.nexCoins.toLocaleString('fr-FR')} 🪙</span>
              <span>•</span>
              <span>{currentUser.quantumGems} 💎</span>
            </div>
          </div>
        </div>

        {/* Subscription status pill */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Abonnement Actif :</span>
          <span className="font-bold text-emerald-400 font-mono">
            {currentUser.activeSubscriptionTier === 'pro_4'
              ? 'Pass NEXORA Pro (4 €/mois)'
              : currentUser.activeSubscriptionTier === 'starter_2'
              ? 'Pass Starter (2 €/mois)'
              : currentUser.activeSubscriptionTier === 'elite_8'
              ? 'Pass Elite (8 €/mois)'
              : 'Accès Gratuit Standard'}
          </span>
        </div>
      </div>

      {/* Profile Section Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
        <button
          onClick={() => setActiveProfileTab('mastery')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeProfileTab === 'mastery'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Niveaux par Jeu
        </button>

        <button
          onClick={() => setActiveProfileTab('themes')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeProfileTab === 'themes'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Thèmes d'Affichage
        </button>

        <button
          onClick={() => setActiveProfileTab('receipts')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeProfileTab === 'receipts'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Reçus & Paiements
        </button>
      </div>

      {/* Tab 1: Game Mastery (Levels and stats per game) */}
      {activeProfileTab === 'mastery' && <GameMasterySection />}

      {/* Tab 2: Theme Presets Chooser (Configured by admin: YouTube, TikTok, WhatsApp, Insta, Facebook, Obsidian) */}
      {activeProfileTab === 'themes' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Styles Visuels de l'Application</span>
            </h3>
            <span className="text-[10px] text-slate-400">Proposés par l'administration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availablePresets.map((preset) => {
              const isSelected = activeThemePreset.id === preset.id;

              return (
                <button
                  key={preset.id}
                  onClick={() => setActiveThemePreset(preset)}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'ring-2 ring-amber-400 border-amber-400 bg-slate-900 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-xl shadow shrink-0 mt-0.5 border"
                    style={{
                      backgroundColor: preset.primaryColor,
                      borderColor: preset.accentColor,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-white truncate">{preset.name}</h4>
                      {isSelected && (
                        <span className="text-[9px] font-black font-mono uppercase bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded">
                          ACTIF
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                      {preset.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Receipts & Transaction Ledger */}
      {activeProfileTab === 'receipts' && (
        <div className="space-y-3">
          <h3 className="font-black text-sm text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Historique des Reçus Numériques</span>
          </h3>

          <div className="space-y-2">
            {paymentTransactions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Aucune transaction enregistrée.</p>
            ) : (
              paymentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl border border-slate-800 bg-slate-900/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{tx.itemTitle}</span>
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {tx.provider}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Réf: {tx.receiptNumber} • {tx.timestamp}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-emerald-400 font-mono">
                      {tx.amountFiat.toFixed(2)} €
                    </span>
                    <span className="block text-[9px] text-slate-500 font-mono">Payé</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
