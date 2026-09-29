import React from 'react';
import { useNexora } from '../../context/NexoraContext';
import { Palette, CheckCircle, Eye, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { ThemePreset } from '../../types/nexora';

export const AdminThemePresetManagerView: React.FC = () => {
  const {
    themePresets,
    activeThemePreset,
    setActiveThemePreset,
    adminToggleThemePresetAvailability,
    showToast,
  } = useNexora();

  return (
    <div className="p-6 space-y-6 overflow-y-auto no-scrollbar pb-16">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <span>GESTIONNAIRE DES STYLES & THÈMES (PRESETS MAJEURS)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configurez les chartes graphiques inspirées des grands réseaux mondiaux (YouTube, TikTok, WhatsApp, Instagram, Facebook) proposées aux joueurs.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-900 text-amber-300 border border-amber-500/30">
          {themePresets.length} Palettes Configurées
        </span>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themePresets.map((preset) => {
          const isCurrentActive = activeThemePreset.id === preset.id;

          return (
            <div
              key={preset.id}
              className={`rounded-3xl border p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all ${
                isCurrentActive
                  ? 'border-amber-400 bg-[#0f172a] ring-2 ring-amber-400/50'
                  : 'border-slate-800 bg-[#090d1a] hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Name + Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-xl shadow-md border"
                      style={{
                        backgroundColor: preset.primaryColor,
                        borderColor: preset.accentColor,
                      }}
                    />
                    <h3 className="font-bold text-sm text-white font-mono">{preset.name}</h3>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {preset.platformRef}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">{preset.description}</p>

                {/* Color Swatches */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Couleur Principale :</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      {preset.primaryColor}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Couleur d'Accent :</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                      {preset.accentColor}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Arrière-plan :</span>
                    <span className="font-bold text-slate-300 font-mono">
                      {preset.backgroundColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {/* Toggle Availability for Players */}
                <button
                  onClick={() => adminToggleThemePresetAvailability(preset.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    preset.isAvailableForUsers
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                  title="Activer ou masquer ce style pour les joueurs"
                >
                  {preset.isAvailableForUsers ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-400" />
                      <span>Actif Joueurs</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-slate-500" />
                      <span>Masqué</span>
                    </>
                  )}
                </button>

                {/* Apply Live Preview */}
                <button
                  onClick={() => setActiveThemePreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    isCurrentActive
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {isCurrentActive ? 'Thème Actif' : 'Appliquer Direct'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
