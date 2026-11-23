import { Student, getStudentPosterUrl } from '../data/students';
import { getCandidateImageUrls } from './posterStore';

/**
 * Official Birthday poem requested by user
 */
export const WHATSAPP_BIRTHDAY_POEM = `| H a p p y   B i r t h d a y 🥳✨
to someone whose kindness leaves a mark on every heart they touch.
May your day be wrapped in love, warmth, and moments that remind you how special you are. 💖
As you step into another year, may life lead you to places filled with comfort,
people who feel like home, and opportunities that help your dreams bloom. 🌸
You’re a rare soul — caring, thoughtful, and endlessly inspiring.
Wishing you a year full of soft mornings, peaceful nights,
unexpected blessings, and joy that lasts longer than candles on a cake. 🎂💫`;

export interface ShareResult {
  success: boolean;
  method: 'web-share' | 'whatsapp-link' | 'download-and-open';
  message: string;
}

async function fetchWorkingPosterBlob(studentId: number, customBlobUrl?: string): Promise<Blob> {
  const candidates = getCandidateImageUrls(studentId, customBlobUrl);
  for (const url of candidates) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (url.startsWith('blob:') || url.startsWith('data:') || contentType.startsWith('image/')) {
          return await response.blob();
        }
      }
    } catch {
      // try next candidate
    }
  }
  throw new Error('Could not fetch poster image from any source');
}

/**
 * Downloads the 1:1 poster image for a student
 */
export async function downloadPosterImage(student: Student, customBlobUrl?: string): Promise<string> {
  const src = customBlobUrl || getStudentPosterUrl(student.id);
  try {
    const blob = await fetchWorkingPosterBlob(student.id, customBlobUrl);
    const extension = blob.type.includes('png')
      ? 'png'
      : blob.type.includes('jpeg') || blob.type.includes('jpg')
      ? 'jpg'
      : 'png';
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `Birthday_Poster_1x1_${student.id}_${student.name}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    return a.download;
  } catch (err) {
    console.error('Failed to trigger poster download:', err);
    // Direct link fallback
    const a = document.createElement('a');
    a.href = src;
    a.download = `Birthday_Poster_1x1_${student.id}_${student.name}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return a.download;
  }
}

/**
 * Copies the WhatsApp poem to clipboard
 */
export async function copyWhatsAppWishText(): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(WHATSAPP_BIRTHDAY_POEM);
      return true;
    }
  } catch (err) {
    console.error('Clipboard copy failed:', err);
  }
  return false;
}

/**
 * Shares on WhatsApp with the 1:1 image poster.
 * Uses native Web Share API with files if available (iOS / Android / macOS),
 * or downloads the 1:1 image and opens WhatsApp Web/app with pre-filled poem text.
 */
export async function shareToWhatsAppWithImage(
  student: Student,
  customBlobUrl?: string
): Promise<ShareResult> {
  // 1. Check if navigator.share supports file sharing
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      const blob = await fetchWorkingPosterBlob(student.id, customBlobUrl);
      const ext = blob.type.includes('png') ? 'png' : 'jpg';
      const file = new File([blob], `happy_birthday_${student.name.toLowerCase()}_1x1.${ext}`, {
        type: blob.type || 'image/png',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `| H a p p y   B i r t h d a y 🥳✨ ${student.name}`,
          text: WHATSAPP_BIRTHDAY_POEM,
          files: [file],
        });
        return {
          success: true,
          method: 'web-share',
          message: 'Shared poster image and poem directly!',
        };
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') {
        return {
          success: false,
          method: 'web-share',
          message: 'Share cancelled',
        };
      }
      console.warn('File share not accepted by device, falling back to download & WhatsApp link:', err);
    }
  }

  // 2. Fallback: Download the 1:1 image & copy text to clipboard & open WhatsApp
  try {
    await downloadPosterImage(student, customBlobUrl);
  } catch (e) {
    console.warn('Could not auto-download image:', e);
  }

  await copyWhatsAppWishText();

  // Open WhatsApp with pre-filled poem
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(WHATSAPP_BIRTHDAY_POEM)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');

  return {
    success: true,
    method: 'download-and-open',
    message: '1:1 Poster image downloaded & WhatsApp opened with poem text!',
  };
}
