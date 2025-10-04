package com.ftn.sbnz.model.dto;

import java.util.Map;

public class RuleTemplateDto {
    private String templateName;
    private Map<String, Object> parameters;
    private String templateType;  // ASSIST_STREAK, SCORING_RUN, DEFENSIVE_SEQUENCE, CUSTOM
    
    public RuleTemplateDto() {}
    
    public RuleTemplateDto(String templateName, Map<String, Object> parameters, String templateType) {
        this.templateName = templateName;
        this.parameters = parameters;
        this.templateType = templateType;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }

    public void setParameters(Map<String, Object> parameters) {
        this.parameters = parameters;
    }

    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    @Override
    public String toString() {
        return "RuleTemplateDto{" +
                "templateName='" + templateName + '\'' +
                ", parameters=" + parameters +
                ", templateType='" + templateType + '\'' +
                '}';
    }
}