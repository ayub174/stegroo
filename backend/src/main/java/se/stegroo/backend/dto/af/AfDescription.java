package se.stegroo.backend.dto.af;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO för jobbeskrivning från Arbetsförmedlingens API
 */
public class AfDescription {
    
    private String text;
    
    @JsonProperty("text_formatted")
    private String textFormatted;
    
    @JsonProperty("company_information")
    private String companyInformation;
    
    private String needs;
    
    private String requirements;
    
    private String conditions;
    
    // Getters and Setters
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    
    public String getTextFormatted() { return textFormatted; }
    public void setTextFormatted(String textFormatted) { this.textFormatted = textFormatted; }
    
    public String getCompanyInformation() { return companyInformation; }
    public void setCompanyInformation(String companyInformation) { this.companyInformation = companyInformation; }
    
    public String getNeeds() { return needs; }
    public void setNeeds(String needs) { this.needs = needs; }
    
    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }
    
    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }
}
