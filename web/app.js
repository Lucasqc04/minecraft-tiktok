const BRIDGE_URL = "http://127.0.0.1:3333";

const defaultConfig = {
  TIKTOK_USERNAME: "",
  MINECRAFT_PLUGIN_HOST: "127.0.0.1",
  MINECRAFT_PLUGIN_PORT: "4567",
  AVATAR_SIZE: "128",
  AVATAR_DIR: "./avatars",
  LIKE_GRID_SIZE: "3",
  GIFT_FULL_PANEL: "true",
  RESTORE_LIKE_GRID_AFTER_GIFT: "true",
  LIKE_GRID_ANIMATION: "false",
  GIFT_ANIMATION: "true",
  DURATION_SECONDS: "15",
  ENABLE_LIKE_AVATAR: "true",
  LIKE_AVATAR_COOLDOWN_MS: "750",
  ENABLE_EXTENDED_GIFT_INFO: "false",
  ROSE_GIFT_NAMES: "rose,rosa",
  ROSE_GIFT_IDS: "",
  RCON_HOST: "127.0.0.1",
  RCON_PORT: "25575",
  RCON_PASSWORD: ""
};

const fallbackReleaseData = {
  latest: {
    version: "1.1.1",
    date: "2026-07-03",
    minecraft: "26.2",
    java: "25",
    jar: "./downloads/TikTokWall.jar",
    pack: "./downloads/tiktok-minecraft-live.zip",
    summary: "Configuracao em runtime, painel sem resetar campos editados e mosaico de curtidas sem animacao por padrao."
  },
  history: []
};

const sharedCommands = [
  "/tiktokwall setup",
  "/tiktokwall size 128",
  "/tiktokwall nameplate on",
  "/tiktokwall fireworks gift",
  "/tiktokwall dithering off",
  "/tiktokwall animation on",
  "/tiktokwall animationspeed 8",
  "/tiktokwall test"
];

