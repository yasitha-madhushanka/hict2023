import React from 'react';
import { Volume2, VolumeX, FolderArchive, LogOut, Cake, RefreshCw, CloudCheck } from 'lucide-react';
import { soundManager } from '../utils/audioEffects';

interface TopNavProps {
  onOpenUploader: () => void;
  onLogout: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  loadedPosterCount: number;
  isSyncingDrive?: boolean;
  onSyncDrive?: () => void;
  driveSyncCount?: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenUploader,
  onLogout,
  soundEnabled,
  onToggleSound,
  loadedPosterCount,
  isSyncingDrive = false,
  onSyncDrive,
  driveSyncCount = 54,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-md shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Cake className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-white">
            HICT 23/24 Celebrations
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <a href="#next-birthday" className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
            Next Birthday
          </a>
          <a href="#all-birthdays" className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
            All Students ({driveSyncCount})
          </a>
          <a href="#calendar-overview" className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
            Month Schedule
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Live Google Drive Sync Button */}
          {onSyncDrive && (
            <button
              onClick={onSyncDrive}
              disabled={isSyncingDrive}
              className="py-1.5 px-2.5 sm:px-3 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Sync images directly from live Google Drive folder"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-emerald-400 ${isSyncingDrive ? 'animate-spin text-amber-400' : ''}`}
              />
              <span className="hidden sm:inline">Drive Sync</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden xs:inline-block" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Celebration Sound' : 'Enable Celebration Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Import / Manage Posters Button */}
          <button
            onClick={onOpenUploader}
            className="py-1.5 sm:py-2 px-2.5 sm:px-3 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            title="Import custom poster images"
          >
            <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Posters</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              1:1
            </span>
          </button>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 flex items-center justify-center transition-all cursor-pointer"
            title="Lock Portal / Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
