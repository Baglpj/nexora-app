import React, { useState, useEffect } from 'react';
import { TacticalAdvice, GameStats } from '../game/types';
import { Bot, Radio, ShieldAlert, Cpu, Sparkles, AlertTriangle, Crosshair, ChevronRight, RefreshCw } from 'lucide-react';

interface CopilotPanelProps {
  advice: TacticalAdvice | null;
  isLoading: boolean;
  onRequestAdvice: () => void;
  stats: GameStats;
  wave: number;
  score: number;
  lives: number;
  weaponLevel: number;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  advice,
  isLoading,
  onRequestAdvice,
  stats,
  wave,
  score,
  lives,
  weaponLevel,
}) => {
  const [waveformBars, setWaveformBars] = useState<number[]>([40, 65, 85, 30, 95, 60, 45, 75, 50, 90]);

  // Animate audio waveform bars when active
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveformBars(bars =>
        bars.map(() => Math.floor(Math.random() * 70 + 20))
      );
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const getThreatColor = (level?: string) => {
    switch (level) {
      case 'LÉTHAL':
        return 'text-red-400 bg-red-950/40 border-red-500/50 shadow-red-500/20';
      case 'CRITIQUE':
        return 'text-rose-400 bg-rose-950/40 border-rose-500/50 shadow-rose-500/20';
      case 'MODÉRÉ':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/50 shadow-amber-500/20';
      default:
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/50 shadow-emerald-500/20';
    }
  };

  const weaponNames = [
    'Laser Doré Linéaire',
    'Double Plasma Véloce',
    'Triple Radiant Éventail',
    'Canon Hyper Quantique',
  ];

  return (
    <div className="w-full flex flex-col bg-slate-900/90 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-xl shadow-amber-950/30 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-b border-amber-500/20">
        <div className="flex items-center gap-2.5">
          <div className="relative p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-300">
                NOVA // COPILOTE TACTIQUE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                GEMINI 2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              Liaison télémétrique en continu
            </p>
          </div>
        </div>

        {/* Dynamic Threat Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-sm flex items-center gap-1.5 ${getThreatColor(
            advice?.threatLevel
          )}`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          {advice?.threatLevel || 'MODÉRÉ'}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 space-y-4">
        {/* Animated Holo Waveform & Status */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center gap-1.5 h-6">
            {waveformBars.map((height, i) => (
              <span
                key={i}
                style={{ height: `${height}%` }}
                className="w-1 bg-gradient-to-t from-amber-500 to-cyan-400 rounded-full transition-all duration-100"
              />
            ))}
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400">Armement actuel</span>
            <p className="text-xs font-mono font-bold text-amber-300">
              Niv. {weaponLevel} • {weaponNames[weaponLevel - 1] || 'Plasma'}
            </p>
          </div>
        </div>

        {/* Directive & Radio Transmission */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              {advice?.directiveName || 'DIRECTIVE 01: ANALYSE INITIALE'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-slate-200 text-xs sm:text-sm leading-relaxed relative">
            <p className="font-sans italic">
              « {advice?.transmission || 'Commandant, l\'ordinateur de bord synchronise les senseurs orbitaux. Préparez-vous à l\'interception.'} »
            </p>

            {advice?.tacticalTip && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-start gap-2 text-xs text-amber-300/90 font-mono">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-amber-300">Conseil :</strong> {advice.tacticalTip}</span>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Immediate Action Callout */}
        {advice?.recommendedAction && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              Action préconisée :
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 uppercase">
              {advice.recommendedAction}
            </span>
          </div>
        )}

        {/* Live Flight Telemetry quick chips */}
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Vague</span>
            <p className="text-sm font-bold text-amber-400">{wave}</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Kills</span>
            <p className="text-sm font-bold text-cyan-400">{stats.enemiesKilled}</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Précision</span>
            <p className="text-sm font-bold text-emerald-400">
              {stats.shotsFired > 0 ? Math.round((stats.shotsHit / stats.shotsFired) * 100) : 100}%
            </p>
          </div>
        </div>

        {/* Action Button: Ask NOVA */}
        <button
          onClick={onRequestAdvice}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              Calcul de la directive Gemini...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              Consulter l'IA Tactique (Gemini)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
