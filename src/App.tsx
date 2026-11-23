/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { STUDENTS_DATA, Student, GOOGLE_DRIVE_POSTER_IMAGE_MAP } from './data/students';
import { getNextUpcomingStudents } from './utils/birthdayCalculator';
import { getAllStoredPosterIds, getPosterBlob } from './utils/posterStore';
import { fetchLatestDriveImages } from './utils/driveSync';
import { soundManager } from './utils/audioEffects';
import { PasswordScreen } from './components/PasswordScreen';
import { TopNav } from './components/TopNav';
import { NextBirthdayHighlight } from './components/NextBirthdayHighlight';
import { CelebrationStats } from './components/CelebrationStats';
import { StudentDirectory } from './components/StudentDirectory';
import { CalendarOverview } from './components/CalendarOverview';
import { PosterLightbox } from './components/PosterLightbox';
import { PosterUploaderModal } from './components/PosterUploaderModal';
import { Footer } from './components/Footer';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('hict_birthday_auth') === 'true';
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeLightboxStudent, setActiveLightboxStudent] = useState<Student | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [storedPosterIds, setStoredPosterIds] = useState<number[]>([]);
  const [posterBlobUrls, setPosterBlobUrls] = useState<Record<number, string>>({});
  const [drivePostersMap, setDrivePostersMap] = useState<Record<number, string>>(GOOGLE_DRIVE_POSTER_IMAGE_MAP);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);

  // Sync latest poster images directly from Google Drive folder (works on both Node server & static hosting)
  const syncDriveImages = useCallback(async (force = false) => {
    try {
      setIsSyncingDrive(true);
      const result = await fetchLatestDriveImages(force);
      if (result && Object.keys(result.images).length > 0) {
        setDrivePostersMap((prev) => ({ ...prev, ...result.images }));
      }
    } catch (err) {
      console.warn('Google Drive sync note: Using pre-loaded Drive CDN URLs:', err);
    } finally {
      setIsSyncingDrive(false);
    }
  }, []);

  // Live sync on mount and background polling
  useEffect(() => {
    syncDriveImages(false);

    // Re-check for new/updated images in Google Drive every 45 seconds
    const interval = setInterval(() => {
      syncDriveImages(false);
    }, 45000);

    // Also re-check when the user switches tabs back to the app
    const handleFocus = () => syncDriveImages(false);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [syncDriveImages]);

  // Load custom posters from IndexedDB
  const refreshStoredPosters = useCallback(async () => {
    try {
      const ids = await getAllStoredPosterIds();
      setStoredPosterIds(ids);

      const urls: Record<number, string> = {};
      for (const id of ids) {
        const blob = await getPosterBlob(id);
        if (blob) {
          urls[id] = URL.createObjectURL(blob);
        }
      }
      setPosterBlobUrls(urls);
    } catch (e) {
      console.error('Failed to load custom posters:', e);
    }
  }, []);

  useEffect(() => {
    refreshStoredPosters();
  }, [refreshStoredPosters]);

  // Merge Google Drive images with any custom overrides
  const effectivePostersMap = useMemo(() => {
    return {
      ...GOOGLE_DRIVE_POSTER_IMAGE_MAP,
      ...drivePostersMap,
      ...posterBlobUrls,
    };
  }, [drivePostersMap, posterBlobUrls]);

  // Compute next upcoming student(s) based on current date
  const { primary: nextStudent, allNext, isToday } = useMemo(() => {
    return getNextUpcomingStudents(STUDENTS_DATA, new Date());
  }, []);

  const nextUpcomingIds = useMemo(() => allNext.map((s) => s.id), [allNext]);
  const todayIds = useMemo(
    () => (isToday ? allNext.map((s) => s.id) : []),
    [isToday, allNext]
  );

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.enabled = nextVal;
  };

  const handleLogout = () => {
    localStorage.removeItem('hict_birthday_auth');
    setIsAuthenticated(false);
  };

  const handleOpenLightbox = (student: Student) => {
    setActiveLightboxStudent(student);
  };

  const handlePrevLightbox = () => {
    if (!activeLightboxStudent) return;
    const currentIndex = STUDENTS_DATA.findIndex((s) => s.id === activeLightboxStudent.id);
    const prevIndex = (currentIndex - 1 + STUDENTS_DATA.length) % STUDENTS_DATA.length;
    setActiveLightboxStudent(STUDENTS_DATA[prevIndex]);
  };

  const handleNextLightbox = () => {
    if (!activeLightboxStudent) return;
    const currentIndex = STUDENTS_DATA.findIndex((s) => s.id === activeLightboxStudent.id);
    const nextIndex = (currentIndex + 1) % STUDENTS_DATA.length;
    setActiveLightboxStudent(STUDENTS_DATA[nextIndex]);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return <PasswordScreen onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <TopNav
        onOpenUploader={() => setIsUploaderOpen(true)}
        onLogout={handleLogout}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        loadedPosterCount={storedPosterIds.length}
        isSyncingDrive={isSyncingDrive}
        onSyncDrive={() => syncDriveImages(true)}
        driveSyncCount={Object.keys(drivePostersMap).length || 54}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Next Birthday Hero Highlight Section */}
        <div id="next-birthday">
          <NextBirthdayHighlight
            students={allNext}
            onOpenLightbox={handleOpenLightbox}
            posterMap={effectivePostersMap}
          />
        </div>

        {/* Statistical Overview Strip */}
        <CelebrationStats
          students={STUDENTS_DATA}
          nextUpcoming={nextStudent}
          isToday={isToday}
        />

        {/* All Students' Birthday Directory Section */}
        <div id="all-birthdays">
          <StudentDirectory
            students={STUDENTS_DATA}
            nextUpcomingIds={nextUpcomingIds}
            todayIds={todayIds}
            onOpenLightbox={handleOpenLightbox}
            posterMap={effectivePostersMap}
          />
        </div>

        {/* Month by Month Distribution Overview */}
        <CalendarOverview students={STUDENTS_DATA} />
      </main>

      {/* High-Resolution Poster Lightbox Modal */}
      {activeLightboxStudent && (
        <PosterLightbox
          student={activeLightboxStudent}
          onClose={() => setActiveLightboxStudent(null)}
          onPrev={handlePrevLightbox}
          onNext={handleNextLightbox}
          posterMap={effectivePostersMap}
        />
      )}

      {/* Poster ZIP / Image Uploader Modal */}
      <PosterUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onPostersUpdated={refreshStoredPosters}
        loadedPosterCount={storedPosterIds.length}
      />

      {/* Footer */}
      <Footer
        onScrollToTop={handleScrollToTop}
        onOpenUploader={() => setIsUploaderOpen(true)}
      />
    </div>
  );
}
