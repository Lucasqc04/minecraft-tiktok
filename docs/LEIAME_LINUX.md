# LEIAME Linux - TikTok Minecraft Live

Este guia e para usar a integracao no Linux.

## Como Funciona

O site pode estar hospedado na Vercel, mas o Minecraft, o Paper, o bot e a ponte local rodam no seu PC.

Para o site conseguir controlar o bot local, abra:

```bash
./start-interface-linux.sh
```

Isso liga a ponte local:

```text
http://127.0.0.1:3333
```

## Instalar Programas

Voce precisa de:

- Minecraft Java Edition.
- Java JDK 25, recomendado Eclipse Temurin: https://adoptium.net/temurin/releases
- Node.js LTS: https://nodejs.org/en/download
- Paper: https://papermc.io/downloads/paper

No Ubuntu, se preferir instalar Node pelo NodeSource ou pelo pacote oficial da sua distro, tambem funciona. Confira:

```bash
node -v
npm -v
java -version
```

## Preparar O Paper

1. Crie uma pasta:

```bash
mkdir -p ~/MinecraftLive
```

2. Baixe o Paper, coloque dentro dessa pasta e renomeie para:

```text
paper.jar
```

3. Copie o script:

```bash
cp scripts/linux/start-paper.sh ~/MinecraftLive/start-paper.sh
chmod +x ~/MinecraftLive/start-paper.sh
```

4. Rode:

```bash
cd ~/MinecraftLive
./start-paper.sh
```

Na primeira vez o Paper vai parar e criar `eula.txt`.

5. Aceite a EULA:

```bash
sed -i 's/eula=false/eula=true/' eula.txt
```

6. Rode o Paper de novo:

```bash
./start-paper.sh
```

Quando o servidor terminar de iniciar, voce pode parar com:

```text
stop
```

## Ativar RCON

Abra `server.properties` dentro de `~/MinecraftLive` e configure:

```properties
enable-rcon=true
rcon.port=25575
rcon.password=troque-essa-senha
```

RCON e opcional para a live funcionar, mas permite que o site mande comandos de teste para o Minecraft.

## Instalar O Plugin

Copie o plugin:

```bash
cp TikTokWall.jar ~/MinecraftLive/plugins/TikTokWall.jar
```

Se a pasta `plugins` ainda nao existir, rode o Paper uma vez.

Depois reinicie o Paper.

## Entrar No Minecraft

1. Abra Minecraft Java.
2. Use a mesma versao do Paper.
3. Entre em Multiplayer.
4. Adicione o servidor:

```text
localhost
```

Se precisar de permissao para comandos, no console do Paper rode:

```text
op SeuNickDoMinecraft
```

## Preparar A Parede

Dentro do Minecraft:

```text
/tiktokwall setup
/tiktokwall size 128
/tiktokwall dithering off
/tiktokwall animation on
/tiktokwall animationspeed 8
/tiktokwall test
```

## Abrir A Ponte Local

Na pasta do projeto:

```bash
chmod +x start-interface-linux.sh
./start-interface-linux.sh
```

Na primeira vez ele instala dependencias do bot.

Depois abra o site hospedado na Vercel ou a interface local:

```text
http://127.0.0.1:3333
```

## Configurar A Live

No site/interface:

- `TikTok username sem @`: conta que esta ao vivo.
- `Tamanho do avatar`: `128`.
- `Duracao`: `15`.
- `Cooldown de curtida`: `5000`.
- `Host plugin`: `127.0.0.1`.
- `Porta plugin`: `4567`.
- `Rosa por nome`: `rose,rosa`.
- `Gift info avancado`: desligado.

Clique em `Salvar`, depois `Enviar imagem teste`.

Se a imagem apareceu na parede, clique em `Iniciar bot` quando a live estiver aberta.

## Pedir Ajuda Para IA

No site, clique em:

```text
Copiar contexto para IA
```

Cole em uma IA e peça:

```text
Me guia passo a passo para resolver o problema.
```

## Problemas Comuns

### Imagem aparece em um canto

O tamanho do bot e do plugin nao batem:

```text
/tiktokwall size 128
```

E no site:

```text
Tamanho do avatar = 128
```

### Pontos rosa ou ruido estranho

```text
/tiktokwall dithering off
```

### Site nao conecta na ponte local

Confira:

```bash
./start-interface-linux.sh
```

E abra:

```text
http://127.0.0.1:3333
```

### Plugin sem resposta

Confira se o Paper esta aberto e se o plugin carregou:

```text
/tiktokwall info
```
