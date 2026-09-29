import { ArrowRight, Sparkles, Terminal, Layers } from 'lucide-react';

interface HeroProps {
  onExploreCapabilities: () => void;
  onTryDemos: () => void;
  onSelectPrompt: (promptText: string) => void;
}

export function Hero({ onExploreCapabilities, onTryDemos, onSelectPrompt }: HeroProps) {
  const quickPrompts = [
    "Tableau de bord SaaS avec métriques en temps réel et exports PDF",
    "Application d'audit de factures avec extraction multimodale Gemini",
    "Système de réservation avec synchronisation Google Sheets & Calendar",
    "Jeu interactif 2D en Canvas avec moteur physique"
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and Narrative */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Zero-Pill Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-indigo-300">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                Ingénieur Logiciel & Architecte Web
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Code Source Complet</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Déploiement Continu</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>100% Fonctionnel</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.1] text-balance">
              Concevoir, coder et déployer des applications web de bout en bout.
            </h1>

            {/* Explanatory Lead */}
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Vous décrivez votre besoin en langage naturel : je conçois l'architecture, développe les composants React 19, configure la persistance des données, connecte les APIs Google ou l'IA Gemini, et livre une application immédiatement exploitable.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreCapabilities}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-98 cursor-pointer"
              >
                Explorer ce que nous pouvons créer
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onTryDemos}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                Tester les démos en direct
              </button>
            </div>

            {/* Quick Prompt Ideas bar */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Exemples d'idées que vous pouvez me demander dès maintenant :</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectPrompt(prompt)}
                    className="text-left text-xs bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded transition-all cursor-pointer truncate max-w-md"
                    title={prompt}
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Studio Image with Fallback and Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 p-2 shadow-2xl">
              <div className="relative aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-950">
                <img
                  src="/src/assets/images/hero_capabilities_studio_1790610513161.jpg"
                  alt="Studio de création et ingénierie logicielle avec interfaces de code et design"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Graceful fallback container if needed
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Fallback container in CSS behind the image */}
                <div className="absolute inset-0 -z-10 flex flex-col justify-end p-6 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950">
                  <div className="text-sm font-semibold text-white">Atelier d'Ingénierie Logicielle</div>
                  <div className="text-xs text-slate-400">Applications Web & Intégrations Complètes</div>
                </div>

                {/* Subtle bottom gradient scrim for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Micro overlay caption */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-medium text-white">Studio de Production Full-Stack</span>
                  <span className="text-indigo-400 font-mono">React · TS · Cloud</span>
                </div>
              </div>

              {/* Sub-bar below image */}
              <div className="mt-3 flex items-center justify-between px-2 py-1 text-xs text-slate-400">
                <span>Architecture modulaire</span>
                <span aria-hidden="true">·</span>
                <span>Zéro bouchon fictif</span>
                <span aria-hidden="true">·</span>
                <span>Code maintenable</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
