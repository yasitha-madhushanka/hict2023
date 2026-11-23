import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const GOOGLE_DRIVE_FOLDER_ID = '1mQSG7yatDCVt7GwaOqN6g765_UhKX2KQ';
const GOOGLE_DRIVE_EMBEDDED_URL = `https://drive.google.com/embeddedfolderview?id=${GOOGLE_DRIVE_FOLDER_ID}`;
const GOOGLE_DRIVE_WEB_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}?usp=sharing`;

interface DriveFileDetail {
  id: number;
  fileName: string;
  driveFileId: string;
  url: string;
}

interface DriveSyncPayload {
  success: boolean;
  folderId: string;
  updatedAt: string;
  totalFiles: number;
  images: Record<number, string>;
  fileIds: Record<number, string>;
  fileDetails: DriveFileDetail[];
}

interface CacheEntry {
  timestamp: number;
  data: DriveSyncPayload;
}

let cachedDriveData: CacheEntry | null = null;
const CACHE_TTL_MS = 20 * 1000; // 20 seconds cache

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

function parseEmbeddedFolderHtml(html: string) {
  const images: Record<number, string> = {};
  const fileIds: Record<number, string> = {};
  const fileDetails: DriveFileDetail[] = [];

  const regex = /id="entry-([^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g;
  const matches = [...html.matchAll(regex)];

  for (const match of matches) {
    const driveFileId = match[1].trim();
    const fileName = match[2].trim();
    const numMatch = fileName.match(/^([0-9]+)/);
    if (numMatch && driveFileId) {
      const studentId = parseInt(numMatch[1], 10);
      const url = `https://lh3.googleusercontent.com/d/${driveFileId}=w1080`;
      images[studentId] = url;
      fileIds[studentId] = driveFileId;
      fileDetails.push({
        id: studentId,
        fileName,
        driveFileId,
        url,
      });
    }
  }

  return { images, fileIds, fileDetails };
}

function parseWebFolderHtml(html: string) {
  const images: Record<number, string> = {};
  const fileIds: Record<number, string> = {};
  const fileDetails: DriveFileDetail[] = [];

  const ds3Match = html.match(/AF_initDataCallback\(({key:\s*'ds:3',[\s\S]*?})\);<\/script>/);
  if (!ds3Match) return { images, fileIds, fileDetails };

  try {
    const jsonStr = ds3Match[1]
      .replace(/^\{key:\s*'ds:3',\s*hash:\s*'[^']+',\s*data:/, '')
      .replace(/,\s*sideChannel:\s*\{\}\}$/, '');
    const data = JSON.parse(jsonStr);
    const items = data?.[27]?.[7]?.[0]?.[0];
    if (Array.isArray(items)) {
      for (const it of items) {
        const driveFileId = it?.[0]?.[1];
        const fileName =
          it?.[35]?.[0]?.[0]?.[0] ||
          it?.[24]?.[2]?.[0]?.[2]?.[1]?.[0]?.[0]?.[0] ||
          '';
        const numMatch = String(fileName).trim().match(/^([0-9]+)/);
        if (numMatch && driveFileId) {
          const studentId = parseInt(numMatch[1], 10);
          const url = `https://lh3.googleusercontent.com/d/${driveFileId}=w1080`;
          images[studentId] = url;
          fileIds[studentId] = driveFileId;
          fileDetails.push({
            id: studentId,
            fileName: String(fileName).trim(),
            driveFileId,
            url,
          });
        }
      }
    }
  } catch {
    // fallback parse failed
  }

  return { images, fileIds, fileDetails };
}

async function fetchGoogleDriveFolder(): Promise<DriveSyncPayload> {
  // Primary: embeddedfolderview (returns all items cleanly)
  const res = await fetch(GOOGLE_DRIVE_EMBEDDED_URL, { headers: BROWSER_HEADERS });
  if (!res.ok) {
    throw new Error(`Google Drive returned status ${res.status}`);
  }
  const html = await res.text();
  let parsed = parseEmbeddedFolderHtml(html);

  // Fallback: main folder SPA HTML if embeddedfolderview returned 0
  if (Object.keys(parsed.images).length === 0) {
    const webRes = await fetch(GOOGLE_DRIVE_WEB_URL, { headers: BROWSER_HEADERS });
    if (webRes.ok) {
      const webHtml = await webRes.text();
      parsed = parseWebFolderHtml(webHtml);
    }
  }

  return {
    success: true,
    folderId: GOOGLE_DRIVE_FOLDER_ID,
    updatedAt: new Date().toISOString(),
    totalFiles: Object.keys(parsed.images).length,
    images: parsed.images,
    fileIds: parsed.fileIds,
    fileDetails: parsed.fileDetails,
  };
}

// API endpoint to get real-time Google Drive images
app.get('/api/drive-images', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const force = req.query.force === '1' || req.query.fresh === '1';
  const now = Date.now();

  if (!force && cachedDriveData && now - cachedDriveData.timestamp < CACHE_TTL_MS) {
    return res.json({
      ...cachedDriveData.data,
      fromCache: true,
      cacheAgeSec: Math.round((now - cachedDriveData.timestamp) / 1000),
    });
  }

  try {
    const freshData = await fetchGoogleDriveFolder();
    cachedDriveData = {
      timestamp: now,
      data: freshData,
    };
    return res.json({
      ...freshData,
      fromCache: false,
    });
  } catch (error) {
    console.error('Error syncing with Google Drive folder:', error);
    if (cachedDriveData) {
      return res.json({
        ...cachedDriveData.data,
        fromCache: true,
        stale: true,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to sync with Google Drive folder',
      message: (error as Error).message,
    });
  }
});

// Same-origin Google Drive image proxy (bypasses browser-level blocks/hotlink issues)
app.get('/api/drive-image/:fileId', async (req, res) => {
  const rawId = req.params.fileId || '';
  const fileId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!fileId) {
    return res.status(400).send('Invalid file ID');
  }

  const candidateUrls = [
    `https://lh3.googleusercontent.com/d/${fileId}=w1080`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1080`,
  ];

  for (const url of candidateUrls) {
    try {
      const upstream = await fetch(url, {
        headers: {
          'User-Agent': BROWSER_HEADERS['User-Agent'],
        },
      });
      const contentType = upstream.headers.get('content-type') || '';
      if (upstream.ok && contentType.startsWith('image/')) {
        const buffer = Buffer.from(await upstream.arrayBuffer());
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.send(buffer);
      }
    } catch {
      // try next URL
    }
  }

  return res.status(404).send('Image not found');
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (dev: ${!isProd})`);
  });
}

startServer();
