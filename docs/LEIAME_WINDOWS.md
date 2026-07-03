# LEIAME Windows - TikTok Minecraft Live

Este guia e para usar o TikTok Minecraft Live no Windows, sem precisar programar.

Se voce estiver no Linux, use [LEIAME_LINUX.md](LEIAME_LINUX.md).

## O Que Vai Acontecer

Quando alguem curtir ou mandar uma rosa na live do TikTok:

1. o bot pega a foto de perfil da pessoa;
2. envia para o plugin do Minecraft;
3. o plugin monta a foto numa parede de blocos;
4. curtidas podem preencher um mosaico;
5. gift pode ocupar o painel inteiro;
6. nome, fogos, animacao e tempo seguem a configuracao do painel.

## Escolha Um Caminho

Use apenas um dos caminhos abaixo.

- **Caminho A - PowerShell copiando e colando:** recomendado se voce aceita abrir o terminal e copiar comandos. E mais rapido e parecido com o guia Linux.
- **Caminho B - Windows explicado sem terminal:** recomendado para quem prefere clicar nas pastas, renomear arquivos e editar no Bloco de Notas.

Os dois caminhos chegam no mesmo resultado: pack extraido em `Downloads\tiktok-minecraft-live`, Paper local em `C:\MinecraftLive`, plugin TikTokWall instalado e ponte local aberta.

## Portal Online E Ponte Local

Voce pode receber um link publico do portal TikTok Minecraft Live. Ele ajuda com download, passo a passo, configuracao e suporte.

O Minecraft, o Paper, o plugin e o bot rodam no computador da live. O portal so consegue controlar tudo quando a ponte local esta aberta.

No Windows, a ponte local e:

```text
start-interface-windows.bat
```

Ela abre uma interface local em:

```text
http://127.0.0.1:3333
```

Paginas principais do portal:

- `Setup`: instalacao passo a passo.
- `Painel`: configuracao, logs, bot e comandos Minecraft.
- `Comandos`: wiki completa dos comandos do plugin.
- `Atualizacoes`: verifica se o TikTokWall.jar local esta defasado.
- `IA`: copia um contexto grande para pedir ajuda.

Sua senha RCON e o arquivo `.env` ficam no computador da live. Nao publique esses arquivos.

## Programas Necessarios

Voce precisa de:

- Minecraft Java Edition.
- Java JDK 25.
- Node.js LTS.
- Paper da mesma versao do Minecraft Java que voce vai usar.

Links:

```text
https://adoptium.net/temurin/releases/?version=25
https://nodejs.org/en/download
https://papermc.io/downloads/paper
```

Para conferir se Java e Node foram instalados, abra o PowerShell e rode:

```powershell
java -version
node -v
npm -v
```

O `java -version` precisa mostrar Java 25. O `node -v` e `npm -v` precisam responder uma versao, sem erro.

## Caminho A - PowerShell Copiando E Colando

Use este caminho se o arquivo `tiktok-minecraft-live.zip` esta na pasta Downloads.

Abra o menu Iniciar, procure `PowerShell`, clique para abrir e copie uma linha por vez.

### A1. Extrair O Pack

```powershell
cd "$env:USERPROFILE\Downloads"
```

```powershell
Expand-Archive -Force .\tiktok-minecraft-live.zip -DestinationPath .
```

```powershell
cd .\tiktok-minecraft-live
```

### A2. Instalar Java JDK 25 E Node.js LTS

Tente instalar pelo `winget`:

```powershell
winget install --id EclipseAdoptium.Temurin.25.JDK -e
```

```powershell
winget install --id OpenJS.NodeJS.LTS -e
```

Se o Windows pedir permissao ou confirmacao, aceite.

Depois feche e abra o PowerShell novamente. Confira:

```powershell
java -version
```

```powershell
node -v
```

```powershell
npm -v
```

Se `winget` nao existir ou falhar, instale manualmente pelos links:

```text
https://adoptium.net/temurin/releases/?version=25
https://nodejs.org/en/download
```

### A3. Baixar O Paper Correto

1. Abra o Minecraft Launcher.
2. Veja qual versao do Minecraft Java voce vai usar na live.
3. Baixe o Paper da mesma versao:

```text
https://papermc.io/downloads/paper
```

Depois de baixar o Paper, volte ao PowerShell e rode:

```powershell
$server = "C:\MinecraftLive"
```

