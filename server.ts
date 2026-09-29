import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_USER,
  INITIAL_ADMIN_USER,
  INITIAL_MISSIONS,
  INITIAL_FRIENDS,
  INITIAL_CHALLENGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_LEADERBOARD,
  INITIAL_SHOP_ITEMS,
  INITIAL_STATUS_POSTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_DEPLOYED_GAMES,
  INITIAL_GAME_REVIEWS,
  INITIAL_TOURNAMENTS,
  INITIAL_CREATORS,
  INITIAL_CREATOR_EARNINGS,
} from './src/data/initialNexoraData.js';
import {
  UserProfile,
  Mission,
  Item,
  AuditLogEntry,
  AppNotification,
  DeployedGame,
  GameReview,
  GameTournament,
  CreatorProfile,
  CreatorEarnings,
} from './src/types/nexora.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory state store (persistent across requests while server runs)
let currentUser: UserProfile = JSON.parse(JSON.stringify(INITIAL_USER));
let adminUser: UserProfile = JSON.parse(JSON.stringify(INITIAL_ADMIN_USER));
let missions: Mission[] = JSON.parse(JSON.stringify(INITIAL_MISSIONS));
let shopItems = JSON.parse(JSON.stringify(INITIAL_SHOP_ITEMS));
let friends = JSON.parse(JSON.stringify(INITIAL_FRIENDS));
let challenges = JSON.parse(JSON.stringify(INITIAL_CHALLENGES));
let notifications: AppNotification[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
let leaderboard = JSON.parse(JSON.stringify(INITIAL_LEADERBOARD));
let statusPosts = JSON.parse(JSON.stringify(INITIAL_STATUS_POSTS));
let chatMessages = JSON.parse(JSON.stringify(INITIAL_CHAT_MESSAGES));
let auditLogs: AuditLogEntry[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
let deployedGames: DeployedGame[] = JSON.parse(JSON.stringify(INITIAL_DEPLOYED_GAMES));
let gameReviews: GameReview[] = JSON.parse(JSON.stringify(INITIAL_GAME_REVIEWS));
let tournaments: GameTournament[] = JSON.parse(JSON.stringify(INITIAL_TOURNAMENTS));
let creators: CreatorProfile[] = JSON.parse(JSON.stringify(INITIAL_CREATORS));
let creatorEarnings: CreatorEarnings = JSON.parse(JSON.stringify(INITIAL_CREATOR_EARNINGS));

// Gemini SDK instance
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client:', err);
  }
}

// Helper to log admin actions
function logAudit(adminName: string, action: string, target: string, details: string) {
  const newLog: AuditLogEntry = {
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    adminName,
    action,
    target,
    details,
  };
  auditLogs.unshift(newLog);
  if (auditLogs.length > 50) auditLogs.pop();
}

// API Routes
app.get('/api/state', (_req, res) => {
  res.json({
    currentUser,
    adminUser,
    missions,
    shopItems,
    friends,
    challenges,
    notifications,
    leaderboard,
    statusPosts,
    chatMessages,
    auditLogs,
    deployedGames,
    gameReviews,
    tournaments,
    creators,
    creatorEarnings,
  });
});

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { role } = req.body;
  if (role === 'admin') {
    res.json({ success: true, user: adminUser });
  } else {
    res.json({ success: true, user: currentUser });
  }
});

app.post('/api/auth/update-profile', (req, res) => {
  const { username, avatarUrl, privacyMode, twoFactorEnabled, equippedTitle } = req.body;
  if (username) currentUser.username = username;
  if (avatarUrl) currentUser.avatarUrl = avatarUrl;
  if (privacyMode) currentUser.privacyMode = privacyMode;
  if (twoFactorEnabled !== undefined) currentUser.twoFactorEnabled = twoFactorEnabled;
  if (equippedTitle !== undefined) currentUser.equippedTitle = equippedTitle;

  // Also update leaderboard display if current user
  leaderboard = leaderboard.map((entry: any) => {
    if (entry.isCurrentUser) {
      return { ...entry, username: currentUser.username, avatarUrl: currentUser.avatarUrl };
    }
    return entry;
  });

  res.json({ success: true, user: currentUser });
});

