package com.ftn.sbnz.model.models;

public class PlayerStats {
    private Long playerId;
    private Long teamId;
    private int points;
    private int assists;
    private int threePointersMade;

    public PlayerStats() {}
    public PlayerStats(Long playerId, Long teamId, int points, int assists, int threePointersMade) {
        this.playerId = playerId;
        this.teamId = teamId;
        this.points = points;
        this.assists = assists;
        this.threePointersMade = threePointersMade;
    }
    public Long getPlayerId() { return playerId; }
    public void setPlayerId(Long playerId) { this.playerId = playerId; }
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }
    public int getAssists() { return assists; }
    public void setAssists(int assists) { this.assists = assists; }
    public int getThreePointersMade() { return threePointersMade; }
    public void setThreePointersMade(int threePointersMade) { this.threePointersMade = threePointersMade; }
}