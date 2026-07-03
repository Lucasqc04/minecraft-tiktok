# LEIAME Windows - TikTok Minecraft Live

Este guia e para quem quer usar a integracao na live, sem programar.

Se voce estiver no Linux, use [LEIAME_LINUX.md](LEIAME_LINUX.md).

## O Que Vai Acontecer

Quando alguem curtir ou mandar uma rosa na live do TikTok:

1. o bot pega a foto de perfil da pessoa;
2. envia para o plugin do Minecraft;
3. o plugin monta a foto numa parede de blocos;
4. depois de alguns segundos a parede limpa;
5. a proxima pessoa da fila aparece.

## Portal Online E Ponte Local

Voce pode receber um link publico do portal TikTok Minecraft Live. Ele ajuda com download, passo a passo, configuracao e suporte.

O Minecraft, o Paper, o plugin e o bot rodam no seu computador. O portal so consegue controlar tudo quando a ponte local esta aberta. Por isso voce tambem precisa abrir:

```text
start-interface-windows.bat
```

Esse arquivo liga a ponte local em:

```text
http://127.0.0.1:3333
```

Quando a ponte esta aberta, o portal consegue salvar configuracoes no seu proprio computador, iniciar/parar o bot, mandar teste e enviar comandos seguros para o plugin.

Paginas principais do portal:

- `Setup`: instalacao passo a passo.
- `Painel`: configuracao, logs, bot e comandos Minecraft.
- `Atualizacoes`: verifica se o TikTokWall.jar local esta defasado.
- `IA`: copia um contexto grande para pedir ajuda.

Sua senha RCON e o arquivo `.env` ficam no computador da live. Nao publique esses arquivos.

## Programas Necessarios

Instale:

- Minecraft Java Edition.
- Java JDK 25, recomendado Eclipse Temurin: https://adoptium.net/temurin/releases
- Node.js LTS: https://nodejs.org/en/download
- Paper: https://papermc.io/downloads/paper

Depois de instalar Java e Node, abra o PowerShell e confira:

