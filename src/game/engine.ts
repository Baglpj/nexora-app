import {
  Player,
  Bullet,
  Enemy,
  Particle,
  DropItem,
  FloatingText,
  Star,
  GameStats,
  BossIntel
} from './types';
import { soundFx } from './audio';

export interface GameEngineCallbacks {
  onScoreUpdate?: (score: number, combo: number, wave: number, lives: number, emp: number) => void;
  onBossSpawn?: (intel: BossIntel, enemy: Enemy) => void;
  onGameOver?: (finalStats: GameStats, wave: number, score: number) => void;
  onScreenShake?: (intensity: number) => void;
}

export class GameEngine {
  public width: number = 800;
  public height: number = 600;

  public player: Player;
  public bullets: Bullet[] = [];
  public enemies: Enemy[] = [];
  public particles: Particle[] = [];
  public drops: DropItem[] = [];
  public floatingTexts: FloatingText[] = [];
  public stars: Star[] = [];

  public wave: number = 1;
  public waveTimer: number = 0;
  public enemiesInWaveRemaining: number = 10;
  public isBossActive: boolean = false;
  public bossIntel: BossIntel | null = null;

  public isRunning: boolean = false;
  public isPaused: boolean = false;

  public stats: GameStats = {
    shotsFired: 0,
    shotsHit: 0,
    enemiesKilled: 0,
    maxCombo: 1,
    timeSurvived: 0,
  };

  public empShockwaveActive: boolean = false;
  public empShockwaveRadius: number = 0;

  private callbacks: GameEngineCallbacks = {};
  private inputKeys: Record<string, boolean> = {};
  private lastTime: number = 0;

  constructor(callbacks?: GameEngineCallbacks) {
    if (callbacks) this.callbacks = callbacks;

    this.player = this.createInitialPlayer();
    this.initStars();
  }

  public setCallbacks(callbacks: GameEngineCallbacks) {
    this.callbacks = callbacks;
  }

  public resize(w: number, h: number) {
    this.width = w;
    this.height = h;

    // Keep player within bounds
    if (this.player) {
      this.player.x = Math.max(30, Math.min(this.width - 30, this.player.x));
      this.player.y = Math.max(this.height * 0.4, Math.min(this.height - 40, this.player.y));
    }
  }

  private createInitialPlayer(): Player {
    return {
      x: this.width / 2,
      y: this.height - 80,
      width: 44,
      height: 48,
      speed: 460,
      lives: 3,
      maxLives: 3,
      score: 0,
      combo: 1,
      comboTimer: 0,
      weaponLevel: 1,
      empCharge: 100, // starts fully loaded for immediate thrill
      shieldActive: false,
      shieldTimer: 0,
      invincibilityTimer: 0,
      lastShootTime: 0,
    };
  }

