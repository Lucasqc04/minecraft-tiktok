# TikTokWall Paper Plugin

Plugin Paper que abre um HTTP local em `127.0.0.1:4567` e renderiza imagens PNG base64 como pixel art de blocos.

Não usa WorldEdit, ImageOnMap, mod client-side ou plugin externo.

## Compilar

```bash
cd ~/tiktok-minecraft-live/minecraft-plugin
mvn package
```

O JAR final fica em:

```bash
target/TikTokWall.jar
```

## Instalar no servidor Paper

```bash
cp target/TikTokWall.jar ~/minecraft-live/plugins/
```

Reinicie o Paper depois de copiar o JAR.

## Configuração

O plugin cria `plugins/TikTokWall/config.yml`:

```yaml
world: world
origin:
  x: 0
  y: 80
  z: 0
facing: NORTH
defaultSize: 48
durationSeconds: 15
clearMaterial: AIR
httpPort: 4567
dithering: false
ditheringStrength: 18
animation:
  enabled: true
  rowsPerTick: 4
nameplate:
  enabled: true
  material: BLACK_CONCRETE
  maxChars: 16
  yOffset: 3
fireworks:
  mode: gift
  count: 5
  power: 1
setup:
  autoOnJoin: true
  onlyOnce: true
  completed: false
  wallDistance: 10
  clearPadding: 8
  clearDepth: 26
  creativeMode: true
  teleportPlayer: true
  runTestAfterSetup: true
  prepareWorld: true
  alwaysDay: true
  clearWeather: true
  peacefulDifficulty: true
  disableMobSpawning: true
  keepInventory: true
  disableFireSpread: true
  disableMobGriefing: true
  disableInsomnia: true
  floorMaterial: SMOOTH_STONE
  wallMaterial: BLACK_CONCRETE
  frameMaterial: WHITE_CONCRETE
```

`origin` é o canto superior esquerdo visual da imagem. O pixel `(0,0)` usa esse bloco e a imagem cresce para baixo.

Com `setup.autoOnJoin: true`, o primeiro join depois do restart prepara tudo automaticamente uma vez:

- limpa uma área grande em volta do jogador;
- cria piso;
- cria uma parede 48x48 com moldura;
- define a origem da TikTokWall;
- define `facing: SOUTH`;
- muda `clearMaterial` para `BLACK_CONCRETE`, então a parede fica montada depois que a imagem some;
- coloca o jogador em criativo;
- libera voo, enche fome/saturação e apaga fogo do jogador;
- deixa o mundo sempre de dia;
- limpa chuva/trovão e desliga ciclo de clima;
- muda a dificuldade para peaceful;
- desliga spawn de mobs, patrulhas, raids, insônia, fire spread e mob griefing;
- liga keepInventory;
- teleporta o jogador olhando para a parede;
- roda um `/tiktokwall test` automaticamente.

## Comandos

```text
/tiktokwall setup
/tiktokwall setpos
/tiktokwall clear
/tiktokwall test
/tiktokwall size <32|48|64|128|256>
/tiktokwall info
/tiktokwall facing <NORTH|SOUTH|EAST|WEST>
/tiktokwall dithering <on|off>
/tiktokwall ditheringstrength <0-64>
/tiktokwall animation <on|off>
/tiktokwall animationspeed <1-32>
/tiktokwall nameplate <on|off>
/tiktokwall nameplatematerial <MATERIAL>
/tiktokwall fireworks <off|like|gift|any>
/tiktokwall fireworkcount <1-20>
/tiktokwall fireworkpower <0-3>
```

Use `/tiktokwall setup` para refazer a preparação automática a qualquer momento. Ele usa a posição atual do jogador como referência e cria a parede alguns blocos à frente.

Use `/tiktokwall setpos` olhando para o bloco que deve ser o canto superior esquerdo da parede.

Use `/tiktokwall facing ...` para ajustar o lado visual da parede:

- `NORTH` ou `SOUTH`: a largura varia no eixo X.
- `EAST` ou `WEST`: a largura varia no eixo Z.

Use `/tiktokwall dithering off` para o modo mais limpo. O dithering agora vem desligado por padrão porque pode deixar foto de live muito granulada.

Se quiser testar o dithering leve, use:

```text
/tiktokwall dithering on
/tiktokwall ditheringstrength 12
```

Valores maiores misturam mais blocos, mas podem criar ruído visual. O máximo é `64`.

Use `/tiktokwall animation on` para a imagem entrar de cima para baixo e limpar de baixo para cima. A velocidade padrao é `4` linhas por tick:

```text
/tiktokwall animation on
/tiktokwall animationspeed 4
```

Valores maiores deixam a transição mais rápida. Para `128x128`, `4` ou `8` costuma ficar bom.

Use `/tiktokwall nameplate on` para mostrar o nome do último usuário acima da parede com blocos.

Use `/tiktokwall fireworks gift` para fogos só em gifts, `/tiktokwall fireworks like` para curtidas, `/tiktokwall fireworks any` para todos os eventos ou `/tiktokwall fireworks off` para desligar.

O tamanho máximo suportado agora é `256x256`. Para testar:

```text
/tiktokwall size 256
/tiktokwall setup
/tiktokwall test
```

Se for usar o bot em `256`, ajuste também `AVATAR_SIZE=256` no `bot/.env` e reinicie o bot.

## Endpoints HTTP

```http
GET /health
POST /render
POST /test
```

Body de `/render`:

```json
{
  "username": "usuario",
  "nickname": "Nome",
  "eventType": "like",
  "eventLabel": "curtiu a live",
  "imageBase64": "png_base64",
  "size": 48,
  "durationSeconds": 15,
  "clearAfter": true,
  "animate": true
}
```

Se a parede estiver ocupada, o plugin responde `409` para o bot manter a fila.

`POST /test` executa o mesmo teste colorido do comando `/tiktokwall test`.

## Teste completo

1. Compile o plugin com `mvn package`.
2. Copie `target/TikTokWall.jar` para `~/minecraft-live/plugins/`.
3. Reinicie o Paper.
4. Entre no servidor por `localhost`.
5. Entre no mundo. O setup automático deve criar a área e rodar o teste sozinho.
6. Se quiser refazer manualmente, use `/tiktokwall setup`.
7. Em outro terminal:

```bash
cd ~/tiktok-minecraft-live/bot
npm install
cp .env.example .env
npm run test:image
```

8. Para ligar na live, preencha `TIKTOK_USERNAME` no `bot/.env` e rode:

```bash
npm run dev
```
