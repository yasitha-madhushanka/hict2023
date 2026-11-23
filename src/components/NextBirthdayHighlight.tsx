import React, { useState } from 'react';
import { Student, formatBirthday, formatOrdinal } from '../data/students';
import { BirthdayPoster } from './BirthdayPoster';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Sparkles, Gift, CalendarDays, Users, Download, Check, Eye } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audioEffects';
import { shareToWhatsAppWithImage, downloadPosterImage } from '../utils/whatsappShare';

interface NextBirthdayHighlightProps {
  students: Student[];
  onOpenLightbox: (student: Student) => void;
  posterMap?: Record<number, string>;
}

export const NextBirthdayHighlight: React.FC<NextBirthdayHighlightProps> = ({
  students,
  onOpenLightbox,
  posterMap,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!students || students.length === 0) return null;

  const currentStudent = students[selectedIndex] || students[0];

  const handleCelebrate = () => {
    fireCelebrationConfetti();
    soundManager.playHappyBirthdayNotes();
  };

  const handleWhatsAppWish = async () => {
    try {
      setIsSharing(true);
      const result = await shareToWhatsAppWithImage(
        currentStudent,
        posterMap ? posterMap[currentStudent.id] : undefined
      );
      setShareFeedback(result.message || 'WhatsApp opened with birthday wish & 1:1 poster image!');
      setTimeout(() => setShareFeedback(null), 5000);
    } catch (err) {
      console.error(err);
      setShareFeedback('WhatsApp opened!');
      setTimeout(() => setShareFeedback(null), 3000);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadOnly = async () => {
    await downloadPosterImage(
      currentStudent,
      posterMap ? posterMap[currentStudent.id] : undefined
    );
    setShareFeedback('1:1 Poster image downloaded!');
    setTimeout(() => setShareFeedback(null), 3000);
  };

  return (
    <section className="relative w-full rounded-3xl overflow-hidden glass-panel-glow p-6 sm:p-8 lg:p-10 border border-amber-500/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner / Multi-Student Selector if multiple share this next date */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
            ✨ NEXT UPCOMING BIRTHDAY
          </span>
        </div>

        {students.length > 1 && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Co-Celebrants:</span>
            </span>
            {students.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setSelectedIndex(idx)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedIndex === idx
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Split Screen Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: 1:1 Poster Highlight */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-square group">
            {/* Pulsing halo aura behind poster */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-purple-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-75" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden ring-2 ring-amber-400/50 shadow-2xl">
              <BirthdayPoster
                student={currentStudent}
                isHero={true}
                customBlobUrl={posterMap ? posterMap[currentStudent.id] : undefined}
                onOpenLightbox={() => onOpenLightbox(currentStudent)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Student Info */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 leading-tight">
            {currentStudent.name}
          </h2>

          <div className="flex items-center gap-3 text-slate-300 text-base sm:text-lg mb-6">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <CalendarDays className="w-5 h-5" />
              <span>{formatBirthday(currentStudent.monthDay)}</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 text-sm">
              Coming up on {formatOrdinal(currentStudent.day)} of {formatBirthday(currentStudent.monthDay).split(' ')[0]}
            </span>
          </div>

          {/* Action Buttons: Prominently Highlighted WhatsApp Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* HIGHLIGHTED WHATSAPP BUTTON */}
            <button
              onClick={handleWhatsAppWish}
              disabled={isSharing}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/35 ring-2 ring-emerald-300 transition-all duration-200 flex items-center gap-2.5 cursor-pointer active:scale-95 group"
              title="Share heartfelt birthday message and 1:1 image on WhatsApp"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-950/20 flex items-center justify-center text-slate-950">
                <WhatsAppIcon className="w-4 h-4 fill-current" />
              </div>
              <span className="tracking-wide">Wish on WhatsApp</span>
              <Sparkles className="w-4 h-4 text-emerald-950 group-hover:rotate-12 transition-transform" />
            </button>

            {/* Cheer & Confetti */}
            <button
              onClick={handleCelebrate}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-slate-950 font-bold text-xs shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Gift className="w-4 h-4 text-slate-950" />
              <span>Send Cheer</span>
            </button>

            {/* Download 1:1 Poster Button */}
            <button
              onClick={handleDownloadOnly}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Save 1:1 poster image"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download 1:1 Post</span>
            </button>

            {/* View Fullscreen */}
            <button
              onClick={() => onOpenLightbox(currentStudent)}
              className="py-3 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition-all flex items-center gap-1 cursor-pointer"
              title="View full poster"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Share Feedback Toast / Helper note */}
          {shareFeedback && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{shareFeedback}</span>
            </div>
          )}

          {/* WhatsApp message preview accordion preview */}
          <div className="mt-5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current text-emerald-400" />
              <span>WhatsApp Message Included:</span>
            </div>
            <p className="text-xs text-slate-300 italic font-mono whitespace-pre-line leading-relaxed">
              | H a p p y   B i r t h d a y 🥳✨
              {'\n'}to someone whose kindness leaves a mark on every heart they touch.
              {'\n'}May your day be wrapped in love, warmth, and moments that remind you how special you are. 💖
              {'\n'}... [Full touching poem sent with 1:1 image]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
