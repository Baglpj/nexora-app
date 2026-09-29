import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Send, 
  Download,
  Filter,
  Check
} from 'lucide-react';
import { Invoice, InvoiceStatus } from '../types/enterprise';

interface InvoicingModuleProps {
  invoices: Invoice[];
  onOpenNewInvoiceModal: () => void;
  onSelectInvoice: (invoice: Invoice) => void;
  onSendReminder: (invoice: Invoice) => void;
  onMarkAsPaid: (invoiceId: string) => void;
  searchQuery: string;
}

export const InvoicingModule: React.FC<InvoicingModuleProps> = ({
  invoices,
  onOpenNewInvoiceModal,
  onSelectInvoice,
  onSendReminder,
  onMarkAsPaid,
  searchQuery
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvoiceStatus>('ALL');

  // Filtered invoices
  const filtered = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      inv.invoiceNumber.toLowerCase().includes(query) ||
      inv.clientName.toLowerCase().includes(query) ||
      inv.clientLegalName.toLowerCase().includes(query) ||
      inv.clientEmail.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const totalHT = filtered.reduce((s, i) => s + i.subtotalHT, 0);
  const totalVAT = filtered.reduce((s, i) => s + i.totalVAT, 0);
  const totalTTC = filtered.reduce((s, i) => s + i.totalTTC, 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Action Header & Filtering Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
            {[
              { id: 'ALL', label: `Toutes (${invoices.length})` },
              { id: 'PENDING', label: `En attente (${invoices.filter(i => i.status === 'PENDING').length})` },
              { id: 'OVERDUE', label: `En retard (${invoices.filter(i => i.status === 'OVERDUE').length})` },
              { id: 'PAID', label: `Payées (${invoices.filter(i => i.status === 'PAID').length})` }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setStatusFilter(item.id as any)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  statusFilter === item.id
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* New Invoice Action */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Total Sélectionné</p>
            <p className="text-xs font-semibold font-mono text-zinc-200">{totalTTC.toLocaleString('fr-FR')} € TTC</p>
          </div>
          <button
            onClick={onOpenNewInvoiceModal}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une Facture</span>
          </button>
        </div>
      </div>

      {/* Invoice Data Grid */}
      <div className="rounded-xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 font-mono text-[11px]">
                <th className="py-3 px-4">RÉFÉRENCE</th>
                <th className="py-3 px-4">ENTREPRISE / CLIENT</th>
                <th className="py-3 px-4">DATE D'ÉMISSION</th>
                <th className="py-3 px-4">ÉCHÉANCE</th>
                <th className="py-3 px-4 text-right">TOTAL HT</th>
                <th className="py-3 px-4 text-right">TOTAL TTC</th>
                <th className="py-3 px-4">STATUT</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    Aucune facture ne correspond aux critères sélectionnés.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const isOverdue = inv.status === 'OVERDUE';
                  return (
                    <tr key={inv.id} className="hover:bg-zinc-850/40 transition-colors group">
                      <td className="py-3.5 px-4 font-mono font-medium text-zinc-200">
                        <button
                          onClick={() => onSelectInvoice(inv)}
                          className="hover:text-blue-400 flex items-center gap-2 group-hover:underline text-left"
                        >
                          <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>{inv.invoiceNumber}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-zinc-200">{inv.clientName}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{inv.clientVatId || 'TVA non renseignée'}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-400">
                        {inv.issueDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className={isOverdue ? 'text-rose-400 font-semibold' : 'text-zinc-400'}>
                          {inv.dueDate}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-zinc-300 tabular-nums">
                        {inv.subtotalHT.toLocaleString('fr-FR')} €
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-zinc-100 tabular-nums">
                        {inv.totalTTC.toLocaleString('fr-FR')} €
                      </td>
                      <td className="py-3.5 px-4">
                        {inv.status === 'PAID' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Payée
                          </span>
                        )}
                        {inv.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            En attente
                          </span>
                        )}
                        {inv.status === 'OVERDUE' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            <AlertTriangle className="w-3 h-3" />
                            En retard
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.status !== 'PAID' && (
                            <button
                              onClick={() => onMarkAsPaid(inv.id)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600/30 text-zinc-400 hover:text-emerald-300 border border-zinc-700/60 hover:border-emerald-500/40 transition-colors"
                              title="Marquer comme payée"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isOverdue && (
                            <button
                              onClick={() => onSendReminder(inv)}
                              className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-medium flex items-center gap-1 transition-colors"
                              title="Envoyer relance client par email"
                            >
                              <Send className="w-3 h-3" />
                              <span className="hidden sm:inline">Relancer</span>
                            </button>
                          )}
                          <button
                            onClick={() => onSelectInvoice(inv)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                            title="Aperçu & Impression PDF"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
          <span>{filtered.length} factures répertoriées</span>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Total HT : <strong className="text-zinc-200">{totalHT.toLocaleString('fr-FR')} €</strong></span>
            <span>TVA : <strong className="text-zinc-200">{totalVAT.toLocaleString('fr-FR')} €</strong></span>
            <span className="text-sm font-bold text-white">Total TTC : {totalTTC.toLocaleString('fr-FR')} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};
