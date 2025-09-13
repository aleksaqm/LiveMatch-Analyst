package com.ftn.sbnz.model.dto;

import com.ftn.sbnz.model.models.Player;
import com.ftn.sbnz.model.models.PlayerStats;
import com.ftn.sbnz.model.models.Team;

import java.util.List;

public class StartGameDto {
    public List<Player> players;
    public List<Team> teams;
    public List<PlayerStats> stats;
}
