package dev.lucas.tiktokwall;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.text.Normalizer;
import java.util.Base64;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import javax.imageio.ImageIO;
import net.kyori.adventure.text.Component;
import org.bukkit.Bukkit;
import org.bukkit.FireworkEffect;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.World;
import org.bukkit.block.Block;
import org.bukkit.block.BlockFace;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.Firework;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.scheduler.BukkitTask;
import org.bukkit.inventory.meta.FireworkMeta;

public final class WallRenderer {
    private static final int[][] BAYER_4X4 = {
        {0, 8, 2, 10},
        {12, 4, 14, 6},
        {3, 11, 1, 9},
        {15, 7, 13, 5}
    };
    private static final int FONT_HEIGHT = 7;
    private static final int FONT_WIDTH = 5;
    private static final int FONT_GAP = 1;
    private static final Map<Character, String[]> FONT = Map.ofEntries(
        Map.entry('A', new String[] {"01110", "10001", "10001", "11111", "10001", "10001", "10001"}),
        Map.entry('B', new String[] {"11110", "10001", "10001", "11110", "10001", "10001", "11110"}),
        Map.entry('C', new String[] {"01111", "10000", "10000", "10000", "10000", "10000", "01111"}),
        Map.entry('D', new String[] {"11110", "10001", "10001", "10001", "10001", "10001", "11110"}),
        Map.entry('E', new String[] {"11111", "10000", "10000", "11110", "10000", "10000", "11111"}),
        Map.entry('F', new String[] {"11111", "10000", "10000", "11110", "10000", "10000", "10000"}),
        Map.entry('G', new String[] {"01111", "10000", "10000", "10111", "10001", "10001", "01111"}),
        Map.entry('H', new String[] {"10001", "10001", "10001", "11111", "10001", "10001", "10001"}),
        Map.entry('I', new String[] {"11111", "00100", "00100", "00100", "00100", "00100", "11111"}),
        Map.entry('J', new String[] {"00111", "00010", "00010", "00010", "10010", "10010", "01100"}),
        Map.entry('K', new String[] {"10001", "10010", "10100", "11000", "10100", "10010", "10001"}),
        Map.entry('L', new String[] {"10000", "10000", "10000", "10000", "10000", "10000", "11111"}),
        Map.entry('M', new String[] {"10001", "11011", "10101", "10101", "10001", "10001", "10001"}),
        Map.entry('N', new String[] {"10001", "11001", "10101", "10011", "10001", "10001", "10001"}),
        Map.entry('O', new String[] {"01110", "10001", "10001", "10001", "10001", "10001", "01110"}),
        Map.entry('P', new String[] {"11110", "10001", "10001", "11110", "10000", "10000", "10000"}),
        Map.entry('Q', new String[] {"01110", "10001", "10001", "10001", "10101", "10010", "01101"}),
        Map.entry('R', new String[] {"11110", "10001", "10001", "11110", "10100", "10010", "10001"}),
        Map.entry('S', new String[] {"01111", "10000", "10000", "01110", "00001", "00001", "11110"}),
        Map.entry('T', new String[] {"11111", "00100", "00100", "00100", "00100", "00100", "00100"}),
        Map.entry('U', new String[] {"10001", "10001", "10001", "10001", "10001", "10001", "01110"}),
        Map.entry('V', new String[] {"10001", "10001", "10001", "10001", "10001", "01010", "00100"}),
        Map.entry('W', new String[] {"10001", "10001", "10001", "10101", "10101", "10101", "01010"}),
        Map.entry('X', new String[] {"10001", "10001", "01010", "00100", "01010", "10001", "10001"}),
        Map.entry('Y', new String[] {"10001", "10001", "01010", "00100", "00100", "00100", "00100"}),
        Map.entry('Z', new String[] {"11111", "00001", "00010", "00100", "01000", "10000", "11111"}),
        Map.entry('0', new String[] {"01110", "10001", "10011", "10101", "11001", "10001", "01110"}),
        Map.entry('1', new String[] {"00100", "01100", "00100", "00100", "00100", "00100", "01110"}),
        Map.entry('2', new String[] {"01110", "10001", "00001", "00010", "00100", "01000", "11111"}),
        Map.entry('3', new String[] {"11110", "00001", "00001", "01110", "00001", "00001", "11110"}),
        Map.entry('4', new String[] {"00010", "00110", "01010", "10010", "11111", "00010", "00010"}),
        Map.entry('5', new String[] {"11111", "10000", "10000", "11110", "00001", "00001", "11110"}),
        Map.entry('6', new String[] {"01110", "10000", "10000", "11110", "10001", "10001", "01110"}),
        Map.entry('7', new String[] {"11111", "00001", "00010", "00100", "01000", "01000", "01000"}),
        Map.entry('8', new String[] {"01110", "10001", "10001", "01110", "10001", "10001", "01110"}),
        Map.entry('9', new String[] {"01110", "10001", "10001", "01111", "00001", "00001", "01110"}),
        Map.entry('_', new String[] {"00000", "00000", "00000", "00000", "00000", "00000", "11111"}),
        Map.entry('-', new String[] {"00000", "00000", "00000", "11111", "00000", "00000", "00000"}),
        Map.entry(' ', new String[] {"00000", "00000", "00000", "00000", "00000", "00000", "00000"})
    );

