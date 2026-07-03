# TikTok Minecraft Live Web Portal

Site estatico pronto para Vercel.

## Deploy

No painel da Vercel:

1. Importe o repositorio do GitHub.
2. Em `Root Directory`, escolha `web`.
3. Framework: `Other`.
4. Build command: vazio.
5. Output directory: vazio.
6. Deploy.

O site usa a ponte local em:

```text
http://127.0.0.1:3333
```

Para o controle funcionar, o streamer precisa abrir a ponte local no PC dele.

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
