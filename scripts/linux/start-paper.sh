#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if [ ! -f "paper.jar" ]; then
  echo "Coloque o arquivo do Paper nesta pasta com o nome paper.jar"
  exit 1
fi

java -Xms2G -Xmx4G -jar paper.jar --nogui
