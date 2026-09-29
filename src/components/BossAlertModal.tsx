import React, { useEffect } from 'react';
import { BossIntel } from '../game/types';
import { AlertOctagon, Skull, ShieldAlert, Target, Zap, Swords } from 'lucide-react';

interface BossAlertModalProps {
  intel: BossIntel | null;
  onDismiss: () => void;
}

export const BossAlertModal: React.FC<BossAlertModalProps> = ({ intel, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!intel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full bg-slate-950 border-2 border-red-500/80 rounded-2xl p-6 shadow-2xl shadow-red-950/60 overflow-hidden text-center">
        {/* Pulsing top warning banner */}
        <div className="flex items-center justify-center gap-2 text-red-500 font-mono text-xs font-black tracking-widest uppercase mb-4 animate-pulse">
          <AlertOctagon className="w-5 h-5" />
          ALERTE ROUGE // MENACE DE CLASSE OMEGA
          <AlertOctagon className="w-5 h-5" />
        </div>

        {/* Boss Icon & Identity */}
        <div className="inline-flex p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-400 mb-3">
          <Skull className="w-12 h-12 animate-bounce" />
        </div>

        <h2 className="text-2xl font-black font-mono tracking-tight text-white mb-1">
          {intel.bossName}
        </h2>
        <p className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider mb-4">
          {intel.bossTitle}
        </p>

        {/* Tactical Intel box */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-left space-y-2.5 mb-5 font-mono text-xs">
          <div className="flex items-start gap-2 text-slate-300">
            <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-amber-400 font-bold">Point Faible :</span>{' '}
              {intel.weakSpot}
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-300">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-cyan-400 font-bold">Attaque Spéciale :</span>{' '}
              {intel.specialAbility}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-start gap-2 text-emerald-300 italic text-[11px]">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-emerald-400 font-bold not-italic">Avertissement NOVA :</span>{' '}
              « {intel.copilotWarning} »
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onDismiss}
          className="w-full py-3 px-6 rounded-xl font-mono text-sm font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-600/40 flex items-center justify-center gap-2 border border-red-400 transition-all cursor-pointer"
        >
          <Swords className="w-4 h-4" />
          ENGAGER LE COMBAT !
        </button>
      </div>
    </div>
  );
};
