package dev.lucas.tiktokwall;

import java.util.ArrayList;
import java.util.List;
import org.bukkit.Material;

public final class BlockPalette {
    private static final List<Entry> ENTRIES = createEntries();

    private BlockPalette() {
    }

    public static Material nearest(int rgb) {
        return nearestMatch(rgb).material();
    }

    public static Match nearestMatch(int rgb) {
        int r = (rgb >> 16) & 0xff;
        int g = (rgb >> 8) & 0xff;
        int b = rgb & 0xff;
        return nearestMatch(r, g, b);
    }

    public static Match nearestMatch(int r, int g, int b) {
        int red = clampColor(r);
        int green = clampColor(g);
        int blue = clampColor(b);
        Entry best = ENTRIES.getFirst();
        long bestDistance = Long.MAX_VALUE;

        for (Entry entry : ENTRIES) {
            long dr = red - entry.r();
            long dg = green - entry.g();
            long db = blue - entry.b();
            long distance = dr * dr + dg * dg + db * db;
            if (distance < bestDistance) {
                best = entry;
                bestDistance = distance;
            }
        }

        return new Match(best.material(), best.r(), best.g(), best.b());
    }

    private static List<Entry> createEntries() {
        ArrayList<Entry> entries = new ArrayList<>();

        addConcrete(entries);
        addWool(entries);
        addTerracotta(entries);

        entry(entries, Material.QUARTZ_BLOCK, 236, 233, 226);
        entry(entries, Material.SMOOTH_QUARTZ, 236, 233, 226);
        entry(entries, Material.BONE_BLOCK, 229, 225, 207);
        entry(entries, Material.CALCITE, 224, 220, 211);
        entry(entries, Material.DIORITE, 188, 188, 184);
        entry(entries, Material.POLISHED_DIORITE, 192, 193, 190);
        entry(entries, Material.STONE, 125, 125, 125);
        entry(entries, Material.ANDESITE, 136, 136, 136);
        entry(entries, Material.POLISHED_ANDESITE, 132, 134, 133);
        entry(entries, Material.TUFF, 108, 109, 102);
        entry(entries, Material.DEEPSLATE, 80, 80, 85);
        entry(entries, Material.POLISHED_DEEPSLATE, 72, 72, 75);
        entry(entries, Material.SANDSTONE, 216, 203, 155);
        entry(entries, Material.SMOOTH_SANDSTONE, 220, 207, 162);
        entry(entries, Material.RED_SANDSTONE, 186, 99, 29);
        entry(entries, Material.SMOOTH_RED_SANDSTONE, 181, 96, 27);
        entry(entries, Material.PACKED_MUD, 142, 107, 79);
        entry(entries, Material.MUD_BRICKS, 137, 103, 79);
        entry(entries, Material.MUD, 60, 57, 54);
        entry(entries, Material.DRIPSTONE_BLOCK, 134, 107, 92);
        entry(entries, Material.BRICKS, 151, 97, 83);
        entry(entries, Material.NETHER_BRICKS, 44, 21, 26);
        entry(entries, Material.RED_NETHER_BRICKS, 101, 48, 43);
        entry(entries, Material.PRISMARINE, 99, 156, 151);
        entry(entries, Material.PRISMARINE_BRICKS, 99, 171, 158);
        entry(entries, Material.DARK_PRISMARINE, 51, 91, 75);
        entry(entries, Material.WAXED_COPPER_BLOCK, 192, 107, 79);
        entry(entries, Material.WAXED_EXPOSED_COPPER, 161, 125, 103);
        entry(entries, Material.WAXED_WEATHERED_COPPER, 109, 145, 107);
        entry(entries, Material.WAXED_OXIDIZED_COPPER, 82, 162, 132);

        return List.copyOf(entries);
    }