// Games & Missions Complete Route
app.post('/api/games/complete-mission', (req, res) => {
  const { missionId, score, durationSeconds } = req.body;
  const mission = missions.find((m) => m.id === missionId);

  if (!mission) {
    return res.status(404).json({ error: 'Mission introuvable' });
  }

  // Calculate rewards with Premium boost if active
  const xpMultiplier = currentUser.isPremium ? 1.5 : 1.0;
  const xpGained = Math.round(mission.reward.xp * xpMultiplier);
  const coinsGained = mission.reward.coins;
  const gemsGained = mission.reward.gems || 0;

  currentUser.currentXp += xpGained;
  currentUser.nexCoins += coinsGained;
  currentUser.quantumGems += gemsGained;
  currentUser.stats.gamesPlayed += 1;
  currentUser.stats.victories += 1;
  currentUser.stats.winRate = Math.round((currentUser.stats.victories / currentUser.stats.gamesPlayed) * 100);

  if (score > currentUser.stats.highScore) {
    currentUser.stats.highScore = score;
  }

  // Check Level up
  let leveledUp = false;
  while (currentUser.currentXp >= currentUser.nextLevelXp) {
    currentUser.level += 1;
    currentUser.currentXp -= currentUser.nextLevelXp;
    currentUser.nextLevelXp = Math.round(currentUser.nextLevelXp * 1.35);
    currentUser.nexCoins += 500; // Level up bonus
    currentUser.lives = currentUser.maxLives; // Restore lives
    leveledUp = true;
  }

  // Check loot drop
  let lootedItem: Item | null = null;
  if (mission.reward.itemLoot) {
    lootedItem = {
      id: `loot_${Date.now()}`,
      name: mission.reward.itemLoot.name,
      category: 'Arme',
      rarity: mission.reward.itemLoot.rarity,
      description: `Objet d'exception obtenu lors de la réussite de : ${mission.title}`,
      valueCoins: mission.reward.itemLoot.rarity === 'Légendaire' ? 1800 : 750,
      icon: mission.reward.itemLoot.icon,
      stats: { attack: 45, speed: 10 },
    };
    currentUser.inventory.push(lootedItem);
  }

  // Update leaderboard
  leaderboard = leaderboard.map((entry: any) => {
    if (entry.isCurrentUser) {
      return {
        ...entry,
        level: currentUser.level,
        score: Math.max(entry.score, currentUser.stats.highScore),
      };
    }
    return entry;
  });

  // Royalty monetization: every mission completed generates gems for the creator
  creatorEarnings.pendingGems += 5;
  creatorEarnings.sessionsPlayed += 1;

  // Sync tournament score if active tournament exists for this mission
  const activeTourn = tournaments.find((t) => t.gameId === missionId || t.gameTitle.includes(mission.title) || mission.title.includes(t.gameTitle));
  if (activeTourn) {
    const userEntryIndex = activeTourn.leaderboard.findIndex((e) => e.userId === currentUser.id);
    if (userEntryIndex !== -1) {
      if (score > activeTourn.leaderboard[userEntryIndex].score) {
        activeTourn.leaderboard[userEntryIndex].score = score;
      }
    } else if (activeTourn.hasJoined) {
      activeTourn.leaderboard.push({
        rank: activeTourn.leaderboard.length + 1,
        userId: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
        score,
        rewardGems: 50,
        isCurrentUser: true,
      });
    }
    // Sort tournament leaderboard
    activeTourn.leaderboard.sort((a, b) => b.score - a.score);
    activeTourn.leaderboard.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });
    activeTourn.userBestScore = Math.max(activeTourn.userBestScore || 0, score);
    const currEntry = activeTourn.leaderboard.find((e) => e.userId === currentUser.id);
    if (currEntry) {
      activeTourn.userRank = currEntry.rank;
    }
  }

  // Add notification
  const notif: AppNotification = {
    id: `notif_${Date.now()}`,
    title: `Victoire : ${mission.title}`,
    message: `+${xpGained} XP | +${coinsGained} NEX Coins${gemsGained ? ` | +${gemsGained} Gemmes` : ''}${
      lootedItem ? ` | Nouveau butin : ${lootedItem.name}` : ''
    }`,
    type: 'reward',
    timestamp: 'À l instant',
    read: false,
  };
  notifications.unshift(notif);

  res.json({
    success: true,
    xpGained,
    coinsGained,
    gemsGained,
    lootedItem,
    leveledUp,
    user: currentUser,
    creatorEarnings,
    tournaments,
  });
});

// Marketplace Buy
app.post('/api/market/buy', (req, res) => {
  const { shopItemId } = req.body;
  const item = shopItems.find((s: any) => s.id === shopItemId);

  if (!item) {
    return res.status(404).json({ error: 'Article introuvable dans la boutique' });
  }

  // Check funds
  if (item.priceType === 'coins' && currentUser.nexCoins < item.price) {
    return res.status(400).json({ error: 'Solde insuffisant en Pièces NEX' });
  }
  if (item.priceType === 'gems' && currentUser.quantumGems < item.price) {
    return res.status(400).json({ error: 'Solde insuffisant en Gemmes Quantiques' });
  }

  // Deduct
  if (item.priceType === 'coins') currentUser.nexCoins -= item.price;
  if (item.priceType === 'gems') currentUser.quantumGems -= item.price;

  // Grant rewards
  if (item.reward.lives) {
    currentUser.lives = Math.min(currentUser.maxLives, currentUser.lives + item.reward.lives);
  }
  if (item.reward.coins) {
    currentUser.nexCoins += item.reward.coins;
  }
  if (item.reward.gems) {
    currentUser.quantumGems += item.reward.gems;
  }
  if (item.reward.isPremiumPass) {
    currentUser.isPremium = true;
    currentUser.premiumExpiresAt = '2026-12-31';
  }
  if (item.reward.item) {
    currentUser.inventory.push({ ...item.reward.item, id: `inv_${Date.now()}` });
  }

  res.json({ success: true, user: currentUser, itemPurchased: item });
});

// Marketplace Sell Item
app.post('/api/market/sell', (req, res) => {
  const { itemId } = req.body;
  const itemIndex = currentUser.inventory.findIndex((i) => i.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Objet non présent dans l inventaire' });
  }

  const item = currentUser.inventory[itemIndex];
  currentUser.inventory.splice(itemIndex, 1);
  const sellValue = Math.round(item.valueCoins * 0.7);
  currentUser.nexCoins += sellValue;

  res.json({ success: true, user: currentUser, coinsEarned: sellValue });
});

// Inventory Equip/Unequip
app.post('/api/inventory/equip', (req, res) => {
  const { itemId } = req.body;
  currentUser.inventory = currentUser.inventory.map((item) => {
    if (item.id === itemId) {
      const willEquip = !item.isEquipped;
      if (item.category === 'Arme') currentUser.equippedWeaponId = willEquip ? item.id : undefined;
      if (item.category === 'Armure') currentUser.equippedArmorId = willEquip ? item.id : undefined;
      return { ...item, isEquipped: willEquip };
    }
    // unequip others in same category
    const target = currentUser.inventory.find((i) => i.id === itemId);
    if (target && item.category === target.category && item.id !== itemId) {
      return { ...item, isEquipped: false };
    }
    return item;
  });

  res.json({ success: true, user: currentUser });
});

