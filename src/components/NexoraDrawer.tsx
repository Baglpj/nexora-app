import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  X,
  Zap,
  Wifi,
  QrCode,
  Crown,
  History,
  HelpCircle,
  Puzzle,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Sliders,
  CheckCircle,
  Copy,
  Rocket,
} from 'lucide-react';

export const NexoraDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    toggleDrawer,
    colorMode,
    toggleColorMode,
    currentUser,
    activeRole,
    switchRole,
    setActiveTab,
    showToast,
    switchAppMode,
    setIsVipCreatorModalOpen,
    setIsColorStylesModalOpen,
  } = useNexora();

  const [localNetworkActive, setLocalNetworkActive] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExtensionsModal, setShowExtensionsModal] = useState(false);

  if (!isDrawerOpen) return null;

  const isLight = colorMode === 'light';

  const handleScanQr = (e: React.FormEvent) => {
    e.preventDefault();
    if (qrCodeInput.trim()) {
      showToast(`Code joueur "${qrCodeInput.trim()}" validé !`);
      setQrCodeInput('');
      setShowQrScanner(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={toggleDrawer}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div
        className={`relative w-80 max-w-[85vw] h-full flex flex-col shadow-2xl z-10 transition-transform duration-300 ease-out border-r ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-950 border-slate-800 text-slate-100'
        }`}
      >
        {/* Drawer Header with animated NEXORA Nexus Logo */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-850 bg-slate-900/90'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                {/* Hexagonal Stylized N Logo */}
                <svg
                  className="w-5 h-5 text-amber-400 animate-pulse"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <path d="M9 16V8l6 8V8" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-wider uppercase text-amber-400">
                  NEXORA
                </span>
                <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                  v2.4
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Serveurs en ligne • 24ms</span>
              </div>
            </div>
          </div>

          <button
            onClick={toggleDrawer}
            className={`p-1.5 rounded-xl transition-colors ${
              isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Banner */}
        {currentUser && (
          <div
            className={`p-3.5 mx-3 my-2.5 rounded-2xl border flex items-center gap-3 ${
              isLight
                ? 'bg-slate-100 border-slate-200'
                : 'bg-slate-900/60 border-slate-800/80'
            }`}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/80"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs truncate">{currentUser.username}</span>
                <span className="text-[10px] font-mono text-amber-400 font-black">
                  Lv.{currentUser.level}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                <span>{currentUser.nexCoins} 🪙</span>
                <span>•</span>
                <span>{currentUser.quantumGems} 💎</span>
                <span>•</span>
                <span>{currentUser.lives}/5 ❤️</span>
              </div>
            </div>
          </div>
        )}

        {/* Content list with Modern Features */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
          {/* Quick Theme Switcher */}
          <div
            className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
              isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  isLight ? 'bg-amber-100 text-amber-600' : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {isLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-bold text-xs">Thème d'affichage</p>
                <p className="text-[10px] text-slate-400">
                  {isLight ? 'Blanc épuré & ardoise' : 'Obsidian sombre & néon'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleColorMode}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition-all ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800 shadow-sm hover:bg-slate-50'
                  : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
              }`}
            >
              {isLight ? 'Mode Sombre 🌙' : 'Mode Clair ☀️'}
            </button>
          </div>

          {/* Feature 1: Booster d'XP Actif */}
          <div
            className={`p-3 rounded-2xl border ${
              isLight ? 'bg-amber-50 border-amber-200/80' : 'bg-amber-500/10 border-amber-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 fill-current animate-bounce" />
                <span className="font-bold text-xs text-amber-400 uppercase tracking-wide">
                  Booster XP x1.5 Actif
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">
                12h 45m
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Toutes vos victoires rapportent +50% d'expérience supplémentaire durant le Raid Week-end.
            </p>
          </div>

          {/* Feature 2: Réseau Local (Wi-Fi Direct / Bluetooth) */}
          <button
            onClick={() => {
              setLocalNetworkActive(!localNetworkActive);
              showToast(
                !localNetworkActive
                  ? 'Recherche d escouades locales Bluetooth & Wi-Fi Direct active'
                  : 'Mode Réseau Local désactivé'
              );
            }}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
              localNetworkActive
                ? isLight
                  ? 'bg-cyan-50 border-cyan-400 text-cyan-900'
                  : 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                : isLight
                ? 'bg-white border-slate-200 hover:bg-slate-50'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  localNetworkActive
                    ? 'bg-cyan-500 text-slate-950'
                    : isLight
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-xs">Jeu Local (Wi-Fi / BT)</p>
                  {localNetworkActive && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  {localNetworkActive
                    ? '2 escouades détectées à proximité'
                    : 'Parties hors-ligne sans latence'}
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg ${
                localNetworkActive
                  ? 'bg-cyan-500 text-slate-950'
                  : isLight
                  ? 'bg-slate-200 text-slate-600'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {localNetworkActive ? 'ACTIF' : 'OFF'}
            </span>
          </button>

          {/* Feature 3: Scanner QR Code Joueur */}
          <button
            onClick={() => setShowQrScanner(true)}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
              isLight
                ? 'bg-white border-slate-200 hover:bg-slate-50'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs">Scanner QR Code Joueur</p>
                <p className="text-[10px] text-slate-400">Ajout rapide ou invitation de salon</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Feature 4: Pass VIP Elite */}
          <button
            onClick={() => {
              toggleDrawer();
              setActiveTab('shop');
            }}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
              isLight
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:bg-amber-100/50'
                : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/40 hover:bg-amber-500/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950">
                <Crown className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-xs text-amber-500">Pass NEXORA VIP</p>
                  <span className="text-[9px] font-black bg-amber-500 text-slate-950 px-1 py-0.2 rounded">
                    ELITE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">0 pubs • +50% XP • Coffres mystères</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>

          {/* Feature 5: Historique Rapide des Transactions */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
              isLight
                ? 'bg-white border-slate-200 hover:bg-slate-50'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  isLight ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <History className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs">Historique des Gains & Achats</p>
                <p className="text-[10px] text-slate-400">Relevé des pièces et récompenses</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Feature 6: Laboratoire d'Extensions NEXORA (Modulaire) */}
          <button
            onClick={() => setShowExtensionsModal(true)}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
              isLight
                ? 'bg-white border-slate-200 hover:bg-slate-50'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  isLight ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-500/20 text-indigo-400'
                }`}
              >
                <Puzzle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-xs">Laboratoire & Extensions</p>
                  <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-400 px-1 py-0.2 rounded font-bold">
                    PLUGINS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Slots pour nouveaux modules futurs</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Feature 7: Guide & FAQ */}
          <button
            onClick={() => {
              toggleDrawer();
              setActiveTab('assistant');
            }}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
              isLight
                ? 'bg-white border-slate-200 hover:bg-slate-50'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  isLight ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs">Guide Stratégique AURA</p>
                <p className="text-[10px] text-slate-400">Assistance IA et mécaniques de jeu</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

        </div>

        {/* Drawer Footer */}
        <div
          className={`p-3.5 border-t text-center ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-850 bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Sécurité Chiffrée
            </span>
            <button
              onClick={() => {
                toggleDrawer();
                setActiveTab('settings');
              }}
              className="text-amber-400 hover:underline font-bold"
            >
              Paramètres Système
            </button>
          </div>
        </div>
      </div>

      {/* QR Scanner Submodal */}
      {showQrScanner && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Scanner QR Code Joueur</h3>
              </div>
              <button
                onClick={() => setShowQrScanner(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Camera Viewfinder */}
            <div className="relative rounded-2xl bg-slate-950 border-2 border-dashed border-amber-500/50 p-6 flex flex-col items-center justify-center text-center my-3 overflow-hidden">
              <div className="w-36 h-36 border-2 border-amber-400 rounded-xl relative flex items-center justify-center bg-slate-900/60">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-400 shadow-lg shadow-amber-400 animate-pulse" />
                <QrCode className="w-20 h-20 text-slate-600" />
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-3">
                Pointez la caméra vers le QR Code d'un joueur
              </p>
            </div>

            {/* Manual Code Input */}
            <form onSubmit={handleScanQr} className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400">
                Ou entrez le code manuellement :
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ex: NEX-VALK99"
                  value={qrCodeInput}
                  onChange={(e) => setQrCodeInput(e.target.value)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                    isLight
                      ? 'bg-slate-100 border-slate-300 text-slate-900'
                      : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl max-h-[80vh] flex flex-col ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Dernières Transactions</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-850'
                }`}
              >
                <div>
                  <p className="font-bold text-emerald-400">+500 XP & +350 🪙</p>
                  <p className="text-[10px] text-slate-400">Défi "Esprit Lumineux" validé</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500">10:35</span>
              </div>
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-850'
                }`}
              >
                <div>
                  <p className="font-bold text-amber-400">+750 XP & +450 🪙</p>
                  <p className="text-[10px] text-slate-400">Victoire Cyber Dash Solo</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500">09:12</span>
              </div>
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-850'
                }`}
              >
                <div>
                  <p className="font-bold text-rose-400">-300 🪙</p>
                  <p className="text-[10px] text-slate-400">Recharge 5 Vies (Boutique)</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Hier</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modular Extensions Laboratory Modal */}
      {showExtensionsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl max-h-[85vh] flex flex-col ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <div className="flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Laboratoire NEXORA & Plugins</h3>
              </div>
              <button
                onClick={() => setShowExtensionsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Architecture modulaire prête pour brancher vos futures fonctionnalités :
            </p>

            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 text-xs">
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>🏆 Tournois eSport Automatisés</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono">
                      Prêt
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Matchmaking à élimination directe</p>
                </div>
                <button
                  onClick={() => showToast('Module Tournois activé pour votre profil')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px]"
                >
                  Activer
                </button>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>🎙️ Traducteur Vocal Temps Réel</span>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1 py-0.2 rounded font-mono">
                      IA
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Sous-titres instantanés dans les lobbies</p>
                </div>
                <button
                  onClick={() => showToast('Module Traduction Vocale prêt')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-bold text-[11px]"
                >
                  Activer
                </button>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>🧩 Slot d'Extension Libre</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded font-mono">
                      + Addon
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Prêt pour vos prochaines idées sur-mesure
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-bold">Prêt</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
