const BRIDGE_URL = "http://127.0.0.1:3333";

const defaultConfig = {
  TIKTOK_USERNAME: "",
  MINECRAFT_PLUGIN_HOST: "127.0.0.1",
  MINECRAFT_PLUGIN_PORT: "4567",
  AVATAR_SIZE: "128",
  AVATAR_DIR: "./avatars",
  DURATION_SECONDS: "15",
  ENABLE_LIKE_AVATAR: "true",
  LIKE_AVATAR_COOLDOWN_MS: "5000",
  ENABLE_EXTENDED_GIFT_INFO: "false",
  ROSE_GIFT_NAMES: "rose,rosa",
  ROSE_GIFT_IDS: "",
  RCON_HOST: "127.0.0.1",
  RCON_PORT: "25575",
  RCON_PASSWORD: ""
};

const sharedCommands = ["/tiktokwall setup", "/tiktokwall size 128", "/tiktokwall dithering off", "/tiktokwall animationspeed 8"];

const platformContent = {
  windows: {
    name: "Windows",
    bridgeScript: "start-interface-windows.bat",
    minecraftDir: "C:\\MinecraftLive",
    startBridge: "start-interface-windows.bat",
    startPaper: "start-paper.bat",
    pluginPath: "C:\\MinecraftLive\\plugins\\TikTokWall.jar",
    paperCommands: ["Renomear Paper para paper.jar", "Copiar scripts\\windows\\start-paper.bat para C:\\MinecraftLive", "Abrir start-paper.bat"],
    steps: [
      {
        label: "Passo 1",
        title: "Baixe o pack completo e extraia em uma pasta simples.",
        body: "Use uma pasta como C:\\TikTokMinecraftLive. Evite OneDrive, Desktop sincronizado ou pastas com acentos.",
        commands: ["Baixar pack completo", "Extrair ZIP", "Abrir start-interface-windows.bat depois do Paper"]
      },
      {
        label: "Passo 2",
        title: "Instale Java JDK, Node.js LTS e baixe o Paper.",
        body: "O Minecraft, o Paper e o plugin precisam estar na mesma versão de jogo. Node roda o bot e a ponte local.",
        commands: ["https://adoptium.net/temurin/releases", "https://nodejs.org/en/download", "https://papermc.io/downloads/paper"]
      },
      {
        label: "Passo 3",
        title: "Coloque o plugin dentro do servidor Paper.",
        body: "Copie TikTokWall.jar para a pasta plugins do servidor. Depois reinicie o Paper para carregar o plugin.",
        commands: ["C:\\MinecraftLive\\plugins\\TikTokWall.jar", "java -Xms2G -Xmx4G -jar paper.jar --nogui"]
      },
      {
        label: "Passo 4",
        title: "Entre no servidor e prepare a parede automaticamente.",
        body: "Entre em localhost pelo Minecraft Java. Se precisar de permissão, use op SeuNick no console do Paper.",
        commands: sharedCommands
      },
      {
        label: "Passo 5",
        title: "Abra a ponte local e salve a configuração da live.",
        body: "A ponte local é o start-interface-windows.bat. Ela permite que este site salve .env, rode teste e inicie o bot.",
        commands: ["start-interface-windows.bat", "http://127.0.0.1:3333", "Salvar configuracao"]
      },
      {
        label: "Passo 6",
        title: "Teste uma imagem e inicie o bot quando a live estiver aberta.",
        body: "A conta TikTok precisa estar ao vivo e pública. Deixe Gift info avançado desligado se não tiver plano EulerStream.",
        commands: ["Enviar imagem teste", "Iniciar bot", "Aguardar curtida ou rosa na live"]
      }
    ]
  },
  linux: {
    name: "Linux",
    bridgeScript: "start-interface-linux.sh",
    minecraftDir: "~/MinecraftLive",
    startBridge: "./start-interface-linux.sh",
    startPaper: "./start-paper.sh",
    pluginPath: "~/MinecraftLive/plugins/TikTokWall.jar",
    paperCommands: ["mkdir -p ~/MinecraftLive", "cp scripts/linux/start-paper.sh ~/MinecraftLive/start-paper.sh", "chmod +x ~/MinecraftLive/start-paper.sh", "cd ~/MinecraftLive && ./start-paper.sh"],
    steps: [
      {
        label: "Passo 1",
        title: "Baixe o pack completo e extraia em uma pasta simples.",
        body: "Use uma pasta como ~/TikTokMinecraftLive. Evite pastas sincronizadas ou caminhos com caracteres estranhos.",
        commands: ["Baixar pack completo", "unzip tiktok-minecraft-live.zip", "cd tiktok-minecraft-live"]
      },
      {
        label: "Passo 2",
        title: "Instale Java JDK, Node.js LTS e baixe o Paper.",
        body: "Confirme node, npm e java no terminal. O Paper deve ser da mesma versão do Minecraft.",
        commands: ["node -v", "npm -v", "java -version", "https://papermc.io/downloads/paper"]
      },
      {
        label: "Passo 3",
        title: "Coloque o plugin dentro do servidor Paper.",
        body: "Crie ~/MinecraftLive, rode o Paper uma vez, aceite a EULA, copie o JAR para plugins e reinicie.",
        commands: ["mkdir -p ~/MinecraftLive", "cp TikTokWall.jar ~/MinecraftLive/plugins/TikTokWall.jar", "cd ~/MinecraftLive && ./start-paper.sh"]
      },
      {
        label: "Passo 4",
        title: "Entre no servidor e prepare a parede automaticamente.",
        body: "Entre em localhost pelo Minecraft Java. Se precisar de permissão, use op SeuNick no console do Paper.",
        commands: sharedCommands
      },
      {
        label: "Passo 5",
        title: "Abra a ponte local e salve a configuração da live.",
        body: "A ponte local é o start-interface-linux.sh. Ela permite que este site salve .env, rode teste e inicie o bot.",
        commands: ["chmod +x start-interface-linux.sh", "./start-interface-linux.sh", "http://127.0.0.1:3333"]
      },
      {
        label: "Passo 6",
        title: "Teste uma imagem e inicie o bot quando a live estiver aberta.",
        body: "A conta TikTok precisa estar ao vivo e pública. Deixe Gift info avançado desligado se não tiver plano EulerStream.",
        commands: ["Enviar imagem teste", "Iniciar bot", "Aguardar curtida ou rosa na live"]
      }
    ]
  }
};

