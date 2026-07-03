#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE_DIR="$ROOT_DIR/release"
PACKAGE_DIR="$RELEASE_DIR/tiktok-minecraft-live"
ZIP_PATH="$RELEASE_DIR/tiktok-minecraft-live.zip"

cd "$ROOT_DIR/bot"
npm install
npm run build

cd "$ROOT_DIR/minecraft-plugin"
mvn package

mkdir -p "$ROOT_DIR/web/downloads"
cp "$ROOT_DIR/minecraft-plugin/target/TikTokWall.jar" "$ROOT_DIR/web/downloads/TikTokWall.jar"
rm -f "$ROOT_DIR/web/downloads/tiktok-minecraft-live.zip"

rm -rf "$PACKAGE_DIR" "$ZIP_PATH"
mkdir -p "$PACKAGE_DIR"

rsync -a \
  --exclude ".git" \
  --exclude ".env" \
  --exclude "bot/.env" \
  --exclude "bot/node_modules" \
  --exclude "bot/dist" \
  --exclude "bot/avatars" \
  --exclude "minecraft-plugin/target" \
  --exclude "release" \
  "$ROOT_DIR/" "$PACKAGE_DIR/"

cp "$ROOT_DIR/minecraft-plugin/target/TikTokWall.jar" "$PACKAGE_DIR/TikTokWall.jar"

cd "$RELEASE_DIR"
zip -r "tiktok-minecraft-live.zip" "tiktok-minecraft-live"
cp "$ZIP_PATH" "$ROOT_DIR/web/downloads/tiktok-minecraft-live.zip"

echo "Release criada em: $ZIP_PATH"
