
import React from 'react';
import { BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 py-4 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-amber-600 p-2 rounded-lg text-white">
          <BookOpen size={24} />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
          Parables <span className="text-amber-600 italic">of the</span> Word
        </h1>
      </div>
      <div className="hidden md:block text-stone-500 font-medium italic">
        "He who has ears to hear, let him hear."
      </div>
    </header>
  );
};

export default Header;

