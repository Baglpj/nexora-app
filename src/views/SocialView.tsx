import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  Users,
  MessageSquare,
  Flame,
  Mic,
  MicOff,
  Send,
  Heart,
  UserPlus,
  Sparkles,
  Check,
  Eye,
} from 'lucide-react';

export const SocialView: React.FC = () => {
  const {
    friends,
    statusPosts,
    chatMessages,
    sendChatMessage,
    postStatus,
    likeStatus,
    isMicMuted,
    toggleMic,
    currentUser,
    activeRole,
    colorMode,
    openInspectUser,
    showToast,
  } = useNexora();

  const isLight = colorMode === 'light';

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'friends' | 'statuses'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [newStatusInput, setNewStatusInput] = useState('');
  const [searchFriend, setSearchFriend] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim());
    setChatInput('');
  };

  const handlePublishStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusInput.trim()) return;
    postStatus(newStatusInput.trim());
    setNewStatusInput('');
  };

  const filteredFriends = friends.filter((f) =>
    f.username.toLowerCase().includes(searchFriend.toLowerCase())
  );

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden pb-20 transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Sub-tabs header */}
      <div
        className={`border-b p-2 flex items-center justify-around shrink-0 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'chat'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Tchat Général</span>
        </button>

        <button
          onClick={() => setActiveSubTab('friends')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'friends'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Amis ({friends.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('statuses')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'statuses'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Statuts & Actus</span>
        </button>
      </div>

      {/* Voice Room Interactive Banner */}
      <div
        className={`border-b px-4 py-2 flex items-center justify-between shrink-0 ${
          isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMic}
            className={`p-1.5 rounded-xl border transition-all ${
              isMicMuted
                ? isLight
                  ? 'bg-white border-slate-300 text-slate-500'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500 shadow-sm'
            }`}
            title="Activer/Couper micro vocal"
          >
            {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">
                Salon Vocal Escouade
              </span>
              {!isMicMuted && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              {isMicMuted ? 'Appuyez pour parler en direct' : 'Micro ouvert (4 joueurs connectés)'}
            </p>
          </div>
        </div>

        <span
          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
            !isMicMuted
              ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isMicMuted ? 'SILENCIEUX' : 'EN DIRECT'}
        </span>
      </div>

      {/* SUB-TAB 1: COMMUNITY CHAT */}
      {activeSubTab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden p-3">
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {chatMessages.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              const isAdmin = msg.senderRole === 'admin';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <button
                    onClick={() => openInspectUser(msg.senderName)}
                    className="shrink-0 group"
                    title={`Voir le profil de ${msg.senderName}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-500/40 group-hover:ring-amber-400 transition-all"
                    />
                  </button>
                  <div className={`flex flex-col max-w-[78%] ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <button
                        onClick={() => openInspectUser(msg.senderName)}
                        className="text-[11px] font-bold text-slate-400 hover:text-amber-500 transition-colors"
                      >
                        {msg.senderName}
                      </button>
                      {isAdmin && (
                        <span className="text-[9px] font-mono font-black bg-rose-500/20 text-rose-500 border border-rose-500/40 px-1 rounded">
                          ADMIN
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                          : isLight
                          ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleSendChat}
            className={`mt-2 flex gap-2 pt-2 border-t ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Écrire un message à la communauté..."
              className={`flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900'
                  : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: FRIENDS LIST */}
      {activeSubTab === 'friends' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Search bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchFriend}
              onChange={(e) => setSearchFriend(e.target.value)}
              placeholder="Rechercher un ami..."
              className={`flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900'
                  : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}
            />
            <button
              onClick={() => showToast('Recherche de profil lancée')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-700'
                  : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {filteredFriends.map((f) => (
              <div
                key={f.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div
                  onClick={() => openInspectUser(f)}
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={f.avatarUrl}
                      alt={f.username}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-500/40 group-hover:ring-amber-400 transition-all"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                        isLight ? 'border-white' : 'border-slate-900'
                      } ${f.isOnline ? 'bg-emerald-400' : 'bg-slate-400'}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs group-hover:text-amber-500 transition-colors">
                        {f.username}
                      </span>
                      <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-1 rounded">
                        Lv.{f.level}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      {f.currentActivity || (f.isOnline ? 'En ligne' : 'Hors ligne')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openInspectUser(f)}
                    className={`p-2 rounded-lg border transition-colors ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                    }`}
                    title="Voir le profil du joueur"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      sendChatMessage(`Salut @${f.username} ! Prêt pour un raid ?`);
                      setActiveSubTab('chat');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold shadow-sm transition-all"
                  >
                    Tchat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STATUSES & STORIES */}
      {activeSubTab === 'statuses' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Post status box */}
          <form
            onSubmit={handlePublishStatus}
            className={`border rounded-2xl p-3 space-y-2 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-wider block">
              Publier un statut gaming
            </span>
            <textarea
              value={newStatusInput}
              onChange={(e) => setNewStatusInput(e.target.value)}
              placeholder="Partagez un exploit, record ou cherchez des coéquipiers..."
              rows={2}
              className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500 resize-none ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900'
                  : 'bg-slate-950 border-slate-800 text-slate-100'
              }`}
            />
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-slate-400 font-mono">Visible par la communauté</span>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Partager
              </button>
            </div>
          </form>

          {/* Status feed */}
          <div className="space-y-3">
            {statusPosts.map((post) => (
              <div
                key={post.id}
                className={`border rounded-2xl p-3.5 space-y-2.5 ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => openInspectUser(post.userName)}
                    className="flex items-center gap-2.5 text-left group"
                    title={`Voir le profil de ${post.userName}`}
                  >
                    <img
                      src={post.userAvatar}
                      alt={post.userName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/40 group-hover:ring-amber-400 transition-all"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs group-hover:text-amber-500 transition-colors">
                          {post.userName}
                        </span>
                        {post.badge && (
                          <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-500 border border-amber-500/40 px-1.5 rounded">
                            {post.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{post.timestamp}</span>
                    </div>
                  </button>
                </div>

                <p className="text-xs leading-relaxed">{post.text}</p>

                <div
                  className={`flex items-center justify-between pt-1 border-t text-xs ${
                    isLight ? 'border-slate-200' : 'border-slate-800'
                  }`}
                >
                  <button
                    onClick={() => likeStatus(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      post.hasLiked
                        ? 'text-rose-500 bg-rose-500/10'
                        : isLight
                        ? 'text-slate-500 hover:text-rose-500'
                        : 'text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-rose-500' : ''}`} />
                    <span className="font-mono text-[11px]">{post.likes}</span>
                  </button>

                  <button
                    onClick={() => openInspectUser(post.userName)}
                    className="text-amber-500 hover:underline text-[11px] font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Voir profil</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
