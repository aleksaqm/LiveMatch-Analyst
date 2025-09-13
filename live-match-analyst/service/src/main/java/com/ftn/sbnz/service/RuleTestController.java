package com.ftn.sbnz.service;

import com.ftn.sbnz.model.events.GameEvent;
import com.ftn.sbnz.model.models.*;
import com.ftn.sbnz.service.GameService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/rules")
public class RuleTestController {

    private final GameService ruleEngineService;

    public RuleTestController(GameService ruleEngineService) {
        this.ruleEngineService = ruleEngineService;
    }

    @GetMapping("/test")
    public List<CommentaryLine> testRules() {
        // Test data
        Team teamA = new Team(1L, "Crvena Zvezda");
        Team teamB = new Team(2L, "Partizan");
        Player player1 = new Player(10L, "Jovan Jovanovic", 1L);
        Player player2 = new Player(20L, "Marko Markovic", 2L);

        PlayerStats stats1 = new PlayerStats(10L, 1L, 18, 2, 4); // 6 trojki
        PlayerStats stats2 = new PlayerStats(20L, 2L, 5, 1, 0);

        GameEvent event1 = new GameEvent(LocalDateTime.now(), 10L, 1L, GameEvent.EventType.SHOT_MADE, Map.of("points", 3));
        GameEvent event2 = new GameEvent(LocalDateTime.now(), 10L, 1L, GameEvent.EventType.SHOT_MADE, Map.of("points", 3));
        GameEvent event3 = new GameEvent(LocalDateTime.now(), 10L, 1L, GameEvent.EventType.SHOT_MADE, Map.of("points", 3));
        GameEvent event4 = new GameEvent(LocalDateTime.now(), 10L, 1L, GameEvent.EventType.SHOT_MADE, Map.of("points", 3));
        GameEvent event5 = new GameEvent(LocalDateTime.now(), 20L, 2L, GameEvent.EventType.TURNOVER, Map.of());

        List<GameEvent> events = Arrays.asList(event1, event2, event3,event4,event5);
        List<Player> players = Arrays.asList(player1, player2);
        List<Team> teams = Arrays.asList(teamA, teamB);
        List<PlayerStats> stats = Arrays.asList(stats1, stats2);

        return ruleEngineService.processEvents(events, players, teams, stats);
    }
}