    private static void addConcrete(List<Entry> entries) {
        entry(entries, Material.WHITE_CONCRETE, 207, 213, 214);
        entry(entries, Material.ORANGE_CONCRETE, 224, 97, 0);
        entry(entries, Material.MAGENTA_CONCRETE, 169, 48, 159);
        entry(entries, Material.LIGHT_BLUE_CONCRETE, 36, 137, 199);
        entry(entries, Material.YELLOW_CONCRETE, 241, 175, 21);
        entry(entries, Material.LIME_CONCRETE, 94, 168, 24);
        entry(entries, Material.PINK_CONCRETE, 214, 101, 143);
        entry(entries, Material.GRAY_CONCRETE, 54, 57, 61);
        entry(entries, Material.LIGHT_GRAY_CONCRETE, 125, 125, 115);
        entry(entries, Material.CYAN_CONCRETE, 21, 119, 136);
        entry(entries, Material.PURPLE_CONCRETE, 100, 32, 156);
        entry(entries, Material.BLUE_CONCRETE, 45, 47, 143);
        entry(entries, Material.BROWN_CONCRETE, 96, 59, 31);
        entry(entries, Material.GREEN_CONCRETE, 73, 91, 36);
        entry(entries, Material.RED_CONCRETE, 142, 33, 33);
        entry(entries, Material.BLACK_CONCRETE, 8, 10, 15);
    }

    private static void addWool(List<Entry> entries) {
        entry(entries, Material.WHITE_WOOL, 233, 236, 236);
        entry(entries, Material.ORANGE_WOOL, 240, 118, 19);
        entry(entries, Material.MAGENTA_WOOL, 189, 68, 179);
        entry(entries, Material.LIGHT_BLUE_WOOL, 58, 175, 217);
        entry(entries, Material.YELLOW_WOOL, 248, 198, 39);
        entry(entries, Material.LIME_WOOL, 112, 185, 25);
        entry(entries, Material.PINK_WOOL, 237, 141, 172);
        entry(entries, Material.GRAY_WOOL, 62, 68, 71);
        entry(entries, Material.LIGHT_GRAY_WOOL, 142, 142, 134);
        entry(entries, Material.CYAN_WOOL, 21, 137, 145);
        entry(entries, Material.PURPLE_WOOL, 121, 42, 172);
        entry(entries, Material.BLUE_WOOL, 53, 57, 157);
        entry(entries, Material.BROWN_WOOL, 114, 71, 40);
        entry(entries, Material.GREEN_WOOL, 84, 109, 27);
        entry(entries, Material.RED_WOOL, 161, 39, 34);
        entry(entries, Material.BLACK_WOOL, 20, 21, 25);
    }

    private static void addTerracotta(List<Entry> entries) {
        entry(entries, Material.TERRACOTTA, 152, 94, 67);
        entry(entries, Material.WHITE_TERRACOTTA, 210, 178, 161);
        entry(entries, Material.ORANGE_TERRACOTTA, 161, 83, 37);
        entry(entries, Material.MAGENTA_TERRACOTTA, 149, 87, 108);
        entry(entries, Material.LIGHT_BLUE_TERRACOTTA, 113, 108, 137);
        entry(entries, Material.YELLOW_TERRACOTTA, 186, 133, 35);
        entry(entries, Material.LIME_TERRACOTTA, 103, 117, 53);
        entry(entries, Material.PINK_TERRACOTTA, 160, 77, 78);
        entry(entries, Material.GRAY_TERRACOTTA, 58, 42, 36);
        entry(entries, Material.LIGHT_GRAY_TERRACOTTA, 135, 107, 98);
        entry(entries, Material.CYAN_TERRACOTTA, 86, 91, 91);
        entry(entries, Material.PURPLE_TERRACOTTA, 118, 70, 86);
        entry(entries, Material.BLUE_TERRACOTTA, 74, 60, 91);
        entry(entries, Material.BROWN_TERRACOTTA, 77, 51, 36);
        entry(entries, Material.GREEN_TERRACOTTA, 76, 83, 42);
        entry(entries, Material.RED_TERRACOTTA, 143, 61, 47);
        entry(entries, Material.BLACK_TERRACOTTA, 37, 22, 16);
    }

    private static void entry(List<Entry> entries, Material material, int r, int g, int b) {
        entries.add(new Entry(material, r, g, b));
    }

    private static int clampColor(int value) {
        if (value < 0) {
            return 0;
        }
        if (value > 255) {
            return 255;
        }
        return value;
    }

    private record Entry(Material material, int r, int g, int b) {
    }

    public record Match(Material material, int r, int g, int b) {
    }
}
