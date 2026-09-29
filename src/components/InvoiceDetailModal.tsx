import React from 'react';
import { X, Printer, Download, CheckCircle2, AlertTriangle, Clock, Building2 } from 'lucide-react';
import { Invoice } from '../types/enterprise';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onMarkAsPaid: (id: string) => void;
  onSendReminder: (invoice: Invoice) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onMarkAsPaid,
  onSendReminder
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
        {/* Top Modal Action Bar */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-zinc-400">FACTURE OFFICIELLE</span>
            <span className="font-mono text-sm font-bold text-white">{invoice.invoiceNumber}</span>
            {invoice.status === 'PAID' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                RÉGLÉE
              </span>
            )}
            {invoice.status === 'OVERDUE' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                EN RETARD DE PAIEMENT
              </span>
            )}
            {invoice.status === 'PENDING' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                EN COURS
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {invoice.status !== 'PAID' && (
              <button
                onClick={() => onMarkAsPaid(invoice.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
              >
                Valider l'encaissement
              </button>
            )}
            {invoice.status === 'OVERDUE' && (
              <button
                onClick={() => onSendReminder(invoice)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors"
              >
                Relancer le client
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet (Clean Paper Layout) */}
        <div className="p-8 sm:p-12 bg-white text-zinc-900 font-sans print-sheet">
          {/* Header Issuer & Client Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pb-8 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold tracking-tight text-zinc-950">NEXUS TECHNOLOGIES</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Nexus Financial Technologies SAS<br />
                Capital social : 100 000,00 €<br />
                48 Rue la Boétie, 75008 Paris, France<br />
                RCS Paris B 892 411 902 • APE 6201Z<br />
                N° TVA : FR 42 892411902
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs uppercase font-mono font-semibold tracking-wider text-blue-600">Facture Destinataire</span>
              <h2 className="text-base font-bold text-zinc-950 mt-1">{invoice.clientName}</h2>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                {invoice.clientLegalName}<br />
                {invoice.clientVatId ? `TVA : ${invoice.clientVatId}` : 'Réf Client Entreprise'}<br />
                À l'attention de : {invoice.clientContact}<br />
                Email : {invoice.clientEmail}
              </p>
            </div>
          </div>

          {/* Invoice Metadata Reference Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-zinc-200 text-xs">
            <div>
              <span className="text-zinc-500 font-medium">Numéro de Facture</span>
              <p className="font-mono font-bold text-zinc-950 mt-0.5">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <span className="text-zinc-500 font-medium">Date d'émission</span>
              <p className="font-mono font-semibold text-zinc-950 mt-0.5">{invoice.issueDate}</p>
            </div>
            <div>
              <span className="text-zinc-500 font-medium">Date d'échéance</span>
              <p className="font-mono font-semibold text-zinc-950 mt-0.5">{invoice.dueDate}</p>
            </div>
            <div>
              <span className="text-zinc-500 font-medium">Mode de règlement</span>
              <p className="font-medium text-zinc-950 mt-0.5">{invoice.paymentMethod}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mt-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-zinc-950 text-zinc-700 font-bold font-mono">
                  <th className="py-2.5">DÉSIGNATION DE LA PRESTATION</th>
                  <th className="py-2.5 text-center">QTÉ</th>
                  <th className="py-2.5 text-right">PRIX UNITAIRE HT</th>
                  <th className="py-2.5 text-center">TVA</th>
                  <th className="py-2.5 text-right">MONTANT HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {invoice.items.map((item, index) => (
                  <tr key={item.id || index} className="py-3">
                    <td className="py-3 font-medium text-zinc-900 pr-4">
                      {item.description}
                    </td>
                    <td className="py-3 text-center font-mono text-zinc-700">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right font-mono text-zinc-700">
                      {item.unitPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </td>
                    <td className="py-3 text-center font-mono text-zinc-700">
                      {item.vatRate}%
                    </td>
                    <td className="py-3 text-right font-mono font-semibold text-zinc-950">
                      {item.totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Financial Breakdown */}
          <div className="mt-6 pt-4 border-t border-zinc-200 flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Total Hors Taxes (HT)</span>
                <span className="font-mono font-medium text-zinc-900">{invoice.subtotalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>TVA Collectée (20,00%)</span>
                <span className="font-mono font-medium text-zinc-900">{invoice.totalVAT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-950">
                <span>NET À PAYER (TTC)</span>
                <span className="font-mono text-base text-blue-700">{invoice.totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
            </div>
          </div>

          {/* Payment Details & Bank Coordinates */}
          <div className="mt-8 p-4 rounded-lg bg-zinc-50 border border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-zinc-900 uppercase tracking-wide text-[10px] font-mono">Coordonnées Bancaires SEPA</p>
              <div className="mt-1 space-y-0.5 text-zinc-700 font-mono text-[11px]">
                <p>IBAN : <strong>FR76 3000 4001 2300 0123 4567 890</strong></p>
                <p>BIC : <strong>BNPAFRPPXXX</strong></p>
                <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Banque : BNP Paribas Banque Entreprises Paris Étoile</p>
              </div>
            </div>
            <div>
              <p className="font-bold text-zinc-900 uppercase tracking-wide text-[10px] font-mono">Conditions Légales</p>
              <p className="mt-1 text-[11px] text-zinc-600 leading-snug">
                Paiement à échéance au {invoice.dueDate}. En cas de retard de paiement, pénalité de 3 fois le taux d'intérêt légal en vigueur + indemnité forfaitaire de compensation de 40 € (art. D. 441-5 C. com).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
