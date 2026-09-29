import React, { useState } from 'react';
import { useNexora } from '../../context/NexoraContext';
import {
  Heart,
  MessageCircle,
  Share2,
  CheckCircle2,
  Send,
  MoreVertical,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { SocialFeedPost } from '../../types/nexora';

interface SocialFeedCardProps {
  post: SocialFeedPost;
}

export const SocialFeedCard: React.FC<SocialFeedCardProps> = ({ post }) => {
  const { toggleLikeSocialPost, addCommentToSocialPost, colorMode, showToast, activeThemePreset } =
    useNexora();

  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const isLight = colorMode === 'light';

  const handleLike = () => {
    setIsHeartAnimating(true);
    toggleLikeSocialPost(post.id);
    setTimeout(() => setIsHeartAnimating(false), 600);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addCommentToSocialPost(post.id, commentText);
      setCommentText('');
    }
  };

  const handleShare = () => {
    showToast('Lien de la publication copié dans le presse-papier !');
  };

  return (
    <article
      className={`rounded-3xl border overflow-hidden transition-all duration-300 shadow-xl ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200'
          : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/40'
      }`}
    >
      {/* Post Author Bar */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800 shadow"
            />
            {post.hasBlueBadge && (
              <span
                className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white rounded-full p-0.5 shadow"
                title="Badge Bleu Vérifié"
              >
                <CheckCircle2 className="w-2.5 h-2.5 fill-blue-500 text-white" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-xs text-white">{post.authorName}</h4>
              {post.hasBlueBadge && (
                <span className="text-[9px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1 py-0.2 rounded">
                  VIP
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span
                className="font-bold font-mono"
                style={{ color: activeThemePreset.primaryColor }}
              >
                {post.gameTag}
              </span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200"
          title="Partager"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Media Image / Gameplay Capture */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden group">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay Game Badge */}
        {post.gameTitle && (
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-300 shadow-lg">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{post.gameTitle}</span>
          </div>
        )}

        {/* Dynamic Double-Tap Heart Animation */}
        {isHeartAnimating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none animate-ping">
            <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-xl" />
          </div>
        )}
      </div>

      {/* Action Bar (Like, Comment, Share, Bookmark) */}
      <div className="p-3.5 pb-2">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-3">
            {/* Heart Button */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs font-bold active:scale-125 transition-transform"
              title="Aimer"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  post.likedByCurrentUser
                    ? 'text-rose-500 fill-rose-500 scale-110'
                    : 'text-slate-300 hover:text-rose-400'
                }`}
              />
              <span className="font-mono text-xs text-slate-300 font-bold">
                {post.likesCount}
              </span>
            </button>

            {/* Comment Toggle */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-slate-100 transition-colors"
              title="Commentaires"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-mono text-xs">{post.comments.length}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="text-slate-300 hover:text-slate-100 transition-colors"
              title="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => showToast('Post sauvegardé dans vos favoris !')}
            className="text-slate-400 hover:text-amber-400"
            title="Enregistrer"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs leading-relaxed text-slate-200">
          <strong className="text-white mr-1.5">{post.authorName}</strong>
          {post.caption}
        </p>

        {/* View all comments link */}
        {post.comments.length > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-[11px] text-slate-400 hover:text-slate-300 mt-1 block font-medium"
          >
            Afficher les {post.comments.length} commentaire{post.comments.length > 1 ? 's' : ''}...
          </button>
        )}
      </div>

      {/* Comments Drawer / Thread */}
      {showComments && (
        <div className="px-3.5 pb-3 border-t border-slate-800/60 pt-2 space-y-2 text-xs animate-fade-in">
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {post.comments.length === 0 ? (
              <p className="text-[11px] text-slate-500 py-2">Soyez le premier à commenter ce post !</p>
            ) : (
              post.comments.map((comm) => (
                <div key={comm.id} className="flex items-start gap-2">
                  <img
                    src={comm.authorAvatar}
                    alt={comm.authorName}
                    className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0 bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-slate-200">{comm.authorName}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{comm.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{comm.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Comment Input */}
          <form onSubmit={handleSendComment} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Ajouter un commentaire sympa..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={`flex-1 px-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-950 border-slate-800 text-slate-100'
              }`}
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3 py-1.5 rounded-xl font-bold text-xs text-slate-950 disabled:opacity-40"
              style={{ backgroundColor: activeThemePreset.primaryColor }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
