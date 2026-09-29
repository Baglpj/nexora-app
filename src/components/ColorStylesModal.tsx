import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  Palette,
  Sparkles,
  Zap,
  Flame,
  Droplet,
  Crown,
  Shield,
  Gem,
  Plus,
  Check,
  ArrowLeft,
  X,
  Heart,
  Rocket,
  Star,
  Layers,
} from 'lucide-react';
import { ColorTheme } from '../types/nexora';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Crown,
  Zap,
  Sparkles,
  Gem,
  Flame,
  Droplet,
  Palette,
  Shield,
  Heart,
  Rocket,
  Star,
};

export const ColorStylesModal: React.FC = () => {
  const {
    isColorStylesModalOpen,
    setIsColorStylesModalOpen,
    allThemes,
    activeTheme,
    setActiveTheme,
    addCustomTheme,
    colorMode,
  } = useNexora();

  const isLight = colorMode === 'light';

  // State for creating a new custom theme
  const [showAddForm, setShowAddForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('Thème créé sur mesure');
  const [customPrimary, setCustomPrimary] = useState('#a855f7');
  const [customSecondary, setCustomSecondary] = useState('#ec4899');
  const [selectedIconName, setSelectedIconName] = useState('Sparkles');

  if (!isColorStylesModalOpen) return null;

  const handleCreateTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newTheme: ColorTheme = {
      id: `theme_custom_${Date.now()}`,
      name: customName.trim(),
      description: customDesc.trim() || 'Style personnalisé par l utilisateur',
      iconName: selectedIconName,
      primaryColor: customPrimary,
      secondaryColor: customSecondary,
      glowColor: `${customPrimary}66`,
      cardBorder: 'border-purple-500/40',
      textAccent: 'text-purple-400',
      gradientBadge: 'from-purple-500 to-pink-500',
      isCustom: true,
    };

    addCustomTheme(newTheme);
    setShowAddForm(false);
    setCustomName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div
        className={`w-full max-w-lg max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Header with clear Back Arrow */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsColorStylesModalOpen(false)}
              className={`p-2 rounded-xl border transition-all ${
                isLight
                  ? 'border-slate-300 hover:bg-slate-200 text-slate-700'
                  : 'border-slate-700 hover:bg-slate-800 text-slate-200'
              }`}
              title="Retourner aux paramètres"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="text-sm font-black flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-500" />
                <span>Styles de Couleur & Teintes Chromatiques</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Personnalisez les dégradés et accents au-delà du mode sombre/clair.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsColorStylesModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Active Theme Preview Badge */}
          <div
            className="p-4 rounded-2xl border flex items-center justify-between shadow-lg relative overflow-hidden"
            style={{
              borderColor: activeTheme.primaryColor,
              backgroundColor: isLight ? '#ffffff' : '#090d16',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md text-white font-bold"
                style={{
                  background: `linear-gradient(135deg, ${activeTheme.primaryColor}, ${activeTheme.secondaryColor})`,
                  boxShadow: `0 8px 16px ${activeTheme.glowColor}`,
                }}
              >
                {React.createElement(ICON_MAP[activeTheme.iconName] || Palette, {
                  className: 'w-6 h-6 stroke-[2.2]',
                })}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Style Actuellement Actif
                </span>
                <h4 className="text-sm font-black" style={{ color: activeTheme.primaryColor }}>
                  {activeTheme.name}
                </h4>
                <p className="text-[11px] text-slate-400">{activeTheme.description}</p>
              </div>
            </div>

            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-slate-950 font-mono shadow"
              style={{
                background: `linear-gradient(90deg, ${activeTheme.primaryColor}, ${activeTheme.secondaryColor})`,
              }}
            >
              EN VIGUEUR
            </span>
          </div>

          {/* Button to toggle custom theme creator form */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-black text-xs uppercase tracking-wide text-slate-400">
              Palettes Disponibles ({allThemes.length})
            </span>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Ajouter un Style</span>
            </button>
          </div>

          {/* ADD CUSTOM THEME FORM */}
          {showAddForm && (
            <form
              onSubmit={handleCreateTheme}
              className={`p-4 rounded-2xl border space-y-3 animate-fade-in ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Créer un Nouveau Style Chromatique
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs"
                >
                  Fermer
                </button>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Nom du style :</label>
                <input
                  type="text"
                  placeholder="ex: Aurore Polaire, Vague Rose..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Couleur Principale :</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                      className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                      className={`flex-1 border rounded-lg px-2 py-1 text-xs font-mono uppercase ${
                        isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Couleur Secondaire :</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customSecondary}
                      onChange={(e) => setCustomSecondary(e.target.value)}
                      className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={customSecondary}
                      onChange={(e) => setCustomSecondary(e.target.value)}
                      className={`flex-1 border rounded-lg px-2 py-1 text-xs font-mono uppercase ${
                        isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Icon selector for the theme */}
              <div>
                <label className="block text-slate-400 text-[11px] mb-1.5">
                  Icône du style (Jolies icônes au choix) :
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Sparkles', 'Zap', 'Flame', 'Gem', 'Crown', 'Heart', 'Rocket', 'Star', 'Palette', 'Droplet'].map(
                    (icName) => {
                      const IconComp = ICON_MAP[icName] || Sparkles;
                      const isSelected = selectedIconName === icName;
                      return (
                        <button
                          key={icName}
                          type="button"
                          onClick={() => setSelectedIconName(icName)}
                          className={`p-2 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-400 scale-110 shadow'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md"
                >
                  Enregistrer & Appliquer ce Style
                </button>
              </div>
            </form>
          )}

          {/* PALETTES LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allThemes.map((theme) => {
              const isCurrent = activeTheme.id === theme.id;
              const IconComp = ICON_MAP[theme.iconName] || Palette;

              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all group relative overflow-hidden ${
                    isCurrent
                      ? isLight
                        ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/40 shadow-md'
                        : 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                      : isLight
                      ? 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                      : 'bg-slate-950 border-slate-850 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Glowing Theme Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md text-white shrink-0 group-hover:scale-105 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                        boxShadow: `0 4px 12px ${theme.glowColor}`,
                      }}
                    >
                      <IconComp className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs truncate">{theme.name}</span>
                        {theme.isCustom && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1 rounded font-mono">
                            PERSO
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                        {theme.description}
                      </p>

                      {/* Color Preview Swatches */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: theme.secondaryColor }}
                        />
                      </div>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="p-1 rounded-full bg-amber-500 text-slate-950 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-3.5 border-t flex items-center justify-between text-xs shrink-0 ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/60'
          }`}
        >
          <span className="text-slate-400 text-[11px]">
            Styles applicables en temps réel sur toute l'interface.
          </span>
          <button
            onClick={() => setIsColorStylesModalOpen(false)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
