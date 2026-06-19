import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2 } from 'lucide-react';
import type { ReceiptItem } from '../types';

export const CarbonReceiptPage: React.FC = () => {
  const {
    dailyReceipts,
    addReceiptItem,
    deleteReceiptItem,
    resetReceiptToday
  } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ReceiptItem['category']>('transport');
  const [carbon, setCarbon] = useState('');
  const [cost, setCost] = useState('');

  const currentReceipt = dailyReceipts[0] || {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    items: [],
    totalCarbon: 0,
    totalCost: 0,
    biggestContributor: 'None',
    explanation: 'No logged receipt items.'
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addReceiptItem({
      name,
      category,
      carbon: parseFloat(carbon) || 0.1,
      cost: parseFloat(cost) || 0
    });

    setName('');
    setCarbon('');
    setCost('');
  };

  const handleQuickAdd = (preset: { name: string; category: ReceiptItem['category']; carbon: number; cost: number }) => {
    addReceiptItem(preset);
  };

  const presets = [
    { name: '10mi Solo Car Drive', category: 'transport' as const, carbon: 4.0, cost: 2.2 },
    { name: 'Red Meat Beef Meal', category: 'food' as const, carbon: 7.2, cost: 14.5 },
    { name: 'Veg Salad Bowl', category: 'food' as const, carbon: 0.6, cost: 9.0 },
    { name: 'App Courier Food Delivery', category: 'delivery' as const, carbon: 3.5, cost: 24.0 },
    { name: 'HD Video Stream (2 hrs)', category: 'digital' as const, carbon: 0.1, cost: 0.0 },
    { name: 'Online Package Order', category: 'shopping' as const, carbon: 12.0, cost: 35.0 }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Daily Carbon Receipt</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Log daily micro-decisions and inspect their itemized environmental cost.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Receipt Visualizer (Left Column, 6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 shadow-2xl relative border border-slate-200 overflow-hidden font-mono text-sm leading-relaxed">
            {/* Monospaced Receipt Layout */}
            {/* Top jagged cut design */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-slate-200 to-transparent opacity-10" />

            <div className="text-center space-y-2 border-b border-dashed border-slate-300 pb-4">
              <h3 className="font-extrabold text-lg uppercase tracking-wider">Carbon Mirror</h3>
              <p className="text-xs text-slate-500 uppercase">Lifestyle Receipt</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{currentReceipt.date}</p>
            </div>

            {/* Receipt Items List */}
            <div className="py-4 space-y-3 border-b border-dashed border-slate-300 min-h-[200px]">
              {currentReceipt.items.length === 0 ? (
                <div className="text-center text-slate-500 dark:text-slate-400 py-12 text-xs">
                  * NO ACTIVITIES LOGGED TODAY *
                </div>
              ) : (
                currentReceipt.items.map((item, index) => (
                  <div key={item.id} className="flex justify-between items-start text-xs group">
                    <div className="flex-grow pr-4">
                      <span>{index + 1}. {item.name}</span>
                      <span className="text-[9px] block text-slate-500 dark:text-slate-400 uppercase">[{item.category}]</span>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-2">
                      <div>
                        <span className="block font-bold text-slate-800">{item.carbon.toFixed(2)} kg</span>
                        {item.cost > 0 && <span className="block text-[9px] text-slate-500">${item.cost.toFixed(2)}</span>}
                      </div>
                      <button
                        onClick={() => deleteReceiptItem(item.id)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total Footer */}
            <div className="py-4 space-y-2 text-xs border-b border-dashed border-slate-300">
              <div className="flex justify-between font-extrabold text-sm">
                <span>TOTAL CO₂ ESTIMATE</span>
                <span className="text-emerald-600">{currentReceipt.totalCarbon.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-600">
                <span>TOTAL FINANCIAL COST</span>
                <span>${currentReceipt.totalCost.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-normal mt-2">
                * BIGGEST DRIVER: {currentReceipt.biggestContributor.toUpperCase()}
              </div>
            </div>

            {/* Receipt Barcode */}
            <div className="pt-6 text-center space-y-2">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                {currentReceipt.explanation}
              </p>
              <div className="w-48 h-8 bg-slate-900 mx-auto rounded overflow-hidden flex items-center justify-around px-2 opacity-80">
                {/* Simulated Monospace Barcode */}
                <span className="text-white text-[8px] tracking-[6px] font-black select-none">
                  ||||||||||| | ||| |||| |
                </span>
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400">
                MIRROR-ID: {Math.floor(100000 + Math.random() * 900000)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel (Right Column, 6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Custom Add Item Form */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Log Daily Activity</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Activity Name</label>
                <input
                  type="text"
                  placeholder="e.g. 15 miles hybrid car commute"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Carbon (kg CO₂)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.2"
                    value={carbon}
                    onChange={(e) => setCarbon(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Cost (USD $)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 5.50"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="transport">Transportation</option>
                  <option value="food">Dietary</option>
                  <option value="energy">Utilities</option>
                  <option value="shopping">Shopping</option>
                  <option value="delivery">Delivery</option>
                  <option value="digital">Digital</option>
                  <option value="waste">Waste</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-grow py-2.5 bg-emerald-500 rounded-xl text-slate-950 font-bold text-sm hover:scale-102 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Item</span>
                </button>
                <button
                  type="button"
                  onClick={resetReceiptToday}
                  className="px-4 py-2.5 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/5 rounded-xl text-xs font-bold transition-all"
                >
                  Clear All
                </button>
              </div>
            </form>
          </div>

          {/* Quick Add presets */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 glass-card space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Quick Log presets</h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map(item => (
                <button
                  key={item.name}
                  onClick={() => handleQuickAdd(item)}
                  className="p-3 text-left rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-xs transition-all flex justify-between items-center group"
                >
                  <div className="truncate pr-2">
                    <span className="block font-bold text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
                    <span className="text-[9px] text-slate-500 uppercase">{item.category}</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">
                    +
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
