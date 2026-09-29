import React, { useState } from 'react';
import { useNexora } from '../context/NexoraContext';
import { Item } from '../types/nexora';
import { Briefcase, Shield, Zap, Sparkles, Check, DollarSign, Trash2 } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { currentUser, equipItem, sellItem, showToast } = useNexora();
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  if (!currentUser) return null;

  const inventory = currentUser.inventory;

  const categories = ['Toutes', 'Arme', 'Armure', 'Consommable', 'Skin', 'Titre'];

  const filteredItems = inventory.filter((item) => {
    if (selectedCategory === 'Toutes') return true;
    return item.category === selectedCategory;
  });

  const handleSell = async (item: Item) => {
    if (window.confirm(`Confirmer la vente de "${item.name}" pour ${Math.round(item.valueCoins * 0.7)} Pièces NEX ?`)) {
      await sellItem(item.id);
      if (selectedItem?.id === item.id) setSelectedItem(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
      {/* Header & Storage Capacity */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            Sac à Dos & Arsenal
          </h2>
          <p className="text-xs text-slate-400">
            Équipez vos armes plasma et gérez vos récompenses de mission.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl text-xs font-mono text-slate-300">
          Stockage : <strong className="text-amber-400">{inventory.length} / 50</strong>
        </div>
      </div>

      {/* Category filter buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            Aucun objet dans cette catégorie. Complétez des missions pour en trouver !
          </div>
        ) : (
          filteredItems.map((item) => {
            const isEquipped = item.isEquipped;
            const isSelected = selectedItem?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`relative p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                {/* Equipped Badge */}
                {isEquipped && (
                  <span className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow">
                    ÉQUIPÉ
                  </span>
                )}

                <div className="flex flex-col items-center text-center my-2">
                  <span className="text-3xl mb-1 filter drop-shadow-md">{item.icon}</span>
                  <span className="font-bold text-xs text-slate-100 line-clamp-1">{item.name}</span>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      item.rarity === 'Légendaire'
                        ? 'text-amber-400'
                        : item.rarity === 'Épique'
                        ? 'text-purple-400'
                        : item.rarity === 'Rare'
                        ? 'text-cyan-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.rarity}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                  <span>{item.category}</span>
                  <span className="text-amber-300 font-bold">{item.valueCoins} 🪙</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Item Detail Panel */}
      {selectedItem && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 bg-slate-950 rounded-2xl border border-slate-800">
                {selectedItem.icon}
              </span>
              <div>
                <h3 className="font-black text-sm text-slate-100">{selectedItem.name}</h3>
                <span className="text-xs text-amber-400 font-mono font-semibold">
                  {selectedItem.rarity} • {selectedItem.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="text-slate-500 hover:text-slate-200 text-xs"
            >
              Fermer
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            {selectedItem.description}
          </p>

          {/* Stats */}
          {selectedItem.stats && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {selectedItem.stats.attack && (
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Attaque :</span>
                  <span className="font-mono font-bold text-rose-400">+{selectedItem.stats.attack}</span>
                </div>
              )}
              {selectedItem.stats.defense && (
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Défense :</span>
                  <span className="font-mono font-bold text-cyan-400">+{selectedItem.stats.defense}</span>
                </div>
              )}
              {selectedItem.stats.speed && (
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Vitesse :</span>
                  <span className="font-mono font-bold text-emerald-400">+{selectedItem.stats.speed}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions: Equip and Sell */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => equipItem(selectedItem.id)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                selectedItem.isEquipped
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {selectedItem.isEquipped ? 'Déséquiper' : 'Équiper l Objet'}
            </button>

            <button
              onClick={() => handleSell(selectedItem)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 hover:border-rose-500/50 text-xs font-bold transition-all flex items-center gap-1"
              title="Vendre au marché pour des pièces"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Vendre (+{Math.round(selectedItem.valueCoins * 0.7)} 🪙)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
