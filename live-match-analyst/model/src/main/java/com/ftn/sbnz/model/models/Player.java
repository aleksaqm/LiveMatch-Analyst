package com.ftn.sbnz.model.models;

public class Player {
    private Long id;
    private String name;
    private Long teamId;

    public Player() {}
    public Player(Long id, String name, Long teamId) {
        this.id = id;
        this.name = name;
        this.teamId = teamId;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
}