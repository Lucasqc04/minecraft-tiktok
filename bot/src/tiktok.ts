export interface RoseGiftEvent {
  username: string;
  nickname: string;
  profilePictureUrl: string;
  giftName: string;
  repeatCount: number;
}

export interface LikeEvent {
  username: string;
  nickname: string;
  profilePictureUrl: string;
  likeCount: number;
  totalLikeCount: number;
}

type GiftHandler = (gift: RoseGiftEvent) => void;
type LikeHandler = (like: LikeEvent) => void;

const RECENT_TTL_MS = 30_000;

export interface TikTokOptions {
  enableExtendedGiftInfo: boolean;
  roseGiftNames: string[];
  roseGiftIds: string[];
}

export async function connectTikTok(
  username: string,
  options: TikTokOptions,
  onRoseGift: GiftHandler,
  onLike?: LikeHandler
): Promise<void> {
  if (!username) {
    throw new Error("TIKTOK_USERNAME is required");
  }

  const connectorModule = await import("tiktok-live-connector");
  const TikTokLiveConnection =
    (connectorModule as Record<string, unknown>).TikTokLiveConnection ??
    ((connectorModule as { default?: Record<string, unknown> }).default?.TikTokLiveConnection);

  if (typeof TikTokLiveConnection !== "function") {
    throw new Error("Could not load TikTokLiveConnection from tiktok-live-connector");
  }

  const ConnectionConstructor = TikTokLiveConnection as TikTokConnectionConstructor;
  const connection = new ConnectionConstructor(username, {
    processInitialData: false,
    enableExtendedGiftInfo: options.enableExtendedGiftInfo
  });
  const dedupe = new RecentDedupe();
  const roseGiftNames = new Set(options.roseGiftNames.map(normalizeGiftName));
  const roseGiftIds = new Set(options.roseGiftIds.map((giftId) => giftId.trim()).filter(Boolean));

  connection.on("connected", (state: unknown) => {
    console.log("[tiktok] connected:", state);
  });

  connection.on("disconnected", () => {
    console.warn("[tiktok] disconnected");
  });

  connection.on("error", (error: unknown) => {
    console.error("[tiktok] connection error:", error);
  });

  connection.on("gift", (data: TikTokGiftData) => {
    try {
      const giftName = pickString(
        data.giftName,
        data.giftDetails?.giftName,
        data.extendedGiftInfo?.name,
        data.extendedGiftInfo?.giftName,
        data.gift?.name
      );
      const giftId = pickString(data.giftId, data.gift?.gift_id);

      if (!isConfiguredRose(giftName, giftId, roseGiftNames, roseGiftIds)) {
        return;
      }

      if (isStreakInProgress(data)) {
        return;
      }

      const username = pickString(data.uniqueId, data.user?.uniqueId, data.user?.displayId);
      const nickname = pickString(data.nickname, data.user?.nickname, username) || username;
      const profilePictureUrl = pickString(
        data.profilePictureUrl,
        data.user?.profilePictureUrl,
        data.user?.avatarThumb,
        firstImageUrl(data.user?.avatarThumb),
        firstImageUrl(data.user?.avatarMedium),
        firstImageUrl(data.user?.avatarLarge),
        firstString(data.user?.avatarLarge?.urlList),
        firstString(data.user?.profilePicture?.url)
      );

      if (!username) {
        console.warn("[tiktok] rose ignored because user/avatar data is missing", {
          username,
          hasAvatar: Boolean(profilePictureUrl)
        });
        return;
      }

      if (!profilePictureUrl) {
        console.warn(`[tiktok] rose from @${username} has no avatar in event; will try profile fallback`);
      }

      const eventKey = getEventKey(data, username, giftName || giftId);
      if (dedupe.seen(eventKey)) {
        return;
      }

      onRoseGift({
        username,
        nickname,
        profilePictureUrl,
        giftName: giftName || giftId,
        repeatCount: Number(data.repeatCount ?? 1) || 1
      });
    } catch (error) {
      console.error("[tiktok] failed to handle gift event:", error);
    }
  });

  connection.on("like", (data: TikTokLikeData) => {
    try {
      if (!onLike) {
        return;
      }

      const username = pickString(data.uniqueId, data.user?.uniqueId, data.user?.displayId) || "unknown";
      const nickname = pickString(data.nickname, data.user?.nickname, username) || username;
      const profilePictureUrl = pickString(
        data.profilePictureUrl,
        data.user?.profilePictureUrl,
        data.user?.avatarThumb,
        firstImageUrl(data.user?.avatarThumb),
        firstImageUrl(data.user?.avatarMedium),
        firstImageUrl(data.user?.avatarLarge)
      );

      onLike({
        username,
        nickname,
        profilePictureUrl,
        likeCount: pickNumber(data.likeCount),
        totalLikeCount: pickNumber(data.totalLikeCount)
      });
    } catch (error) {
      console.error("[tiktok] failed to handle like event:", error);
    }
  });

  console.log(`[tiktok] connecting to @${username}...`);
  await connection.connect();
}

