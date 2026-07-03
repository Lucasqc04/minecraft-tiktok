package dev.lucas.tiktokwall;

import java.util.ArrayList;
import java.util.List;
import org.bukkit.ChatColor;
import org.bukkit.block.Block;
import org.bukkit.block.BlockFace;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;

public final class TikTokWallCommand implements CommandExecutor, TabCompleter {
    private static final List<String> SUBCOMMANDS = List.of(
        "setup",
        "setpos",
        "clear",
        "test",
        "size",
        "info",
        "facing",
        "dithering",
        "ditheringstrength",
        "animation",
        "animationspeed"
    );
    private static final List<String> SIZES = List.of("32", "48", "64", "128");
    private static final List<String> FACINGS = List.of("NORTH", "SOUTH", "EAST", "WEST");
    private static final List<String> TOGGLES = List.of("on", "off");
    private static final List<String> DITHERING_STRENGTHS = List.of("0", "8", "12", "18", "24", "32");
    private static final List<String> ANIMATION_SPEEDS = List.of("1", "2", "4", "8", "16", "32");

    private final TikTokWallPlugin plugin;
    private final WallSettings settings;
    private final WallRenderer renderer;
    private final WallSetupManager setupManager;

    public TikTokWallCommand(TikTokWallPlugin plugin, WallSettings settings, WallRenderer renderer, WallSetupManager setupManager) {
        this.plugin = plugin;
        this.settings = settings;
        this.renderer = renderer;
        this.setupManager = setupManager;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            sendUsage(sender);
            return true;
        }

        switch (args[0].toLowerCase()) {
            case "setup" -> handleSetup(sender);
            case "setpos" -> handleSetPos(sender);
            case "clear" -> handleClear(sender);
            case "test" -> handleTest(sender);
            case "size" -> handleSize(sender, args);
            case "info" -> handleInfo(sender);
            case "facing" -> handleFacing(sender, args);
            case "dithering" -> handleDithering(sender, args);
            case "ditheringstrength" -> handleDitheringStrength(sender, args);
            case "animation" -> handleAnimation(sender, args);
            case "animationspeed" -> handleAnimationSpeed(sender, args);
            default -> sendUsage(sender);
        }

