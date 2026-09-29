import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../game/engine';
import { Zap, Volume2, VolumeX, Shield, Play, RotateCcw } from 'lucide-react';
import { soundFx } from '../game/audio';

interface ArcadeCanvasProps {
  engine: GameEngine;
  onEmpTrigger: () => void;
  screenShake: number;
}

export const ArcadeCanvas: React.FC<ArcadeCanvasProps> = ({
  engine,
  onEmpTrigger,
  screenShake,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);

  // Resize canvas to container
  const handleResize = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;

    const w = container.clientWidth;
    const h = container.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    engine.resize(w, h);
  }, [engine]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (time: number) => {
      engine.update(time);

      // Rendering pass
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Clear & Screen shake
      ctx.clearRect(0, 0, w, h);
      if (screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * screenShake * 1.5;
        const shakeY = (Math.random() - 0.5) * screenShake * 1.5;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Cyber Starfield & Deep Space Background
      drawBackground(ctx, w, h, engine);

      // 2. EMP Shockwave Ring
      if (engine.empShockwaveActive) {
        drawEmpRing(ctx, engine);
      }

      // 3. Drop Items
      drawDrops(ctx, engine);

      // 4. Bullets
      drawBullets(ctx, engine);

      // 5. Enemies & Boss
      drawEnemies(ctx, engine);

      // 6. Player Ship
      if (engine.player && engine.isRunning) {
        drawPlayer(ctx, engine);
      }

      // 7. Particles
      drawParticles(ctx, engine);

      // 8. Floating Texts
      drawFloatingTexts(ctx, engine);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [engine, screenShake]);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      engine.setInput(e.key, true);
      if (e.code === 'Space' && !e.repeat) {
        onEmpTrigger();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      engine.setInput(e.key, false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [engine, onEmpTrigger]);

  // Mouse / Pointer Controls
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!engine.isRunning || engine.isPaused) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    engine.movePlayerDirect(x, y);
    setTouchPos({ x, y });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!engine.isRunning) return;
    handlePointerMove(e);
  };

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[520px] bg-slate-950 rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl shadow-amber-950/20 select-none flex flex-col"
    >
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        className="w-full h-full cursor-crosshair touch-none"
      />

      {/* Floating Canvas Quick Controls (Sound, Pause, EMP) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleSound}
          className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors"
          title={isMuted ? 'Activer le son' : 'Couper le son'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile / Touch Action Bar at bottom */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none md:hidden">
        <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur border border-amber-500/20 text-xs font-mono text-amber-300">
          Glissez pour piloter
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEmpTrigger();
          }}
          disabled={engine.player?.empCharge < 100}
          className={`pointer-events-auto px-4 py-2.5 rounded-xl font-bold font-mono text-xs flex items-center gap-2 border transition-all ${
            engine.player?.empCharge >= 100
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/50 animate-pulse'
              : 'bg-slate-900/80 text-slate-400 border-slate-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          IEM ({Math.floor(engine.player?.empCharge || 0)}%)
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   CANVAS DRAWING HELPERS
========================================================================= */

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, engine: GameEngine) {
  // Deep space subtle gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#020617');
  grad.addColorStop(0.5, '#050b1a');
  grad.addColorStop(1, '#090d16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle cyber grid lines at bottom
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Draw Stars
  for (const star of engine.stars) {
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEmpRing(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  const p = engine.player;
  const r = engine.empShockwaveRadius;

  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 6;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 25;
  ctx.stroke();

  // Outer secondary cyan glow ring
  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.max(0, r - 15), 0, Math.PI * 2);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  const p = engine.player;

  // Flicker when invulnerable
  if (p.invincibilityTimer > 0 && Math.floor(performance.now() / 80) % 2 === 0) {
    return;
  }

  ctx.save();
  ctx.translate(p.x, p.y);

  // Electromagnetic shield bubble
  if (p.shieldActive) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.stroke();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.fill();
    ctx.restore();
  }

  // Golden Cyber Interceptor geometry
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 14;

  // Wings
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(24, 18);
  ctx.lineTo(12, 12);
  ctx.lineTo(0, 18);
  ctx.lineTo(-12, 12);
  ctx.lineTo(-24, 18);
  ctx.closePath();
  ctx.fill();

  // Golden hull plate
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(12, 10);
  ctx.lineTo(0, 4);
  ctx.lineTo(-12, 10);
  ctx.closePath();
  ctx.fill();

  // Cockpit canopy (neon cyan)
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(0, -4, 4, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Twin plasma wing cannons
  ctx.fillStyle = '#fde047';
  ctx.fillRect(-18, 2, 3, 10);
  ctx.fillRect(15, 2, 3, 10);

  ctx.restore();
}

function drawEnemies(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  for (const e of engine.enemies) {
    ctx.save();
    ctx.translate(e.x, e.y);

    if (e.type === 'swarmer') {
      // Crimson agile dart
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#dc2626';

      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.lineTo(14, -14);
      ctx.lineTo(0, -6);
      ctx.lineTo(-14, -14);
      ctx.closePath();
      ctx.fill();

      // Glowing crimson core
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

    } else if (e.type === 'phantom') {
      // Electric cyan phantom
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#0891b2';

      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.lineTo(18, -4);
      ctx.lineTo(8, -16);
      ctx.lineTo(0, -8);
      ctx.lineTo(-8, -16);
      ctx.lineTo(-18, -4);
      ctx.closePath();
      ctx.fill();

      // Dual cyan thrusters
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.arc(0, -2, 5, 0, Math.PI * 2);
      ctx.fill();

    } else if (e.type === 'juggernaut') {
      // Heavy purple/gold dreadnought
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#6b21a8';

      // Heavy octagon hull
      ctx.beginPath();
      ctx.moveTo(-22, -18);
      ctx.lineTo(22, -18);
      ctx.lineTo(26, 12);
      ctx.lineTo(0, 26);
      ctx.lineTo(-26, 12);
      ctx.closePath();
      ctx.fill();

      // Golden armor trim
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Central core pulsing
      const pulse = 6 + Math.sin(e.age * 6) * 2;
      ctx.fillStyle = '#e879f9';
      ctx.beginPath();
      ctx.arc(0, 2, pulse, 0, Math.PI * 2);
      ctx.fill();

      // Health bar above heavy unit
      const hpRatio = e.hp / e.maxHp;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(-22, -26, 44, 4);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(-22, -26, 44 * hpRatio, 4);

    } else if (e.type === 'boss') {
      // Colossal Boss Leviathan
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 24;

      // Outer Mecha Chassis
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;

      ctx.beginPath();
      ctx.moveTo(-52, -35);
      ctx.lineTo(52, -35);
      ctx.lineTo(44, 25);
      ctx.lineTo(18, 42);
      ctx.lineTo(0, 48);
      ctx.lineTo(-18, 42);
      ctx.lineTo(-44, 25);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Flanking Heavy Cannons
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-48, 5, 12, 30);
      ctx.fillRect(36, 5, 12, 30);

      // Central Quantum Core (Pulsing Weak Spot)
      const corePulse = 14 + Math.sin(e.age * 8) * 3;
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 6, corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Overhead Dynamic Boss Health Bar
      const hpRatio = Math.max(0, e.hp / e.maxHp);
      ctx.restore(); // reset translate to draw health bar consistently at top of screen

      ctx.save();
      const barWidth = 320;
      const barX = engine.width / 2 - barWidth / 2;
      const barY = 28;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(barX - 4, barY - 4, barWidth + 8, 16);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(barX - 4, barY - 4, barWidth + 8, 16);

      const hpGradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
      hpGradient.addColorStop(0, '#f59e0b');
      hpGradient.addColorStop(1, '#ef4444');
      ctx.fillStyle = hpGradient;
      ctx.fillRect(barX, barY, barWidth * hpRatio, 8);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${engine.bossIntel?.bossName || 'BOSS MECHA-LEVIATHAN'} [${Math.ceil(hpRatio * 100)}%]`,
        engine.width / 2,
        barY - 8
      );
      ctx.restore();
      return;
    }

    ctx.restore();
  }
}

