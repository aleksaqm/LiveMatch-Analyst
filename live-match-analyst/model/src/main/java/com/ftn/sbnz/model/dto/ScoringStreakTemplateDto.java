package com.ftn.sbnz.model.dto;

public class ScoringStreakTemplateDto {
    private Long playerId;
    private Integer shotCount;
    private Integer timeWindowMinutes;
    private String commentText;
    private String importance; // LOW, MEDIUM, HIGH, CRITICAL
    
    public ScoringStreakTemplateDto() {}
    
    public ScoringStreakTemplateDto(Long playerId, Integer shotCount, Integer timeWindowMinutes, String commentText, String importance) {
        this.playerId = playerId;
        this.shotCount = shotCount;
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

    public Integer getShotCount() {
        return shotCount;
    }

    public void setShotCount(Integer shotCount) {
        this.shotCount = shotCount;
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
        return "ScoringStreakTemplateDto{" +
                "playerId=" + playerId +
                ", shotCount=" + shotCount +
                ", timeWindowMinutes=" + timeWindowMinutes +
                ", commentText='" + commentText + '\'' +
                ", importance='" + importance + '\'' +
                '}';
    }
}