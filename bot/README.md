# TikTok Minecraft Live Bot

Bot Node.js + TypeScript que escuta gifts da Live do TikTok, baixa o avatar de quem enviou Rose/Rosa e envia a imagem processada para o plugin Paper `TikTokWall`.

## Instalação

```bash
cd ~/tiktok-minecraft-live/bot
npm install
cp .env.example .env
```

Edite `.env`:

```bash
TIKTOK_USERNAME=seu_usuario_tiktok_sem_arroba
MINECRAFT_PLUGIN_HOST=127.0.0.1
MINECRAFT_PLUGIN_PORT=4567
AVATAR_SIZE=128
AVATAR_DIR=./avatars
RCON_HOST=127.0.0.1
RCON_PORT=25575
RCON_PASSWORD=sua_senha_rcon
DURATION_SECONDS=15
ENABLE_LIKE_AVATAR=true
LIKE_AVATAR_COOLDOWN_MS=5000
ENABLE_EXTENDED_GIFT_INFO=false
ROSE_GIFT_NAMES=rose,rosa
ROSE_GIFT_IDS=
```

## Scripts

```bash
npm run ui
npm run dev
npm run build
npm start
npm run start:ui
npm run test:image
```

`npm run ui` abre uma interface local em `http://127.0.0.1:3333` para editar `.env`, iniciar/parar o bot, ver logs, checar o plugin e mandar imagem teste.

`npm run test:image` gera uma imagem fake e envia para o plugin, sem conectar no TikTok.

Também é possível enviar uma imagem local:

```bash
npm run test:image -- ./avatars/minha-imagem.png
```

## Como funciona

- Conecta na live definida por `TIKTOK_USERNAME`.
- Escuta eventos `gift`.
- Processa apenas gifts `Rose` ou `Rosa`.
- Quando `ENABLE_LIKE_AVATAR=true`, curtida renderiza a foto de perfil do usuário.
- Curtida aparece no chat como `curtiu a live`; rosa aparece como `enviou uma rosa`.
- `LIKE_AVATAR_COOLDOWN_MS` evita rajadas infinitas de avatar quando a live recebe muitas curtidas.
- `ENABLE_EXTENDED_GIFT_INFO=false` evita a chamada paga da EulerStream para buscar lista de gifts.
- `ROSE_GIFT_NAMES` e `ROSE_GIFT_IDS` permitem ajustar como o bot identifica a rosa.
- Ignora eventos intermediários de streak/repeat.
- Baixa o avatar, corta em quadrado centralizado e redimensiona para `AVATAR_SIZE`.
- `AVATAR_SIZE` aceita `32`, `48`, `64` ou `128`; deixe igual ao `/tiktokwall size` do plugin.
- Salva PNG em `bot/avatars/<username>-<timestamp>.png`.
- Envia `POST /render` para o plugin Paper.
- Usa fila local para processar uma pessoa por vez.
