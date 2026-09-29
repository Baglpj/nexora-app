import { Invoice, ClientAccount, Deal, MonthlyCashPoint } from '../types/enterprise';

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'FAC-2026-0891',
    clientName: 'Capgemini France SAS',
    clientLegalName: 'Capgemini France SAS — SIREN 330 703 844',
    clientVatId: 'FR 23 330703844',
    clientContact: 'Élodie Laurent (Directrice Achats IT)',
    clientEmail: 'elodie.laurent@capgemini.com',
    issueDate: '2026-08-15',
    dueDate: '2026-09-15',
    status: 'OVERDUE',
    subtotalHT: 24500,
    totalVAT: 4900,
    totalTTC: 29400,
    paymentMethod: 'Virement SEPA B2B (30 jours)',
    notes: 'Prestations d\'architecture Cloud & API Enterprise - Lot 2.',
    items: [
      { id: 'it-1', description: 'Licence Plateforme Nexus Cloud Enterprise (100 sièges)', quantity: 1, unitPrice: 14500, vatRate: 20, totalHT: 14500 },
      { id: 'it-2', description: 'Accompagnement déploiement & SLA 24/7 (Août 2026)', quantity: 1, unitPrice: 10000, vatRate: 20, totalHT: 10000 }
    ]
  },
  {
    id: 'inv-02',
    invoiceNumber: 'FAC-2026-0892',
    clientName: 'Dassault Systèmes SE',
    clientLegalName: 'Dassault Systèmes SE — RCS Versailles 322 306 440',
    clientVatId: 'FR 52 322306440',
    clientContact: 'Alexandre Mercier (VP Operations)',
    clientEmail: 'a.mercier@3ds.com',
    issueDate: '2026-09-01',
    dueDate: '2026-10-01',
    status: 'PENDING',
    subtotalHT: 42000,
    totalVAT: 8400,
    totalTTC: 50400,
    paymentMethod: 'Virement bancaire sous 30 jours net',
    notes: 'Abonnement annuel récurrent infrastructure décisionnelle.',
    items: [
      { id: 'it-3', description: 'Abonnement annuel SaaS Dedicated Instance Q3-Q4', quantity: 1, unitPrice: 36000, vatRate: 20, totalHT: 36000 },
      { id: 'it-4', description: 'Pack connecteurs bancaires ERP & Chorus Pro', quantity: 1, unitPrice: 6000, vatRate: 20, totalHT: 6000 }
    ]
  },
  {
    id: 'inv-03',
    invoiceNumber: 'FAC-2026-0888',
    clientName: 'Sanofi Aventis Groupe',
    clientLegalName: 'Sanofi Aventis Groupe — SIREN 403 335 904',
    clientVatId: 'FR 89 403335904',
    clientContact: 'Claire de Montmirail (Contrôleur de Gestion)',
    clientEmail: 'claire.demontmirail@sanofi.com',
    issueDate: '2026-07-20',
    dueDate: '2026-08-20',
    status: 'PAID',
    subtotalHT: 31000,
    totalVAT: 6200,
    totalTTC: 37200,
    paymentMethod: 'Virement SEPA reçu le 18/08/2026',
    notes: 'Règlement validé par rapprochement bancaire automatique.',
    items: [
      { id: 'it-5', description: 'Audit de sécurité des flux financiers & Conformité SOC2', quantity: 1, unitPrice: 19000, vatRate: 20, totalHT: 19000 },
      { id: 'it-6', description: 'Formation des équipes d\'audit interne (2 sessions)', quantity: 2, unitPrice: 6000, vatRate: 20, totalHT: 12000 }
    ]
  },
  {
    id: 'inv-04',
    invoiceNumber: 'FAC-2026-0893',
    clientName: 'Doctolib SAS',
    clientLegalName: 'Doctolib SAS — SIREN 794 598 813',
    clientVatId: 'FR 35 794598813',
    clientContact: 'Thibault Faure (Head of Procurement)',
    clientEmail: 'thibault.faure@doctolib.com',
    issueDate: '2026-09-10',
    dueDate: '2026-10-10',
    status: 'PENDING',
    subtotalHT: 18500,
    totalVAT: 3700,
    totalTTC: 22200,
    paymentMethod: 'Virement bancaire 30j fin de mois',
    notes: 'Intégration passerelle de paiement sécurisée multi-devises.',
    items: [
      { id: 'it-7', description: 'API Nexus Intelligence - Quota illimité Q3', quantity: 1, unitPrice: 18500, vatRate: 20, totalHT: 18500 }
    ]
  },
  {
    id: 'inv-05',
    invoiceNumber: 'FAC-2026-0885',
    clientName: 'BNP Paribas Arbitrage',
    clientLegalName: 'BNP Paribas Arbitrage SNC — SIREN 394 895 833',
    clientVatId: 'FR 19 394895833',
    clientContact: 'Gilles Vernet (Chief Risk Officer)',
    clientEmail: 'gilles.vernet@bnpparibas.com',
    issueDate: '2026-08-01',
    dueDate: '2026-09-01',
    status: 'OVERDUE',
    subtotalHT: 9050,
    totalVAT: 1810,
    totalTTC: 10860,
    paymentMethod: 'Virement SEPA B2B',
    notes: 'Relance niveau 1 transmise le 08/09/2026.',
    items: [
      { id: 'it-8', description: 'Module de simulation prédictive de risque de contrepartie', quantity: 1, unitPrice: 9050, vatRate: 20, totalHT: 9050 }
    ]
  },
  {
    id: 'inv-06',
    invoiceNumber: 'FAC-2026-0894',
    clientName: 'Mirakl SAS',
    clientLegalName: 'Mirakl SAS — SIREN 537 996 763',
    clientVatId: 'FR 42 537996763',
    clientContact: 'Sophie Benhamou (Finance Director)',
    clientEmail: 's.benhamou@mirakl.com',
    issueDate: '2026-09-22',
    dueDate: '2026-10-22',
    status: 'PENDING',
    subtotalHT: 12000,
    totalVAT: 2400,
    totalTTC: 14400,
    paymentMethod: 'Virement bancaire 30 jours',
    notes: 'Contrat pilote marketplace B2B.',
    items: [
      { id: 'it-9', description: 'Setup & intégration marketplace API Enterprise', quantity: 1, unitPrice: 12000, vatRate: 20, totalHT: 12000 }
    ]
  }
];

