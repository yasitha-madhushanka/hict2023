import React, { useState, useEffect, useMemo } from 'react';
import { Student, formatBirthday } from '../data/students';
import { getPosterBlob, getCandidateImageUrls } from '../utils/posterStore';
import { Sparkles, Cake, PartyPopper } from 'lucide-react';

interface BirthdayPosterProps {
  student: Student;
  className?: string;
  isHero?: boolean;
  onOpenLightbox?: () => void;
  customBlobUrl?: string; // If already resolved or newly uploaded
}

// Visual themes for stylish fallbacks based on month/season
const THEMES = [
  { bg: 'from-amber-600 via-rose-700 to-purple-900', accent: '#f59e0b', ring: 'border-amber-400/40' },      // Jan
  { bg: 'from-pink-600 via-rose-600 to-indigo-900', accent: '#ec4899', ring: 'border-pink-400/40' },        // Feb
  { bg: 'from-emerald-600 via-teal-700 to-slate-900', accent: '#10b981', ring: 'border-emerald-400/40' },  // Mar
  { bg: 'from-blue-600 via-indigo-700 to-purple-900', accent: '#3b82f6', ring: 'border-blue-400/40' },      // Apr
  { bg: 'from-violet-600 via-purple-700 to-slate-950', accent: '#8b5cf6', ring: 'border-purple-400/40' },   // May
  { bg: 'from-amber-500 via-orange-600 to-rose-900', accent: '#f97316', ring: 'border-amber-400/40' },      // Jun
  { bg: 'from-fuchsia-600 via-pink-600 to-purple-900', accent: '#d946ef', ring: 'border-fuchsia-400/40' },   // Jul
  { bg: 'from-yellow-500 via-amber-600 to-stone-900', accent: '#eab308', ring: 'border-yellow-400/40' },    // Aug
  { bg: 'from-teal-600 via-cyan-700 to-blue-950', accent: '#06b6d4', ring: 'border-teal-400/40' },          // Sep
  { bg: 'from-orange-600 via-amber-700 to-zinc-900', accent: '#ea580c', ring: 'border-orange-400/40' },     // Oct
  { bg: 'from-indigo-600 via-blue-700 to-slate-950', accent: '#6366f1', ring: 'border-indigo-400/40' },     // Nov
  { bg: 'from-rose-600 via-red-700 to-slate-950', accent: '#ef4444', ring: 'border-rose-400/40' },          // Dec
];

export const BirthdayPoster: React.FC<BirthdayPosterProps> = ({
  student,
  className = '',
  isHero = false,
  onOpenLightbox,
  customBlobUrl,
}) => {
  const candidates = useMemo(
    () => getCandidateImageUrls(student.id, customBlobUrl),
    [student.id, customBlobUrl]
  );

  const [resolvedSrc, setResolvedSrc] = useState<string | null>(candidates[0] || null);
  const [hasError, setHasError] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(0);

  // Check IndexedDB on mount if not provided via a local blob URL
  useEffect(() => {
    let active = true;
    let objectUrlToRevoke: string | null = null;
    setCandidateIndex(0);
    setHasError(false);

    if (customBlobUrl && (customBlobUrl.startsWith('blob:') || customBlobUrl.startsWith('data:'))) {
      setResolvedSrc(customBlobUrl);
      return;
    }

    async function checkStorage() {
      const blob = await getPosterBlob(student.id);
      if (blob && active) {
        objectUrlToRevoke = URL.createObjectURL(blob);
        setResolvedSrc(objectUrlToRevoke);
        setHasError(false);
      } else if (active) {
        setResolvedSrc(candidates[0] || null);
        setHasError(false);
      }
    }

    checkStorage();

    return () => {
      active = false;
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [student.id, customBlobUrl, candidates]);

  const handleImageError = () => {
    if (candidateIndex < candidates.length - 1) {
      const nextIndex = candidateIndex + 1;
      setCandidateIndex(nextIndex);
      setResolvedSrc(candidates[nextIndex]);
    } else {
      setHasError(true);
    }
  };

  const theme = THEMES[(student.month - 1) % THEMES.length];

  return (
    <div
      onClick={onOpenLightbox}
      className={`relative w-full aspect-square overflow-hidden rounded-2xl select-none group cursor-pointer bg-slate-900 ${className}`}
    >
      {resolvedSrc && !hasError ? (
        <div className="relative w-full h-full bg-slate-900">
          <img
            src={resolvedSrc}
            alt={`Birthday poster for ${student.name} (#${student.id})`}
            referrerPolicy="no-referrer"
            loading={isHero ? 'eager' : 'lazy'}
            decoding="async"
            onError={handleImageError}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle bottom gradient to ensure overlay readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
          
          {/* Clean 1:1 Poster artwork with no top badge overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-left">
            <h4 className="text-white font-bold text-lg drop-shadow-md tracking-tight truncate">
              {student.name}
            </h4>
            <div className="flex items-center justify-between text-xs text-slate-300 mt-0.5">
              <span>{formatBirthday(student.monthDay)}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Stylish Designer Fallback Poster */
        <div
          className={`relative w-full h-full bg-gradient-to-br ${theme.bg} p-5 flex flex-col justify-between text-white border ${theme.ring} shadow-inner transition-transform duration-500 group-hover:scale-105`}
        >
          {/* Decorative geometric patterns & subtle celebration circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-black/20 blur-lg pointer-events-none" />
          
          {/* Top Bar on the Poster */}
          <div className="relative z-10 flex items-center justify-end">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-sm border border-white/20">
              <PartyPopper className="w-4 h-4 text-amber-300" />
            </div>
          </div>

          {/* Center Graphic & Typography */}
          <div className="relative z-10 my-auto text-center py-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg mb-4 text-amber-300">
              <Cake className="w-8 h-8 drop-shadow" />
            </div>
            
            <p className="text-[11px] uppercase tracking-[0.25em] text-amber-200 font-semibold mb-1">
              Happy Birthday
            </p>
            
            <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white drop-shadow-md px-2 line-clamp-2">
              {student.name}
            </h3>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-sm border border-white/15 text-xs text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{formatBirthday(student.monthDay)}</span>
            </div>
          </div>

          {/* Poster Footer */}
          <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
            <span className="font-medium tracking-wide">BATCH 23/24</span>
            <span className="font-semibold text-white/90">HICT</span>
          </div>
        </div>
      )}

      {/* Hover preview pill affordance */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
        <span className="px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-medium border border-white/20 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Click to View Poster
        </span>
      </div>
    </div>
  );
};