    private final JavaPlugin plugin;
    private final WallSettings settings;
    private volatile ActiveFrame activeFrame;
    private BukkitTask animationTask;
    private BukkitTask clearTask;

    public WallRenderer(JavaPlugin plugin, WallSettings settings) {
        this.plugin = plugin;
        this.settings = settings;
    }

    public RenderResponse renderBlocking(RenderRequest request) {
        CompletableFuture<RenderResponse> future = new CompletableFuture<>();
        Bukkit.getScheduler().runTask(plugin, () -> future.complete(renderOnMainThread(request)));

        try {
            return future.get(30, TimeUnit.SECONDS);
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            return RenderResponse.error("render interrupted");
        } catch (ExecutionException | TimeoutException error) {
            return RenderResponse.error("render failed: " + error.getMessage());
        }
    }

    public RenderResponse renderTestBlocking() {
        CompletableFuture<RenderResponse> future = new CompletableFuture<>();
        Bukkit.getScheduler().runTask(plugin, () -> future.complete(renderTest()));

        try {
            return future.get(30, TimeUnit.SECONDS);
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            return RenderResponse.error("test interrupted");
        } catch (ExecutionException | TimeoutException error) {
            return RenderResponse.error("test failed: " + error.getMessage());
        }
    }

    public RenderResponse renderTest() {
        ensureMainThread();
        RenderRequest request = new TestRenderRequest(createTestImageBase64(settings.getDefaultSize()), settings.getDefaultSize());
        return renderOnMainThread(request);
    }

    public RenderResponse clear() {
        ensureMainThread();
        if (clearTask != null) {
            clearTask.cancel();
            clearTask = null;
        }
        cancelAnimationTask();

        ActiveFrame frame = activeFrame;
        if (frame == null) {
            frame = ActiveFrame.fromSettings(settings, settings.getDefaultSize());
        }

        clearFrame(frame);
        activeFrame = null;
        return RenderResponse.ok("wall cleared");
    }

    public boolean isBusy() {
        return activeFrame != null;
    }

    private RenderResponse renderOnMainThread(RenderRequest request) {
        ensureMainThread();

        if (activeFrame != null) {
            return RenderResponse.busyResponse();
        }

        World world = Bukkit.getWorld(settings.getWorldName());
        if (world == null) {
            return RenderResponse.error("world not found: " + settings.getWorldName());
        }

        int size = request.size(settings.getDefaultSize());
        int durationSeconds = request.durationSeconds(settings.getDurationSeconds());

        try {
            BufferedImage image = decodeImage(request.imageBase64(), size);
            ActiveFrame frame = ActiveFrame.fromSettings(settings, size);

            activeFrame = frame;
            long animationTicks = renderImage(world, frame, image);
            renderNameplate(world, frame, request.nickname());
            launchFireworks(world, frame, request.eventType());

            Bukkit.broadcast(Component.text("[TikTokWall] " + request.nickname() + " " + request.eventLabel()));
            plugin.getLogger().info("Rendered " + request.eventType() + " avatar for "
                + request.username() + " (" + request.nickname() + ")");

            if (request.clearAfter()) {
                long durationTicks = durationSeconds * 20L;
                long clearAnimationTicks = settings.isAnimationEnabled() ? animationTicksFor(frame.size()) : 0L;
                long clearDelayTicks = Math.max(animationTicks + 1L, durationTicks - clearAnimationTicks);
                clearTask = Bukkit.getScheduler().runTaskLater(plugin, () -> {
                    clearTask = null;
                    clearFrameWithConfiguredAnimation(frame, () -> activeFrame = null);
                }, clearDelayTicks);
            } else {
                Bukkit.getScheduler().runTaskLater(plugin, () -> {
                    if (activeFrame == frame) {
                        activeFrame = null;
                    }
                }, animationTicks + 1L);
            }

            return RenderResponse.ok("rendered");
        } catch (Exception error) {
            plugin.getLogger().warning("Render failed: " + error.getMessage());
            return RenderResponse.error(error.getMessage());
        }
    }

