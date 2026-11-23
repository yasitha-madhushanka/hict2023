import React, { useEffect, useState } from 'react';
import { Student, formatBirthday, formatOrdinal } from '../data/students';
import { BirthdayPoster } from './BirthdayPoster';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Copy,
  Check,
  Heart,
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audioEffects';
import {
  shareToWhatsAppWithImage,
  downloadPosterImage,
  copyWhatsAppWishText,
  WHATSAPP_BIRTHDAY_POEM,
} from '../utils/whatsappShare';

interface PosterLightboxProps {
  student: Student | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  posterMap?: Record<number, string>;
}

export const PosterLightbox: React.FC<PosterLightboxProps> = ({
  student,
  onClose,
  onPrev,
  onNext,
  posterMap,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!student) return null;

  const handleCelebrate = () => {
    fireCelebrationConfetti();
    soundManager.playHappyBirthdayNotes();
  };

  const handleCopyPoem = async () => {
    await copyWhatsAppWishText();
    setCopied(true);
    setFeedback('Poem copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setFeedback(null);
    }, 2500);
  };

  const handleShareWhatsApp = async () => {
    try {
      setIsSharing(true);
      const res = await shareToWhatsAppWithImage(
        student,
        posterMap ? posterMap[student.id] : undefined
      );
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      console.error(err);
      setFeedback('Opening WhatsApp with poem!');
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadImage = async () => {
    await downloadPosterImage(
      student,
      posterMap ? posterMap[student.id] : undefined
    );
    setFeedback('1:1 Poster image downloaded!');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Lightbox Dialog Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[94vh] overflow-y-auto glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
          title="Close (ESC)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 items-center justify-center transition-colors cursor-pointer"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 items-center justify-center transition-colors cursor-pointer"
          title="Next (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 1:1 Poster Showcase on Left */}
        <div className="w-full md:w-1/2 max-w-[360px] sm:max-w-[400px] shrink-0">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20 aspect-square">
            <BirthdayPoster
              student={student}
              customBlobUrl={posterMap ? posterMap[student.id] : undefined}
            />
          </div>
        </div>

        {/* Student Profile Information & Celebration on Right */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
            {student.name}
          </h2>

          <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm mb-4">
            <span className="font-semibold text-amber-300">
              {formatBirthday(student.monthDay)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatOrdinal(student.day)} of {formatBirthday(student.monthDay).split(' ')[0]}</span>
          </div>

          {/* Action buttons with HIGHLIGHTED WhatsApp button */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 mb-3">
            {/* Highlighted WhatsApp CTA */}
            <button
              onClick={handleShareWhatsApp}
              disabled={isSharing}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current text-slate-950" />
              <span>Wish on WhatsApp</span>
            </button>

            {/* Download 1:1 image */}
            <button
              onClick={handleDownloadImage}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              title="Download 1:1 image file"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download 1:1 Post</span>
            </button>

            {/* Cheer */}
            <button
              onClick={handleCelebrate}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Cheer</span>
            </button>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className="mb-3 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Full Poem Box */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left relative group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>WhatsApp Message Text</span>
              </span>
              <button
                onClick={handleCopyPoem}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Copy poem text"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-36 overflow-y-auto pr-1">
              {WHATSAPP_BIRTHDAY_POEM}
            </pre>
          </div>

          {/* Mobile Prev / Next buttons */}
          <div className="flex sm:hidden items-center justify-between pt-3 mt-3 border-t border-slate-800">
            <button
              onClick={onPrev}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <span className="text-xs text-slate-500">
              #{student.id} of 54
            </span>
            <button
              onClick={onNext}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