const platformContent = {
  windows: {
    name: "Windows",
    bridgeScript: "start-interface-windows.bat",
    minecraftDir: "C:\\MinecraftLive",
    projectDir: "C:\\TikTokMinecraftLive",
    startBridge: "start-interface-windows.bat",
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
        body: "Agora a pasta plugins ja existe. Copie o JAR, abra server.properties, edite as linhas do RCON, salve o arquivo e reinicie o Paper.",
        commands: [
          { text: "Copiar C:\\TikTokMinecraftLive\\TikTokWall.jar para C:\\MinecraftLive\\plugins\\TikTokWall.jar", copy: true },
          { text: "Abrir C:\\MinecraftLive\\server.properties no Bloco de Notas.", copy: false },
          { text: "Procure enable-rcon. Se estiver enable-rcon=false, troque para enable-rcon=true.", copy: false },
          { text: "Confirme rcon.port=25575. Se estiver diferente, troque para 25575.", copy: false },
          { text: "Procure rcon.password e coloque uma senha sua, por exemplo rcon.password=minha-senha-forte.", copy: false },
          { text: "Salve o arquivo no Bloco de Notas com Ctrl+S.", copy: false },
          { text: "Abrir C:\\MinecraftLive\\start-paper.bat", copy: true }
        ]
      },
      {
        label: "Passo 6",
        title: "Entre no servidor e prepare a parede automaticamente.",
        body: "Entre em localhost pelo Minecraft Java. Se precisar de permissao, use op SeuNick no console do Paper.",
        commands: sharedCommands
      },
      {
        label: "Passo 7",
        title: "Abra a ponte local e salve a configuracao da live.",
        body: "A ponte local salva a configuracao neste computador, roda testes e inicia o bot.",
        commands: ["Abrir C:\\TikTokMinecraftLive\\start-interface-windows.bat", "http://127.0.0.1:3333", "Salvar configuracao"]
      },
      {
        label: "Passo 8",
        title: "Teste uma imagem e inicie o bot quando a live estiver aberta.",
        body: "A conta TikTok precisa estar ao vivo e publica. Deixe Gift info avancado desligado se nao tiver plano EulerStream.",
        commands: ["Enviar imagem teste", "Iniciar bot", "Aguardar curtida ou rosa na live"]
      }
    ]
  },
  linux: {
    name: "Linux",
    bridgeScript: "start-interface-linux.sh",
    minecraftDir: "~/MinecraftLive",
    projectDir: "~/Downloads/tiktok-minecraft-live",
    startBridge: "./start-interface-linux.sh",
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
        body: "Agora plugins/ ja existe. Copie o JAR, abra server.properties no nano, edite as linhas do RCON, salve e reinicie o Paper.",
        commands: [
          { text: "mkdir -p ~/MinecraftLive/plugins", copy: true },
          { text: "cp ~/Downloads/tiktok-minecraft-live/TikTokWall.jar ~/MinecraftLive/plugins/TikTokWall.jar", copy: true },
          { text: "nano ~/MinecraftLive/server.properties", copy: true },
          { text: "Dentro do nano, use Ctrl+W para procurar enable-rcon. Se estiver enable-rcon=false, troque para enable-rcon=true.", copy: false },
          { text: "Use Ctrl+W para procurar rcon.port. Confirme que esta rcon.port=25575.", copy: false },
          { text: "Use Ctrl+W para procurar rcon.password. Troque para uma senha sua, por exemplo rcon.password=minha-senha-forte.", copy: false },
          { text: "Para salvar no nano: Ctrl+O, Enter. Para sair: Ctrl+X.", copy: false },
          { text: "cd ~/MinecraftLive && ./start-paper.sh", copy: true }
        ]
      },
      {
        label: "Passo 6",
        title: "Entre no servidor e prepare a parede automaticamente.",
        body: "Entre em localhost pelo Minecraft Java. Se precisar de permissao, use op SeuNick no console do Paper.",
        commands: sharedCommands
      },
      {
        label: "Passo 7",
        title: "Abra a ponte local e salve a configuracao da live.",
        body: "A ponte local salva a configuracao neste computador, roda testes e inicia o bot.",
        commands: ["cd ~/Downloads/tiktok-minecraft-live", "chmod +x start-interface-linux.sh", "./start-interface-linux.sh", "http://127.0.0.1:3333"]
      },
      {
        label: "Passo 8",
        title: "Teste uma imagem e inicie o bot quando a live estiver aberta.",
        body: "A conta TikTok precisa estar ao vivo e publica. Deixe Gift info avancado desligado se nao tiver plano EulerStream.",
        commands: ["Enviar imagem teste", "Iniciar bot", "Aguardar curtida ou rosa na live"]
      }
    ]
  }
};

let currentConfig = { ...defaultConfig };
let formDirty = false;
let localLogs = [];
let selectedPlatform = /Linux|X11/i.test(navigator.userAgent) ? "linux" : "windows";
let releaseData = fallbackReleaseData;
let installedPluginVersion = "";

const $ = (id) => document.getElementById(id);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function showToast(message) {
  const toast = $("toast");
  if (!toast) {
    console.log(message);
    return;
  }
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

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value;
}

function setBridgeConnected(connected) {
  const bridgeStatus = $("bridgeStatus");
  if (!bridgeStatus) return;
  bridgeStatus.classList.toggle("connected", connected);
  const label = bridgeStatus.querySelector("span:last-child");
  if (label) label.textContent = connected ? "Ponte local conectada" : "Ponte local desconectada";
}

function fillForm(config, options = {}) {
  const nextConfig = { ...defaultConfig, ...config };
  if (formDirty && !options.force) {
    renderAiContext();
    return;
  }

  currentConfig = nextConfig;
  const form = $("configForm");
  if (form) {
    for (const [key, value] of Object.entries(currentConfig)) {
      const field = form.elements.namedItem(key);
      if (!field) continue;
      if (field.type === "checkbox") {
        field.checked = String(value).toLowerCase() === "true";
      } else {
        field.value = value ?? "";
      }
    }
  }
  renderAiContext();
}

