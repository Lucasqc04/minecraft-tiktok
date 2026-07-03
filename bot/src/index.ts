import { createAvatarGrid, downloadAndProcessAvatar, resolveTikTokAvatarUrl, type ProcessedAvatar } from "./avatar.js";
import { loadConfig } from "./config.js";
import { MinecraftClient } from "./minecraftClient.js";
import { TaskQueue } from "./queue.js";
import { connectTikTok, type LikeEvent, type RoseGiftEvent } from "./tiktok.js";

const config = loadConfig();
const minecraft = new MinecraftClient({
  host: config.minecraftPluginHost,
  port: config.minecraftPluginPort
});
const queue = new TaskQueue();
let lastLikeAvatarAt = 0;
const recentLikeAvatars: LikeGridEntry[] = [];

interface LikeGridEntry {
  username: string;
  nickname: string;
  pngBuffer: Buffer;
}

async function processRose(gift: RoseGiftEvent): Promise<void> {
  console.log(
    `[gift] rose from @${gift.username} (${gift.nickname}), repeat=${gift.repeatCount}, queue=${queue.size}`
  );

  if (config.giftFullPanel) {
    await renderProfileAvatar({
      username: gift.username,
      nickname: gift.nickname,
      profilePictureUrl: gift.profilePictureUrl,
      eventType: "gift",
      eventLabel: "enviou uma rosa \u{1F339}",
      clearAfter: true
    });

    console.log(`[minecraft] rendered gift @${gift.username}`);
    await sleepAfterWallRender();
    await restoreLikeGridAfterGift();
    return;
  }

  await processLikeStyleAvatar({
    username: gift.username,
    nickname: gift.nickname,
    profilePictureUrl: gift.profilePictureUrl,
    eventType: "gift",
    eventLabel: "enviou uma rosa \u{1F339}"
  });
}

async function renderProfileAvatar(params: {
  username: string;
  nickname: string;
  profilePictureUrl: string;
  eventType: string;
  eventLabel: string;
  clearAfter: boolean;
}): Promise<ProcessedAvatar> {
  const avatar = await loadProfileAvatar(params);

  await renderWithBusyRetry({
    username: params.username,
    nickname: params.nickname,
    eventType: params.eventType,
    eventLabel: params.eventLabel,
    imageBase64: avatar.imageBase64,
    size: config.avatarSize,
    durationSeconds: config.durationSeconds,
    clearAfter: params.clearAfter
  }, config.durationSeconds * 1000);

  return avatar;
}

async function loadProfileAvatar(params: {
  username: string;
  profilePictureUrl: string;
}): Promise<ProcessedAvatar> {
  const imageUrl = params.profilePictureUrl || (await resolveTikTokAvatarUrl(params.username));
  if (!imageUrl) {
    throw new Error(`Could not resolve avatar URL for @${params.username}`);
  }

  const avatar = await downloadAndProcessAvatar({
    imageUrl,
    username: params.username,
    size: config.avatarSize,
    avatarDir: config.avatarDir
  });

  console.log(`[avatar] saved ${avatar.filePath}`);
  return avatar;
}

async function processLikeAvatar(like: LikeEvent): Promise<void> {
  console.log(
    `[like] avatar from @${like.username} (${like.nickname}), likes=${like.likeCount}, total=${like.totalLikeCount}`
  );

  await processLikeStyleAvatar({
    username: like.username,
    nickname: like.nickname,
    profilePictureUrl: like.profilePictureUrl,
    eventType: "like",
    eventLabel: "curtiu a live"
  });

  console.log(`[minecraft] like grid rendered for @${like.username}`);
}

async function processLikeStyleAvatar(params: {
  username: string;
  nickname: string;
  profilePictureUrl: string;
  eventType: string;
  eventLabel: string;
}): Promise<void> {
  const avatar = await loadProfileAvatar(params);
  rememberLikeAvatar({
    username: params.username,
    nickname: params.nickname,
    pngBuffer: avatar.pngBuffer
  });
  await renderLikeGrid(params.username, params.nickname, params.eventType, params.eventLabel);
}

