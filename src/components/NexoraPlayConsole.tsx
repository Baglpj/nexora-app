import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  Rocket,
  ShieldCheck,
  ShieldAlert,
  Play,
  Pause,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Layers,
  Settings,
  Users,
  Bell,
  Coins,
  Gem,
  Trash2,
  Lock,
  Search,
  RefreshCw,
  LogOut,
  Smartphone,
  Gamepad2,
  Code2,
  FileCode,
  Globe,
  Sliders,
  Sparkles,
  BarChart3,
  Check,
  ChevronRight,
  FileCheck,
  Terminal,
  ArrowLeft,
  Crown,
  Star,
  ThumbsUp,
  Trophy,
} from 'lucide-react';
import { GameEngineType, MissionCategory } from '../types/nexora';

export const NexoraPlayConsole: React.FC = () => {
  const {
    isConsoleAuthenticated,
    developerUser,
    consoleLogin,
    consoleLogout,
    deployedGames,
    deployNewGame,
    updateGameStatus,
    adminDeleteGame,
    switchAppMode,
    adminUserAction,
    adminBroadcastNotification,
    auditLogs,
    missions,
    leaderboard,
    currentUser,
    startPlayMission,
    showToast,
    gameReviews,
    tournaments,
    creators,
    creatorEarnings,
    claimCreatorRoyalties,
    likeGameReview,
  } = useNexora();

  // Navigation tab in Console
  const [activeConsoleTab, setActiveConsoleTab] = useState<
    'all-games' | 'deploy-wizard' | 'telemetry' | 'moderation' | 'broadcast' | 'audit' | 'monetization-reviews'
  >('all-games');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('alexis.nexora.dev@quantum.corp');
  const [securityKey, setSecurityKey] = useState('NEXORA-DEV-2026');
  const [orgId, setOrgId] = useState('Quantum Pixel Studios & NEXORA Publishing');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Wizard state for deploying a new game
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [isDeploying, setIsDeploying] = useState(false);

  // Form Fields
  const [gameTitle, setGameTitle] = useState('');
  const [packageId, setPackageId] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [category, setCategory] = useState<MissionCategory>('Action');
  const [pegi, setPegi] = useState<'PEGI 3' | 'PEGI 7' | 'PEGI 12' | 'PEGI 16' | 'PEGI 18'>('PEGI 7');
  const [developerStudio, setDeveloperStudio] = useState('Quantum Pixel Studios');

  // Engine & Build details
  const [engine, setEngine] = useState<GameEngineType>('unity');
  const [engineVersion, setEngineVersion] = useState('Unity 2023.3 LTS (WebGL WebAssembly)');
  const [buildType, setBuildType] = useState<'zip-bundle' | 'wasm' | 'script' | 'remote-url' | 'native-arcade'>('wasm');
  const [buildUrl, setBuildUrl] = useState('');
  const [versionName, setVersionName] = useState('1.0.0-release');
  const [versionCode, setVersionCode] = useState(100);
  const [releaseNotes, setReleaseNotes] = useState('Déploiement initial en production sur NEXORA Play Store.');

  // Media
  const [iconUrl, setIconUrl] = useState(
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80'
  );
  const [bannerUrl, setBannerUrl] = useState(
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1024&auto=format&fit=crop&q=80'
  );

  // Rollout & Monetization
  const [rolloutStatus, setRolloutStatus] = useState<
    'production' | 'staged-rollout' | 'open-beta' | 'closed-alpha'
  >('production');
  const [rolloutPercent, setRolloutPercent] = useState<number>(100);
  const [monetizationType, setMonetizationType] = useState<'free' | 'coins' | 'vip'>('free');
  const [priceCoins, setPriceCoins] = useState<number>(350);
  const [rewardXp, setRewardXp] = useState<number>(650);
  const [rewardCoins, setRewardCoins] = useState<number>(400);

  // Moderation filter
  const [moderationSearch, setModerationSearch] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  // Selected game for live management modal
  const [selectedGame, setSelectedGame] = useState<any | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    await consoleLogin(loginEmail, securityKey, orgId);
    setIsLoggingIn(false);
  };

  const handleDeploySubmit = async () => {
    if (!gameTitle.trim()) {
      showToast('Veuillez entrer un titre pour le jeu.');
      setWizardStep(1);
      return;
    }

    setIsDeploying(true);
    const result = await deployNewGame({
      title: gameTitle,
      packageId: packageId || `com.nexora.games.${gameTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      shortDescription: shortDesc || 'Nouveau jeu déployé via la console NEXORA Play Store.',
      fullDescription: fullDesc || 'Expérience de jeu inédite publiée par le studio.',
      category,
      pegi,
      developerStudio,
      engine,
      engineVersion,
      buildType,
      buildUrl,
      iconUrl,
      bannerUrl,
      versionName,
      versionCode,
      releaseNotes,
      rolloutStatus,
      rolloutPercent,
      targetRegions: ['Monde', 'Europe', 'Amérique du Nord', 'Asie-Pacifique'],
      monetization: {
        type: monetizationType,
        priceCoins: monetizationType === 'coins' ? priceCoins : 0,
        hasInAppPurchases: false,
      },
      playableType: category === 'Réflexion' ? 'matrix' : 'runner',
      rewardXp,
      rewardCoins,
    });

    setIsDeploying(false);
    if (result.success) {
      setActiveConsoleTab('all-games');
      setWizardStep(1);
      // Reset form
      setGameTitle('');
      setPackageId('');
      setShortDesc('');
      setFullDesc('');
    }
  };

  // 1. SEPARATE AUTHENTICATION GATE IF NOT LOGGED IN
  if (!isConsoleAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-blue-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Rocket className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                Google Play Console Style
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              NEXORA Play Console
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Portail Développeur & Éditeur séparé. Déployez vos jeux, gérez les versions et auditez le catalogue mondial.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Identifiant Développeur / E-mail Studio :
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Clé de Sécurité Studio / Master Token :
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Clé maître par défaut : <code className="text-cyan-400">NEXORA-DEV-2026</code>
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Organisation Studio de Développement :
              </label>
              <input
                type="text"
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                <span>{isLoggingIn ? 'Vérification...' : 'Connexion au Studio Développeur'}</span>
              </button>

              <button
                type="button"
                onClick={() => consoleLogin()}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>⚡ Accès Rapide SuperAdmin (Démo 1-Clic)</span>
              </button>
            </div>
          </form>

          {/* Switch Back to Gamer App */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              onClick={() => switchAppMode('player')}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>← Revenir à l'Application Joueur NEXORA</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED GOOGLE PLAY CONSOLE DASHBOARD
  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Google Play Console Main Topbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          {/* Back Arrow button to return to Gamer Hub */}
          <button
            onClick={() => switchAppMode('player')}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-all flex items-center gap-1.5 shadow-sm group"
            title="← Retourner à l'Application Joueur NEXORA"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden md:inline text-xs font-bold">Retour Joueur</span>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-400 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Rocket className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black tracking-tight text-white">NEXORA Play Console</h1>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-600/30 text-blue-400 border border-blue-500/40">
                  DEVELOPER
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
                {developerUser?.organization || 'Quantum Pixel Studios & NEXORA Publishing'}
              </p>
            </div>
          </div>
        </div>

        {/* Action button + Return to gamer app */}
        <div className="flex items-center gap-2">
          {/* Prominent Google Play Store "+ Créer et Déployer un Jeu" Button */}
          <button
            onClick={() => setActiveConsoleTab('deploy-wizard')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all"
          >
            <Rocket className="w-3.5 h-3.5 fill-current" />
            <span>+ Déployer un Jeu</span>
          </button>

          {/* Switch to gamer mobile app */}
          <button
            onClick={() => switchAppMode('player')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs rounded-xl transition-colors"
            title="Revenir au Gaming Hub Joueur"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">App Joueur</span>
          </button>

          {/* Logout developer */}
          <button
            onClick={consoleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Déconnexion de la Play Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Play Console Navigation Sub-bar */}
      <nav className="border-b border-slate-800 bg-slate-900/60 px-4 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
        {[
          { id: 'all-games', label: 'Toutes les Applications & Jeux', icon: Gamepad2, count: deployedGames.length },
          { id: 'monetization-reviews', label: '💎 Monétisation VIP & Avis', icon: Gem, count: gameReviews.length },
          { id: 'deploy-wizard', label: '+ Assistant Déploiement Play Store', icon: Rocket },
          { id: 'telemetry', label: 'Télémétrie & Statistiques Live', icon: BarChart3 },
          { id: 'moderation', label: 'Sécurité & Modération Joueurs', icon: ShieldAlert },
          { id: 'broadcast', label: 'Diffusions & Push', icon: Bell },
          { id: 'audit', label: 'Journaux d Audit Play Protect', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeConsoleTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveConsoleTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full font-mono text-cyan-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Main Console Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* ============================================================== */}
        {/* TAB 1: ALL DEPLOYED GAMES (Google Play Store Catalog Dashboard) */}
        {/* ============================================================== */}
        {activeConsoleTab === 'all-games' && (
          <div className="space-y-4">
            {/* Top Play Console Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Applications Actives
                </span>
                <p className="text-xl font-black text-cyan-400 font-mono mt-0.5">
                  {deployedGames.length} Jeux
                </p>
                <span className="text-[10px] text-emerald-400 font-semibold">100% en ligne (Play Store)</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Installations Globales
                </span>
                <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                  {deployedGames.reduce((acc, g) => acc + (g.telemetry?.activeInstalls || 0), 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-400">Joueurs actifs sur le réseau</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Taux de Plantage (Crash)
                </span>
                <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">0.01%</p>
                <span className="text-[10px] text-emerald-400 font-semibold">Conforme Google Play Integrity</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Note Moyenne Store
                </span>
                <p className="text-xl font-black text-amber-400 font-mono mt-0.5">4.85 ★</p>
                <span className="text-[10px] text-slate-400">Basé sur 14 150 avis</span>
              </div>
            </div>

            {/* Header + Search + Deploy Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <h2 className="text-base font-black text-white">Catalogue des Jeux Déployés</h2>
                <p className="text-xs text-slate-400">
                  Gérez le cycle de vie de vos applications, diffusez des versions et inspectez les métriques.
                </p>
              </div>

              <button
                onClick={() => setActiveConsoleTab('deploy-wizard')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all self-start sm:self-auto"
              >
                <Rocket className="w-4 h-4 fill-current" />
                <span>+ Déployer une nouvelle version / Jeu</span>
              </button>
            </div>

            {/* List of Deployed Games */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deployedGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-4 transition-all space-y-3 relative group"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={game.iconUrl}
                      alt={game.title}
                      className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-700 shadow-md shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-sm text-white truncate">{game.title}</h3>
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                            game.rolloutStatus === 'production'
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                              : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                          }`}
                        >
                          {game.rolloutStatus} ({game.rolloutPercent}%)
                        </span>
                      </div>

                      <p className="text-[11px] font-mono text-cyan-400 truncate">{game.packageId}</p>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span className="bg-slate-800 px-1.5 py-0.2 rounded font-mono font-bold uppercase text-slate-300">
                          {game.engine}
                        </span>
                        <span>•</span>
                        <span>{game.versionName}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-bold">{game.pegi}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">{game.shortDescription}</p>

                  {/* Telemetry info */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-2.5 rounded-xl text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Installations</span>
                      <strong className="text-slate-200 font-mono">
                        {game.telemetry?.activeInstalls?.toLocaleString() || '1 200'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Note Joueurs</span>
                      <strong className="text-amber-400 font-mono">
                        {game.telemetry?.rating || 4.9} ★
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Crash Rate</span>
                      <strong className="text-emerald-400 font-mono">
                        {game.telemetry?.crashRate || 0.01}%
                      </strong>
                    </div>
                  </div>

                  {/* Actions for this deployed game */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const mission = missions.find(
                            (m) => m.title === game.title || m.id === `mis_deployed_${game.id}`
                          );
                          if (mission) {
                            startPlayMission(mission);
                          } else {
                            startPlayMission(missions[0]);
                          }
                        }}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-lg font-bold flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Tester en direct</span>
                      </button>

                      <button
                        onClick={() => {
                          const nextStatus = game.rolloutStatus === 'production' ? 'paused' : 'production';
                          updateGameStatus(game.id, nextStatus);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        title={game.rolloutStatus === 'production' ? 'Suspendre la diffusion' : 'Reprendre la diffusion'}
                      >
                        {game.rolloutStatus === 'production' ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Seul l'administrateur peut retirer un jeu */}
                      <button
                        onClick={() => {
                          if (confirm(`Confirmer le retrait définitif du jeu "${game.title}" du catalogue Play Store ? Seul l administrateur est habilité à retirer un jeu.`)) {
                            adminDeleteGame(game.id);
                          }
                        }}
                        className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg font-bold flex items-center gap-1 transition-colors"
                        title="Seul l administrateur peut retirer un jeu du catalogue"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Retirer</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedGame(game)}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                    >
                      <span>Gérer version</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: GOOGLE PLAY STORE DEPLOYMENT WIZARD (TOUT FORMULAIRE)    */}
        {/* ============================================================== */}
        {activeConsoleTab === 'deploy-wizard' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Wizard Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-black text-white">
                  Assistant Complet de Déploiement Play Store
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Publiez votre jeu quel que soit son moteur de création (Unity, Unreal Engine, Godot, HTML5/Wasm, Android AAB/APK ou Iframe). Formulaire complet conforme aux normes de la Google Play Console.
              </p>

              {/* Progress Steps 1 -> 7 */}
              <div className="grid grid-cols-7 gap-1 pt-2">
                {[
                  { step: 1, label: 'Fiche Store' },
                  { step: 2, label: 'Médias' },
                  { step: 3, label: 'Moteur' },
                  { step: 4, label: 'Version' },
                  { step: 5, label: 'Canaux' },
                  { step: 6, label: 'Économie' },
                  { step: 7, label: 'Audit' },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setWizardStep(s.step as any)}
                    className={`py-2 px-1 text-center rounded-xl text-[10px] font-black transition-all ${
                      wizardStep === s.step
                        ? 'bg-blue-600 text-white shadow-md'
                        : wizardStep > s.step
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <span className="block">{s.step}. {s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: STORE LISTING DETAILS */}
            {wizardStep === 1 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 text-xs">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>1. Détails de l'Application & Fiche Play Store</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Nom de l'application / Titre du jeu * :
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Hyperdrift 2077"
                      value={gameTitle}
                      onChange={(e) => {
                        setGameTitle(e.target.value);
                        if (!packageId) {
                          setPackageId(
                            `com.nexora.games.${e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')}`
                          );
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Nom de package Android / Web unique * :
                    </label>
                    <input
                      type="text"
                      placeholder="com.nexora.games.hyperdrift"
                      value={packageId}
                      onChange={(e) => setPackageId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Brève description (max 80 car.) * :
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="Course d arcade cyberpunk à haute vitesse sur autoroute magnétique."
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">{shortDesc.length}/80 caractères</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Description complète du jeu :
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Décrivez les fonctionnalités phares, le gameplay, les mécaniques multi-joueurs et l univers..."
                    value={fullDesc}
                    onChange={(e) => setFullDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Catégorie / Genre :</label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold"
                    >
                      <option value="Action">Action</option>
                      <option value="Course">Course</option>
                      <option value="Réflexion">Réflexion</option>
                      <option value="Stratégie">Stratégie</option>
                      <option value="RPG">RPG</option>
                      <option value="Simulation">Simulation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Classification d'Âge :</label>
                    <select
                      value={pegi}
                      onChange={(e: any) => setPegi(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold"
                    >
                      <option value="PEGI 3">PEGI 3 (Tous publics)</option>
                      <option value="PEGI 7">PEGI 7 (Légère violence)</option>
                      <option value="PEGI 12">PEGI 12 (Action modérée)</option>
                      <option value="PEGI 16">PEGI 16 (Compétition intense)</option>
                      <option value="PEGI 18">PEGI 18 (Public averti)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Studio Développeur :</label>
                    <input
                      type="text"
                      value={developerStudio}
                      onChange={(e) => setDeveloperStudio(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl flex items-center gap-1.5"
                  >
                    <span>Continuer vers Médias</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: GRAPHICS & MEDIA ASSETS */}
            {wizardStep === 2 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 text-xs">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>2. Médias & Identité Visuelle Play Store</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Icône Haute Résolution (512x512) :
                    </label>
                    <input
                      type="text"
                      value={iconUrl}
                      onChange={(e) => setIconUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-400 mb-2"
                    />
                    <div className="flex items-center gap-3">
                      <img
                        src={iconUrl}
                        alt="Preview Icon"
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500 shadow-lg"
                      />
                      <span className="text-[11px] text-slate-400">
                        Format PNG/JPG sans transparence, conforme Google Play.
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Graphique de Fonctionnalité (1024x500 Bannière) :
                    </label>
                    <input
                      type="text"
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-400 mb-2"
                    />
                    <img
                      src={bannerUrl}
                      alt="Preview Banner"
                      className="w-full h-20 rounded-xl object-cover ring-1 ring-slate-700"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl flex items-center gap-1.5"
                  >
                    <span>Continuer vers Moteur de Jeu</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ENGINE & GAME CREATION MODE ("que soit comment le jeu est créé") */}
            {wizardStep === 3 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 text-xs">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>3. Moteur & Méthode de Création ("Quel que soit le mode de création")</span>
                </h3>

                <p className="text-slate-400">
                  NEXORA prend en charge nativement tous les pipelines de build existants dans l'industrie :
                </p>

                {/* Engine Selector Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'unity',
                      name: 'Unity (WebGL / Wasm)',
                      desc: 'Build exporté Unity 2022/2023 WebGL haute performance',
                      icon: '🎮',
                    },
                    {
                      id: 'unreal',
                      name: 'Unreal Engine 5 (HTML5)',
                      desc: 'Pixel Streaming ou WebAssembly WebGPU 60 FPS',
                      icon: '⚡',
                    },
                    {
                      id: 'godot',
                      name: 'Godot Engine 4 (Wasm)',
                      desc: 'Moteur open-source léger, export WebAssembly instantané',
                      icon: '👾',
                    },
                    {
                      id: 'html5',
                      name: 'HTML5 / Phaser / Three.js',
                      desc: 'Canvas 2D / WebGL direct, bundle JavaScript ultra-rapide',
                      icon: '🌐',
                    },
                    {
                      id: 'android-aab',
                      name: 'Package Android AAB / APK',
                      desc: 'App Bundle Android exécuté via le runner virtuel NEXORA',
                      icon: '📦',
                    },
                    {
                      id: 'nexora-core',
                      name: 'Moteur Arcade Natif NEXORA',
                      desc: 'Cyber Runner, Quantum Matrix et arènes interconnectées',
                      icon: '🕹️',
                    },
                    {
                      id: 'iframe-embed',
                      name: 'Hébergement Distant / Iframe',
                      desc: 'URL externe hébergée (Itch.io, Vercel, CDN dédié)',
                      icon: '🔗',
                    },
                  ].map((eng) => (
                    <button
                      key={eng.id}
                      type="button"
                      onClick={() => {
                        setEngine(eng.id as any);
                        setEngineVersion(`${eng.name} - Version 2026 Compatible`);
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        engine === eng.id
                          ? 'bg-blue-600/20 border-cyan-400 ring-2 ring-cyan-400/50 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{eng.icon}</span>
                        {engine === eng.id && (
                          <span className="p-1 rounded-full bg-cyan-400 text-slate-950">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-xs text-slate-200">{eng.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{eng.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Version du Moteur / Runtime :
                    </label>
                    <input
                      type="text"
                      value={engineVersion}
                      onChange={(e) => setEngineVersion(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      URL de build ou webhook CDN (optionnel) :
                    </label>
                    <input
                      type="text"
                      placeholder="https://cdn.nexora.games/builds/v1.0.0/webgl.wasm"
                      value={buildUrl}
                      onChange={(e) => setBuildUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setWizardStep(4)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl flex items-center gap-1.5"
                  >
                    <span>Continuer vers Gestion des Versions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PACKAGE VERSION & RELEASE NOTES */}
            {wizardStep === 4 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 text-xs">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>4. Fichiers du Package & Numérotation des Versions</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nom de version (ex: 1.0.0-release) :</label>
                    <input
                      type="text"
                      value={versionName}
                      onChange={(e) => setVersionName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Code de version entier (VersionCode) :</label>
                    <input
                      type="number"
                      value={versionCode}
                      onChange={(e) => setVersionCode(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Notes de version / "Nouveautés de cette mise à jour" :
                  </label>
                  <textarea
                    rows={3}
                    value={releaseNotes}
                    onChange={(e) => setReleaseNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                  <UploadCloud className="w-6 h-6 text-cyan-400 shrink-0" />
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-200 block">Archive de Build Validée</strong>
                    Signature numérique SHA-256 générée automatiquement pour Google Play Integrity.
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setWizardStep(5)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl flex items-center gap-1.5"
                  >
                    <span>Continuer vers Stratégie de Sortie</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: ROLLOUT STRATEGY & CANALS */}
            {wizardStep === 5 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 text-xs">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>5. Canaux de Déploiement & Diffusion Play Store</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'production',
                      title: 'Production Globale Immédiate (100%)',
                      desc: 'Le jeu est instantanément téléchargeable et jouable par tous les joueurs.',
                    },
                    {
                      id: 'staged-rollout',
                      title: 'Déploiement Progressif (Staged Rollout)',
                      desc: 'Diffusez à un sous-ensemble (ex: 20%, 50%) pour surveiller la télémétrie.',
                    },
                    {
                      id: 'open-beta',
                      title: 'Bêta Ouverte (Tous les testeurs)',
                      desc: 'Disponible dans l onglet Bêta pour récolter les retours communautaires.',
                    },
                    {
                      id: 'closed-alpha',
                      title: 'Alpha Fermée (VIP & Testeurs Restreints)',
                      desc: 'Accès limité uniquement aux détenteurs du Pass VIP Nexora.',
                    },
                  ].map((channel) => (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => setRolloutStatus(channel.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        rolloutStatus === channel.id
                          ? 'bg-blue-600/20 border-cyan-400 ring-2 ring-cyan-400/40 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <p className="font-black text-xs text-slate-200">{channel.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{channel.desc}</p>
                    </button>
                  ))}
                </div>

                {rolloutStatus === 'staged-rollout' && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Pourcentage de diffusion progressif : {rolloutPercent}%
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={10}
                      value={rolloutPercent}
                      onChange={(e) => setRolloutPercent(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                )}

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setWizardStep(4)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setWizardStep(6)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl flex items-center gap-1.5"
                  >
                    <span>Continuer vers Monétisation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: MONETIZATION & IN-GAME REWARDS */}
            {wizardStep === 6 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 text-xs">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>6. Modèle Économique & Récompenses de Partie</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setMonetizationType('free')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      monetizationType === 'free'
                        ? 'bg-blue-600/20 border-cyan-400 ring-2 ring-cyan-400/40 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p className="font-black text-xs text-slate-200">Gratuit (F2P)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Accès libre pour toute la communauté</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMonetizationType('coins')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      monetizationType === 'coins'
                        ? 'bg-blue-600/20 border-cyan-400 ring-2 ring-cyan-400/40 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p className="font-black text-xs text-slate-200">Payant en Pièces NEX</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Achat unique débloqué via la boutique</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMonetizationType('vip')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      monetizationType === 'vip'
                        ? 'bg-blue-600/20 border-cyan-400 ring-2 ring-cyan-400/40 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p className="font-black text-xs text-slate-200">Exclusif Pass VIP</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Réservé aux abonnés premium</p>
                  </button>
                </div>

                {monetizationType === 'coins' && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Prix d'accès en Pièces NEX :
                    </label>
                    <input
                      type="number"
                      value={priceCoins}
                      onChange={(e) => setPriceCoins(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Récompense XP par victoire :</label>
                    <input
                      type="number"
                      value={rewardXp}
                      onChange={(e) => setRewardXp(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Pièces NEX distribuées :</label>
                    <input
                      type="number"
                      value={rewardCoins}
                      onChange={(e) => setRewardCoins(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setWizardStep(5)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setWizardStep(7)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl flex items-center gap-1.5"
                  >
                    <span>Continuer vers Audit & Déploiement</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: AUDIT & FINAL 1-CLICK DEPLOYMENT BUTTON */}
            {wizardStep === 7 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">
                    7. Contrôle d'Intégrité Play Protect & Lancement du Déploiement
                  </h3>
                </div>

                {/* Audit checklist */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Signature cryptographique APK / Wasm conforme
                    </span>
                    <strong className="font-mono text-[10px]">VALIDE</strong>
                  </div>

                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Analyse antivol & scan vulnérabilités 0 exploit
                    </span>
                    <strong className="font-mono text-[10px]">CONFORME</strong>
                  </div>

                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Conformité PEGI & règles éditeurs validées
                    </span>
                    <strong className="font-mono text-[10px]">APPROUVÉ</strong>
                  </div>

                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Optimisation de rendu WebGL 60 FPS certifiée
                    </span>
                    <strong className="font-mono text-[10px]">OPTIMISÉ</strong>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="p-4 bg-blue-950/30 border border-blue-500/40 rounded-2xl flex items-center gap-4">
                  <img
                    src={iconUrl}
                    alt={gameTitle}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400 shadow-md"
                  />
                  <div>
                    <h4 className="font-black text-sm text-white">{gameTitle || 'Titre du jeu'}</h4>
                    <p className="text-[11px] font-mono text-cyan-400">{packageId || 'com.nexora.games'}</p>
                    <span className="text-[10px] text-slate-300">
                      Moteur : <strong className="text-white uppercase">{engine}</strong> • Version : {versionName} • Canal : {rolloutStatus}
                    </span>
                  </div>
                </div>

                {/* THE ICONIC GOOGLE PLAY STORE DEPLOY BUTTON */}
                <div className="pt-2">
                  <button
                    onClick={handleDeploySubmit}
                    disabled={isDeploying}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-5 h-5 fill-current" />
                    <span>
                      {isDeploying ? 'Déploiement en cours sur le Play Store...' : 'Lancer le Déploiement en Production sur NEXORA Play Store'}
                    </span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Le jeu sera immédiatement injecté dans le catalogue public et jouable par l'ensemble des pilotes.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TELEMETRY & LIVE PERFORMANCE STATS                      */}
        {/* ============================================================== */}
        {activeConsoleTab === 'telemetry' && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-white">Télémétrie en Temps Réel & Performances</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold block mb-1">FPS Moyen sur Appareils Mobiles</span>
                <p className="text-2xl font-black text-emerald-400 font-mono">59.8 FPS</p>
                <span className="text-[10px] text-slate-400">Latence moyenne : 8.2ms</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold block mb-1">Taux de Rétention J+7</span>
                <p className="text-2xl font-black text-cyan-400 font-mono">64.2%</p>
                <span className="text-[10px] text-slate-400">+12% au-dessus de la moyenne de l industrie</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold block mb-1">Revenus In-App Générés</span>
                <p className="text-2xl font-black text-amber-400 font-mono">37 200 NEX</p>
                <span className="text-[10px] text-slate-400">Micro-transactions cosmétiques</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: MODERATION & USER MANAGEMENT                            */}
        {/* ============================================================== */}
        {activeConsoleTab === 'moderation' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-white">Sécurité & Modération des Comptes Joueurs</h2>
                <p className="text-xs text-slate-400">
                  Bannissement, blocage temporaire, avertissements formels et régularisation des devises.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filtrer par pseudo..."
                  value={moderationSearch}
                  onChange={(e) => setModerationSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="space-y-2">
              {leaderboard
                .filter((p) => p.username.toLowerCase().includes(moderationSearch.toLowerCase()))
                .map((player) => (
                  <div
                    key={player.id}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={player.avatarUrl}
                        alt={player.username}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white text-sm">{player.username}</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded">
                            Niv.{player.level}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {player.rankTier} • Score : {player.score.toLocaleString()} PTS
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => adminUserAction('warn', player.id)}
                        className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg font-bold hover:bg-amber-500/30"
                      >
                        Avertir
                      </button>
                      <button
                        onClick={() => adminUserAction('block', player.id)}
                        className="px-2.5 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-lg font-bold hover:bg-orange-500/30"
                      >
                        Bloquer 24h
                      </button>
                      <button
                        onClick={() => adminUserAction('ban', player.id)}
                        className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-lg font-bold hover:bg-rose-500/30"
                      >
                        Bannir
                      </button>
                      <button
                        onClick={() => adminUserAction('grant_coins', player.id, 1000)}
                        className="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-lg font-bold hover:bg-blue-500/30 flex items-center gap-1"
                      >
                        <Coins className="w-3 h-3" />
                        <span>+1 000 NEX</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: BROADCAST PUSH NOTIFICATIONS                            */}
        {/* ============================================================== */}
        {activeConsoleTab === 'broadcast' && (
          <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 text-xs">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Diffusion d'Annonces Push In-Game</span>
            </h2>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Titre de la notification :</label>
              <input
                type="text"
                placeholder="ex: Maintenance des serveurs & Nouveau tournoi"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contenu du message :</label>
              <textarea
                rows={3}
                placeholder="Message qui apparaîtra instantanément dans le centre de notifications de tous les joueurs..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              onClick={async () => {
                if (!notifTitle.trim()) return;
                await adminBroadcastNotification(notifTitle, notifMessage);
                setNotifTitle('');
                setNotifMessage('');
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span>Diffuser à l ensemble des joueurs</span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: AUDIT LOGS                                              */}
        {/* ============================================================== */}
        {activeConsoleTab === 'audit' && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-black text-white">Traçabilité & Journaux d'Audit Play Protect</h2>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 font-mono"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-400">{log.action}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-200">{log.target}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{log.details}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 block">{log.timestamp}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{log.adminName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: MONETIZATION VIP ROYALTIES, PLAYER REVIEWS & TOURNAMENTS */}
        {/* ============================================================== */}
        {activeConsoleTab === 'monetization-reviews' && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Gem className="w-5 h-5 text-amber-400" />
                  Monétisation VIP, Royalties & Avis Joueurs
                </h3>
                <p className="text-xs text-slate-400">
                  Tableau de bord économique créateur, encaissement des gemmes et suivi de la réputation de vos jeux.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                  Taux : +5 💎 par session jouée
                </span>
              </div>
            </div>

            {/* Financial Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Card 1: Pending Royalties with Claim Button */}
              <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/40 p-4 rounded-2xl shadow-lg flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Royalties en Attente
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-cyan-300 font-mono">
                      +{creatorEarnings.pendingGems}
                    </span>
                    <span className="text-sm font-bold text-cyan-400">💎 Gemmes</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Prêt pour transfert vers solde joueur
                  </span>
                </div>

                <button
                  onClick={claimCreatorRoyalties}
                  disabled={creatorEarnings.pendingGems <= 0}
                  className={`mt-3 py-2 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    creatorEarnings.pendingGems > 0
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Encaisser (+{creatorEarnings.pendingGems} 💎)</span>
                </button>
              </div>

              {/* Card 2: Lifetime Earned */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Historique Encaissé
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {creatorEarnings.totalEarnedGems.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-emerald-500">💎</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Gains cumulés sur vos jeux VIP
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Retraits effectués :</span>
                  <strong className="text-slate-200">{creatorEarnings.payoutHistory.length}</strong>
                </div>
              </div>

              {/* Card 3: Sessions Played */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Parties Jouées par la Communauté
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-slate-100 font-mono">
                      {creatorEarnings.sessionsPlayed.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-slate-400">runs</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Génération passive continue
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Jeux publiés :</span>
                  <strong className="text-amber-400">{creatorEarnings.gamesCount} actif(s)</strong>
                </div>
              </div>

              {/* Card 4: Global Reviews Rating */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Satisfaction & Note Globale
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      4.9 ★
                    </span>
                    <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Basé sur {gameReviews.length} avis certifiés
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                  <span>Taux recommandation :</span>
                  <span>98% positif</span>
                </div>
              </div>
            </div>

            {/* Dual Panel: Payout History & Active Tournaments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Panel A: Payout History */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Historique des Retraits de Royalties
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Virements instantanés</span>
                </div>

                <div className="space-y-2">
                  {creatorEarnings.payoutHistory.map((payout) => (
                    <div
                      key={payout.id}
                      className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <Gem className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block">
                            Retrait vers Solde Joueur
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{payout.date}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-cyan-300 block">
                          +{payout.amountGems} 💎
                        </span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          {payout.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel B: Active Tournaments per Game */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    Tournois Actifs par Jeu & Cagnottes
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Saison active</span>
                </div>

                <div className="space-y-2">
                  {tournaments.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-200 block">{t.title}</span>
                        <span className="text-[10px] text-slate-400">
                          Jeu : <strong className="text-amber-400">{t.gameTitle}</strong> · Fin dans {t.endsIn}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-black text-cyan-300 block">
                          {t.prizePoolGems} 💎
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {t.leaderboard.length} inscrits
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section: Live Player Reviews & Community Feedback Stream */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    Flux en Direct des Avis Joueurs ({gameReviews.length})
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Commentaires et notes 5 étoiles laissés par la communauté sur vos jeux.
                  </p>
                </div>

                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                  Flux Modéré Play Protect
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gameReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-2.5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.authorAvatar}
                          alt={rev.authorName}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-100">
                              {rev.authorName}
                            </span>
                            {rev.verifiedPlayer && (
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1 rounded">
                                Vérifié
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {rev.gameTitle}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {rev.title && (
                      <h5 className="text-xs font-bold text-slate-200">{rev.title}</h5>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2 rounded-xl border border-slate-850">
                      {rev.comment}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <div className="flex flex-wrap gap-1">
                        {rev.tags?.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded text-slate-400 font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => likeGameReview(rev.id)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border transition-colors ${
                          rev.hasLiked
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Utile ({rev.likes})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: MANAGE SELECTED GAME (Quick Update / Rollout Hotfix) */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">Gérer la version : {selectedGame.title}</h3>
              <button
                onClick={() => setSelectedGame(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Statut du déploiement :</label>
                <select
                  defaultValue={selectedGame.rolloutStatus}
                  onChange={(e) => updateGameStatus(selectedGame.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold"
                >
                  <option value="production">Production Globale (100%)</option>
                  <option value="staged-rollout">Diffusion Progressive</option>
                  <option value="open-beta">Bêta Ouverte</option>
                  <option value="paused">Mettre en pause (Désactiver temporairement)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes de correctif (Hotfix) :</label>
                <textarea
                  rows={3}
                  defaultValue={selectedGame.releaseNotes}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedGame(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  showToast('Modifications de la version enregistrées !');
                  setSelectedGame(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