function drawBullets(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  for (const b of engine.bullets) {
    ctx.save();
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = b.color;

    ctx.beginPath();
    if (b.isPlayer) {
      // Sleek oblong plasma bolt
      ctx.ellipse(b.x, b.y, b.radius * 0.7, b.radius * 1.8, 0, 0, Math.PI * 2);
    } else {
      // Hostile spherical energy orb
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }
}

function drawDrops(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  for (const d of engine.drops) {
    ctx.save();
    ctx.translate(d.x, d.y);

    const pulse = 1 + Math.sin(d.age * 6) * 0.15;
    ctx.scale(pulse, pulse);

    if (d.type === 'gold') {
      // Golden Cybershard
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(9, 0);
      ctx.lineTo(0, 12);
      ctx.lineTo(-9, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

    } else if (d.type === 'shield') {
      // Shield sphere
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 2;
      ctx.stroke();

    } else if (d.type === 'emp') {
      // EMP charge battery
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-7, -9, 14, 18);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-4, -6, 8, 12);

    } else if (d.type === 'weapon') {
      // Weapon upgrade matrix
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#9333ea';
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(10, 10);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  for (const p of engine.particles) {
    ctx.save();
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawFloatingTexts(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  for (const ft of engine.floatingTexts) {
    ctx.save();
    const alpha = Math.max(0, ft.life / ft.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = ft.color;
    ctx.shadowColor = ft.color;
    ctx.shadowBlur = 8;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }
}
