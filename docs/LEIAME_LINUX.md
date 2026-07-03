# LEIAME Linux - TikTok Minecraft Live

Este guia e para usar a integracao no Linux.

## Como Funciona

Voce pode receber um link publico do portal TikTok Minecraft Live. Ele concentra download, passo a passo, configuracao e suporte.

O Minecraft, o Paper, o plugin e o bot rodam no seu computador. O portal so consegue controlar tudo quando a ponte local esta aberta.

Paginas principais do portal:

- `Setup`: instalacao passo a passo.
- `Painel`: configuracao, logs, bot e comandos Minecraft.
- `Atualizacoes`: verifica se o TikTokWall.jar local esta defasado.
- `IA`: copia um contexto grande para pedir ajuda.

Para o portal conseguir controlar o bot local, abra:

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

No Ubuntu, comece assim:

```bash
sudo apt update
sudo apt install -y curl unzip
```

Tente instalar Java pelo apt:

```bash
sudo apt install -y openjdk-25-jdk
```

Se o Ubuntu responder que nao encontrou `openjdk-25-jdk`, instale o Temurin JDK 25 pelo site:

```text
https://adoptium.net/temurin/releases/?version=25
```

Instale Node.js LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

Confira:

```bash
java -version
node -v
npm -v
```

O `java -version` precisa mostrar Java 25. O `node -v` e `npm -v` precisam responder uma versao, sem erro.

## Verificar A Versao Do Minecraft E Do Paper

1. Abra o Minecraft Launcher.
2. Veja qual versao do Minecraft Java voce vai usar na live.
3. Baixe o Paper da mesma versao:

```text
https://papermc.io/downloads/paper
```

Exemplo: se o Minecraft vai abrir na versao `26.2`, baixe Paper `26.2`. Se a versao que voce quer ainda nao aparece no site do Paper, use uma versao do Minecraft que tenha Paper disponivel.

Depois de baixar, deixe o arquivo `.jar` do Paper na pasta `~/Downloads`.

## Preparar O Servidor Paper

Estes comandos assumem que voce extraiu o pack em `~/Downloads/tiktok-minecraft-live`.

1. Entre na pasta do pack:

```bash
cd ~/Downloads/tiktok-minecraft-live
```

2. Crie a pasta do servidor:

```bash
mkdir -p ~/MinecraftLive
```

3. Copie o Paper baixado para o servidor com o nome correto:

```bash
cp ~/Downloads/paper-*.jar ~/MinecraftLive/paper.jar
```

Se aparecer erro dizendo que nao encontrou `paper-*.jar`, o arquivo do Paper nao esta em `~/Downloads` ou esta com outro nome.

4. Copie o script que inicia o servidor:

```bash
cp ~/Downloads/tiktok-minecraft-live/scripts/linux/start-paper.sh ~/MinecraftLive/start-paper.sh
chmod +x ~/MinecraftLive/start-paper.sh
```

5. Rode o Paper pela primeira vez:

```bash
cd ~/MinecraftLive
./start-paper.sh
```

Na primeira vez o Paper deve parar sozinho e criar `eula.txt`.

6. Aceite a EULA:

```bash
sed -i 's/eula=false/eula=true/' eula.txt
```

7. Rode o Paper de novo:

```bash
./start-paper.sh
```

Espere aparecer no console algo parecido com `Done`. Depois pare o servidor digitando no console do Paper:

```text
stop
```

## Ativar RCON

Abra `server.properties`:

```bash
nano ~/MinecraftLive/server.properties
```

Procure e ajuste estas linhas:

```properties
enable-rcon=true
rcon.port=25575
rcon.password=troque-essa-senha
```

RCON e opcional para a live funcionar, mas permite que o portal mande comandos de teste para o Minecraft.

Sua senha RCON e o arquivo `.env` ficam no computador da live. Nao publique esses arquivos.

## Instalar O Plugin

Agora a pasta `plugins` ja existe. Copie o plugin:

```bash
mkdir -p ~/MinecraftLive/plugins
cp ~/Downloads/tiktok-minecraft-live/TikTokWall.jar ~/MinecraftLive/plugins/TikTokWall.jar
```

Depois inicie o Paper de novo:

```bash
cd ~/MinecraftLive
./start-paper.sh
```

No console do Paper, confirme que aparece algo parecido com `TikTokWall enabled` ou `HTTP server listening on 127.0.0.1:4567`.

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

Na pasta do pack:

```bash
cd ~/Downloads/tiktok-minecraft-live
chmod +x start-interface-linux.sh
./start-interface-linux.sh
```

Na primeira vez ele instala dependencias do bot.

Depois abra o portal online ou a interface local:

```text
http://127.0.0.1:3333
```

## Configurar A Live

No portal/interface:

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

## Atualizar O Plugin

No portal, abra a pagina `Atualizações`.

Se aparecer `Atualização disponível`:

1. Clique em `Baixar TikTokWall.jar`.
2. No console do Paper, digite:

```text
stop
```

3. Substitua o JAR antigo pelo novo:

```bash
cp ~/Downloads/TikTokWall.jar ~/MinecraftLive/plugins/TikTokWall.jar
```

4. Inicie o Paper de novo:

```bash
cd ~/MinecraftLive
./start-paper.sh
```

5. Volte no portal e clique em:

```text
Verificar versão
```

Se aparecer `Atualizado`, o plugin local esta na versao mais recente.

## Pedir Ajuda Para IA

No portal, clique em:

```text
Copiar contexto para IA
```

Cole em uma IA e peça:

```text
Me guia passo a passo para resolver o problema.
```

## Problemas Comuns

### Erro: `plugins/TikTokWall.jar`: Arquivo ou diretorio inexistente

Voce tentou copiar o plugin antes de criar a pasta `plugins`. Rode:

```bash
mkdir -p ~/MinecraftLive/plugins
cp ~/Downloads/tiktok-minecraft-live/TikTokWall.jar ~/MinecraftLive/plugins/TikTokWall.jar
```

### Erro: `./start-paper.sh`: arquivo ou diretorio inexistente

Voce entrou em `~/MinecraftLive`, mas ainda nao copiou o script para la. Rode:

```bash
cp ~/Downloads/tiktok-minecraft-live/scripts/linux/start-paper.sh ~/MinecraftLive/start-paper.sh
chmod +x ~/MinecraftLive/start-paper.sh
cd ~/MinecraftLive
./start-paper.sh
```

### Imagem aparece em um canto

O tamanho do bot e do plugin nao batem:

```text
/tiktokwall size 128
```

E no portal:

```text
Tamanho do avatar = 128
```

### Pontos rosa ou ruido estranho

```text
/tiktokwall dithering off
```

### Portal nao conecta na ponte local

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
