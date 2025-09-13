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

    private final GameService gameService;

    public RuleTestController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/startgame")
    public void startGame() {
        Team teamA = new Team(1L, "Crvena Zvezda");
        Team teamB = new Team(2L, "Partizan");
        Player player1 = new Player(10L, "Jovan Jovanovic", 1L);
        Player player2 = new Player(20L, "Marko Markovic", 2L);

        PlayerStats stats1 = new PlayerStats(10L, 1L, 18, 2, 4);
        PlayerStats stats2 = new PlayerStats(20L, 2L, 5, 1, 0);

        gameService.startGame(
                Arrays.asList(player1, player2),
                Arrays.asList(teamA, teamB),
                Arrays.asList(stats1, stats2)
        );
    }

    @PostMapping("/event")
    public List<CommentaryLine> processEvent(@RequestBody GameEvent event) {
        return gameService.processSingleEvent(event);
    }
}