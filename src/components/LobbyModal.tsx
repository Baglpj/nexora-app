import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import {
  Users,
  X,
  Mic,
  MicOff,
  Send,
  Play,
  Star,
  Trophy,
  Crown,
  Sparkles,
  ThumbsUp,
  Award,
  Gem,
  CheckCircle2,
  Clock,
  Flame,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const LobbyModal: React.FC = () => {
  const {
    activeLobbyMission,
    closeLobby,
    lobbyMembers,
    toggleLobbyReady,
    startPlayMission,
    isMicMuted,
    toggleMic,
    currentUser,
    friends,
    showToast,
    gameReviews,
    addGameReview,
    likeGameReview,
    tournaments,
    joinTournament,
    creators,
    creatorEarnings,
    claimCreatorRoyalties,
    followCreator,
    setSelectedCreatorForModal,
  } = useNexora();

  const [activeTab, setActiveTab] = useState<'play' | 'reviews' | 'tournament' | 'creator'>('play');

  // Chat in lobby
  const [lobbyChat, setLobbyChat] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Valkyrie_99', text: 'Je suis prête avec mon stuff Diamant !', time: '10:44' },
  ]);
  const [inputText, setInputText] = useState('');

  // Review form state
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Gameplay fluide']);
  const [selectedFilterRating, setSelectedFilterRating] = useState<number | 'all'>('all');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!activeLobbyMission) return null;

  // Matching game reviews
  const missionReviews = gameReviews.filter(
    (r) =>
      r.gameId === activeLobbyMission.id ||
      r.gameTitle.toLowerCase().includes(activeLobbyMission.title.toLowerCase()) ||
      activeLobbyMission.title.toLowerCase().includes(r.gameTitle.toLowerCase())
  );

  const averageRating =
    missionReviews.length > 0
      ? (missionReviews.reduce((sum, r) => sum + r.rating, 0) / missionReviews.length).toFixed(1)
      : '4.9';

  const filteredReviews = missionReviews.filter((r) => {
    if (selectedFilterRating === 'all') return true;
    return r.rating === selectedFilterRating;
  });

  // Matching tournament
  const activeTournament =
    tournaments.find(
      (t) =>
        t.gameId === activeLobbyMission.id ||
        activeLobbyMission.title.toLowerCase().includes(t.gameTitle.toLowerCase()) ||
        t.gameTitle.toLowerCase().includes(activeLobbyMission.title.toLowerCase())
    ) || tournaments[0];

  // Matching creator
  const matchedCreator =
    creators.find((c) =>
      c.gamesPublished.some(
        (g) =>
          g.id === activeLobbyMission.id ||
          activeLobbyMission.title.toLowerCase().includes(g.title.toLowerCase()) ||
          g.title.toLowerCase().includes(activeLobbyMission.title.toLowerCase())
      )
    ) || (activeLobbyMission.isCustom ? creators[0] : creators[1]);

  const isCurrentGameUserCreated =
    activeLobbyMission.isCustom ||
    matchedCreator.id === currentUser?.id ||
    matchedCreator.username === currentUser?.username;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLobbyChat((prev) => [
      ...prev,
      {
        sender: currentUser?.username || 'Moi',
        text: inputText.trim(),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
  };

  const inviteFriend = (friendName: string) => {
    showToast(`Invitation envoyée à ${friendName} !`);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Veuillez saisir un commentaire pour votre avis.');
      return;
    }
    setIsSubmittingReview(true);
    const success = await addGameReview({
      gameId: activeLobbyMission.id,
      gameTitle: activeLobbyMission.title,
      rating: ratingStars,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
      tags: selectedTags,
    });
    setIsSubmittingReview(false);
    if (success) {
      setReviewComment('');
      setReviewTitle('');
      setIsWritingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                NEXORA PLAY STORE · FICHE OFFICIELLE
              </span>
              <h3 className="font-bold text-sm text-slate-100 line-clamp-1">
                {activeLobbyMission.title}
              </h3>
            </div>
          </div>

          <button
            onClick={closeLobby}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Navigation Tabs */}
        <div className="grid grid-cols-4 bg-slate-950/70 border-b border-slate-800 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('play')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'play'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Jouer</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Avis ({missionReviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tournament')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'tournament'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Tournoi</span>
          </button>

          <button
            onClick={() => setActiveTab('creator')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'creator'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Créateur VIP</span>
          </button>
        </div>

        {/* Tab 1: PLAY & COOP SQUAD */}
        {activeTab === 'play' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Mission specs strip */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Escouade max : <strong className="text-slate-200">{activeLobbyMission.maxPlayers} Joueurs</strong>
              </span>
              <span className="text-slate-400">
                Difficulté : <strong className="text-amber-400">{activeLobbyMission.difficulty}</strong>
              </span>
              <span className="text-slate-400">
                Butin XP : <strong className="text-emerald-400">+{activeLobbyMission.reward.xp}</strong>
              </span>
            </div>

            {/* Quick Game Description */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeLobbyMission.description}
              </p>
            </div>

            {/* Members list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                <span>Membres de l'escouade ({lobbyMembers.length}/{activeLobbyMission.maxPlayers})</span>
                <span className="text-amber-400 text-[11px]">En attente de confirmation</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {lobbyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100'}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                          {member.name}
                          {member.id === currentUser?.id && (
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">Vous</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{member.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          member.ready
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                        }`}
                      >
                        {member.ready ? 'PRÊT' : 'EN ATTENTE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick invite friends */}
            {lobbyMembers.length < activeLobbyMission.maxPlayers && (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <span className="text-xs text-slate-400 font-medium block mb-2">
                  Inviter un joueur en ligne :
                </span>
                <div className="flex flex-wrap gap-2">
                  {friends.filter((f) => f.isOnline).map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => inviteFriend(friend.username)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{friend.username}</span>
                      <span className="text-amber-400 font-bold ml-1">+ Inviter</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Voice Chat status bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={toggleMic}
                  className={`p-2 rounded-lg border transition-all ${
                    isMicMuted
                      ? 'bg-slate-800 border-slate-700 text-slate-400'
                      : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  }`}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Salon Vocal Sécurisé</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isMicMuted ? 'Microphone en sourdine' : 'Transmission active (Faible latence)'}
                  </span>
                </div>
              </div>

              {/* Audio wave simulation */}
              <div className="flex items-center gap-1">
                {[40, 70, 30, 90, 60, 45].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all ${
                      isMicMuted ? 'bg-slate-800 h-2' : 'bg-emerald-400 animate-pulse'
                    }`}
                    style={{ height: isMicMuted ? '6px' : `${h * 0.22}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Lobby In-Game Chat */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col h-32">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 block">
                Tchat d'avant-mission
              </span>
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-xs">
                {lobbyChat.map((m, idx) => (
                  <div key={idx} className="flex items-baseline gap-1.5">
                    <span className="font-bold text-amber-400 text-[11px] shrink-0">{m.sender} :</span>
                    <span className="text-slate-300 text-[11px]">{m.text}</span>
                    <span className="text-[9px] text-slate-500 ml-auto shrink-0">{m.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="mt-2 flex gap-1.5">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Écrire un message d'escouade..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="p-1.5 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: REVIEWS & RATINGS */}
        {activeTab === 'reviews' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Top Score Banner */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-amber-400 font-mono leading-none">
                    {averageRating}
                  </span>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(Number(averageRating))
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">
                    {missionReviews.length} avis vérifiés
                  </span>
                </div>

                <div className="border-l border-slate-800 pl-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-0.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>98% des joueurs recommandent ce jeu</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Notation calculée selon les retours en jeu des membres actifs de la communauté NEXORA.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsWritingReview((prev) => !prev)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0 active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isWritingReview ? 'Fermer' : 'Donner mon avis (+75 XP)'}</span>
              </button>
            </div>

            {/* Interactive Review Writing Form */}
            {isWritingReview && (
              <form
                onSubmit={handleSubmitReview}
                className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 space-y-3 shadow-xl animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-current" />
                    Rédiger votre évaluation
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +75 XP · +50 Pièces
                  </span>
                </div>

                {/* Star Selector */}
                <div>
                  <span className="text-xs text-slate-400 block mb-1.5">Votre note :</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingStars(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= ratingStars
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-300 ml-2 font-mono">
                      {ratingStars === 5
                        ? 'Exceptionnel ! 🔥'
                        : ratingStars === 4
                        ? 'Très bon jeu ⭐'
                        : ratingStars === 3
                        ? 'Sympa 👍'
                        : ratingStars === 2
                        ? 'À améliorer'
                        : 'Décevant'}
                    </span>
                  </div>
                </div>

                {/* Quick Tags */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Tags rapides :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Gameplay fluide',
                      'Bande-son épique',
                      'Challenge relevé',
                      'Addictif',
                      'Graphismes superbes',
                      'Coop palpitant',
                    ].map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {selectedTags.includes(tag) ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Titre de votre avis (ex: Une pépite arcade !)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Comment */}
                <div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Partagez votre expérience de jeu, les points forts et vos conseils tactiques..."
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingReview ? 'Envoi...' : 'Publier mon avis'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
              <span className="text-slate-500 text-[11px] font-mono mr-1">Filtrer :</span>
              {['all', 5, 4, 3].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilterRating(f as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    selectedFilterRating === f
                      ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f === 'all' ? 'Tous les avis' : `${f} ★`}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {filteredReviews.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400">
                    Aucun avis pour ce filtre. Soyez le premier à donner votre note !
                  </p>
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-3.5 space-y-2 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.authorAvatar}
                          alt={rev.authorName}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-100">
                              {rev.authorName}
                            </span>
                            {rev.verifiedPlayer && (
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Joueur Vérifié
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {rev.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Title */}
                    {rev.title && (
                      <h5 className="text-xs font-bold text-slate-200">{rev.title}</h5>
                    )}

                    {/* Comment */}
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                    {/* Tags & Like Button */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                      <div className="flex flex-wrap gap-1">
                        {rev.tags?.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => likeGameReview(rev.id)}
                        className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-colors ${
                          rev.hasLiked
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Utile ({rev.likes})</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: TOURNAMENT & LEADERBOARD */}
        {activeTab === 'tournament' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Tournament Hero Card */}
            <div className="bg-gradient-to-br from-amber-500/20 via-purple-900/20 to-slate-950 border border-amber-500/40 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400 fill-current" />
                  SAISON {activeTournament.season}
                </span>

                <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Fin dans {activeTournament.endsIn}
                </span>
              </div>

              <h4 className="text-sm font-black text-white mb-1">{activeTournament.title}</h4>
              <p className="text-xs text-slate-300 mb-3">{activeTournament.description}</p>

              {/* Prize Pool & Fee */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Cagnotte Globale</span>
                  <span className="text-base font-black text-cyan-300 font-mono flex items-center gap-1">
                    <Gem className="w-4 h-4 text-cyan-400 fill-current" />
                    {activeTournament.prizePoolGems.toLocaleString()} 💎
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Frais d'inscription</span>
                  <span className="text-base font-black text-amber-300 font-mono">
                    {activeTournament.entryFeeCoins} 🪙
                  </span>
                </div>
              </div>

              {/* Inscription / Status Button */}
              {activeTournament.hasJoined ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-emerald-400 block">
                        Vous participez à ce tournoi !
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Votre rang : #{activeTournament.userRank || 4} · Record :{' '}
                        {activeTournament.userBestScore?.toLocaleString() || '48 920'} pts
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => startPlayMission(activeLobbyMission)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-colors"
                  >
                    Améliorer Score
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => joinTournament(activeTournament.id)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>S'inscrire au Tournoi ({activeTournament.entryFeeCoins} 🪙)</span>
                </button>
              )}
            </div>

            {/* Podium & Leaderboard */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Classement Actuel des Pilotes</span>
              </h5>

              <div className="space-y-1.5">
                {activeTournament.leaderboard.map((entry) => {
                  const isTop1 = entry.rank === 1;
                  const isTop2 = entry.rank === 2;
                  const isTop3 = entry.rank === 3;
                  return (
                    <div
                      key={entry.userId}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                        entry.isCurrentUser
                          ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 text-center font-mono font-black text-xs ${
                            isTop1
                              ? 'text-amber-400'
                              : isTop2
                              ? 'text-slate-300'
                              : isTop3
                              ? 'text-amber-600'
                              : 'text-slate-500'
                          }`}
                        >
                          #{entry.rank}
                        </span>

                        <img
                          src={entry.avatarUrl}
                          alt={entry.username}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800"
                        />

                        <div>
                          <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
                            {entry.username}
                            {entry.isCurrentUser && (
                              <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1 rounded">
                                Vous
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {entry.score.toLocaleString()} pts
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-cyan-300 font-mono flex items-center gap-0.5 justify-end">
                          +{entry.rewardGems} 💎
                        </span>
                        <span className="text-[9px] text-slate-500">gain estimé</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: VIP CREATOR SHOWCASE */}
        {activeTab === 'creator' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Creator Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={matchedCreator.avatarUrl}
                      alt={matchedCreator.username}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/40"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 bg-amber-500 rounded-md text-slate-950">
                      <Crown className="w-3 h-3 fill-current" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">{matchedCreator.username}</h4>
                      {matchedCreator.verifiedBadge && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                    <span className="text-xs text-amber-400 font-semibold block">
                      {matchedCreator.studioName}
                    </span>
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.2 rounded-full border border-amber-500/30 font-bold inline-block mt-0.5">
                      Membre VIP {matchedCreator.vipTier}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => followCreator(matchedCreator.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    matchedCreator.isFollowing
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>{matchedCreator.isFollowing ? 'Abonné' : '+ Suivre'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                {matchedCreator.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Abonnés</span>
                  <span className="font-bold text-slate-100 font-mono">
                    {matchedCreator.followersCount.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Parties</span>
                  <span className="font-bold text-cyan-400 font-mono">
                    {matchedCreator.totalPlays.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Note</span>
                  <span className="font-bold text-amber-400 font-mono flex items-center justify-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    {matchedCreator.averageRating}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCreatorForModal(matchedCreator)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Voir la vitrine complète du studio créateur</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* If user is the creator: Monetization & Royalties Panel */}
            {isCurrentGameUserCreated && (
              <div className="bg-gradient-to-br from-amber-500/20 via-slate-950 to-slate-950 border border-amber-500/40 rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <Gem className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Vos Royalties Créateur VIP</h4>
                      <span className="text-[10px] text-slate-400">
                        +5 💎 par session jouée sur votre création
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Gains en attente</span>
                    <span className="text-base font-black text-cyan-300 font-mono flex items-center gap-1 justify-end">
                      <Gem className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                      +{creatorEarnings.pendingGems} 💎
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Total Encaissé</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {creatorEarnings.totalEarnedGems.toLocaleString()} 💎
                    </span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Sessions Jouées</span>
                    <span className="font-bold text-cyan-400 font-mono">
                      {creatorEarnings.sessionsPlayed.toLocaleString()} parties
                    </span>
                  </div>
                </div>

                <button
                  onClick={claimCreatorRoyalties}
                  disabled={creatorEarnings.pendingGems <= 0}
                  className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    creatorEarnings.pendingGems > 0
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>
                    {creatorEarnings.pendingGems > 0
                      ? `Encaisser mes ${creatorEarnings.pendingGems} Gemmes vers mon solde`
                      : 'Aucun gain en attente'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions (Always visible) */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={toggleLobbyReady}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            Changer Statut Prêt
          </button>

          <button
            onClick={() => startPlayMission(activeLobbyMission)}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black tracking-wider uppercase transition-all shadow-lg shadow-amber-500/30 hover:brightness-110 flex items-center justify-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-current" />
            Lancer le Jeu
          </button>
        </div>
      </div>
    </div>
  );
};