function rememberLikeAvatar(entry: LikeGridEntry): void {
  const existingIndex = recentLikeAvatars.findIndex((item) => item.username === entry.username);
  if (existingIndex >= 0) {
    recentLikeAvatars.splice(existingIndex, 1);
  }
  recentLikeAvatars.unshift(entry);
  recentLikeAvatars.splice(config.likeGridSize * config.likeGridSize);
}

async function renderLikeGrid(username: string, nickname: string, eventType = "like", eventLabel = "curtiu a live"): Promise<void> {
  if (recentLikeAvatars.length === 0) {
    return;
  }

  const grid = await createAvatarGrid({
    avatars: recentLikeAvatars.map((entry) => entry.pngBuffer),
    username,
    size: config.avatarSize,
    gridSize: config.likeGridSize,
    avatarDir: config.avatarDir
  });

  console.log(`[avatar] saved like grid ${grid.filePath}`);
  await renderWithBusyRetry({
    username,
    nickname,
    eventType,
    eventLabel,
    imageBase64: grid.imageBase64,
    size: config.avatarSize,
    durationSeconds: config.durationSeconds,
    clearAfter: false
  }, 1500, 5);
}

async function restoreLikeGridAfterGift(): Promise<void> {
  if (!config.restoreLikeGridAfterGift || recentLikeAvatars.length === 0) {
    return;
  }

  const latest = recentLikeAvatars[0];
  console.log("[minecraft] restoring like grid after gift");
  await renderLikeGrid(latest.username, latest.nickname, "like-grid", "voltou para o mosaico de curtidas");
}

async function renderWithBusyRetry(
  payload: Parameters<MinecraftClient["render"]>[0],
  busyWaitMs = 1500,
  attempts = 3
): Promise<void> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await minecraft.render(payload);
      return;
    } catch (error) {
      if (!isBusyError(error) || attempt === attempts) {
        throw error;
      }
      console.warn(`[minecraft] wall busy for /render, retrying attempt ${attempt + 1}/${attempts}...`);
      await sleepMs(busyWaitMs);
    }
  }
}

function isBusyError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("render (409)");
}

async function sleepAfterWallRender(): Promise<void> {
  await sleepMs(config.durationSeconds * 1000 + 500);
}

async function sleepMs(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function main(): Promise<void> {
  console.log("[bot] starting TikTok Minecraft Live bot");
  console.log(
    `[bot] minecraft plugin http://${config.minecraftPluginHost}:${config.minecraftPluginPort}, avatar size ${config.avatarSize}`
  );
  console.log(
    `[bot] like avatar ${config.enableLikeAvatar ? "enabled" : "disabled"}, cooldown ${config.likeAvatarCooldownMs}ms, grid ${config.likeGridSize}x${config.likeGridSize}`
  );
  console.log(
    `[bot] gift full panel ${config.giftFullPanel ? "enabled" : "disabled"}, restore like grid ${config.restoreLikeGridAfterGift ? "enabled" : "disabled"}`
  );
  console.log(
    `[bot] extended gift info ${config.enableExtendedGiftInfo ? "enabled" : "disabled"}, rose names=${config.roseGiftNames.join(",") || "-"}, rose ids=${config.roseGiftIds.join(",") || "-"}`
  );

  try {
    const health = await minecraft.health();
    console.log("[minecraft] health:", health);
  } catch (error) {
    console.warn("[minecraft] health check failed; continuing anyway:", error);
  }

  await connectTikTok(
    config.tiktokUsername,
    {
      enableExtendedGiftInfo: config.enableExtendedGiftInfo,
      roseGiftNames: config.roseGiftNames,
      roseGiftIds: config.roseGiftIds
    },
    (gift) => {
      queue.enqueue(async () => {
        await processRose(gift);
      });
    },
    config.enableLikeAvatar
      ? (like) => {
          const now = Date.now();
          if (now - lastLikeAvatarAt < config.likeAvatarCooldownMs) {
            return;
          }

          lastLikeAvatarAt = now;
          queue.enqueue(async () => {
            await processLikeAvatar(like);
          });
        }
      : undefined
  );
}

main().catch((error) => {
  console.error("[bot] fatal startup error:", error);
  process.exitCode = 1;
});
