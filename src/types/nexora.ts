export type MissionCategory =
  | 'Action'
  | 'Réflexion'
  | 'Course'
  | 'Stratégie'
  | 'Cartes'
  | 'Simulation'
  | 'Aventure'
  | 'RPG'
  | 'Sport'
  | 'Jeux de société';

export type MissionDifficulty = 'Facile' | 'Moyen' | 'Difficile' | 'Héroïque' | 'Légendaire';

export interface MissionReward {
  xp: number;
  coins: number;
  gems?: number;
  itemLoot?: {
    id: string;
    name: string;
    rarity: 'Commune' | 'Rare' | 'Épique' | 'Légendaire';
    icon: string;
  };
}

export interface Mission {
  id: string;
  title: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  maxPlayers: 1 | 2 | 3;
  description: string;
  durationMinutes: number;
  reward: MissionReward;
  playableType: 'runner' | 'matrix' | 'coop-boss';
  coverGradient: string;
  activePlayersCount: number;
  isCustom?: boolean;
}

export interface Item {
  id: string;
  name: string;
  category: 'Arme' | 'Armure' | 'Consommable' | 'Skin' | 'Titre';
  rarity: 'Commune' | 'Rare' | 'Épique' | 'Légendaire';
  description: string;
  valueCoins: number;
  icon: string;
  stats?: {
    attack?: number;
    defense?: number;
    speed?: number;
    xpMultiplier?: number;
  };
  isEquipped?: boolean;
  quantity?: number;
}

export interface UserStats {
  gamesPlayed: number;
  victories: number;
  winRate: number;
  highScore: number;
  challengesCompleted: number;
  rankTitle: string;
  rankTier: 'Bronze' | 'Argent' | 'Or' | 'Diamant' | 'Maître';
}

export interface GameMastery {
  gameId: string;
  gameTitle: string;
  category: string;
  level: number;
  highScore: number;
  matchesPlayed: number;
  rankTitle: string;
  badgeIcon: string;
  winRate: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: 'player' | 'admin';
  level: number;
  currentXp: number;
  nextLevelXp: number;
  nexCoins: number;
  quantumGems: number;
  lives: number;
  maxLives: number;
  isPremium: boolean;
  hasBlueBadge?: boolean;
  activeSubscriptionTier?: 'none' | 'starter_2' | 'pro_4' | 'elite_8';
  gameMasteries?: GameMastery[];
  premiumExpiresAt?: string;
  stats: UserStats;
  inventory: Item[];
  equippedWeaponId?: string;
  equippedArmorId?: string;
  equippedTitle?: string;
  referralCode: string;
  referredBy?: string;
  twoFactorEnabled: boolean;
  privacyMode: 'public' | 'friends' | 'private';
  status: 'active' | 'warned' | 'suspended' | 'banned';
  vipTier?: 'Argent' | 'Or' | 'Diamant';
  publishedGamesCount?: number;
}

export type ColorMode = 'dark' | 'light';

export interface PublicUserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  rankTier: string;
  rankTitle?: string;
  stats?: {
    gamesPlayed: number;
    victories: number;
    winRate: number;
    highScore: number;
  };
  isOnline?: boolean;
  isPremium?: boolean;
  privacyMode: 'public' | 'friends' | 'private';
  bio?: string;
  rankPosition?: number;
  rankScore?: number;
  equippedWeapon?: string;
  equippedArmor?: string;
  isFriend?: boolean;
}

export interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  isOnline: boolean;
  currentActivity?: string;
  rankTier: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: 'player' | 'admin';
  text: string;
  timestamp: string;
  isPrivate?: boolean;
  channelId?: string;
}

export interface PlayerStatusPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  badge?: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  rewardXp: number;
  rewardCoins: number;
  isCompleted: boolean;
  expiresInHours: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'invite' | 'reward' | 'challenge' | 'system' | 'friend';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  score: number;
  isCurrentUser?: boolean;
  rankTier: string;
  isPremium?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  priceType: 'coins' | 'gems' | 'real_money';
  price: number;
  category: 'lives' | 'items' | 'currency' | 'premium';
  reward: {
    lives?: number;
    coins?: number;
    gems?: number;
    item?: Item;
    isPremiumPass?: boolean;
    premiumDays?: number;
  };
  icon: string;
  badge?: string;
  popular?: boolean;
}

export type GameEngineType =
  | 'unity'
  | 'unreal'
  | 'godot'
  | 'html5'
  | 'android-aab'
  | 'nexora-core'
  | 'iframe-embed';

