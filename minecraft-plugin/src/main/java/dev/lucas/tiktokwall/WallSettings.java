package dev.lucas.tiktokwall;

import org.bukkit.Material;
import org.bukkit.block.BlockFace;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.plugin.java.JavaPlugin;

public final class WallSettings {
    private final JavaPlugin plugin;
    private String worldName;
    private int originX;
    private int originY;
    private int originZ;
    private BlockFace facing;
    private int defaultSize;
    private int durationSeconds;
    private Material clearMaterial;
    private int httpPort;
    private boolean dithering;
    private int ditheringStrength;
    private boolean animationEnabled;
    private int animationRowsPerTick;
    private boolean nameplateEnabled;
    private Material nameplateMaterial;
    private int nameplateMaxChars;
    private int nameplateYOffset;
    private String fireworksMode;
    private int fireworksCount;
    private int fireworksPower;
    private boolean setupAutoOnJoin;
    private boolean setupOnlyOnce;
    private boolean setupCompleted;
    private int setupWallDistance;
    private int setupClearPadding;
    private int setupClearDepth;
    private boolean setupCreativeMode;
    private boolean setupTeleportPlayer;
    private boolean setupRunTestAfterSetup;
    private boolean setupPrepareWorld;
    private boolean setupAlwaysDay;
    private boolean setupClearWeather;
    private boolean setupPeacefulDifficulty;
    private boolean setupDisableMobSpawning;
    private boolean setupKeepInventory;
    private boolean setupDisableFireSpread;
    private boolean setupDisableMobGriefing;
    private boolean setupDisableInsomnia;
    private Material setupFloorMaterial;
    private Material setupWallMaterial;
    private Material setupFrameMaterial;

    private WallSettings(JavaPlugin plugin) {
        this.plugin = plugin;
    }

    public static WallSettings load(JavaPlugin plugin) {
        WallSettings settings = new WallSettings(plugin);
        FileConfiguration config = plugin.getConfig();

        settings.worldName = config.getString("world", "world");
        settings.originX = config.getInt("origin.x", 0);
        settings.originY = config.getInt("origin.y", 80);
        settings.originZ = config.getInt("origin.z", 0);
        settings.facing = parseFacing(config.getString("facing", "NORTH"));
        settings.defaultSize = normalizeSize(config.getInt("defaultSize", 48));
        settings.durationSeconds = Math.max(1, config.getInt("durationSeconds", 15));
        settings.clearMaterial = parseMaterial(config.getString("clearMaterial", "AIR"), Material.AIR);
        settings.httpPort = config.getInt("httpPort", 4567);
        settings.dithering = config.getBoolean("dithering", false);
        settings.ditheringStrength = clamp(config.getInt("ditheringStrength", 18), 0, 64);
        settings.animationEnabled = config.getBoolean("animation.enabled", true);
        settings.animationRowsPerTick = clamp(config.getInt("animation.rowsPerTick", 4), 1, 32);
        settings.nameplateEnabled = config.getBoolean("nameplate.enabled", true);
        settings.nameplateMaterial = parseMaterial(config.getString("nameplate.material", "BLACK_CONCRETE"), Material.BLACK_CONCRETE);
        settings.nameplateMaxChars = clamp(config.getInt("nameplate.maxChars", 16), 4, 32);
        settings.nameplateYOffset = clamp(config.getInt("nameplate.yOffset", 3), 2, 16);
        settings.fireworksMode = normalizeFireworksMode(config.getString("fireworks.mode", "gift"));
        settings.fireworksCount = clamp(config.getInt("fireworks.count", 5), 1, 20);
        settings.fireworksPower = clamp(config.getInt("fireworks.power", 1), 0, 3);
        settings.setupAutoOnJoin = config.getBoolean("setup.autoOnJoin", true);
        settings.setupOnlyOnce = config.getBoolean("setup.onlyOnce", true);
        settings.setupCompleted = config.getBoolean("setup.completed", false);
        settings.setupWallDistance = Math.max(6, config.getInt("setup.wallDistance", 10));
        settings.setupClearPadding = Math.max(2, config.getInt("setup.clearPadding", 8));
        settings.setupClearDepth = Math.max(12, config.getInt("setup.clearDepth", 26));
        settings.setupCreativeMode = config.getBoolean("setup.creativeMode", true);
        settings.setupTeleportPlayer = config.getBoolean("setup.teleportPlayer", true);
        settings.setupRunTestAfterSetup = config.getBoolean("setup.runTestAfterSetup", true);
        settings.setupPrepareWorld = config.getBoolean("setup.prepareWorld", true);
        settings.setupAlwaysDay = config.getBoolean("setup.alwaysDay", true);
        settings.setupClearWeather = config.getBoolean("setup.clearWeather", true);
        settings.setupPeacefulDifficulty = config.getBoolean("setup.peacefulDifficulty", true);
        settings.setupDisableMobSpawning = config.getBoolean("setup.disableMobSpawning", true);
        settings.setupKeepInventory = config.getBoolean("setup.keepInventory", true);
        settings.setupDisableFireSpread = config.getBoolean("setup.disableFireSpread", true);
        settings.setupDisableMobGriefing = config.getBoolean("setup.disableMobGriefing", true);
        settings.setupDisableInsomnia = config.getBoolean("setup.disableInsomnia", true);
        settings.setupFloorMaterial = parseMaterial(config.getString("setup.floorMaterial", "SMOOTH_STONE"), Material.SMOOTH_STONE);
        settings.setupWallMaterial = parseMaterial(config.getString("setup.wallMaterial", "BLACK_CONCRETE"), Material.BLACK_CONCRETE);
        settings.setupFrameMaterial = parseMaterial(config.getString("setup.frameMaterial", "WHITE_CONCRETE"), Material.WHITE_CONCRETE);

        return settings;
    }

