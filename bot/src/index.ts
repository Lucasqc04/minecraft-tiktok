import { downloadAndProcessAvatar, resolveTikTokAvatarUrl } from "./avatar.js";
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

async function processRose(gift: RoseGiftEvent): Promise<void> {
  console.log(
    `[gift] rose from @${gift.username} (${gift.nickname}), repeat=${gift.repeatCount}, queue=${queue.size}`
  );

  await renderProfileAvatar({
    username: gift.username,
    nickname: gift.nickname,
    profilePictureUrl: gift.profilePictureUrl,
    eventType: "rose",
    eventLabel: "enviou uma rosa \u{1F339}"
  });

  console.log(`[minecraft] rendered @${gift.username}`);
  await sleepAfterWallRender();
}

async function renderProfileAvatar(params: {
  username: string;
  nickname: string;
  profilePictureUrl: string;
  eventType: string;
  eventLabel: string;
}): Promise<void> {
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

  await renderWithBusyRetry({
    username: params.username,
    nickname: params.nickname,
    eventType: params.eventType,
    eventLabel: params.eventLabel,
    imageBase64: avatar.imageBase64,
    size: config.avatarSize,
    durationSeconds: config.durationSeconds
  });
}

async function processLikeAvatar(like: LikeEvent): Promise<void> {
  console.log(
    `[like] avatar from @${like.username} (${like.nickname}), likes=${like.likeCount}, total=${like.totalLikeCount}`
  );

  await renderProfileAvatar({
    username: like.username,
    nickname: like.nickname,
    profilePictureUrl: like.profilePictureUrl,
    eventType: "like",
    eventLabel: "curtiu a live"
  });

  console.log(`[minecraft] like avatar rendered for @${like.username}`);
  await sleepAfterWallRender();
}

async function renderWithBusyRetry(payload: Parameters<MinecraftClient["render"]>[0]): Promise<void> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await minecraft.render(payload);
      return;
    } catch (error) {
      if (!isBusyError(error) || attempt === 3) {
        throw error;
      }
      console.warn(`[minecraft] wall busy for /render, retrying attempt ${attempt + 1}/3...`);
      await sleepAfterWallRender();
    }
  }
}

function isBusyError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("render (409)");
}

async function sleepAfterWallRender(): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, config.durationSeconds * 1000 + 500);
  });
}

async function main(): Promise<void> {
  console.log("[bot] starting TikTok Minecraft Live bot");
  console.log(
    `[bot] minecraft plugin http://${config.minecraftPluginHost}:${config.minecraftPluginPort}, avatar size ${config.avatarSize}`
  );
  console.log(
    `[bot] like avatar ${config.enableLikeAvatar ? "enabled" : "disabled"}, cooldown ${config.likeAvatarCooldownMs}ms`
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