// Social Chat send
app.post('/api/social/chat/send', (req, res) => {
  const { text, senderRole } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message vide' });
  }

  const isSenderAdmin = senderRole === 'admin';
  const newMsg = {
    id: `msg_${Date.now()}`,
    senderId: isSenderAdmin ? adminUser.id : currentUser.id,
    senderName: isSenderAdmin ? adminUser.username : currentUser.username,
    senderAvatar: isSenderAdmin ? adminUser.avatarUrl : currentUser.avatarUrl,
    senderRole: isSenderAdmin ? ('admin' as const) : ('player' as const),
    text: text.trim(),
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  };

  chatMessages.push(newMsg);
  res.json({ success: true, message: newMsg });
});

// Social Status Post
app.post('/api/social/status/post', (req, res) => {
  const { text, badge } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Statut vide' });
  }

  const newPost = {
    id: `stat_${Date.now()}`,
    userId: currentUser.id,
    userName: currentUser.username,
    userAvatar: currentUser.avatarUrl,
    text: text.trim(),
    badge: badge || currentUser.stats.rankTier,
    timestamp: 'À l instant',
    likes: 0,
    hasLiked: false,
  };

  statusPosts.unshift(newPost);
  res.json({ success: true, post: newPost });
});

// Social Status Like
app.post('/api/social/status/like', (req, res) => {
  const { statusId } = req.body;
  const post = statusPosts.find((p: any) => p.id === statusId);
  if (post) {
    post.hasLiked = !post.hasLiked;
    post.likes += post.hasLiked ? 1 : -1;
    return res.json({ success: true, post });
  }
  res.status(404).json({ error: 'Statut introuvable' });
});

// Admin: Create Mission
app.post('/api/admin/create-mission', (req, res) => {
  const { title, category, difficulty, maxPlayers, description, xp, coins, gems, playableType } = req.body;

  const newMission: Mission = {
    id: `mis_custom_${Date.now()}`,
    title: title || 'Nouvelle Mission Classifiée',
    category: category || 'Action',
    difficulty: difficulty || 'Moyen',
    maxPlayers: maxPlayers || 1,
    description: description || 'Mission d intervention tactique NEXORA.',
    durationMinutes: 4,
    reward: {
      xp: Number(xp) || 500,
      coins: Number(coins) || 300,
      gems: Number(gems) || 5,
    },
    playableType: playableType || 'runner',
    coverGradient: 'from-amber-600/30 via-slate-800 to-slate-950',
    activePlayersCount: 1,
    isCustom: true,
  };

  missions.unshift(newMission);
  logAudit(adminUser.username, 'CREATION_MISSION', newMission.id, `Mission "${newMission.title}" (${newMission.category}) ajoutée avec succès.`);

  res.json({ success: true, mission: newMission });
});

// Admin: Broadcast notification
app.post('/api/admin/broadcast-notification', (req, res) => {
  const { title, message } = req.body;
  const notif: AppNotification = {
    id: `notif_broadcast_${Date.now()}`,
    title: title || 'Annonce Système NEXORA',
    message: message || 'Message administratif d importance prioritaire.',
    type: 'system',
    timestamp: 'À l instant',
    read: false,
  };

  notifications.unshift(notif);
  logAudit(adminUser.username, 'BROADCAST_PUSH', 'Tous les joueurs', `Notification: "${title}"`);

  res.json({ success: true, notification: notif });
});

// Admin: User Action (warn, ban, block, unban, delete_user, grant_coins, grant_gems)
app.post('/api/admin/user-action', (req, res) => {
  const { action, targetUserId, amount, reason } = req.body;
  const targetName = targetUserId && targetUserId !== currentUser.id ? targetUserId : currentUser.username;

  if (action === 'ban') {
    if (!targetUserId || targetUserId === currentUser.id || targetUserId === currentUser.username) {
      currentUser.status = 'banned';
    }
    logAudit(adminUser.username, 'BAN_DEFINITIF', targetName, reason || 'Bannissement immédiat et révocation des accès arènes.');
  } else if (action === 'block') {
    if (!targetUserId || targetUserId === currentUser.id || targetUserId === currentUser.username) {
      currentUser.status = 'suspended';
    }
    logAudit(adminUser.username, 'BLOCAGE_TEMPORAIRE', targetName, reason || 'Compte suspendu pour 24h suite à signalement.');
  } else if (action === 'warn') {
    if (!targetUserId || targetUserId === currentUser.id || targetUserId === currentUser.username) {
      currentUser.status = 'warned';
      // Push official warning into user notifications
      notifications.unshift({
        id: `notif_warn_${Date.now()}`,
        title: '⚠️ Avertissement de Modération',
        message: reason || 'Votre comportement a fait l objet d un avertissement par un modérateur NEXORA. Veillez au respect des règles de fair-play.',
        type: 'system',
        timestamp: 'À l instant',
        read: false,
      });
    }
    logAudit(adminUser.username, 'AVERTISSEMENT', targetName, reason || 'Notification formelle de rappel au règlement transmise.');
  } else if (action === 'unban') {
    if (!targetUserId || targetUserId === currentUser.id || targetUserId === currentUser.username) {
      currentUser.status = 'active';
    }
    logAudit(adminUser.username, 'DEBANNISSEMENT', targetName, 'Rétablissement complet des droits et accès au jeu.');
  } else if (action === 'delete_user') {
    // Remove from leaderboard or reset
    leaderboard = leaderboard.filter((entry: any) => entry.id !== targetUserId && entry.username !== targetUserId);
    friends = friends.filter((f: any) => f.id !== targetUserId && f.username !== targetUserId);
    if (targetUserId === currentUser.id || targetUserId === currentUser.username) {
      currentUser.status = 'banned';
      currentUser.username = `Supprimé_${Date.now().toString().slice(-4)}`;
    }
    logAudit(adminUser.username, 'SUPPRESSION_COMPTE', targetName, 'Compte et données utilisateur définitivement purgés.');
  } else if (action === 'grant_coins') {
    const val = Number(amount) || 1000;
    currentUser.nexCoins += val;
    logAudit(adminUser.username, 'CREDIT_FONDS_PIECES', currentUser.username, `Octroi exceptionnel de ${val} Pièces NEX.`);
  } else if (action === 'grant_gems') {
    const val = Number(amount) || 50;
    currentUser.quantumGems += val;
    logAudit(adminUser.username, 'CREDIT_FONDS_GEMMES', currentUser.username, `Octroi exceptionnel de ${val} Gemmes Quantiques.`);
  }

  res.json({ success: true, user: currentUser, leaderboard, friends, auditLogs });
});