```powershell
New-Item -ItemType Directory -Force $server
```

```powershell
$paper = Get-ChildItem "$env:USERPROFILE\Downloads\paper-*.jar" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
```

```powershell
Copy-Item $paper.FullName "$server\paper.jar" -Force
```

```powershell
Copy-Item "$env:USERPROFILE\Downloads\tiktok-minecraft-live\scripts\windows\start-paper.bat" "$server\start-paper.bat" -Force
```

Se voce baixou mais de um Paper e quiser evitar erro, apague os Paper antigos da pasta Downloads ou deixe apenas o Paper que vai usar.

### A4. Iniciar O Paper E Aceitar A EULA

```powershell
cd C:\MinecraftLive
```

```powershell
.\start-paper.bat
```

Na primeira vez, o Paper deve parar e criar `eula.txt`.

Agora aceite a EULA:

```powershell
(Get-Content .\eula.txt) -replace 'eula=false','eula=true' | Set-Content .\eula.txt
```

Inicie de novo:

```powershell
.\start-paper.bat
```

Quando aparecer `Done` no console do Paper, digite:

```text
stop
```

e aperte `Enter`.

### A5. Instalar Plugin E Ativar RCON

Com o Paper parado, rode:

```powershell
New-Item -ItemType Directory -Force "C:\MinecraftLive\plugins"
```

```powershell
Copy-Item "$env:USERPROFILE\Downloads\tiktok-minecraft-live\TikTokWall.jar" "C:\MinecraftLive\plugins\TikTokWall.jar" -Force
```

Configure RCON:

```powershell
$props="C:\MinecraftLive\server.properties"; (Get-Content $props) -replace '^enable-rcon=.*','enable-rcon=true' -replace '^rcon.port=.*','rcon.port=25575' -replace '^rcon.password=.*','rcon.password=troque-essa-senha' | Set-Content $props
```

Importante: troque `troque-essa-senha` por uma senha sua antes da live. Voce pode editar depois em:

```text
C:\MinecraftLive\server.properties
```

Inicie o Paper com o plugin:

```powershell
cd C:\MinecraftLive
```

```powershell
.\start-paper.bat
```

No console do Paper, confirme que aparece algo parecido com `TikTokWall enabled` ou `HTTP server listening on 127.0.0.1:4567`.

### A6. Abrir A Ponte Local

Abra outro PowerShell ou use a janela antiga depois que o servidor ja estiver rodando:

```powershell
cd "$env:USERPROFILE\Downloads\tiktok-minecraft-live"
```

```powershell
.\start-interface-windows.bat
```

Na primeira vez, ele instala as dependencias do bot. Pode demorar alguns minutos.

Depois abra:

```text
http://127.0.0.1:3333
```

Se voce recebeu um link do portal online, abra o link tambem. Ele deve mostrar `Ponte local conectada`.

## Caminho B - Windows Explicado Sem Terminal

Use este caminho se a pessoa prefere fazer pelo Explorador de Arquivos e Bloco de Notas.

### B1. Baixar E Extrair O Pack

1. Baixe `tiktok-minecraft-live.zip`.
2. Abra a pasta `Downloads`.
3. Clique com o botao direito no ZIP.
4. Clique em `Extrair tudo`.
5. Deixe o Windows criar a pasta:

```text
Downloads\tiktok-minecraft-live
```

6. Abra a pasta extraida e confirme que existem:

```text
TikTokWall.jar
bot
docs
start-interface-windows.bat
scripts
```

### B2. Instalar Java E Node

Baixe e instale:

```text
https://adoptium.net/temurin/releases/?version=25
https://nodejs.org/en/download
```

Use as opcoes padrao dos instaladores.

Para conferir:

1. Abra o menu Iniciar.
2. Procure `PowerShell`.
3. Abra.
4. Rode:

```powershell
java -version
node -v
npm -v
```

Se aparecer Java 25 e versoes do Node/npm, esta certo.

### B3. Preparar A Pasta Do Paper

1. Abra o Minecraft Launcher.
2. Veja qual versao do Minecraft Java vai usar na live.
3. Baixe o Paper da mesma versao:

```text
https://papermc.io/downloads/paper
```

4. Crie a pasta:

```text
C:\MinecraftLive
```

5. Renomeie o arquivo do Paper baixado para:

```text
paper.jar
```

6. Coloque esse arquivo aqui:

```text
C:\MinecraftLive\paper.jar
```

