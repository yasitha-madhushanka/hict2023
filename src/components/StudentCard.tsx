import React, { useState } from 'react';
import { Student, formatBirthday } from '../data/students';
import { calculateCountdown } from '../utils/birthdayCalculator';
import { BirthdayPoster } from './BirthdayPoster';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Sparkles, Cake } from 'lucide-react';
import { shareToWhatsAppWithImage } from '../utils/whatsappShare';

interface StudentCardProps {
  student: Student;
  isNextUpcoming?: boolean;
  isToday?: boolean;
  onOpenLightbox: (student: Student) => void;
  customBlobUrl?: string;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  isNextUpcoming = false,
  isToday = false,
  onOpenLightbox,
  customBlobUrl,
}) => {
  const [isWishing, setIsWishing] = useState(false);
  const countdown = calculateCountdown(student);

  const handleWhatsAppClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishing(true);
    try {
      await shareToWhatsAppWithImage(student, customBlobUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsWishing(false), 2000);
    }
  };

  let statusBadge = null;
  if (isToday) {
    statusBadge = (
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold animate-pulse">
        <Cake className="w-3 h-3 text-emerald-400" />
        <span>Today!</span>
      </div>
    );
  } else if (isNextUpcoming) {
    statusBadge = (
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>Next</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpenLightbox(student)}
      className={`relative group rounded-xl sm:rounded-2xl p-2 sm:p-3.5 glass-card border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        isToday
          ? 'ring-2 ring-emerald-500/50 bg-emerald-950/20 border-emerald-500/40'
          : isNextUpcoming
          ? 'ring-2 ring-amber-500/40 bg-amber-950/20 border-amber-500/30'
          : 'border-slate-800/80 hover:border-slate-600'
      }`}
    >
      {/* 1:1 Poster Image Container */}
      <div className="relative mb-2 sm:mb-3 rounded-lg sm:rounded-xl overflow-hidden shadow-md aspect-square bg-slate-900">
        <BirthdayPoster
          student={student}
          customBlobUrl={customBlobUrl}
          onOpenLightbox={() => onOpenLightbox(student)}
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-0.5 sm:gap-1 text-left">
        {/* Student Name & Roll */}
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate">
            {student.name}
          </h3>
          <span className="text-[10px] sm:text-[11px] font-mono text-amber-400/80 shrink-0">
            #{student.id.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Date and Countdown pill */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-300 mt-0.5 sm:mt-1 pt-1.5 sm:pt-2 border-t border-slate-800/80">
          <div className="font-medium text-slate-200 text-[10px] sm:text-xs truncate">
            {formatBirthday(student.monthDay)}
          </div>
          
          <div className="shrink-0">
            {statusBadge ? (
              statusBadge
            ) : countdown.days === 1 ? (
              <span className="text-amber-400 font-semibold text-[10px] sm:text-xs">Tomorrow!</span>
            ) : (
              <span className="text-slate-400 text-[10px] sm:text-xs tabular-nums">
                in {countdown.days}d
              </span>
            )}
          </div>
        </div>

        {/* Highlighted WhatsApp Wish CTA Button on card */}
        <button
          onClick={handleWhatsAppClick}
          disabled={isWishing}
          className="mt-2 sm:mt-2.5 w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 text-[10px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 group-hover:bg-emerald-500 group-hover:text-slate-950 shadow-sm hover:shadow-emerald-500/25 cursor-pointer active:scale-95"
          title="Wish on WhatsApp"
        >
          <WhatsAppIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
          <span className="truncate">{isWishing ? 'Opening...' : 'Wish on WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
};
