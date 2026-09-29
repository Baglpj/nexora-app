interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="space-y-1 text-center md:text-left">
            <div className="text-sm font-bold text-white font-display">
              Studio d'Ingénierie & Création Web
            </div>
            <p className="text-xs text-slate-400">
              Conception et développement d'applications logicielles sur-mesure.
            </p>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <button
              onClick={() => onNavigate('capacites')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Capacités
            </button>
            <button
              onClick={() => onNavigate('demos')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Démos en direct
            </button>
            <button
              onClick={() => onNavigate('architecte')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Générateur de Projet
            </button>
            <button
              onClick={() => onNavigate('stack')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Technologies
            </button>
          </nav>

          {/* Copyright */}
          <div className="text-xs text-slate-400 text-center md:text-right">
            <span>Environnement Google AI Studio Build</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
