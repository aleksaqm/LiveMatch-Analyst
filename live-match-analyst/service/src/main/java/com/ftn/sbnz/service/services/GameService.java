package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.events.GameEvent;
import com.ftn.sbnz.model.models.*;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class GameService {

    private final KieContainer kieContainer;
    private KieSession kieSession;

    public GameService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    public void startGame(List<Player> players, List<Team> teams, List<PlayerStats> stats) {
        this.kieSession = kieContainer.newKieSession("basicKsession");
        for (Player player : players) this.kieSession.insert(player);
        for (Team team : teams) this.kieSession.insert(team);
        for (PlayerStats stat : stats) this.kieSession.insert(stat);
    }

    public List<CommentaryLine> processSingleEvent(GameEvent event) {
        try{
            if (event.getTimestamp() == 0) {
                event.setTimestamp(System.currentTimeMillis());
            }
            
            this.kieSession.insert(event);
            
            for (FactHandle handle : kieSession.getFactHandles()) {
                Object obj = kieSession.getObject(handle);
            }
            
            int rulesFired = this.kieSession.fireAllRules();
        }catch (Exception e){
            e.printStackTrace();
            return new ArrayList<>();
        }

        List<CommentaryLine> comments = new ArrayList<>();
        List<FactHandle> commentHandlesToDelete = new ArrayList<>();

        for (FactHandle handle : kieSession.getFactHandles()) {
            Object obj = kieSession.getObject(handle);
            if (obj instanceof CommentaryLine) {
                comments.add((CommentaryLine) obj);
                commentHandlesToDelete.add(handle);
            }
        }

        for (FactHandle handle : commentHandlesToDelete) {
            kieSession.delete(handle);
        }

//        for (FactHandle handle : kieSession.getFactHandles()) {
//            Object obj = kieSession.getObject(handle);
//            if (obj instanceof GameEvent) {
//                kieSession.delete(handle);
//            }
//        }
        return comments;
    }

    public String endgame(){
        try {
            this.kieSession.dispose();
            return "Ended game successfully";
        }catch (Exception e){
            return "Game didn't start";
        }
    }
}
