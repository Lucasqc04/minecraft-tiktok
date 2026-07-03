package dev.lucas.tiktokwall;

import java.io.IOException;
import org.bukkit.command.PluginCommand;
import org.bukkit.plugin.java.JavaPlugin;

public final class TikTokWallPlugin extends JavaPlugin {
    private WallSettings settings;
    private WallRenderer renderer;
    private WallSetupManager setupManager;
    private WallHttpServer httpServer;

    @Override
    public void onEnable() {
        saveDefaultConfig();

        this.settings = WallSettings.load(this);
        this.renderer = new WallRenderer(this, settings);
        this.setupManager = new WallSetupManager(this, settings, renderer);

        PluginCommand command = getCommand("tiktokwall");
        if (command != null) {
            TikTokWallCommand executor = new TikTokWallCommand(this, settings, renderer, setupManager);
            command.setExecutor(executor);
            command.setTabCompleter(executor);
        }

        getServer().getPluginManager().registerEvents(setupManager, this);

        try {
            this.httpServer = new WallHttpServer(this, renderer, settings.getHttpPort());
            this.httpServer.start();
            getLogger().info("HTTP server listening on 127.0.0.1:" + settings.getHttpPort());
        } catch (IOException error) {
            getLogger().severe("Failed to start HTTP server: " + error.getMessage());
            getServer().getPluginManager().disablePlugin(this);
        }
    }

    @Override
    public void onDisable() {
        if (httpServer != null) {
            httpServer.stop();
        }
    }
}