        return true;
    }

    private void handleSetup(CommandSender sender) {
        if (!(sender instanceof Player player)) {
            sender.sendMessage(ChatColor.RED + "Apenas jogadores podem usar /tiktokwall setup.");
            return;
        }

        RenderResponse response = setupManager.setup(player, false);
        sender.sendMessage(formatResponse(response));
    }

    private void handleSetPos(CommandSender sender) {
        if (!(sender instanceof Player player)) {
            sender.sendMessage(ChatColor.RED + "Apenas jogadores podem usar /tiktokwall setpos.");
            return;
        }

        Block target = player.getTargetBlockExact(100);
        if (target == null) {
            player.sendMessage(ChatColor.RED + "Olhe para o bloco que sera o canto superior esquerdo da parede.");
            return;
        }

        settings.setOrigin(target.getWorld().getName(), target.getX(), target.getY(), target.getZ());
        player.sendMessage(ChatColor.GREEN + "Origem da TikTokWall definida em "
            + target.getWorld().getName() + " "
            + target.getX() + ", " + target.getY() + ", " + target.getZ() + ".");
        player.sendMessage(ChatColor.GRAY + "Pixel (0,0) usa esse bloco. A imagem cresce para baixo.");
    }

    private void handleClear(CommandSender sender) {
        RenderResponse response = renderer.clear();
        sender.sendMessage(formatResponse(response));
    }

    private void handleTest(CommandSender sender) {
        RenderResponse response = renderer.renderTest();
        sender.sendMessage(formatResponse(response));
    }

    private void handleSize(CommandSender sender, String[] args) {
        if (args.length < 2 || !SIZES.contains(args[1])) {
            sender.sendMessage(ChatColor.RED + "Uso: /tiktokwall size <32|48|64|128>");
            return;
        }

        int size = Integer.parseInt(args[1]);
        settings.setDefaultSize(size);
        sender.sendMessage(ChatColor.GREEN + "Tamanho padrao definido para " + size + "x" + size + ".");
    }

    private void handleInfo(CommandSender sender) {
        sender.sendMessage(ChatColor.AQUA + "TikTokWall");
        sender.sendMessage(ChatColor.GRAY + "World: " + ChatColor.WHITE + settings.getWorldName());
        sender.sendMessage(ChatColor.GRAY + "Origin: " + ChatColor.WHITE
            + settings.getOriginX() + ", " + settings.getOriginY() + ", " + settings.getOriginZ());
        sender.sendMessage(ChatColor.GRAY + "Facing: " + ChatColor.WHITE + settings.getFacing().name());
        sender.sendMessage(ChatColor.GRAY + "Default size: " + ChatColor.WHITE + settings.getDefaultSize());
        sender.sendMessage(ChatColor.GRAY + "Duration: " + ChatColor.WHITE + settings.getDurationSeconds() + "s");
        sender.sendMessage(ChatColor.GRAY + "Dithering: " + ChatColor.WHITE
            + (settings.isDithering() ? "on" : "off")
            + ", strength=" + settings.getDitheringStrength());
        sender.sendMessage(ChatColor.GRAY + "Animation: " + ChatColor.WHITE
            + (settings.isAnimationEnabled() ? "on" : "off")
            + ", rowsPerTick=" + settings.getAnimationRowsPerTick());
        sender.sendMessage(ChatColor.GRAY + "HTTP: " + ChatColor.WHITE + "127.0.0.1:" + settings.getHttpPort());
        sender.sendMessage(ChatColor.GRAY + "Auto setup: " + ChatColor.WHITE
            + (settings.isSetupAutoOnJoin() ? "on" : "off")
            + ", completed=" + settings.isSetupCompleted());
        sender.sendMessage(ChatColor.GRAY + "Status: " + ChatColor.WHITE + (renderer.isBusy() ? "busy" : "idle"));
    }

    private void handleFacing(CommandSender sender, String[] args) {
        if (args.length < 2 || !FACINGS.contains(args[1].toUpperCase())) {
            sender.sendMessage(ChatColor.RED + "Uso: /tiktokwall facing <NORTH|SOUTH|EAST|WEST>");
            return;
        }

        BlockFace facing = WallSettings.parseFacing(args[1]);
        settings.setFacing(facing);
        sender.sendMessage(ChatColor.GREEN + "Facing definido para " + facing.name() + ".");
    }

    private void handleDithering(CommandSender sender, String[] args) {
        if (args.length < 2 || !TOGGLES.contains(args[1].toLowerCase())) {
            sender.sendMessage(ChatColor.RED + "Uso: /tiktokwall dithering <on|off>");
            return;
        }

        boolean enabled = "on".equalsIgnoreCase(args[1]);
        settings.setDithering(enabled);
        sender.sendMessage(ChatColor.GREEN + "Dithering " + (enabled ? "ligado" : "desligado") + ".");
    }

    private void handleDitheringStrength(CommandSender sender, String[] args) {
        if (args.length < 2) {
            sender.sendMessage(ChatColor.RED + "Uso: /tiktokwall ditheringstrength <0-64>");
            return;
        }

        int strength;
        try {
            strength = Integer.parseInt(args[1]);
        } catch (NumberFormatException error) {
            sender.sendMessage(ChatColor.RED + "Uso: /tiktokwall ditheringstrength <0-64>");
            return;
        }

        if (strength < 0 || strength > 64) {
            sender.sendMessage(ChatColor.RED + "Use um valor entre 0 e 64.");
            return;
        }

        settings.setDitheringStrength(strength);
        sender.sendMessage(ChatColor.GREEN + "Forca do dithering definida para " + strength + ".");
    }

    private void handleAnimation(CommandSender sender, String[] args) {
        if (args.length < 2 || !TOGGLES.contains(args[1].toLowerCase())) {
            sender.sendMessage(ChatColor.RED + "Uso: /tiktokwall animation <on|off>");
            return;
        }

        boolean enabled = "on".equalsIgnoreCase(args[1]);
        settings.setAnimationEnabled(enabled);
        sender.sendMessage(ChatColor.GREEN + "Animacao " + (enabled ? "ligada" : "desligada") + ".");
    }

    private void handleAnimationSpeed(CommandSender sender, String[] args) {
        if (args.length < 2) {
            sender.sendMessage(ChatColor.RED + "Uso: /tiktokwall animationspeed <1-32>");
            return;
        }

        int rowsPerTick;
        try {
            rowsPerTick = Integer.parseInt(args[1]);
        } catch (NumberFormatException error) {
            sender.sendMessage(ChatColor.RED + "Uso: /tiktokwall animationspeed <1-32>");
            return;
        }

        if (rowsPerTick < 1 || rowsPerTick > 32) {
            sender.sendMessage(ChatColor.RED + "Use um valor entre 1 e 32.");
            return;
        }

        settings.setAnimationRowsPerTick(rowsPerTick);
        sender.sendMessage(ChatColor.GREEN + "Velocidade da animacao definida para " + rowsPerTick + " linhas por tick.");
    }

    private void sendUsage(CommandSender sender) {
        sender.sendMessage(ChatColor.YELLOW + "Uso: /tiktokwall <setup|setpos|clear|test|size|info|facing|dithering|ditheringstrength|animation|animationspeed>");
    }

    private String formatResponse(RenderResponse response) {
        ChatColor color = response.ok() ? ChatColor.GREEN : ChatColor.RED;
        return color + "[TikTokWall] " + response.message();
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        if (args.length == 1) {
            return filter(SUBCOMMANDS, args[0]);
        }

        if (args.length == 2 && "size".equalsIgnoreCase(args[0])) {
            return filter(SIZES, args[1]);
        }

        if (args.length == 2 && "facing".equalsIgnoreCase(args[0])) {
            return filter(FACINGS, args[1]);
        }

        if (args.length == 2 && "dithering".equalsIgnoreCase(args[0])) {
            return filter(TOGGLES, args[1]);
        }

        if (args.length == 2 && "ditheringstrength".equalsIgnoreCase(args[0])) {
            return filter(DITHERING_STRENGTHS, args[1]);
        }

        if (args.length == 2 && "animation".equalsIgnoreCase(args[0])) {
            return filter(TOGGLES, args[1]);
        }

        if (args.length == 2 && "animationspeed".equalsIgnoreCase(args[0])) {
            return filter(ANIMATION_SPEEDS, args[1]);
        }

        return List.of();
    }

    private List<String> filter(List<String> values, String prefix) {
        String normalized = prefix.toLowerCase();
        List<String> matches = new ArrayList<>();
        for (String value : values) {
            if (value.toLowerCase().startsWith(normalized)) {
                matches.add(value);
            }
        }
        return matches;
    }
}
