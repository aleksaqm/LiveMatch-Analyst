package com.ftn.sbnz.model.dto;

public class AssistStreakByIdTemplateDto {
    private Long playerId;
    private Integer assistCount;
    private Integer timeWindowMinutes;
    private String commentText;
    private String importance; // LOW, MEDIUM, HIGH, CRITICAL
    
    public AssistStreakByIdTemplateDto() {}
    
    public AssistStreakByIdTemplateDto(Long playerId, Integer assistCount, Integer timeWindowMinutes, String commentText, String importance) {
        this.playerId = playerId;
        this.assistCount = assistCount;
        this.timeWindowMinutes = timeWindowMinutes;
        this.commentText = commentText;
        this.importance = importance;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public Integer getAssistCount() {
        return assistCount;
    }

    public void setAssistCount(Integer assistCount) {
        this.assistCount = assistCount;
    }
    
    // Alias method for compatibility
    public void setMinStreak(Integer minStreak) {
        this.assistCount = minStreak;
    }
    
    public Integer getMinStreak() {
        return this.assistCount;
    }

    public Integer getTimeWindowMinutes() {
        return timeWindowMinutes;
    }

    public void setTimeWindowMinutes(Integer timeWindowMinutes) {
        this.timeWindowMinutes = timeWindowMinutes;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public String getImportance() {
        return importance;
    }

    public void setImportance(String importance) {
        this.importance = importance;
    }

    @Override
    public String toString() {
        return "AssistStreakByIdTemplateDto{" +
                "playerId=" + playerId +
                ", assistCount=" + assistCount +
                ", timeWindowMinutes=" + timeWindowMinutes +
                ", commentText='" + commentText + '\'' +
                ", importance='" + importance + '\'' +
                '}';
    }
}