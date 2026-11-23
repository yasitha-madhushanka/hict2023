import React from 'react';
import { Cake, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onOpenUploader: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, onOpenUploader }) => {
  return (
    <footer className="w-full mt-24 border-t border-slate-800/80 bg-slate-950/60 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Cake className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            HICT 23/24 Birthday Celebrations
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <button
            onClick={onOpenUploader}
            className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage Posters</span>
          </button>
          <button
            onClick={onScrollToTop}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Back to Top
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for the HICT 23/24 Academic Batch</span>
        </div>
      </div>
    </footer>
  );
};