    private long renderImage(World world, ActiveFrame frame, BufferedImage image) {
        Material[][] materials = settings.isDithering()
            ? imageToMaterialsDithered(image, frame.size())
            : imageToMaterialsNearest(image, frame.size());

        if (!settings.isAnimationEnabled()) {
            applyMaterials(world, frame, materials);
            return 0L;
        }

        animateMaterials(world, frame, materials);
        return animationTicksFor(frame.size());
    }

    private Material[][] imageToMaterialsNearest(BufferedImage image, int size) {
        Material[][] materials = new Material[size][size];
        for (int pixelY = 0; pixelY < size; pixelY++) {
            for (int pixelX = 0; pixelX < size; pixelX++) {
                int argb = image.getRGB(pixelX, pixelY);
                int alpha = (argb >> 24) & 0xff;
                materials[pixelY][pixelX] = alpha < 20 ? Material.AIR : BlockPalette.nearest(argb);
            }
        }
        return materials;
    }

    private Material[][] imageToMaterialsDithered(BufferedImage image, int size) {
        Material[][] materials = new Material[size][size];
        int strength = settings.getDitheringStrength();

        for (int pixelY = 0; pixelY < size; pixelY++) {
            for (int pixelX = 0; pixelX < size; pixelX++) {
                int argb = image.getRGB(pixelX, pixelY);
                int alpha = (argb >> 24) & 0xff;
                if (alpha < 20) {
                    materials[pixelY][pixelX] = Material.AIR;
                    continue;
                }

                int threshold = BAYER_4X4[pixelY & 3][pixelX & 3];
                double offset = (((threshold + 0.5) / 16.0) - 0.5) * strength * 2.0;
                int red = clampColor(((argb >> 16) & 0xff) + offset);
                int green = clampColor(((argb >> 8) & 0xff) + offset);
                int blue = clampColor((argb & 0xff) + offset);
                materials[pixelY][pixelX] = BlockPalette.nearestMatch(red, green, blue).material();
            }
        }

        return materials;
    }

    private void applyMaterials(World world, ActiveFrame frame, Material[][] materials) {
        for (int pixelY = 0; pixelY < frame.size(); pixelY++) {
            setMaterialRow(world, frame, materials, pixelY);
        }
    }

    private void animateMaterials(World world, ActiveFrame frame, Material[][] materials) {
        cancelAnimationTask();

        animationTask = new BukkitRunnable() {
            private int nextRow = 0;

            @Override
            public void run() {
                int rowsThisTick = settings.getAnimationRowsPerTick();
                for (int rowCount = 0; rowCount < rowsThisTick && nextRow < frame.size(); rowCount++) {
                    setMaterialRow(world, frame, materials, nextRow);
                    nextRow++;
                }

                if (nextRow >= frame.size()) {
                    cancel();
                    animationTask = null;
                }
            }
        }.runTaskTimer(plugin, 0L, 1L);
    }

    private void setMaterialRow(World world, ActiveFrame frame, Material[][] materials, int pixelY) {
        for (int pixelX = 0; pixelX < frame.size(); pixelX++) {
            blockAt(world, frame, pixelX, pixelY).setType(materials[pixelY][pixelX], false);
        }
    }

    private long animationTicksFor(int size) {
        int rowsPerTick = settings.getAnimationRowsPerTick();
        return Math.max(1L, (size + rowsPerTick - 1L) / rowsPerTick);
    }

    private int clampColor(double value) {
        if (value < 0.0) {
            return 0;
        }
        if (value > 255.0) {
            return 255;
        }
        return (int) Math.round(value);
    }

    private void renderNameplate(World world, ActiveFrame frame, String rawName) {
        if (!settings.isNameplateEnabled()) {
            return;
        }

        clearNameplateArea(world, frame);

        String text = normalizeNameplateText(rawName);
        if (text.isBlank()) {
            return;
        }

        int textWidth = text.length() * FONT_WIDTH + Math.max(0, text.length() - 1) * FONT_GAP;
        int startX = Math.max(0, (frame.size() - textWidth) / 2);
        int baseY = frame.originY() + settings.getNameplateYOffset();

        for (int charIndex = 0; charIndex < text.length(); charIndex++) {
            String[] glyph = FONT.getOrDefault(text.charAt(charIndex), FONT.get(' '));
            int charX = startX + charIndex * (FONT_WIDTH + FONT_GAP);
            for (int row = 0; row < FONT_HEIGHT; row++) {
                String pattern = glyph[row];
                int y = baseY + (FONT_HEIGHT - 1 - row);
                for (int col = 0; col < FONT_WIDTH; col++) {
                    if (pattern.charAt(col) == '1') {
                        setWallRelativeBlock(world, frame, charX + col, y, settings.getNameplateMaterial());
                    }
                }
            }
        }
    }

