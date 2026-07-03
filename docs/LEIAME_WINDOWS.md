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

## Site E Ponte Local

Este projeto pode ter um site hospedado na Vercel. O site ajuda com download, passo a passo, configuracao e suporte.

Mas o Minecraft e o bot rodam no seu PC. Por isso voce tambem precisa abrir:

```text
start-interface-windows.bat
```

Esse arquivo liga a ponte local em:

```text
http://127.0.0.1:3333
```

Quando a ponte esta aberta, o site hospedado consegue salvar configuracoes, iniciar/parar o bot, mandar teste e enviar comandos seguros para o plugin.

## Programas Necessarios

Instale:

- Minecraft Java Edition.
- Java JDK 25, recomendado Eclipse Temurin: https://adoptium.net/temurin/releases
- Node.js LTS: https://nodejs.org/en/download
- Paper: https://papermc.io/downloads/paper

Use a mesma versao do Paper que o Minecraft vai abrir. Se o Minecraft do criador esta em `26.2`, baixe Paper para `26.2`.

## Preparar O Servidor Paper

1. Crie uma pasta, por exemplo:

```text
C:\MinecraftLive
```

2. Baixe o Paper e renomeie o arquivo para:

```text
paper.jar
```

3. Copie o arquivo abaixo para dentro de `C:\MinecraftLive`:

```text
scripts\windows\start-paper.bat
```

4. Dê duplo clique em `start-paper.bat`.

Na primeira vez, o Paper vai parar e criar `eula.txt`.

5. Abra `eula.txt` e troque:

```text
eula=false
```

para:

```text
eula=true
```

6. Rode `start-paper.bat` de novo.

7. Quando o servidor terminar de iniciar, feche com:

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

Copie:

```text
TikTokWall.jar
```

para:

```text
C:\MinecraftLive\plugins\TikTokWall.jar
```

Se a pasta `plugins` ainda nao existir, rode o Paper uma vez e ela sera criada.

Depois reinicie o Paper.

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

Se voce recebeu um link do site na Vercel, abra o link tambem. O site deve mostrar que a ponte local esta conectada.

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

## Pedir Ajuda Para IA

No site, use o botao:

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
