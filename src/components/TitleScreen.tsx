import React from 'react';
import { Play, Sparkles, Zap, Shield, Crosshair, Award, Bot, Rocket } from 'lucide-react';

interface TitleScreenProps {
  highScore: number;
  onStartGame: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ highScore, onStartGame }) => {
  return (
    <div className="relative w-full min-h-[580px] flex flex-col items-center justify-center p-6 bg-slate-950/90 rounded-3xl border border-amber-500/30 shadow-2xl shadow-amber-950/40 text-center overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Futuristic Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold mb-6">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        ARCADE 60 FPS • ASSISTANCE IA GEMINI 2.5 ACTIVE
      </div>

      {/* Game Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 drop-shadow-[0_0_35px_rgba(245,158,11,0.4)] mb-3">
        CYBERGOLD
      </h1>
      <p className="text-sm sm:text-base font-mono text-cyan-400 tracking-widest uppercase font-bold mb-8">
        Neon Arcade Odyssey
      </p>

      {/* Main Start Button */}
      <button
        onClick={onStartGame}
        className="group relative px-8 py-4 rounded-2xl font-mono text-base font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-2xl shadow-amber-500/40 flex items-center justify-center gap-3 border border-amber-200 transition-all cursor-pointer hover:scale-105 active:scale-95 mb-8"
      >
        <Rocket className="w-5 h-5 text-slate-950 group-hover:-translate-y-0.5 transition-transform" />
        LANCER LA PARTIE
      </button>

      {/* High score callout */}
      {highScore > 0 && (
        <div className="mb-8 font-mono text-xs text-slate-400 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Record Actuel : <span className="text-amber-300 font-bold">{highScore.toLocaleString('fr-FR')} PTS</span>
        </div>
      )}

      {/* Controls & Features cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl w-full text-left font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-1.5">
            <Crosshair className="w-4 h-4" />
            Commandes
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Flèches ou ZQSD pour bouger. Déplacement automatique ou glisser à la souris / tactile.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1.5">
            <Zap className="w-4 h-4" />
            Onde IEM
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Touche <strong>Espace</strong> pour libérer l'impulsion qui détruit tous les tirs ennemis à l'écran.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1.5">
            <Bot className="w-4 h-4" />
            Copilote IA NOVA
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Consultez NOVA pour obtenir des directives stratégiques adaptées à votre niveau en direct.
          </p>
        </div>
      </div>
    </div>
  );
};
