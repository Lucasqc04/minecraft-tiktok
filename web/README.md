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

## Downloads

Arquivos servidos pelo site:

- `/downloads/TikTokWall.jar`
- `/downloads/tiktok-minecraft-live.zip`