// Admin: Delete Mission
app.post('/api/admin/delete-mission', (req, res) => {
  const { missionId } = req.body;
  const targetMission = missions.find((m) => m.id === missionId);

  if (!targetMission) {
    return res.status(404).json({ error: 'Mission introuvable' });
  }

  missions = missions.filter((m) => m.id !== missionId);
  logAudit(adminUser.username, 'SUPPRESSION_MISSION', targetMission.title, `Mission retirée du catalogue en direct (${targetMission.category}).`);

  res.json({ success: true, missions, auditLogs });
});

// Admin: Play Console Studio Login (Separate developer portal auth)
app.post('/api/admin/console-login', (req, res) => {
  const { developerEmail, securityKey, organizationId } = req.body;
  
  // Accept standard developer credentials or demo master bypass
  const isValid = 
    !securityKey || 
    securityKey === 'NEXORA-DEV-2026' || 
    securityKey.toLowerCase() === 'admin' || 
    securityKey.length >= 4;

  if (isValid) {
    logAudit(adminUser.username, 'CONNEXION_PLAY_CONSOLE', developerEmail || 'Console Développeur', `Authentification réussie au studio Play Console (Org: ${organizationId || 'NEXORA-STUDIOS-GLOBAL'}).`);
    return res.json({
      success: true,
      developerUser: {
        id: 'dev_lead_01',
        name: 'Alexis V. (Studio Lead Architect)',
        email: developerEmail || 'alexis.nexora.dev@quantum.corp',
        organization: organizationId || 'Quantum Pixel Studios & NEXORA Publishing',
        role: 'Lead Architect & SuperAdmin',
        permissions: ['DEPLOY_PRODUCTION', 'MANAGE_USERS', 'ROLLOUT_RELEASES', 'AUDIT_LOGS'],
      },
    });
  }

  res.status(401).json({ error: 'Clé de sécurité développeur invalide. Utilisez "NEXORA-DEV-2026" ou cliquez sur Accès Rapide.' });
});

// Admin: Deploy New Game via Google Play Console Wizard
app.post('/api/admin/deploy-game', (req, res) => {
  const {
    title,
    packageId,
    shortDescription,
    fullDescription,
    category,
    pegi,
    developerStudio,
    engine,
    engineVersion,
    buildType,
    buildUrl,
    iconUrl,
    bannerUrl,
    screenshots,
    videoTrailerUrl,
    versionName,
    versionCode,
    releaseNotes,
    rolloutStatus,
    rolloutPercent,
    targetRegions,
    monetization,
    supportedControls,
    displayOrientation,
    playableType,
    rewardXp,
    rewardCoins,
    rewardGems,
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Le titre du jeu est obligatoire.' });
  }

  const generatedId = `game_${Date.now()}`;
  const effectivePackage = packageId?.trim() || `com.nexora.games.${title.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  const newGame: DeployedGame = {
    id: generatedId,
    packageId: effectivePackage,
    title: title.trim(),
    shortDescription: shortDescription?.trim() || 'Nouveau jeu déployé via la console NEXORA Play Store.',
    fullDescription: fullDescription?.trim() || 'Expérience de jeu inédite publiée par le studio.',
    category: category || 'Action',
    pegi: pegi || 'PEGI 7',
    developerStudio: developerStudio?.trim() || 'NEXORA Community Studio',
    engine: engine || 'unity',
    engineVersion: engineVersion || 'Moteur WebGL 2.0 / WebAssembly',
    buildType: buildType || 'wasm',
    buildUrl: buildUrl || undefined,
    iconUrl:
      iconUrl ||
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
    bannerUrl:
      bannerUrl ||
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1024&auto=format&fit=crop&q=80',
    screenshots:
      screenshots && screenshots.length > 0
        ? screenshots
        : [
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
          ],
    videoTrailerUrl: videoTrailerUrl || undefined,
    versionName: versionName?.trim() || '1.0.0-prod',
    versionCode: Number(versionCode) || 100,
    releaseNotes: releaseNotes?.trim() || 'Déploiement initial en production sur NEXORA Play Store.',
    rolloutStatus: rolloutStatus || 'production',
    rolloutPercent: Number(rolloutPercent) || 100,
    targetRegions: targetRegions || ['Monde', 'Europe'],
    monetization: monetization || { type: 'free', hasInAppPurchases: false },
    telemetry: {
      activeInstalls: 1450,
      dailyActiveUsers: 390,
      rating: 5.0,
      ratingsCount: 28,
      crashRate: 0.00,
      revenueGenerated: 0,
    },
    supportedControls: supportedControls || ['touch', 'keyboard', 'gamepad'],
    displayOrientation: displayOrientation || 'landscape',
    createdAt: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    integrityVerified: true,
    playableType: playableType || 'runner',
  };

  // Add to deployed games
  deployedGames.unshift(newGame);

  // Also create a playable mission in missions list so gamers can immediately play!
  const companionMission: Mission = {
    id: `mis_deployed_${newGame.id}`,
    title: newGame.title,
    category: newGame.category,
    difficulty: 'Moyen',
    maxPlayers: 1,
    description: `${newGame.shortDescription} [Moteur: ${newGame.engine.toUpperCase()}]`,
    durationMinutes: 4,
    reward: {
      xp: Number(rewardXp) || 500,
      coins: Number(rewardCoins) || 350,
      gems: Number(rewardGems) || 10,
      itemLoot: {
        id: `loot_game_${newGame.id}`,
        name: `Insigne Développeur ${newGame.title}`,
        rarity: 'Légendaire',
        icon: '🎮',
      },
    },
    playableType: (newGame.playableType === 'matrix' ? 'matrix' : 'runner') as any,
    coverGradient: 'from-blue-600/30 via-slate-800 to-slate-950',
    activePlayersCount: 140,
    isCustom: true,
  };
  missions.unshift(companionMission);

  // Push broadcast notification to all players
  const notif: AppNotification = {
    id: `notif_playstore_${Date.now()}`,
    title: `🚀 Nouveau Jeu Déployé : ${newGame.title}`,
    message: `Le jeu (${newGame.engine.toUpperCase()}) vient d'être publié sur NEXORA Play Store ! Lancez la mission et testez-le dès maintenant.`,
    type: 'system',
    timestamp: 'À l instant',
    read: false,
  };
  notifications.unshift(notif);

  logAudit(
    adminUser.username,
    'DEPLOY_GAME_PLAY_STORE',
    newGame.title,
    `Publication Google Play Console réussie. Package: ${newGame.packageId}, Version: ${newGame.versionName}, Moteur: ${newGame.engine}.`
  );

  res.json({
    success: true,
    game: newGame,
    deployedGames,
    missions,
    notifications,
    auditLogs,
  });
});

