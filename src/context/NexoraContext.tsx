import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Mission,
  ShopItem,
  Friend,
  Challenge,
  AppNotification,
  LeaderboardEntry,
  PlayerStatusPost,
  ChatMessage,
  AuditLogEntry,
  Item,
  ColorMode,
  PublicUserProfile,
  DeployedGame,
  ColorTheme,
  GameReview,
  GameTournament,
  CreatorProfile,
  CreatorEarnings,
  SocialFeedPost,
  PaymentTransaction,
  PaymentProvider,
  PaymentItemType,
  ThemePreset,
} from '../types/nexora';
import {
  INITIAL_USER,
  INITIAL_ADMIN_USER,
  INITIAL_MISSIONS,
  INITIAL_SHOP_ITEMS,
  INITIAL_FRIENDS,
  INITIAL_CHALLENGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_LEADERBOARD,
  INITIAL_STATUS_POSTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_DEPLOYED_GAMES,
  INITIAL_COLOR_THEMES,
  INITIAL_GAME_REVIEWS,
  INITIAL_TOURNAMENTS,
  INITIAL_CREATORS,
  INITIAL_CREATOR_EARNINGS,
  INITIAL_THEME_PRESETS,
  INITIAL_SOCIAL_FEED,
  INITIAL_PAYMENT_TRANSACTIONS,
} from '../data/initialNexoraData';

