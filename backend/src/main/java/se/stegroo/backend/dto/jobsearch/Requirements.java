package se.stegroo.backend.dto.jobsearch;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Krav från JobSearch API
 */
public class Requirements {
    
    @JsonProperty("skills")
    private List<WeightedTaxonomyItem> skills;
    
    @JsonProperty("languages")
    private List<WeightedTaxonomyItem> languages;
    
    @JsonProperty("work_experiences")
    private List<WeightedTaxonomyItem> workExperiences;
    
    @JsonProperty("education")
    private List<WeightedTaxonomyItem> education;
    
    @JsonProperty("education_level")
    private List<WeightedTaxonomyItem> educationLevel;

    // Getters and setters
    public List<WeightedTaxonomyItem> getSkills() { return skills; }
    public void setSkills(List<WeightedTaxonomyItem> skills) { this.skills = skills; }
    
    public List<WeightedTaxonomyItem> getLanguages() { return languages; }
    public void setLanguages(List<WeightedTaxonomyItem> languages) { this.languages = languages; }
    
    public List<WeightedTaxonomyItem> getWorkExperiences() { return workExperiences; }
    public void setWorkExperiences(List<WeightedTaxonomyItem> workExperiences) { this.workExperiences = workExperiences; }
    
    public List<WeightedTaxonomyItem> getEducation() { return education; }
    public void setEducation(List<WeightedTaxonomyItem> education) { this.education = education; }
    
    public List<WeightedTaxonomyItem> getEducationLevel() { return educationLevel; }
    public void setEducationLevel(List<WeightedTaxonomyItem> educationLevel) { this.educationLevel = educationLevel; }
    
    public static class WeightedTaxonomyItem extends TaxonomyItem {
        @JsonProperty("weight")
        private Integer weight;
        
        public Integer getWeight() { return weight; }
        public void setWeight(Integer weight) { this.weight = weight; }
    }
}
