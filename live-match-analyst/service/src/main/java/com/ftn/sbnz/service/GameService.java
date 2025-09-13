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

    public GameService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    public List<CommentaryLine> processEvents(List<GameEvent> events, List<Player> players, List<Team> teams, List<PlayerStats> stats) {
        KieSession kieSession = kieContainer.newKieSession("basicKsession");
        for (Player player : players) kieSession.insert(player);
        for (Team team : teams) kieSession.insert(team);
        for (PlayerStats stat : stats) kieSession.insert(stat);

        List<CommentaryLine> allComments = new ArrayList<>();
        for (GameEvent event : events) {
            kieSession.insert(event);
            kieSession.fireAllRules();

            List<CommentaryLine> comments = new ArrayList<>();
            for (Object obj : kieSession.getObjects()) {
                if (obj instanceof CommentaryLine) {
                    comments.add((CommentaryLine) obj);
                }
            }
            allComments.addAll(comments);

            for (CommentaryLine cl : comments) {
                kieSession.delete(kieSession.getFactHandle(cl));
            }
        }
        kieSession.dispose();
        return allComments;
    }

}
