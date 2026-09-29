import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  Crown,
  Rocket,
  ArrowLeft,
  X,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  Lock,
  Layers,
  UploadCloud,
} from 'lucide-react';
import { MissionCategory, GameEngineType } from '../types/nexora';

export const VipGameCreatorModal: React.FC = () => {
  const {
    isVipCreatorModalOpen,
    setIsVipCreatorModalOpen,
    currentUser,
    vipPublishGame,
    colorMode,
    setActiveTab,
    showToast,
  } = useNexora();

  const isLight = colorMode === 'light';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MissionCategory>('Action');
  const [engine, setEngine] = useState<GameEngineType>('unity');
  const [shortDesc, setShortDesc] = useState('');
  const [versionName, setVersionName] = useState('1.0.0-vip');
  const [iconUrl, setIconUrl] = useState(
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVipCreatorModalOpen) return null;

  const isVip = currentUser?.isPremium ?? false;
  const vipTier = currentUser?.vipTier || (isVip ? 'Or' : 'Non-VIP');

  const tierLimits: Record<string, number> = {
    Argent: 1,
    Or: 3,
    Diamant: 5,
  };

  const maxAllowed = tierLimits[vipTier] || (isVip ? 1 : 0);
  const currentPublished = currentUser?.publishedGamesCount || 0;
  const hasRemainingSlot = isVip && currentPublished < maxAllowed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Veuillez entrer un titre de jeu.');
      return;
    }

    setIsSubmitting(true);
    const res = await vipPublishGame({
      title: title.trim(),
      category,
      engine,
      shortDescription: shortDesc.trim() || 'Jeu communautaire exclusif créé par un membre VIP.',
      versionName: versionName.trim() || '1.0.0-vip',
      iconUrl,
    });
    setIsSubmitting(false);

    if (res.success) {
      setIsVipCreatorModalOpen(false);
      setTitle('');
      setShortDesc('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div
        className={`w-full max-w-lg max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Header with clear Back Arrow */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsVipCreatorModalOpen(false)}
              className={`p-2 rounded-xl border transition-all ${
                isLight
                  ? 'border-slate-300 hover:bg-slate-200 text-slate-700'
                  : 'border-slate-700 hover:bg-slate-800 text-slate-200'
              }`}
              title="Retourner au Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500 fill-current" />
                <h3 className="text-sm font-black">Studio Créateur VIP</h3>
                <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-500 border border-amber-500/40 px-1.5 py-0.2 rounded font-black">
                  VIP EXCLUSIF
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Publication de jeux réservée aux membres VIP selon leur formule d'abonnement.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVipCreatorModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Subscription Tier & Quota Card */}
          <div
            className={`p-4 rounded-2xl border ${
              isVip
                ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-amber-500/40'
                : 'bg-rose-500/10 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="font-black text-sm block">
                    Formule Actuelle : {isVip ? `Pass VIP ${vipTier}` : 'Compte Standard (Non-VIP)'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isVip
                      ? `Quota utilisé : ${currentPublished} / ${maxAllowed} jeu(x) publié(s)`
                      : 'La publication de jeux communautaires est réservée aux abonnés VIP.'}
                  </span>
                </div>
              </div>

              {isVip ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                  {hasRemainingSlot ? `${maxAllowed - currentPublished} SLOT LIBRE` : 'QUOTA ATTEINT'}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono">
                  VERROUILLÉ
                </span>
              )}
            </div>

            {/* Quota Progress Bar */}
            {isVip && (
              <div className="space-y-1 pt-1">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/60">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((currentPublished / maxAllowed) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Argent (1 jeu)</span>
                  <span>Or (3 jeux)</span>
                  <span>Diamant (5 jeux)</span>
                </div>
              </div>
            )}
          </div>

          {/* NON-VIP WARNING & CTA */}
          {!isVip && (
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 text-center space-y-3">
              <Lock className="w-8 h-8 text-amber-500 mx-auto" />
              <div>
                <h4 className="font-black text-sm text-slate-100">Débloquez le Studio de Publication</h4>
                <p className="text-slate-400 text-xs mt-1">
                  Seuls les utilisateurs détenteurs d'un abonnement VIP peuvent soumettre et déployer des jeux sur la plateforme.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsVipCreatorModalOpen(false);
                  setActiveTab('shop');
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/20"
              >
                Activer le Pass VIP dans la Boutique
              </button>
            </div>
          )}

          {/* QUOTA FULL ALERT */}
          {isVip && !hasRemainingSlot && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2.5 text-amber-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>
                Vous avez atteint le maximum de <strong>{maxAllowed} jeux</strong> autorisés pour le Pass VIP {vipTier}. Contactez l'administrateur ou passez à la formule VIP supérieure pour débloquer plus de slots.
              </span>
            </div>
          )}

          {/* VIP PUBLISH FORM (ENABLED WHEN VIP & SLOT AVAILABLE) */}
          {isVip && hasRemainingSlot && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Titre du jeu communautaire * :
                </label>
                <input
                  type="text"
                  placeholder="ex: Neon Horizon Blitz"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-950 border-slate-700 text-slate-100'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Catégorie :</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-bold ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-slate-950 border-slate-700 text-slate-100'
                    }`}
                  >
                    <option value="Action">Action</option>
                    <option value="Course">Course</option>
                    <option value="Réflexion">Réflexion</option>
                    <option value="Stratégie">Stratégie</option>
                    <option value="RPG">RPG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Moteur :</label>
                  <select
                    value={engine}
                    onChange={(e: any) => setEngine(e.target.value)}
                    className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-bold ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-slate-950 border-slate-700 text-slate-100'
                    }`}
                  >
                    <option value="unity">Unity (WebGL)</option>
                    <option value="godot">Godot 4 Wasm</option>
                    <option value="html5">HTML5 / Phaser</option>
                    <option value="unreal">Unreal Engine 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Courte description du gameplay :
                </label>
                <textarea
                  rows={2}
                  placeholder="Décrivez l objectif de votre jeu pour les autres joueurs..."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-950 border-slate-700 text-slate-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Icône du jeu (URL d'image) :
                </label>
                <input
                  type="text"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-mono ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-950 border-slate-700 text-slate-100'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4 fill-current" />
                  <span>
                    {isSubmitting ? 'Publication en cours...' : 'Publier mon Jeu VIP sur NEXORA'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