    public void save() {
        FileConfiguration config = plugin.getConfig();
        config.set("world", worldName);
        config.set("origin.x", originX);
        config.set("origin.y", originY);
        config.set("origin.z", originZ);
        config.set("facing", facing.name());
        config.set("defaultSize", defaultSize);
        config.set("durationSeconds", durationSeconds);
        config.set("clearMaterial", clearMaterial.name());
        config.set("httpPort", httpPort);
        config.set("dithering", dithering);
        config.set("ditheringStrength", ditheringStrength);
        config.set("animation.enabled", animationEnabled);
        config.set("animation.rowsPerTick", animationRowsPerTick);
        config.set("nameplate.enabled", nameplateEnabled);
        config.set("nameplate.material", nameplateMaterial.name());
        config.set("nameplate.maxChars", nameplateMaxChars);
        config.set("nameplate.yOffset", nameplateYOffset);
        config.set("fireworks.mode", fireworksMode);
        config.set("fireworks.count", fireworksCount);
        config.set("fireworks.power", fireworksPower);
        config.set("setup.autoOnJoin", setupAutoOnJoin);
        config.set("setup.onlyOnce", setupOnlyOnce);
        config.set("setup.completed", setupCompleted);
        config.set("setup.wallDistance", setupWallDistance);
        config.set("setup.clearPadding", setupClearPadding);
        config.set("setup.clearDepth", setupClearDepth);
        config.set("setup.creativeMode", setupCreativeMode);
        config.set("setup.teleportPlayer", setupTeleportPlayer);
        config.set("setup.runTestAfterSetup", setupRunTestAfterSetup);
        config.set("setup.prepareWorld", setupPrepareWorld);
        config.set("setup.alwaysDay", setupAlwaysDay);
        config.set("setup.clearWeather", setupClearWeather);
        config.set("setup.peacefulDifficulty", setupPeacefulDifficulty);
        config.set("setup.disableMobSpawning", setupDisableMobSpawning);
        config.set("setup.keepInventory", setupKeepInventory);
        config.set("setup.disableFireSpread", setupDisableFireSpread);
        config.set("setup.disableMobGriefing", setupDisableMobGriefing);
        config.set("setup.disableInsomnia", setupDisableInsomnia);
        config.set("setup.floorMaterial", setupFloorMaterial.name());
        config.set("setup.wallMaterial", setupWallMaterial.name());
        config.set("setup.frameMaterial", setupFrameMaterial.name());
        plugin.saveConfig();
    }

    public static int normalizeSize(int size) {
        if (size == 32 || size == 48 || size == 64 || size == 128 || size == 256) {
            return size;
        }
        return 128;
    }

    public static String normalizeFireworksMode(String value) {
        if (value == null) {
            return "gift";
        }

        String normalized = value.trim().toLowerCase();
        if (normalized.equals("off") || normalized.equals("like") || normalized.equals("gift") || normalized.equals("any")) {
            return normalized;
        }

        return "gift";
    }

    public static BlockFace parseFacing(String value) {
        if (value == null) {
            return BlockFace.NORTH;
        }

        try {
            BlockFace face = BlockFace.valueOf(value.trim().toUpperCase());
            if (face == BlockFace.NORTH || face == BlockFace.SOUTH || face == BlockFace.EAST || face == BlockFace.WEST) {
                return face;
            }
        } catch (IllegalArgumentException ignored) {
            return BlockFace.NORTH;
        }

        return BlockFace.NORTH;
    }

    private static Material parseMaterial(String value, Material fallback) {
        if (value == null) {
            return fallback;
        }

        Material material = Material.matchMaterial(value.trim().toUpperCase());
        if (material == null || !material.isBlock()) {
            return fallback;
        }
        return material;
    }

    private static int clamp(int value, int min, int max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }

    public String getWorldName() {
        return worldName;
    }

    public int getOriginX() {
        return originX;
    }