7. Copie o arquivo do pack:

```text
C:\Users\SEU_USUARIO\Downloads\tiktok-minecraft-live\scripts\windows\start-paper.bat
```

para:

```text
C:\MinecraftLive\start-paper.bat
```

Troque `SEU_USUARIO` pelo nome do usuario do Windows. Se preferir, navegue pelas pastas: `Downloads`, depois `tiktok-minecraft-live`, depois `scripts`, depois `windows`.

### B4. Iniciar O Paper E Aceitar A EULA

1. De duplo clique em:

```text
C:\MinecraftLive\start-paper.bat
```

2. Na primeira vez, o Paper deve parar e criar `eula.txt`.
3. Abra:

```text
C:\MinecraftLive\eula.txt
```

4. Troque:

```text
eula=false
```

por:

```text
eula=true
```

5. Salve com `Ctrl+S`.
6. De duplo clique em `C:\MinecraftLive\start-paper.bat` de novo.
7. Quando aparecer `Done` no console do Paper, digite:

```text
stop
```

e aperte `Enter`.

### B5. Instalar Plugin E Ativar RCON

Copie:

```text
C:\Users\SEU_USUARIO\Downloads\tiktok-minecraft-live\TikTokWall.jar
```

para:

```text
C:\MinecraftLive\plugins\TikTokWall.jar
```

Troque `SEU_USUARIO` pelo nome do usuario do Windows. Tambem da para abrir `Downloads\tiktok-minecraft-live` pelo Explorador e arrastar o `TikTokWall.jar` para `C:\MinecraftLive\plugins`.

Agora abra no Bloco de Notas:

```text
C:\MinecraftLive\server.properties
```

Use `Ctrl+F` para procurar cada linha.

Procure `enable-rcon`. Se estiver:

```properties
enable-rcon=false
```

troque para:

```properties
enable-rcon=true
```

Procure `rcon.port` e deixe:

```properties
rcon.port=25575
```

Procure `rcon.password` e coloque uma senha sua:

```properties
rcon.password=minha-senha-forte
```

Salve com `Ctrl+S`.

Agora rode de novo:

```text
C:\MinecraftLive\start-paper.bat
```

No console do Paper, confirme que aparece algo parecido com `TikTokWall enabled` ou `HTTP server listening on 127.0.0.1:4567`.

### B6. Abrir A Ponte Local

De duplo clique em:

```text
C:\Users\SEU_USUARIO\Downloads\tiktok-minecraft-live\start-interface-windows.bat
```

Troque `SEU_USUARIO` pelo nome do usuario do Windows. Pelo Explorador de Arquivos, basta abrir `Downloads`, entrar em `tiktok-minecraft-live` e dar duplo clique em `start-interface-windows.bat`.

Na primeira vez ele instala as dependencias do bot. Pode demorar alguns minutos.

Depois abra:

```text
http://127.0.0.1:3333
```

Se voce recebeu um link do portal online, abra o link tambem. Ele deve mostrar `Ponte local conectada`.

## Entrar No Mundo

1. Abra o Minecraft Java.
2. Use a mesma versao do servidor Paper.
3. Entre em `Multiplayer`.
4. Adicione o servidor:

```text
localhost
```

5. Entre no mundo.

Se precisar de permissao para comandos, no console do Paper rode:

```text
op SeuNickDoMinecraft
```

Troque `SeuNickDoMinecraft` pelo nick que aparece no jogo.

## Preparar A Parede

Dentro do Minecraft, rode:

```text
/tiktokwall setup
```

Isso limpa uma area grande, cria a parede, deixa o mundo de dia, coloca voce em criativo e prepara tudo.

Comandos uteis:

```text
/tiktokwall test
/tiktokwall clear
/tiktokwall size 128
/tiktokwall size 256
/tiktokwall dithering off
/tiktokwall animation on
/tiktokwall animationspeed 8
/tiktokwall nameplate on
/tiktokwall fireworks gift
/tiktokwall info
```

Recomendado para live:

```text
/tiktokwall size 128
/tiktokwall dithering off
/tiktokwall animation on
/tiktokwall animationspeed 8
/tiktokwall nameplate on
```

Se mudar o tamanho, rode `/tiktokwall setup` de novo para recriar a parede no tamanho certo.

## Configurar A Live Na Interface

No painel, preencha:

