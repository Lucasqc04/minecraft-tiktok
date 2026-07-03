#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR/bot"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js nao encontrado. Instale Node.js LTS: https://nodejs.org/en/download"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm nao encontrado. Reinstale Node.js LTS com npm."
  exit 1
fi

if [ ! -f ".env" ]; then
  cp ".env.example" ".env"
fi

if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias do bot..."
  npm install
fi

echo "Abrindo interface local..."
npm run ui
