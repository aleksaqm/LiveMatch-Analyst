package com.ftn.sbnz.service;

import com.ftn.sbnz.model.events.GameEvent;
import com.ftn.sbnz.model.models.*;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class GameService {

    private final KieContainer kieContainer;

    // In-memory podaci
    private List<Player> players = new ArrayList<>();
    private List<Team> teams = new ArrayList<>();
    private List<PlayerStats> stats = new ArrayList<>();

    public GameService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    public void startGame(List<Player> players, List<Team> teams, List<PlayerStats> stats) {
        this.players = new ArrayList<>(players);
        this.teams = new ArrayList<>(teams);
        this.stats = new ArrayList<>(stats);
    }

    public List<CommentaryLine> processSingleEvent(GameEvent event) {
        KieSession kieSession = kieContainer.newKieSession("basicKsession");
        for (Player player : players) kieSession.insert(player);
        for (Team team : teams) kieSession.insert(team);
        for (PlayerStats stat : stats) kieSession.insert(stat);

        kieSession.insert(event);
        kieSession.fireAllRules();

        List<CommentaryLine> comments = new ArrayList<>();
        for (Object obj : kieSession.getObjects()) {
            if (obj instanceof CommentaryLine) {
                comments.add((CommentaryLine) obj);
            }
        }
        kieSession.dispose();
        return comments;
    }
}