    public int getOriginY() {
        return originY;
    }

    public int getOriginZ() {
        return originZ;
    }

    public BlockFace getFacing() {
        return facing;
    }

    public int getDefaultSize() {
        return defaultSize;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public Material getClearMaterial() {
        return clearMaterial;
    }

    public int getHttpPort() {
        return httpPort;
    }

    public boolean isDithering() {
        return dithering;
    }

    public int getDitheringStrength() {
        return ditheringStrength;
    }

    public boolean isAnimationEnabled() {
        return animationEnabled;
    }

    public int getAnimationRowsPerTick() {
        return animationRowsPerTick;
    }

    public boolean isNameplateEnabled() {
        return nameplateEnabled;
    }

    public Material getNameplateMaterial() {
        return nameplateMaterial;
    }

    public int getNameplateMaxChars() {
        return nameplateMaxChars;
    }

    public int getNameplateYOffset() {
        return nameplateYOffset;
    }

    public String getFireworksMode() {
        return fireworksMode;
    }

    public int getFireworksCount() {
        return fireworksCount;
    }

    public int getFireworksPower() {
        return fireworksPower;
    }

    public boolean isSetupAutoOnJoin() {
        return setupAutoOnJoin;
    }

    public boolean isSetupOnlyOnce() {
        return setupOnlyOnce;
    }

    public boolean isSetupCompleted() {
        return setupCompleted;
    }

    public int getSetupWallDistance() {
        return setupWallDistance;
    }

    public int getSetupClearPadding() {
        return setupClearPadding;
    }

    public int getSetupClearDepth() {
        return setupClearDepth;
    }

    public boolean isSetupCreativeMode() {
        return setupCreativeMode;
    }

    public boolean isSetupTeleportPlayer() {
        return setupTeleportPlayer;
    }

    public boolean isSetupRunTestAfterSetup() {
        return setupRunTestAfterSetup;
    }

    public boolean isSetupPrepareWorld() {
        return setupPrepareWorld;
    }

    public boolean isSetupAlwaysDay() {
        return setupAlwaysDay;
    }

    public boolean isSetupClearWeather() {
        return setupClearWeather;
    }

    public boolean isSetupPeacefulDifficulty() {
        return setupPeacefulDifficulty;
    }

    public boolean isSetupDisableMobSpawning() {
        return setupDisableMobSpawning;
    }

    public boolean isSetupKeepInventory() {
        return setupKeepInventory;
    }

    public boolean isSetupDisableFireSpread() {
        return setupDisableFireSpread;
    }

    public boolean isSetupDisableMobGriefing() {
        return setupDisableMobGriefing;
    }

    public boolean isSetupDisableInsomnia() {
        return setupDisableInsomnia;
    }

    public Material getSetupFloorMaterial() {
        return setupFloorMaterial;
    }

    public Material getSetupWallMaterial() {
        return setupWallMaterial;
    }

    public Material getSetupFrameMaterial() {
        return setupFrameMaterial;
    }

    public void setOrigin(String worldName, int originX, int originY, int originZ) {
        this.worldName = worldName;
        this.originX = originX;
        this.originY = originY;
        this.originZ = originZ;
        save();
    }

    public void setFacing(BlockFace facing) {
        this.facing = facing;
        save();
    }

    public void setDefaultSize(int defaultSize) {
        this.defaultSize = normalizeSize(defaultSize);
        save();
    }

    public void setClearMaterial(Material clearMaterial) {
        this.clearMaterial = clearMaterial;
        save();
    }

    public void setDithering(boolean dithering) {
        this.dithering = dithering;
        save();
    }

    public void setDitheringStrength(int ditheringStrength) {
        this.ditheringStrength = clamp(ditheringStrength, 0, 64);
        save();
    }

    public void setAnimationEnabled(boolean animationEnabled) {
        this.animationEnabled = animationEnabled;
        save();
    }

    public void setAnimationRowsPerTick(int animationRowsPerTick) {
        this.animationRowsPerTick = clamp(animationRowsPerTick, 1, 32);
        save();
    }

    public void setNameplateEnabled(boolean nameplateEnabled) {
        this.nameplateEnabled = nameplateEnabled;
        save();
    }

    public void setNameplateMaterial(Material nameplateMaterial) {
        this.nameplateMaterial = nameplateMaterial;
        save();
    }

    public void setFireworksMode(String fireworksMode) {
        this.fireworksMode = normalizeFireworksMode(fireworksMode);
        save();
    }

    public void setFireworksCount(int fireworksCount) {
        this.fireworksCount = clamp(fireworksCount, 1, 20);
        save();
    }

    public void setFireworksPower(int fireworksPower) {
        this.fireworksPower = clamp(fireworksPower, 0, 3);
        save();
    }

    public void setSetupCompleted(boolean setupCompleted) {
        this.setupCompleted = setupCompleted;
        save();
    }
}