function isConfiguredRose(
  giftName: string,
  giftId: string,
  roseGiftNames: Set<string>,
  roseGiftIds: Set<string>
): boolean {
  return Boolean(
    (giftName && roseGiftNames.has(normalizeGiftName(giftName))) || (giftId && roseGiftIds.has(giftId))
  );
}

function normalizeGiftName(giftName: string): string {
  return giftName.trim().toLowerCase();
}

function isStreakInProgress(data: TikTokGiftData): boolean {
  const giftType = pickNumber(data.giftType, data.giftDetails?.giftType, data.gift?.gift_type);
  return giftType === 1 && data.repeatEnd !== true;
}

function getEventKey(data: TikTokGiftData, username: string, giftName: string): string {
  const explicitId =
    data.msgId ??
    data.common?.msgId ??
    data.messageId ??
    data.eventId ??
    data.id ??
    data.repeatId ??
    data.groupId;

  if (explicitId) {
    return `${username}:${giftName}:${String(explicitId)}`;
  }

  const coarseWindow = Math.floor(Date.now() / 10_000);
  return `${username}:${giftName}:${data.giftId ?? "gift"}:${data.repeatCount ?? 1}:${coarseWindow}`;
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return "";
}

function pickNumber(...values: unknown[]): number {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      const parsed = Number.parseInt(value, 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return 0;
}

function firstString(value: unknown): string {
  if (Array.isArray(value)) {
    return pickString(...value);
  }
  return "";
}

function firstImageUrl(value: unknown): string {
  if (!value || typeof value !== "object") {
    return "";
  }

  const image = value as {
    urlList?: unknown;
    url?: unknown;
  };

  return pickString(firstString(image.urlList), firstString(image.url));
}

class RecentDedupe {
  private readonly recent = new Map<string, number>();

  seen(key: string): boolean {
    const now = Date.now();
    this.prune(now);

    if (this.recent.has(key)) {
      return true;
    }

    this.recent.set(key, now);
    return false;
  }

  private prune(now: number): void {
    for (const [key, createdAt] of this.recent) {
      if (now - createdAt > RECENT_TTL_MS) {
        this.recent.delete(key);
      }
    }
  }
}

interface TikTokConnection {
  on(event: string, handler: (...args: any[]) => void): void;
  connect(): Promise<unknown>;
}

type TikTokConnectionConstructor = new (
  username: string,
  options?: Record<string, unknown>
) => TikTokConnection;

interface TikTokGiftData {
  giftName?: unknown;
  giftDetails?: {
    giftName?: unknown;
    giftType?: unknown;
  };
  extendedGiftInfo?: {
    name?: unknown;
    giftName?: unknown;
  };
  gift?: {
    name?: unknown;
    gift_type?: unknown;
    gift_id?: unknown;
  };
  uniqueId?: unknown;
  nickname?: unknown;
  profilePictureUrl?: unknown;
  giftType?: unknown;
  repeatEnd?: unknown;
  repeatCount?: unknown;
  giftId?: unknown;
  msgId?: unknown;
  messageId?: unknown;
  eventId?: unknown;
  id?: unknown;
  repeatId?: unknown;
  groupId?: unknown;
  common?: {
    msgId?: unknown;
  };
  user?: {
    uniqueId?: unknown;
    displayId?: unknown;
    nickname?: unknown;
    profilePictureUrl?: unknown;
    avatarThumb?: unknown;
    avatarMedium?: {
      urlList?: unknown[];
    };
    avatarLarge?: {
      urlList?: unknown[];
    };
    profilePicture?: {
      url?: unknown[];
    };
  };
}

interface TikTokLikeData {
  uniqueId?: unknown;
  nickname?: unknown;
  profilePictureUrl?: unknown;
  likeCount?: unknown;
  totalLikeCount?: unknown;
  user?: {
    uniqueId?: unknown;
    displayId?: unknown;
    nickname?: unknown;
    profilePictureUrl?: unknown;
    avatarThumb?: unknown;
    avatarMedium?: {
      urlList?: unknown[];
    };
    avatarLarge?: {
      urlList?: unknown[];
    };
  };
}
