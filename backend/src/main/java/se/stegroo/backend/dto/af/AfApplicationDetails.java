package se.stegroo.backend.dto.af;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO för ansökningsdetaljer från Arbetsförmedlingens API
 */
public class AfApplicationDetails {
    
    private String information;
    
    private String reference;
    
    private String email;
    
    @JsonProperty("via_af")
    private Boolean viaAf;
    
    private String url;
    
    private String other;
    
    // Getters and Setters
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
