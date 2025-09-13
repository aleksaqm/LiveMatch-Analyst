package com.ftn.sbnz.model.events;

import org.kie.api.definition.type.Expires;
import org.kie.api.definition.type.Role;

import java.time.LocalDateTime;
import java.util.Map;

@Role(Role.Type.EVENT)
public class GameEvent {
    public enum EventType {
        SHOT_MADE, SHOT_MISSED, REBOUND, ASSIST, STEAL, BLOCK, TURNOVER, FOUL
    }

    private LocalDateTime timestamp;
    private Long playerId;
    private Long teamId;
    private EventType eventType;
    private Map<String, Object> details;

    public GameEvent() {}
    public GameEvent(LocalDateTime timestamp, Long playerId, Long teamId, EventType eventType, Map<String, Object> details) {
        this.timestamp = timestamp;
        this.playerId = playerId;
        this.teamId = teamId;
        this.eventType = eventType;
        this.details = details;
    }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Long getPlayerId() { return playerId; }
    public void setPlayerId(Long playerId) { this.playerId = playerId; }
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }
    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}