function markFormDirty() {
  formDirty = true;
  currentConfig = { ...currentConfig, ...collectForm() };
  renderAiContext();
}

function collectForm() {
  const form = $("configForm");
  const data = {};
  if (!form) return data;
  for (const element of form.elements) {
    if (!element.name) continue;
    data[element.name] = element.type === "checkbox" ? element.checked : element.value;
  }
  return data;
}

async function refreshBridge() {
  try {
    const status = await bridgeApi("/api/status");
    setBridgeConnected(true);
    setText("bridgeValue", "Conectada");
    setText("botValue", status.bot === "running" ? "Rodando" : "Parado");
    setText("previewState", status.bot === "running" ? "bot online" : "bridge online");

    localLogs = status.logs || [];
    const logs = $("logs");
    if (logs) {
      logs.textContent = localLogs.join("\n");
      logs.scrollTop = logs.scrollHeight;
    }

    const configResult = await bridgeApi("/api/config");
    fillForm(configResult.config);

    try {
      const health = await bridgeApi("/api/plugin/health");
      const pluginHealth = health.health || {};
      installedPluginVersion = normalizeVersion(pluginHealth.version || "");
      setText(
        "pluginValue",
        pluginHealth.version
          ? `${pluginHealth.busy ? "Ocupado" : "OK"} ${pluginHealth.version}`
          : pluginHealth.busy ? "Ocupado" : "OK"
      );
      renderUpdates();
    } catch {
      installedPluginVersion = "";
      setText("pluginValue", "Sem resposta");
      renderUpdates();
    }
  } catch {
    setBridgeConnected(false);
    setText("bridgeValue", "Desconectada");
    setText("botValue", "-");
    setText("pluginValue", "-");
    setText("previewState", "bridge offline");
    installedPluginVersion = "";
    const logs = $("logs");
    if (logs) {
      logs.textContent = `Abra ${platformContent[selectedPlatform].bridgeScript} no computador da live para conectar o portal ao Minecraft local.`;
    }
    fillForm(currentConfig);
    renderUpdates();
  }
}

async function saveCurrentConfig() {
  const result = await bridgeApi("/api/config", {
    method: "POST",
    body: JSON.stringify(collectForm())
  });
  formDirty = false;
  fillForm(result.config, { force: true });
  return result.config;
}

async function saveConfig(event) {
  event.preventDefault();
  await saveCurrentConfig();
  showToast("Configuracao salva no computador local.");
}

async function botAction(path, message) {
  await bridgeApi(path, { method: "POST" });
  showToast(message);
  await refreshBridge();
}

async function rcon(command) {
  await saveCurrentConfig();
  const result = await bridgeApi("/api/rcon", {
    method: "POST",
    body: JSON.stringify({ command })
  });
  showToast(result.result || `/${command}`);
  await refreshBridge();
}

function renderStep(index) {
  const stepPanel = $("stepPanel");
  const stepCommands = $("stepCommands");
  if (!stepPanel || !stepCommands) return;

  const step = platformContent[selectedPlatform].steps[index] || platformContent[selectedPlatform].steps[0];
  $$("#steps li").forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === index));
  $$("[data-os]").forEach((button) => button.classList.toggle("active", button.dataset.os === selectedPlatform));
  setText("bridgeScriptName", platformContent[selectedPlatform].bridgeScript);

  const label = stepPanel.querySelector(".system-label");
  const title = stepPanel.querySelector("h3");
  const body = stepPanel.querySelector("p:not(.system-label)");
  if (label) label.textContent = step.label;
  if (title) title.textContent = step.title;
  if (body) body.textContent = step.body;

  stepCommands.innerHTML = "";
  for (const command of step.commands) {
    stepCommands.appendChild(copyRow(command));
  }
}

