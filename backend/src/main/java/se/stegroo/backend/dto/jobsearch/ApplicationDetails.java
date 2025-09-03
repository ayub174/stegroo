package se.stegroo.backend.dto.jobsearch;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Ansökningsdetaljer från JobSearch API
 */
public class ApplicationDetails {
    
    @JsonProperty("information")
    private String information;
    
    @JsonProperty("reference")
    private String reference;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("via_af")
    private Boolean viaAf;
    
    @JsonProperty("url")
    private String url;
    
    @JsonProperty("other")
    private String other;

    // Getters and setters
    public String getInformation() { return information; }
    public void setInformation(String information) { this.information = information; }
    
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Boolean getViaAf() { return viaAf; }
    public void setViaAf(Boolean viaAf) { this.viaAf = viaAf; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public String getOther() { return other; }
    public void setOther(String other) { this.other = other; }
}