// Admin: Update Deployed Game status / rollout
app.post('/api/admin/update-game-status', (req, res) => {
  const { gameId, rolloutStatus, rolloutPercent, releaseNotes } = req.body;
  const game = deployedGames.find((g) => g.id === gameId);

  if (!game) {
    return res.status(404).json({ error: 'Jeu introuvable dans le Play Store.' });
  }

  if (rolloutStatus) game.rolloutStatus = rolloutStatus;
  if (rolloutPercent !== undefined) game.rolloutPercent = Number(rolloutPercent);
  if (releaseNotes) game.releaseNotes = releaseNotes;
  game.lastUpdated = new Date().toISOString().split('T')[0];

  logAudit(
    adminUser.username,
    'UPDATE_DIFFUSION_JEU',
    game.title,
    `Mise à jour statut: ${game.rolloutStatus} (${game.rolloutPercent}% rollout).`
  );

  res.json({ success: true, game, deployedGames, auditLogs });
});

// Admin ONLY: Delete / Remove Game from Store ("Seul l administrateur peut retirer un jeu")
app.post('/api/admin/delete-game', (req, res) => {
  const { gameId } = req.body;
  const gameIndex = deployedGames.findIndex((g) => g.id === gameId);

  if (gameIndex === -1) {
    return res.status(404).json({ error: 'Jeu introuvable dans le Play Store.' });
  }

  const deletedGame = deployedGames[gameIndex];
  deployedGames.splice(gameIndex, 1);

  // Also remove companion mission
  missions = missions.filter((m) => m.title !== deletedGame.title && m.id !== `mis_deployed_${deletedGame.id}`);

  logAudit(
    adminUser.username,
    'SUPPRESSION_JEU_PLAY_STORE',
    deletedGame.title,
    `Retrait définitif du jeu "${deletedGame.title}" (${deletedGame.packageId}) du catalogue public par l administrateur.`
  );

  res.json({
    success: true,
    deletedGameId: gameId,
    deployedGames,
    missions,
    auditLogs,
  });
});

