import React from 'react';
import { useNexora } from '../../context/NexoraContext';
import { Trophy, Target, Award, Play, ChevronRight, Zap } from 'lucide-react';
import { GameMastery } from '../../types/nexora';

export const GameMasterySection: React.FC = () => {
  const { currentUser, colorMode, startPlayMission, missions, activeThemePreset } = useNexora();

  if (!currentUser) return null;

  const isLight = colorMode === 'light';
  const masteries = currentUser.gameMasteries || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-sm text-slate-100 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Niveaux & Statistiques par Jeu</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Votre progression et rangs indépendants calculés pour chaque jeu
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full border border-slate-700">
          {masteries.length} Jeux Enregistrés
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {masteries.map((m) => {
          const associatedMission = missions.find((item) => item.id === m.gameId);

          return (
            <div
              key={m.gameId}
              className={`p-3.5 rounded-2xl border transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-200 hover:border-amber-300'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header: Badge Icon, Game Title, Category, Level Pill */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl shrink-0">{m.badgeIcon}</span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs truncate text-white">{m.gameTitle}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{m.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className="text-[11px] font-mono font-black px-2 py-0.5 rounded-lg border text-white shadow-sm"
                    style={{
                      backgroundColor: `${activeThemePreset.primaryColor}25`,
                      borderColor: activeThemePreset.primaryColor,
                    }}
                  >
                    Niveau {m.level}
                  </span>
                </div>
              </div>

              {/* Stats Grid: HighScore, Matches, WinRate */}
              <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center font-mono my-2 text-xs">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Record</span>
                  <span className="font-bold text-amber-400">{m.highScore.toLocaleString('fr-FR')}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Parties</span>
                  <span className="font-bold text-slate-200">{m.matchesPlayed}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Victoires</span>
                  <span className="font-bold text-emerald-400">{m.winRate}%</span>
                </div>
              </div>

              {/* Rank and Quick Launch */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Award className="w-3 h-3 text-cyan-400" />
                  <span>Rang : <strong className="text-cyan-300">{m.rankTitle}</strong></span>
                </span>

                {associatedMission && (
                  <button
                    onClick={() => startPlayMission(associatedMission)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-all"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Lancer</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