function setPlatform(platform) {
  selectedPlatform = platform;
  renderStep(currentStepIndex());
  renderAiContext();
  renderUpdates();
  refreshBridge().catch(() => {});
}

function currentStepIndex() {
  const active = document.querySelector("#steps li.active button");
  return Number(active?.dataset.step ?? 0);
}

function copyRow(item) {
  const text = typeof item === "string" ? item : item.text;
  const canCopy = typeof item === "string" ? true : item.copy !== false;
  const clipboardText = typeof item === "string" ? text : item.copyText || text;
  const row = document.createElement("div");
  row.className = canCopy ? "copy-row" : "copy-row note-row";
  row.innerHTML = canCopy
    ? `<code></code><button class="button small" type="button">Copiar</button>`
    : `<code></code>`;
  row.querySelector("code").textContent = text;
  const button = row.querySelector("button");
  if (button) {
    button.addEventListener("click", () => copyText(clipboardText, "Copiado."));
  }
  return row;
}

function itemText(item) {
  return typeof item === "string" ? item : item.text;
}

function commandsText() {
  return [
    "/tiktokwall setup",
    "/tiktokwall info",
    "/tiktokwall test",
    "/tiktokwall clear",
    "/tiktokwall size 32",
    "/tiktokwall size 48",
    "/tiktokwall size 64",
    "/tiktokwall size 128",
    "/tiktokwall size 256",
    "/tiktokwall dithering on",
    "/tiktokwall dithering off",
    "/tiktokwall ditheringstrength 12",
    "/tiktokwall animation on",
    "/tiktokwall animation off",
    "/tiktokwall animationspeed 4",
    "/tiktokwall animationspeed 8",
    "/tiktokwall animationspeed 16",
    "/tiktokwall nameplate on",
    "/tiktokwall nameplate off",
    "/tiktokwall nameplatematerial BLACK_CONCRETE",
    "/tiktokwall fireworks off",
    "/tiktokwall fireworks like",
    "/tiktokwall fireworks gift",
    "/tiktokwall fireworks any",
    "/tiktokwall fireworkcount 5",
    "/tiktokwall fireworkcount 10",
    "/tiktokwall facing NORTH",
    "/tiktokwall facing SOUTH",
    "/tiktokwall facing EAST",
    "/tiktokwall facing WEST"
  ].join("\n");
}

function serverPropsText() {
  return [
    "enable-rcon=true",
    "rcon.port=25575",
    "rcon.password=troque-essa-senha"
  ].join("\n");
}

