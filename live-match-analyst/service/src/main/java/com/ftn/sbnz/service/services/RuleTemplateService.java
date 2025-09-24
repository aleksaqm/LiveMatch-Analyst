package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.dto.AssistStreakByIdTemplateDto;
import com.ftn.sbnz.model.dto.ScoringStreakTemplateDto;
import com.ftn.sbnz.model.dto.RuleTemplateDto;
import org.drools.template.ObjectDataCompiler;
import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.KieRepository;
import org.kie.api.builder.Message;
import org.kie.api.io.Resource;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;

@Service
public class RuleTemplateService {
    
    private final KieServices kieServices;
    private final Map<String, String> templateCache;
    private KieContainer kieContainer;
    private int ruleCounter = 0;
    
    public RuleTemplateService() {
        this.kieServices = KieServices.Factory.get();
        this.templateCache = new HashMap<>();
        loadTemplates();
    }
    
    private void loadTemplates() {
        try {
            templateCache.put("assist-streak-by-id", loadTemplateFromResource("/templates/assist-streak-by-id.drt"));
            templateCache.put("scoring-streak", loadTemplateFromResource("/templates/scoring-streak.drt"));
            System.out.println("All templates loaded successfully. Available templates: " + templateCache.keySet());
        } catch (Exception e) {
            System.err.println("Failed to load rule templates: " + e.getMessage());
            throw new RuntimeException("Failed to load rule templates", e);
        }
    }
    
    private String mapTemplateNameToKey(String templateName) {
        switch (templateName.toLowerCase()) {
            case "assist-streak-by-id":
                return "assist-streak-by-id";
            case "scoring-streak":
                return "scoring-streak";
            default:
                if (templateCache.containsKey(templateName)) {
                    return templateName;
                }
                return templateName; // Return original if no mapping found
        }
    }
    
    private String loadTemplateFromResource(String resourcePath) throws Exception {
        ClassPathResource resource = new ClassPathResource(resourcePath);
        
        if (!resource.exists()) {
            throw new Exception("Template resource not found: " + resourcePath);
        }
        
        try (InputStream inputStream = resource.getInputStream()) {
            String content = new String(inputStream.readAllBytes());
            System.out.println("Successfully loaded template from: " + resourcePath + " (length: " + content.length() + " characters)");
            return content;
        } catch (Exception e) {
            System.err.println("Error reading template from: " + resourcePath + " - " + e.getMessage());
            throw e;
        }
    }
    
    public String generateRuleFromTemplate(String templateName, Object templateData) {
        try {
            String templateKey = mapTemplateNameToKey(templateName);

            String templateContent = templateCache.get(templateKey);
            if (templateContent == null) {
                throw new IllegalArgumentException("Template not found: " + templateName + 
                    " (mapped to: " + templateKey + "). Available templates: " + templateCache.keySet());
            }
            
            List<Map<String, Object>> templateDataList = new ArrayList<>();
            Map<String, Object> dataMap = convertObjectToMap(templateData);
            dataMap.put("rowNumber", ++ruleCounter);
            templateDataList.add(dataMap);
            
            // generisanje DRL koda iz template-a
            ObjectDataCompiler compiler = new ObjectDataCompiler();
            InputStream templateStream = new ByteArrayInputStream(templateContent.getBytes());
            String drlContent = compiler.compile(templateDataList, templateStream);
            return drlContent;
            
        } catch (Exception e) {
            System.err.println("ERROR in generateRuleFromTemplate:");
            System.err.println("Error message: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate rule from template: " + e.getMessage(), e);
        }
    }
    
    private Map<String, Object> convertObjectToMap(Object obj) {
        Map<String, Object> result = new HashMap<>();
        
        if (obj instanceof AssistStreakByIdTemplateDto) {
            AssistStreakByIdTemplateDto dto = (AssistStreakByIdTemplateDto) obj;
            result.put("playerId", dto.getPlayerId());
            result.put("assistCount", dto.getAssistCount());
            result.put("timeWindowMinutes", dto.getTimeWindowMinutes());
            result.put("commentText", dto.getCommentText());
            result.put("importance", dto.getImportance());
        } else if (obj instanceof ScoringStreakTemplateDto) {
            ScoringStreakTemplateDto dto = (ScoringStreakTemplateDto) obj;
            result.put("playerId", dto.getPlayerId());
            result.put("shotCount", dto.getShotCount());
            result.put("timeWindowMinutes", dto.getTimeWindowMinutes());
            result.put("commentText", dto.getCommentText());
            result.put("importance", dto.getImportance());
        } else if (obj instanceof RuleTemplateDto) {
            RuleTemplateDto dto = (RuleTemplateDto) obj;
            result.putAll(dto.getParameters());
        } else if (obj instanceof Map) {
            result.putAll((Map<String, Object>) obj);
        } else {
            result.put("data", obj);
        }
        System.out.println("Final result map: " + result);
        return result;
    }


    public KieSession createKieSessionWithMultipleRules(List<String> templateRules) {
        try {
            KieFileSystem kieFileSystem = kieServices.newKieFileSystem();

            for (int i = 0; i < templateRules.size(); i++) {
                String ruleFileName = "src/main/resources/template-rules/rule_" + i + ".drl";
                kieFileSystem.write(ruleFileName, templateRules.get(i));
            }

            // Add kmodule.xml for CEP support
            String kmoduleXml =
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<kmodule xmlns=\"http://jboss.org/kie/6.0.0/kmodule\">\n" +
                "    <kbase name=\"templateKbase\" eventProcessingMode=\"stream\" equalsBehavior=\"equality\">\n" +
                "        <ksession name=\"templateKsession\" type=\"stateful\" clockType=\"realtime\"/>\n" +
                "    </kbase>\n" +
                "</kmodule>";

            kieFileSystem.writeKModuleXML(kmoduleXml);

            KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
            kieBuilder.buildAll();

            if (kieBuilder.getResults().hasMessages(Message.Level.ERROR)) {
                throw new RuntimeException("Template rules compilation errors: " +
                                         kieBuilder.getResults().getMessages());
            }

            KieContainer tempContainer = kieServices.newKieContainer(kieBuilder.getKieModule().getReleaseId());
            return tempContainer.newKieSession("templateKsession");

        } catch (Exception e) {
            throw new RuntimeException("Failed to create KieSession with multiple template rules: " + e.getMessage(), e);
        }
    }

}