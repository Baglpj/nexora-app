import React from 'react';
import { MessageCircle, Search, Users, ShieldCheck } from 'lucide-react';
import { useNexora } from '../../context/NexoraContext';

const conversations = [
  { name: 'Équipe Kokiko', message: 'Le nouveau défi commence demain.', time: '09:42', unread: 3, color: 'from-violet-500 to-fuchsia-500' },
  { name: 'Aïcha Gaming', message: 'Tu as vu le classement ?', time: 'Hier', unread: 0, color: 'from-cyan-400 to-blue-500' },
  { name: 'Support Mon Kokiko', message: 'Bienvenue sur la plateforme.', time: 'Lun', unread: 1, color: 'from-amber-400 to-orange-500' },
];

export const UserMessagesView: React.FC = () => {
  const { colorMode, activeThemePreset } = useNexora();
  const isLight = colorMode === 'light';

  return (
    <section className="flex-1 overflow-y-auto px-4 pb-6">
      <div className="flex items-center justify-between py-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: activeThemePreset.primaryColor }}>Communauté</p>
          <h1 className={`text-2xl font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>Messages</h1>
        </div>
        <button className={`rounded-xl border p-2.5 ${isLight ? 'border-slate-200 bg-white text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-200'}`} aria-label="Rechercher une conversation"><Search className="size-4" /></button>
      </div>
      <div className={`mb-4 flex items-center gap-3 rounded-2xl border p-3 ${isLight ? 'border-violet-100 bg-violet-50' : 'border-violet-500/20 bg-violet-500/10'}`}>
        <div className="rounded-xl bg-violet-500/15 p-2 text-violet-500"><ShieldCheck className="size-5" /></div>
        <div className="flex-1"><p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Messages de l’équipe</p><p className="text-[11px] text-slate-500">Les annonces de tes jeux sont ici.</p></div>
        <Users className="size-4 text-slate-400" />
      </div>
      <div className="flex flex-col gap-2">
        {conversations.map((conversation) => (
          <button key={conversation.name} className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-transform active:scale-[.98] ${isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-slate-900/80'}`}>
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${conversation.color} text-sm font-black text-white`}>{conversation.name.slice(0, 1)}</div>
            <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className={`truncate text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{conversation.name}</p><span className="text-[10px] text-slate-400">{conversation.time}</span></div><p className="truncate text-xs text-slate-500">{conversation.message}</p></div>
            {conversation.unread > 0 && <span className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: activeThemePreset.primaryColor }}>{conversation.unread}</span>}
          </button>
        ))}
      </div>
      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white shadow-lg" style={{ backgroundColor: activeThemePreset.primaryColor }}><MessageCircle className="size-4" /> Nouvelle conversation</button>
    </section>
  );
};