// VIP ONLY: Publish Community Game limited by subscription tier
app.post('/api/vip/publish-game', (req, res) => {
  if (!currentUser.isPremium) {
    return res.status(403).json({
      error: 'Accès restreint. Seuls les membres avec un Pass VIP actif peuvent publier des jeux communautaires sur NEXORA.',
    });
  }

  const vipTier = currentUser.vipTier || 'Or';
  const tierQuotas: Record<string, number> = {
    Argent: 1,
    Or: 3,
    Diamant: 5,
  };

  const maxAllowed = tierQuotas[vipTier] || 1;
  const currentCount = currentUser.publishedGamesCount || 0;

  if (currentCount >= maxAllowed) {
    return res.status(403).json({
      error: `Quota atteint (${currentCount}/${maxAllowed} jeux). Votre Pass VIP ${vipTier} autorise un maximum de ${maxAllowed} jeu(x) simultané(s). Améliorez votre formule VIP pour débloquer plus de slots.`,
    });
  }

  const {
    title,
    packageId,
    shortDescription,
    category,
    engine,
    versionName,
    iconUrl,
    bannerUrl,
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Le titre du jeu est obligatoire.' });
  }

  const generatedId = `game_vip_${Date.now()}`;
  const effectivePackage = packageId?.trim() || `com.nexora.vip.${title.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  const newVipGame: DeployedGame = {
    id: generatedId,
    packageId: effectivePackage,
    title: title.trim(),
    shortDescription: shortDescription?.trim() || 'Jeu communautaire créé et soumis par un créateur VIP NEXORA.',
    fullDescription: `Jeu publié par le membre VIP ${currentUser.username} (Pass VIP ${vipTier}).`,
    category: category || 'Action',
    pegi: 'PEGI 7',
    developerStudio: `${currentUser.username} (Studio VIP Indé)`,
    engine: engine || 'unity',
    engineVersion: 'NEXORA Creator Sandbox v2',
    buildType: 'wasm',
    iconUrl:
      iconUrl ||
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
    bannerUrl:
      bannerUrl ||
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1024&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    ],
    versionName: versionName?.trim() || '1.0.0-vip',
    versionCode: 100,
    releaseNotes: `Publication VIP initiale par ${currentUser.username}.`,
    rolloutStatus: 'production',
    rolloutPercent: 100,
    targetRegions: ['Monde'],
    monetization: {
      type: 'free',
      hasInAppPurchases: false,
    },
    telemetry: {
      activeInstalls: 240,
      dailyActiveUsers: 85,
      rating: 5.0,
      ratingsCount: 12,
      crashRate: 0.00,
      revenueGenerated: 0,
    },
    supportedControls: ['touch', 'keyboard'],
    displayOrientation: 'landscape',
    createdAt: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    integrityVerified: true,
    playableType: category === 'Réflexion' ? 'matrix' : 'runner',
    isVipCommunityGame: true,
    submittedBy: currentUser.username,
  };

  deployedGames.unshift(newVipGame);

  // Companion mission for playability
  const companionMission: Mission = {
    id: `mis_deployed_${newVipGame.id}`,
    title: `[VIP] ${newVipGame.title}`,
    category: newVipGame.category,
    difficulty: 'Moyen',
    maxPlayers: 1,
    description: `${newVipGame.shortDescription} (Créé par ${currentUser.username})`,
    durationMinutes: 3,
    reward: {
      xp: 400,
      coins: 250,
      gems: 5,
    },
    playableType: newVipGame.playableType === 'matrix' ? 'matrix' : 'runner',
    coverGradient: 'from-amber-600/30 via-slate-800 to-slate-950',
    activePlayersCount: 65,
    isCustom: true,
  };
  missions.unshift(companionMission);

  // Update user quota
  currentUser.publishedGamesCount = currentCount + 1;

  logAudit(
    currentUser.username,
    'PUBLICATION_JEU_VIP',
    newVipGame.title,
    `Jeu VIP soumis avec succès (Slot ${currentUser.publishedGamesCount}/${maxAllowed} - Tier ${vipTier}).`
  );

  res.json({
    success: true,
    game: newVipGame,
    currentUser,
    deployedGames,
    missions,
    auditLogs,
  });
});

// ==========================================
// GAME REVIEWS & RATINGS ENDPOINTS
// ==========================================
app.post('/api/games/reviews/add', (req, res) => {
  const { gameId, gameTitle, rating, title, comment, tags } = req.body;

  if (!comment || !comment.trim()) {
    return res.status(400).json({ error: 'Le commentaire d avis ne peut pas être vide.' });
  }

  const numRating = Math.max(1, Math.min(5, Number(rating) || 5));

  const newReview: GameReview = {
    id: `rev_${Date.now()}`,
    gameId: gameId || 'mis_01',
    gameTitle: gameTitle || 'Jeu NEXORA',
    authorId: currentUser.id,
    authorName: currentUser.username,
    authorAvatar: currentUser.avatarUrl,
    authorTier: currentUser.vipTier || 'Diamant',
    rating: numRating,
    title: title?.trim() || undefined,
    comment: comment.trim(),
    timestamp: 'À l instant',
    verifiedPlayer: true,
    likes: 0,
    hasLiked: false,
    tags: tags && tags.length > 0 ? tags : ['Avis joueur vérifié'],
  };

  gameReviews.unshift(newReview);

  // Recalculate rating on matching deployed game
  const matchingGame = deployedGames.find(
    (g) => g.id === gameId || (gameTitle && g.title.toLowerCase().includes(gameTitle.toLowerCase()))
  );
  if (matchingGame) {
    const relevantReviews = gameReviews.filter((r) => r.gameId === matchingGame.id || r.gameId === gameId);
    const sum = relevantReviews.reduce((acc, r) => acc + r.rating, 0);
    matchingGame.telemetry.ratingsCount = relevantReviews.length;
    matchingGame.telemetry.rating = Number((sum / relevantReviews.length).toFixed(1));
  }

  // Reward player for providing an authentic review
  currentUser.currentXp += 75;
  currentUser.nexCoins += 50;

  logAudit(
    currentUser.username,
    'AVIS_PUBLIE',
    newReview.gameTitle,
    `Note: ${numRating}/5 étoiles. Titre: "${newReview.title || 'Avis joueur'}".`
  );

  res.json({
    success: true,
    review: newReview,
    gameReviews,
    deployedGames,
    currentUser,
  });
});

app.post('/api/games/reviews/like', (req, res) => {
  const { reviewId } = req.body;
  const review = gameReviews.find((r) => r.id === reviewId);

  if (!review) {
    return res.status(404).json({ error: 'Avis introuvable.' });
  }

  if (review.hasLiked) {
    review.hasLiked = false;
    review.likes = Math.max(0, review.likes - 1);
  } else {
    review.hasLiked = true;
    review.likes += 1;
  }

  res.json({ success: true, review, gameReviews });
});

// ==========================================
// GAME TOURNAMENTS & SEASONS ENDPOINTS
// ==========================================
app.post('/api/tournaments/join', (req, res) => {
  const { tournamentId } = req.body;
  const tournament = tournaments.find((t) => t.id === tournamentId);

  if (!tournament) {
    return res.status(404).json({ error: 'Tournoi introuvable.' });
  }

  if (tournament.hasJoined) {
    return res.json({ success: true, message: 'Déjà inscrit au tournoi.', tournament, tournaments, currentUser });
  }

  if (currentUser.nexCoins < tournament.entryFeeCoins) {
    return res.status(400).json({
      error: `Pièces NEX insuffisantes (${currentUser.nexCoins}/${tournament.entryFeeCoins} requis pour s'inscrire).`,
    });
  }

  currentUser.nexCoins -= tournament.entryFeeCoins;
  tournament.hasJoined = true;
  tournament.prizePoolGems += 25;

  const existingEntry = tournament.leaderboard.find((e) => e.userId === currentUser.id);
  if (!existingEntry) {
    const userScore = currentUser.stats.highScore || 25000;
    tournament.leaderboard.push({
      rank: tournament.leaderboard.length + 1,
      userId: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      score: userScore,
      rewardGems: 50,
      isCurrentUser: true,
    });
    tournament.leaderboard.sort((a, b) => b.score - a.score);
    tournament.leaderboard.forEach((e, idx) => {
      e.rank = idx + 1;
    });
    const found = tournament.leaderboard.find((e) => e.userId === currentUser.id);
    if (found) {
      tournament.userRank = found.rank;
      tournament.userBestScore = found.score;
    }
  }

  logAudit(
    currentUser.username,
    'INSCRIPTION_TOURNOI',
    tournament.title,
    `Frais d'entrée: ${tournament.entryFeeCoins} pièces. Cagnotte totale: ${tournament.prizePoolGems} 💎.`
  );

  res.json({
    success: true,
    tournament,
    tournaments,
    currentUser,
  });
});

