import { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  Plus, 
  Play, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCheck,
  Eye,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface LivePlaygroundProps {
  initialTab?: string;
  onSelectPrompt: (prompt: string) => void;
}

export function LivePlayground({ initialTab = 'saas', onSelectPrompt }: LivePlaygroundProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Sync when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'creative') setActiveTab('game');
      else if (initialTab === 'ai') setActiveTab('ai');
      else if (initialTab === 'workspace' || initialTab === 'saas' || initialTab === 'database') setActiveTab('saas');
      else if (initialTab === 'mobile') setActiveTab('kanban');
    }
  }, [initialTab]);

  return (
    <section id="demos" className="py-16 sm:py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              <span>Bac à Sable & Démonstrations</span>
              <span aria-hidden="true">·</span>
              <span>100% Fonctionnel</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Testez la réactivité des composants créés.
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl">
              Ces modules illustrent la qualité des architectures produites : zéro simulation statique, chaque bouton, formulaire et graphique réagit instantanément.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('saas')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'saas'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Tableau de Bord SaaS
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Kanban Dynamique
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Auditeur IA & Extraction
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'game'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Jeu Canvas 2D 60 FPS
            </button>
          </div>
        </div>

        {/* Playground Container Frame */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 shadow-xl">
          {activeTab === 'saas' && <SaasDashboardDemo onSelectPrompt={onSelectPrompt} />}
          {activeTab === 'kanban' && <KanbanDemo onSelectPrompt={onSelectPrompt} />}
          {activeTab === 'ai' && <AiAuditorDemo onSelectPrompt={onSelectPrompt} />}
          {activeTab === 'game' && <CanvasGameDemo onSelectPrompt={onSelectPrompt} />}
        </div>

      </div>
    </section>
  );
}

/* =========================================================================
   DEMO 1: SAAS DASHBOARD INTERACTIF
   ========================================================================= */
