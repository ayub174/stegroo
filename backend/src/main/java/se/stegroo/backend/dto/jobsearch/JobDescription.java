package se.stegroo.backend.dto.jobsearch;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Jobbeskrivning från JobSearch API
 */
public class JobDescription {
    
    @JsonProperty("text")
    private String text;
    
    @JsonProperty("text_formatted")
    private String textFormatted;
    
    @JsonProperty("company_information")
    private String companyInformation;
    
    @JsonProperty("needs")
    private String needs;
    
    @JsonProperty("requirements")
    private String requirements;
    
    @JsonProperty("conditions")
    private String conditions;

    // Getters and setters
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
