package dev.lucas.tiktokwall;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.bukkit.plugin.java.JavaPlugin;

public final class WallHttpServer {
    private final JavaPlugin plugin;
    private final WallRenderer renderer;
    private final Gson gson = new Gson();
    private final HttpServer server;
    private final ExecutorService executor;

    public WallHttpServer(JavaPlugin plugin, WallRenderer renderer, int port) throws IOException {
        this.plugin = plugin;
        this.renderer = renderer;
        this.server = HttpServer.create(new InetSocketAddress("127.0.0.1", port), 0);
        this.executor = Executors.newFixedThreadPool(2);

        server.createContext("/health", this::handleHealth);
        server.createContext("/render", this::handleRender);
        server.createContext("/test", this::handleTest);
        server.setExecutor(executor);
    }

    public void start() {
        server.start();
    }

    public void stop() {
        server.stop(1);
        executor.shutdownNow();
    }

    private void handleHealth(HttpExchange exchange) throws IOException {
        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, error("method not allowed"));
            return;
        }

        JsonObject response = new JsonObject();
        response.addProperty("ok", true);
        response.addProperty("plugin", "TikTokWall");
        response.addProperty("version", plugin.getDescription().getVersion());
        response.addProperty("busy", renderer.isBusy());
        sendJson(exchange, 200, response);
    }

    private void handleRender(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, error("method not allowed"));
            return;
        }

        try {
            String body = readBody(exchange);
            RenderRequest request = gson.fromJson(body, RenderRequest.class);
            if (request == null) {
                sendJson(exchange, 400, error("invalid json body"));
                return;
            }

            RenderResponse response = renderer.renderBlocking(request);
            int status = response.ok() ? 200 : response.busy() ? 409 : 400;
            sendJson(exchange, status, response);
        } catch (Exception error) {
            plugin.getLogger().warning("HTTP /render failed: " + error.getMessage());
            sendJson(exchange, 500, error(error.getMessage()));
        }
    }

    private void handleTest(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, error("method not allowed"));
            return;
        }

        try {
            RenderResponse response = renderer.renderTestBlocking();
            int status = response.ok() ? 200 : response.busy() ? 409 : 400;
            sendJson(exchange, status, response);
        } catch (Exception error) {
            plugin.getLogger().warning("HTTP /test failed: " + error.getMessage());
            sendJson(exchange, 500, error(error.getMessage()));
        }
    }

    private String readBody(HttpExchange exchange) throws IOException {
        try (InputStream input = exchange.getRequestBody()) {
            return new String(input.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private void sendJson(HttpExchange exchange, int status, Object body) throws IOException {
        byte[] bytes = gson.toJson(body).getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(bytes);
        }
    }

    private JsonObject error(String message) {
        JsonObject response = new JsonObject();
        response.addProperty("ok", false);
        response.addProperty("message", message == null ? "unknown error" : message);
        return response;
    }
}