export const INITIAL_CLIENTS: ClientAccount[] = [
  { id: 'cl-1', name: 'Capgemini France', industry: 'Conseil & IT', contractTier: 'Enterprise', totalBilled: 148000, openBalance: 29400, paymentRisk: 'Modéré', lastInteraction: 'Il y a 3 jours' },
  { id: 'cl-2', name: 'Dassault Systèmes', industry: 'Édition Logicielle', contractTier: 'Enterprise', totalBilled: 236000, openBalance: 50400, paymentRisk: 'Faible', lastInteraction: 'Hier' },
  { id: 'cl-3', name: 'Sanofi Aventis', industry: 'Santé & Pharma', contractTier: 'Enterprise', totalBilled: 192000, openBalance: 0, paymentRisk: 'Faible', lastInteraction: 'Il y a 2 semaines' },
  { id: 'cl-4', name: 'Doctolib', industry: 'HealthTech', contractTier: 'Scale', totalBilled: 94000, openBalance: 22200, paymentRisk: 'Faible', lastInteraction: 'Aujourd\'hui' },
  { id: 'cl-5', name: 'BNP Paribas', industry: 'Banque & Assurance', contractTier: 'Corporate', totalBilled: 88000, openBalance: 10860, paymentRisk: 'Sous surveillance', lastInteraction: 'Il y a 5 jours' },
  { id: 'cl-6', name: 'Mirakl', industry: 'E-commerce B2B', contractTier: 'Scale', totalBilled: 42000, openBalance: 14400, paymentRisk: 'Faible', lastInteraction: 'Il y a 1 jour' }
];

