package dev.lucas.tiktokwall;

public record RenderResponse(boolean ok, boolean busy, String message) {
    public static RenderResponse ok(String message) {
        return new RenderResponse(true, false, message);
    }

    public static RenderResponse busyResponse() {
        return new RenderResponse(false, true, "wall is busy");
    }

    public static RenderResponse error(String message) {
        return new RenderResponse(false, false, message);
    }
}
