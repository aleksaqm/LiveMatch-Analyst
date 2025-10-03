package com.ftn.sbnz.model.events;

import org.kie.api.definition.type.Expires;
import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;

@Role(Role.Type.EVENT)
@Timestamp("timestamp")
@Expires("3m")
public class GameEvent {
    public enum EventType {
        SHOT_MADE, SHOT_MISSED, REBOUND, ASSIST, STEAL, BLOCK, TURNOVER, FOUL, TIMEOUT
    }

    private long timestamp;
    private Long playerId;
    private Long teamId;
    private EventType eventType;
    private Map<String, Object> details;
    private boolean processed;

    public GameEvent() {}
    
    public GameEvent(LocalDateTime localDateTime, Long playerId, Long teamId, EventType eventType, Map<String, Object> details) {
        this.timestamp = localDateTime != null ? localDateTime.toEpochSecond(ZoneOffset.UTC) * 1000 : System.currentTimeMillis();
        this.playerId = playerId;
        this.teamId = teamId;
        this.eventType = eventType;
        this.details = details;
        this.processed = false;
    }
    
    public GameEvent(long timestamp, Long playerId, Long teamId, EventType eventType, Map<String, Object> details) {
        this.timestamp = timestamp;
        this.playerId = playerId;
        this.teamId = teamId;
        this.eventType = eventType;
        this.details = details;
    }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    
    public LocalDateTime getLocalDateTime() {
        return LocalDateTime.ofEpochSecond(timestamp / 1000, 0, ZoneOffset.UTC); 
    }

    public boolean isProcessed() { return processed; }

    public void setTimestamp(LocalDateTime localDateTime) {
        this.timestamp = localDateTime != null ? localDateTime.toEpochSecond(ZoneOffset.UTC) * 1000 : System.currentTimeMillis();
    }
    public Long getPlayerId() { return playerId; }
    public void setPlayerId(Long playerId) { this.playerId = playerId; }
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }
    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
    public void setProcessed(boolean processed) { this.processed = processed; }

    
    @Override
    public String toString() {
        return "GameEvent{" +
                "timestamp=" + timestamp +
                ", playerId=" + playerId +
                ", teamId=" + teamId +
                ", eventType=" + eventType +
                ", details=" + details +
                '}';
    }
}