// ==========================================
// VIP CREATOR ROYALTIES & PROFILE ENDPOINTS
// ==========================================
app.post('/api/creators/claim-royalties', (_req, res) => {
  if (creatorEarnings.pendingGems <= 0) {
    return res.status(400).json({ error: 'Aucune royalty en attente d encaissement.' });
  }

  const gemsToClaim = creatorEarnings.pendingGems;
  currentUser.quantumGems += gemsToClaim;
  creatorEarnings.totalEarnedGems += gemsToClaim;
  creatorEarnings.pendingGems = 0;

  const payout = {
    id: `pay_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    amountGems: gemsToClaim,
    status: 'complété' as const,
  };
  creatorEarnings.payoutHistory.unshift(payout);

  const notif: AppNotification = {
    id: `notif_royalties_${Date.now()}`,
    title: '💎 Royalties Créateur Encaissées !',
    message: `+${gemsToClaim} Gemmes Quantiques ont été transférées vers votre solde de joueur pour les parties jouées sur vos créations.`,
    type: 'reward',
    timestamp: 'À l instant',
    read: false,
  };
  notifications.unshift(notif);

  logAudit(
    currentUser.username,
    'ENCAISSEMENT_ROYALTIES_VIP',
    currentUser.username,
    `Retrait de ${gemsToClaim} Gemmes Quantiques vers le solde de compte.`
  );

  res.json({
    success: true,
    claimedGems: gemsToClaim,
    currentUser,
    creatorEarnings,
    notifications,
  });
});

app.post('/api/creators/follow', (req, res) => {
  const { creatorId } = req.body;
  const creator = creators.find((c) => c.id === creatorId || c.username === creatorId);

  if (!creator) {
    return res.status(404).json({ error: 'Profil créateur introuvable.' });
  }

  if (creator.isFollowing) {
    creator.isFollowing = false;
    creator.followersCount = Math.max(0, creator.followersCount - 1);
  } else {
    creator.isFollowing = true;
    creator.followersCount += 1;
  }

  res.json({
    success: true,
    creator,
    creators,
  });
});



// User profile public lookup (respects privacyMode)
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  // Check if current user
  if (id === currentUser.id || id === currentUser.username) {
    const currentLb = leaderboard.find((l: any) => l.id === currentUser.id || l.username === currentUser.username);
    return res.json({
      id: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      level: currentUser.level,
      rankTier: currentUser.stats.rankTier,
      rankTitle: currentUser.stats.rankTitle,
      stats: currentUser.stats,
      isOnline: true,
      isPremium: currentUser.isPremium,
      privacyMode: currentUser.privacyMode,
      rankPosition: currentLb ? currentLb.rank : 4,
      rankScore: currentLb ? currentLb.score : currentUser.stats.highScore,
      equippedWeapon: currentUser.inventory.find((i) => i.id === currentUser.equippedWeaponId)?.name,
      equippedArmor: currentUser.inventory.find((i) => i.id === currentUser.equippedArmorId)?.name,
    });
  }

  // Look in friends or leaderboard
  const friend = friends.find((f: any) => f.id === id || f.username === id);
  const lbEntry = leaderboard.find((l: any) => l.id === id || l.username === id);

  const username = friend ? friend.username : lbEntry ? lbEntry.username : id;
  const avatarUrl = friend ? friend.avatarUrl : lbEntry ? lbEntry.avatarUrl : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120';
  const level = friend ? friend.level : lbEntry ? lbEntry.level : 20;
  const rankTier = friend ? friend.rankTier : lbEntry ? lbEntry.rankTier : 'Or';
  const isPremium = lbEntry?.isPremium ?? true;

  // Determine privacy: default public for most players, but Ghost_Rider_X is friends-only and Zack_Pixel is private
  let privacyMode: 'public' | 'friends' | 'private' = 'public';
  if (username === 'Zack_Pixel') privacyMode = 'private';
  if (username === 'Ghost_Rider_X') privacyMode = 'friends';

  const isFriend = !!friend;

  res.json({
    id,
    username,
    avatarUrl,
    level,
    rankTier,
    rankTitle: rankTier === 'Maître' ? 'Seigneur Nova' : rankTier === 'Diamant' ? 'Avant-Garde Stellaire' : 'Champion Astral',
    isOnline: friend ? friend.isOnline : true,
    isPremium,
    privacyMode,
    isFriend,
    rankPosition: lbEntry ? lbEntry.rank : 7,
    rankScore: lbEntry ? lbEntry.score : level * 2100,
    stats: {
      gamesPlayed: Math.round(level * 6.5),
      victories: Math.round(level * 4.2),
      winRate: Math.round(60 + (level % 15)),
      highScore: lbEntry ? lbEntry.score : level * 2100,
    },
    equippedWeapon: 'Katana Plasma Solaire',
    equippedArmor: 'Armure d Éclipse Néo-Tokyo',
  });
});

// AI Assistant Route (Gemini 2.5 Flash)
app.post('/api/ai/assistant', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Question manquante' });
  }

  // System instruction detailing NEXORA platform lore, game mechanics, and tips
  const systemInstruction = `Tu es AURA, l'intelligence artificielle d'assistance officielle de la plateforme de gaming mobile NEXORA.
Tes missions :
1. Guider le joueur avec clarté, bienveillance et dynamisme dans un style moderne, précis et un brin cyberpunk.
2. Expliquer les règles des missions (Action, Réflexion, Course, Stratégie, RPG), les mécaniques de score, les combos et le fonctionnement des lobbies coopératifs à 2 ou 3 joueurs.
3. Conseiller sur la gestion de l'inventaire, le choix des armes plasma, l'armure et l'optimisation des gains d'XP.
4. Expliquer le système économique (Pièces NEX gagnées en jeu, Gemmes Quantiques, Pass VIP Premium, Parrainage).
5. Répondre toujours en français avec des puces claires et des conseils actionnables.

Profil actuel du joueur :
- Nom : ${currentUser.username} (Niveau ${currentUser.level}, Rang ${currentUser.stats.rankTier})
- Pièces NEX : ${currentUser.nexCoins}, Gemmes Quantiques : ${currentUser.quantumGems}, Vies : ${currentUser.lives}/${currentUser.maxLives}
- Statut Premium : ${currentUser.isPremium ? 'VIP Actif' : 'Standard'}
- Arme équipée : ${currentUser.inventory.find((i) => i.id === currentUser.equippedWeaponId)?.name || 'Aucune'}
`;

  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || 'Je suis à votre service pour toute question sur NEXORA.',
        model: 'gemini-2.5-flash',
      });
    } catch (err: any) {
      console.error('Error generating AI response:', err);
      // Fallback below
    }
  }

  // Intelligent contextual fallback when API key is simulated or unavailable
  const p = prompt.toLowerCase();
  let fallbackReply = `Bonjour ${currentUser.username} ! En tant qu'IA tactique de NEXORA, voici mes recommandations :`;

  if (p.includes('xp') || p.includes('niveau') || p.includes('monter')) {
    fallbackReply = `🚀 **Guide d'optimisation d'XP sur NEXORA :**
1. **Missions Héroïques Coop :** Rejoignez une escouade de 2 ou 3 joueurs sur le *Raid Astral* pour remporter jusqu'à 1 200 XP par partie.
2. **Défis Quotidiens :** Validez vos 3 défis du jour pour un bonus cumulé de plus de 1 000 XP et 800 Pièces NEX.
3. **Pass VIP NEXORA :** Le statut Premium applique un multiplicateur permanent de **+50% d'XP** sur toutes vos victoires !`;
  } else if (p.includes('arme') || p.includes('inventaire') || p.includes('katana') || p.includes('loot')) {
    fallbackReply = `⚔️ **Analyse de votre Inventaire :**
- Votre arme principale actuelle est le **${currentUser.inventory.find((i) => i.id === currentUser.equippedWeaponId)?.name || 'Katana Plasma Solaire'}** (+85 Attaque).
- **Conseil tactique :** Pour les boss blindés, équipez le *Railgun Magnétique Vortex* disponible dans la boutique pour percer les défenses d'énergie. N'oubliez pas d'activer votre Élixir Quantique pour doubler vos récompenses !`;
  } else if (p.includes('lobby') || p.includes('ami') || p.includes('multijoueur') || p.includes('vocal')) {
    fallbackReply = `👥 **Multijoueur & Salons Coopératifs :**
- Vous pouvez inviter jusqu'à 2 amis (comme *Valkyrie_99* ou *Ghost_Rider_X*) depuis l'onglet **Amis** ou directement dans la salle d'attente d'une mission.
- Activez la communication vocale (bouton micro) pour synchroniser vos tirs et annoncer les attaques ultimes du Léviathan de l'Ombre !`;
  } else if (p.includes('premium') || p.includes('vip') || p.includes('piece') || p.includes('gemme')) {
    fallbackReply = `👑 **Économie & Statut NEXORA VIP :**
- **Pièces NEX :** S'obtiennent en complétant des missions et en vendant des objets au marché.
- **Gemmes Quantiques :** Monnaie rare pour obtenir les pièces d'équipement de palier Légendaire.
- **Pass VIP (30 Jours) :** Supprime 100% des publicités, octroie le badge doré officiel et donne accès aux salons et tournois exclusifs.`;
  } else {
    fallbackReply = `🤖 **Aide Tactique NEXORA :**
Je peux vous renseigner en direct sur :
- Les stratégies pour réussir les missions **Cyber Dash** et **Quantum Matrix**.
- Les combinaisons d'équipements et armes plasma de votre inventaire.
- L'organisation d'un raid coop à 3 joueurs avec chat vocal.
- La gestion de votre monnaie virtuelle et de votre statut VIP.
Posez-moi simplement votre question !`;
  }

  return res.json({
    reply: fallbackReply,
    model: 'fallback-rules-engine',
  });
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`NEXORA Server running on port ${PORT}`);
  });
}

startServer();
