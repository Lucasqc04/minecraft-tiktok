export interface RenderPayload {
  username: string;
  nickname: string;
  eventType?: string;
  eventLabel?: string;
  imageBase64: string;
  size: number;
  durationSeconds: number;
  clearAfter?: boolean;
  animate?: boolean;
}

export interface MinecraftClientOptions {
  host: string;
  port: number;
}

export class MinecraftClient {
  private readonly baseUrl: string;

  constructor(options: MinecraftClientOptions) {
    this.baseUrl = `http://${options.host}:${options.port}`;
  }

  async health(): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }

  async render(payload: RenderPayload): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}/render`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    const body = parseJsonOrText(text);

    if (!response.ok) {
      const detail = typeof body === "string" ? body : JSON.stringify(body);
      throw new Error(`Minecraft plugin rejected render (${response.status}): ${detail}`);
    }

    return body;
  }

  async test(): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}/test`, {
      method: "POST"
    });

    const text = await response.text();
    const body = parseJsonOrText(text);

    if (!response.ok) {
      const detail = typeof body === "string" ? body : JSON.stringify(body);
      throw new Error(`Minecraft plugin rejected test (${response.status}): ${detail}`);
    }

    return body;
  }
}

function parseJsonOrText(text: string): unknown {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
