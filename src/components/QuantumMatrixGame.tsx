import React, { useState, useEffect } from 'react';
import { useNexora } from '../context/NexoraContext';
import { Mission } from '../types/nexora';
import { ArrowLeft, Cpu, Trophy, Sparkles, Check, AlertTriangle, RotateCcw } from 'lucide-react';

interface QuantumMatrixGameProps {
  mission: Mission;
  onExit: () => void;
}

export const QuantumMatrixGame: React.FC<QuantumMatrixGameProps> = ({ mission, onExit }) => {
  const { finishMission } = useNexora();

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeLight, setActiveLight] = useState<number | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [targetRounds] = useState<number>(5);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [gameFailed, setGameFailed] = useState<boolean>(false);
  const [endRewards, setEndRewards] = useState<any>(null);

  const colors = [
    { id: 0, label: 'ALPHA', color: 'bg-cyan-500', glow: 'shadow-cyan-500/50', border: 'border-cyan-400' },
    { id: 1, label: 'BETA', color: 'bg-amber-500', glow: 'shadow-amber-500/50', border: 'border-amber-400' },
    { id: 2, label: 'GAMMA', color: 'bg-emerald-500', glow: 'shadow-emerald-500/50', border: 'border-emerald-400' },
    { id: 3, label: 'DELTA', color: 'bg-purple-500', glow: 'shadow-purple-500/50', border: 'border-purple-400' },
  ];

  // Start new round
  const generateNextStep = (prevSeq: number[]) => {
    const nextRandom = Math.floor(Math.random() * 4);
    const newSeq = [...prevSeq, nextRandom];
    setSequence(newSeq);
    setPlayerInput([]);
    playSequence(newSeq);
  };

  const playSequence = (seq: number[]) => {
    setIsShowingSequence(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index >= seq.length) {
        clearInterval(interval);
        setActiveLight(null);
        setIsShowingSequence(false);
        return;
      }
      setActiveLight(seq[index]);
      setTimeout(() => {
        setActiveLight(null);
      }, 400);
      index++;
    }, 700);
  };

  const startNewGame = () => {
    setGameWon(false);
    setGameFailed(false);
    setCurrentRound(1);
    setScore(0);
    setTimeLeft(35);
    setEndRewards(null);
    const initial = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    setSequence(initial);
    setPlayerInput([]);
    setTimeout(() => playSequence(initial), 500);
  };

  useEffect(() => {
    startNewGame();
  }, [mission]);

  // Timer countdown
  useEffect(() => {
    if (gameWon || gameFailed) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleFailure();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameWon, gameFailed]);

  const handleTileClick = async (tileId: number) => {
    if (isShowingSequence || gameWon || gameFailed) return;

    setActiveLight(tileId);
    setTimeout(() => setActiveLight(null), 250);

    const nextInput = [...playerInput, tileId];
    setPlayerInput(nextInput);

    const stepIndex = nextInput.length - 1;
    if (tileId !== sequence[stepIndex]) {
      // Wrong node!
      handleFailure();
      return;
    }

    // Correct node!
    const newScore = score + 200;
    setScore(newScore);

    if (nextInput.length === sequence.length) {
      // Round completed!
      if (currentRound >= targetRounds) {
        handleVictory(newScore);
      } else {
        setCurrentRound((r) => r + 1);
        setTimeout(() => {
          generateNextStep(sequence);
        }, 800);
      }
    }
  };

  const handleVictory = async (finalScore: number) => {
    setGameWon(true);
    const res = await finishMission(mission.id, finalScore + timeLeft * 50);
    setEndRewards(res);
  };

  const handleFailure = async () => {
    setGameFailed(true);
    const res = await finishMission(mission.id, Math.round(score * 0.4));
    setEndRewards(res);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Quitter
        </button>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-amber-400 font-bold">
            PALIER {currentRound} / {targetRounds}
          </div>
          <div className="text-cyan-400 font-bold">
            SCORE : {score}
          </div>
          <div className={`font-bold px-2 py-0.5 rounded border ${
            timeLeft < 10 ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-200'
          }`}>
            ⏱️ {timeLeft}s
          </div>
        </div>
      </div>

      {/* Main Matrix Board */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5" /> DÉCRYPTAGE QUANTIQUE
          </div>
          <h2 className="text-sm text-slate-300 font-medium">
            {isShowingSequence ? 'Mémorisez la séquence du noyau...' : 'Reproduisez les impulsions lumineuses !'}
          </h2>
        </div>

        {/* 4 Quadrants Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[320px] aspect-square">
          {colors.map((node) => {
            const isActive = activeLight === node.id;
            return (
              <button
                key={node.id}
                onClick={() => handleTileClick(node.id)}
                disabled={isShowingSequence || gameWon || gameFailed}
                className={`relative rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-150 transform select-none ${
                  isActive
                    ? `${node.color} ${node.glow} shadow-2xl scale-105 border-white text-slate-950`
                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-slate-700 active:scale-95'
                }`}
              >
                <div className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center font-mono font-black text-xs ${
                  isActive ? 'bg-white text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
                }`}>
                  0{node.id + 1}
                </div>
                <span className="font-mono text-xs font-bold tracking-widest">{node.label}</span>
              </button>
            );
          })}
        </div>

        {/* Success / Failure Screen */}
        {(gameWon || gameFailed) && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
              gameWon ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400' : 'bg-rose-500/20 text-rose-400 border border-rose-400'
            }`}>
              {gameWon ? <Trophy className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>

            <h3 className="text-lg font-black text-white mb-1">
              {gameWon ? 'MATRICE PIRATÉE AVEC SUCCÈS !' : 'ÉCHEC DE LA DÉSYNCHRONISATION'}
            </h3>
            <p className="text-xs text-slate-400 mb-4 max-w-xs">
              {gameWon
                ? 'Les clés de sécurité du noyau ont été extraites avec succès.'
                : 'La séquence s est interrompue avant la fin du décryptage.'}
            </p>

            {endRewards && (
              <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Score final</span>
                  <span className="font-mono font-bold text-amber-300">{score} pts</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Gain d XP</span>
                  <span className="font-mono font-bold text-emerald-400">+{endRewards.xpGained} XP</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Pièces NEX</span>
                  <span className="font-mono font-bold text-amber-400">+{endRewards.coinsGained} 🪙</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onExit}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Retour aux missions
              </button>
              <button
                onClick={startNewGame}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Réessayer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