  private initStars() {
    this.stars = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      const layer = Math.random() < 0.3 ? 3 : Math.random() < 0.7 ? 2 : 1;
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: layer === 3 ? 2.5 : layer === 2 ? 1.5 : 1.0,
        speed: layer === 3 ? 120 : layer === 2 ? 65 : 30,
        color: layer === 3 ? '#fde047' : layer === 2 ? '#38bdf8' : '#94a3b8',
        layer,
      });
    }
  }

  public start() {
    this.player = this.createInitialPlayer();
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.drops = [];
    this.floatingTexts = [];
    this.wave = 1;
    this.waveTimer = 0;
    this.enemiesInWaveRemaining = 8;
    this.isBossActive = false;
    this.bossIntel = null;
    this.isRunning = true;
    this.isPaused = false;
    this.stats = {
      shotsFired: 0,
      shotsHit: 0,
      enemiesKilled: 0,
      maxCombo: 1,
      timeSurvived: 0,
    };
    this.lastTime = performance.now();
    this.emitHUDUpdate();
  }

  public pause(state?: boolean) {
    this.isPaused = state !== undefined ? state : !this.isPaused;
  }

  public setInput(key: string, pressed: boolean) {
    this.inputKeys[key.toLowerCase()] = pressed;
  }

  public movePlayerDirect(x: number, y: number) {
    if (!this.isRunning || this.isPaused) return;
    this.player.x = Math.max(25, Math.min(this.width - 25, x));
    this.player.y = Math.max(80, Math.min(this.height - 35, y));
  }

  public triggerEmpBlast(): boolean {
    if (!this.isRunning || this.isPaused || this.player.empCharge < 100) {
      return false;
    }

    this.player.empCharge = 0;
    this.empShockwaveActive = true;
    this.empShockwaveRadius = 20;

    soundFx.playEmpBlast();
    if (this.callbacks.onScreenShake) {
      this.callbacks.onScreenShake(14);
    }

    // Clear all enemy bullets
    this.bullets = this.bullets.filter(b => b.isPlayer);

    // Heavy damage to all enemies on screen
    this.enemies.forEach(enemy => {
      enemy.hp -= 220;
      this.createShockwaveParticles(enemy.x, enemy.y, '#f59e0b', 16);
      this.addFloatingText(enemy.x, enemy.y - 20, 'IEM 220!', '#fbbf24');
    });

    this.addFloatingText(this.player.x, this.player.y - 50, 'ONDE IEM DÉCHAÎNÉE !', '#f59e0b');
    this.emitHUDUpdate();
    return true;
  }

  public update(now: number) {
    if (!this.isRunning || this.isPaused) {
      this.lastTime = now;
      return;
    }

    const dt = Math.min((now - this.lastTime) / 1000, 0.05); // cap delta time to 50ms
    this.lastTime = now;
    this.stats.timeSurvived += dt;

    this.updateStars(dt);
    this.handlePlayerInput(dt);
    this.updatePlayerTimers(dt);
    this.updateBullets(dt);
    this.updateEnemies(dt);
    this.updateDrops(dt);
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);
    this.updateEmpShockwave(dt);
    this.checkCollisions();
    this.manageWaves(dt);

    this.emitHUDUpdate();
  }

  private handlePlayerInput(dt: number) {
    const p = this.player;
    let dx = 0;
    let dy = 0;

    if (this.inputKeys['arrowleft'] || this.inputKeys['a'] || this.inputKeys['q']) dx -= 1;
    if (this.inputKeys['arrowright'] || this.inputKeys['d']) dx += 1;
    if (this.inputKeys['arrowup'] || this.inputKeys['w'] || this.inputKeys['z']) dy -= 1;
    if (this.inputKeys['arrowdown'] || this.inputKeys['s']) dy += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    p.x += dx * p.speed * dt;
    p.y += dy * p.speed * dt;

    // Bounds check
    p.x = Math.max(p.width / 2, Math.min(this.width - p.width / 2, p.x));
    p.y = Math.max(80, Math.min(this.height - p.height / 2, p.y));

    // Player thruster particle trail
    if (Math.random() < 0.85) {
      this.particles.push({
        x: p.x + (Math.random() * 12 - 6),
        y: p.y + p.height / 2,
        vx: (Math.random() * 20 - 10),
        vy: 120 + Math.random() * 100,
        life: 0.28,
        maxLife: 0.28,
        color: Math.random() < 0.6 ? '#f59e0b' : '#38bdf8',
        size: 3.5,
      });
    }

    // Auto-fire or spacebar fire (every 0.16s)
    const canShoot = performance.now() - p.lastShootTime > 150;
    if (canShoot) {
      this.firePlayerBullets();
      p.lastShootTime = performance.now();
    }
  }

  private firePlayerBullets() {
    const p = this.player;
    const lvl = p.weaponLevel;
    const bulletSpeed = -680;

    soundFx.playLaser(lvl);
    this.stats.shotsFired++;

    if (lvl === 1) {
      // Single central high-velocity beam
      this.bullets.push({
        id: Math.random().toString(),
        x: p.x,
        y: p.y - 20,
        vx: 0,
        vy: bulletSpeed,
        radius: 4,
        damage: 35,
        isPlayer: true,
        color: '#fbbf24',
      });
    } else if (lvl === 2) {
      // Twin plasma streams
      [-10, 10].forEach(offset => {
        this.bullets.push({
          id: Math.random().toString(),
          x: p.x + offset,
          y: p.y - 18,
          vx: 0,
          vy: bulletSpeed,
          radius: 4.5,
          damage: 32,
          isPlayer: true,
          color: '#38bdf8',
        });
      });
    } else if (lvl === 3) {
      // Triple radiant spread
      [-14, 0, 14].forEach((offset, idx) => {
        const spreadVx = (idx - 1) * 90;
        this.bullets.push({
          id: Math.random().toString(),
          x: p.x + offset,
          y: p.y - 18,
          vx: spreadVx,
          vy: bulletSpeed,
          radius: 5,
          damage: 36,
          isPlayer: true,
          color: idx === 1 ? '#f59e0b' : '#a855f7',
        });
      });
    } else {
      // Level 4: Quantum Hyper Cannon (5 spread + heavy core)
      [-20, -10, 0, 10, 20].forEach((offset, idx) => {
        const angle = (idx - 2) * 8 * (Math.PI / 180);
        const vx = Math.sin(angle) * Math.abs(bulletSpeed);
        const vy = Math.cos(angle) * bulletSpeed;
        this.bullets.push({
          id: Math.random().toString(),
          x: p.x + offset,
          y: p.y - 20,
          vx,
          vy,
          radius: idx === 2 ? 6.5 : 4.5,
          damage: idx === 2 ? 55 : 32,
          isPlayer: true,
          color: idx === 2 ? '#fbbf24' : '#22d3ee',
        });
      });
    }
  }

  private updatePlayerTimers(dt: number) {
    const p = this.player;

    // Combo timer decay
    if (p.comboTimer > 0) {
      p.comboTimer -= dt;
      if (p.comboTimer <= 0) {
        p.combo = 1;
      }
    }

    // EMP charge auto trickle
    if (p.empCharge < 100) {
      p.empCharge = Math.min(100, p.empCharge + dt * 3.5); // passive trickle + kills charge faster
    }

    // Shield duration
    if (p.shieldActive) {
      p.shieldTimer -= dt;
      if (p.shieldTimer <= 0) {
        p.shieldActive = false;
      }
    }

    // Invincibility frames
    if (p.invincibilityTimer > 0) {
      p.invincibilityTimer -= dt;
    }
  }

  private updateBullets(dt: number) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Despawn off-screen
      if (b.y < -30 || b.y > this.height + 30 || b.x < -30 || b.x > this.width + 30) {
        this.bullets.splice(i, 1);
      }
    }
  }

  private updateEnemies(dt: number) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.age += dt;

      if (e.type === 'swarmer') {
        // Fast sine wave pattern
        e.y += e.vy * dt;
        e.x += Math.sin(e.age * 5) * 110 * dt;
      } else if (e.type === 'phantom') {
        // Lateral strafing + slow descent
        e.y += e.vy * dt;
        e.x += Math.cos(e.age * 2.5) * 80 * dt;

        // Phantom firing targeted bolt
        e.shootTimer += dt;
        if (e.shootTimer >= e.shootCooldown && e.y < this.height - 150) {
          e.shootTimer = 0;
          this.fireEnemyBullet(e.x, e.y + e.height / 2, this.player.x, this.player.y, 220, '#06b6d4');
        }
      } else if (e.type === 'juggernaut') {
        // Steady heavy forward assault
        e.y += e.vy * dt;
        e.shootTimer += dt;
        if (e.shootTimer >= e.shootCooldown && e.y < this.height - 180) {
          e.shootTimer = 0;
          // Triple spread bullet attack
          [-25, 0, 25].forEach(vx => {
            this.bullets.push({
              id: Math.random().toString(),
              x: e.x,
              y: e.y + e.height / 2,
              vx,
              vy: 240,
              radius: 4.5,
              damage: 1,
              isPlayer: false,
              color: '#ec4899',
            });
          });
        }
      } else if (e.type === 'boss') {
        // Boss stays at top quarter, moves horizontally
        e.x += e.vx * dt;
        if (e.x < 100) {
          e.x = 100;
          e.vx = Math.abs(e.vx);
        } else if (e.x > this.width - 100) {
          e.x = this.width - 100;
          e.vx = -Math.abs(e.vx);
        }

        // Descend to y=130 then stay
        if (e.y < 130) {
          e.y += 60 * dt;
        }

        e.shootTimer += dt;
        if (e.shootTimer >= e.shootCooldown) {
          e.shootTimer = 0;
          this.executeBossAttackPattern(e);
        }
      }

      // Check offscreen
      if (e.type !== 'boss' && e.y > this.height + 60) {
        this.enemies.splice(i, 1);
      }
    }
  }

  private fireEnemyBullet(fromX: number, fromY: number, targetX: number, targetY: number, speed: number, color: string) {
    const dx = targetX - fromX;
    const dy = targetY - fromY;
    const dist = Math.hypot(dx, dy) || 1;
    this.bullets.push({
      id: Math.random().toString(),
      x: fromX,
      y: fromY,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      radius: 4,
      damage: 1,
      isPlayer: false,
      color,
    });
  }

  private executeBossAttackPattern(boss: Enemy) {
    // 360-degree radial ring with golden gaps or 5-targeted stream
    const bulletsInRing = 10;
    const offsetAngle = (boss.age * 2) % (Math.PI * 2);

    for (let i = 0; i < bulletsInRing; i++) {
      const angle = offsetAngle + (i * Math.PI * 2) / bulletsInRing;
      this.bullets.push({
        id: Math.random().toString(),
        x: boss.x,
        y: boss.y + 20,
        vx: Math.cos(angle) * 190,
        vy: Math.sin(angle) * 190,
        radius: 5,
        damage: 1,
        isPlayer: false,
        color: '#f59e0b',
      });
    }

    if (this.callbacks.onScreenShake) {
      this.callbacks.onScreenShake(4);
    }
  }

  private updateDrops(dt: number) {
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      d.y += d.vy * dt;
      d.age += dt;

      // Magnetism toward player if close
      const dx = this.player.x - d.x;
      const dy = this.player.y - d.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 140) {
        d.x += (dx / dist) * 220 * dt;
        d.y += (dy / dist) * 220 * dt;
      }

      // Check player collection
      if (dist < this.player.width / 2 + d.radius + 8) {
        this.collectDrop(d);
        this.drops.splice(i, 1);
        continue;
      }

      if (d.y > this.height + 40) {
        this.drops.splice(i, 1);
      }
    }
  }

  private collectDrop(drop: DropItem) {
    const p = this.player;

    if (drop.type === 'gold') {
      soundFx.playPickup('gold');
      const bonus = 150 * p.combo;
      p.score += bonus;
      p.combo = Math.min(10, p.combo + 1);
      p.comboTimer = 5.0; // 5s to sustain combo
      p.empCharge = Math.min(100, p.empCharge + 8);
      if (p.combo > this.stats.maxCombo) this.stats.maxCombo = p.combo;
      this.addFloatingText(drop.x, drop.y, `+${bonus} (x${p.combo})`, '#fbbf24');
    } else if (drop.type === 'shield') {
      soundFx.playPickup('shield');
      p.shieldActive = true;
      p.shieldTimer = 9.0;
      this.addFloatingText(drop.x, drop.y, 'BOUCLIER QUANTIQUE ACTIVÉ', '#38bdf8');
    } else if (drop.type === 'emp') {
      soundFx.playPickup('emp');
      p.empCharge = 100;
      this.addFloatingText(drop.x, drop.y, 'IEM 100% PRÊT !', '#f59e0b');
    } else if (drop.type === 'weapon') {
      soundFx.playPickup('weapon');
      p.weaponLevel = Math.min(4, p.weaponLevel + 1);
      this.addFloatingText(drop.x, drop.y, `ARME NIVEAU ${p.weaponLevel} !`, '#a855f7');
    }

    this.createShockwaveParticles(drop.x, drop.y, drop.type === 'gold' ? '#f59e0b' : '#38bdf8', 12);
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 38 * dt;
      ft.life -= dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private updateEmpShockwave(dt: number) {
    if (this.empShockwaveActive) {
      this.empShockwaveRadius += dt * 900;
      if (this.empShockwaveRadius > Math.max(this.width, this.height) * 1.2) {
        this.empShockwaveActive = false;
        this.empShockwaveRadius = 0;
      }
    }
  }

  private updateStars(dt: number) {
    for (const star of this.stars) {
      star.y += star.speed * dt;
      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
    }
  }

  private checkCollisions() {
    // 1. Player Bullets vs Enemies
    for (let bi = this.bullets.length - 1; bi >= 0; bi--) {
      const b = this.bullets[bi];
      if (!b.isPlayer) continue;

      for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
        const e = this.enemies[ei];
        const hitDist = (e.width + e.height) / 4 + b.radius;
        const dx = b.x - e.x;
        const dy = b.y - e.y;

        if (Math.hypot(dx, dy) < hitDist) {
          // Hit!
          this.stats.shotsHit++;
          e.hp -= b.damage;
          this.bullets.splice(bi, 1);

          this.createHitParticles(b.x, b.y, b.color);

          if (e.hp <= 0) {
            this.destroyEnemy(e, ei);
          }
          break;
        }
      }
    }

    // 2. Enemy Bullets vs Player
    if (this.player.invincibilityTimer <= 0) {
      for (let bi = this.bullets.length - 1; bi >= 0; bi--) {
        const b = this.bullets[bi];
        if (b.isPlayer) continue;

        const dx = b.x - this.player.x;
        const dy = b.y - this.player.y;
        if (Math.hypot(dx, dy) < 18 + b.radius) {
          this.bullets.splice(bi, 1);
          this.handlePlayerDamage();
          break;
        }
      }

      // 3. Enemy body vs Player
      for (const e of this.enemies) {
        const dx = e.x - this.player.x;
        const dy = e.y - this.player.y;
        if (Math.hypot(dx, dy) < (e.width + this.player.width) / 2.6) {
          this.handlePlayerDamage();
          break;
        }
      }
    }
  }

  private handlePlayerDamage() {
    if (this.player.shieldActive) {
      // Shield absorbs hit
      soundFx.playPlayerHit();
      this.player.shieldActive = false;
      this.player.invincibilityTimer = 1.0;
      this.addFloatingText(this.player.x, this.player.y - 30, 'BOUCLIER BRISÉ !', '#38bdf8');
      if (this.callbacks.onScreenShake) this.callbacks.onScreenShake(8);
      return;
    }

    // Direct hit
    this.player.lives -= 1;
    this.player.combo = 1; // reset combo
    this.player.invincibilityTimer = 2.2; // 2.2 seconds of invulnerability with flicker
    soundFx.playPlayerHit();

    if (this.callbacks.onScreenShake) {
      this.callbacks.onScreenShake(15);
    }
    this.createShockwaveParticles(this.player.x, this.player.y, '#ef4444', 24);

    if (this.player.lives <= 0) {
      this.gameOver();
    }
  }

  private destroyEnemy(enemy: Enemy, index: number) {
    this.enemies.splice(index, 1);
    this.stats.enemiesKilled++;
    soundFx.playExplosion(enemy.type === 'boss' || enemy.type === 'juggernaut');

    if (this.callbacks.onScreenShake) {
      this.callbacks.onScreenShake(enemy.type === 'boss' ? 20 : enemy.type === 'juggernaut' ? 9 : 4);
    }

    const earnedScore = enemy.scoreValue * this.player.combo;
    this.player.score += earnedScore;
    this.player.empCharge = Math.min(100, this.player.empCharge + 4);
    this.addFloatingText(enemy.x, enemy.y, `+${earnedScore}`, enemy.type === 'boss' ? '#fbbf24' : '#38bdf8');

    // Explosions FX
    this.createShockwaveParticles(
      enemy.x,
      enemy.y,
      enemy.type === 'boss' ? '#f59e0b' : enemy.type === 'swarmer' ? '#ef4444' : '#38bdf8',
      enemy.type === 'boss' ? 45 : 18
    );

    // Drops calculation
    const dropRoll = Math.random();
    if (enemy.type === 'boss') {
      this.isBossActive = false;
      // Boss always drops weapon matrix and shield
      this.spawnDrop(enemy.x - 30, enemy.y, 'weapon');
      this.spawnDrop(enemy.x + 30, enemy.y, 'shield');
      this.spawnDrop(enemy.x, enemy.y, 'emp');
      this.addFloatingText(this.width / 2, this.height / 2, 'BOSS ÉRADIQUÉ ! SECTEUR SÉCURISÉ', '#f59e0b');
    } else if (dropRoll < 0.28) {
      this.spawnDrop(enemy.x, enemy.y, 'gold');
    } else if (dropRoll < 0.35) {
      this.spawnDrop(enemy.x, enemy.y, 'shield');
    } else if (dropRoll < 0.40) {
      this.spawnDrop(enemy.x, enemy.y, 'emp');
    } else if (dropRoll < 0.45 && this.player.weaponLevel < 4) {
      this.spawnDrop(enemy.x, enemy.y, 'weapon');
    }
  }

  private spawnDrop(x: number, y: number, type: DropItem['type']) {
    this.drops.push({
      id: Math.random().toString(),
      type,
      x,
      y,
      vy: 110,
      radius: 12,
      age: 0,
    });
  }

  private manageWaves(dt: number) {
    if (this.isBossActive) return;

    this.waveTimer += dt;

    // Spawn enemies if wave still has quota and interval passed
    if (this.enemiesInWaveRemaining > 0 && this.waveTimer >= 1.2) {
      this.waveTimer = 0;
      this.spawnWaveUnit();
      this.enemiesInWaveRemaining--;
    }

    // Check if wave cleared
    if (this.enemiesInWaveRemaining <= 0 && this.enemies.length === 0) {
      this.wave += 1;
      this.waveTimer = 0;

      // Boss encounter every 5 waves
      if (this.wave % 5 === 0) {
        this.spawnBoss();
      } else {
        this.enemiesInWaveRemaining = 8 + this.wave * 3;
        this.addFloatingText(this.width / 2, this.height * 0.35, `VAGUE ${this.wave}`, '#fbbf24');
      }
    }
  }

  private spawnWaveUnit() {
    const roll = Math.random();
    const spawnX = Math.random() * (this.width - 120) + 60;

    if (this.wave >= 3 && roll < 0.25) {
      // Quantum Juggernaut
      this.enemies.push({
        id: Math.random().toString(),
        type: 'juggernaut',
        x: spawnX,
        y: -40,
        vx: 0,
        vy: 65,
        width: 52,
        height: 52,
        hp: 160 + this.wave * 30,
        maxHp: 160 + this.wave * 30,
        shootCooldown: 1.8,
        shootTimer: 0,
        scoreValue: 400,
        age: 0,
      });
    } else if (this.wave >= 2 && roll < 0.6) {
      // Neon Phantom
      this.enemies.push({
        id: Math.random().toString(),
        type: 'phantom',
        x: spawnX,
        y: -30,
        vx: 40,
        vy: 95,
        width: 38,
        height: 38,
        hp: 75 + this.wave * 15,
        maxHp: 75 + this.wave * 15,
        shootCooldown: 1.5,
        shootTimer: 0.5,
        scoreValue: 220,
        age: 0,
      });
    } else {
      // Void Swarmer
      this.enemies.push({
        id: Math.random().toString(),
        type: 'swarmer',
        x: spawnX,
        y: -25,
        vx: 0,
        vy: 140 + this.wave * 10,
        width: 32,
        height: 32,
        hp: 35 + this.wave * 10,
        maxHp: 35 + this.wave * 10,
        shootCooldown: 999,
        shootTimer: 0,
        scoreValue: 120,
        age: 0,
      });
    }
  }

  private async spawnBoss() {
    this.isBossActive = true;
    soundFx.playBossAlert();

    const bossHp = 900 + this.wave * 300;
    const bossEnemy: Enemy = {
      id: 'boss-' + this.wave,
      type: 'boss',
      x: this.width / 2,
      y: -80,
      vx: 90,
      vy: 40,
      width: 110,
      height: 90,
      hp: bossHp,
      maxHp: bossHp,
      shootCooldown: 1.2,
      shootTimer: 0,
      scoreValue: 4000,
      age: 0,
    };
    this.enemies.push(bossEnemy);

    // Call Copilot boss generator API (or fallback immediately)
    try {
      const res = await fetch('/api/copilot/boss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wave: this.wave }),
      });
      const data: BossIntel = await res.json();
      this.bossIntel = data;
      if (this.callbacks.onBossSpawn) {
        this.callbacks.onBossSpawn(data, bossEnemy);
      }
    } catch {
      const fallbackIntel: BossIntel = {
        bossName: `DREADNOUGHT NEXUS-Ω${this.wave}`,
        bossTitle: 'Annihilateur de Secteur Cybernétique',
        weakSpot: 'Noyau quantique central lors de la surchauffe',
        specialAbility: 'Barrage radial de sphères néon denses',
        loreSnippet: 'Forgé dans les forges stellaires pour éradiquer les chasseurs d\'or libres.',
        copilotWarning: 'Attention Commandant : son blindage photonique est actif. Restez en bordure !',
        isFallback: true,
      };
      this.bossIntel = fallbackIntel;
      if (this.callbacks.onBossSpawn) {
        this.callbacks.onBossSpawn(fallbackIntel, bossEnemy);
      }
    }
  }

  private gameOver() {
    this.isRunning = false;
    soundFx.playExplosion(true);
    if (this.callbacks.onGameOver) {
      this.callbacks.onGameOver(this.stats, this.wave, this.player.score);
    }
  }

  private createHitParticles(x: number, y: number, color: string) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 160,
        vy: (Math.random() - 0.5) * 160,
        life: 0.18,
        maxLife: 0.18,
        color,
        size: 3,
      });
    }
  }

  private createShockwaveParticles(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 70 + Math.random() * 180;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.45 + Math.random() * 0.25,
        maxLife: 0.7,
        color,
        size: 4.5,
      });
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string) {
    this.floatingTexts.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      life: 1.1,
      maxLife: 1.1,
    });
  }

  private emitHUDUpdate() {
    if (this.callbacks.onScoreUpdate && this.player) {
      this.callbacks.onScoreUpdate(
        this.player.score,
        this.player.combo,
        this.wave,
        this.player.lives,
        this.player.empCharge
      );
    }
  }
}
