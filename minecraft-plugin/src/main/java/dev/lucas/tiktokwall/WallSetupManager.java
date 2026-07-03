package dev.lucas.tiktokwall;

import org.bukkit.ChatColor;
import org.bukkit.Difficulty;
import org.bukkit.GameMode;
import org.bukkit.GameRule;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.World;
import org.bukkit.block.BlockFace;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

public final class WallSetupManager implements Listener {
    private final TikTokWallPlugin plugin;
    private final WallSettings settings;
    private final WallRenderer renderer;

    public WallSetupManager(TikTokWallPlugin plugin, WallSettings settings, WallRenderer renderer) {
        this.plugin = plugin;
        this.settings = settings;
        this.renderer = renderer;
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        if (!settings.isSetupAutoOnJoin()) {
            return;
        }

        if (settings.isSetupOnlyOnce() && settings.isSetupCompleted()) {
            return;
        }

        Player player = event.getPlayer();
        plugin.getServer().getScheduler().runTaskLater(plugin, () -> setup(player, true), 30L);
    }

    public RenderResponse setup(Player player, boolean automatic) {
        if (renderer.isBusy()) {
            renderer.clear();
        }

        World world = player.getWorld();
        prepareWorld(world);

        int size = settings.getDefaultSize();
        int playerX = player.getLocation().getBlockX();
        int playerY = player.getLocation().getBlockY();
        int playerZ = player.getLocation().getBlockZ();
        int groundY = clamp(playerY - 1, world.getMinHeight() + 1, world.getMaxHeight() - size - 6);
        int wallZ = playerZ - settings.getSetupWallDistance();
        int originX = playerX - (size / 2);
        int originY = groundY + size + 1;
        int originZ = wallZ;

        int minX = originX - settings.getSetupClearPadding();
        int maxX = originX + size + settings.getSetupClearPadding();
        int minY = groundY;
        int maxY = Math.min(world.getMaxHeight() - 1, originY + 4);
        int minZ = wallZ - 4;
        int maxZ = wallZ + settings.getSetupClearDepth();

        clearVolume(world, minX, maxX, minY, maxY, minZ, maxZ);
        buildFloor(world, minX, maxX, groundY, minZ, maxZ);
        buildWall(world, originX, originY, originZ, size);

        settings.setOrigin(world.getName(), originX, originY, originZ);
        settings.setFacing(BlockFace.SOUTH);
        settings.setClearMaterial(settings.getSetupWallMaterial());
        settings.setSetupCompleted(true);

        if (settings.isSetupCreativeMode()) {
            player.setGameMode(GameMode.CREATIVE);
        }
        preparePlayer(player);

        if (settings.isSetupTeleportPlayer()) {
            Location view = new Location(world, playerX + 0.5, groundY + 1.0, wallZ + settings.getSetupWallDistance() + 0.5, 180.0F, 0.0F);
            player.teleport(view);
        }

        player.sendMessage(ChatColor.GREEN + "[TikTokWall] setup pronto. Parede criada e posicao configurada.");
        player.sendMessage(ChatColor.GRAY + "Use /tiktokwall test para testar de novo, ou rode o bot com npm run test:image.");
        plugin.getLogger().info("Setup " + (automatic ? "automatico" : "manual") + " concluido para " + player.getName());

        if (settings.isSetupRunTestAfterSetup()) {
            return renderer.renderTest();
        }

        return RenderResponse.ok("setup complete");
    }

    private void prepareWorld(World world) {
        if (!settings.isSetupPrepareWorld()) {
            return;
        }

        if (settings.isSetupAlwaysDay()) {
            world.setTime(1000L);
            world.setGameRule(GameRule.DO_DAYLIGHT_CYCLE, false);
        }

        if (settings.isSetupClearWeather()) {
            world.setStorm(false);
            world.setThundering(false);
            world.setWeatherDuration(Integer.MAX_VALUE);
            world.setThunderDuration(0);
            world.setGameRule(GameRule.DO_WEATHER_CYCLE, false);
        }

        if (settings.isSetupPeacefulDifficulty()) {
            world.setDifficulty(Difficulty.PEACEFUL);
        }

        if (settings.isSetupDisableMobSpawning()) {
            world.setGameRule(GameRule.DO_MOB_SPAWNING, false);
            world.setGameRule(GameRule.SPAWN_MONSTERS, false);
            world.setGameRule(GameRule.DO_PATROL_SPAWNING, false);
            world.setGameRule(GameRule.DO_TRADER_SPAWNING, false);
            world.setGameRule(GameRule.DISABLE_RAIDS, true);
        }

        if (settings.isSetupKeepInventory()) {
            world.setGameRule(GameRule.KEEP_INVENTORY, true);
        }

        if (settings.isSetupDisableFireSpread()) {
            world.setGameRule(GameRule.DO_FIRE_TICK, false);
        }

        if (settings.isSetupDisableMobGriefing()) {
            world.setGameRule(GameRule.MOB_GRIEFING, false);
        }

        if (settings.isSetupDisableInsomnia()) {
            world.setGameRule(GameRule.DO_INSOMNIA, false);
        }
    }

    private void preparePlayer(Player player) {
        player.setAllowFlight(true);
        player.setFlying(settings.isSetupCreativeMode());
        player.setFoodLevel(20);
        player.setSaturation(20.0F);
        player.setFireTicks(0);
        player.setFallDistance(0.0F);
    }

    private void clearVolume(World world, int minX, int maxX, int minY, int maxY, int minZ, int maxZ) {
        for (int y = minY; y <= maxY; y++) {
            for (int x = minX; x <= maxX; x++) {
                for (int z = minZ; z <= maxZ; z++) {
                    world.getBlockAt(x, y, z).setType(Material.AIR, false);
                }
            }
        }
    }

    private void buildFloor(World world, int minX, int maxX, int y, int minZ, int maxZ) {
        Material material = settings.getSetupFloorMaterial();
        for (int x = minX; x <= maxX; x++) {
            for (int z = minZ; z <= maxZ; z++) {
                world.getBlockAt(x, y, z).setType(material, false);
            }
        }
    }

    private void buildWall(World world, int originX, int originY, int originZ, int size) {
        Material wallMaterial = settings.getSetupWallMaterial();
        Material frameMaterial = settings.getSetupFrameMaterial();

        for (int y = originY - size + 1; y <= originY; y++) {
            for (int x = originX; x < originX + size; x++) {
                world.getBlockAt(x, y, originZ).setType(wallMaterial, false);
            }
        }

        int left = originX - 1;
        int right = originX + size;
        int bottom = originY - size;
        int top = originY + 1;

        for (int y = bottom; y <= top; y++) {
            world.getBlockAt(left, y, originZ).setType(frameMaterial, false);
            world.getBlockAt(right, y, originZ).setType(frameMaterial, false);
        }

        for (int x = left; x <= right; x++) {
            world.getBlockAt(x, bottom, originZ).setType(frameMaterial, false);
            world.getBlockAt(x, top, originZ).setType(frameMaterial, false);
        }
    }

    private int clamp(int value, int min, int max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }
}
