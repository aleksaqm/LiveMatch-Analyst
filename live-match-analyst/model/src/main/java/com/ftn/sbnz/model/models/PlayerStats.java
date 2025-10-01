package com.ftn.sbnz.model.models;

public class PlayerStats {
    private Long playerId;
    private Long teamId;
    private int points = 0;
    private int assists = 0;
    private int rebounds = 0;
    private int steals = 0;
    private int blocks = 0;
    private int turnovers = 0;
    private int fieldGoalsMade = 0;
    private int fieldGoals = 0;
    private int fouls = 0;
    private int freeThrowsMade = 0;
    private int freeThrowAttempted = 0;
    private int threePointersMade = 0;

    public PlayerStats() {}
    public PlayerStats(Long playerId, Long teamId, int points, int assists, int threePointersMade) {
        this.playerId = playerId;
        this.teamId = teamId;
        this.points = points;
        this.assists = assists;
        this.threePointersMade = threePointersMade;
    }
    public PlayerStats(Long playerId, Long teamId) {
        this.playerId = playerId;
        this.teamId = teamId;
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
    public int getFreeThrowsMade() { return freeThrowsMade; }
    public void setFreeThrowsMade(int freeThrowsMade) {this.freeThrowsMade = freeThrowsMade; }
    public int getFreeThrowAttempted() { return freeThrowAttempted; }
    public void setFreeThrowAttempted(int freeThrowAttempted) { this.freeThrowAttempted = freeThrowAttempted; }
    public int getRebounds() { return rebounds; }
    public void setRebounds(int rebounds) { this.rebounds = rebounds; }
    public int getSteals() { return steals; }
    public void setSteals(int steals) { this.steals = steals; }
    public int getBlocks() { return blocks; }
    public void setBlocks(int blocks) { this.blocks = blocks; }
    public int getTurnovers() { return turnovers; }
    public void setTurnovers(int turnovers) { this.turnovers = turnovers; }
    public int getFieldGoalsMade() { return fieldGoalsMade; }
    public void setFieldGoalsMade(int fieldGoalsMade) { this.fieldGoalsMade = fieldGoalsMade; }
    public int getFieldGoals() { return fieldGoals; }
    public void setFieldGoals(int fieldGoals) { this.fieldGoals = fieldGoals; }
    public int getFouls() { return fouls; }
    public void setFouls(int fouls) { this.fouls = fouls; }
}