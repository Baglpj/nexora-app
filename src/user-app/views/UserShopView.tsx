import React, { useState } from 'react';
import { useNexora } from '../../context/NexoraContext';
import {
  Zap,
  Coins,
  Crown,
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const UserShopView: React.FC = () => {
  const {
    openCheckout,
    currentUser,
    shopItems,
    buyShopItem,
    colorMode,
    activeThemePreset,
    showToast,
  } = useNexora();

  const [activeShopTab, setActiveShopTab] = useState<'fiat_recharge' | 'subscriptions' | 'items'>(
    'fiat_recharge'
  );

  const isLight = colorMode === 'light';

  // Real Money Packs for XP and Coins (Wave, Moov, MTN, CB)
  const xpPacks = [
    {
      id: 'xp_pack_1000',
      title: 'Pack Découverte 1 000 XP',
      price: 1.5,
      xp: 1000,
      badge: 'Starter',
      description: 'Idéal pour débloquer vos premières récompenses et invitations.',
    },
    {
      id: 'xp_pack_5000',
      title: 'Pack Champion 5 000 XP',
      price: 6.0,
      xp: 5000,
      badge: 'Populaire 🔥',
      description: 'Gros boost d expérience pour grimper dans les classements.',
    },
    {
      id: 'xp_pack_15000',
      title: 'Coffre Stellaire 15 000 XP',
      price: 15.0,
      xp: 15000,
      badge: 'Meilleure Valeur',
      description: 'Accès maximal aux artefacts d élite et tournois privés.',
    },
  ];

  const coinsPacks = [
    {
      id: 'coins_pack_1500',
      title: 'Bourse de 1 500 Pièces',
      price: 2.0,
      coins: 1500,
      badge: 'Standard',
      description: 'Pour acheter des skins et consommables de jeu.',
    },
    {
      id: 'coins_pack_5000',
      title: 'Pochette de 5 000 Pièces',
      price: 5.5,
      coins: 5000,
      badge: 'Éco 🪙',
      description: 'Le pack équilibré pour équiper tout votre inventaire.',
    },
  ];

  // Subscription Tiers (2€, 4€, 8€)
  const subscriptionTiers = [
    {
      id: 'sub_starter_2',
      title: 'Pass Starter',
      price: 2.0,
      tier: 'starter_2' as const,
      period: 'mois',
      color: 'border-slate-700 bg-slate-900',
      badge: '2 €/mois',
      features: [
        'Accès à tous les jeux de base sans restriction',
        '0 publicités intrusives',
        'Booster XP permanent +15%',
        '1 tournoi hebdomadaire offert',
      ],
    },
    {
      id: 'sub_pro_4',
      title: 'Pass NEXORA Pro',
      price: 4.0,
      tier: 'pro_4' as const,
      period: 'mois',
      color: 'border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-slate-900',
      badge: '4 €/mois • Recommandé 🔥',
      features: [
        'Tous les avantages Starter inclus',
        'Booster XP x2 permanent sur toutes les victoires',
        'Accès illimité à tous les tournois saisonniers',
        'Badge VIP sur le profil et chat',
        'Priorité de matchmaking 24/7',
      ],
    },
    {
      id: 'sub_elite_8',
      title: 'Pass Elite Ultra',
      price: 8.0,
      tier: 'elite_8' as const,
      period: 'mois',
      color: 'border-cyan-500/50 bg-gradient-to-b from-cyan-500/10 to-slate-900',
      badge: '8 €/mois (x2)',
      features: [
        'Formule Maximale Pro multipliée par 2',
        'Booster XP x3 et Gemmes Quantiques mensuelles (+50 💎)',
        'Accès aux prototypes exclusifs en avant-première',
        'Statut Candidat Badge Bleu Vérifié',
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar pb-16">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
        <button
          onClick={() => setActiveShopTab('fiat_recharge')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeShopTab === 'fiat_recharge'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Acheter XP & Pièces</span>
        </button>

        <button
          onClick={() => setActiveShopTab('subscriptions')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeShopTab === 'subscriptions'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Abonnements (2€ / 4€)</span>
        </button>

        <button
          onClick={() => setActiveShopTab('items')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeShopTab === 'items'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Boutique d'Items</span>
        </button>
      </div>

      {/* Operator Trust Banner */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Paiement direct Wave, Moov Money, MTN Money et Cartes</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Sans abonnement forcé
        </span>
      </div>

      {/* Tab 1: Direct Fiat Recharge (XP / Coins) */}
      {activeShopTab === 'fiat_recharge' && (
        <div className="space-y-5">
          {/* XP Packs Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Packs d'XP (Achat Direct en Monnaie Réelle)</span>
              </h3>
              <span className="text-[10px] text-slate-400">Pour artefacts & invitations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {xpPacks.map((pack) => (
                <div
                  key={pack.id}
                  className="p-4 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-slate-900 flex flex-col justify-between space-y-3 shadow-lg"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                        {pack.badge}
                      </span>
                      <span className="font-black text-base text-amber-400">
                        {pack.price.toFixed(2)} €
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-white">{pack.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">{pack.description}</p>
                  </div>

                  <button
                    onClick={() =>
                      openCheckout({
                        type: 'xp_pack',
                        id: pack.id,
                        title: pack.title,
                        price: pack.price,
                        xp: pack.xp,
                      })
                    }
                    className="w-full py-2.5 rounded-xl font-black text-xs text-slate-950 shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: activeThemePreset.primaryColor }}
                  >
                    <span>Acheter • {pack.price.toFixed(2)} €</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Coins Packs Section */}
          <div className="space-y-3">
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <span>🪙 Packs de Pièces NEX</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coinsPacks.map((pack) => (
                <div
                  key={pack.id}
                  className="p-4 rounded-3xl border border-slate-800 bg-slate-900 flex flex-col justify-between space-y-3 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {pack.badge}
                      </span>
                      <span className="font-black text-base text-yellow-400">
                        {pack.price.toFixed(2)} €
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-white">{pack.title}</h4>
                    <p className="text-[11px] text-slate-400">{pack.description}</p>
                  </div>

                  <button
                    onClick={() =>
                      openCheckout({
                        type: 'coins_pack',
                        id: pack.id,
                        title: pack.title,
                        price: pack.price,
                        coins: pack.coins,
                      })
                    }
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700 transition-all text-center"
                  >
                    Acheter {pack.coins} Pièces
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Subscriptions (2€, 4€, Pro x2) */}
      {activeShopTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="font-black text-base text-white">Formules d'Abonnement NEXORA</h3>
            <p className="text-xs text-slate-400">
              Choisissez votre cadence avec des limites d'accès adaptées et transparentes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {subscriptionTiers.map((sub) => {
              const isCurrent = currentUser?.activeSubscriptionTier === sub.tier;

              return (
                <div
                  key={sub.id}
                  className={`p-4 rounded-3xl border ${sub.color} flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                        {sub.badge}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                          ACTIF
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-white">{sub.title}</h4>
                      <p className="text-base font-black text-amber-400 mt-0.5">
                        {sub.price.toFixed(2)} € <span className="text-xs text-slate-400 font-normal">/ mois</span>
                      </p>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                      {sub.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() =>
                      openCheckout({
                        type: 'subscription',
                        id: sub.id,
                        title: sub.title,
                        price: sub.price,
                        subTier: sub.tier,
                      })
                    }
                    disabled={isCurrent}
                    className="w-full py-2.5 rounded-xl font-black text-xs text-slate-950 shadow-md hover:brightness-110 active:scale-98 transition-all disabled:opacity-40"
                    style={{ backgroundColor: activeThemePreset.primaryColor }}
                  >
                    {isCurrent ? 'Formule Actuelle' : `S'abonner (${sub.price.toFixed(2)} €/mois)`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Artifacts & In-game Items */}
      {activeShopTab === 'items' && (
        <div className="space-y-3">
          <h3 className="font-black text-sm text-white flex items-center gap-2">
            <span>Artefacts & Équipements de Jeu</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shopItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-3xl border border-slate-800 bg-slate-900 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                    <span className="text-[10px] font-mono text-amber-400 font-bold mt-1 inline-block">
                      {item.price} 🪙 Pièces
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => buyShopItem(item.id)}
                  className="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shrink-0"
                >
                  Acheter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
