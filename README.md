# TikTok Minecraft Live

Integração local para lives do TikTok:

```text
TikTok Live
-> curtida monta/atualiza mosaico de avatares
-> gift Rose/Rosa pode ocupar o painel inteiro
-> bot baixa o avatar do usuario
-> plugin Paper desenha a imagem em blocos no Minecraft
-> nome, animacao, fogos e limpeza seguem a configuracao
```

O projeto tem:

- `bot/`: bot Node.js + TypeScript, com interface web local.
- `minecraft-plugin/`: plugin Paper Java `TikTokWall`.
- `web/`: portal online estatico em paginas separadas para inicio, setup, painel, atualizacoes e IA.
- `web/updates.json`: historico publico de versoes e fonte da verificacao de atualizacao.
- `start-interface-windows.bat`: atalho para abrir a interface no Windows.
- `start-interface-linux.sh`: atalho para abrir a interface no Linux.
- `docs/LEIAME_WINDOWS.md`: passo a passo Windows para criador que nao programa.
- `docs/LEIAME_LINUX.md`: passo a passo Linux.

## Para Quem Vai Usar No Windows Ou Linux

Leia um destes arquivos:

- [docs/LEIAME_WINDOWS.md](docs/LEIAME_WINDOWS.md)
- [docs/LEIAME_LINUX.md](docs/LEIAME_LINUX.md)

Resumo do fluxo:

1. Instalar Java JDK 25 e Node.js LTS.
2. Ver no Minecraft Launcher qual versao Java sera usada.
3. Baixar Paper da mesma versao do Minecraft.
4. Criar o servidor local, copiar o Paper como `paper.jar` e copiar o script `start-paper`.
5. Rodar o Paper uma vez, aceitar `eula.txt`, rodar de novo e parar com `stop`.
6. Ativar RCON em `server.properties`.
7. Copiar `TikTokWall.jar` para a pasta `plugins`.
8. Reiniciar o Paper.
9. Entrar no servidor pelo Minecraft Java em `localhost`.
10. Rodar `/tiktokwall setup` e `/tiktokwall test`.
11. Abrir a ponte local: `start-interface-windows.bat` no Windows ou `./start-interface-linux.sh` no Linux.
12. Configurar o usuario TikTok, likes, rosa, tempo e tamanho.
13. Clicar em `Enviar imagem teste`.
14. Clicar em `Iniciar bot`.

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
- configurar mosaico de curtidas 1x1 a 4x4, gift em tela cheia e tamanho ate 256.

O bot relê a configuração salva durante a execução para aplicar grid, cooldown, tamanho, animação e comportamento de gift sem reiniciar a ponte local. Se mudar usuário TikTok, Gift info avançado ou regras de identificação de rosa, a ponte reinicia apenas o processo do bot.

## Portal Online

O site em `web/` e um portal estatico com:

- `index.html`: entrada e atalhos principais;
- `setup.html`: passo a passo detalhado e mapa do ZIP;
- `admin.html`: painel da live, configuracao, logs e comandos RCON;
- `updates.html`: status de versao, historico e passos para atualizar o JAR;
- `ai.html`: contexto completo para mandar para uma IA;
- download do pack e do `TikTokWall.jar`;
- status da versao instalada do plugin;
- historico publico de atualizacoes;
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

### Publicar Uma Nova Versao

1. Atualize a versao em `minecraft-plugin/pom.xml` e `minecraft-plugin/src/main/resources/plugin.yml`.
2. Atualize `web/updates.json` com a nova versao, data, resumo e historico.
3. Rode:

```bash
scripts/package-release.sh
```

4. Faça commit e push. O portal passa a mostrar a nova versao e o download atualizado.

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
