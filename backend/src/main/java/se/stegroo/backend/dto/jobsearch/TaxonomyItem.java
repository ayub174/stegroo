package se.stegroo.backend.dto.jobsearch;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Taxonomi-objekt från JobSearch API
 */
public class TaxonomyItem {
    
    @JsonProperty("concept_id")
    private String conceptId;
    
    @JsonProperty("label")
    private String label;
    
    @JsonProperty("legacy_ams_taxonomy_id")
    private String legacyAmsTaxonomyId;

    // Getters and setters
    public String getConceptId() { return conceptId; }
    public void setConceptId(String conceptId) { this.conceptId = conceptId; }
    
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    
    public String getLegacyAmsTaxonomyId() { return legacyAmsTaxonomyId; }
    public void setLegacyAmsTaxonomyId(String legacyAmsTaxonomyId) { this.legacyAmsTaxonomyId = legacyAmsTaxonomyId; }
}
