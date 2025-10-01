package com.ftn.sbnz.service.controller;

import com.ftn.sbnz.model.dto.AssistStreakByIdTemplateDto;
import com.ftn.sbnz.model.dto.ScoringStreakTemplateDto;
import com.ftn.sbnz.model.dto.RuleTemplateDto;
import com.ftn.sbnz.model.dto.StartGameDto;
import com.ftn.sbnz.model.events.GameEvent;
import com.ftn.sbnz.model.models.*;
import com.ftn.sbnz.service.services.GameService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/rules")
public class RuleTestController {

    private final GameService gameService;

    public RuleTestController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/startgame")
    public void startGame(@RequestBody StartGameDto startGameData) {
        gameService.startGame(
                startGameData.players,
                startGameData.teams
//                startGameData.stats
        );
    }

    @PostMapping("/event")
    public List<CommentaryLine> processEvent(@RequestBody GameEvent event) {
        return gameService.processSingleEvent(event);
    }

    @PostMapping("/endgame")
    public String endGame() {
        return gameService.endgame();
    }

    
    @PostMapping("/templates/register/assist-streak-by-id")
    public String registerAssistStreakByIdTemplate(@RequestBody AssistStreakByIdTemplateDto templateData) {
        return gameService.addTemplateRule("assist-streak-by-id", templateData);
    }
    
    @PostMapping("/templates/register/scoring-streak")
    public String registerScoringStreakTemplate(@RequestBody ScoringStreakTemplateDto templateData) {
        return gameService.addTemplateRule("scoring-streak", templateData);
    }
}