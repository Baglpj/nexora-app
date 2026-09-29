export type EnemyType = 'swarmer' | 'phantom' | 'juggernaut' | 'boss';

export type DropType = 'gold' | 'shield' | 'emp' | 'weapon';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  lives: number;
  maxLives: number;
  score: number;
  combo: number;
  comboTimer: number;
  weaponLevel: number;
  empCharge: number;      // 0 to 100
  shieldActive: boolean;
  shieldTimer: number;
  invincibilityTimer: number;
  lastShootTime: number;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  isPlayer: boolean;
  color: string;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  shootCooldown: number;
  shootTimer: number;
  scoreValue: number;
  age: number;
  bossPhase?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface DropItem {
  id: string;
  type: DropType;
  x: number;
  y: number;
  vy: number;
  radius: number;
  age: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  layer: number;
}

export interface BossIntel {
  bossName: string;
  bossTitle: string;
  weakSpot: string;
  specialAbility: string;
  loreSnippet: string;
  copilotWarning: string;
  isFallback?: boolean;
}

export interface TacticalAdvice {
  directiveName: string;
  transmission: string;
  tacticalTip: string;
  threatLevel: 'FAIBLE' | 'MODÉRÉ' | 'CRITIQUE' | 'LÉTHAL';
  recommendedAction: string;
  isFallback?: boolean;
}

export interface BattleDebrief {
  rank: string;
  debriefMessage: string;
  strengths: string;
  improvement: string;
  honorTitle: string;
  isFallback?: boolean;
}

export interface GameStats {
  shotsFired: number;
  shotsHit: number;
  enemiesKilled: number;
  maxCombo: number;
  timeSurvived: number; // in seconds
}
