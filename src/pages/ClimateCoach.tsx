import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Bot, User } from 'lucide-react';

export const ClimateCoach: React.FC = () => {
  const { chatHistory, sendMessageToCoach, carbonDNA, setActiveTab } = useApp();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  if (!carbonDNA) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-slate-500 dark:text-slate-400 space-y-4">
        <p>No lifestyle profile found. Please run the onboarding scan first.</p>
        <button
          onClick={() => setActiveTab('onboarding')}
          className="px-6 py-2.5 bg-emerald-500 rounded-xl text-slate-950 font-bold"
        >
          Start Lifestyle Scan
        </button>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessageToCoach(input);
    setInput('');
  };

  const handlePreset = (text: string) => {
    sendMessageToCoach(text);
  };

  const presets = [
    { text: 'Explain my Carbon DNA profile', label: 'My Carbon DNA' },
    { text: 'What is my primary carbon hotspot?', label: 'My Hotspot' },
    { text: 'How do I save the most money?', label: 'Save Money' },
    { text: 'Suggest an easy daily habit swap', label: 'Easy Habit Swap' }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Climate Coach</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Get supportive, custom advice on how to improve your Carbon DNA profile and lower expenses.
        </p>
      </header>

      {/* Chat Interface Layout */}
      <div className="p-[1.5px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl glass-card bg-white/50 dark:bg-slate-900/40 max-w-4xl mx-auto overflow-hidden">
        <div className="h-[550px] flex flex-col justify-between">
          
          {/* Messages Window */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
            {chatHistory.map(msg => {
              const isCoach = msg.sender === 'coach';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 max-w-[85%] ${
                    isCoach ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                      isCoach
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-indigo-500/15 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    {isCoach ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isCoach
                          ? 'bg-slate-950/50 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="text-[10px] text-slate-500 text-right px-1">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Panel: Presets & Input Form */}
          <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/40 space-y-4">
            {/* Preset chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {presets.map((pr, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePreset(pr.text)}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:border-slate-700 transition-all font-semibold"
                >
                  {pr.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex gap-2.5">
              <input
                type="text"
                placeholder="Ask your coach anything about carbon, waste, or savings..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                required
              />
              <button
                type="submit"
                className="p-3 bg-emerald-500 rounded-2xl text-slate-950 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
