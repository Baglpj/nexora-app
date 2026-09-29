import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import { ShoppingBag, Crown, Heart, Sparkles, Gift, Share2, Copy, Check, Flame } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { shopItems, buyShopItem, currentUser, showToast } = useNexora();
  const [selectedFilter, setSelectedFilter] = useState<'tous' | 'premium' | 'lives' | 'items'>('tous');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!currentUser) return null;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    setCopiedCode(true);
    showToast('Code parrain copié ! +500 Pièces pour chaque ami inscrit');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const filteredItems = shopItems.filter((item) => {
    if (selectedFilter === 'tous') return true;
    if (selectedFilter === 'premium') return item.category === 'premium';
    if (selectedFilter === 'lives') return item.category === 'lives';
    if (selectedFilter === 'items') return item.category === 'items';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            Boutique & Monétisation
          </h2>
          <p className="text-xs text-slate-400">
            Achetez des vies, des gemmes et débloquez le Pass VIP sans publicité.
          </p>
        </div>
      </div>

      {/* VIP Premium Pass Highlight Card */}
      <div className="relative rounded-3xl p-5 border border-amber-500/60 bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 shadow-xl shadow-amber-500/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm font-mono">
            <Crown className="w-3 h-3 fill-current" /> ABONNEMENT OFFICIEL VIP
          </span>
          <span className="text-xs font-mono font-bold text-amber-300">
            {currentUser.isPremium ? 'Statut : ACTIF' : '80 Gemmes / 30j'}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-black text-slate-100 mb-1">
          NEXORA Pass VIP Elite
        </h3>
        <ul className="text-xs text-slate-300 space-y-1 mb-4">
          <li className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span><strong>100% sans publicité</strong> ni interruption</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Bonus permanent de <strong>+50% d'XP</strong> sur toutes les missions</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Badge de profil doré et accès aux Raids Héroïques VIP</span>
          </li>
        </ul>

        <button
          onClick={() => buyShopItem('shop_premium_pass')}
          disabled={currentUser.isPremium}
          className={`w-full py-2.5 rounded-xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
            currentUser.isPremium
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 cursor-default'
              : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25 active:scale-95'
          }`}
        >
          <Crown className="w-4 h-4 fill-current" />
          {currentUser.isPremium ? 'Abonnement Déjà Actif' : 'Rejoindre le Club VIP (80 💎)'}
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 text-xs">
        {[
          { id: 'tous', label: 'Tout le Catalogue' },
          { id: 'lives', label: 'Vies & Énergie' },
          { id: 'items', label: 'Équipements & Coffres' },
          { id: 'premium', label: 'Abonnements' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedFilter === tab.id
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shop Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {item.icon}
                </span>
                {item.badge && (
                  <span className="text-[9px] font-mono font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </div>

              <h4 className="font-bold text-xs text-slate-100 mb-1">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-tight mb-3">{item.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-amber-300">
                {item.price} {item.priceType === 'coins' ? '🪙 Pièces' : '💎 Gemmes'}
              </span>

              <button
                onClick={() => buyShopItem(item.id)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-amber-400 text-xs font-bold transition-all"
              >
                Acheter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Referral Program Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-xs text-slate-100 uppercase tracking-wide">
            Système de Parrainage NEXORA
          </h4>
        </div>
        <p className="text-xs text-slate-300">
          Invitez vos amis avec votre code personnel. Vous recevez <strong>+500 Pièces NEX</strong> et votre ami reçoit un pack de démarrage de <strong>3 Vies gratuites</strong> !
        </p>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2">
          <span className="font-mono font-black text-amber-400 text-xs px-2 flex-1">
            {currentUser.referralCode}
          </span>
          <button
            onClick={handleCopyReferral}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copié' : 'Copier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
