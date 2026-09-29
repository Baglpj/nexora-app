import React, { useState } from 'react';
import { useNexora } from '../../context/NexoraContext';
import { SocialFeedCard } from '../components/SocialFeedCard';
import { Plus, Flame, Sparkles, Filter, Hash } from 'lucide-react';

export const UserFeedView: React.FC = () => {
  const { socialPosts, setIsCreatePostModalOpen, colorMode, activeThemePreset } = useNexora();

  const [activeTagFilter, setActiveTagFilter] = useState<string>('Tous');

  const tags = ['Tous', '#CyberDash', '#QuantumMatrix', '#TournoiSaison', '#eSport'];

  const filteredPosts = socialPosts.filter((post) => {
    if (activeTagFilter === 'Tous') return true;
    return post.gameTag.toLowerCase() === activeTagFilter.toLowerCase();
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-16">
      {/* Top Banner with "+ Publier" */}
      <div className="p-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shadow-xl flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
            <h2 className="font-black text-sm text-white">Flux Social Communautaire</h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Partages de gameplay, records et moments épiques entre joueurs
          </p>
        </div>

        <button
          onClick={() => setIsCreatePostModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black text-slate-950 shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
          style={{ backgroundColor: activeThemePreset.primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Publier</span>
        </button>
      </div>

      {/* Hashtag Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <Hash className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTagFilter(tag)}
            className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTagFilter === tag
                ? 'text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
            style={{
              backgroundColor: activeTagFilter === tag ? activeThemePreset.primaryColor : undefined,
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Post Cards List */}
      <div className="space-y-4 max-w-lg mx-auto">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-xs">Aucune publication dans cette catégorie pour le moment.</p>
            <button
              onClick={() => setIsCreatePostModalOpen(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-amber-400 text-xs font-bold"
            >
              Soyez le premier à poster !
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => <SocialFeedCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};
