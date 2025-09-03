package se.stegroo.backend.dto.af;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO för taxonomi från Arbetsförmedlingens API
 */
public class AfTaxonomy {
    
    @JsonProperty("concept_id")
    private String conceptId;
    
    private String label;
    
    @JsonProperty("legacy_ams_taxonomy_id")
    private String legacyAmsTaxonomyId;
    
    // Getters and Setters
    public String getConceptId() { return conceptId; }
    public void setConceptId(String conceptId) { this.conceptId = conceptId; }
    
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    
    public String getLegacyAmsTaxonomyId() { return legacyAmsTaxonomyId; }
    public void setLegacyAmsTaxonomyId(String legacyAmsTaxonomyId) { this.legacyAmsTaxonomyId = legacyAmsTaxonomyId; }
}
