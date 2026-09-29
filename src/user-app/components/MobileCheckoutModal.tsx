import React, { useState } from 'react';
import { useNexora } from '../../context/NexoraContext';
import {
  X,
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  Zap,
  Coins,
  Crown,
  Lock,
  ArrowRight,
  Receipt,
  AlertCircle,
} from 'lucide-react';
import { PaymentProvider } from '../../types/nexora';

export const MobileCheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    selectedCheckoutItem,
    processMobilePayment,
    colorMode,
    activeThemePreset,
  } = useNexora();

  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('wave');
  const [phoneNumber, setPhoneNumber] = useState('+225 07 ');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<string | null>(null);

  if (!isCheckoutModalOpen || !selectedCheckoutItem) return null;

  const isLight = colorMode === 'light';

  const providers: {
    id: PaymentProvider;
    name: string;
    sublabel: string;
    bgColor: string;
    textColor: string;
    icon: string;
  }[] = [
    {
      id: 'wave',
      name: 'Wave Mobile',
      sublabel: 'Validation instantanée • 0% frais',
      bgColor: 'bg-sky-500/20 border-sky-500/50',
      textColor: 'text-sky-400',
      icon: '🌊',
    },
    {
      id: 'moov',
      name: 'Moov Money',
      sublabel: 'Code USSD direct',
      bgColor: 'bg-orange-500/20 border-orange-500/50',
      textColor: 'text-orange-400',
      icon: '📱',
    },
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      sublabel: 'Notification Push MoMo',
      bgColor: 'bg-yellow-500/20 border-yellow-500/50',
      textColor: 'text-yellow-400',
      icon: '🟡',
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      sublabel: 'Visa, Mastercard 3D Secure',
      bgColor: 'bg-emerald-500/20 border-emerald-500/50',
      textColor: 'text-emerald-400',
      icon: '💳',
    },
    {
      id: 'prepaid',
      name: 'Carte Prépayée',
      sublabel: 'Djamo, UBA, etc.',
      bgColor: 'bg-indigo-500/20 border-indigo-500/50',
      textColor: 'text-indigo-400',
      icon: '🔒',
    },
  ];

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate real gateway delay with progress
    setTimeout(async () => {
      const res = await processMobilePayment({
        provider: selectedProvider,
        phoneNumber: selectedProvider !== 'card' && selectedProvider !== 'prepaid' ? phoneNumber : undefined,
        cardNumber: selectedProvider === 'card' || selectedProvider === 'prepaid' ? cardNumber : undefined,
      });

      setIsProcessing(false);
      if (res.success && res.receiptNumber) {
        setCompletedReceipt(res.receiptNumber);
      }
    }, 1800);
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setCompletedReceipt(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm">Passerelle de Paiement Sécurisée</h3>
              <p className="text-[10px] text-slate-400">Cryptage bancaire 256-bit SSL</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* If Transaction Completed Success View */}
          {completedReceipt ? (
            <div className="text-center py-6 space-y-3 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-emerald-400">Paiement Réussi !</h4>
              <p className="text-xs text-slate-300">
                Votre transaction a été validée avec succès via{' '}
                <span className="font-bold uppercase text-white">{selectedProvider}</span>.
              </p>

              {/* Digital Receipt Card */}
              <div
                className={`p-3.5 rounded-2xl border text-left font-mono text-xs space-y-1.5 my-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="text-[10px] text-slate-500">Reçu Numérique :</span>
                  <span className="font-bold text-amber-400">{completedReceipt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Article :</span>
                  <span className="font-bold text-white truncate max-w-[180px]">{selectedCheckoutItem.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Montant Débité :</span>
                  <span className="font-black text-emerald-400">{selectedCheckoutItem.price.toFixed(2)} € (≈ {(selectedCheckoutItem.price * 655.957).toFixed(0)} F CFA)</span>
                </div>
                {selectedCheckoutItem.xp && (
                  <div className="flex items-center justify-between text-amber-400">
                    <span>XP Ajouté :</span>
                    <span className="font-bold">+{selectedCheckoutItem.xp.toLocaleString('fr-FR')} XP</span>
                  </div>
                )}
                {selectedCheckoutItem.coins && (
                  <div className="flex items-center justify-between text-yellow-400">
                    <span>Pièces Ajoutées :</span>
                    <span className="font-bold">+{selectedCheckoutItem.coins.toLocaleString('fr-FR')} 🪙</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl font-black text-xs text-slate-950 shadow-md"
                style={{ backgroundColor: activeThemePreset.primaryColor }}
              >
                Retourner à NEXORA
              </button>
            </div>
          ) : (
            <>
              {/* Item Summary Banner */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isLight
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold">
                    {selectedCheckoutItem.type === 'xp_pack' ? (
                      <Zap className="w-5 h-5 fill-amber-400" />
                    ) : selectedCheckoutItem.type === 'subscription' ? (
                      <Crown className="w-5 h-5 fill-amber-400" />
                    ) : (
                      <Coins className="w-5 h-5 fill-amber-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs truncate max-w-[180px] sm:max-w-xs">
                      {selectedCheckoutItem.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {selectedCheckoutItem.xp
                        ? `+${selectedCheckoutItem.xp.toLocaleString('fr-FR')} XP instantanés`
                        : selectedCheckoutItem.subTier
                        ? 'Abonnement Mensuel Sans Engagement'
                        : `+${selectedCheckoutItem.coins} Pièces NEX`}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-amber-400">
                    {selectedCheckoutItem.price.toFixed(2)} €
                  </span>
                  <p className="text-[9px] text-slate-400 font-mono">
                    ≈ {(selectedCheckoutItem.price * 655.957).toFixed(0)} XOF
                  </p>
                </div>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Choisissez votre moyen de paiement :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {providers.map((p) => {
                    const isSelected = selectedProvider === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProvider(p.id)}
                        className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? `${p.bgColor} ring-2 ring-amber-400/80 shadow-md`
                            : isLight
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                            : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                        }`}
                      >
                        <span className="text-lg">{p.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className={`font-bold text-xs ${isSelected ? p.textColor : 'text-slate-200'}`}>
                            {p.name}
                          </p>
                          <p className="text-[9px] text-slate-400 truncate">{p.sublabel}</p>
                        </div>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Input Form */}
              <form onSubmit={handlePay} className="space-y-3 pt-2">
                {selectedProvider === 'wave' || selectedProvider === 'moov' || selectedProvider === 'mtn' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Numéro de Téléphone Mobile Money :</span>
                      <span className="text-[10px] text-slate-400 font-mono">Wave / Moov / MTN</span>
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+225 07 00 00 00 00"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                          isLight
                            ? 'bg-slate-100 border-slate-300 text-slate-900'
                            : 'bg-slate-950 border-slate-850 text-slate-100'
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Une demande d'autorisation avec votre code secret vous sera envoyée instantanément sur votre téléphone.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Numéro de Carte Bancaire :
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                            isLight
                              ? 'bg-slate-100 border-slate-300 text-slate-900'
                              : 'bg-slate-950 border-slate-850 text-slate-100'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          Expiration (MM/AA) :
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="12/28"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-mono border text-center focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                            isLight
                              ? 'bg-slate-100 border-slate-300 text-slate-900'
                              : 'bg-slate-950 border-slate-850 text-slate-100'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          CVV / CVC :
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="•••"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-mono text-center border focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                            isLight
                              ? 'bg-slate-100 border-slate-300 text-slate-900'
                              : 'bg-slate-950 border-slate-850 text-slate-100'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Payment Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-2xl font-black text-xs text-slate-950 shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  style={{
                    backgroundColor: activeThemePreset.primaryColor,
                    color: '#020617',
                  }}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Connexion à l'opérateur en cours...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        Payer {selectedCheckoutItem.price.toFixed(2)} € via {selectedProvider.toUpperCase()}
                      </span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