interface NexoraContextType {
  currentUser: UserProfile | null;
  adminUser: UserProfile | null;
  activeRole: 'player' | 'admin';
  missions: Mission[];
  shopItems: ShopItem[];
  friends: Friend[];
  challenges: Challenge[];
  notifications: AppNotification[];
  leaderboard: LeaderboardEntry[];
  statusPosts: PlayerStatusPost[];
  chatMessages: ChatMessage[];
  auditLogs: AuditLogEntry[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'mobile-frame' | 'responsive';
  setViewMode: (mode: 'mobile-frame' | 'responsive') => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  inspectedUser: PublicUserProfile | null;
  openInspectUser: (target: any) => Promise<void>;
  closeInspectUser: () => void;
  isMicMuted: boolean;
  toggleMic: () => void;
  switchRole: (role: 'player' | 'admin') => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  equipItem: (itemId: string) => Promise<void>;
  sellItem: (itemId: string) => Promise<number>;
  buyShopItem: (shopItemId: string) => Promise<{ success: boolean; message?: string }>;
  sendChatMessage: (text: string) => Promise<void>;
  postStatus: (text: string, badge?: string) => Promise<void>;
  likeStatus: (statusId: string) => Promise<void>;
  startLobby: (mission: Mission) => void;
  closeLobby: () => void;
  activeLobbyMission: Mission | null;
  lobbyMembers: { id: string; name: string; avatar: string; ready: boolean; role: string }[];
  toggleLobbyReady: () => void;
  activePlayingMission: Mission | null;
  startPlayMission: (mission: Mission) => void;
  finishMission: (missionId: string, score: number) => Promise<any>;
  exitGame: () => void;
  askAiAssistant: (prompt: string) => Promise<string>;
  adminCreateMission: (data: any) => Promise<void>;
  adminDeleteMission: (missionId: string) => Promise<void>;
  adminUserAction: (action: string, targetUserId?: string, amount?: number, reason?: string) => Promise<void>;
  adminBroadcastNotification: (title: string, message: string) => Promise<void>;
  dismissNotification: (id: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  themeAccent: 'gold' | 'cyan' | 'emerald' | 'crimson';
  setThemeAccent: (accent: 'gold' | 'cyan' | 'emerald' | 'crimson') => void;

  // Dedicated Play Console (Separate App Environment)
  appMode: 'player' | 'admin-console';
  switchAppMode: (mode: 'player' | 'admin-console') => void;
  isConsoleAuthenticated: boolean;
  developerUser: any | null;
  consoleLogin: (developerEmail?: string, securityKey?: string, organizationId?: string) => Promise<boolean>;
  consoleLogout: () => void;
  deployedGames: DeployedGame[];
  deployNewGame: (gameData: any) => Promise<{ success: boolean; game?: DeployedGame; error?: string }>;
  updateGameStatus: (gameId: string, rolloutStatus: string, rolloutPercent?: number, releaseNotes?: string) => Promise<void>;
  adminDeleteGame: (gameId: string) => Promise<boolean>;

  // VIP Community Game Publication (Limited by VIP Subscription Tier)
  vipPublishGame: (gameData: any) => Promise<{ success: boolean; game?: DeployedGame; error?: string }>;
  isVipCreatorModalOpen: boolean;
  setIsVipCreatorModalOpen: (open: boolean) => void;

  // Custom Color Themes & Styles Window (Beyond dark/light mode)
  allThemes: ColorTheme[];
  activeTheme: ColorTheme;
  setActiveTheme: (theme: ColorTheme) => void;
  addCustomTheme: (theme: ColorTheme) => void;
  isColorStylesModalOpen: boolean;
  setIsColorStylesModalOpen: (open: boolean) => void;

  // Community Game Reviews & Ratings
  gameReviews: GameReview[];
  addGameReview: (data: { gameId: string; gameTitle: string; rating: number; title?: string; comment: string; tags?: string[] }) => Promise<boolean>;
  likeGameReview: (reviewId: string) => Promise<void>;

  // Game Tournaments & Leaderboards
  tournaments: GameTournament[];
  joinTournament: (tournamentId: string) => Promise<boolean>;

  // VIP Creators & Monetization
  creators: CreatorProfile[];
  creatorEarnings: CreatorEarnings;
  claimCreatorRoyalties: () => Promise<boolean>;
  followCreator: (creatorId: string) => Promise<void>;
  selectedCreatorForModal: CreatorProfile | null;
  setSelectedCreatorForModal: (creator: CreatorProfile | null) => void;

  // Social Feed (TikTok / Instagram Gaming Hybrid)
  socialPosts: SocialFeedPost[];
  addSocialPost: (post: { caption: string; imageUrl: string; gameTag: string; gameTitle?: string }) => Promise<boolean>;
  toggleLikeSocialPost: (postId: string) => Promise<void>;
  addCommentToSocialPost: (postId: string, text: string) => Promise<void>;
  adminDeleteSocialPost: (postId: string) => Promise<void>;
  isCreatePostModalOpen: boolean;
  setIsCreatePostModalOpen: (open: boolean) => void;

  // Real Mobile Payment Checkout (Wave, Moov, MTN, CB)
  paymentTransactions: PaymentTransaction[];
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  selectedCheckoutItem: {
    type: PaymentItemType;
    id: string;
    title: string;
    price: number;
    xp?: number;
    coins?: number;
    subTier?: 'starter_2' | 'pro_4' | 'elite_8';
  } | null;
  openCheckout: (item: {
    type: PaymentItemType;
    id: string;
    title: string;
    price: number;
    xp?: number;
    coins?: number;
    subTier?: 'starter_2' | 'pro_4' | 'elite_8';
  }) => void;
  processMobilePayment: (params: {
    provider: PaymentProvider;
    phoneNumber?: string;
    cardNumber?: string;
  }) => Promise<{ success: boolean; message: string; receiptNumber?: string }>;

  // Universal Search
  isUniversalSearchOpen: boolean;
  setIsUniversalSearchOpen: (open: boolean) => void;
  searchFilterCategory: string;
  setSearchFilterCategory: (cat: string) => void;

  // Theme Presets (YouTube, TikTok, WhatsApp, Insta, Facebook, Obsidian)
  themePresets: ThemePreset[];
  activeThemePreset: ThemePreset;
  setActiveThemePreset: (preset: ThemePreset) => void;
  adminToggleThemePresetAvailability: (presetId: string) => void;

  // Admin User & Content Overwatch
  allUsersList: UserProfile[];
  adminToggleUserBlueBadge: (userId: string) => void;
  adminBanUserAccount: (userId: string) => void;
  adminUnbanUserAccount: (userId: string) => void;
}

const NexoraContext = createContext<NexoraContextType | undefined>(undefined);

export const NexoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USER);
  const [adminUser, setAdminUser] = useState<UserProfile | null>(INITIAL_ADMIN_USER);
  const [activeRole, setActiveRole] = useState<'player' | 'admin'>('player');
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [shopItems, setShopItems] = useState<ShopItem[]>(INITIAL_SHOP_ITEMS);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [statusPosts, setStatusPosts] = useState<PlayerStatusPost[]>(INITIAL_STATUS_POSTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [deployedGames, setDeployedGames] = useState<DeployedGame[]>(INITIAL_DEPLOYED_GAMES);

  // Reviews, Tournaments & VIP Creators
  const [gameReviews, setGameReviews] = useState<GameReview[]>(INITIAL_GAME_REVIEWS);
  const [tournaments, setTournaments] = useState<GameTournament[]>(INITIAL_TOURNAMENTS);
  const [creators, setCreators] = useState<CreatorProfile[]>(INITIAL_CREATORS);
  const [creatorEarnings, setCreatorEarnings] = useState<CreatorEarnings>(INITIAL_CREATOR_EARNINGS);
  const [selectedCreatorForModal, setSelectedCreatorForModal] = useState<CreatorProfile | null>(null);

  // Custom Color Themes (Beyond dark/light mode)
  const [allThemes, setAllThemes] = useState<ColorTheme[]>(INITIAL_COLOR_THEMES);
  const [activeTheme, setActiveThemeState] = useState<ColorTheme>(INITIAL_COLOR_THEMES[0]);
  const [isColorStylesModalOpen, setIsColorStylesModalOpen] = useState<boolean>(false);
  const [isVipCreatorModalOpen, setIsVipCreatorModalOpen] = useState<boolean>(false);

  // Social Feed (TikTok / Instagram Gaming Hybrid)
  const [socialPosts, setSocialPosts] = useState<SocialFeedPost[]>(INITIAL_SOCIAL_FEED);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState<boolean>(false);

  // Real Mobile Payment Checkout
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(INITIAL_PAYMENT_TRANSACTIONS);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [selectedCheckoutItem, setSelectedCheckoutItem] = useState<{
    type: PaymentItemType;
    id: string;
    title: string;
    price: number;
    xp?: number;
    coins?: number;
    subTier?: 'starter_2' | 'pro_4' | 'elite_8';
  } | null>(null);

  // Universal Search
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState<boolean>(false);
  const [searchFilterCategory, setSearchFilterCategory] = useState<string>('Tous');

  // Theme Presets (YouTube, TikTok, WhatsApp, Insta, Facebook, Obsidian)
  const [themePresets, setThemePresets] = useState<ThemePreset[]>(INITIAL_THEME_PRESETS);
  const [activeThemePreset, setActiveThemePresetState] = useState<ThemePreset>(INITIAL_THEME_PRESETS[0]);

  // Admin User & Content Overwatch
  const [allUsersList, setAllUsersList] = useState<UserProfile[]>([
    INITIAL_USER,
    {
      id: 'usr_002',
      username: 'NovaStrike',
      email: 'nova@nexora.io',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
      role: 'player',
      level: 12,
      currentXp: 1800,
      nextLevelXp: 3000,
      nexCoins: 1200,
      quantumGems: 40,
      lives: 5,
      maxLives: 5,
      isPremium: false,
      hasBlueBadge: false,
      status: 'active',
      stats: { gamesPlayed: 65, victories: 32, winRate: 49.2, highScore: 18400, challengesCompleted: 12, rankTitle: 'Challenger', rankTier: 'Argent' },
      inventory: [],
      referralCode: 'NOVA22',
      twoFactorEnabled: false,
      privacyMode: 'public',
    },
    {
      id: 'usr_valk',
      username: 'Valkyrie_One',
      email: 'valk@nexora.io',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'player',
      level: 25,
      currentXp: 7200,
      nextLevelXp: 8000,
      nexCoins: 5400,
      quantumGems: 350,
      lives: 5,
      maxLives: 5,
      isPremium: true,
      hasBlueBadge: true,
      status: 'active',
      stats: { gamesPlayed: 310, victories: 240, winRate: 77.4, highScore: 62000, challengesCompleted: 85, rankTitle: 'Maître Suprême', rankTier: 'Maître' },
      inventory: [],
      referralCode: 'VALK99',
      twoFactorEnabled: true,
      privacyMode: 'public',
    },
  ]);

  // Separate App Mode: 'player' (Gamer Hub) vs 'admin-console' (Google Play Developer Console)
  const [appMode, setAppMode] = useState<'player' | 'admin-console'>('player');
  const [isConsoleAuthenticated, setIsConsoleAuthenticated] = useState<boolean>(false);
  const [developerUser, setDeveloperUser] = useState<any | null>(null);

  const [activeTab, setActiveTab] = useState<string>('home');
  const [viewMode, setViewMode] = useState<'mobile-frame' | 'responsive'>('mobile-frame');
  const [colorMode, setColorMode] = useState<ColorMode>('dark');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [inspectedUser, setInspectedUser] = useState<PublicUserProfile | null>(null);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [themeAccent, setThemeAccent] = useState<'gold' | 'cyan' | 'emerald' | 'crimson'>('gold');

  const switchAppMode = (mode: 'player' | 'admin-console') => {
    setAppMode(mode);
    if (mode === 'admin-console') {
      showToast('Ouverture de NEXORA Play Console (Studio Développeur)');
    } else {
      showToast('Retour à l Application Joueur NEXORA');
    }
  };

  const toggleColorMode = () => {
    setColorMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(next === 'light' ? 'Mode Clair Minimaliste activé ☀️' : 'Mode Sombre Cyberpunk activé 🌙');
      return next;
    });
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  // Lobby state
  const [activeLobbyMission, setActiveLobbyMission] = useState<Mission | null>(null);
  const [lobbyMembers, setLobbyMembers] = useState<{ id: string; name: string; avatar: string; ready: boolean; role: string }[]>([]);