export interface DeployedGame {
  id: string;
  packageId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: MissionCategory;
  pegi: 'PEGI 3' | 'PEGI 7' | 'PEGI 12' | 'PEGI 16' | 'PEGI 18';
  developerStudio: string;
  engine: GameEngineType;
  engineVersion?: string;
  buildType: 'zip-bundle' | 'wasm' | 'script' | 'remote-url' | 'native-arcade';
  buildUrl?: string;
  iconUrl: string;
  bannerUrl: string;
  screenshots: string[];
  videoTrailerUrl?: string;
  versionName: string;
  versionCode: number;
  releaseNotes: string;
  rolloutStatus: 'production' | 'staged-rollout' | 'open-beta' | 'closed-alpha' | 'paused';
  rolloutPercent: number;
  targetRegions: string[];
  monetization: {
    type: 'free' | 'coins' | 'vip';
    priceCoins?: number;
    hasInAppPurchases: boolean;
  };
  telemetry: {
    activeInstalls: number;
    dailyActiveUsers: number;
    rating: number;
    ratingsCount: number;
    crashRate: number; // e.g. 0.02%
    revenueGenerated: number;
  };
  supportedControls: ('touch' | 'keyboard' | 'gamepad' | 'motion')[];
  displayOrientation: 'portrait' | 'landscape' | 'adaptive';
  createdAt: string;
  lastUpdated: string;
  integrityVerified: boolean;
  playableType: 'runner' | 'matrix' | 'coop-boss' | 'custom-arcade';
  isVipCommunityGame?: boolean;
  submittedBy?: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  iconName: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  cardBorder: string;
  textAccent: string;
  gradientBadge: string;
  isCustom?: boolean;
}

export interface GameReview {
  id: string;
  gameId: string;
  gameTitle: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorTier?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  timestamp: string;
  verifiedPlayer: boolean;
  likes: number;
  hasLiked?: boolean;
  tags?: string[];
}

export interface TournamentLeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string;
  score: number;
  rewardGems: number;
  isCurrentUser?: boolean;
}

export interface GameTournament {
  id: string;
  gameId: string;
  gameTitle: string;
  title: string;
  description: string;
  season: number;
  endsIn: string; // e.g. "2j 14h"
  prizePoolGems: number;
  entryFeeCoins: number;
  leaderboard: TournamentLeaderboardEntry[];
  hasJoined?: boolean;
  userRank?: number;
  userBestScore?: number;
}

export interface CreatorProfile {
  id: string;
  username: string;
  avatarUrl: string;
  bio: string;
  vipTier: 'Argent' | 'Or' | 'Diamant';
  studioName: string;
  followersCount: number;
  isFollowing?: boolean;
  totalPlays: number;
  averageRating: number;
  gamesPublished: {
    id: string;
    title: string;
    iconUrl: string;
    category: string;
    rating: number;
  }[];
  verifiedBadge: boolean;
}

export interface CreatorEarnings {
  creatorId: string;
  pendingGems: number;
  totalEarnedGems: number;
  sessionsPlayed: number;
  gamesCount: number;
  conversionRate: number; // Gems generated per played session
  payoutHistory: {
    id: string;
    date: string;
    amountGems: number;
    status: 'complété' | 'en cours';
  }[];
}

// -------------------------------------------------------------
// Social Feed (TikTok / Instagram Style Gaming Feed)
// -------------------------------------------------------------
export interface SocialPostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  hasBlueBadge?: boolean;
  text: string;
  timestamp: string;
}

export interface SocialFeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  hasBlueBadge: boolean;
  gameTag: string;
  gameTitle?: string;
  caption: string;
  imageUrl: string;
  timestamp: string;
  likesCount: number;
  likedByCurrentUser: boolean;
  comments: SocialPostComment[];
  sharesCount: number;
  status: 'published' | 'reported' | 'deleted';
}

// -------------------------------------------------------------
// Real Payment System (Wave, Moov Money, MTN, Card, Prepaid)
// -------------------------------------------------------------
export type PaymentProvider = 'wave' | 'moov' | 'mtn' | 'card' | 'prepaid';
export type PaymentItemType = 'xp_pack' | 'coins_pack' | 'subscription';

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  provider: PaymentProvider;
  itemType: PaymentItemType;
  itemId: string;
  itemTitle: string;
  amountFiat: number;
  currency: 'EUR' | 'XOF' | 'USD';
  grantedXp?: number;
  grantedCoins?: number;
  subscriptionTier?: 'starter_2' | 'pro_4' | 'elite_8';
  phoneNumber?: string;
  maskedCard?: string;
  status: 'completed' | 'failed' | 'pending';
  timestamp: string;
  receiptNumber: string;
}

// -------------------------------------------------------------
// Admin Theme Presets (YouTube, TikTok, WhatsApp, Insta, etc.)
// -------------------------------------------------------------
export interface ThemePreset {
  id: string;
  name: string;
  platformRef: 'youtube' | 'tiktok' | 'whatsapp' | 'instagram' | 'facebook' | 'obsidian';
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackground: string;
  textColor: string;
  tagColor: string;
  description: string;
  isAvailableForUsers: boolean;
}

