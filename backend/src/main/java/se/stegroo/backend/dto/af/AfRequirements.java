package se.stegroo.backend.dto.af;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * DTO för krav från Arbetsförmedlingens API
 */
public class AfRequirements {
    
    private List<AfTaxonomy> skills;
    
    private List<AfTaxonomy> languages;
    
    @JsonProperty("work_experiences")
    private List<AfWorkExperience> workExperiences;
    
    private List<AfTaxonomy> education;
    
    @JsonProperty("education_level")
    private List<AfTaxonomy> educationLevel;
    
    // Getters and Setters
    public List<AfTaxonomy> getSkills() { return skills; }
    public void setSkills(List<AfTaxonomy> skills) { this.skills = skills; }
    
    public List<AfTaxonomy> getLanguages() { return languages; }
    public void setLanguages(List<AfTaxonomy> languages) { this.languages = languages; }
    
    public List<AfWorkExperience> getWorkExperiences() { return workExperiences; }
    public void setWorkExperiences(List<AfWorkExperience> workExperiences) { this.workExperiences = workExperiences; }
    
    public List<AfTaxonomy> getEducation() { return education; }
    public void setEducation(List<AfTaxonomy> education) { this.education = education; }
    
    public List<AfTaxonomy> getEducationLevel() { return educationLevel; }
    public void setEducationLevel(List<AfTaxonomy> educationLevel) { this.educationLevel = educationLevel; }
}
