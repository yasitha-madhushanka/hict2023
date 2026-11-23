interface ReqLike {
  query?: Record<string, string | string[] | undefined>;
}

interface ResLike {
  status: (code: number) => ResLike;
  send: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

export default async function handler(req: ReqLike, res: ResLike) {
  const raw = req.query?.fileId;
  const rawId = Array.isArray(raw) ? raw[0] : raw || '';
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
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      });
      const contentType = upstream.headers.get('content-type') || '';
      if (upstream.ok && contentType.startsWith('image/')) {
        const buffer = Buffer.from(await upstream.arrayBuffer());
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).send(buffer);
      }
    } catch {
      // try next URL
    }
  }

  return res.status(404).send('Image not found');
}
