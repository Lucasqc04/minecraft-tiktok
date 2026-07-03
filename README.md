# TikTok Minecraft Live

Integração local para lives do TikTok:

```text
TikTok Live
-> curtida ou gift Rose/Rosa
-> bot baixa o avatar do usuario
-> plugin Paper desenha a imagem em blocos no Minecraft
-> a parede limpa depois do tempo configurado
```

O projeto tem:

- `bot/`: bot Node.js + TypeScript, com interface web local.
- `minecraft-plugin/`: plugin Paper Java `TikTokWall`.
- `web/`: portal online estatico para download, setup guiado e controle.
- `start-interface-windows.bat`: atalho para abrir a interface no Windows.
- `start-interface-linux.sh`: atalho para abrir a interface no Linux.
- `docs/LEIAME_WINDOWS.md`: passo a passo Windows para criador que nao programa.
- `docs/LEIAME_LINUX.md`: passo a passo Linux.

## Para Quem Vai Usar No Windows Ou Linux

Leia um destes arquivos:

- [docs/LEIAME_WINDOWS.md](docs/LEIAME_WINDOWS.md)
- [docs/LEIAME_LINUX.md](docs/LEIAME_LINUX.md)

Resumo do fluxo:

1. Instalar Java e Node.js.
2. Baixar Paper no site oficial.
3. Criar o servidor local e colocar `TikTokWall.jar` na pasta `plugins`.
4. Reiniciar o Paper.
5. Entrar no servidor pelo Minecraft Java em `localhost`.
6. Rodar `/tiktokwall setup`.
7. Abrir a ponte local: `start-interface-windows.bat` no Windows ou `./start-interface-linux.sh` no Linux.
8. Configurar o usuario TikTok, likes, rosa, tempo e tamanho.
9. Clicar em `Enviar imagem teste`.
10. Clicar em `Iniciar bot`.

## Interface Local

No Windows, use duplo clique:

```text
start-interface-windows.bat
```

No Linux:

```bash
chmod +x start-interface-linux.sh
./start-interface-linux.sh
```

No terminal:

```bash
cd bot
npm install
npm run ui
```

A interface abre em:

```text
http://127.0.0.1:3333
```

Ela permite:

- editar `bot/.env` sem abrir arquivo;
- iniciar/parar o bot;
- testar conexao com o plugin;
- enviar imagem fake para a parede;
- ver logs;
- enviar alguns comandos `/tiktokwall` por RCON, se a senha RCON estiver configurada.

## Portal Online

O site em `web/` e um portal estatico com:

- download do pack e do `TikTokWall.jar`;
- checklist de instalacao;
- configuracao visual da live;
- controle do bot pela ponte local;
- comandos Minecraft;
- botao para copiar contexto completo para uma IA ajudar o criador.

Para publicar em uma hospedagem estatica:

1. Suba este repositorio no GitHub.
2. Importe o repositorio na plataforma de hospedagem.
3. Defina `Root Directory` como `web`.
4. Use framework `Other` e sem build command.

O portal online nao roda o Minecraft na nuvem. Ele se comunica, pelo navegador, com a ponte local em `http://127.0.0.1:3333`. Por isso o criador precisa abrir `start-interface-windows.bat` no Windows ou `./start-interface-linux.sh` no Linux antes de controlar o bot pelo portal.

As configuracoes ficam no arquivo `bot/.env` do computador da live. O arquivo real de ambiente nao deve ser publicado.

## Desenvolvimento

Bot:

```bash
cd bot
npm install
npm run build
npm run test:image
npm run dev
```

Plugin:

```bash
cd minecraft-plugin
mvn package
```

O plugin compilado sai em:

```text
minecraft-plugin/target/TikTokWall.jar
```

Para instalar no servidor local:

```bash
cp minecraft-plugin/target/TikTokWall.jar ~/minecraft-live/plugins/TikTokWall.jar
```

## Release Para Um Amigo

Depois de compilar o plugin, gere um pacote limpo:

```bash
scripts/package-release.sh
```

O ZIP sai em:

```text
release/tiktok-minecraft-live.zip
```

Envie esse ZIP ou publique como asset em uma GitHub Release junto com instrucoes do `docs/LEIAME_WINDOWS.md`.

## Arquivos Sensíveis

Nao suba estes arquivos:

- `.env`
- `bot/.env`
- `bot/avatars/`
- `bot/node_modules/`
- `bot/dist/`
- `minecraft-plugin/target/`
- mundos e arquivos locais do servidor Minecraft

O `.gitignore` ja protege esses caminhos.
