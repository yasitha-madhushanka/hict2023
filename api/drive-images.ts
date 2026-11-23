interface ReqLike {
  query?: Record<string, string | string[] | undefined>;
}

interface ResLike {
  status: (code: number) => ResLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

const GOOGLE_DRIVE_FOLDER_ID = '1mQSG7yatDCVt7GwaOqN6g765_UhKX2KQ';
const GOOGLE_DRIVE_EMBEDDED_URL = `https://drive.google.com/embeddedfolderview?id=${GOOGLE_DRIVE_FOLDER_ID}`;

export default async function handler(_req: ReqLike, res: ResLike) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const response = await fetch(GOOGLE_DRIVE_EMBEDDED_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: `Google Drive returned status ${response.status}`,
      });
    }

    const html = await response.text();
    const regex = /id="entry-([^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g;
    const matches = [...html.matchAll(regex)];

    const images: Record<number, string> = {};
    const fileIds: Record<number, string> = {};
    const fileDetails: Array<{ id: number; fileName: string; driveFileId: string; url: string }> = [];

    for (const match of matches) {
      const driveFileId = match[1].trim();
      const fileName = match[2].trim();
      const numMatch = fileName.match(/^([0-9]+)/);
      if (numMatch && driveFileId) {
        const studentId = parseInt(numMatch[1], 10);
        const url = `https://lh3.googleusercontent.com/d/${driveFileId}=w1080`;
        images[studentId] = url;
        fileIds[studentId] = driveFileId;
        fileDetails.push({ id: studentId, fileName, driveFileId, url });
      }
    }

    return res.status(200).json({
      success: true,
      folderId: GOOGLE_DRIVE_FOLDER_ID,
      updatedAt: new Date().toISOString(),
      totalFiles: Object.keys(images).length,
      images,
      fileIds,
      fileDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: (err as Error).message || 'Drive sync failed',
    });
  }
}
