import axios from "axios";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export interface ProcessedAvatar {
  filePath: string;
  pngBuffer: Buffer;
  imageBase64: string;
}

function safeFilePart(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48) || "user";
}

export async function downloadAndProcessAvatar(params: {
  imageUrl: string;
  username: string;
  size: number;
  avatarDir: string;
}): Promise<ProcessedAvatar> {
  await fs.mkdir(params.avatarDir, { recursive: true });

  const response = await axios.get<ArrayBuffer>(params.imageUrl, {
    responseType: "arraybuffer",
    timeout: 15_000,
    headers: {
      "User-Agent": "TikTokMinecraftLiveBot/1.0"
    }
  });

  const source = Buffer.from(response.data);
  const pngBuffer = await processImageBuffer(source, params.size);
  const timestamp = Date.now();
  const fileName = `${safeFilePart(params.username)}-${timestamp}.png`;
  const filePath = path.join(params.avatarDir, fileName);

  await fs.writeFile(filePath, pngBuffer);

  return {
    filePath,
    pngBuffer,
    imageBase64: pngBuffer.toString("base64")
  };
}

export async function resolveTikTokAvatarUrl(username: string): Promise<string> {
  const cleanUsername = username.replace(/^@/, "").trim();
  if (!cleanUsername) {
    return "";
  }

  const response = await axios.get<string>(`https://www.tiktok.com/@${encodeURIComponent(cleanUsername)}`, {
    responseType: "text",
    timeout: 15_000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  return extractAvatarUrl(response.data);
}

function extractAvatarUrl(html: string): string {
  const patterns = [
    /"avatarLarger":"((?:\\.|[^"\\])+)"/,
    /"avatarMedium":"((?:\\.|[^"\\])+)"/,
    /"avatarThumb":"((?:\\.|[^"\\])+)"/
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (!match?.[1]) {
      continue;
    }

    const url = decodeJsonString(match[1]);
    if (url.startsWith("http")) {
      return url;
    }
  }

  return "";
}

function decodeJsonString(value: string): string {
  try {
    return JSON.parse(`"${value}"`) as string;
  } catch {
    return value.replaceAll("\\u002F", "/").replaceAll("\\/", "/");
  }
}

export async function processLocalImage(params: {
  inputPath: string;
  username: string;
  size: number;
  avatarDir: string;
}): Promise<ProcessedAvatar> {
  await fs.mkdir(params.avatarDir, { recursive: true });

  const source = await fs.readFile(params.inputPath);
  const pngBuffer = await processImageBuffer(source, params.size);
  const fileName = `${safeFilePart(params.username)}-${Date.now()}.png`;
  const filePath = path.join(params.avatarDir, fileName);

  await fs.writeFile(filePath, pngBuffer);

  return {
    filePath,
    pngBuffer,
    imageBase64: pngBuffer.toString("base64")
  };
}

export async function createFakeAvatar(params: {
  username: string;
  size: number;
  avatarDir: string;
}): Promise<ProcessedAvatar> {
  await fs.mkdir(params.avatarDir, { recursive: true });

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${params.size}" height="${params.size}" viewBox="0 0 ${params.size} ${params.size}">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#ff4b7d"/>
          <stop offset="0.5" stop-color="#ffd166"/>
          <stop offset="1" stop-color="#118ab2"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <circle cx="${params.size * 0.5}" cy="${params.size * 0.38}" r="${params.size * 0.18}" fill="#ffffff" opacity="0.9"/>
      <rect x="${params.size * 0.22}" y="${params.size * 0.62}" width="${params.size * 0.56}" height="${params.size * 0.22}" rx="${params.size * 0.1}" fill="#ffffff" opacity="0.9"/>
    </svg>
  `;

  const pngBuffer = await processImageBuffer(Buffer.from(svg), params.size);
  const filePath = path.join(params.avatarDir, `${safeFilePart(params.username)}-${Date.now()}.png`);
  await fs.writeFile(filePath, pngBuffer);

  return {
    filePath,
    pngBuffer,
    imageBase64: pngBuffer.toString("base64")
  };
}

async function processImageBuffer(source: Buffer, size: number): Promise<Buffer> {
  return sharp(source)
    .resize(size, size, {
      fit: "cover",
      position: "center"
    })
    .png()
    .toBuffer();
}
