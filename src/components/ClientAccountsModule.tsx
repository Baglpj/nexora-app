import React from 'react';
import { Building2, ShieldCheck, AlertTriangle, ExternalLink, Mail, Phone } from 'lucide-react';
import { ClientAccount } from '../types/enterprise';
import { INITIAL_CLIENTS } from '../data/mockEnterpriseData';

interface ClientAccountsModuleProps {
  onSelectClientFilter?: (clientName: string) => void;
}

export const ClientAccountsModule: React.FC<ClientAccountsModuleProps> = ({ onSelectClientFilter }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Overview header */}
      <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Répertoire des Comptes Clients Entreprise (B2B)</h2>
          <p className="text-xs text-zinc-400">Suivi des encours financiers, solvabilité et conditions contractuelles</p>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Total Billed Consolidé : <strong className="text-zinc-200">700 000 €</strong>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INITIAL_CLIENTS.map((client) => {
          const hasOverdue = client.openBalance > 25000;
          return (
            <div 
              key={client.id}
              className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm hover:border-zinc-700 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-100">{client.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {client.contractTier}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{client.industry}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/60 text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] block uppercase font-mono">Facturé Cumulé</span>
                  <span className="font-mono font-semibold text-zinc-200">{client.totalBilled.toLocaleString('fr-FR')} €</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block uppercase font-mono">Encours Ouvert</span>
                  <span className={`font-mono font-semibold ${client.openBalance > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
                    {client.openBalance.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Risque de contrepartie</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  client.paymentRisk === 'Faible'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : client.paymentRisk === 'Modéré'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}>
                  {client.paymentRisk}
                </span>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Dernier échange : {client.lastInteraction}</span>
                {onSelectClientFilter && (
                  <button
                    onClick={() => onSelectClientFilter(client.name)}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                  >
                    <span>Factures</span>
                    <ExternalLink className="w-3 h-3" />
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
