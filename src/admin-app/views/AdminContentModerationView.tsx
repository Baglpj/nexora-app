import React from 'react';
import { useNexora } from '../../context/NexoraContext';
import { Image, Trash2, Heart, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AdminContentModerationView: React.FC = () => {
  const { socialPosts, adminDeleteSocialPost } = useNexora();

  return (
    <div className="p-6 space-y-6 overflow-y-auto no-scrollbar pb-16">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
            <Image className="w-5 h-5 text-purple-400" />
            <span>MODÉRATION DU CONTENU SOCIAL & DES PHOTOS</span>
          </h2>
          <p className="text-xs text-slate-400">
            Supervision de toutes les publications du flux. Suppression irrévocable réservée au propriétaire.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-900 text-purple-300 border border-purple-500/30">
          {socialPosts.length} Publications Surveillées
        </span>
      </div>

      {/* Grid of Posts for Moderation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialPosts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 font-mono text-xs">
            Aucun post dans le flux.
          </div>
        ) : (
          socialPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-3xl bg-[#090d1a] border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Author Info */}
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-xs text-white">{post.authorName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {post.gameTag} • {post.timestamp}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    ID: {post.id}
                  </span>
                </div>

                {/* Media Image */}
                <div className="aspect-video bg-slate-950 overflow-hidden relative">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Caption & Stats */}
                <div className="p-3.5 space-y-2">
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {post.caption}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      {post.likesCount} likes
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.comments.length} comms
                    </span>
                  </div>
                </div>
              </div>

              {/* Moderation Action Button */}
              <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40">
                <button
                  onClick={() => adminDeleteSocialPost(post.id)}
                  className="w-full py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 text-rose-400 border border-rose-800/60 text-xs font-bold font-mono transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer Définitivement le Post</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
