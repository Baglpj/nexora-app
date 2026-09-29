import { Cpu, ShieldCheck, Zap, Globe, Database, Terminal } from 'lucide-react';

export function TechStackShowcase() {
  const stack = [
    {
      category: 'Interface & Rendu',
      title: 'React 19 & TypeScript',
      desc: 'Composants fonctionnels modulaires, hooks modernes, typage statique strict et zéro erreur de build.',
      tags: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Motion'],
      icon: <Zap className="w-5 h-5 text-amber-400" />
    },
    {
      category: 'Intelligence Multimodale',
      title: 'Google GenAI SDK (Gemini)',
      desc: 'Intégration du SDK moderne @google/genai pour la vision, le parsing de documents, la recherche grounded et les agents.',
      tags: ['Gemini 2.5 Flash', 'Vision Multimodale', 'Function Calling', 'Search Grounding'],
      icon: <Cpu className="w-5 h-5 text-indigo-400" />
    },
    {
      category: 'Persistance & Données',
      title: 'Firestore & Cloud SQL',
      desc: 'Choix entre base NoSQL temps réel (Firestore) et base relationnelle structurée (PostgreSQL avec Drizzle ORM).',
      tags: ['Firestore Rules', 'PostgreSQL', 'Drizzle ORM', 'Real-time Sync'],
      icon: <Database className="w-5 h-5 text-emerald-400" />
    },
    {
      category: 'Services & Écosystème',
      title: 'Google Workspace & Maps',
      desc: 'Authentification OAuth 2.0 sécurisée pour Google Sheets, Calendar, Drive et cartographie Maps Platform.',
      tags: ['OAuth 2.0', 'Google Sheets API', 'Google Maps Platform', 'PWA Offline'],
      icon: <Globe className="w-5 h-5 text-cyan-400" />
    }
  ];

  return (
    <section id="stack" className="py-16 sm:py-20 border-t border-slate-900 bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Standards d'Ingénierie Logicielle</span>
            <span aria-hidden="true">·</span>
            <span>Prêt pour la Production</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display text-balance">
            Des technologies modernes, robustes et sans compromis.
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Pas de code jetable ni de maquettes figées : chaque ligne de code est compilée, vérifiée et conçue pour être maintenue sur le long terme.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stack.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-display">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Clean unboxed tags with typographic separators */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
                {item.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="flex items-center gap-2">
                    <span className="text-slate-300">{tag}</span>
                    {tIdx < item.tags.length - 1 && <span aria-hidden="true" className="text-slate-600">·</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quality Guarantees Bar */}
        <div className="mt-12 p-6 rounded-2xl border border-indigo-900/30 bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">Contrôle Qualité & Compilation Automatique</div>
              <div className="text-xs text-slate-400 mt-0.5">Vérification de la syntaxe, conformité TypeScript et linting à chaque modification.</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-300">
            <div className="text-center">
              <div className="font-mono text-base font-bold text-emerald-400">100%</div>
              <div className="text-slate-400">Typescript Strict</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="font-mono text-base font-bold text-indigo-400">0 ms</div>
              <div className="text-slate-400">Faux Bouchons</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="font-mono text-base font-bold text-purple-400">60 FPS</div>
              <div className="text-slate-400">Fluidité GPU</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
