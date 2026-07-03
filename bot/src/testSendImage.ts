import path from "node:path";
import { createFakeAvatar, processLocalImage } from "./avatar.js";
import { loadConfig } from "./config.js";
import { MinecraftClient } from "./minecraftClient.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : "";

  const avatar = inputPath
    ? await processLocalImage({
        inputPath,
        username: "local-test",
        size: config.avatarSize,
        avatarDir: config.avatarDir
      })
    : await createFakeAvatar({
        username: "fake-avatar",
        size: config.avatarSize,
        avatarDir: config.avatarDir
      });

  const client = new MinecraftClient({
    host: config.minecraftPluginHost,
    port: config.minecraftPluginPort
  });

  console.log(`[test:image] sending ${avatar.filePath}`);
  const response = await client.render({
    username: "local-test",
    nickname: "Teste Local",
    eventType: "local-test",
    eventLabel: "renderizou uma imagem de teste",
    imageBase64: avatar.imageBase64,
    size: config.avatarSize,
    durationSeconds: config.durationSeconds
  });

  console.log("[test:image] plugin response:", response);
}

main().catch((error) => {
  console.error("[test:image] failed:", error);
  process.exitCode = 1;
});
