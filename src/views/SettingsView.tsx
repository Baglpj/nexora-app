import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  Settings,
  Volume2,
  Mic,
  Moon,
  Sun,
  Globe,
  Shield,
  Download,
  Sparkles,
  Check,
  Rocket,
  Palette,
  ChevronRight,
  ArrowLeft,
  Smartphone,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    themeAccent,
    setThemeAccent,
    colorMode,
    setColorMode,
    showToast,
    switchAppMode,
    activeTheme,
    setIsColorStylesModalOpen,
    setActiveTab,
  } = useNexora();

  const isLight = colorMode === 'light';

  const [soundVolume, setSoundVolume] = useState(80);
  const [musicVolume, setMusicVolume] = useState(65);
  const [selectedLang, setSelectedLang] = useState('fr');
  const [notifInvites, setNotifInvites] = useState(true);
  const [notifRewards, setNotifRewards] = useState(true);

  const handleInstallPwa = () => {
    showToast('Application prête pour installation sur votre smartphone Android');
  };

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-4 pb-20 text-xs transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Header with Back Arrow */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className={`p-2 rounded-xl border transition-all ${
              isLight
                ? 'border-slate-300 hover:bg-slate-200 text-slate-700'
                : 'border-slate-700 hover:bg-slate-800 text-amber-400'
            }`}
            title="Retour à l'Accueil"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-500" />
              Paramètres & Système
            </h2>
            <p className="text-slate-400">
              Personnalisation du mode sombre/clair, styles de couleurs, audio et accès console.
            </p>
          </div>
        </div>
      </div>

      {/* Dark / Light Theme Mode Box */}
      <div
        className={`border rounded-2xl p-4 space-y-3 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <span className="font-black text-xs uppercase tracking-wide block">
          Mode d'Affichage Principal
        </span>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setColorMode('dark')}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
              !isLight
                ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/50 shadow-md text-slate-100'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-900 text-amber-400 border border-slate-800">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs">Mode Sombre</p>
                <p className="text-[10px] text-slate-400">Obsidian & néons</p>
              </div>
            </div>
            {!isLight && (
              <span className="p-1 rounded-full bg-amber-500 text-slate-950">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </button>

          <button
            onClick={() => setColorMode('light')}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
              isLight
                ? 'bg-white border-amber-500 ring-2 ring-amber-500/50 shadow-md text-slate-900'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs">Mode Clair</p>
                <p className="text-[10px] text-slate-400">Blanc pur minimaliste</p>
              </div>
            </div>
            {isLight && (
              <span className="p-1 rounded-full bg-amber-500 text-slate-950">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </button>
        </div>

        {/* FENETRE DES STYLES DE COULEURS EN DEHORS DU MODE SOMBRE ET CLAIRE */}
        <div className="pt-3 border-t border-slate-800/40">
          <button
            onClick={() => setIsColorStylesModalOpen(true)}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-amber-500/20 hover:from-purple-600/30 hover:to-amber-500/30 border border-purple-500/40 flex items-center justify-between text-left transition-all shadow-md group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
                <Palette className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs text-white">
                    Palette de Couleurs & Thèmes Avancés
                  </span>
                  <span className="text-[9px] font-mono uppercase bg-purple-500/30 text-purple-300 px-1.5 py-0.2 rounded font-black">
                    8 STYLES +
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Style actif : <strong className="text-amber-400">{activeTheme.name}</strong> • Cliquez pour ouvrir la fenêtre de styles
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-purple-400 group-hover:translate-x-1 transition-transform">
              <span className="text-[11px] font-bold hidden sm:inline">Personnaliser</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* PWA / Android APK Installation Box */}
      <div
        className={`border rounded-2xl p-4 flex items-center justify-between shadow-lg ${
          isLight
            ? 'bg-gradient-to-r from-amber-50 via-white to-white border-amber-300'
            : 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm">Installer NEXORA sur Android</h3>
            <span className="text-[11px] text-slate-400">PWA native avec mode plein écran et hors-ligne</span>
          </div>
        </div>

        <button
          onClick={handleInstallPwa}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Installer</span>
        </button>
      </div>

      {/* Visual Theme & Accent Colors */}
      <div
        className={`border rounded-2xl p-4 space-y-3 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <span className="font-black text-xs uppercase tracking-wide block">
          Couleur d'Accentuation du Système
        </span>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'gold', label: 'Or Solaire', bg: 'bg-amber-500' },
            { id: 'cyan', label: 'Néon Cyan', bg: 'bg-cyan-500' },
            { id: 'emerald', label: 'Émeraude', bg: 'bg-emerald-500' },
            { id: 'crimson', label: 'Cramoisi', bg: 'bg-rose-500' },
          ].map((col) => (
            <button
              key={col.id}
              onClick={() => {
                setThemeAccent(col.id as any);
                showToast(`Couleur d'accent : ${col.label}`);
              }}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                themeAccent === col.id
                  ? isLight
                    ? 'border-amber-500 bg-amber-50 font-bold text-slate-900 shadow-sm'
                    : 'border-amber-400 bg-slate-800 font-bold text-slate-100'
                  : isLight
                  ? 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${col.bg}`} />
              <span className="text-[10px]">{col.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audio Controls */}
      <div
        className={`border rounded-2xl p-4 space-y-3 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-cyan-500" />
          <span className="font-black text-xs uppercase tracking-wide">
            Audio & Ambiance Sonore
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Effets Sonores (SFX) :</span>
              <span className="font-mono font-bold text-amber-500">{soundVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={soundVolume}
              onChange={(e) => setSoundVolume(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Musique d'Ambiance Synthwave :</span>
              <span className="font-mono font-bold text-cyan-500">{musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Language & Notifications */}
      <div
        className={`border rounded-2xl p-4 space-y-3 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-500" />
          <span className="font-black text-xs uppercase tracking-wide">
            Langue & Notifications Push
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Langue de l'interface :</span>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className={`border rounded-lg px-2.5 py-1 ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}
          >
            <option value="fr">Français (FR)</option>
            <option value="en">English (US)</option>
            <option value="es">Español</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
          <div>
            <span className="font-bold block">Alertes d'invitation de raid</span>
            <span className="text-slate-400 text-[10px]">
              Notification quand un ami crée un salon d'escouade.
            </span>
          </div>
          <button
            onClick={() => setNotifInvites(!notifInvites)}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
              notifInvites ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>
      </div>

      {/* Developer & Administrator Google Play Console Portal Switcher */}
      <div
        className={`border rounded-2xl p-4 space-y-3 ${
          isLight
            ? 'bg-blue-50/80 border-blue-200 shadow-sm text-blue-950'
            : 'bg-blue-950/20 border-blue-500/30 text-blue-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span className="font-black text-xs uppercase tracking-wide">
              Console Développeur & Éditeur NEXORA
            </span>
          </div>
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
            PLAY CONSOLE
          </span>
        </div>

        <p className="text-[11px] text-slate-400">
          Environnement applicatif séparé réservé aux administrateurs et studios de développement : déploiement complet de jeux (Unity, Unreal, Godot, HTML5), gestion des versions et modération.
        </p>

        <button
          onClick={() => switchAppMode('admin-console')}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
        >
          <Rocket className="w-4 h-4 fill-current" />
          <span>Ouvrir NEXORA Play Console (Portail Séparé)</span>
        </button>
      </div>
    </div>
  );
};
