package com.ftn.sbnz.model.models;

public class CommentaryLine {
    public enum Importance { LOW, MEDIUM, HIGH, CRITICAL }
    public enum Type { PLAY_BY_PLAY, ANALYSIS, STATISTIC, HIGHLIGHT }

    private String text;
    private Importance importance;
    private Type type;

    public CommentaryLine() {}
    public CommentaryLine(String text, Importance importance, Type type) {
        this.text = text;
        this.importance = importance;
        this.type = type;
    }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public Importance getImportance() { return importance; }
    public void setImportance(Importance importance) { this.importance = importance; }
    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
}