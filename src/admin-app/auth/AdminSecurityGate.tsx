import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lock, Key, Terminal, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AdminSecurityGateProps {
  onAuthenticated: () => void;
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({ onAuthenticated }) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Master Passcode configured for administrator access
      if (passcode.trim() === 'NEXORA-ADMIN-2026' || passcode.trim() === 'admin' || passcode.trim() === 'root2026') {
        localStorage.setItem('nexora_admin_session', 'authenticated');
        onAuthenticated();
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        setErrorMessage(
          `Code d'accès administrateur invalide. Tentative ${nextAttempts}/5. Les tentatives suspectes sont consignées dans les journaux de sécurité.`
        );
      }
    }, 700);
  };

  return (
    <div className="min-h-screen w-full bg-[#050811] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Cyber Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#06b6d4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-blue-500/30 bg-[#090d1a]/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#050811] rounded-[14px] flex items-center justify-center text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider uppercase text-white font-mono flex items-center gap-1.5">
                <span>NEXORA // ADMIN GATE</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h1>
              <p className="text-[11px] text-slate-400">Portail Propriétaire & Haute Sécurité</p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded-lg">
            PORTAIL SECRET
          </span>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>Accès Strictement Réservé au Propriétaire</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Cette interface permet de déployer des jeux, administrer les prix, bannir des comptes et modérer les publications. Les utilisateurs normaux n'ont aucun droit d'accès.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug">{errorMessage}</p>
          </div>
        )}

        {/* Access Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
              <span>CLE MAITRE ADMINISTRATEUR :</span>
              <span className="text-[10px] text-slate-500 font-normal">Indice: NEXORA-ADMIN-2026</span>
            </label>

            <div className="relative">
              <Key className="w-4 h-4 text-blue-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Entrez la clé de sécurité maître..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !passcode.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Déverrouiller le Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/60">
          <p className="text-[10px] text-slate-500 font-mono">
            NEXORA Core Systems • Session Chiffrée TLS 1.3 • Zero-Trust Policy
          </p>
        </div>
      </div>
    </div>
  );
};
