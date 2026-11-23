/**
 * Poster storage and image URL resolution with IndexedDB caching
 */

const DB_NAME = 'hict_posters_db';
const STORE_NAME = 'posters';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePosterBlob(id: number, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save poster blob:', err);
  }
}

export async function getPosterBlob(id: number): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function getAllStoredPosterIds(): Promise<number[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAllKeys();
      req.onsuccess = () => resolve((req.result as number[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function clearAllStoredPosters(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to clear posters:', err);
  }
}

import {
  getStudentPosterUrl,
  getStudentDriveFileId,
  extractDriveFileId,
  LOCAL_POSTER_IMAGE_MAP,
} from '../data/students';

const BASE_PATH = import.meta.env.BASE_URL || '/';

/**
 * Returns ordered candidate URLs for a student poster:
 * 1. Manual blob/data URL if provided
 * 2. Live Google Drive direct CDN (lh3.googleusercontent.com)
 * 3. Google Drive official thumbnail endpoint (drive.google.com/thumbnail)
 * 4. Same-origin server image proxy (/api/drive-image/:fileId)
 * 5. Local static fallback (/posters/...)
 */
export function getCandidateImageUrls(studentId: number, overrideUrl?: string): string[] {
  const list: string[] = [];

  if (overrideUrl && (overrideUrl.startsWith('blob:') || overrideUrl.startsWith('data:'))) {
    list.push(overrideUrl);
  }

  const primaryUrl = overrideUrl || getStudentPosterUrl(studentId);
  const driveFileId = extractDriveFileId(overrideUrl) || getStudentDriveFileId(studentId);

  if (primaryUrl && !primaryUrl.startsWith('blob:') && !primaryUrl.startsWith('data:')) {
    list.push(primaryUrl);
  }

  if (driveFileId) {
    list.push(
      `https://lh3.googleusercontent.com/d/${driveFileId}=w1080`,
      `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1080`,
      `/api/drive-image/${driveFileId}`
    );
  }

  const localFallback = LOCAL_POSTER_IMAGE_MAP[studentId];
  if (localFallback) {
    list.push(localFallback);
  }

  list.push(
    `${BASE_PATH}posters/${studentId}.png`,
    `${BASE_PATH}posters/${studentId}.jpeg`,
    `${BASE_PATH}posters/${studentId}.jpg`,
    `${BASE_PATH}posters/${studentId}.webp`
  );

  return Array.from(new Set(list));
}

