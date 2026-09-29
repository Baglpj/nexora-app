import React from 'react';
import { Shield, Zap, Pause, Play, Trophy, Flame } from 'lucide-react';

interface GameHUDProps {
  score: number;
  highScore: number;
  combo: number;
  wave: number;
  lives: number;
  empCharge: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onTriggerEmp: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  highScore,
  combo,
  wave,
  lives,
  empCharge,
  isPaused,
  onTogglePause,
  onTriggerEmp,
}) => {
  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-black/40">
      {/* Left: Brand & Score */}
      <div className="flex items-center gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-amber-400">
              {score.toLocaleString('fr-FR')}
            </span>
            {combo > 1 && (
              <span className="flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm shadow-amber-500/50 animate-bounce">
                <Flame className="w-3 h-3 fill-current" />
                x{combo}
              </span>
            )}
          </div>
        </div>

        {/* High Score record */}
        <div className="hidden sm:block pl-4 border-l border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-500" />
            Record
          </span>
          <span className="text-sm font-mono font-bold text-slate-300">
            {highScore.toLocaleString('fr-FR')}
          </span>
        </div>
      </div>

      {/* Center: Lives & Wave */}
      <div className="flex items-center gap-6">
        {/* Wave indicator */}
        <div className="text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Secteur</span>
          <p className="text-sm sm:text-base font-mono font-bold text-cyan-400">
            Vague {wave}
          </p>
        </div>

        {/* Hull / Lives */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((heartIndex) => (
            <div
              key={heartIndex}
              className={`p-1.5 rounded-lg border transition-all ${
                heartIndex <= lives
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-sm shadow-amber-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-700'
              }`}
            >
              <Shield className={`w-4 h-4 ${heartIndex <= lives ? 'fill-amber-400/40' : ''}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Right: EMP Charge Bar & Pause */}
      <div className="flex items-center gap-3">
        <button
          onClick={onTriggerEmp}
          disabled={empCharge < 100}
          className={`relative group px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-2 ${
            empCharge >= 100
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/40 animate-pulse hover:scale-105 active:scale-95'
              : 'bg-slate-950/60 text-slate-400 border-slate-800'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${empCharge >= 100 ? 'fill-current' : ''}`} />
          <span>IEM [{Math.floor(empCharge)}%]</span>
          {empCharge >= 100 && (
            <span className="hidden md:inline text-[10px] opacity-75 font-normal">
              (ESPACE)
            </span>
          )}
        </button>

        <button
          onClick={onTogglePause}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          title={isPaused ? 'Reprendre' : 'Pause'}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
