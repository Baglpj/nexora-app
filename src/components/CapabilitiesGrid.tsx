import { useState } from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Database, 
  Share2, 
  Gamepad2, 
  Smartphone, 
  Check, 
  Copy, 
  CheckCheck,
  ArrowUpRight
} from 'lucide-react';
import { CAPABILITIES, Capability } from '../data/capabilities';

interface CapabilitiesGridProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenDemo: (demoCategory: string) => void;
}

export function CapabilitiesGrid({ onSelectPrompt, onOpenDemo }: CapabilitiesGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les capacités' },
    { id: 'saas', label: 'SaaS & Dashboards' },
    { id: 'ai', label: 'Intelligence Artificielle' },
    { id: 'database', label: 'Bases de Données' },
    { id: 'workspace', label: 'Google Workspace' },
    { id: 'creative', label: 'Jeux & Canvas' },
    { id: 'mobile', label: 'Mobile & PWA' }
  ];

  const getIcon = (category: Capability['category']) => {
    switch (category) {
      case 'saas':
        return <LayoutDashboard className="w-5 h-5 text-indigo-400" />;
      case 'ai':
        return <BrainCircuit className="w-5 h-5 text-purple-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'workspace':
        return <Share2 className="w-5 h-5 text-amber-400" />;
      case 'creative':
        return <Gamepad2 className="w-5 h-5 text-rose-400" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredCapabilities = selectedCategory === 'all' 
    ? CAPABILITIES 
    : CAPABILITIES.filter(c => c.category === selectedCategory);

  return (
    <section id="capacites" className="py-16 sm:py-20 border-t border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            <span>Catalogue des Réalisations</span>
            <span aria-hidden="true">·</span>
            <span>Architectures Prêtes à Déployer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display text-balance">
            Ce que nous pouvons concevoir et coder pour vous.
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Chaque application est codée sur-mesure, typée en TypeScript, optimisée pour la vitesse et prête à être étendue. Sélectionnez un domaine pour explorer les cas d'usage concrets.
          </p>
        </div>

        {/* Interactive Filter Controls (Functional button segmented control) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl mb-10 w-fit">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapabilities.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/80 group"
            >
              <div>
                {/* Header of card with unboxed metadata and icon */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    {getIcon(item.category)}
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {item.badgeText}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors font-display">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-indigo-300/80 font-medium">
                  {item.subtitle}
                </p>

                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Features list */}
                <ul className="mt-5 space-y-2 border-t border-slate-800/60 pt-4">
                  {item.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom prompt action bar */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                  <span className="font-medium text-slate-300">Exemple de demande directe :</span>
                  <button
                    onClick={() => handleCopyPrompt(item.id, item.samplePrompt)}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                    title="Copier le prompt"
                  >
                    {copiedId === item.id ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>

                <div 
                  onClick={() => onSelectPrompt(item.samplePrompt)}
                  className="p-2.5 rounded bg-slate-950/70 border border-slate-800/70 text-xs text-slate-300 italic cursor-pointer hover:border-indigo-500/40 hover:text-white transition-colors line-clamp-2"
                  title="Cliquer pour configurer ce projet"
                >
                  "{item.samplePrompt}"
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectPrompt(item.samplePrompt)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    Créer ce type de projet
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenDemo(item.category)}
                    className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Tester la démo
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