```text
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

## Preparar O Servidor Paper

1. Crie uma pasta, por exemplo:

```text
C:\MinecraftLive
```

2. Pegue o arquivo `.jar` do Paper que voce baixou, renomeie para:

```text
paper.jar
```

3. Coloque esse arquivo aqui:

```text
C:\MinecraftLive\paper.jar
```

4. Copie o arquivo abaixo do pack para dentro de `C:\MinecraftLive`:

```text
C:\TikTokMinecraftLive\scripts\windows\start-paper.bat
```

O destino deve ficar assim:

```text
C:\MinecraftLive\start-paper.bat
```

5. De duplo clique em:

```text
C:\MinecraftLive\start-paper.bat
```

Na primeira vez, o Paper vai parar e criar `eula.txt`.

6. Abra:

```text
C:\MinecraftLive\eula.txt
```

Troque:

```text
eula=false
```

para:

```text
eula=true
```

7. Rode `start-paper.bat` de novo.

Quando o servidor terminar de iniciar, espere aparecer algo parecido com `Done`. Depois pare com:

```text
stop
```

## Ativar RCON

Abra `server.properties` dentro de `C:\MinecraftLive` e ajuste:

```properties
enable-rcon=true
rcon.port=25575
rcon.password=coloque-uma-senha-aqui
```

Salve o arquivo.

RCON e opcional para a live funcionar, mas ajuda a interface a mandar comandos de teste.

## Instalar O Plugin TikTokWall

Agora a pasta `plugins` ja existe. Copie:

```text
C:\TikTokMinecraftLive\TikTokWall.jar
```

para:

```text
C:\MinecraftLive\plugins\TikTokWall.jar
```

Depois reinicie o Paper.

No console do Paper, confirme que aparece algo parecido com `TikTokWall enabled` ou `HTTP server listening on 127.0.0.1:4567`.

## Entrar No Mundo

1. Abra o Minecraft Java.
2. Use a mesma versao do servidor Paper.
3. Entre em Multiplayer.
4. Adicione servidor:

```text
localhost
```

5. Entre no mundo.

Se precisar de permissao para comandos, no console do Paper rode:

```text
op SeuNickDoMinecraft
```

## Preparar A Parede

Dentro do Minecraft, rode:

```text
/tiktokwall setup
```

Isso limpa uma area, cria uma parede, deixa o mundo de dia, coloca voce em criativo e prepara tudo.

Comandos uteis:

```text
/tiktokwall test
/tiktokwall clear
/tiktokwall size 128
/tiktokwall dithering off
/tiktokwall animation on
/tiktokwall animationspeed 8
/tiktokwall info
```

Recomendado para live:

```text
/tiktokwall size 128
/tiktokwall dithering off
/tiktokwall animation on
/tiktokwall animationspeed 8
```

## Abrir A Interface

No pacote do projeto, dê duplo clique em:

```text
start-interface-windows.bat
```

Na primeira vez ele instala as dependencias do bot. Pode demorar alguns minutos.

Depois ele abre:

```text
http://127.0.0.1:3333
```

Se voce recebeu um link do portal online, abra o link tambem. O portal deve mostrar que a ponte local esta conectada.

## Configurar A Live Na Interface

Preencha:

- `TikTok username sem @`: nome da conta que esta ao vivo.
- `Tamanho do avatar`: use o mesmo do plugin, recomendado `128`.
- `Duracao na parede`: recomendado `15`.
- `Cooldown de curtida`: recomendado `5000`.
- `Host do plugin`: `127.0.0.1`.
- `Porta do plugin`: `4567`.
- `Gifts que contam como rosa`: `rose,rosa`.
- `RCON senha`: a mesma do `server.properties`, se quiser usar os botoes de comando.

Deixe:

```text
Gift info avancado: desligado
```

Clique em:

```text
Salvar configuracao
```

## Testar Antes Da Live

1. Paper aberto.
2. Minecraft dentro do mundo.
3. Parede preparada com `/tiktokwall setup`.
4. Ponte local aberta pelo `start-interface-windows.bat`.
5. Site ou interface local aberta.
6. Clique em:

```text
Checar plugin
```

Depois clique:

```text
Enviar imagem teste
```

Se apareceu imagem na parede, a parte Minecraft esta funcionando.

## Atualizar O Plugin

No portal, abra a pagina `Atualizações`.

Se aparecer `Atualização disponível`:

1. Clique em `Baixar TikTokWall.jar`.
2. No console do Paper, digite:

```text
stop
```

3. Substitua o arquivo antigo:

```text
C:\MinecraftLive\plugins\TikTokWall.jar
```

pelo `TikTokWall.jar` novo que voce baixou.

4. Abra de novo:

```text
C:\MinecraftLive\start-paper.bat
```

5. Volte no portal e clique em:

```text
Verificar versão
```

Se aparecer `Atualizado`, o plugin local esta na versao mais recente.

## Pedir Ajuda Para IA

No portal, use o botao:

```text
Copiar contexto para IA
```

Cole esse texto no ChatGPT, Gemini, Claude ou outra IA e peça:

```text
Me guia passo a passo para resolver o problema.
```

Esse contexto ja inclui como o projeto funciona, configuracoes, comandos Minecraft e erros comuns.

## Ligar Na Live

1. Abra a live no TikTok.
2. Confira se o usuario na interface esta correto.
3. Clique:

```text
Iniciar bot
```

Quando alguem curtir ou mandar rosa, o avatar deve aparecer na parede.

## Problemas Comuns

### A imagem aparece so em um canto

O tamanho do bot e do plugin esta diferente.

Exemplo correto:

```text
/tiktokwall size 128
```

Na interface:

```text
Tamanho do avatar = 128
```

### Aparece muito pontinho rosa

Use:

```text
/tiktokwall dithering off
```

### A interface nao consegue checar o plugin

Confira:

- Paper esta aberto.
- O plugin carregou sem erro.
- Porta do plugin na interface esta `4567`.
- O firewall nao bloqueou Java.

### O bot nao conecta no TikTok

Confira:

- A conta esta realmente ao vivo.
- O username esta sem `@`.
- `Gift info avancado` esta desligado.
- A live e publica.

### O bot nao mostra curtidas

Confira se esta ligado:

```text
Curtida mostra avatar
```

E ajuste o cooldown. `5000` significa uma curtida renderizada a cada 5 segundos no maximo.