    private void clearNameplateArea(World world, ActiveFrame frame) {
        int baseY = frame.originY() + settings.getNameplateYOffset();
        for (int y = baseY; y < baseY + FONT_HEIGHT; y++) {
            for (int horizontal = 0; horizontal < frame.size(); horizontal++) {
                setWallRelativeBlock(world, frame, horizontal, y, Material.AIR);
            }
        }
    }

    private String normalizeNameplateText(String value) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "")
            .toUpperCase(Locale.ROOT)
            .replaceAll("[^A-Z0-9_\\- ]", "")
            .trim();

        if (normalized.length() > settings.getNameplateMaxChars()) {
            return normalized.substring(0, settings.getNameplateMaxChars()).trim();
        }

        return normalized;
    }

    private void launchFireworks(World world, ActiveFrame frame, String eventType) {
        if (!shouldLaunchFireworks(eventType)) {
            return;
        }

        ThreadLocalRandom random = ThreadLocalRandom.current();
        for (int index = 0; index < settings.getFireworksCount(); index++) {
            int horizontal = random.nextInt(Math.max(1, frame.size()));
            Location location = fireworkLocation(world, frame, horizontal, random.nextDouble(2.0, 8.0));
            Firework firework = (Firework) world.spawnEntity(location, EntityType.FIREWORK_ROCKET);
            FireworkMeta meta = firework.getFireworkMeta();
            meta.setPower(settings.getFireworksPower());
            meta.addEffect(FireworkEffect.builder()
                .with(FireworkEffect.Type.BALL_LARGE)
                .withColor(org.bukkit.Color.fromRGB(random.nextInt(80, 256), random.nextInt(80, 256), random.nextInt(80, 256)))
                .withFade(org.bukkit.Color.WHITE)
                .trail(true)
                .flicker(true)
                .build());
            firework.setFireworkMeta(meta);
        }
    }

    private boolean shouldLaunchFireworks(String eventType) {
        String mode = settings.getFireworksMode();
        if ("off".equals(mode)) {
            return false;
        }
        if ("any".equals(mode)) {
            return true;
        }

        String normalized = eventType == null ? "" : eventType.toLowerCase(Locale.ROOT);
        boolean like = normalized.contains("like");
        boolean gift = normalized.contains("gift") || normalized.contains("rose") || normalized.contains("rosa");

        return ("like".equals(mode) && like) || ("gift".equals(mode) && gift);
    }

    private Location fireworkLocation(World world, ActiveFrame frame, int horizontal, double yOffset) {
        double x = frame.originX() + 0.5;
        double y = Math.min(world.getMaxHeight() - 2.0, frame.originY() + yOffset);
        double z = frame.originZ() + 0.5;

        switch (frame.facing()) {
            case NORTH -> {
                x -= horizontal;
                z += 4.0;
            }
            case SOUTH -> {
                x += horizontal;
                z -= 4.0;
            }
            case EAST -> {
                z -= horizontal;
                x -= 4.0;
            }
            case WEST -> {
                z += horizontal;
                x += 4.0;
            }
            default -> x += horizontal;
        }

        return new Location(world, x, y, z);
    }

    private void clearFrame(ActiveFrame frame) {
        World world = Bukkit.getWorld(frame.worldName());
        if (world == null) {
            plugin.getLogger().warning("Cannot clear wall, world not found: " + frame.worldName());
            return;
        }

        for (int pixelY = 0; pixelY < frame.size(); pixelY++) {
            for (int pixelX = 0; pixelX < frame.size(); pixelX++) {
                blockAt(world, frame, pixelX, pixelY).setType(frame.clearMaterial(), false);
            }
        }
        clearNameplateArea(world, frame);
    }

    private void clearFrameWithConfiguredAnimation(ActiveFrame frame, Runnable onDone) {
        if (!settings.isAnimationEnabled()) {
            clearFrame(frame);
            onDone.run();
            return;
        }

        World world = Bukkit.getWorld(frame.worldName());
        if (world == null) {
            plugin.getLogger().warning("Cannot clear wall, world not found: " + frame.worldName());
            onDone.run();
            return;
        }

        cancelAnimationTask();

        animationTask = new BukkitRunnable() {
            private int nextRow = frame.size() - 1;

            @Override
            public void run() {
                int rowsThisTick = settings.getAnimationRowsPerTick();
                for (int rowCount = 0; rowCount < rowsThisTick && nextRow >= 0; rowCount++) {
                    clearRow(world, frame, nextRow);
                    nextRow--;
                }

                if (nextRow < 0) {
                    cancel();
                    animationTask = null;
                    onDone.run();
                }
            }
        }.runTaskTimer(plugin, 0L, 1L);
    }

    private void clearRow(World world, ActiveFrame frame, int pixelY) {
        for (int pixelX = 0; pixelX < frame.size(); pixelX++) {
            blockAt(world, frame, pixelX, pixelY).setType(frame.clearMaterial(), false);
        }
    }

    private void cancelAnimationTask() {
        if (animationTask != null) {
            animationTask.cancel();
            animationTask = null;
        }
    }

    private void setWallRelativeBlock(World world, ActiveFrame frame, int horizontal, int y, Material material) {
        if (horizontal < 0 || horizontal >= frame.size() || y < world.getMinHeight() || y >= world.getMaxHeight()) {
            return;
        }

        int x = frame.originX();
        int z = frame.originZ();

        switch (frame.facing()) {
            case NORTH -> x -= horizontal;
            case SOUTH -> x += horizontal;
            case EAST -> z -= horizontal;
            case WEST -> z += horizontal;
            default -> x += horizontal;
        }

        world.getBlockAt(x, y, z).setType(material, false);
    }

    private Block blockAt(World world, ActiveFrame frame, int pixelX, int pixelY) {
        int x = frame.originX();
        int y = frame.originY() - pixelY;
        int z = frame.originZ();

        switch (frame.facing()) {
            case NORTH -> x -= pixelX;
            case SOUTH -> x += pixelX;
            case EAST -> z -= pixelX;
            case WEST -> z += pixelX;
            default -> x += pixelX;
        }

        return world.getBlockAt(x, y, z);
    }

    private BufferedImage decodeImage(String imageBase64, int size) throws Exception {
        if (imageBase64 == null || imageBase64.isBlank()) {
            throw new IllegalArgumentException("imageBase64 is required");
        }

        String clean = imageBase64;
        int comma = clean.indexOf(',');
        if (clean.startsWith("data:image") && comma >= 0) {
            clean = clean.substring(comma + 1);
        }

        byte[] bytes = Base64.getDecoder().decode(clean);
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(bytes));
        if (image == null) {
            throw new IllegalArgumentException("imageBase64 is not a valid image");
        }
        if (image.getWidth() != size || image.getHeight() != size) {
            throw new IllegalArgumentException("image must be " + size + "x" + size + " pixels");
        }

        return image;
    }

    private String createTestImageBase64(int size) {
        try {
            BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
            Graphics2D graphics = image.createGraphics();
            for (int y = 0; y < size; y++) {
                for (int x = 0; x < size; x++) {
                    float hue = (float) x / Math.max(1, size - 1);
                    float brightness = 0.45f + (0.55f * y / Math.max(1, size - 1));
                    image.setRGB(x, y, Color.HSBtoRGB(hue, 0.85f, brightness));
                }
            }
            graphics.dispose();

            java.io.ByteArrayOutputStream output = new java.io.ByteArrayOutputStream();
            ImageIO.write(image, "png", output);
            return Base64.getEncoder().encodeToString(output.toByteArray());
        } catch (Exception error) {
            throw new IllegalStateException("failed to create test image", error);
        }
    }

    private void ensureMainThread() {
        if (!Bukkit.isPrimaryThread()) {
            throw new IllegalStateException("WallRenderer must run on the server main thread");
        }
    }

    private record ActiveFrame(
        String worldName,
        int originX,
        int originY,
        int originZ,
        BlockFace facing,
        int size,
        Material clearMaterial
    ) {
        static ActiveFrame fromSettings(WallSettings settings, int size) {
            return new ActiveFrame(
                settings.getWorldName(),
                settings.getOriginX(),
                settings.getOriginY(),
                settings.getOriginZ(),
                settings.getFacing(),
                size,
                settings.getClearMaterial()
            );
        }
    }

    private static final class TestRenderRequest extends RenderRequest {
        private final String imageBase64;
        private final int size;

        private TestRenderRequest(String imageBase64, int size) {
            this.imageBase64 = imageBase64;
            this.size = size;
        }

        @Override
        public String username() {
            return "test";
        }

        @Override
        public String nickname() {
            return "Teste";
        }

        @Override
        public String eventType() {
            return "test";
        }

        @Override
        public String eventLabel() {
            return "renderizou um teste";
        }

        @Override
        public String imageBase64() {
            return imageBase64;
        }

        @Override
        public int size(int fallback) {
            return size;
        }
    }
}