const form = document.getElementById("configForm");
const toast = document.getElementById("toast");
const logs = document.getElementById("logs");
const bridgeStatus = document.getElementById("bridgeStatus");
const bridgeValue = document.getElementById("bridgeValue");
const botValue = document.getElementById("botValue");
const pluginValue = document.getElementById("pluginValue");
const previewState = document.getElementById("previewState");
const stepPanel = document.getElementById("stepPanel");
const stepCommands = document.getElementById("stepCommands");
const aiContextPreview = document.getElementById("aiContextPreview");
const bridgeScriptName = document.getElementById("bridgeScriptName");

let currentConfig = { ...defaultConfig };
let localLogs = [];
let selectedPlatform = /Linux|X11/i.test(navigator.userAgent) ? "linux" : "windows";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 3600);
}

async function bridgeApi(path, options = {}) {
  const response = await fetch(`${BRIDGE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const body = await response.json();
  if (!response.ok || body.ok === false) {
    throw new Error(body.message || "Falha na ponte local");
  }
  return body;
}

function fillForm(config) {
  currentConfig = { ...defaultConfig, ...config };
  for (const [key, value] of Object.entries(currentConfig)) {
    const field = form.elements.namedItem(key);
    if (!field) continue;
    if (field.type === "checkbox") {
      field.checked = String(value).toLowerCase() === "true";
    } else {
      field.value = value ?? "";
    }
  }
  renderAiContext();
}

function collectForm() {
  const data = {};
  for (const element of form.elements) {
    if (!element.name) continue;
    data[element.name] = element.type === "checkbox" ? element.checked : element.value;
  }
  return data;
}

async function refreshBridge() {
  try {
    const status = await bridgeApi("/api/status");
    bridgeStatus.classList.add("connected");
    bridgeStatus.querySelector("span:last-child").textContent = "Ponte local conectada";
    bridgeValue.textContent = "Conectada";
    botValue.textContent = status.bot === "running" ? "Rodando" : "Parado";
    previewState.textContent = status.bot === "running" ? "bot online" : "bridge online";
    localLogs = status.logs || [];
    logs.textContent = localLogs.join("\n");
    logs.scrollTop = logs.scrollHeight;

    const configResult = await bridgeApi("/api/config");
    fillForm(configResult.config);

    try {
      const health = await bridgeApi("/api/plugin/health");
      pluginValue.textContent = health.health?.busy ? "Ocupado" : "OK";
    } catch {
      pluginValue.textContent = "Sem resposta";
    }
  } catch {
    bridgeStatus.classList.remove("connected");
    bridgeStatus.querySelector("span:last-child").textContent = "Ponte local desconectada";
    bridgeValue.textContent = "Desconectada";
    botValue.textContent = "-";
    pluginValue.textContent = "-";
    previewState.textContent = "bridge offline";
    logs.textContent = `Abra ${platformContent[selectedPlatform].bridgeScript} no PC do streamer para conectar este site ao Minecraft local.`;
    fillForm(currentConfig);
  }
}

async function saveConfig(event) {
  event.preventDefault();
  const data = collectForm();
  const result = await bridgeApi("/api/config", {
    method: "POST",
    body: JSON.stringify(data)
  });
  fillForm(result.config);
  showToast("Configuração salva na ponte local.");
}

async function botAction(path, message) {
  await bridgeApi(path, { method: "POST" });
  showToast(message);
  await refreshBridge();
}

async function rcon(command) {
  const result = await bridgeApi("/api/rcon", {
    method: "POST",
    body: JSON.stringify({ command })
  });
  showToast(result.result || `/${command}`);
  await refreshBridge();
}

function renderStep(index) {
  const step = platformContent[selectedPlatform].steps[index];
  document.querySelectorAll("#steps li").forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
  });
  document.querySelectorAll("[data-os]").forEach((button) => {
    button.classList.toggle("active", button.dataset.os === selectedPlatform);
  });
  bridgeScriptName.textContent = platformContent[selectedPlatform].bridgeScript;
  stepPanel.querySelector(".system-label").textContent = step.label;
  stepPanel.querySelector("h3").textContent = step.title;
  stepPanel.querySelector("p:not(.system-label)").textContent = step.body;
  stepCommands.innerHTML = "";
  for (const command of step.commands) {
    const row = document.createElement("div");
    row.className = "copy-row";
    row.innerHTML = `<code></code><button class="button small" type="button">Copiar</button>`;
    row.querySelector("code").textContent = command;
    row.querySelector("button").addEventListener("click", () => copyText(command, "Copiado."));
    stepCommands.appendChild(row);
  }
}

function setPlatform(platform) {
  selectedPlatform = platform;
  renderStep(currentStepIndex());
  renderAiContext();
  refreshBridge().catch(() => {});
}

function currentStepIndex() {
  const active = document.querySelector("#steps li.active button");
  return Number(active?.dataset.step ?? 0);
}

function commandsText() {
  return [
    "/tiktokwall setup",
    "/tiktokwall size 128",
    "/tiktokwall dithering off",
    "/tiktokwall animation on",
    "/tiktokwall animationspeed 8",
    "/tiktokwall test",
    "/tiktokwall clear",
    "/tiktokwall info"
  ].join("\n");
}

function serverPropsText() {
  return [
    "enable-rcon=true",
    "rcon.port=25575",
    "rcon.password=troque-essa-senha"
  ].join("\n");
}

function quickStartText() {
  const platform = platformContent[selectedPlatform];
  const platformSpecific = selectedPlatform === "linux"
    ? [
        "1. Instale Java JDK 25 e Node.js LTS.",
        "2. Baixe o Paper, coloque em ~/MinecraftLive e renomeie para paper.jar.",
        "3. Copie scripts/linux/start-paper.sh para ~/MinecraftLive e rode chmod +x.",
        "4. Rode ./start-paper.sh uma vez e aceite o eula.txt.",
        "5. Ative RCON no server.properties.",
        "6. Copie TikTokWall.jar para ~/MinecraftLive/plugins/TikTokWall.jar.",
        "7. Reinicie o Paper e entre em localhost.",
        "8. Rode /tiktokwall setup.",
        "9. Abra ./start-interface-linux.sh.",
        "10. Salve o username TikTok no site.",
        "11. Clique Enviar imagem teste e depois Iniciar bot."
      ]
    : [
        "1. Instale Java JDK 25 e Node.js LTS.",
        "2. Baixe o Paper, coloque em C:\\MinecraftLive e renomeie para paper.jar.",
        "3. Copie scripts\\windows\\start-paper.bat para C:\\MinecraftLive.",
        "4. Abra start-paper.bat uma vez e aceite o eula.txt.",
        "5. Ative RCON no server.properties.",
        "6. Copie TikTokWall.jar para C:\\MinecraftLive\\plugins\\TikTokWall.jar.",
        "7. Reinicie o Paper e entre em localhost.",
        "8. Rode /tiktokwall setup.",
        "9. Abra start-interface-windows.bat.",
        "10. Salve o username TikTok no site.",
        "11. Clique Enviar imagem teste e depois Iniciar bot."
      ];

  return [
    `Sistema: ${platform.name}`,
    `Pasta sugerida do servidor: ${platform.minecraftDir}`,
    `Ponte local: ${platform.startBridge}`,
    "",
    ...platformSpecific
  ].join("\n");
}

function aiContextText() {
  const config = { ...currentConfig, RCON_PASSWORD: currentConfig.RCON_PASSWORD ? "[preenchido]" : "" };
  return `Quero ajuda com o projeto TikTok Minecraft Live.

Arquitetura:
- Site Vercel: portal visual de download, setup e controle.
- Ponte local: ${platformContent[selectedPlatform].bridgeScript} abre http://127.0.0.1:3333 no PC.
- Bot Node: conecta na live TikTok, pega curtidas/rosas e baixa avatar.
- Plugin Paper: TikTokWall.jar roda no Minecraft local e renderiza avatar em blocos.
- Minecraft: servidor Paper local, jogador entra em localhost.
- Sistema escolhido no portal: ${platformContent[selectedPlatform].name}

Config atual:
${JSON.stringify(config, null, 2)}

Passos de instalacao:
${quickStartText()}

Comandos Minecraft:
${commandsText()}

server.properties:
${serverPropsText()}

Problemas comuns:
- Imagem no canto: /tiktokwall size deve bater com AVATAR_SIZE.
- Pontos rosas: /tiktokwall dithering off.
- Plugin sem resposta: Paper fechado, porta errada ou plugin nao carregou.
- Bot nao conecta: live nao esta publica/ao vivo, username errado ou Gift info avancado ligado sem plano EulerStream.

Me guie passo a passo, sem assumir que sou programador.`;
}

function renderAiContext() {
  aiContextPreview.textContent = aiContextText();
}

async function copyText(text, message) {
  await navigator.clipboard.writeText(text);
  showToast(message);
}

document.querySelectorAll("#steps button").forEach((button) => {
  button.addEventListener("click", () => renderStep(Number(button.dataset.step)));
});

document.querySelectorAll("[data-os]").forEach((button) => {
  button.addEventListener("click", () => setPlatform(button.dataset.os));
});

form.addEventListener("submit", (event) => {
  saveConfig(event).catch((error) => showToast(error.message));
});

document.getElementById("refreshBridge").addEventListener("click", () => refreshBridge());
document.getElementById("startBot").addEventListener("click", () => botAction("/api/bot/start", "Bot iniciado."));
document.getElementById("stopBot").addEventListener("click", () => botAction("/api/bot/stop", "Bot parado."));
document.getElementById("testImage").addEventListener("click", () => botAction("/api/test-image", "Imagem teste enviada."));
document.getElementById("clearLocalLog").addEventListener("click", () => {
  logs.textContent = "";
  showToast("Tela de logs limpa.");
});

document.querySelectorAll("[data-rcon]").forEach((button) => {
  button.addEventListener("click", () => rcon(button.dataset.rcon).catch((error) => showToast(error.message)));
});

document.getElementById("copyQuickStart").addEventListener("click", () => copyText(quickStartText(), "Passo a passo copiado."));
document.getElementById("copyAiContext").addEventListener("click", () => copyText(aiContextText(), "Contexto para IA copiado."));
document.getElementById("copyCommands").addEventListener("click", () => copyText(commandsText(), "Comandos copiados."));
document.getElementById("copyServerProps").addEventListener("click", () => copyText(serverPropsText(), "server.properties copiado."));

window.addEventListener("unhandledrejection", (event) => {
  showToast(event.reason?.message || String(event.reason));
});

renderStep(0);
fillForm(defaultConfig);
refreshBridge();
window.setInterval(refreshBridge, 4000);