async function loadReleaseData() {
  try {
    const response = await fetch("./updates.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`updates.json ${response.status}`);
    releaseData = await response.json();
  } catch {
    releaseData = fallbackReleaseData;
  }
  renderUpdates();
  renderAiContext();
}

function renderUpdates() {
  const latest = releaseData.latest || fallbackReleaseData.latest;
  const latestVersion = normalizeVersion(latest.version || "");
  const installedVersion = normalizeVersion(installedPluginVersion);
  const comparison = compareVersions(installedVersion, latestVersion);

  setText("latestVersionValue", latestVersion || "-");
  setText("installedVersionValue", installedVersion || "Nao verificada");
  setText("releaseCompatibilityValue", `MC ${latest.minecraft || "-"} / Java ${latest.java || "-"}`);
  setText("updateSummary", latest.summary || "Baixe o JAR mais recente e substitua o arquivo dentro da pasta plugins do Paper.");

  const latestJarLink = $("latestJarLink");
  const latestPackLink = $("latestPackLink");
  if (latestJarLink) latestJarLink.href = latest.jar || "./downloads/TikTokWall.jar";
  if (latestPackLink) latestPackLink.href = latest.pack || "./downloads/tiktok-minecraft-live.zip";

  if (!installedVersion) {
    setUpdateStatus("unknown", "Nao verificado");
  } else if (comparison == null) {
    setUpdateStatus("warning", "Versao desconhecida");
  } else if (comparison < 0) {
    setUpdateStatus("danger", "Atualizacao disponivel");
  } else if (comparison === 0) {
    setUpdateStatus("ok", "Atualizado");
  } else {
    setUpdateStatus("warning", "Mais novo que o portal");
  }

  renderUpdateSteps();
  renderReleaseHistory();
}

function setUpdateStatus(type, text) {
  const pill = $("updateStatusPill");
  if (!pill) return;
  pill.className = `status-pill ${type}`;
  pill.textContent = text;
}

function renderUpdateSteps() {
  const container = $("updateSteps");
  if (!container) return;
  container.innerHTML = "";
  for (const step of updateStepItems()) {
    container.appendChild(copyRow(step));
  }
}

function renderReleaseHistory() {
  const container = $("releaseHistory");
  if (!container) return;
  container.innerHTML = "";
  const history = Array.isArray(releaseData.history) ? releaseData.history : [];
  for (const release of history) {
    const article = document.createElement("article");
    article.className = "release-item";

    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = `${release.version} - ${release.title || "Atualizacao"}`;
    const time = document.createElement("time");
    time.textContent = formatDate(release.date);
    header.append(title, time);

    const list = document.createElement("ul");
    for (const change of release.changes || []) {
      const item = document.createElement("li");
      item.textContent = change;
      list.appendChild(item);
    }

    article.append(header, list);
    container.appendChild(article);
  }
}

function updateStepsText() {
  return updateStepItems().map((step) => itemText(step)).join("\n");
}

function updateCommandsText() {
  return updateStepItems()
    .filter((step) => step.copy !== false)
    .map((step) => step.copyText || itemText(step))
    .join("\n");
}

function updateStepItems() {
  if (selectedPlatform === "linux") {
    return [
      { text: "1. Baixe TikTokWall.jar pelo botao da pagina Atualizacoes.", copy: false },
      { text: "2. No console do Paper, digite stop.", copyText: "stop" },
      {
        text: "3. Rode: cp ~/Downloads/TikTokWall.jar ~/MinecraftLive/plugins/TikTokWall.jar",
        copyText: "cp ~/Downloads/TikTokWall.jar ~/MinecraftLive/plugins/TikTokWall.jar"
      },
      {
        text: "4. Rode: cd ~/MinecraftLive && ./start-paper.sh",
        copyText: "cd ~/MinecraftLive && ./start-paper.sh"
      },
      { text: "5. Volte ao portal e clique Verificar versao.", copy: false }
    ];
  }

  return [
    { text: "1. Baixe TikTokWall.jar pelo botao da pagina Atualizacoes.", copy: false },
    { text: "2. No console do Paper, digite stop.", copyText: "stop" },
    { text: "3. Substitua C:\\MinecraftLive\\plugins\\TikTokWall.jar pelo arquivo novo baixado.", copy: false },
    {
      text: "4. Abra C:\\MinecraftLive\\start-paper.bat.",
      copyText: "C:\\MinecraftLive\\start-paper.bat"
    },
    { text: "5. Volte ao portal e clique Verificar versao.", copy: false }
  ];
}

function normalizeVersion(value) {
  return String(value || "").trim().replace(/^v/i, "");
}

function compareVersions(current, latest) {
  if (!current || !latest) return null;
  const currentParts = current.split(".").map((part) => Number.parseInt(part, 10));
  const latestParts = latest.split(".").map((part) => Number.parseInt(part, 10));
  if (currentParts.some(Number.isNaN) || latestParts.some(Number.isNaN)) return null;
  const length = Math.max(currentParts.length, latestParts.length);
  for (let index = 0; index < length; index += 1) {
    const left = currentParts[index] || 0;
    const right = latestParts[index] || 0;
    if (left < right) return -1;
    if (left > right) return 1;
  }
  return 0;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

function quickStartText() {
  const platform = platformContent[selectedPlatform];
  return [
    `Sistema: ${platform.name}`,
    `Pasta do projeto: ${platform.projectDir}`,
    `Pasta do servidor: ${platform.minecraftDir}`,
    `Ponte local: ${platform.startBridge}`,
    "",
    ...platform.steps.map((step, index) => [
      `${index + 1}. ${step.title}`,
      step.body,
      ...step.commands.map((command) => `   - ${itemText(command)}`)
    ].join("\n"))
  ].join("\n\n");
}

function zipMapText() {
  return [
    "Arquivos principais do ZIP:",
    "- TikTokWall.jar: plugin pronto para copiar para a pasta plugins do Paper.",
    "- start-interface-windows.bat: abre a ponte local no Windows e instala dependencias do bot.",
    "- start-interface-linux.sh: abre a ponte local no Linux e instala dependencias do bot.",
    "- scripts/windows/start-paper.bat: inicia o servidor Paper no Windows.",
    "- scripts/linux/start-paper.sh: inicia o servidor Paper no Linux.",
    "- bot/: codigo Node.js que conecta TikTok Live, processa avatar e fala com o plugin.",
    "- bot/.env.example: modelo de configuracao; o .env real fica apenas no computador da live.",
    "- minecraft-plugin/: codigo Java Paper do plugin TikTokWall.",
    "- docs/LEIAME_WINDOWS.md: guia Windows completo.",
    "- docs/LEIAME_LINUX.md: guia Linux completo.",
    "- web/: portal estatico com downloads, setup, painel admin, atualizacoes e contexto para IA.",
    "- web/updates.json: historico de versoes usado pela pagina Atualizacoes."
  ].join("\n");
}

function aiContextText() {
  const config = { ...currentConfig, RCON_PASSWORD: currentConfig.RCON_PASSWORD ? "[preenchido]" : "" };
  return `Voce e uma IA ajudando uma pessoa a instalar e operar o projeto TikTok Minecraft Live. Responda passo a passo, sem assumir que a pessoa programa.

Objetivo do projeto:
- Quando alguem curte ou manda rosa na live do TikTok, o bot pega a foto de perfil e envia para o plugin Paper.
- O plugin TikTokWall renderiza a imagem como pixel art de blocos em uma parede vertical no Minecraft.
- Depois do tempo configurado, a parede limpa e a proxima pessoa da fila aparece.

Arquitetura:
- Portal online: downloads, setup guiado, painel admin, atualizacoes e contexto para IA.
- Ponte local: ${platformContent[selectedPlatform].bridgeScript} abre http://127.0.0.1:3333 no computador da live.
- Bot Node: conecta na live TikTok, detecta curtidas/rosas, baixa avatar, processa PNG com sharp e envia ao plugin.
- Plugin Paper: TikTokWall.jar roda no servidor Paper local e abre HTTP em 127.0.0.1:4567.
- Minecraft: servidor Paper local; o jogador entra em localhost.
- Sistema selecionado no portal: ${platformContent[selectedPlatform].name}
- Versao publicada no portal: ${normalizeVersion(releaseData.latest?.version || fallbackReleaseData.latest.version)}
- Versao local detectada: ${installedPluginVersion || "nao verificada"}

${zipMapText()}

Config atual do bot, com senha mascarada:
${JSON.stringify(config, null, 2)}

Passo a passo completo para este sistema:
${quickStartText()}

Comandos Minecraft disponiveis:
${commandsText()}

server.properties minimo:
${serverPropsText()}

Atualizacao do plugin:
${updateStepsText()}

Painel admin:
- Salvar configuracao escreve bot/.env no computador local.
- Iniciar bot roda npm run dev dentro de bot/.
- Parar bot finaliza o processo do bot.
- Enviar imagem teste usa npm run test:image e nao precisa TikTok.
- Botoes RCON so funcionam se RCON_PASSWORD estiver preenchido e o server.properties estiver com RCON ativo.
- Verificar versao compara web/updates.json com /api/plugin/health.

Problemas comuns:
- cp para plugins falha: criar ~/MinecraftLive/plugins ou rodar o Paper uma vez.
- ./start-paper.sh nao existe: copiar scripts/linux/start-paper.sh para ~/MinecraftLive/start-paper.sh e rodar chmod +x.
- Plugin sem resposta: Paper fechado, porta errada, plugin nao carregou ou firewall bloqueando Java.
- Imagem em um canto: AVATAR_SIZE do bot e /tiktokwall size precisam bater.
- Pontos rosas/ruido: usar /tiktokwall dithering off.
- Bot nao conecta: live nao esta publica/ao vivo, username errado ou Gift info avancado ligado sem plano EulerStream.
- Curtidas nao aparecem: ENABLE_LIKE_AVATAR precisa estar ligado e cooldown pode estar alto.

Peça logs especificos antes de concluir que algo nao funciona.`;
}

function renderAiContext() {
  const preview = $("aiContextPreview");
  if (preview) preview.textContent = aiContextText();
}

async function copyText(text, message) {
  await navigator.clipboard.writeText(text);
  showToast(message);
}

function on(id, event, handler) {
  const element = $(id);
  if (element) element.addEventListener(event, handler);
}

function bindEvents() {
  $$("#steps button").forEach((button) => {
    button.addEventListener("click", () => renderStep(Number(button.dataset.step)));
  });

  $$("[data-os]").forEach((button) => {
    button.addEventListener("click", () => setPlatform(button.dataset.os));
  });

  const form = $("configForm");
  if (form) {
    form.addEventListener("input", markFormDirty);
    form.addEventListener("change", markFormDirty);
    form.addEventListener("submit", (event) => saveConfig(event).catch((error) => showToast(error.message)));
  }

  on("refreshBridge", "click", () => refreshBridge());
  on("healthButton", "click", () => bridgeApi("/api/plugin/health").then((result) => showToast(`Plugin OK: ${JSON.stringify(result.health)}`)).catch((error) => showToast(error.message)));
  on("startBot", "click", () => saveCurrentConfig().then(() => botAction("/api/bot/start", "Configuracao salva. Bot iniciado.")).catch((error) => showToast(error.message)));
  on("stopBot", "click", () => botAction("/api/bot/stop", "Bot parado.").catch((error) => showToast(error.message)));
  on("testImage", "click", () => botAction("/api/test-image", "Imagem teste enviada.").catch((error) => showToast(error.message)));
  on("clearLocalLog", "click", () => {
    const logs = $("logs");
    if (logs) logs.textContent = "";
    showToast("Tela de logs limpa.");
  });
  on("checkUpdates", "click", () => refreshBridge().then(() => showToast("Versao verificada.")).catch((error) => showToast(error.message)));

  $$("[data-rcon]").forEach((button) => {
    button.addEventListener("click", () => rcon(button.dataset.rcon).catch((error) => showToast(error.message)));
  });

  on("copyQuickStart", "click", () => copyText(quickStartText(), "Passo a passo copiado."));
  on("copyUpdateSteps", "click", () => copyText(updateCommandsText(), "Comandos de atualizacao copiados."));
  on("copyAiContext", "click", () => copyText(aiContextText(), "Contexto para IA copiado."));
  on("copyCommands", "click", () => copyText(commandsText(), "Comandos copiados."));
  on("copyServerProps", "click", () => copyText(serverPropsText(), "server.properties copiado."));
  on("copyZipMap", "click", () => copyText(zipMapText(), "Mapa do ZIP copiado."));
}

window.addEventListener("unhandledrejection", (event) => {
  showToast(event.reason?.message || String(event.reason));
});

bindEvents();
renderStep(0);
fillForm(defaultConfig, { force: true });
loadReleaseData();
refreshBridge();
window.setInterval(refreshBridge, 4000);
