
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ParableCard from './components/ParableCard';
import DetailView from './components/DetailView';
import { PARABLES } from './constants';
import { Parable } from './types';
import { Search, Filter, SortAsc } from 'lucide-react';

const App: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(PARABLES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGospel, setFilterGospel] = useState<string>('All');

  const filteredParables = useMemo(() => {
    return PARABLES.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.reference.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGospel = filterGospel === 'All' || p.gospels.includes(filterGospel);
      return matchesSearch && matchesGospel;
    });
  }, [searchQuery, filterGospel]);

  const selectedParable = useMemo(() => 
    PARABLES.find(p => p.id === selectedId) || PARABLES[0],
    [selectedId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-[380px] lg:w-[450px] border-r border-stone-200 bg-white flex flex-col shrink-0">
          <div className="p-4 border-b border-stone-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text"
                placeholder="Search parables..."
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button 
                onClick={() => setFilterGospel('All')}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterGospel === 'All' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                All Gospels
              </button>
              {['Matthew', 'Mark', 'Luke'].map(g => (
                <button
                  key={g}
                  onClick={() => setFilterGospel(g)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterGospel === g ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                {filteredParables.length} Parables Found
              </span>
              <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
                <SortAsc size={12} />
                Chronological
              </div>
            </div>
            
            {filteredParables.length > 0 ? (
              filteredParables.map(p => (
                <ParableCard 
                  key={p.id}
                  parable={p}
                  isSelected={selectedId === p.id}
                  onSelect={(p) => setSelectedId(p.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <div className="text-stone-300 mb-2">
                  <Search size={48} className="mx-auto opacity-20" />
                </div>
                <h3 className="text-stone-800 font-medium">No parables found</h3>
                <p className="text-stone-500 text-sm mt-1">Try a different search term or filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Content */}
        <div className="flex-1 bg-[#fcfaf7] relative overflow-hidden">
          {selectedParable ? (
            <DetailView parable={selectedParable} onNavigate={setSelectedId} />
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400 italic font-serif text-xl">
              Select a parable to begin exploring...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

