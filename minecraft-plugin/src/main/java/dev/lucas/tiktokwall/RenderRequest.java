package dev.lucas.tiktokwall;

public class RenderRequest {
    private String username;
    private String nickname;
    private String eventType;
    private String eventLabel;
    private String imageBase64;
    private int size;
    private int durationSeconds;
    private Boolean clearAfter;

    public String username() {
        return username == null || username.isBlank() ? "unknown" : username;
    }

    public String nickname() {
        return nickname == null || nickname.isBlank() ? username() : nickname;
    }

    public String eventType() {
        return eventType == null || eventType.isBlank() ? "gift" : eventType.trim().toLowerCase();
    }

    public String eventLabel() {
        if (eventLabel != null && !eventLabel.isBlank()) {
            return eventLabel.trim();
        }

        return switch (eventType()) {
            case "like" -> "curtiu a live";
            case "test" -> "renderizou um teste";
            case "local-test" -> "renderizou uma imagem de teste";
            default -> "enviou uma rosa \uD83C\uDF39";
        };
    }

    public String imageBase64() {
        return imageBase64 == null ? "" : imageBase64;
    }

    public int size(int fallback) {
        return WallSettings.normalizeSize(size > 0 ? size : fallback);
    }

    public int durationSeconds(int fallback) {
        return durationSeconds > 0 ? durationSeconds : fallback;
    }

    public boolean clearAfter() {
        return clearAfter == null || clearAfter;
    }
}
