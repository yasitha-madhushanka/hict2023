import React, { useState } from 'react';
import JSZip from 'jszip';
import { savePosterBlob, clearAllStoredPosters } from '../utils/posterStore';
import { STUDENTS_DATA } from '../data/students';
import { X, Upload, FolderArchive, CheckCircle2, AlertCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import { fireMiniBurst } from '../utils/confetti';
import { soundManager } from '../utils/audioEffects';

interface PosterUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostersUpdated: () => void;
  loadedPosterCount: number;
}

export const PosterUploaderModal: React.FC<PosterUploaderModalProps> = ({
  isOpen,
  onClose,
  onPostersUpdated,
  loadedPosterCount,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);
    setStatusMessage('Reading uploaded files...');
    setError(null);
    setImportedCount(null);

    let matchCount = 0;

    try {
      const fileArray = Array.from(files);

      // Check if any file is a ZIP archive
      const zipFile = fileArray.find(
        (f) => f.name.endsWith('.zip') || f.type.includes('zip')
      );

      if (zipFile) {
        setStatusMessage('Extracting ZIP folder and parsing poster images...');
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(zipFile);

        const entries: Array<{ name: string; file: JSZip.JSZipObject }> = [];
        loadedZip.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir && /\.(jpe?g|png|webp|avif)$/i.test(zipEntry.name)) {
            entries.push({ name: relativePath, file: zipEntry });
          }
        });

        if (entries.length === 0) {
          throw new Error('No images (.jpg, .png, .webp) found inside the ZIP file.');
        }

        setStatusMessage(`Matching ${entries.length} images to students (1-54)...`);

        for (const entry of entries) {
          // Extract file name without path and extension
          const filename = entry.name.split('/').pop() || '';
          // Extract number from filename (e.g. "1.jpg", "01.png", "student_1.jpg" -> 1)
          const numberMatch = filename.match(/(\d+)/);
          if (numberMatch) {
            const studentId = parseInt(numberMatch[1], 10);
            if (studentId >= 1 && studentId <= 54) {
              const blob = await entry.file.async('blob');
              await savePosterBlob(studentId, blob);
              matchCount++;
            }
          }
        }
      } else {
        // Individual image files uploaded
        setStatusMessage(`Matching ${fileArray.length} image files to student numbers...`);
        for (const file of fileArray) {
          if (/\.(jpe?g|png|webp|avif)$/i.test(file.name)) {
            const numberMatch = file.name.match(/(\d+)/);
            if (numberMatch) {
              const studentId = parseInt(numberMatch[1], 10);
              if (studentId >= 1 && studentId <= 54) {
                await savePosterBlob(studentId, file);
                matchCount++;
              }
            }
          }
        }
      }

      setImportedCount(matchCount);
      setStatusMessage(
        matchCount > 0
          ? `Successfully matched and saved ${matchCount} birthday posters!`
          : 'No images matched student numbers (1 to 54).'
      );

      if (matchCount > 0) {
        fireMiniBurst();
        soundManager.playSuccessChime();
        onPostersUpdated();
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to process files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to remove all custom uploaded posters? Default styling will be restored.')) {
      await clearAllStoredPosters();
      onPostersUpdated();
      setStatusMessage('Stored posters cleared.');
      setImportedCount(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Birthday Posters (1:1 Size)</h3>
              <p className="text-xs text-slate-400">
                54 student 1:1 square posters synchronized with Google Drive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drag and drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragging
              ? 'border-amber-400 bg-amber-400/10'
              : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 mx-auto mb-3 flex items-center justify-center border border-white/10">
            <Upload className="w-6 h-6 animate-pulse" />
          </div>

          <p className="text-sm font-semibold text-white mb-1">
            Drag & drop ZIP folder or images here
          </p>
          <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
            Files should be named by student number (e.g. 1.jpg, 2.jpg up to 54.jpg)
          </p>

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md transition-all active:scale-95">
            <span>Browse Files / ZIP</span>
            <input
              type="file"
              accept=".zip,image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFiles(e.target.files);
                }
              }}
            />
          </label>
        </div>

        {/* Status / Feedback Area */}
        {isProcessing && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>{statusMessage}</span>
          </div>
        )}

        {statusMessage && !isProcessing && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Current status info */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {loadedPosterCount > 0
                ? `${loadedPosterCount} of 54 posters active in browser storage`
                : 'All 54 students using styled vector posters'}
            </span>
          </div>

          {loadedPosterCount > 0 && (
            <button
              onClick={handleClear}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
