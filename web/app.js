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

const sharedCommands = ["/tiktokwall setup", "/tiktokwall size 128", "/tiktokwall dithering off", "/tiktokwall animation on", "/tiktokwall animationspeed 8", "/tiktokwall test"];

const platformContent = {
  windows: {
    name: "Windows",
    bridgeScript: "start-interface-windows.bat",
    minecraftDir: "C:\\MinecraftLive",
    startBridge: "start-interface-windows.bat",
    startPaper: "start-paper.bat",
    pluginPath: "C:\\MinecraftLive\\plugins\\TikTokWall.jar",
    paperCommands: [
      "Criar C:\\MinecraftLive",
      "Baixar o Paper da mesma versao do Minecraft Java",
      "Renomear o arquivo baixado para paper.jar",
      "Copiar paper.jar e start-paper.bat para C:\\MinecraftLive"
    ],
    steps: [
      {
        label: "Passo 1",
        title: "Baixe o pack completo e extraia em uma pasta simples.",
        body: "Use C:\\TikTokMinecraftLive. Evite OneDrive, Desktop sincronizado ou pastas com acentos.",
        commands: ["Baixar pack completo", "Extrair em C:\\TikTokMinecraftLive", "Entrar na pasta C:\\TikTokMinecraftLive"]
      },
      {
        label: "Passo 2",
        title: "Instale Java JDK 25 e Node.js LTS.",
        body: "O plugin foi compilado para Java 25. Depois de instalar, abra o PowerShell e confirme as versoes.",
        commands: [
          "https://adoptium.net/temurin/releases/?version=25",
          "https://nodejs.org/en/download",
          "java -version",
          "node -v",
          "npm -v"
        ]
      },
      {
        label: "Passo 3",
        title: "Baixe o Paper da mesma versao do Minecraft.",
        body: "No launcher do Minecraft, veja a versao Java que voce vai abrir. Baixe o Paper dessa mesma versao.",
        commands: [
          "https://papermc.io/downloads/paper",
          "Criar C:\\MinecraftLive",
          "Renomear o arquivo baixado para paper.jar",
          "Copiar paper.jar para C:\\MinecraftLive\\paper.jar",
          "Copiar C:\\TikTokMinecraftLive\\scripts\\windows\\start-paper.bat para C:\\MinecraftLive\\start-paper.bat"
        ]
      },
      {
        label: "Passo 4",
        title: "Inicie o Paper pela primeira vez e aceite a EULA.",
        body: "A primeira abertura cria eula.txt, server.properties e a pasta plugins. Depois aceite a EULA e abra de novo.",
        commands: [
          "Abrir C:\\MinecraftLive\\start-paper.bat",
          "Editar C:\\MinecraftLive\\eula.txt",
          "Trocar eula=false por eula=true",
          "Abrir C:\\MinecraftLive\\start-paper.bat novamente",
          "Quando terminar de carregar, digitar stop no console"
        ]
      },
      {
        label: "Passo 5",
        title: "Instale o plugin e ligue o RCON.",
        body: "Agora a pasta plugins ja existe. Copie o JAR, configure RCON e reinicie o Paper.",
        commands: [
          "Copiar C:\\TikTokMinecraftLive\\TikTokWall.jar para C:\\MinecraftLive\\plugins\\TikTokWall.jar",
          "Abrir C:\\MinecraftLive\\server.properties",
          "enable-rcon=true",
          "rcon.port=25575",
          "rcon.password=troque-essa-senha",
          "Abrir C:\\MinecraftLive\\start-paper.bat"
        ]
      },
      {
        label: "Passo 6",
        title: "Entre no servidor e prepare a parede automaticamente.",
        body: "Entre em localhost pelo Minecraft Java. Se precisar de permissão, use op SeuNick no console do Paper.",
        commands: sharedCommands
      },
      {
        label: "Passo 7",
        title: "Abra a ponte local e salve a configuração da live.",
        body: "A ponte local é o start-interface-windows.bat. Ela salva a configuração neste computador, roda testes e inicia o bot.",
        commands: ["Abrir C:\\TikTokMinecraftLive\\start-interface-windows.bat", "http://127.0.0.1:3333", "Salvar configuracao"]
      },
      {
        label: "Passo 8",
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
    paperCommands: [
      "mkdir -p ~/MinecraftLive",
      "cp ~/Downloads/tiktok-minecraft-live/scripts/linux/start-paper.sh ~/MinecraftLive/start-paper.sh",
      "chmod +x ~/MinecraftLive/start-paper.sh",
      "cd ~/MinecraftLive && ./start-paper.sh"
    ],
    steps: [
      {
        label: "Passo 1",
        title: "Baixe o pack completo e extraia em uma pasta simples.",
        body: "Este passo assume que o ZIP foi baixado em ~/Downloads. Se voce extraiu em outra pasta, ajuste os caminhos.",
        commands: ["cd ~/Downloads", "unzip tiktok-minecraft-live.zip", "cd ~/Downloads/tiktok-minecraft-live"]
      },
      {
        label: "Passo 2",
        title: "Instale Java JDK 25 e Node.js LTS.",
        body: "O plugin foi compilado para Java 25. Se seu Ubuntu nao tiver openjdk-25-jdk, instale Temurin 25 pelo link.",
        commands: [
          "sudo apt update",
          "sudo apt install -y curl unzip",
          "sudo apt install -y openjdk-25-jdk",
          "curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -",
          "sudo apt install -y nodejs",
          "java -version",
          "node -v && npm -v",
          "https://adoptium.net/temurin/releases/?version=25"
        ]
      },
      {
        label: "Passo 3",
        title: "Baixe o Paper da mesma versao do Minecraft.",
        body: "No launcher do Minecraft, veja a versao Java que voce vai abrir. Baixe o Paper dessa mesma versao e coloque como paper.jar.",
        commands: [
          "https://papermc.io/downloads/paper",
          "mkdir -p ~/MinecraftLive",
          "cp ~/Downloads/paper-*.jar ~/MinecraftLive/paper.jar",
          "cp ~/Downloads/tiktok-minecraft-live/scripts/linux/start-paper.sh ~/MinecraftLive/start-paper.sh",
          "chmod +x ~/MinecraftLive/start-paper.sh"
        ]
      },
      {
        label: "Passo 4",
        title: "Inicie o Paper pela primeira vez e aceite a EULA.",
        body: "A primeira abertura cria eula.txt, server.properties e plugins/. Depois aceite a EULA e abra de novo.",
        commands: [
          "cd ~/MinecraftLive",
          "./start-paper.sh",
          "sed -i 's/eula=false/eula=true/' eula.txt",
          "./start-paper.sh",
          "Quando terminar de carregar, digite stop no console"
        ]
      },
      {
        label: "Passo 5",
        title: "Instale o plugin e ligue o RCON.",
        body: "Agora plugins/ ja existe. Copie o JAR, configure RCON e reinicie o Paper.",
        commands: [
          "mkdir -p ~/MinecraftLive/plugins",
          "cp ~/Downloads/tiktok-minecraft-live/TikTokWall.jar ~/MinecraftLive/plugins/TikTokWall.jar",
          "nano ~/MinecraftLive/server.properties",
          "enable-rcon=true",
          "rcon.port=25575",
          "rcon.password=troque-essa-senha",
          "cd ~/MinecraftLive && ./start-paper.sh"
        ]
      },
      {
        label: "Passo 6",
        title: "Entre no servidor e prepare a parede automaticamente.",
        body: "Entre em localhost pelo Minecraft Java. Se precisar de permissão, use op SeuNick no console do Paper.",
        commands: sharedCommands
      },
      {
        label: "Passo 7",
        title: "Abra a ponte local e salve a configuração da live.",
        body: "A ponte local é o start-interface-linux.sh. Ela salva a configuração neste computador, roda testes e inicia o bot.",
        commands: ["cd ~/Downloads/tiktok-minecraft-live", "chmod +x start-interface-linux.sh", "./start-interface-linux.sh", "http://127.0.0.1:3333"]
      },
      {
        label: "Passo 8",
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
    logs.textContent = `Abra ${platformContent[selectedPlatform].bridgeScript} no computador da live para conectar o portal ao Minecraft local.`;
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
  showToast("Configuração salva no computador local.");
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
        "1. Baixe o pack em ~/Downloads, rode unzip tiktok-minecraft-live.zip e entre em ~/Downloads/tiktok-minecraft-live.",
        "2. Instale Java JDK 25 e Node.js LTS; confirme com java -version, node -v e npm -v.",
        "3. No launcher do Minecraft, veja a versao Java que sera usada. Baixe Paper dessa mesma versao em https://papermc.io/downloads/paper.",
        "4. Crie ~/MinecraftLive, copie o Paper como ~/MinecraftLive/paper.jar e copie scripts/linux/start-paper.sh para ~/MinecraftLive/start-paper.sh.",
        "5. Rode cd ~/MinecraftLive && ./start-paper.sh uma vez, aceite eula.txt trocando eula=false por eula=true, rode ./start-paper.sh de novo e depois digite stop.",
        "6. Copie ~/Downloads/tiktok-minecraft-live/TikTokWall.jar para ~/MinecraftLive/plugins/TikTokWall.jar.",
        "7. Ative RCON em ~/MinecraftLive/server.properties: enable-rcon=true, rcon.port=25575 e rcon.password=uma-senha.",
        "8. Reinicie o Paper com cd ~/MinecraftLive && ./start-paper.sh.",
        "9. Entre no Minecraft em localhost, rode /tiktokwall setup e depois /tiktokwall test.",
        "10. Abra cd ~/Downloads/tiktok-minecraft-live && ./start-interface-linux.sh.",
        "11. No portal, salve o username TikTok, clique Enviar imagem teste e depois Iniciar bot."
      ]
    : [
        "1. Baixe o pack e extraia em C:\\TikTokMinecraftLive.",
        "2. Instale Java JDK 25 e Node.js LTS; confirme com java -version, node -v e npm -v.",
        "3. No launcher do Minecraft, veja a versao Java que sera usada. Baixe Paper dessa mesma versao em https://papermc.io/downloads/paper.",
        "4. Crie C:\\MinecraftLive, copie o Paper como C:\\MinecraftLive\\paper.jar e copie scripts\\windows\\start-paper.bat para C:\\MinecraftLive\\start-paper.bat.",
        "5. Abra start-paper.bat uma vez, aceite eula.txt trocando eula=false por eula=true, abra start-paper.bat de novo e depois digite stop.",
        "6. Copie C:\\TikTokMinecraftLive\\TikTokWall.jar para C:\\MinecraftLive\\plugins\\TikTokWall.jar.",
        "7. Ative RCON em C:\\MinecraftLive\\server.properties: enable-rcon=true, rcon.port=25575 e rcon.password=uma-senha.",
        "8. Reinicie o Paper abrindo C:\\MinecraftLive\\start-paper.bat.",
        "9. Entre no Minecraft em localhost, rode /tiktokwall setup e depois /tiktokwall test.",
        "10. Abra C:\\TikTokMinecraftLive\\start-interface-windows.bat.",
        "11. No portal, salve o username TikTok, clique Enviar imagem teste e depois Iniciar bot."
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
- Portal online: tela de download, setup guiado e controle. Ele nao guarda credenciais; conversa com a ponte local aberta no computador da live.
- Ponte local: ${platformContent[selectedPlatform].bridgeScript} abre http://127.0.0.1:3333 no computador.
- Bot Node: conecta na live TikTok, pega curtidas/rosas e baixa avatar.
- Plugin Paper: TikTokWall.jar roda no Minecraft local e renderiza avatar em blocos.
- Minecraft: servidor Paper local; o jogador entra em localhost.
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