export const INITIAL_DEALS: Deal[] = [
  { id: 'dl-1', clientName: 'Schneider Electric', dealName: 'Déploiement Plateforme Trésorerie Europe', value: 85000, stage: 'NEGOTIATION', probability: 80, targetCloseDate: '2026-10-15', assignedTo: 'Marc Dumont' },
  { id: 'dl-2', clientName: 'Saint-Gobain', dealName: 'Automatisation Facturation Filiales BTP', value: 64000, stage: 'PROPOSAL', probability: 60, targetCloseDate: '2026-10-30', assignedTo: 'Marc Dumont' },
  { id: 'dl-3', clientName: 'LVMH Moët Hennessy', dealName: 'Audit IA & Rapprochement Bancaire International', value: 120000, stage: 'NEGOTIATION', probability: 75, targetCloseDate: '2026-11-10', assignedTo: 'Sophie Renaud' },
  { id: 'dl-4', clientName: 'Qonto Corporate', dealName: 'Connecteur Instant Payment & Flux SEPA', value: 38000, stage: 'PROSPECT', probability: 40, targetCloseDate: '2026-11-25', assignedTo: 'Sophie Renaud' },
  { id: 'dl-5', clientName: 'Airbus Defence', dealName: 'Module Souverain On-Premise SOC2', value: 160000, stage: 'WON', probability: 100, targetCloseDate: '2026-09-18', assignedTo: 'Marc Dumont' }
];

export const HISTORICAL_CASHFLOW: MonthlyCashPoint[] = [
  { month: 'Oct 25', revenue: 54000, expenses: 24000, netCash: 30000 },
  { month: 'Nov 25', revenue: 58500, expenses: 25200, netCash: 33300 },
  { month: 'Déc 25', revenue: 64000, expenses: 27000, netCash: 37000 },
  { month: 'Jan 26', revenue: 61000, expenses: 26000, netCash: 35000 },
  { month: 'Fév 26', revenue: 67500, expenses: 26800, netCash: 40700 },
  { month: 'Mar 26', revenue: 71000, expenses: 28000, netCash: 43000 },
  { month: 'Avr 26', revenue: 69500, expenses: 27500, netCash: 42000 },
  { month: 'Mai 26', revenue: 74200, expenses: 29000, netCash: 45200 },
  { month: 'Juin 26', revenue: 78000, expenses: 28500, netCash: 49500 },
  { month: 'Juil 26', revenue: 81500, expenses: 30000, netCash: 51500 },
  { month: 'Août 26', revenue: 76000, expenses: 27000, netCash: 49000 },
  { month: 'Sept 26', revenue: 86400, expenses: 31200, netCash: 55200 }
];

export const CONTRACT_PRESET_SAMPLE = `CONTRAT-CADRE DE PRESTATION ET LICENCE LOGICIELLE B2B
ENTRE : Nexus Financial Technologies SAS (Le Prestataire)
ET : Société Cliente (Le Client)

Article 4 - Modalités Financières et Conditions de Règlement
Les factures émises par le Prestataire sont payables sous un délai de trente (30) jours calendaires à compter de la date d'émission. Tout retard de paiement donnera lieu de plein droit et sans mise en demeure préalable au paiement d'un intérêt de retard calculé au taux d'intérêt appliqué par la BCE à son opération de refinancement la plus récente majoré de 10 points de pourcentage, ainsi qu'à une indemnité forfaitaire pour frais de recouvrement de 40 euros (art. L. 441-10 du Code de commerce).

Article 7 - Propriété Intellectuelle
Le Prestataire conserve la propriété exclusive de l'ensemble de ses outils logiciels, algorithmes, modèles prédictifs et codes sources. Le Client bénéficie d'une concession de licence d'utilisation non exclusive, non transférable, pour ses seuls besoins internes d'exploitation pendant toute la durée du contrat.

Article 9 - Responsabilité et Garantie
La responsabilité cumulée totale du Prestataire au titre du présent contrat pour tout dommage direct prouvé est expressément limitée au montant total hors taxes effectivement encaissé par le Prestataire au cours des douze (12) derniers mois précédant le fait générateur. Le Prestataire ne saurait être tenu responsable des pertes indirectes de chiffre d'affaires, pertes de marge ou préjudices commerciaux.

Article 12 - Résiliation
En cas de manquement grave par l'une des parties à l'une de ses obligations contractuelles non réparé dans un délai de trente (30) jours suivant l'envoi d'une lettre recommandée avec avis de réception, l'autre partie pourra résilier le contrat de plein droit sans préavis.`;
