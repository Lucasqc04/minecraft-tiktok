import fs from "node:fs";
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
  likeGridSize: number;
  giftFullPanel: boolean;
  restoreLikeGridAfterGift: boolean;
  likeGridAnimation: boolean;
  giftAnimation: boolean;
}

function runtimeEnv(): NodeJS.ProcessEnv {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    return process.env;
  }

  return {
    ...process.env,
    ...dotenv.parse(fs.readFileSync(envPath, "utf8"))
  };
}

function intFromEnv(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name];
  if (!raw) {
    return fallback;
  }

  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be an integer`);
  }

  return value;
}

function boolFromEnv(env: NodeJS.ProcessEnv, name: string, fallback: boolean): boolean {
  const raw = env[name];
  if (!raw) {
    return fallback;
  }

  return ["1", "true", "yes", "sim", "on"].includes(raw.trim().toLowerCase());
}

function listFromEnv(env: NodeJS.ProcessEnv, name: string, fallback: string[]): string[] {
  const raw = env[name];
  if (!raw) {
    return fallback;
  }

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function loadConfig(): Config {
  const env = runtimeEnv();
  const avatarSize = intFromEnv(env, "AVATAR_SIZE", 48);
  if (![32, 48, 64, 128, 256].includes(avatarSize)) {
    throw new Error("AVATAR_SIZE must be 32, 48, 64, 128, or 256");
  }
  const likeGridSize = intFromEnv(env, "LIKE_GRID_SIZE", 3);
  if (likeGridSize < 1 || likeGridSize > 4) {
    throw new Error("LIKE_GRID_SIZE must be between 1 and 4");
  }

  return {
    tiktokUsername: env.TIKTOK_USERNAME?.trim() ?? "",
    minecraftPluginHost: env.MINECRAFT_PLUGIN_HOST?.trim() || "127.0.0.1",
    minecraftPluginPort: intFromEnv(env, "MINECRAFT_PLUGIN_PORT", 4567),
    avatarSize,
    avatarDir: path.resolve(process.cwd(), env.AVATAR_DIR || "./avatars"),
    rconHost: env.RCON_HOST?.trim() || "127.0.0.1",
    rconPort: intFromEnv(env, "RCON_PORT", 25575),
    rconPassword: env.RCON_PASSWORD ?? "",
    durationSeconds: intFromEnv(env, "DURATION_SECONDS", 15),
    enableLikeAvatar: boolFromEnv(env, "ENABLE_LIKE_AVATAR", true),
    likeAvatarCooldownMs: Math.max(0, intFromEnv(env, "LIKE_AVATAR_COOLDOWN_MS", 750)),
    enableExtendedGiftInfo: boolFromEnv(env, "ENABLE_EXTENDED_GIFT_INFO", false),
    roseGiftNames: listFromEnv(env, "ROSE_GIFT_NAMES", ["rose", "rosa"]),
    roseGiftIds: listFromEnv(env, "ROSE_GIFT_IDS", []),
    likeGridSize,
    giftFullPanel: boolFromEnv(env, "GIFT_FULL_PANEL", true),
    restoreLikeGridAfterGift: boolFromEnv(env, "RESTORE_LIKE_GRID_AFTER_GIFT", true),
    likeGridAnimation: boolFromEnv(env, "LIKE_GRID_ANIMATION", false),
    giftAnimation: boolFromEnv(env, "GIFT_ANIMATION", true)
  };
}
