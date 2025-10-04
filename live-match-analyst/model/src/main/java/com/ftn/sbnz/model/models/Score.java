package com.ftn.sbnz.model.models;

public class Score {
    private Long team1Id;
    private Long team2Id;
    private int team1Score;
    private int team2Score;

    public Score() {}

    public Score(Long team1Id, Long team2Id, int team1Score, int team2Score) {
        this.team1Id = team1Id;
        this.team2Id = team2Id;
        this.team1Score = team1Score;
        this.team2Score = team2Score;
    }

    public Long getTeam1Id() { return team1Id; }
    public void setTeam1Id(Long team1Id) { this.team1Id = team1Id; }
    
    public Long getTeam2Id() { return team2Id; }
    public void setTeam2Id(Long team2Id) { this.team2Id = team2Id; }
    
    public int getTeam1Score() { return team1Score; }
    public void setTeam1Score(int team1Score) { this.team1Score = team1Score; }
    
    public int getTeam2Score() { return team2Score; }
    public void setTeam2Score(int team2Score) { this.team2Score = team2Score; }

    @Override
    public String toString() {
        return "Score{" +
                "team1Id=" + team1Id +
                ", team2Id=" + team2Id +
                ", team1Score=" + team1Score +
                ", team2Score=" + team2Score +
                '}';
    }
}