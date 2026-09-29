import { useState } from 'react';
import { 
  Wand2, 
  Copy, 
  CheckCheck, 
  Layers, 
  Server, 
  ShieldCheck, 
  Sparkles, 
  Code2, 
  SendHorizonal,
  Lightbulb
} from 'lucide-react';
import { PROJECT_TEMPLATES, ProjectTemplate } from '../data/capabilities';

interface ProjectArchitectProps {
  initialPrompt?: string;
  onSendPrompt: (prompt: string) => void;
}

export function ProjectArchitect({ initialPrompt = '', onSendPrompt }: ProjectArchitectProps) {
  const [customIdea, setCustomIdea] = useState<string>(initialPrompt || '');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate>(PROJECT_TEMPLATES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  // If user types custom idea, compute architecture dynamically
  const isCustom = customIdea.trim().length > 0;

  const currentPrompt = isCustom 
    ? `Crée une application web complète avec React 19, TypeScript et Tailwind CSS pour : "${customIdea.trim()}". Inclus une architecture modulaire, une interface soignée, la persistance des données et toutes les fonctionnalités interactives nécessaires.`
    : selectedTemplate.suggestedPrompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelectTemplate = (tpl: ProjectTemplate) => {
    setSelectedTemplate(tpl);
    setCustomIdea('');
  };

  return (
    <section id="architecte" className="py-16 sm:py-20 border-t border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Générateur de Projet & Cahier des Charges</span>
            <span aria-hidden="true">·</span>
            <span>Accélérateur</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display text-balance">
            Concevons votre prochaine application ensemble.
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Choisissez un modèle ci-dessous ou décrivez votre idée librement. Notre moteur génère immédiatement le découpage technique et le prompt prêt à lancer.
          </p>
        </div>

        {/* Templates Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PROJECT_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                !isCustom && selectedTemplate.id === tpl.id
                  ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-950/30'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                  {tpl.category}
                </span>
                <h4 className="mt-1 text-sm font-bold text-white font-display">
                  {tpl.name}
                </h4>
                <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>{tpl.screens.length} écrans prévus</span>
                <span className="text-indigo-400 font-medium">Sélectionner</span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Input Bar */}
        <div className="mb-10 p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Ou décrivez votre idée personnelle en quelques mots :</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Ex: Une application de suivi nutritionnel avec scan de code-barres et calcul macro automatique..."
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 text-sm text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
            {customIdea && (
              <button
                onClick={() => setCustomIdea('')}
                className="text-xs text-slate-400 hover:text-white px-3 py-2 cursor-pointer self-center"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Blueprint & Architecture Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Architecture Breakdown (8 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {isCustom ? "Architecture Déduite pour votre Idée" : `Architecture : ${selectedTemplate.name}`}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>Stack 100% moderne</span>
                    <span aria-hidden="true">·</span>
                    <span>Typage strict</span>
                    <span aria-hidden="true">·</span>
                    <span>Haute performance</span>
                  </div>
                </div>

                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded">
                  Spécification Validée
                </span>
              </div>

              {/* Stack items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Interface & Client</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    React 19, TypeScript, Tailwind CSS v4, Motion pour les animations fluides.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                    <Server className="w-3.5 h-3.5" />
                    <span>Stockage & Données</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Firebase Firestore en temps réel ou Cloud SQL PostgreSQL relationnel.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Intelligence Artificielle</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Gemini 2.5 Flash avec capacités multimodales, Function Calling ou Search Grounding.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Sécurité & Rôles</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Contrôle d'accès RBAC granulaire et validation défensive des formulaires.
                  </div>
                </div>
              </div>

              {/* Recommended Screens list */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                  Écrans & Modules Recommandés :
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.screens.map((screen, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs bg-slate-800/60 border border-slate-700/60 text-slate-200 px-3 py-1.5 rounded-lg"
                    >
                      {screen}
                    </span>
                  ))}
                  {isCustom && (
                    <span className="text-xs bg-slate-800/60 border border-slate-700/60 text-slate-200 px-3 py-1.5 rounded-lg">
                      Module Personnalisé sur-mesure
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Prompt Ready to Send (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/30 to-slate-900/60 flex flex-col justify-between h-full shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-indigo-900/50 mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>Prompt Optimisé pour le Studio</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">1-Clic</span>
              </div>

              <p className="text-xs text-slate-400 mb-3">
                Copiez ce texte et collez-le directement dans notre échange pour que je développe immédiatement cette application :
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap select-all max-h-60 overflow-y-auto">
                {currentPrompt}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all cursor-pointer shadow-md shadow-indigo-600/20 active:scale-98"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-300" />
                    <span>Prompt copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier ce prompt</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
