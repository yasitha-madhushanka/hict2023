import React, { useState } from 'react';
import { Lock, KeyRound, Sparkles, Cake, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audioEffects';
import { fireCelebrationConfetti } from '../utils/confetti';

interface PasswordScreenProps {
  onUnlock: () => void;
}

const CORRECT_PASSWORD = 'HICT@2023@24';

export const PasswordScreen: React.FC<PasswordScreenProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the access password to continue.');
      return;
    }

    if (password === CORRECT_PASSWORD) {
      setError(null);
      setIsSuccess(true);
      soundManager.playSuccessChime();
      fireCelebrationConfetti();
      localStorage.setItem('hict_birthday_auth', 'true');
      setTimeout(() => {
        onUnlock();
      }, 700);
    } else {
      soundManager.playErrorBuzz();
      setError('Incorrect password. Please use the HICT 23/24 batch key.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Background ambient celebratory glowing lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-10 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Decorative stars and sparkles */}
      <div className="absolute top-12 left-12 text-amber-400/20 pointer-events-none">
        <Sparkles className="w-12 h-12" />
      </div>
      <div className="absolute bottom-16 right-16 text-purple-400/20 pointer-events-none">
        <Sparkles className="w-16 h-16" />
      </div>

      <div
        className={`w-full max-w-md relative z-10 glass-panel rounded-3xl p-8 shadow-2xl border border-white/10 transition-transform duration-200 ${
          isShaking ? 'translate-x-[-8px]' : ''
        }`}
        style={
          isShaking
            ? {
                animation: 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
              }
            : undefined
        }
      >
        <style>{`
          @keyframes shake {
            10%, 90% { transform: translate3d(-2px, 0, 0); }
            20%, 80% { transform: translate3d(4px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
            40%, 60% { transform: translate3d(6px, 0, 0); }
          }
        `}</style>

        {/* Header Icon & Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/20 mb-4">
            <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center">
              <Cake className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-amber-400 mb-2 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HICT 23/24 BATCH PORTAL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Birthday Celebrations
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Enter the student batch passcode to view upcoming birthdays and 1:1 celebration posters.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 ml-1">
              Batch Access Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter password..."
                className="w-full pl-10 pr-11 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
              <KeyRound className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Access granted! Loading celebrations...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSuccess}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-75"
          >
            <span>Enter Celebration Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Hint note */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Protected for HICT 23/24 batch students and faculty.
          </p>
        </div>
      </div>
    </div>
  );
};
