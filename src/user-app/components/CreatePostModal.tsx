import React, { useState } from 'react';
import { useNexora } from '../../context/NexoraContext';
import { X, Image as ImageIcon, Sparkles, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CreatePostModal: React.FC = () => {
  const {
    isCreatePostModalOpen,
    setIsCreatePostModalOpen,
    addSocialPost,
    currentUser,
    missions,
    colorMode,
    activeThemePreset,
  } = useNexora();

  const [caption, setCaption] = useState('');
  const [gameTag, setGameTag] = useState('#CyberDash');
  const [selectedImage, setSelectedImage] = useState(
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80'
  );

  if (!isCreatePostModalOpen || !currentUser) return null;

  const isLight = colorMode === 'light';

  // Sample screenshot presets for user convenience
  const screenshotPresets = [
    {
      id: 'p1',
      title: 'Course Cyber Néon',
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'p2',
      title: 'Matrice Algorithmique',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'p3',
      title: 'Tournoi Cyberpunk',
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'p4',
      title: 'Victoire Royale Arcade',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (caption.trim()) {
      addSocialPost({
        caption: caption.trim(),
        imageUrl: selectedImage,
        gameTag: gameTag.trim(),
        gameTitle: gameTag.replace('#', ''),
      });
      setCaption('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[88vh] transition-all ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm">Nouvelle Publication Joueur</h3>
              <p className="text-[10px] text-slate-400">Partagez vos exploits avec la communauté</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreatePostModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
          {/* User Status Bar */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/50 border border-slate-800">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white">{currentUser.username}</span>
                {currentUser.hasBlueBadge ? (
                  <span className="text-[9px] font-bold bg-blue-500/20 text-blue-400 px-1 rounded flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Badge Bleu
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-400">Joueur Standard</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                {currentUser.hasBlueBadge
                  ? 'Compte certifié : accès prioritaire aux présentations'
                  : 'Publication de photo & texte autorisée'}
              </p>
            </div>
          </div>

          {/* Caption Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Description / Message :</label>
            <textarea
              required
              rows={3}
              placeholder="Racontez votre partie, votre record ou lancez un défi..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-950 border-slate-850 text-slate-100'
              }`}
            />
          </div>

          {/* Game Tag Chooser */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Jeu concerné :</label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['#CyberDash', '#QuantumMatrix', '#NeonDrift', '#TournoiSaison', '#eSport'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setGameTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    gameTag === tag
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Screenshot Preset Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">
              Sélectionnez une capture de gameplay :
            </label>
            <div className="grid grid-cols-2 gap-2">
              {screenshotPresets.map((preset) => {
                const isSelected = selectedImage === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedImage(preset.url)}
                    className={`relative rounded-2xl overflow-hidden border aspect-video group text-left transition-all ${
                      isSelected
                        ? 'ring-2 ring-amber-400 border-amber-400 shadow-md'
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-2 flex items-end">
                      <span className="text-[10px] font-bold text-white leading-tight">
                        {preset.title}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice note notice (as specified by user: voice notes reserved for live in-game multiplayer chats) */}
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
            <span className="text-amber-400">🎙️</span>
            <span>
              Les notes vocales sont réservées aux salons de chat en direct lors des parties coopératives.
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl font-black text-xs text-slate-950 shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: activeThemePreset.primaryColor }}
          >
            <Send className="w-4 h-4" />
            <span>Publier sur le Flux NEXORA</span>
          </button>
        </form>
      </div>
    </div>
  );
};
