interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenProjectBuilder: () => void;
}

export function Navbar({ onNavigate, onOpenProjectBuilder }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigate('hero'); }}
          className="text-lg font-bold tracking-tight text-white transition-colors hover:text-indigo-300 font-display"
        >
          Studio d'Ingénierie Web
        </a>

        {/* Zone 2: 4 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
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

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProjectBuilder}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-400 whitespace-nowrap cursor-pointer active:scale-98"
          >
            Créer mon application
          </button>
        </div>
      </div>
    </header>
  );
}