  // Active Game State
  const [activePlayingMission, setActivePlayingMission] = useState<Mission | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const toggleMic = () => {
    setIsMicMuted((prev) => {
      const next = !prev;
      showToast(next ? 'Microphone désactivé' : 'Microphone actif (Salon vocal)');
      return next;
    });
  };

  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.currentUser);
        setAdminUser(data.adminUser);
        setMissions(data.missions);
        setShopItems(data.shopItems);
        setFriends(data.friends);
        setChallenges(data.challenges);
        setNotifications(data.notifications);
        setLeaderboard(data.leaderboard);
        setStatusPosts(data.statusPosts);
        setChatMessages(data.chatMessages);
        setAuditLogs(data.auditLogs);
        if (data.deployedGames) {
          setDeployedGames(data.deployedGames);
        }
        if (data.gameReviews) {
          setGameReviews(data.gameReviews);
        }
        if (data.tournaments) {
          setTournaments(data.tournaments);
        }
        if (data.creators) {
          setCreators(data.creators);
        }
        if (data.creatorEarnings) {
          setCreatorEarnings(data.creatorEarnings);
        }
      }
    } catch (err) {
      console.error('Failed to fetch Nexora state:', err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const switchRole = async (role: 'player' | 'admin') => {
    setActiveRole(role);
    if (role === 'admin') {
      setActiveTab('admin');
      showToast('Espace Administrateur NEXORA déverrouillé');
    } else {
      setActiveTab('home');
      showToast('Profil Joueur Kaelen_Void actif');
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resData = await res.json();
        setCurrentUser(resData.user);
        showToast('Profil mis à jour avec succès');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const equipItem = async (itemId: string) => {
    try {
      const res = await fetch('/api/inventory/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        showToast('Équipement synchronisé');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sellItem = async (itemId: string): Promise<number> => {
    try {
      const res = await fetch('/api/market/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        showToast(`Objet vendu pour +${data.coinsEarned} Pièces NEX !`);
        return data.coinsEarned;
      }
    } catch (err) {
      console.error(err);
    }
    return 0;
  };

  const buyShopItem = async (shopItemId: string) => {
    try {
      const res = await fetch('/api/market/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopItemId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        showToast(`Achat réussi : ${data.itemPurchased.title}`);
        return { success: true };
      } else {
        showToast(data.error || 'Achat impossible');
        return { success: false, message: data.error };
      }
    } catch (err) {
      return { success: false, message: 'Erreur réseau' };
    }
  };

  const sendChatMessage = async (text: string) => {
    try {
      const res = await fetch('/api/social/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, senderRole: activeRole }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const postStatus = async (text: string, badge?: string) => {
    try {
      const res = await fetch('/api/social/status/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, badge }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatusPosts((prev) => [data.post, ...prev]);
        showToast('Nouveau statut publié sur NEXORA Social !');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const likeStatus = async (statusId: string) => {
    try {
      const res = await fetch('/api/social/status/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusId }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatusPosts((prev) => prev.map((p) => (p.id === statusId ? data.post : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startLobby = (mission: Mission) => {
    setActiveLobbyMission(mission);
    setLobbyMembers([
      {
        id: currentUser?.id || 'usr_001',
        name: currentUser?.username || 'Kaelen_Void',
        avatar: currentUser?.avatarUrl || '',
        ready: true,
        role: 'Chef d Escouade',
      },
      {
        id: 'fr_01',
        name: 'Valkyrie_99',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        ready: true,
        role: 'Assaut Rapide',
      },
      ...(mission.maxPlayers === 3
        ? [
            {
              id: 'fr_02',
              name: 'Ghost_Rider_X',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
              ready: false,
              role: 'Soutien Bouclier',
            },
          ]
        : []),
    ]);
  };

  const closeLobby = () => {
    setActiveLobbyMission(null);
    setLobbyMembers([]);
  };

  const toggleLobbyReady = () => {
    setLobbyMembers((prev) =>
      prev.map((m) => (m.id === (currentUser?.id || 'usr_001') ? { ...m, ready: !m.ready } : m))
    );
  };

  const startPlayMission = (mission: Mission) => {
    closeLobby();
    setActivePlayingMission(mission);
  };

  const exitGame = () => {
    setActivePlayingMission(null);
  };

  const finishMission = async (missionId: string, score: number) => {
    try {
      const res = await fetch('/api/games/complete-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, score, durationSeconds: 120 }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        if (data.creatorEarnings) setCreatorEarnings(data.creatorEarnings);
        if (data.tournaments) setTournaments(data.tournaments);
        fetchState(); // refresh leaderboard & notifications
        return data;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const askAiAssistant = async (prompt: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.reply;
      }
    } catch (err) {
      console.error(err);
    }
    return 'Désolé, une erreur de liaison avec l IA AURA est survenue.';
  };

  const openInspectUser = async (target: any) => {
    if (!target) return;
    const targetId = typeof target === 'string' ? target : target.id || target.username;
    try {
      const res = await fetch(`/api/users/${targetId}`);
      if (res.ok) {
        const profile = await res.json();
        setInspectedUser(profile);
        return;
      }
    } catch (e) {
      console.warn('Could not fetch user profile from server:', e);
    }

    // Client-side fallback
    const friend = friends.find((f) => f.id === targetId || f.username === targetId);
    const lb = leaderboard.find((l) => l.id === targetId || l.username === targetId);
    const username = friend?.username || lb?.username || (typeof target === 'string' ? target : target.username || 'Joueur NEXORA');
    setInspectedUser({
      id: targetId,
      username,
      avatarUrl: friend?.avatarUrl || lb?.avatarUrl || target.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
      level: friend?.level || lb?.level || target.level || 16,
      rankTier: friend?.rankTier || lb?.rankTier || target.rankTier || 'Or',
      rankTitle: 'Combattant Astral',
      isOnline: friend?.isOnline ?? true,
      privacyMode: username === 'Zack_Pixel' ? 'private' : username === 'Ghost_Rider_X' ? 'friends' : 'public',
      isFriend: !!friend,
      rankPosition: lb?.rank || (typeof target === 'object' && target?.rank ? target.rank : 8),
      rankScore: lb?.score || (typeof target === 'object' && target?.score ? target.score : 35000),
      stats: {
        gamesPlayed: 85,
        victories: 54,
        winRate: 64,
        highScore: lb?.score || 35000,
      },
      equippedWeapon: 'Katana Plasma Solaire',
      equippedArmor: 'Cuirasse Nanotechnologique',
    });
  };

  const closeInspectUser = () => {
    setInspectedUser(null);
  };

  const adminCreateMission = async (data: any) => {
    try {
      const res = await fetch('/api/admin/create-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resData = await res.json();
        setMissions((prev) => [resData.mission, ...prev]);
        showToast(`Mission "${resData.mission.title}" créée et publiée !`);
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const adminDeleteMission = async (missionId: string) => {
    try {
      const res = await fetch('/api/admin/delete-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId }),
      });
      if (res.ok) {
        const resData = await res.json();
        setMissions(resData.missions);
        setAuditLogs(resData.auditLogs);
        showToast('Mission définitivement supprimée du catalogue.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const adminUserAction = async (action: string, targetUserId?: string, amount?: number, reason?: string) => {
    try {
      const res = await fetch('/api/admin/user-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, targetUserId, amount, reason }),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.user) setCurrentUser(resData.user);
        if (resData.leaderboard) setLeaderboard(resData.leaderboard);
        if (resData.friends) setFriends(resData.friends);
        if (resData.auditLogs) setAuditLogs(resData.auditLogs);
        showToast(`Action Admin exécutée : ${action.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const adminBroadcastNotification = async (title: string, message: string) => {
    try {
      const res = await fetch('/api/admin/broadcast-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message }),
      });
      if (res.ok) {
        const resData = await res.json();
        setNotifications((prev) => [resData.notification, ...prev]);
        showToast('Notification push diffusée à tous les joueurs');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Play Console Developer Auth
  const consoleLogin = async (
    developerEmail = 'alexis.nexora.dev@quantum.corp',
    securityKey = 'NEXORA-DEV-2026',
    organizationId = 'Quantum Pixel Studios & NEXORA Publishing'
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/console-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerEmail, securityKey, organizationId }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsConsoleAuthenticated(true);
        setDeveloperUser(data.developerUser);
        setActiveRole('admin');
        showToast('Console Développeur déverrouillée avec succès !');
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Identifiants développeur invalides.');
        return false;
      }
    } catch (e) {
      // Local fallback for offline/instant mode
      setIsConsoleAuthenticated(true);
      setDeveloperUser({
        id: 'dev_lead_01',
        name: 'Alexis V. (Studio Lead Architect)',
        email: developerEmail,
        organization: organizationId,
        role: 'Lead Architect & SuperAdmin',
      });
      setActiveRole('admin');
      showToast('Accès Développeur Studio validé');
      return true;
    }
  };

  const consoleLogout = () => {
    setIsConsoleAuthenticated(false);
    setDeveloperUser(null);
    showToast('Session Play Console fermée.');
  };

  // Deploy New Game via Google Play Store Form
  const deployNewGame = async (gameData: any): Promise<{ success: boolean; game?: DeployedGame; error?: string }> => {
    try {
      const res = await fetch('/api/admin/deploy-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
      });
      const data = await res.json();
      if (res.ok) {
        setDeployedGames(data.deployedGames);
        setMissions(data.missions);
        setNotifications(data.notifications);
        setAuditLogs(data.auditLogs);
        showToast(`🎉 Jeu "${data.game.title}" déployé avec succès sur le Play Store !`);
        return { success: true, game: data.game };
      } else {
        showToast(data.error || 'Erreur lors du déploiement.');
        return { success: false, error: data.error };
      }
    } catch (e: any) {
      showToast('Erreur réseau lors de la publication.');
      return { success: false, error: e.message };
    }
  };

  // Update game rollout status
  const updateGameStatus = async (
    gameId: string,
    rolloutStatus: string,
    rolloutPercent?: number,
    releaseNotes?: string
  ) => {
    try {
      const res = await fetch('/api/admin/update-game-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, rolloutStatus, rolloutPercent, releaseNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeployedGames(data.deployedGames);
        setAuditLogs(data.auditLogs);
        showToast(`Statut du jeu mis à jour (${rolloutStatus})`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Only Administrator can delete/remove a game
  const adminDeleteGame = async (gameId: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/delete-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeployedGames(data.deployedGames);
        setMissions(data.missions);
        setAuditLogs(data.auditLogs);
        showToast('Jeu définitivement retiré du Play Store par l administrateur.');
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Erreur lors de la suppression.');
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // VIP Players can publish games limited by their VIP tier quota
  const vipPublishGame = async (gameData: any): Promise<{ success: boolean; game?: DeployedGame; error?: string }> => {
    try {
      const res = await fetch('/api/vip/publish-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
      });
      const data = await res.json();
      if (res.ok) {
        setDeployedGames(data.deployedGames);
        setMissions(data.missions);
        setAuditLogs(data.auditLogs);
        setCurrentUser(data.currentUser);
        showToast(`🎉 Jeu VIP "${data.game.title}" publié avec succès sur NEXORA !`);
        return { success: true, game: data.game };
      } else {
        showToast(data.error || 'Erreur lors de la publication VIP.');
        return { success: false, error: data.error };
      }
    } catch (e: any) {
      showToast('Erreur réseau lors de la soumission.');
      return { success: false, error: e.message };
    }
  };

  // Theme color styles
  const setActiveTheme = (theme: ColorTheme) => {
    setActiveThemeState(theme);
    showToast(`Style de couleur "${theme.name}" appliqué ! 🎨`);
  };

  const addCustomTheme = (theme: ColorTheme) => {
    setAllThemes((prev) => [theme, ...prev]);
    setActiveThemeState(theme);
    showToast(`Nouveau style "${theme.name}" créé et activé ! ✨`);
  };

  // Community Reviews & Ratings
  const addGameReview = async (reviewData: {
    gameId: string;
    gameTitle: string;
    rating: number;
    title?: string;
    comment: string;
    tags?: string[];
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/games/reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (res.ok) {
        setGameReviews(data.gameReviews);
        if (data.deployedGames) setDeployedGames(data.deployedGames);
        if (data.currentUser) setCurrentUser(data.currentUser);
        showToast('⭐ Avis publié ! +75 XP et +50 Pièces crédités.');
        return true;
      } else {
        showToast(data.error || 'Erreur lors de la publication de l avis.');
        return false;
      }
    } catch (e: any) {
      showToast('Erreur de connexion pour publier l avis.');
      return false;
    }
  };

  const likeGameReview = async (reviewId: string) => {
    try {
      const res = await fetch('/api/games/reviews/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId }),
      });
      const data = await res.json();
      if (res.ok && data.gameReviews) {
        setGameReviews(data.gameReviews);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Tournaments actions
  const joinTournament = async (tournamentId: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/tournaments/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setTournaments(data.tournaments);
        if (data.currentUser) setCurrentUser(data.currentUser);
        showToast('🏆 Inscription au Tournoi validée avec succès !');
        return true;
      } else {
        showToast(data.error || 'Erreur lors de l inscription au tournoi.');
        return false;
      }
    } catch (e: any) {
      showToast('Erreur réseau lors de l inscription.');
      return false;
    }
  };

  // Creator Royalties & Profile actions
  const claimCreatorRoyalties = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/creators/claim-royalties', {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.currentUser);
        setCreatorEarnings(data.creatorEarnings);
        if (data.notifications) setNotifications(data.notifications);
        showToast(`💎 +${data.claimedGems} Gemmes encaissées avec succès dans votre solde !`);
        return true;
      } else {
        showToast(data.error || 'Aucune royalty à encaisser.');
        return false;
      }
    } catch (e: any) {
      showToast('Erreur lors du retrait des royalties.');
      return false;
    }
  };

  const followCreator = async (creatorId: string) => {
    try {
      const res = await fetch('/api/creators/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId }),
      });
      const data = await res.json();
      if (res.ok && data.creators) {
        setCreators(data.creators);
        const creator = data.creator;
        if (creator) {
          showToast(creator.isFollowing ? `Vous suivez désormais ${creator.username} !` : `Désabonné de ${creator.username}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Real Mobile Payment Checkout Methods
  const openCheckout = (item: {
    type: PaymentItemType;
    id: string;
    title: string;
    price: number;
    xp?: number;
    coins?: number;
    subTier?: 'starter_2' | 'pro_4' | 'elite_8';
  }) => {
    setSelectedCheckoutItem(item);
    setIsCheckoutModalOpen(true);
  };

  const processMobilePayment = async (params: {
    provider: PaymentProvider;
    phoneNumber?: string;
    cardNumber?: string;
  }): Promise<{ success: boolean; message: string; receiptNumber?: string }> => {
    if (!selectedCheckoutItem || !currentUser) {
      return { success: false, message: 'Aucun article sélectionné' };
    }

    const receiptNum = `NEX-PAY-${Math.floor(100000 + Math.random() * 900000)}`;

    // Update user balance
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      if (selectedCheckoutItem.xp) {
        updated.currentXp += selectedCheckoutItem.xp;
      }
      if (selectedCheckoutItem.coins) {
        updated.nexCoins += selectedCheckoutItem.coins;
      }
      if (selectedCheckoutItem.subTier) {
        updated.isPremium = true;
        updated.activeSubscriptionTier = selectedCheckoutItem.subTier;
      }
      return updated;
    });

    const newTx: PaymentTransaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.username,
      provider: params.provider,
      itemType: selectedCheckoutItem.type,
      itemId: selectedCheckoutItem.id,
      itemTitle: selectedCheckoutItem.title,
      amountFiat: selectedCheckoutItem.price,
      currency: 'EUR',
      grantedXp: selectedCheckoutItem.xp,
      grantedCoins: selectedCheckoutItem.coins,
      subscriptionTier: selectedCheckoutItem.subTier,
      phoneNumber: params.phoneNumber,
      maskedCard: params.cardNumber ? `•••• •••• •••• ${params.cardNumber.slice(-4)}` : undefined,
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      receiptNumber: receiptNum,
    };

    setPaymentTransactions((prev) => [newTx, ...prev]);

    showToast(`Paiement de ${selectedCheckoutItem.price} € validé via ${params.provider.toUpperCase()} ! Crédit appliqué ⚡`);
    setIsCheckoutModalOpen(false);
    return { success: true, message: 'Paiement confirmé avec succès', receiptNumber: receiptNum };
  };

  // Social Feed Handlers
  const addSocialPost = async (post: { caption: string; imageUrl: string; gameTag: string; gameTitle?: string }): Promise<boolean> => {
    if (!currentUser) return false;
    const newPost: SocialFeedPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.username,
      authorAvatar: currentUser.avatarUrl,
      hasBlueBadge: !!currentUser.hasBlueBadge,
      gameTag: post.gameTag.startsWith('#') ? post.gameTag : `#${post.gameTag}`,
      gameTitle: post.gameTitle || 'Partie Joueur',
      caption: post.caption,
      imageUrl: post.imageUrl,
      timestamp: "À l'instant",
      likesCount: 0,
      likedByCurrentUser: false,
      comments: [],
      sharesCount: 0,
      status: 'published',
    };
    setSocialPosts((prev) => [newPost, ...prev]);
    setIsCreatePostModalOpen(false);
    showToast('Votre publication a été partagée sur le flux communautaire ! 🔥');
    return true;
  };

  const toggleLikeSocialPost = async (postId: string) => {
    setSocialPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.likedByCurrentUser;
          return {
            ...p,
            likedByCurrentUser: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const addCommentToSocialPost = async (postId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const newComment = {
      id: `comm_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.username,
      authorAvatar: currentUser.avatarUrl,
      hasBlueBadge: !!currentUser.hasBlueBadge,
      text: text.trim(),
      timestamp: "À l'instant",
    };
    setSocialPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
    showToast('Commentaire publié !');
  };

  const adminDeleteSocialPost = async (postId: string) => {
    setSocialPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Post supprimé définitivement par la modération administrateur');
  };

  // Theme Presets Handlers
  const setActiveThemePreset = (preset: ThemePreset) => {
    setActiveThemePresetState(preset);
    showToast(`Thème d'application "${preset.name}" activé`);
  };

  const adminToggleThemePresetAvailability = (presetId: string) => {
    setThemePresets((prev) =>
      prev.map((t) => (t.id === presetId ? { ...t, isAvailableForUsers: !t.isAvailableForUsers } : t))
    );
    showToast('Disponibilité du thème mise à jour pour les utilisateurs');
  };

  // Admin User Moderation Handlers
  const adminToggleUserBlueBadge = (userId: string) => {
    setAllUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const next = !u.hasBlueBadge;
          return { ...u, hasBlueBadge: next };
        }
        return u;
      })
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, hasBlueBadge: !prev.hasBlueBadge } : prev));
    }
    showToast('Statut Badge Bleu Vérifié mis à jour');
  };

  const adminBanUserAccount = (userId: string) => {
    setAllUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'banned' } : u))
    );
    showToast(`Utilisateur ${userId} banni du réseau`);
  };

  const adminUnbanUserAccount = (userId: string) => {
    setAllUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'active' } : u))
    );
    showToast(`Utilisateur ${userId} réactivé`);
  };

  return (
    <NexoraContext.Provider
      value={{
        currentUser,
        adminUser,
        activeRole,
        missions,
        shopItems,
        friends,
        challenges,
        notifications,
        leaderboard,
        statusPosts,
        chatMessages,
        auditLogs,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        colorMode,
        setColorMode,
        toggleColorMode,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer,
        inspectedUser,
        openInspectUser,
        closeInspectUser,
        isMicMuted,
        toggleMic,
        switchRole,
        updateProfile,
        equipItem,
        sellItem,
        buyShopItem,
        sendChatMessage,
        postStatus,
        likeStatus,
        startLobby,
        closeLobby,
        activeLobbyMission,
        lobbyMembers,
        toggleLobbyReady,
        activePlayingMission,
        startPlayMission,
        finishMission,
        exitGame,
        askAiAssistant,
        adminCreateMission,
        adminDeleteMission,
        adminUserAction,
        adminBroadcastNotification,
        dismissNotification,
        toastMessage,
        showToast,
        themeAccent,
        setThemeAccent,

        // Play Console
        appMode,
        switchAppMode,
        isConsoleAuthenticated,
        developerUser,
        consoleLogin,
        consoleLogout,
        deployedGames,
        deployNewGame,
        updateGameStatus,
        adminDeleteGame,

        // VIP Creator
        vipPublishGame,
        isVipCreatorModalOpen,
        setIsVipCreatorModalOpen,

        // Custom Color Themes
        allThemes,
        activeTheme,
        setActiveTheme,
        addCustomTheme,
        isColorStylesModalOpen,
        setIsColorStylesModalOpen,

        // Community Game Reviews & Ratings
        gameReviews,
        addGameReview,
        likeGameReview,

        // Game Tournaments & Leaderboards
        tournaments,
        joinTournament,

        // VIP Creators & Monetization
        creators,
        creatorEarnings,
        claimCreatorRoyalties,
        followCreator,
        selectedCreatorForModal,
        setSelectedCreatorForModal,

        // Social Feed (TikTok / Instagram Gaming Hybrid)
        socialPosts,
        addSocialPost,
        toggleLikeSocialPost,
        addCommentToSocialPost,
        adminDeleteSocialPost,
        isCreatePostModalOpen,
        setIsCreatePostModalOpen,

        // Real Mobile Payment Checkout
        paymentTransactions,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        selectedCheckoutItem,
        openCheckout,
        processMobilePayment,

        // Universal Search
        isUniversalSearchOpen,
        setIsUniversalSearchOpen,
        searchFilterCategory,
        setSearchFilterCategory,

        // Theme Presets
        themePresets,
        activeThemePreset,
        setActiveThemePreset,
        adminToggleThemePresetAvailability,

        // Admin User & Content Overwatch
        allUsersList,
        adminToggleUserBlueBadge,
        adminBanUserAccount,
        adminUnbanUserAccount,
      }}
    >
      {children}
    </NexoraContext.Provider>
  );
};

export const useNexora = () => {
  const context = useContext(NexoraContext);
  if (!context) {
    throw new Error('useNexora must be used within a NexoraProvider');
  }
  return context;
};
