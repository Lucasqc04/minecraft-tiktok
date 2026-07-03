import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { Rcon } from "rcon-client";

type EnvMap = Record<string, string>;

const BOT_DIR = process.cwd();
const ENV_PATH = path.join(BOT_DIR, ".env");
const ENV_EXAMPLE_PATH = path.join(BOT_DIR, ".env.example");

dotenv.config({ path: ENV_PATH });

const UI_HOST = "127.0.0.1";
const UI_PORT = intFromEnv("UI_PORT", 3333);
const LOG_LIMIT = 400;

const CONFIG_KEYS = [
  "TIKTOK_USERNAME",
  "MINECRAFT_PLUGIN_HOST",
  "MINECRAFT_PLUGIN_PORT",
  "AVATAR_SIZE",
  "AVATAR_DIR",
  "LIKE_GRID_SIZE",
  "GIFT_FULL_PANEL",
  "RESTORE_LIKE_GRID_AFTER_GIFT",
  "LIKE_GRID_ANIMATION",
  "GIFT_ANIMATION",
  "DURATION_SECONDS",
  "ENABLE_LIKE_AVATAR",
  "LIKE_AVATAR_COOLDOWN_MS",
  "ENABLE_EXTENDED_GIFT_INFO",
  "ROSE_GIFT_NAMES",
  "ROSE_GIFT_IDS",
  "RCON_HOST",
  "RCON_PORT",
  "RCON_PASSWORD",
  "UI_PORT",
  "BRIDGE_ALLOWED_ORIGINS"
] as const;

const DEFAULT_CONFIG: EnvMap = {
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
  RCON_PASSWORD: "",
  UI_PORT: "3333",
  BRIDGE_ALLOWED_ORIGINS: "*"
};

let botProcess: ChildProcessWithoutNullStreams | null = null;
let botStartedAt = "";
let restartBotAfterExit = false;
const logLines: string[] = [];
const RECONNECT_CONFIG_KEYS = [
  "TIKTOK_USERNAME",
  "ENABLE_EXTENDED_GIFT_INFO",
  "ROSE_GIFT_NAMES",
  "ROSE_GIFT_IDS"
] as const;

async function main(): Promise<void> {
  await ensureEnvFile();

  const server = createServer(async (request, response) => {
    try {
      applyCors(request, response);
      if (request.method === "OPTIONS") {
        response.writeHead(204);
        response.end();
        return;
      }

      await route(request, response);
    } catch (error) {
      sendJson(response, 500, {
        ok: false,
        message: error instanceof Error ? error.message : "Erro ao processar a solicitacao"
      });
    }
  });

  server.listen(UI_PORT, UI_HOST, () => {
    const url = `http://${UI_HOST}:${UI_PORT}`;
    console.log(`[ui] Interface aberta em ${url}`);
    openBrowser(url);
  });
}

