import React from 'react';
import { useNexora } from '../context/NexoraContext';
import { Home, Gamepad2, Users, Briefcase, ShoppingBag, Bot, Settings, ShieldAlert } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, activeRole, colorMode } = useNexora();

  const isLight = colorMode === 'light';

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'missions', label: 'Missions', icon: Gamepad2 },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'inventory', label: 'Inventaire', icon: Briefcase },
    { id: 'shop', label: 'Boutique', icon: ShoppingBag },
    { id: 'assistant', label: 'IA AURA', icon: Bot },
    { id: 'settings', label: 'Options', icon: Settings },
  ];

  return (
    <nav
      className={`border-t px-1.5 py-1.5 flex items-center justify-around shrink-0 z-30 backdrop-blur-md safe-bottom transition-colors ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-800 shadow-lg'
          : 'bg-slate-900/95 border-slate-800/80 text-slate-100'
      }`}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isAdmin = item.id === 'admin';

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all relative ${
              isActive
                ? isAdmin
                  ? 'text-rose-600 font-bold'
                  : 'text-amber-500 font-bold'
                : isLight
                ? 'text-slate-500 hover:text-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-transform ${
                isActive
                  ? isAdmin
                    ? 'bg-rose-500/20 scale-110'
                    : 'bg-amber-500/20 scale-110'
                  : ''
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
              {item.label}
            </span>
            {isActive && (
              <span
                className={`absolute bottom-0 w-4 h-0.5 rounded-full ${
                  isAdmin ? 'bg-rose-600 shadow-sm' : 'bg-amber-500 shadow-sm'
                }`}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
