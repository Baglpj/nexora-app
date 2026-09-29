import React, { useState } from 'react';
import { X, Plus, Trash2, Calculator, Building2 } from 'lucide-react';
import { Invoice, InvoiceItem } from '../types/enterprise';
import { INITIAL_CLIENTS } from '../data/mockEnterpriseData';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveInvoice: (newInvoice: Invoice) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSaveInvoice
}) => {
  if (!isOpen) return null;

  const [selectedClientId, setSelectedClientId] = useState(INITIAL_CLIENTS[0].id);
  const [customClientName, setCustomClientName] = useState(INITIAL_CLIENTS[0].name);
  const [clientLegalName, setClientLegalName] = useState('Capgemini France SAS — SIREN 330 703 844');
  const [clientVatId, setClientVatId] = useState('FR 23 330703844');
  const [clientContact, setClientContact] = useState('Élodie Laurent (Directrice Achats)');
  const [clientEmail, setClientEmail] = useState('elodie.laurent@capgemini.com');
  const [dueDateDays, setDueDateDays] = useState('30');
  const [paymentMethod, setPaymentMethod] = useState('Virement SEPA B2B (30 jours net)');
  const [notes, setNotes] = useState('Prestation exécutée conformément au cahier des charges validé.');

  const [items, setItems] = useState<Array<Omit<InvoiceItem, 'id'> & { tempId: string }>>([
    { tempId: '1', description: 'Souscription Plateforme Nexus Enterprise (Licence Q4)', quantity: 1, unitPrice: 15000, vatRate: 20, totalHT: 15000 },
    { tempId: '2', description: 'Accompagnement technique & support dédié 24/7', quantity: 2, unitPrice: 2500, vatRate: 20, totalHT: 5000 }
  ]);

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const found = INITIAL_CLIENTS.find(c => c.id === clientId);
    if (found) {
      setCustomClientName(found.name);
      setClientLegalName(`${found.name} SA — SIREN 812 400 120`);
      setClientContact(`Responsable Achats (${found.industry})`);
      setClientEmail(`comptabilite@${found.name.toLowerCase().replace(/[^a-z]/g, '')}.fr`);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        tempId: Date.now().toString(),
        description: 'Prestation de conseil ou service additionnel',
        quantity: 1,
        unitPrice: 1000,
        vatRate: 20,
        totalHT: 1000
      }
    ]);
  };

  const handleRemoveItem = (tempId: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(it => it.tempId !== tempId));
  };

  const handleItemChange = (tempId: string, field: string, val: any) => {
    setItems(items.map(it => {
      if (it.tempId !== tempId) return it;
      const updated = { ...it, [field]: val };
      const q = field === 'quantity' ? Number(val) : updated.quantity;
      const p = field === 'unitPrice' ? Number(val) : updated.unitPrice;
      updated.totalHT = Math.max(0, q * p);
      return updated;
    }));
  };

  const subtotalHT = items.reduce((sum, it) => sum + it.totalHT, 0);
  const totalVAT = items.reduce((sum, it) => sum + (it.totalHT * (it.vatRate / 100)), 0);
  const totalTTC = subtotalHT + totalVAT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + parseInt(dueDateDays, 10) * 86400000).toISOString().split('T')[0];
    const generatedNumber = `FAC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: generatedNumber,
      clientName: customClientName,
      clientLegalName,
      clientVatId,
      clientContact,
      clientEmail,
      issueDate: today,
      dueDate: due,
      status: 'PENDING',
      paymentMethod,
      notes,
      items: items.map((it, idx) => ({
        id: `line-${idx + 1}`,
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        vatRate: it.vatRate,
        totalHT: it.totalHT
      })),
      subtotalHT,
      totalVAT,
      totalTTC
    };

    onSaveInvoice(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">Nouvelle Facture Commerciale</h2>
              <p className="text-[11px] text-zinc-400">Émission avec calcul automatique de la TVA et échéance légale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
          {/* Client Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-300 font-mono uppercase tracking-wider text-[11px]">
              1. Informations Débiteur / Client Entreprise
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1">Sélectionner un Compte Référencé</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-blue-500"
                >
                  {INITIAL_CLIENTS.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.contractTier})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Raison Sociale Client</label>
                <input
                  type="text"
                  value={clientLegalName}
                  onChange={(e) => setClientLegalName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">N° de TVA Intracommunautaire</label>
                <input
                  type="text"
                  value={clientVatId}
                  onChange={(e) => setClientVatId(e.target.value)}
                  placeholder="FR XX XXXXXXXXX"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Email Destinataire Facturation</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-zinc-300 font-mono uppercase tracking-wider text-[11px]">
                2. Lignes de Prestations Facturées
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-blue-400 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une ligne</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => (
                <div key={item.tempId} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.tempId, 'description', e.target.value)}
                      placeholder="Désignation du service ou produit..."
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.tempId, 'quantity', e.target.value)}
                      className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-center text-zinc-200 font-mono focus:outline-none focus:border-blue-500"
                      title="Quantité"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.tempId, 'unitPrice', e.target.value)}
                      className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-right text-zinc-200 font-mono focus:outline-none focus:border-blue-500"
                      title="Prix unitaire HT"
                    />
                  </div>
                  <div className="w-20">
                    <select
                      value={item.vatRate}
                      onChange={(e) => handleItemChange(item.tempId, 'vatRate', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-200 font-mono focus:outline-none focus:border-blue-500"
                      title="Taux de TVA"
                    >
                      <option value="20">20%</option>
                      <option value="10">10%</option>
                      <option value="5.5">5.5%</option>
                      <option value="0">0%</option>
                    </select>
                  </div>
                  <div className="w-28 text-right font-mono font-semibold text-zinc-200">
                    {item.totalHT.toLocaleString('fr-FR')} € HT
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.tempId)}
                    disabled={items.length <= 1}
                    className="p-1 text-zinc-500 hover:text-rose-400 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Terms & Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Délai de Paiement</label>
                <select
                  value={dueDateDays}
                  onChange={(e) => setDueDateDays(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="30">30 jours net (Standard LME)</option>
                  <option value="45">45 jours fin de mois</option>
                  <option value="60">60 jours calendaires</option>
                  <option value="0">Paiement comptant à réception</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Modalité de Paiement</label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Calculated Totals Box */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Total Sous-jacent HT</span>
                <span>{subtotalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>TVA Consolidée</span>
                <span>{totalVAT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>TOTAL À ENCAISSER (TTC)</span>
                <span className="text-blue-400">{totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Émettre & Enregistrer la Facture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
