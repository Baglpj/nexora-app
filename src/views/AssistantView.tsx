import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import { Bot, Send, Sparkles, Zap, Shield, HelpCircle, Loader2 } from 'lucide-react';

export const AssistantView: React.FC = () => {
  const { askAiAssistant, currentUser } = useNexora();
  const [messages, setMessages] = useState<{ sender: 'user' | 'aura'; text: string }[]>([
    {
      sender: 'aura',
      text: `Salutations ${currentUser?.username || 'Pilote'} ! Je suis **AURA**, votre intelligence artificielle d'assistance stratégique sur NEXORA.\n\nJe peux vous guider sur les tactiques de raid, l'optimisation de vos gains d'XP, la gestion de votre inventaire ou les règles des missions coopératives. Comment puis-je vous aider aujourd'hui ?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Comment maximiser mes gains d XP ?',
    'Quelle arme choisir dans mon inventaire ?',
    'Comment organiser un Raid Coop à 3 ?',
    'Quels sont les avantages du Pass VIP ?',
  ];

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg = text.trim();
    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    const reply = await askAiAssistant(userMsg);
    setMessages((prev) => [...prev, { sender: 'aura', text: reply }]);
    setIsLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-20 bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-sm text-slate-100">AURA — Copilote IA</h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1 rounded">
                Gemini 2.5
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Conseiller tactique et guide système NEXORA
            </span>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {m.sender === 'user' ? 'Moi' : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed max-w-[85%] whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AURA analyse les matrices de jeu...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2 border-t border-slate-800/80 bg-slate-900/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[11px]">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSubmit(qp)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(inputText);
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Poser une question à AURA (missions, XP, équipement)..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