function applyCors(request: IncomingMessage, response: ServerResponse): void {
  const origin = request.headers.origin;
  const allowedOrigins = (process.env.BRIDGE_ALLOWED_ORIGINS || "*")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (allowedOrigins.includes("*")) {
    response.setHeader("Access-Control-Allow-Origin", "*");
  } else if (origin && allowedOrigins.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }

  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function route(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? `${UI_HOST}:${UI_PORT}`}`);

  if (request.method === "GET" && url.pathname === "/") {
    sendHtml(response, renderPage());
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/config") {
    sendJson(response, 200, { ok: true, config: await readConfig() });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/config") {
    const body = await readJson(request);
    const config = await writeConfig(body);
    sendJson(response, 200, { ok: true, config });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/status") {
    sendJson(response, 200, {
      ok: true,
      bot: botStatus(),
      startedAt: botStartedAt,
      logs: logLines
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/bot/start") {
    await startBot();
    sendJson(response, 200, { ok: true, bot: botStatus() });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/bot/stop") {
    await stopBot();
    sendJson(response, 200, { ok: true, bot: botStatus() });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/test-image") {
    const output = await runNpm(["run", "test:image"]);
    sendJson(response, 200, { ok: true, output });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/plugin/health") {
    sendJson(response, 200, { ok: true, health: await pluginHealth() });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/rcon") {
    const body = await readJson(request);
    const result = await sendRcon(String(body.command ?? ""));
    sendJson(response, 200, { ok: true, result });
    return;
  }

  sendJson(response, 404, { ok: false, message: "Rota nao encontrada" });
}

async function ensureEnvFile(): Promise<void> {
  if (existsSync(ENV_PATH)) {
    return;
  }

  if (existsSync(ENV_EXAMPLE_PATH)) {
    await fs.copyFile(ENV_EXAMPLE_PATH, ENV_PATH);
    return;
  }

  await fs.writeFile(ENV_PATH, serializeEnv(DEFAULT_CONFIG), "utf8");
}

async function readConfig(): Promise<EnvMap> {
  await ensureEnvFile();
  const raw = await fs.readFile(ENV_PATH, "utf8");
  return {
    ...DEFAULT_CONFIG,
    ...parseEnv(raw)
  };
}

async function writeConfig(input: unknown): Promise<EnvMap> {
  if (!input || typeof input !== "object") {
    throw new Error("Config invalida");
  }

  const current = await readConfig();
  const next: EnvMap = { ...current };
  const values = input as Record<string, unknown>;

  for (const key of CONFIG_KEYS) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      next[key] = normalizeConfigValue(key, values[key]);
    }
  }

  validateConfig(next);
  await fs.writeFile(ENV_PATH, serializeEnv(next), "utf8");
  applyConfigToProcessEnv(next);
  if (botStatus() === "running" && requiresBotReconnect(current, next)) {
    await restartBotForConfigChange();
  }
  return next;
}

function parseEnv(raw: string): EnvMap {
  const values: EnvMap = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator < 0) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

function serializeEnv(values: EnvMap): string {
  return `${CONFIG_KEYS.map((key) => `${key}=${escapeEnvValue(values[key] ?? "")}`).join("\n")}\n`;
}

function escapeEnvValue(value: string): string {
  if (!/[\s#"']/u.test(value)) {
    return value;
  }
  return `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function normalizeConfigValue(key: string, value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string") {
    return value.trim();
  }
  if (value == null) {
    return "";
  }
  throw new Error(`${key} invalido`);
}

function validateConfig(config: EnvMap): void {
  const avatarSize = Number.parseInt(config.AVATAR_SIZE, 10);
  if (![32, 48, 64, 128, 256].includes(avatarSize)) {
    throw new Error("AVATAR_SIZE deve ser 32, 48, 64, 128 ou 256");
  }

  validateInteger(config.LIKE_GRID_SIZE, "Grid de curtidas", 1, 4);
  validateInteger(config.MINECRAFT_PLUGIN_PORT, "Porta do plugin", 1, 65535);
  validateInteger(config.RCON_PORT, "Porta RCON", 1, 65535);
  validateInteger(config.DURATION_SECONDS, "Duracao", 1, 600);
  validateInteger(config.LIKE_AVATAR_COOLDOWN_MS, "Cooldown de curtida", 0, 600000);
  validateInteger(config.UI_PORT, "Porta da interface", 1, 65535);
}

