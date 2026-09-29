import React, { useRef, useEffect, useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import { Mission } from '../types/nexora';
import { Zap, Shield, Trophy, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';

interface CyberDashGameProps {
  mission: Mission;
  onExit: () => void;
}

export const CyberDashGame: React.FC<CyberDashGameProps> = ({ mission, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { finishMission, currentUser, showToast } = useNexora();

  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [coinsCollected, setCoinsCollected] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [shieldHp, setShieldHp] = useState<number>(3);
  const [empReady, setEmpReady] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [victory, setVictory] = useState<boolean>(false);
  const [endRewards, setEndRewards] = useState<any>(null);

  // Game internal state ref so RAF loop has zero lag
  const stateRef = useRef({
    lane: 1, // 0 = left, 1 = center, 2 = right
    targetX: 200,
    currentX: 200,
    speed: 7,
    distance: 0,
    targetDistance: 1500, // Finish line at 1500m
    score: 0,
    coins: 0,
    combo: 1,
    shieldHp: 3,
    empReady: true,
    lastObstacleTime: 0,
    obstacles: [] as { x: number; y: number; width: number; height: number; type: 'laser' | 'drone'; lane: number }[],
    pickups: [] as { x: number; y: number; radius: number; type: 'coin' | 'crystal' | 'nitro'; lane: number; collected: boolean }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string }[],
    isPaused: false,
    keys: { left: false, right: false, emp: false },
  });

  const triggerEmp = () => {
    const s = stateRef.current;
    if (!s.empReady || gameOver || victory) return;
    s.empReady = false;
    setEmpReady(false);

    // Vaporize all obstacles on screen and create explosion particles
    s.obstacles.forEach((obs) => {
      for (let i = 0; i < 15; i++) {
        s.particles.push({
          x: obs.x + obs.width / 2,
          y: obs.y + obs.height / 2,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 0,
          maxLife: 25,
          color: '#38bdf8',
        });
      }
    });
    s.obstacles = [];
    s.score += 500;
    setScore(s.score);
    showToast('💥 DÉCHARGE IEM ACTIVÉE : Piste sécurisée !');

    setTimeout(() => {
      s.empReady = true;
      setEmpReady(true);
    }, 12000);
  };

  const moveLane = (dir: 'left' | 'right') => {
    const s = stateRef.current;
    if (gameOver || victory) return;
    if (dir === 'left' && s.lane > 0) {
      s.lane -= 1;
    } else if (dir === 'right' && s.lane < 2) {
      s.lane += 1;
    }
  };

  const handleGameEnd = async (isWin: boolean) => {
    stateRef.current.isPaused = true;
    const finalScore = stateRef.current.score;
    if (isWin) {
      setVictory(true);
      const res = await finishMission(mission.id, finalScore);
      setEndRewards(res);
    } else {
      setGameOver(true);
      const res = await finishMission(mission.id, Math.round(finalScore * 0.5));
      setEndRewards(res);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const laneXs = [80, 200, 320]; // 3 lanes for width 400

    // Key handlers
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') {
        moveLane('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveLane('right');
      } else if (e.key === ' ' || e.key === 'e' || e.key === 'E') {
        triggerEmp();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(32, now - lastTime) / 1000;
      lastTime = now;

      const s = stateRef.current;
      if (!s.isPaused) {
        // Update distance & speed
        s.distance += s.speed * 2.5 * dt * 10;
        s.score += Math.round(10 * s.combo * dt * 10);
        setDistance(Math.min(s.targetDistance, Math.round(s.distance)));
        setScore(s.score);

        // Check victory
        if (s.distance >= s.targetDistance && !victory) {
          handleGameEnd(true);
          return;
        }

        // Smooth ship lane movement
        s.targetX = laneXs[s.lane];
        s.currentX += (s.targetX - s.currentX) * 12 * dt;

        // Spawn obstacles
        if (now - s.lastObstacleTime > 1400) {
          s.lastObstacleTime = now;
          const obsLane = Math.floor(Math.random() * 3);
          const isLaser = Math.random() > 0.4;
          s.obstacles.push({
            x: laneXs[obsLane] - 25,
            y: -60,
            width: 50,
            height: isLaser ? 20 : 40,
            type: isLaser ? 'laser' : 'drone',
            lane: obsLane,
          });

          // Also maybe spawn coin in other lane
          const pickupLane = (obsLane + 1 + Math.floor(Math.random() * 2)) % 3;
          s.pickups.push({
            x: laneXs[pickupLane],
            y: -60,
            radius: 12,
            type: Math.random() > 0.3 ? 'coin' : 'crystal',
            lane: pickupLane,
            collected: false,
          });
        }

        // Move and collide obstacles
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.y += s.speed * 50 * dt;

          // Check collision with ship (ship is at y=520, radius 24)
          const shipY = 520;
          if (
            Math.abs(s.currentX - (obs.x + obs.width / 2)) < 30 &&
            Math.abs(shipY - (obs.y + obs.height / 2)) < 30
          ) {
            // Collision hit!
            s.shieldHp -= 1;
            setShieldHp(s.shieldHp);
            s.combo = 1;
            setCombo(1);

            // Hit particles
            for (let p = 0; p < 20; p++) {
              s.particles.push({
                x: s.currentX,
                y: shipY,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 0,
                maxLife: 30,
                color: '#f43f5e',
              });
            }

            s.obstacles.splice(i, 1);

            if (s.shieldHp <= 0) {
              handleGameEnd(false);
              return;
            }
            continue;
          }

          if (obs.y > 660) {
            s.obstacles.splice(i, 1);
          }
        }

        // Move pickups
        for (let j = s.pickups.length - 1; j >= 0; j--) {
          const p = s.pickups[j];
          p.y += s.speed * 50 * dt;

          const shipY = 520;
          if (!p.collected && Math.abs(s.currentX - p.x) < 26 && Math.abs(shipY - p.y) < 30) {
            p.collected = true;
            s.coins += 1;
            s.score += p.type === 'crystal' ? 250 : 100;
            s.combo = Math.min(5, s.combo + 0.2);
            setCoinsCollected(s.coins);
            setCombo(Math.round(s.combo * 10) / 10);

            // Pickup sparkle particles
            for (let k = 0; k < 12; k++) {
              s.particles.push({
                x: p.x,
                y: p.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 0,
                maxLife: 20,
                color: p.type === 'crystal' ? '#06b6d4' : '#fbbf24',
              });
            }

            s.pickups.splice(j, 1);
            continue;
          }

          if (p.y > 660) {
            s.pickups.splice(j, 1);
          }
        }

        // Update particles
        for (let k = s.particles.length - 1; k >= 0; k--) {
          const pt = s.particles[k];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life += 1;
          if (pt.life >= pt.maxLife) {
            s.particles.splice(k, 1);
          }
        }
      }

      // RENDER
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, 400, 600);

      // Cyber Grid & Perspective road
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;

      // Lane dividers
      ctx.setLineDash([20, 15]);
      ctx.lineDashOffset = -(s.distance % 35);
      [140, 260].forEach((lx) => {
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, 600);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Road Borders glowing cyan
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(20, 600);
      ctx.moveTo(380, 0);
      ctx.lineTo(380, 600);
      ctx.stroke();
      ctx.restore();

      // Pickups render
      s.pickups.forEach((p) => {
        ctx.save();
        if (p.type === 'crystal') {
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - 12);
          ctx.lineTo(p.x + 10, p.y);
          ctx.lineTo(p.x, p.y + 12);
          ctx.lineTo(p.x - 10, p.y);
          ctx.closePath();
          ctx.fill();
        } else {
          // Gold coin
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#92400e';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('N', p.x, p.y);
        }
        ctx.restore();
      });

      // Obstacles render
      s.obstacles.forEach((obs) => {
        ctx.save();
        if (obs.type === 'laser') {
          ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 14;
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          // Glowing core
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x + 5, obs.y + obs.height / 2 - 2, obs.width - 10, 4);
        } else {
          // Drone
          ctx.fillStyle = '#e11d48';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#111827';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Particles render
      s.particles.forEach((pt) => {
        ctx.save();
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = 1 - pt.life / pt.maxLife;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Player Ship render (Golden Cyber Interceptor)
      const shipY = 520;
      ctx.save();
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#f59e0b';

      // Thruster trail
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(s.currentX - 10, shipY + 22);
      ctx.lineTo(s.currentX, shipY + 36 + Math.random() * 8);
      ctx.lineTo(s.currentX + 10, shipY + 22);
      ctx.fill();

      // Wing geometry
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(s.currentX, shipY - 26);
      ctx.lineTo(s.currentX + 26, shipY + 20);
      ctx.lineTo(s.currentX + 14, shipY + 16);
      ctx.lineTo(s.currentX, shipY + 8);
      ctx.lineTo(s.currentX - 14, shipY + 16);
      ctx.lineTo(s.currentX - 26, shipY + 20);
      ctx.closePath();
      ctx.fill();

      // Cockpit gem
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(s.currentX, shipY - 6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Shield sphere if HP > 1
      if (s.shieldHp > 1) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.3 + (s.shieldHp / 3) * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.currentX, shipY - 2, 34, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mission, gameOver, victory]);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* HUD Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex items-center justify-between z-10 shrink-0">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-100 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Quitter
        </button>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score.toLocaleString()} PTS</span>
          </div>

          <div className="flex items-center gap-1 text-cyan-300">
            <span>🪙 {coinsCollected}</span>
          </div>

          <div className="flex items-center gap-1 text-rose-400">
            <Shield className="w-3.5 h-3.5" />
            <span>x{shieldHp}</span>
          </div>
        </div>

        {/* Distance completion pill */}
        <div className="text-[11px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
          {distance} / 1500m
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="flex-1 flex items-center justify-center relative bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          className="w-full h-full max-w-[400px] max-h-[600px] object-contain shadow-2xl"
        />

        {/* Victory / Defeat Overlay */}
        {(victory || gameOver) && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-20 text-center animate-fade-in">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
              victory ? 'bg-amber-500/20 text-amber-400 border border-amber-400' : 'bg-rose-500/20 text-rose-400 border border-rose-400'
            }`}>
              {victory ? <Trophy className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
            </div>

            <h2 className="text-xl font-black tracking-wide text-white mb-1">
              {victory ? 'MISSION ACCOMPLIE !' : 'SIGNAL ÉNERGÉTIQUE PERDU'}
            </h2>
            <p className="text-xs text-slate-400 mb-4 max-w-xs">
              {victory
                ? 'Vous avez franchi la ligne d arrivée et sécurisé les données de la matrice.'
                : 'Votre bouclier cinétique a cédé face aux lasers ennemis.'}
            </p>

            {endRewards && (
              <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Score final</span>
                  <span className="font-mono font-bold text-amber-300">{score.toLocaleString()} pts</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Gain d XP</span>
                  <span className="font-mono font-bold text-emerald-400">+{endRewards.xpGained} XP</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Pièces NEX</span>
                  <span className="font-mono font-bold text-amber-400">+{endRewards.coinsGained} 🪙</span>
                </div>
                {endRewards.lootedItem && (
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2 text-left bg-amber-500/10 p-2 rounded border border-amber-500/30">
                    <span className="text-lg">{endRewards.lootedItem.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-amber-300 text-[11px]">{endRewards.lootedItem.name}</span>
                      <span className="text-[10px] text-amber-400/80 font-mono">Loot {endRewards.lootedItem.rarity}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onExit}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Retour au QG
              </button>
              <button
                onClick={() => {
                  setGameOver(false);
                  setVictory(false);
                  stateRef.current.distance = 0;
                  stateRef.current.score = 0;
                  stateRef.current.coins = 0;
                  stateRef.current.shieldHp = 3;
                  stateRef.current.isPaused = false;
                  setShieldHp(3);
                  setScore(0);
                  setDistance(0);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black tracking-wider transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Rejouer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On-Screen Touch Controls (Mobile Friendly) */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 select-none">
        {/* Left / Right arrows */}
        <div className="flex items-center gap-2">
          <button
            onPointerDown={() => moveLane('left')}
            className="w-14 h-12 rounded-xl bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-lg shadow-md transition-transform active:scale-95"
          >
            ◀
          </button>
          <button
            onPointerDown={() => moveLane('right')}
            className="w-14 h-12 rounded-xl bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-lg shadow-md transition-transform active:scale-95"
          >
            ▶
          </button>
        </div>

        <div className="text-center">
          <span className="text-[10px] text-slate-400 block font-mono">COMBO</span>
          <span className="text-sm font-black text-amber-400 font-mono">x{combo}</span>
        </div>

        {/* EMP shockwave button */}
        <button
          onClick={triggerEmp}
          disabled={!empReady || gameOver || victory}
          className={`px-4 h-12 rounded-xl border flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all shadow-md ${
            empReady
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 hover:bg-cyan-400 active:scale-95 shadow-cyan-500/30'
              : 'bg-slate-800/60 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>IEM</span>
        </button>
      </div>
    </div>
  );
};
