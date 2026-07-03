import dotenv from "dotenv";
import path from "node:path";

dotenv.config();

export interface Config {
  tiktokUsername: string;
  minecraftPluginHost: string;
  minecraftPluginPort: number;
  avatarSize: number;
  avatarDir: string;
  rconHost: string;
  rconPort: number;
  rconPassword: string;
  durationSeconds: number;
  enableLikeAvatar: boolean;
  likeAvatarCooldownMs: number;
  enableExtendedGiftInfo: boolean;
  roseGiftNames: string[];
  roseGiftIds: string[];
}

function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be an integer`);
  }

  return value;
}

function boolFromEnv(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  return ["1", "true", "yes", "sim", "on"].includes(raw.trim().toLowerCase());
}

function listFromEnv(name: string, fallback: string[]): string[] {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function loadConfig(): Config {
  const avatarSize = intFromEnv("AVATAR_SIZE", 48);
  if (![32, 48, 64, 128].includes(avatarSize)) {
    throw new Error("AVATAR_SIZE must be 32, 48, 64, or 128");
  }

  return {
    tiktokUsername: process.env.TIKTOK_USERNAME?.trim() ?? "",
    minecraftPluginHost: process.env.MINECRAFT_PLUGIN_HOST?.trim() || "127.0.0.1",
    minecraftPluginPort: intFromEnv("MINECRAFT_PLUGIN_PORT", 4567),
    avatarSize,
    avatarDir: path.resolve(process.cwd(), process.env.AVATAR_DIR || "./avatars"),
    rconHost: process.env.RCON_HOST?.trim() || "127.0.0.1",
    rconPort: intFromEnv("RCON_PORT", 25575),
    rconPassword: process.env.RCON_PASSWORD ?? "",
    durationSeconds: intFromEnv("DURATION_SECONDS", 15),
    enableLikeAvatar: boolFromEnv("ENABLE_LIKE_AVATAR", true),
    likeAvatarCooldownMs: Math.max(0, intFromEnv("LIKE_AVATAR_COOLDOWN_MS", 5000)),
    enableExtendedGiftInfo: boolFromEnv("ENABLE_EXTENDED_GIFT_INFO", false),
    roseGiftNames: listFromEnv("ROSE_GIFT_NAMES", ["rose", "rosa"]),
    roseGiftIds: listFromEnv("ROSE_GIFT_IDS", [])
  };
}