- `TikTok username sem @`: nome da conta que esta ao vivo.
- `Tamanho do avatar`: use o mesmo do plugin, recomendado `128` ou `256`.
- `Grid de curtidas`: `1x1`, `2x2`, `3x3` ou `4x4`.
- `Duracao na parede`: recomendado `15`.
- `Cooldown de curtida`: recomendado `750` para mosaico; aumente se tiver muito movimento.
- `Host do plugin`: `127.0.0.1`.
- `Porta do plugin`: `4567`.
- `Rosa por nome`: `rose,rosa`.
- `RCON senha`: a mesma do `server.properties`, se quiser usar botoes de comando.

Opcoes importantes:

- `Curtidas mostram avatar`: curtidas entram no mosaico.
- `Gifts usam painel inteiro`: rosa/gift ocupa a parede toda.
- `Restaurar mosaico apos gift`: depois do gift, volta para as ultimas curtidas.
- `Gift info avancado`: deixe desligado se nao tiver plano EulerStream.

Clique em:

```text
Salvar configuracao
```

## Testar Antes Da Live

Checklist:

1. Paper aberto.
2. Plugin TikTokWall carregado.
3. Minecraft dentro do mundo em `localhost`.
4. Parede preparada com `/tiktokwall setup`.
5. Ponte local aberta pelo `start-interface-windows.bat`.
6. Site ou interface local mostrando `Ponte local conectada`.

No painel, clique:

```text
Checar plugin
```

Depois clique:

```text
Enviar imagem teste
```

Se apareceu imagem na parede, a parte Minecraft esta funcionando.

## Ligar Na Live

1. Abra a live no TikTok.
2. Confira se o usuario na interface esta correto e sem `@`.
3. Clique:

```text
Iniciar bot
```

Quando alguem curtir ou mandar rosa, o avatar deve aparecer na parede.

## Atualizar O Plugin

No portal, abra a pagina `Atualizações`.

Se aparecer `Atualização disponível`:

1. Clique em `Baixar TikTokWall.jar`.
2. No console do Paper, digite:

```text
stop
```

3. Se estiver usando PowerShell, rode:

```powershell
Copy-Item "$env:USERPROFILE\Downloads\TikTokWall.jar" "C:\MinecraftLive\plugins\TikTokWall.jar" -Force
```

4. Se estiver usando o jeito manual, substitua:

```text
C:\MinecraftLive\plugins\TikTokWall.jar
```

pelo `TikTokWall.jar` novo que voce baixou.

5. Abra de novo:

```text
C:\MinecraftLive\start-paper.bat
```

6. Volte no portal e clique em:

```text
Verificar versão
```

Se aparecer `Atualizado`, o plugin local esta na versao mais recente.

## Pedir Ajuda Para IA

No portal, use:

```text
Copiar contexto completo
```

Cole esse texto no ChatGPT, Gemini, Claude ou outra IA e peça:

```text
Me guia passo a passo para resolver o problema.
```

Esse contexto ja inclui arquitetura, arquivos do ZIP, setup escolhido, configuracoes, comandos Minecraft e erros comuns.

## Problemas Comuns

### java nao e reconhecido

Feche e abra o PowerShell de novo. Se continuar, reinstale o Java JDK 25 pelo Temurin.

### node ou npm nao e reconhecido

Feche e abra o PowerShell de novo. Se continuar, reinstale Node.js LTS.

### O Paper nao abre

Confira se `C:\MinecraftLive\paper.jar` existe e se Java 25 esta instalado.

### A pasta plugins nao existe

Rode o Paper uma vez. Ele cria a pasta `plugins` junto com `server.properties`.

### A imagem aparece so em um canto

O tamanho do bot e do plugin esta diferente.

Exemplo correto no Minecraft:

```text
/tiktokwall size 128
```

E na interface:

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

### Os botoes RCON nao funcionam

Confira se `server.properties` tem:

```properties
enable-rcon=true
rcon.port=25575
rcon.password=sua-senha
```

Depois coloque a mesma senha no campo `RCON senha` do painel e clique `Salvar`.

### O bot nao conecta no TikTok

Confira:

- A conta esta realmente ao vivo.
- O username esta sem `@`.
- `Gift info avancado` esta desligado.
- A live e publica.

### O bot nao mostra curtidas

Confira se esta ligado:

```text
Curtidas mostram avatar
```

E ajuste o cooldown. `750` significa uma curtida renderizada a cada 0,75 segundo no maximo.
