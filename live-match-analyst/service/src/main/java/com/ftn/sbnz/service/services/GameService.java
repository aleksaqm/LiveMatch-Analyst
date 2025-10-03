package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.events.GameEvent;
import com.ftn.sbnz.model.models.*;
import com.ftn.sbnz.model.dto.GameEventResponseDto;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@Service
public class GameService {

    private final KieContainer kieContainer;
    private final RuleTemplateService ruleTemplateService;
    private KieSession originalKieSession;  // For original DRL rules
    private KieSession templateKieSession;  // For template rules
    private Map<String, Object> activeTemplateRules;
    private List<String> registeredTemplateRules; // Store DRL content of registered templates

    @Autowired
    public GameService(KieContainer kieContainer, RuleTemplateService ruleTemplateService) {
        this.kieContainer = kieContainer;
        this.ruleTemplateService = ruleTemplateService;
        this.activeTemplateRules = new HashMap<>();
        this.registeredTemplateRules = new ArrayList<>();
    }

    public void startGame(List<Player> players, List<Team> teams) {
        // Initialize original session for DRL rules
        this.originalKieSession = kieContainer.newKieSession("basicKsession");
        for (Player player : players) {
            this.originalKieSession.insert(player);
            PlayerStats playerStats = new PlayerStats(player.getId(), player.getTeamId());
            this.originalKieSession.insert(playerStats);
        };
        for (Team team : teams) this.originalKieSession.insert(team);
//        for (PlayerStats stat : stats) this.originalKieSession.insert(stat);
        
        if (teams.size() >= 2) {
            Score gameScore = new Score(teams.get(0).getId(), teams.get(1).getId(), 0, 0);
            this.originalKieSession.insert(gameScore);
        }
        
        this.templateKieSession = null;
        
        System.out.println("Game started with original session. Template session will be created when needed.");
    }

    public GameEventResponseDto processSingleEvent(GameEvent event) {
        List<CommentaryLine> allComments = new ArrayList<>();
        
        try {
            if (event.getTimestamp() == 0) {
                event.setTimestamp(System.currentTimeMillis());
            }
            
            // Process event in original session (for DRL rules)
            if (originalKieSession != null) {
                List<CommentaryLine> originalComments = processEventInSession(originalKieSession, event, "Original");
                allComments.addAll(originalComments);
            }
            
            // Process event in template session (for template rules)
            if (templateKieSession != null) {
                List<CommentaryLine> templateComments = processEventInSession(templateKieSession, event, "Template");
                allComments.addAll(templateComments);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }

        Score currentScore = extractScoreFromDrools();
        
        return new GameEventResponseDto(allComments, currentScore);
    }
    
    private Score extractScoreFromDrools() {
        if (originalKieSession != null) {
            for (FactHandle handle : originalKieSession.getFactHandles()) {
                Object obj = originalKieSession.getObject(handle);
                if (obj instanceof Score) {
                    return (Score) obj;
                }
            }
        }
        return null; // Return null if no score found
    }
    
    private List<CommentaryLine> processEventInSession(KieSession session, GameEvent event, String sessionType) {
        List<CommentaryLine> comments = new ArrayList<>();

        try {
            GameEvent eventCopy = copyEvent(event);
            session.insert(eventCopy);

            session.fireAllRules();

            List<FactHandle> commentHandlesToDelete = new ArrayList<>();
            for (FactHandle handle : session.getFactHandles()) {
                Object obj = session.getObject(handle);
                if (obj instanceof CommentaryLine) {
                    comments.add((CommentaryLine) obj);
                    commentHandlesToDelete.add(handle);
                }
            }
            for (FactHandle handle : commentHandlesToDelete) {
                session.delete(handle);
            }
        } catch (Exception e) {
            System.err.println("Error processing event in " + sessionType + " session: " + e.getMessage());
            e.printStackTrace();
        }

        return comments;
    }
    
    private GameEvent copyEvent(GameEvent original) {
        GameEvent copy = new GameEvent();
        copy.setPlayerId(original.getPlayerId());
        copy.setTeamId(original.getTeamId());
        copy.setEventType(original.getEventType());
        copy.setTimestamp(original.getTimestamp());
        copy.setDetails(original.getDetails());
        copy.setProcessed(original.isProcessed());
        return copy;
    }

    public String endgame(){
        try {
            if (originalKieSession != null) {
                this.originalKieSession.dispose();
            }
            if (templateKieSession != null) {
                this.templateKieSession.dispose();
            }
            this.activeTemplateRules.clear();
            this.registeredTemplateRules.clear();
            return "Ended game successfully (both sessions disposed)";
        }catch (Exception e){
            return "Error ending game: " + e.getMessage();
        }
    }
    
    public String addTemplateRule(String templateName, Object templateData) {
        try {
            if (originalKieSession == null) {
                return "Game not started. Please start a game first.";
            }
            
            // generate rule key
            String ruleKey = templateName + "_" + System.currentTimeMillis();
            
            // store template data
            activeTemplateRules.put(ruleKey, templateData);
            
            // generate DRL content
            String drlContent = ruleTemplateService.generateRuleFromTemplate(templateName, templateData);
            registeredTemplateRules.add(drlContent);
            
            createTemplateSession();
            
            return "Template rule '" + ruleKey + "' registered successfully and is now active in separate session.";
            
        } catch (Exception e) {
            return "Failed to add template rule: " + e.getMessage();
        }
    }
    
    private void createTemplateSession() {
        try {
            if (templateKieSession != null) {
                templateKieSession.dispose();
            }
            templateKieSession = ruleTemplateService.createKieSessionWithMultipleRules(registeredTemplateRules);
            // Insert all players, teams, and stats into template session
            insertFactsIntoSession(templateKieSession);
            
            System.out.println("Template session created with " + registeredTemplateRules.size() + " rules");
        } catch (Exception e) {
            System.err.println("Error creating template session: " + e.getMessage());
            e.printStackTrace();
            templateKieSession = null;
        }
    }
    
    private void insertFactsIntoSession(KieSession session) {
        if (originalKieSession != null) {
            for (FactHandle handle : originalKieSession.getFactHandles()) {
                Object fact = originalKieSession.getObject(handle);
                if (fact instanceof Player || fact instanceof Team || fact instanceof PlayerStats || fact instanceof Score) {
                    session.insert(fact);
                }
            }
        }
    }


}
