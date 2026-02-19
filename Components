
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Parable, ParableInsights, ChatMessage } from '../types';
import { fetchParableInsights, chatAboutParable } from '../services/geminiService';
import { PARABLES } from '../constants';
import { Loader2, Sparkles, MessageCircle, Send, ScrollText, History, Lightbulb, Book, Layers, ChevronRight } from 'lucide-react';

interface DetailViewProps {
  parable: Parable;
  onNavigate: (id: string) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ parable, onNavigate }) => {
  const [insights, setInsights] = useState<ParableInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter related parables based on shared gospels and proximity in chronological order
  const relatedParables = useMemo(() => {
    return PARABLES.filter(p => {
      if (p.id === parable.id) return false;
      const sharesGospel = p.gospels.some(g => parable.gospels.includes(g));
      const isProximate = Math.abs(p.order - parable.order) <= 5;
      return sharesGospel || isProximate;
    })
    .sort((a, b) => {
      // Prioritize shared gospels, then chronological proximity
      const aGospelOverlap = a.gospels.filter(g => parable.gospels.includes(g)).length;
      const bGospelOverlap = b.gospels.filter(g => parable.gospels.includes(g)).length;
      if (aGospelOverlap !== bGospelOverlap) return bGospelOverlap - aGospelOverlap;
      return Math.abs(a.order - parable.order) - Math.abs(b.order - parable.order);
    })
    .slice(0, 4);
  }, [parable]);

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      setInsights(null);
      setChatHistory([]);
      try {
        const data = await fetchParableInsights(parable);
        setInsights(data);
      } catch (error) {
        console.error("Failed to load insights", error);
      } finally {
        setLoading(false);
        // Reset scroll position when parable changes
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    loadInsights();
  }, [parable]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setChatLoading(true);

    try {
      const response = await chatAboutParable(parable, input, chatHistory);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-stone-400">
        <Loader2 className="animate-spin mb-4 text-amber-600" size={48} />
        <p className="text-xl font-serif italic">Gathering wisdom from the Word...</p>
        <p className="text-sm mt-2 opacity-60">Consulting {parable.reference}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="p-6 md:p-8 border-b border-stone-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            PARABLE {parable.order} OF 55
          </span>
          {parable.gospels.map(g => (
            <span key={g} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-stone-100 text-stone-600 rounded">
              {g}
            </span>
          ))}
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-1 leading-tight">{parable.title}</h2>
        <p className="text-amber-700 font-medium italic flex items-center gap-2">
          <Book size={16} /> {parable.reference}
        </p>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 pb-32">
        {insights && (
          <div className="space-y-10 max-w-4xl mx-auto">
            {/* Scripture Section */}
            <section className="bg-stone-50 border-l-4 border-stone-300 p-8 rounded-r-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-stone-500 font-bold uppercase text-xs tracking-widest">
                <ScrollText size={16} />
                The Holy Scripture
              </div>
              <div className="text-stone-800 font-serif text-xl leading-relaxed italic whitespace-pre-line">
                {insights.scriptureText}
              </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-1">
              {/* Interpretation Section */}
              <section className="parchment p-8 rounded-2xl border border-stone-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-20" />
                <div className="flex items-center gap-2 mb-4 text-amber-800">
                  <Sparkles size={20} />
                  <h3 className="text-xl font-serif font-bold">Divine Interpretation</h3>
                </div>
                <p className="text-stone-700 leading-relaxed text-lg first-letter:text-5xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-amber-800 first-letter:leading-none">
                  {insights.interpretation}
                </p>
              </section>

              {/* Clarification & Historical Context */}
              <section className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 mb-4 text-blue-800">
                  <History size={20} />
                  <h3 className="text-xl font-serif font-bold">Historical & Cultural Context</h3>
                </div>
                <p className="text-stone-700 leading-relaxed italic text-lg">
                  {insights.clarification}
                </p>
              </section>

              {/* Modern Example Section */}
              <section className="bg-emerald-50/50 p-8 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800">
                  <Lightbulb size={20} />
                  <h3 className="text-xl font-serif font-bold">Modern Application</h3>
                </div>
                <div className="text-stone-700 leading-relaxed text-lg font-medium p-4 bg-white/50 rounded-xl border border-emerald-200/50">
                  {insights.modernExample}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Related Parables Section */}
        {relatedParables.length > 0 && (
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-stone-100 p-2.5 rounded-xl text-stone-600">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-stone-900">Related Teachings</h3>
                <p className="text-sm text-stone-500">Explore similar themes across the Gospels.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedParables.map(rp => (
                <button
                  key={rp.id}
                  onClick={() => onNavigate(rp.id)}
                  className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-2xl hover:border-amber-400 hover:shadow-md transition-all group text-left"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                        #{rp.order}
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold uppercase truncate">
                        {rp.reference}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-stone-800 truncate group-hover:text-amber-700 transition-colors">
                      {rp.title}
                    </h4>
                  </div>
                  <ChevronRight size={18} className="text-stone-300 group-hover:text-amber-500 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Conversation Space */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-600 p-2.5 rounded-xl text-white shadow-lg shadow-amber-200">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">Spiritual Dialogue</h3>
              <p className="text-sm text-stone-500">Ask the AI Scholar for deeper clarity on this parable.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden mb-4">
            <div className="max-h-[500px] overflow-y-auto p-6 space-y-6 bg-stone-50/30">
              {chatHistory.length === 0 && (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="text-amber-600" size={32} />
                  </div>
                  <h4 className="text-stone-800 font-serif font-bold text-lg mb-2">Seek and ye shall find</h4>
                  <p className="text-stone-500 italic max-w-xs mx-auto">
                    "Open thou mine eyes, that I may behold wondrous things out of thy law."
                  </p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-stone-800 text-white rounded-br-none shadow-md' 
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'
                  }`}>
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 px-5 py-3 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-stone-100 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the meaning or original Greek text..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || chatLoading}
                className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white p-3 rounded-2xl transition-all shadow-lg shadow-amber-200 hover:scale-105 active:scale-95"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;

