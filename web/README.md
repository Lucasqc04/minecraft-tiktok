# TikTok Minecraft Live Portal

Site estatico do portal publico do TikTok Minecraft Live.

## Publicar

Em uma hospedagem estatica:

1. Importe o repositorio do GitHub.
2. Em `Root Directory`, escolha `web`.
3. Framework: `Other`.
4. Build command: vazio.
5. Output directory: vazio.
6. Deploy.

O portal usa a ponte local em:

```text
http://127.0.0.1:3333
```

Para o controle funcionar, a pessoa que vai transmitir precisa abrir a ponte local no computador da live.

Windows:

```text
start-interface-windows.bat
```

Linux:

```bash
chmod +x start-interface-linux.sh
./start-interface-linux.sh
```

O portal tem seletor Windows/Linux no checklist para trocar caminhos e comandos copiados.

## Paginas

- `/index.html`: entrada do portal.
- `/setup.html`: passo a passo completo e mapa do ZIP.
- `/admin.html`: painel admin local, configuracao, logs e comandos RCON.
- `/commands.html`: wiki dos comandos do TikTokWall.jar e endpoints HTTP locais.
- `/updates.html`: status de versao do plugin, historico e download do JAR.
- `/ai.html`: contexto grande para copiar e mandar para uma IA.

## Downloads

Arquivos servidos pelo site:

- `/downloads/TikTokWall.jar`
- `/downloads/tiktok-minecraft-live.zip`
- `/updates.json`

## Historico De Atualizacoes

Edite `updates.json` sempre que publicar uma nova versao:

1. Atualize `latest.version`, `latest.date`, `latest.summary`, `latest.jar` e `latest.pack`.
2. Adicione a versao nova no topo de `history`.
3. Rode `scripts/package-release.sh` a partir da raiz do repositorio.

O portal compara `latest.version` com a versao retornada pela ponte local em `/api/plugin/health`.