function validateInteger(value: string, label: string, min: number, max: number): void {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${label} deve ficar entre ${min} e ${max}`);
  }
}

function requiresBotReconnect(current: EnvMap, next: EnvMap): boolean {
  return RECONNECT_CONFIG_KEYS.some((key) => (current[key] ?? "") !== (next[key] ?? ""));
}

async function restartBotForConfigChange(): Promise<void> {
  appendLog("[ui] configuracao de conexao mudou; reiniciando apenas o bot...");
  restartBotAfterExit = true;
  await stopBot();
}

async function startBot(): Promise<void> {
  if (botProcess && !botProcess.killed) {
    appendLog("[ui] bot ja esta rodando");
    return;
  }

  const config = await readConfig();
  if (!config.TIKTOK_USERNAME.trim()) {
    throw new Error("Preencha o Username TikTok, clique em Salvar e tente iniciar o bot de novo");
  }

  appendLog("[ui] iniciando bot TikTok...");
  botStartedAt = new Date().toLocaleString();
  botProcess = spawn(npmCommand(), ["run", "dev"], {
    cwd: BOT_DIR,
    env: childEnvFromConfig(config)
  });

  botProcess.stdout.on("data", (chunk) => appendLog(chunk.toString()));
  botProcess.stderr.on("data", (chunk) => appendLog(chunk.toString()));
  botProcess.on("exit", (code, signal) => {
    appendLog(`[ui] bot finalizado code=${code ?? "-"} signal=${signal ?? "-"}`);
    botProcess = null;
    botStartedAt = "";
    if (restartBotAfterExit) {
      restartBotAfterExit = false;
      startBot().catch((error) => appendLog(`[ui] falha ao reiniciar bot: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
}

async function stopBot(): Promise<void> {
  if (!botProcess || botProcess.killed || botProcess.pid == null) {
    appendLog("[ui] bot nao esta rodando");
    botProcess = null;
    botStartedAt = "";
    return;
  }

  appendLog("[ui] parando bot...");
  const pid = botProcess.pid;
  if (process.platform === "win32") {
    await runCommand("taskkill", ["/pid", String(pid), "/T", "/F"]).catch((error) => {
      appendLog(`[ui] taskkill falhou: ${error instanceof Error ? error.message : String(error)}`);
    });
  } else {
    botProcess.kill("SIGTERM");
  }
}

function botStatus(): string {
  return botProcess && !botProcess.killed ? "running" : "stopped";
}

function appendLog(text: string): void {
  for (const line of text.replace(/\r/g, "").split("\n")) {
    if (!line) {
      continue;
    }
    logLines.push(line);
  }
  while (logLines.length > LOG_LIMIT) {
    logLines.shift();
  }
}

async function runNpm(args: string[]): Promise<string> {
  const config = await readConfig();
  return runCommand(npmCommand(), args, BOT_DIR, childEnvFromConfig(config));
}

function runCommand(
  command: string,
  args: string[],
  cwd = BOT_DIR,
  env: NodeJS.ProcessEnv = process.env
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        appendLog(output);
        resolve(output.trim());
        return;
      }
      reject(new Error(output.trim() || `${command} saiu com codigo ${code}`));
    });
  });
}