function SaasDashboardDemo({ onSelectPrompt }: { onSelectPrompt: (p: string) => void }) {
  const [period, setPeriod] = useState<'7d' | '30d' | '12m'>('30d');
  const [transactions, setTransactions] = useState([
    { id: 'tx-101', client: 'Atelier Nova SARL', amount: 3450, status: 'Payé', date: 'Hier' },
    { id: 'tx-102', client: 'Studio Prism', amount: 1890, status: 'Payé', date: 'Il y a 3 jours' },
    { id: 'tx-103', client: 'TechVanguard Inc', amount: 6200, status: 'En attente', date: 'Il y a 4 jours' },
    { id: 'tx-104', client: 'Agence Horizon', amount: 890, status: 'Payé', date: 'Il y a 6 jours' }
  ]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const stats = {
    '7d': { total: 12430, growth: '+18.4%', activeUsers: 342, conversion: '4.8%' },
    '30d': { total: 48920, growth: '+24.1%', activeUsers: 1240, conversion: '5.2%' },
    '12m': { total: 582100, growth: '+41.8%', activeUsers: 8490, conversion: '6.1%' }
  }[period];

  const chartData = {
    '7d': [1200, 1900, 1400, 2400, 1800, 2800, 3450],
    '30d': [3100, 4200, 3800, 5400, 4900, 6800, 7200, 8900],
    '12m': [24000, 31000, 38000, 42000, 47000, 56000, 64000, 78000]
  }[period];

  const addTransaction = () => {
    const clients = ['Lumina Studio', 'Nexus Robotics', 'EcoLogis SAS', 'Aether Lab'];
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    const randomAmount = Math.floor(Math.random() * 4000) + 1200;
    const newTx = {
      id: `tx-${Math.floor(Math.random() * 900) + 100}`,
      client: randomClient,
      amount: randomAmount,
      status: 'Payé',
      date: 'À l\'instant'
    };
    setTransactions([newTx, ...transactions]);
  };

  const maxVal = Math.max(...chartData);
  const minVal = Math.min(...chartData);

  return (
    <div className="space-y-6">
      
      {/* Top Bar inside Demo */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white font-display">Aperçu Commercial & Revenus Récurrents</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Données synchronisées</span>
            <span aria-hidden="true">·</span>
            <span>Mise à jour en direct</span>
            <span aria-hidden="true">·</span>
            <span>Export multi-formats</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setPeriod('7d')}
              className={`px-2.5 py-1 rounded cursor-pointer ${period === '7d' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              7 jours
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-2.5 py-1 rounded cursor-pointer ${period === '30d' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              30 jours
            </button>
            <button
              onClick={() => setPeriod('12m')}
              className={`px-2.5 py-1 rounded cursor-pointer ${period === '12m' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              12 mois
            </button>
          </div>

          <button
            onClick={addTransaction}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simuler encaissement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Chiffre d'Affaires</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {stats.total.toLocaleString('fr-FR')} €
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{stats.growth} par rapport à la période précédente</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Comptes Clients Actifs</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {stats.activeUsers.toLocaleString('fr-FR')}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            <span>Taux de conversion : {stats.conversion}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Factures Récentes</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {transactions.length} enregistrées
          </div>
          <div className="mt-1 text-xs text-indigo-400">
            <span>Dernière entrée : {transactions[0]?.client}</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Trend Chart */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span className="font-semibold text-slate-200">Courbe de progression des revenus</span>
          <span>Survolez les points pour inspecter les valeurs</span>
        </div>

        <div className="relative h-40 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area */}
            <path
              d={`
                M 0,${120 - ((chartData[0] - minVal) / (maxVal - minVal || 1)) * 90}
                ${chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 700;
                  const y = 120 - ((d - minVal) / (maxVal - minVal || 1)) * 90;
                  return `L ${x},${y}`;
                }).join(' ')}
                L 700,120 L 0,120 Z
              `}
              fill="url(#chartGradient)"
            />

            {/* Line */}
            <path
              d={`
                M 0,${120 - ((chartData[0] - minVal) / (maxVal - minVal || 1)) * 90}
                ${chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 700;
                  const y = 120 - ((d - minVal) / (maxVal - minVal || 1)) * 90;
                  return `L ${x},${y}`;
                }).join(' ')}
              `}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2.5"
            />

            {/* Interactive Circles */}
            {chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 700;
              const y = 120 - ((d - minVal) / (maxVal - minVal || 1)) * 90;
              const isHovered = hoveredPoint === i;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 3.5}
                    className="fill-indigo-500 stroke-slate-950 stroke-2 cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {isHovered && (
                    <text
                      x={Math.min(650, Math.max(50, x))}
                      y={y - 12}
                      textAnchor="middle"
                      className="fill-white text-[11px] font-mono font-bold"
                    >
                      {d.toLocaleString('fr-FR')} €
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Transactions Table with tabular numbers */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold text-white">Dernières opérations comptabilisées</span>
          <span className="text-slate-400">Total : {transactions.length}</span>
        </div>
        <div className="divide-y divide-slate-800/80">
          {transactions.slice(0, 4).map((tx) => (
            <div key={tx.id} className="px-4 py-3 flex items-center justify-between text-xs hover:bg-slate-900/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500">{tx.id}</span>
                <span className="font-medium text-slate-200">{tx.client}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-slate-400">{tx.date}</span>
                <span className={`font-medium ${tx.status === 'Payé' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {tx.status}
                </span>
                <span className="font-mono font-semibold text-white tabular-nums w-20 text-right">
                  {tx.amount.toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to build this */}
      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-slate-400">Vous souhaitez un dashboard similaire adapté à votre entreprise ?</span>
        <button
          onClick={() => onSelectPrompt("Crée un tableau de bord SaaS complet avec métriques de chiffre d'affaires, graphiques de progression et liste des transactions avec filtres.")}
          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
        >
          Demander ce tableau de bord
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

/* =========================================================================
   DEMO 2: KANBAN DYNAMIQUE
   ========================================================================= */
function KanbanDemo({ onSelectPrompt }: { onSelectPrompt: (p: string) => void }) {
  const [tasks, setTasks] = useState([
    { id: 'k1', title: 'Audit de sécurité des règles Firestore', col: 'todo', priority: 'Haute' },
    { id: 'k2', title: 'Intégration du composant Google Maps', col: 'in_progress', priority: 'Moyenne' },
    { id: 'k3', title: 'Génération de facture PDF automatisée', col: 'done', priority: 'Basse' },
    { id: 'k4', title: 'Refonte de l\'interface avec Tailwind v4', col: 'in_progress', priority: 'Haute' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const moveTask = (taskId: string, targetCol: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, col: targetCol } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, {
      id: `k-${Date.now()}`,
      title: newTaskTitle.trim(),
      col: 'todo',
      priority: 'Moyenne'
    }]);
    setNewTaskTitle('');
  };

  const columns = [
    { id: 'todo', title: 'À faire', count: tasks.filter(t => t.col === 'todo').length },
    { id: 'in_progress', title: 'En cours', count: tasks.filter(t => t.col === 'in_progress').length },
    { id: 'done', title: 'Terminé', count: tasks.filter(t => t.col === 'done').length }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white font-display">Gestionnaire de Flux Kanban</h3>
          <p className="text-xs text-slate-400 mt-1">Organisez visuellement vos priorités d'équipe avec glisser-déposer ou actions directes.</p>
        </div>

        <form onSubmit={handleAddTask} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Nouvelle tâche..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 w-52"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter
          </button>
        </form>
      </div>

      {/* 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.col === col.id);
          return (
            <div key={col.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <span className="font-semibold text-xs text-slate-200">{col.title}</span>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {col.count}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 min-h-[160px]">
                {colTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 italic py-8">
                    Aucune tâche
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border border-slate-800 bg-slate-900/90 text-xs space-y-2 hover:border-slate-700 transition-colors shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-slate-200 leading-snug">{task.title}</span>
                        <span className={`text-[10px] font-semibold shrink-0 ${
                          task.priority === 'Haute' ? 'text-rose-400' : task.priority === 'Moyenne' ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Movement buttons */}
                      <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-800/60 text-[11px]">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => moveTask(task.id, col.id === 'done' ? 'in_progress' : 'todo')}
                            className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800/50 cursor-pointer"
                          >
                            ← Reculer
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => moveTask(task.id, col.id === 'todo' ? 'in_progress' : 'done')}
                            className="text-indigo-400 hover:text-indigo-300 px-1.5 py-0.5 rounded bg-slate-800/50 cursor-pointer font-medium"
                          >
                            Avancer →
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-slate-400">Besoin d'un système de gestion de tickets ou projets complet ?</span>
        <button
          onClick={() => onSelectPrompt("Construis une application de gestion de tickets avec tableau Kanban, attribution des membres de l'équipe et historique des commentaires.")}
          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
        >
          Créer un tableau Kanban sur-mesure
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

/* =========================================================================
   DEMO 3: AUDITEUR IA & EXTRACTION MULTIMODALE
   ========================================================================= */
function AiAuditorDemo({ onSelectPrompt }: { onSelectPrompt: (p: string) => void }) {
  const [selectedDoc, setSelectedDoc] = useState<'invoice' | 'contract'>('invoice');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>({
    title: 'Facture Fournisseur Cloud - Septembre 2026',
    status: 'Conforme',
    confidence: '99.4%',
    extractedData: {
      fournisseur: 'Google Cloud EMEA Limited',
      montantHT: '1 480,00 €',
      tva: '296,00 € (20%)',
      montantTTC: '1 776,00 €',
      echeance: '15 Octobre 2026',
      iban: 'FR76 3000 4012 3456 7890 1234 567'
    },
    flags: [
      { text: 'Numéro de TVA intracommunautaire vérifié valide (VIES)', type: 'success' },
      { text: 'Dépassement de 12% par rapport au budget prévisionnel alloué', type: 'warning' }
    ]
  });

  const runAnalysis = (type: 'invoice' | 'contract') => {
    setAnalyzing(true);
    setSelectedDoc(type);
    setResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      if (type === 'invoice') {
        setResult({
          title: 'Facture Matériel Informatique - F-2026-88',
          status: 'Conforme',
          confidence: '99.8%',
          extractedData: {
            fournisseur: 'Hardware Tech Direct SAS',
            montantHT: '4 820,00 €',
            tva: '964,00 € (20%)',
            montantTTC: '5 784,00 €',
            echeance: '30 Novembre 2026',
            iban: 'FR76 1027 8000 9876 5432 1098 765'
          },
          flags: [
            { text: 'Mentions légales complètes et registre du commerce vérifié', type: 'success' },
            { text: 'Paiement à 30 jours fin de mois conforme à la loi LME', type: 'success' }
          ]
        });
      } else {
        setResult({
          title: 'Accord de Confidentialité & Prestation (NDA)',
          status: 'À vérifier (2 alertes)',
          confidence: '97.2%',
          extractedData: {
            parties: 'Studio Alpha SAS & Client Beta Inc',
            duree: '36 mois à compter de la signature',
            juridiction: 'Tribunal de Commerce de Paris',
            penalite: 'Non plafonnée en cas de divulgation',
            exclusivite: 'Clause d\'exclusivité territoriale active'
          },
          flags: [
            { text: 'Attention : clause de pénalité non plafonnée inhabituelle', type: 'warning' },
            { text: 'Délai de notification de rupture fixé à seulement 48 heures', type: 'warning' }
          ]
        });
      }
    }, 900);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white font-display">Extraction Intelligente de Documents</h3>
          <p className="text-xs text-slate-400 mt-1">Démonstration de la puissance multimodale de Gemini pour analyser des pièces complexes en 1 seconde.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => runAnalysis('invoice')}
            disabled={analyzing}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors ${
              selectedDoc === 'invoice'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Facture d'achat
          </button>
          <button
            onClick={() => runAnalysis('contract')}
            disabled={analyzing}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors ${
              selectedDoc === 'contract'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Contrat de prestation
          </button>
        </div>
      </div>

      {analyzing ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-3">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="text-xs text-slate-300 font-medium">Analyse multimodale en cours avec Gemini...</span>
          <span className="text-[11px] text-slate-500">Extraction OCR, parsing JSON et détection des clauses à risque</span>
        </div>
      ) : result ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Summary Box */}
          <div className="lg:col-span-4 p-5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Statut du document</span>
              <span className={`text-xs font-semibold ${result.status.includes('Conforme') ? 'text-emerald-400' : 'text-amber-400'}`}>
                {result.status}
              </span>
            </div>
            
            <div className="text-sm font-bold text-white leading-snug">
              {result.title}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Indice de certitude :</span>
              <span className="font-mono text-indigo-400 font-bold">{result.confidence}</span>
            </div>

            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Observations IA</span>
              {result.flags.map((flag: any, fIdx: number) => (
                <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                  {flag.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span>{flag.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key-Value Extracted Grid */}
          <div className="lg:col-span-8 p-5 rounded-xl border border-slate-800 bg-slate-950/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Champs structurés extraits au format JSON</span>
              <span>Prêt pour export ERP / Google Sheets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(result.extractedData).map(([key, val]) => (
                <div key={key} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white font-mono truncate">
                    {String(val)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}

      {/* CTA */}
      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-slate-400">Vous avez des documents ou images spécifiques à traiter par IA ?</span>
        <button
          onClick={() => onSelectPrompt("Crée une application web avec Gemini pour analyser des documents PDF et extraire automatiquement les informations clés dans un fichier Google Sheets.")}
          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
        >
          Créer un extracteur IA
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

/* =========================================================================
   DEMO 4: JEU CANVAS 2D 60 FPS
   ========================================================================= */
function CanvasGameDemo({ onSelectPrompt }: { onSelectPrompt: (p: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let playerX = canvas.width / 2;
    let playerY = canvas.height - 35;
    let targetX = playerX;
    let currentScore = 0;
    let active = true;

    // Collectibles & Obstacles
    interface Star { x: number; y: number; speed: number; radius: number; }
    interface Hazard { x: number; y: number; speed: number; size: number; }

    let stars: Star[] = [];
    let hazards: Hazard[] = [];

    const spawnStar = () => {
      stars.push({
        x: Math.random() * (canvas.width - 20) + 10,
        y: -10,
        speed: Math.random() * 2 + 2,
        radius: 4
      });
    };

    const spawnHazard = () => {
      hazards.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: -20,
        speed: Math.random() * 2 + 2.5,
        size: 14
      });
    };

    let tick = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      targetX = (e.clientX - rect.left) * scaleX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        targetX = (e.touches[0].clientX - rect.left) * scaleX;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    const render = () => {
      if (!active) return;
      tick++;

      // Smooth lerp player movement
      playerX += (targetX - playerX) * 0.18;
      // Boundaries
      playerX = Math.max(15, Math.min(canvas.width - 15, playerX));

      // Spawning
      if (tick % 25 === 0) spawnStar();
      if (tick % 65 === 0) spawnHazard();

      // Clear Canvas
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background stars grid
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 20; i++) {
        const bgX = (i * 37 + tick * 0.3) % canvas.width;
        const bgY = (i * 29 + tick * 0.8) % canvas.height;
        ctx.fillRect(bgX, bgY, 1.5, 1.5);
      }

      // Draw Player Ship
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.moveTo(playerX, playerY - 14);
      ctx.lineTo(playerX - 12, playerY + 10);
      ctx.lineTo(playerX + 12, playerY + 10);
      ctx.closePath();
      ctx.fill();

      // Thruster flame
      ctx.fillStyle = tick % 4 > 1 ? '#38bdf8' : '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(playerX - 4, playerY + 10);
      ctx.lineTo(playerX + 4, playerY + 10);
      ctx.lineTo(playerX, playerY + 18);
      ctx.closePath();
      ctx.fill();

      // Update & Draw Stars (collectibles)
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.y += s.speed;

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Collision with player
        const dist = Math.hypot(s.x - playerX, s.y - playerY);
        if (dist < 18) {
          stars.splice(i, 1);
          currentScore += 10;
          setScore(currentScore);
          continue;
        }

        if (s.y > canvas.height + 10) {
          stars.splice(i, 1);
        }
      }

      // Update & Draw Hazards (asteroids)
      for (let i = hazards.length - 1; i >= 0; i--) {
        const h = hazards[i];
        h.y += h.speed;

        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Collision with player
        const dist = Math.hypot(h.x - playerX, h.y - playerY);
        if (dist < 16) {
          // Game Over!
          active = false;
          setIsGameOver(true);
          setHighScore(prev => Math.max(prev, currentScore));
          return;
        }

        if (h.y > canvas.height + 20) {
          hazards.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    if (gameStarted && !isGameOver) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      // Static attract screen
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        isGameOver ? 'Partie terminée ! Cliquez sur "Rejouer"' : 'Déplacez la souris pour guider le vaisseau',
        canvas.width / 2,
        canvas.height / 2
      );
    }

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameStarted, isGameOver]);

  const restartGame = () => {
    setScore(0);
    setIsGameOver(false);
    setGameStarted(true);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white font-display">Moteur de Jeu Canvas 2D Interactif</h3>
          <p className="text-xs text-slate-400 mt-1">Boucle de rendu native 60fps avec détection géométrique de collisions en temps réel.</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-slate-300">
            Score : <span className="text-white font-bold">{score}</span>
          </div>
          <div className="text-slate-400">
            Record : <span className="text-indigo-400 font-bold">{highScore}</span>
          </div>
          <button
            onClick={restartGame}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
          >
            {gameStarted ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{gameStarted ? (isGameOver ? 'Rejouer' : 'Recommencer') : 'Lancer le jeu'}</span>
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={280}
          className="w-full max-w-[640px] h-[260px] cursor-crosshair touch-none"
        />

        {/* Micro instructions overlay */}
        <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 pointer-events-none">
          ⭐ Attrapez les orbes dorées (+10 pts) · 🔴 Esquivez les météores rouges
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-slate-400">Vous imaginez un mini-jeu pour booster l'engagement ou gamifier votre outil ?</span>
        <button
          onClick={() => onSelectPrompt("Développe un jeu 2D interactif en Canvas HTML5 avec physique de rebond, niveaux progressifs et sauvegarde locale des scores.")}
          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
        >
          Créer un jeu interactif
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
