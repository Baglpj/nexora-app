import React from 'react';
import { useNexora } from '../../context/NexoraContext';
import { Home, Flame, Trophy, ShoppingBag, User } from 'lucide-react';

export const UserBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, colorMode, activeThemePreset } = useNexora();

  const isLight = colorMode === 'light';

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'feed', label: 'Social', icon: Flame, badge: 'Nouveau' },
    { id: 'missions', label: 'Tournois', icon: Trophy },
    { id: 'shop', label: 'Boutique', icon: ShoppingBag },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav
      className={`px-3 py-2 border-t z-20 backdrop-blur-xl shrink-0 transition-colors ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-700 shadow-sm'
          : 'bg-slate-950/90 border-slate-800/80 text-slate-300'
      }`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all group min-w-[56px]"
            >
              {/* Active Glow Indicator */}
              {isActive && (
                <span
                  className="absolute -top-2 w-8 h-1 rounded-full shadow-md"
                  style={{
                    backgroundColor: activeThemePreset.primaryColor,
                    boxShadow: `0 0 10px ${activeThemePreset.primaryColor}`,
                  }}
                />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'scale-110' : 'text-slate-400'
                  }`}
                  style={{
                    color: isActive ? activeThemePreset.primaryColor : undefined,
                  }}
                />
                {item.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>

              <span
                className={`text-[10px] font-bold tracking-tight transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
                style={{
                  color: isActive ? activeThemePreset.primaryColor : undefined,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
