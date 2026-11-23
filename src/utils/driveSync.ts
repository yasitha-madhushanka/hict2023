import { GOOGLE_DRIVE_FOLDER_ID, updateDynamicDriveImages } from '../data/students';

const DRIVE_EMBEDDED_URL = `https://drive.google.com/embeddedfolderview?id=${GOOGLE_DRIVE_FOLDER_ID}`;

export interface DriveSyncResult {
  images: Record<number, string>;
  fileIds: Record<number, string>;
  totalFiles: number;
  source: 'server' | 'client-proxy';
}

function parseEmbeddedHtml(html: string): {
  images: Record<number, string>;
  fileIds: Record<number, string>;
} {
  const images: Record<number, string> = {};
  const fileIds: Record<number, string> = {};

  const regex = /id="entry-([^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g;
  const matches = [...html.matchAll(regex)];

  for (const match of matches) {
    const driveFileId = match[1].trim();
    const fileName = match[2].trim();
    const numMatch = fileName.match(/^([0-9]+)/);
    if (numMatch && driveFileId) {
      const studentId = parseInt(numMatch[1], 10);
      images[studentId] = `https://lh3.googleusercontent.com/d/${driveFileId}=w1080`;
      fileIds[studentId] = driveFileId;
    }
  }

  return { images, fileIds };
}

/**
 * Syncs live poster files directly from the Google Drive folder.
 * Works both with the Express/Vercel backend (/api/drive-images) AND on pure static hosting via CORS proxy fallback.
 */
export async function fetchLatestDriveImages(force = false): Promise<DriveSyncResult | null> {
  // 1. Try backend / serverless API first
  try {
    const res = await fetch(`/api/drive-images${force ? '?force=1' : ''}`, {
      cache: 'no-store',
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data?.images && Object.keys(data.images).length > 0) {
        updateDynamicDriveImages(data.images);
        return {
          images: data.images,
          fileIds: data.fileIds || {},
          totalFiles: Object.keys(data.images).length,
          source: 'server',
        };
      }
    }
  } catch {
    // Backend unavailable (static hosting) -> fall through to client-side proxy sync
  }

  // 2. Fallback for static web hosting (Vercel static, Netlify, GitHub Pages, Firebase Hosting, etc.)
  const cacheBust = force ? `&_t=${Date.now()}` : '';
  const targetUrl = `${DRIVE_EMBEDDED_URL}${cacheBust}`;

  const proxyAttempts: Array<{ url: string; isJsonWrapped: boolean }> = [
    {
      url: `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
      isJsonWrapped: true,
    },
    {
      url: `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(targetUrl)}`,
      isJsonWrapped: false,
    },
  ];

  for (const attempt of proxyAttempts) {
    try {
      const res = await fetch(attempt.url, {
        cache: 'no-store',
        signal: AbortSignal.timeout(9000),
      });
      if (!res.ok) continue;

      let html = '';
      if (attempt.isJsonWrapped) {
        const json = await res.json();
        html = json?.contents || '';
      } else {
        html = await res.text();
      }

      if (html && html.includes('entry-')) {
        const parsed = parseEmbeddedHtml(html);
        const totalFiles = Object.keys(parsed.images).length;
        if (totalFiles > 0) {
          updateDynamicDriveImages(parsed.images);
          return {
            images: parsed.images,
            fileIds: parsed.fileIds,
            totalFiles,
            source: 'client-proxy',
          };
        }
      }
    } catch {
      // Try next proxy
    }
  }

  return null;
}