async function pluginHealth(): Promise<unknown> {
  const config = await readConfig();
  const url = `http://${config.MINECRAFT_PLUGIN_HOST}:${config.MINECRAFT_PLUGIN_PORT}/health`;
  const response = await fetch(url);
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Plugin respondeu ${response.status}: ${body}`);
  }
  return body ? JSON.parse(body) : null;
}

async function sendRcon(rawCommand: string): Promise<string> {
  const command = rawCommand.trim().replace(/^\/+/, "");
  if (!command.startsWith("tiktokwall ")) {
    throw new Error("Por seguranca, a interface so envia comandos /tiktokwall pelo RCON");
  }

  const config = await readConfig();
  if (!config.RCON_PASSWORD) {
    throw new Error("Preencha RCON_PASSWORD na configuracao para usar botoes RCON");
  }

  const rcon = await Rcon.connect({
    host: config.RCON_HOST,
    port: Number.parseInt(config.RCON_PORT, 10),
    password: config.RCON_PASSWORD
  });

  try {
    const result = await rcon.send(command);
    appendLog(`[rcon] /${command}`);
    appendLog(result);
    return result;
  } finally {
    rcon.end();
  }
}

function npmCommand(): string {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function childEnvFromConfig(config: EnvMap): NodeJS.ProcessEnv {
  return {
    ...process.env,
    ...config
  };
}

function applyConfigToProcessEnv(config: EnvMap): void {
  for (const key of CONFIG_KEYS) {
    process.env[key] = config[key] ?? "";
  }
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > 1024 * 1024) {
      throw new Error("Body grande demais");
    }
    chunks.push(buffer);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload)
  });
  response.end(payload);
}

function sendHtml(response: ServerResponse, html: string): void {
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": Buffer.byteLength(html)
  });
  response.end(html);
}

function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? value : fallback;
}

function openBrowser(url: string): void {
  if (process.env.NO_OPEN === "1") {
    return;
  }

  const command =
    process.platform === "win32" ? "cmd" : process.platform === "darwin" ? "open" : "xdg-open";
  const args =
    process.platform === "win32" ? ["/c", "start", "", url] : [url];

  const child = spawn(command, args, {
    detached: true,
    stdio: "ignore"
  });
  child.unref();
}

function renderPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TikTok Minecraft Live</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #101316;
      --panel: #171b20;
      --panel-2: #1e242b;
      --line: #2c343d;
      --text: #edf2f7;
      --muted: #9aa6b2;
      --accent: #2dd4bf;
      --accent-2: #38bdf8;
      --danger: #fb7185;
      --ok: #86efac;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 22px 28px;
      border-bottom: 1px solid var(--line);
      background: #0d1013;
    }
    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 760;
      letter-spacing: 0;
    }
    main {
      display: grid;
      grid-template-columns: minmax(420px, 560px) minmax(320px, 1fr);
      gap: 24px;
      padding: 24px 28px 32px;
    }
    section {
      min-width: 0;
    }
    .stack {
      display: grid;
      gap: 18px;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
    }
    .panel h2 {
      margin: 0 0 14px;
      font-size: 15px;
      font-weight: 720;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    label {
      display: grid;
      gap: 7px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.25;
    }
    input, select {
      width: 100%;
      height: 38px;
      border-radius: 6px;
      border: 1px solid var(--line);
      background: var(--panel-2);
      color: var(--text);
      padding: 0 10px;
      font-size: 14px;
      outline: none;
    }
    input:focus, select:focus {
      border-color: var(--accent);
    }
    .check {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 38px;
      color: var(--text);
    }
    .check input {
      width: 18px;
      height: 18px;
      accent-color: var(--accent);
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }
    button {
      height: 38px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--panel-2);
      color: var(--text);
      padding: 0 13px;
      font-weight: 650;
      cursor: pointer;
      transition: border-color .15s ease, background .15s ease, transform .15s ease;
    }
    button:hover {
      border-color: var(--accent);
      background: #24303a;
      transform: translateY(-1px);
    }
    button.primary {
      border-color: transparent;
      background: var(--accent);
      color: #062522;
    }
    button.danger {
      border-color: #7f1d1d;
      color: #fecdd3;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 32px;
      color: var(--muted);
      font-size: 13px;
    }
    .dot {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: var(--danger);
    }
    .dot.ok { background: var(--ok); }
    pre {
      min-height: 360px;
      max-height: 58vh;
      margin: 0;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: #080a0c;
      padding: 14px;
      color: #d6dee8;
      font: 12px/1.45 "Cascadia Code", "Fira Code", Consolas, monospace;
    }
    .hint {
      margin: 10px 0 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }
    .message {
      min-height: 22px;
      color: var(--accent-2);
      font-size: 13px;
    }
    @media (max-width: 980px) {
      main { grid-template-columns: 1fr; padding: 18px; }
      header { padding: 18px; align-items: flex-start; flex-direction: column; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>TikTok Minecraft Live</h1>
      <div class="hint">Painel local para configurar live, testar avatar e controlar o bot.</div>
    </div>
    <div class="status"><span id="botDot" class="dot"></span><span id="botStatus">bot parado</span></div>
  </header>

  <main>
    <section class="stack">
      <form id="configForm" class="panel">
        <h2>Configuracao da live</h2>
        <div class="grid">
          <label>TikTok username sem @
            <input name="TIKTOK_USERNAME" placeholder="usuario_da_live" autocomplete="off" />
          </label>
          <label>Tamanho do avatar
            <select name="AVATAR_SIZE">
              <option>32</option>
              <option>48</option>
              <option>64</option>
              <option>128</option>
              <option>256</option>
            </select>
          </label>
          <label>Grid de curtidas
            <select name="LIKE_GRID_SIZE">
              <option value="1">1x1</option>
              <option value="2">2x2</option>
              <option value="3">3x3</option>
              <option value="4">4x4</option>
            </select>
          </label>
          <label>Duracao na parede em segundos
            <input name="DURATION_SECONDS" type="number" min="1" max="600" />
          </label>
          <label>Cooldown de curtida em ms
            <input name="LIKE_AVATAR_COOLDOWN_MS" type="number" min="0" max="600000" />
          </label>
          <label>Host do plugin Minecraft
            <input name="MINECRAFT_PLUGIN_HOST" />
          </label>
          <label>Porta do plugin
            <input name="MINECRAFT_PLUGIN_PORT" type="number" min="1" max="65535" />
          </label>
          <label>Gifts que contam como rosa
            <input name="ROSE_GIFT_NAMES" placeholder="rose,rosa" />
          </label>
          <label>IDs de gift opcionais
            <input name="ROSE_GIFT_IDS" placeholder="deixe vazio" />
          </label>
          <label>RCON host
            <input name="RCON_HOST" />
          </label>
          <label>RCON porta
            <input name="RCON_PORT" type="number" min="1" max="65535" />
          </label>
          <label>RCON senha
            <input name="RCON_PASSWORD" type="password" autocomplete="new-password" />
          </label>
          <label>Pasta dos avatars
            <input name="AVATAR_DIR" />
          </label>
        </div>
        <div class="row" style="margin-top:14px">
          <label class="check"><input name="ENABLE_LIKE_AVATAR" type="checkbox" /> Curtida mostra avatar</label>
          <label class="check"><input name="GIFT_FULL_PANEL" type="checkbox" /> Gift em tela cheia</label>
          <label class="check"><input name="RESTORE_LIKE_GRID_AFTER_GIFT" type="checkbox" /> Restaurar mosaico apos gift</label>
          <label class="check"><input name="LIKE_GRID_ANIMATION" type="checkbox" /> Animar mosaico de curtidas</label>
          <label class="check"><input name="GIFT_ANIMATION" type="checkbox" /> Animar gift em tela cheia</label>
          <label class="check"><input name="ENABLE_EXTENDED_GIFT_INFO" type="checkbox" /> Gift info avancado</label>
        </div>
        <div class="row" style="margin-top:14px">
          <button class="primary" type="submit">Salvar configuracao</button>
          <button type="button" id="healthButton">Checar plugin</button>
        </div>
        <p class="hint">Deixe "Gift info avancado" desligado, a menos que voce tenha plano EulerStream.</p>
      </form>

      <div class="panel">
        <h2>Controle</h2>
        <div class="row">
          <button class="primary" id="startBot" type="button">Iniciar bot</button>
          <button class="danger" id="stopBot" type="button">Parar bot</button>
          <button id="testImage" type="button">Enviar imagem teste</button>
        </div>
        <p class="hint">Antes de iniciar o bot, salve a configuracao e deixe o servidor Paper aberto com o plugin carregado.</p>
      </div>

      <div class="panel">
        <h2>Comandos Minecraft</h2>
        <div class="row">
          <button data-rcon="tiktokwall test" type="button">Testar parede</button>
          <button data-rcon="tiktokwall clear" type="button">Limpar parede</button>
          <button data-rcon="tiktokwall size 128" type="button">Size 128</button>
          <button data-rcon="tiktokwall size 256" type="button">Size 256</button>
          <button data-rcon="tiktokwall nameplate on" type="button">Nome on</button>
          <button data-rcon="tiktokwall fireworks gift" type="button">Fogos gift</button>
          <button data-rcon="tiktokwall fireworks any" type="button">Fogos sempre</button>
          <button data-rcon="tiktokwall fireworks off" type="button">Fogos off</button>
          <button data-rcon="tiktokwall dithering off" type="button">Dithering off</button>
          <button data-rcon="tiktokwall animation on" type="button">Animacao on</button>
          <button data-rcon="tiktokwall animationspeed 8" type="button">Animacao 8</button>
        </div>
        <p class="hint">Se RCON nao estiver configurado, use esses comandos dentro do Minecraft com / na frente. O setup automatico continua sendo pelo jogo: /tiktokwall setup.</p>
      </div>
    </section>

    <section class="stack">
      <div class="panel">
        <h2>Status</h2>
        <div id="message" class="message"></div>
      </div>
      <div>
        <pre id="logs"></pre>
      </div>
    </section>
  </main>

  <script>
    const form = document.getElementById("configForm");
    const message = document.getElementById("message");
    const logs = document.getElementById("logs");
    const botDot = document.getElementById("botDot");
    const botStatus = document.getElementById("botStatus");

    async function api(path, options = {}) {
      const response = await fetch(path, {
        headers: { "Content-Type": "application/json" },
        ...options
      });
      const body = await response.json();
      if (!response.ok || body.ok === false) {
        throw new Error(body.message || "Falha na requisicao");
      }
      return body;
    }

    function setMessage(text) {
      message.textContent = text;
      if (text) setTimeout(() => { if (message.textContent === text) message.textContent = ""; }, 6000);
    }

    async function loadConfig() {
      const { config } = await api("/api/config");
      for (const [key, value] of Object.entries(config)) {
        const field = form.elements.namedItem(key);
        if (!field) continue;
        if (field.type === "checkbox") {
          field.checked = String(value).toLowerCase() === "true";
        } else {
          field.value = value;
        }
      }
    }

    function collectConfig() {
      const data = {};
      for (const element of form.elements) {
        if (!element.name) continue;
        data[element.name] = element.type === "checkbox" ? element.checked : element.value;
      }
      return data;
    }

    async function refreshStatus() {
      const status = await api("/api/status");
      const running = status.bot === "running";
      botDot.classList.toggle("ok", running);
      botStatus.textContent = running ? "bot rodando" : "bot parado";
      logs.textContent = status.logs.join("\\n");
      logs.scrollTop = logs.scrollHeight;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await api("/api/config", {
        method: "POST",
        body: JSON.stringify(collectConfig())
      });
      setMessage("Configuracao salva.");
    });

    document.getElementById("healthButton").addEventListener("click", async () => {
      const result = await api("/api/plugin/health");
      setMessage("Plugin OK: " + JSON.stringify(result.health));
    });

    document.getElementById("startBot").addEventListener("click", async () => {
      await api("/api/config", {
        method: "POST",
        body: JSON.stringify(collectConfig())
      });
      await api("/api/bot/start", { method: "POST" });
      setMessage("Configuracao salva. Bot iniciado.");
      await refreshStatus();
    });

    document.getElementById("stopBot").addEventListener("click", async () => {
      await api("/api/bot/stop", { method: "POST" });
      setMessage("Pedido de parada enviado.");
      await refreshStatus();
    });

    document.getElementById("testImage").addEventListener("click", async () => {
      setMessage("Enviando imagem teste...");
      await api("/api/test-image", { method: "POST" });
      setMessage("Imagem teste enviada.");
      await refreshStatus();
    });

    document.querySelectorAll("[data-rcon]").forEach((button) => {
      button.addEventListener("click", async () => {
        const command = button.getAttribute("data-rcon");
        const result = await api("/api/rcon", {
          method: "POST",
          body: JSON.stringify({ command })
        });
        setMessage("RCON: " + (result.result || "ok"));
        await refreshStatus();
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      setMessage(event.reason?.message || String(event.reason));
    });

    loadConfig().catch((error) => setMessage(error.message));
    refreshStatus().catch(() => {});
    setInterval(() => refreshStatus().catch(() => {}), 2000);
  </script>
</body>
</html>`;
}

main().catch((error) => {
  console.error("[ui] erro fatal:", error);
  process.exitCode = 1;
});
