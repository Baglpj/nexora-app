import React, { useEffect, useState } from 'react';
import { GameStats, BattleDebrief } from '../game/types';
import { Trophy, RotateCcw, Target, Shield, Award, Sparkles, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  wave: number;
  stats: GameStats;
  highScore: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  wave,
  stats,
  highScore,
  onRestart,
}) => {
  const [debrief, setDebrief] = useState<BattleDebrief | null>(null);
  const [loadingDebrief, setLoadingDebrief] = useState<boolean>(true);
  const isNewHighScore = score > highScore && score > 0;

  useEffect(() => {
    let isMounted = true;
    const fetchDebrief = async () => {
      setLoadingDebrief(true);
      const accuracy = stats.shotsFired > 0 ? Math.round((stats.shotsHit / stats.shotsFired) * 100) : 0;
      try {
        const res = await fetch('/api/copilot/debrief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            finalScore: score,
            waveReached: wave,
            enemiesKilled: stats.enemiesKilled,
            accuracy,
            playDurationSeconds: Math.round(stats.timeSurvived),
          }),
        });
        const data = await res.json();
        if (isMounted) {
          setDebrief(data);
          setLoadingDebrief(false);
        }
      } catch {
        if (isMounted) {
          setDebrief({
            rank: score > 5000 ? 'COMMANDANT CYBER (RANG A)' : 'PILOTE CADET (RANG B)',
            debriefMessage: 'Excellente combativité dans le secteur d\'essai. Les données télémétriques ont été analysées.',
            strengths: 'Réflexes d\'esquive précis face aux escadrons denses',
            improvement: 'Optimisez l\'utilisation de l\'onde IEM lorsque l\'écran est saturé.',
            honorTitle: 'Vanguard de l\'Arène',
            isFallback: true,
          });
          setLoadingDebrief(false);
        }
      }
    };

    fetchDebrief();
    return () => {
      isMounted = false;
    };
  }, [score, wave, stats]);

  const accuracy = stats.shotsFired > 0 ? Math.round((stats.shotsHit / stats.shotsFired) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/40 text-center">
        {/* Record Badge */}
        {isNewHighScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-mono text-xs font-black uppercase tracking-wider mb-3 animate-pulse">
            <Trophy className="w-3.5 h-3.5" />
            Nouveau Record Personnel !
          </div>
        )}

        <h2 className="text-3xl font-black font-mono tracking-tight text-white mb-1">
          FIN DE MISSION
        </h2>
        <p className="text-xs font-mono text-slate-400 mb-6">
          Rapport télémétrique de combat stellaire CyberGold
        </p>

        {/* Score Counter */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 mb-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Score Final</span>
          <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-amber-400">
            {score.toLocaleString('fr-FR')}
          </div>
          <div className="mt-1 text-xs font-mono text-slate-400">
            Meilleur score : <span className="text-amber-300 font-bold">{Math.max(score, highScore).toLocaleString('fr-FR')}</span>
          </div>
        </div>

        {/* AI Debrief Card */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-left mb-6 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" />
              Débriefing NOVA (Gemini AI)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
              {debrief?.rank || 'ANALYSE EN COURS...'}
            </span>
          </div>

          {loadingDebrief ? (
            <div className="py-4 text-center text-slate-400 animate-pulse">
              Synthèse de vos performances par l'IA...
            </div>
          ) : (
            <>
              <p className="font-sans italic text-slate-300 text-xs sm:text-sm leading-relaxed">
                « {debrief?.debriefMessage} »
              </p>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span><strong>Point fort :</strong> {debrief?.strengths}</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  <span><strong>Axe d'amélioration :</strong> {debrief?.improvement}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Flight Stats grid */}
        <div className="grid grid-cols-4 gap-2 mb-6 font-mono text-center">
          <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Secteur</span>
            <p className="text-base font-bold text-amber-400">{wave}</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Kills</span>
            <p className="text-base font-bold text-cyan-400">{stats.enemiesKilled}</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Précision</span>
            <p className="text-base font-bold text-emerald-400">{accuracy}%</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Combo Max</span>
            <p className="text-base font-bold text-amber-300">x{stats.maxCombo}</p>
          </div>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full py-3.5 px-6 rounded-2xl font-mono text-sm font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 border border-amber-200 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <RotateCcw className="w-5 h-5" />
          RELANCER UNE MISSION
        </button>
      </div>
    </div>
  );
};
