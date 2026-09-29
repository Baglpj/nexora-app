export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number; // 20, 10, 5.5
  totalHT: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientLegalName: string;
  clientVatId: string;
  clientContact: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotalHT: number;
  totalVAT: number;
  totalTTC: number;
  paymentMethod: string;
  notes?: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  industry: string;
  contractTier: 'Enterprise' | 'Scale' | 'Corporate';
  totalBilled: number;
  openBalance: number;
  paymentRisk: 'Faible' | 'Modéré' | 'Sous surveillance';
  lastInteraction: string;
}

export interface Deal {
  id: string;
  clientName: string;
  dealName: string;
  value: number;
  stage: 'PROSPECT' | 'PROPOSAL' | 'NEGOTIATION' | 'WON';
  probability: number;
  targetCloseDate: string;
  assignedTo: string;
}

export interface MonthlyCashPoint {
  month: string;
  revenue: number;
  expenses: number;
  netCash: number;
}

export interface FinancialAuditResult {
  healthScore: number;
  healthStatus: 'EXCELLENT' | 'SOLIDE' | 'ATTENTION' | 'CRITIQUE';
  runwayMonths: number;
  executiveSummary: string;
  topRisks: Array<{
    title: string;
    severity: 'HAUT' | 'MOYEN' | 'FAIBLE';
    impact: string;
    recommendation: string;
  }>;
  strategicOptimizations: string[];
  forecastQ4: string;
  isFallback?: boolean;
}

export interface ContractAuditResult {
  complianceScore: number;
  status: 'CONFORME' | 'CONFORME AVEC RÉSERVES' | 'À RISQUE ÉLEVÉ';
  keyClausesDetected: Array<{
    clause: string;
    status: 'Conforme' | 'Attention' | 'Risque modéré' | 'Critique';
    note: string;
  }>;
  legalRisks: string[];
  negotiationAdvice: string;
  isFallback?: boolean;
}
